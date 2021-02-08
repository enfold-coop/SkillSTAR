import {
  NUM_CHALLENGING_ATTEMPTS_FOR_FOCUS,
  NUM_COMPLETE_ATTEMPTS_FOR_MASTERY,
  NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER,
  NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER,
  NUM_MIN_PROBE_SESSIONS,
  NUM_PROMPTED_ATTEMPTS_FOR_FOCUS,
} from '../constants/MasteryAlgorithm';
import { ChainData, SkillstarChain } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { MasteryInfo, MasteryInfoMap } from '../types/chain/MasteryLevel';
import {
  ChainStepPromptLevel,
  ChainStepPromptLevelMap,
  ChainStepPromptLevelMapItem,
  ChainStepStatus,
  StepAttempt,
  StepAttemptField,
  StepAttemptFieldName,
} from '../types/chain/StepAttempt';

/**
 * Holds the chain data and mastery info for each step in the chain data.
 * Also provides quick access to the current chain session, focus step, and
 * mastery state for each step in the current session.
 */
export class ChainMastery {
  promptHierarchy = Object.values(ChainStepPromptLevelMap).sort((a, b) => a.order - b.order);
  chainSteps: ChainStep[];
  chainData: ChainData;
  masteryInfoMap: MasteryInfoMap;
  draftSession: ChainSession;
  incompleteCount = 0;
  focusedChainStepIds: number[];
  unmasteredChainStepIds: number[];
  masteredChainStepIds: number[];
  unmasteredFocusedChainStepIds: number[];
  draftFocusStepAttempt?: StepAttempt;

  /**
   * Initializes all of the above class variables
   *
   * @param chainSteps: all of the chain steps
   * @param chainData: all of a participant's session history data
   */
  constructor(chainSteps: ChainStep[], chainData: ChainData) {
    this.chainSteps = chainSteps;
    this.chainData = new ChainData(chainData);
    this.masteryInfoMap = this.buildMasteryInfoMap();
    this.focusedChainStepIds = this.getFocusedChainStepIds();
    this.unmasteredChainStepIds = this.getUnmasteredChainStepIds();
    this.masteredChainStepIds = this.getMasteredChainStepIds();
    this.unmasteredFocusedChainStepIds = this.getUnmasteredFocusedChainStepIds();
    this.draftSession = this.buildNewDraftSession();
  }

  /**
   * Returns the last session in the chain data sessions array
   */
  get currentSession(): ChainSession {
    return this.chainData.lastSession;
  }

  /**
   * Returns array of focus step attempts for the given chain step.
   *
   * @param chainStepId: ID of the chain step
   */
  getFocusStepAttemptsForChainStep(chainStepId: number): StepAttempt[] {
    const stepAttempts = this.chainData.getAllStepAttemptsForChainStep(chainStepId);
    return stepAttempts.filter((stepAttempt) => stepAttempt.was_focus_step);
  }

  /**
   * Returns array of booleans indicating prior focus step completion
   *
   * @param chainStepId
   */
  getPreviousFocusStepAttempts(chainStepId: number): boolean[] {
    const focusStepAttempts = this.getFocusStepAttemptsForChainStep(chainStepId);
    return focusStepAttempts.map((stepAttempt) => {
      return !!(
        stepAttempt.status === ChainStepStatus.focus &&
        stepAttempt.completed &&
        this.promptLevelIsBetterThanTarget(stepAttempt.prompt_level, stepAttempt.target_prompt_level)
      );
    });
  }

  /**
   * Returns the second-to-last session in the chain data sessions array.
   * If there are fewer than 2 sessions, returns undefined.
   */
  get previousSession(): ChainSession | undefined {
    if (this.chainData.sessions.length > 1) {
      return this.chainData.sessions[this.chainData.sessions.length - 2];
    }
  }

  /**
   * Returns the last (by date) focus chain step id that was attempted.
   */
  get prevFocusStepChainStepId(): number | undefined {
    // Get the most recent unmastered focus step.
    if (this.unmasteredFocusedChainStepIds.length > 0) {
      // If there are any, return the last one.
      return this.unmasteredFocusedChainStepIds[this.unmasteredFocusedChainStepIds.length - 1];
    }
  }

  /**
   * Returns the chain step ID that should be focused on next, or undefined if all steps have been mastered.
   */
  get nextFocusChainStepId(): number | undefined {
    // Find the smallest unmastered chain step ID.
    if (this.unmasteredChainStepIds.length > 0) {
      return this.unmasteredChainStepIds[0];
    }

    console.log('All chain steps have been mastered!');
  }

  /**
   * Returns true if previous focus step was mastered. Otherwise, returns false.
   */
  get isPrevFocusMastered(): boolean {
    if (!this.previousFocusStep) {
      return false;
    }

    return this.masteredChainStepIds.includes(this.previousFocusStep.chain_step_id);
  }

  /**
   * Returns the ID of the first chain step that needs a booster in the next new draft session.
   * If no steps need a booster, returns undefined.
   */
  get nextBoosterChainStepId(): number | undefined {
    // Look at each chain step across all chain data sessions.
    // For each step, if there have been 3 incomplete training attempts in a row OR
    // 2 incomplete probe attempts in a row, return true.

    for (const chainStep of this.chainSteps) {
      const stepAttempts = this.chainData.getAllStepAttemptsForChainStep(chainStep.id);
      if (this.chainStepNeedsBooster(stepAttempts)) {
        return chainStep.id;
      }
    }
  }

  /**
   * If the previous session was a training or booster session, returns the step
   * that is marked as was_focus_step (assumes that only one step will be focus
   * step). Otherwise, returns undefined.
   */
  get previousFocusStep(): StepAttempt | undefined {
    if (this.previousSession) {
      return this.getFocusStepInSession(this.previousSession);
    }
    return undefined;
  }

  /**
   * If the last session in the chain data is a training or booster session,
   * returns the step that is marked as was_focus_step (assumes that only one
   * step will be focus step). Otherwise, returns undefined.
   */
  get currentFocusStep(): StepAttempt | undefined {
    if (this.currentSession) {
      return this.getFocusStepInSession(this.currentSession);
    }
    return undefined;
  }

  get hasHadTrainingSession(): boolean {
    for (const session of this.chainData.sessions) {
      for (const stepAttempt of session.step_attempts) {
        if (stepAttempt.session_type === ChainSessionType.training) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Returns a draft session with the given session type. If not provided, this method will decide which session type
   * to use. Depending on the state of the instance's chain data and mastery info, this may be:
   * - An empty probe session, if the user has no attempted sessions yet
   * - The next session the participant should be attempting, if there is one.
   * - An empty probe session, if there are none left to attempt (???)
   *
   * This will be a container for the not-yet-completed session that the user is currently inputting data for.
   * A draft session has not been saved to the database yet, so nothing in the session
   * will have IDs or backend-populated nested members (such as chain_step in the step_attempts).
   * The draft session will be stored in AsyncStorage until the user successfully completes
   * the session, submits the data, and connects to the internet.
   *
   * @param sessionType: Optional parameter to set the session type.
   */
  buildNewDraftSession(sessionType?: ChainSessionType): ChainSession {
    const newDraftSession: ChainSession = {
      date: new Date(),
      completed: false,
      step_attempts: [],
      session_type: sessionType,
    };
    let focusChainStepId: number | undefined = undefined;
    let boosterChainStepId: number | undefined = undefined;

    // If no session type is passed in as a parameter, decide what kind of session this should be.
    if (!sessionType) {
      // Should the draft session be...
      // ...a probe session?
      if (this.newDraftSessionShouldBeProbeSession()) {
        newDraftSession.session_type = ChainSessionType.probe;
      }

      // ...a booster?
      else if ((boosterChainStepId = this.nextBoosterChainStepId) !== undefined) {
        newDraftSession.session_type = ChainSessionType.booster;
      }

      // ...a training session?
      else {
        newDraftSession.session_type = ChainSessionType.training;
        focusChainStepId = this.nextFocusChainStepId;
      }
    } else {
      if (sessionType !== ChainSessionType.probe) {
        // Check if the session type needs to be a booster
        if ((boosterChainStepId = this.nextBoosterChainStepId) !== undefined) {
          newDraftSession.session_type = ChainSessionType.booster;
        } else {
          // It's a training session. Figure out which step we need to focus on.
          focusChainStepId = this.nextFocusChainStepId;
        }
      }
    }

    // Populate step attempts
    newDraftSession.step_attempts = this.chainSteps.map((chainStep) => {
      const masteryInfo = this.masteryInfoMap[chainStep.id];
      const stepStatus = masteryInfo ? masteryInfo.stepStatus : ChainStepStatus.not_yet_started;
      return {
        chain_step_id: chainStep.id,
        chain_step: chainStep,
        status: stepStatus,
        session_type: newDraftSession.session_type,
        date: new Date(),
      } as StepAttempt;
    });

    // For booster and training sessions, mark which chain step should be the focus and/or booster step, if applicable.
    if (
      newDraftSession.session_type === ChainSessionType.booster ||
      newDraftSession.session_type === ChainSessionType.training
    ) {
      let draftFocusStepIndex = -1;

      newDraftSession.step_attempts.forEach((stepAttempt, i) => {
        // Mark which chain step should be the focus step.
        if (focusChainStepId !== undefined) {
          newDraftSession.step_attempts[i].was_focus_step = stepAttempt.chain_step_id === focusChainStepId;
          if (focusChainStepId === stepAttempt.chain_step_id) {
            newDraftSession.step_attempts[i].status = ChainStepStatus.focus;
            draftFocusStepIndex = i;
            stepAttempt.status = ChainStepStatus.focus;
          }
        }

        // Mark which chain step should needs a booster.
        if (boosterChainStepId !== undefined) {
          if (boosterChainStepId === stepAttempt.chain_step_id) {
            newDraftSession.step_attempts[i].status = ChainStepStatus.booster_needed;
          }
        }
      });

      // Determine the target prompt level for the draft session focus step.
      if (focusChainStepId !== undefined && draftFocusStepIndex !== -1) {
        // Get all the step attempts across all sessions for the focus step.
        const masteryInfo = this.masteryInfoMap[focusChainStepId];
        const recentAttempts = this.getFocusStepAttemptsForChainStep(focusChainStepId).reverse();
        let numTargetLevelsMet = 0;
        let lastAttemptLevel: ChainStepPromptLevel | undefined = masteryInfo.promptLevel;

        // Get the most recent target prompt level
        for (const pastAttempt of recentAttempts) {
          if (pastAttempt.target_prompt_level) {
            lastAttemptLevel = pastAttempt.target_prompt_level;
            break;
          }
        }

        // Count most recent successful consecutive focus step attempts
        for (const pastAttempt of recentAttempts) {
          if (pastAttempt.was_focus_step && this.stepIsComplete(pastAttempt)) {
            numTargetLevelsMet++;
          } else {
            break;
          }
        }

        // If the last 3 attempts were completed at the target prompt level,
        // move on to the next prompt level.
        if (numTargetLevelsMet >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
          // Set the target prompt level for the focus step in the draft session
          if (lastAttemptLevel) {
            const nextLevel = this.getNextPromptLevel(lastAttemptLevel).key;
            newDraftSession.step_attempts[draftFocusStepIndex].target_prompt_level = nextLevel;
          }
        } else if (lastAttemptLevel) {
          newDraftSession.step_attempts[draftFocusStepIndex].target_prompt_level = lastAttemptLevel;
        }

        // If target prompt level for the training session is still undefined, set it to full physical.
        if (newDraftSession.step_attempts[draftFocusStepIndex].target_prompt_level === undefined) {
          newDraftSession.step_attempts[draftFocusStepIndex].target_prompt_level = ChainStepPromptLevel.full_physical;
        }

        // If this is a training session and target level hasn't been set yet,
        // set the target prompt level to the target prompt level from the last focus step.
        if (draftFocusStepIndex >= 0) {
          this.draftFocusStepAttempt = newDraftSession.step_attempts[draftFocusStepIndex];
          if (
            (newDraftSession.session_type === ChainSessionType.training ||
              newDraftSession.session_type === ChainSessionType.booster) &&
            !this.draftFocusStepAttempt.target_prompt_level
          ) {
            newDraftSession.step_attempts[draftFocusStepIndex].target_prompt_level = lastAttemptLevel;
          }
        }
      }
    }
    return newDraftSession;
  }

  /**
   * Returns true if the next new draft session should be a probe session
   */
  newDraftSessionShouldBeProbeSession(): boolean {
    if (this.chainData.sessions.length < NUM_MIN_PROBE_SESSIONS) {
      // The first 3-9 sessions should be probes.
      return true;
    }

    // There are at least 4 attempts since the last probe session.
    for (const masteryInfo of Object.values(this.masteryInfoMap)) {
      if (masteryInfo.numAttemptsSince.lastProbe !== -1) {
        return masteryInfo.numAttemptsSince.lastProbe >= 4;
      }
    }

    if (!this.hasHadTrainingSession) {
      // Have NO training sessions ever been run at all? Return false.
      return false;
    }

    // No probe sessions have ever been attempted. The next one should be a probe.
    return true;
  }

  /**
   * Given a prompt level, returns the next prompt level in the prompt hierarchy.
   * @param promptLvl: the previous prompt level
   */
  getNextPromptLevel(promptLvl: ChainStepPromptLevel): ChainStepPromptLevelMapItem {
    const currentIndex = this.promptHierarchy.findIndex((e) => e.key === promptLvl);
    const nextIndex = currentIndex > 1 ? currentIndex - 1 : 0; // 0 if prompt level is already 0 (none/independent)
    return this.promptHierarchy[nextIndex];
  }

  /**
   * Returns the date of the step attempt where numAttemptsSince was set to 0, if applicable. Otherwise, returns undefined.
   * @param stepAttempts
   * @param numAttemptsSince
   */
  getDateFor(stepAttempts: StepAttempt[], numAttemptsSince: number): Date | undefined {
    if (stepAttempts.length > 0 && numAttemptsSince >= 0) {
      const index = stepAttempts.length - numAttemptsSince - 1;
      if (index >= 0) {
        return stepAttempts[index].date;
      }
    }
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step was
   * introduced for the first time.
   * @param stepAttempts
   */
  numSinceFirstIntroduced(stepAttempts: StepAttempt[]): number {
    // Since the step attempts are sorted by date, the first item is when it was introduced.
    // So just subtract 1 from the total number of attempts.
    return stepAttempts.length - 1;
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step was
   * completed successfully for the first time.
   * @param stepAttempts
   */
  numSinceFirstCompleted(stepAttempts: StepAttempt[]): number {
    const numSteps = stepAttempts.length;
    for (let i = 0; i < numSteps; i++) {
      if (stepAttempts[i].completed) {
        return numSteps - (i + 1);
      }
    }

    return -1;
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step was
   * last completed successfully
   * @param stepAttempts
   */
  numSinceLastCompleted(stepAttempts: StepAttempt[]): number {
    let lastCompletedIndex = -1;

    if (!stepAttempts || stepAttempts.length === 0) {
      return -1;
    }

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.completed) {
        lastCompletedIndex = i;
      }
    });

    return stepAttempts.length - (lastCompletedIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step was
   * last completed successfully without challenging behavior
   * @param stepAttempts
   */
  numSinceLastCompletedWithoutChallenge(stepAttempts: StepAttempt[]): number {
    let lastCompletedIndex = -1;

    if (!stepAttempts || stepAttempts.length === 0) {
      return -1;
    }

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.completed && !stepAttempt.had_challenging_behavior) {
        lastCompletedIndex = i;
      }
    });

    return stepAttempts.length - (lastCompletedIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step was
   * last completed successfully without a prompt
   * @param stepAttempts
   */
  numSinceLastCompletedWithoutPrompt(stepAttempts: StepAttempt[]): number {
    let lastCompletedIndex = -1;

    if (!stepAttempts || stepAttempts.length === 0) {
      return -1;
    }

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.completed && !stepAttempt.was_prompted) {
        lastCompletedIndex = i;
      }
    });

    return stepAttempts.length - (lastCompletedIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step
   * last failed:
   * - Probe session step attempt incomplete (with or without prompting or challenging behavior) OR complete with prompting
   * - Training session incomplete OR complete with actual prompt level above target prompt level.
   * @param stepAttempts
   */
  numSinceLastFailed(stepAttempts: StepAttempt[]): number {
    let lastIncompleteIndex = -1;

    if (!stepAttempts || stepAttempts.length === 0) {
      return -1;
    }

    stepAttempts.forEach((stepAttempt, i) => {
      if (!this.stepIsComplete(stepAttempt)) {
        lastIncompleteIndex = i;
      }
    });

    return stepAttempts.length - (lastIncompleteIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the focus step
   * last failed
   * @param stepAttempts
   */
  numSinceFocusStepLastFailed(stepAttempts: StepAttempt[]): number {
    let numConsecutiveComplete = -1;

    if (!stepAttempts || stepAttempts.length === 0) {
      return -1;
    }

    let prevAttempt: StepAttempt;

    stepAttempts.forEach((thisAttempt) => {
      const isConsecutive =
        prevAttempt &&
        prevAttempt.was_focus_step &&
        prevAttempt.target_prompt_level === thisAttempt.target_prompt_level;

      // Count consecutive successful attempts.
      // Increment count if this attempt is...
      // - successful,
      // - a focus step, and
      // - consecutive with previous.
      if (this.stepIsComplete(thisAttempt) && thisAttempt.was_focus_step && isConsecutive) {
        numConsecutiveComplete++;
      }

      // Reset the number of successful attempts to 0 if...
      // - unsuccessful,
      // - not a focus step, or
      // - not consecutive with previous.
      else {
        numConsecutiveComplete = 0;
      }

      prevAttempt = thisAttempt;
    });

    return numConsecutiveComplete;
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the last probe session.
   * If no probe sessions have ever been completed, returns -1.
   *
   * @param stepAttempts
   */
  numSinceLastProbe(stepAttempts: StepAttempt[]): number {
    let lastProbeIndex = -1;

    if (!stepAttempts || stepAttempts.length === 0) {
      return -1;
    }

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.session_type === ChainSessionType.probe) {
        lastProbeIndex = i;
      }
    });

    return stepAttempts.length - (lastProbeIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the first time the
   * step was mastered. If the step has never been mastered, returns -1.
   *
   * @param stepAttempts
   */
  numSinceFirstMastered(stepAttempts: StepAttempt[]): number {
    const firstMasteredStep = this.stepFirstMastered(stepAttempts);

    if (firstMasteredStep !== undefined) {
      const stepIndex = stepAttempts.findIndex((s) => s === firstMasteredStep);
      return stepAttempts.length - (stepIndex + 1);
    } else {
      return -1;
    }
  }

  /**
   * Returns true if the given step was:
   * - a probe session AND
   * - completed with no prompting
   * @param stepAttempt
   */
  isProbeStepComplete(stepAttempt: StepAttempt): boolean {
    return !!(
      stepAttempt.session_type === ChainSessionType.probe &&
      stepAttempt.completed &&
      !stepAttempt.was_prompted
    );
  }

  /**
   * Returns true if the given step was:
   * - a training session AND
   * - the focus step AND
   * - completed AND
   * - at or better than the target prompt level
   * @param stepAttempt
   */
  isFocusStepComplete(stepAttempt: StepAttempt): boolean {
    return !!(
      stepAttempt.completed &&
      stepAttempt.session_type === ChainSessionType.training &&
      !!stepAttempt.was_focus_step &&
      this.promptLevelIsBetterThanTarget(stepAttempt.prompt_level, stepAttempt.target_prompt_level)
    );
  }

  /**
   * Returns true if the given step was:
   * - a training session AND
   * - the focus step AND
   * - completed AND
   * - with no prompting
   * @param stepAttempt
   */
  isFocusStepMastered(stepAttempt: StepAttempt): boolean {
    return !!(
      stepAttempt.completed &&
      stepAttempt.session_type === ChainSessionType.training &&
      !!stepAttempt.was_focus_step &&
      stepAttempt.prompt_level === ChainStepPromptLevel.none
    );
  }

  /**
   * Given a list of step attempts, returns the first step attempt where the step was
   * completed more than a certain number of attempts in a row, depending on the session type:
   * - 2 consecutive for probe sessions
   * - 3 consecutive for training sessions (where the chain step was the focus step)
   * @param stepAttempts
   */
  stepFirstMastered(stepAttempts: StepAttempt[]): StepAttempt | undefined {
    let numConsecutiveComplete = 0;

    for (const thisAttempt of stepAttempts) {
      if (this.isProbeStepComplete(thisAttempt) || this.isFocusStepMastered(thisAttempt)) {
        numConsecutiveComplete++;
      } else {
        numConsecutiveComplete = 0;
      }

      if (numConsecutiveComplete === NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
        return thisAttempt;
      }
    }
  }

  /**
   * Returns true if the given step meets one of the following criteria:
   * - For probe session, completed with no prompting or interfering challenging behavior
   * - For training session:
   *   - If it was the focus step, completed at the target prompting level
   *   - If not the focus step, completed with no prompting or interfering challenging behavior
   * @param stepAttempt
   */
  stepIsComplete(stepAttempt: StepAttempt): boolean {
    // Probe attempt is complete with no prompting
    if (stepAttempt.session_type === ChainSessionType.probe) {
      return !!(stepAttempt.completed && !stepAttempt.was_prompted);
    }

    // Focus step attempt was completed either with no prompting or at the target prompt level
    else if (
      (stepAttempt.session_type === ChainSessionType.training ||
        stepAttempt.session_type === ChainSessionType.booster) &&
      stepAttempt.was_focus_step
    ) {
      return !!(
        stepAttempt.completed &&
        (!stepAttempt.was_prompted ||
          this.promptLevelIsBetterThanTarget(stepAttempt.prompt_level, stepAttempt.target_prompt_level))
      );
    }

    // Non-focus training/booster step completed with no prompting or challenging behavior
    else {
      return !!(!stepAttempt.was_prompted && !stepAttempt.had_challenging_behavior && stepAttempt.completed);
    }
  }

  /**
   * Given a list of step attempts, returns the first booster step.
   *
   * First Booster session will be first AFTER the first mastered attempt AND
   * - after 3 incomplete Probe sessions OR
   * - after 5 incomplete training sessions
   *
   * @param stepAttempts
   *
   * TODO - Replace the core booster logic with a helper method so it can be reused
   */
  getBoosterStep(stepAttempts: StepAttempt[]): StepAttempt | undefined {
    let masteredOnce = false;
    let numConsecutiveIncomplete = 0;
    let needsBooster = false;

    // Skip if there are fewer than 3 attempts, or the step has never been mastered.
    if (stepAttempts.length < 3) {
      return;
    }

    const attemptFirstMastered = this.stepFirstMastered(stepAttempts);
    if (!attemptFirstMastered) {
      return;
    }

    // Loop through all steps
    for (const stepAttempt of stepAttempts) {
      // Skip ahead to the attempt where the step was first mastered
      if (stepAttempt.id === attemptFirstMastered.id) {
        masteredOnce = true;
      }

      if (masteredOnce) {
        // A booster is needed. Set the booster step.
        if (needsBooster) {
          return stepAttempt;
        } else {
          // Post-mastery attempt where step was not completed.
          if (!this.stepIsComplete(stepAttempt)) {
            numConsecutiveIncomplete++;

            // If the number of consecutive incomplete sessions is at or over the threshold,
            // the next step should be a booster.
            if (
              numConsecutiveIncomplete > NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER ||
              numConsecutiveIncomplete > NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER
            ) {
              // The step after this one will be the first booster step.
              needsBooster = true;
            }
          } else {
            numConsecutiveIncomplete = 0;
          }
        }
      }
    }
  }

  /**
   * Given a list of step attempts, returns true if the next attempt needs to be a booster.
   * @param stepAttempts
   *
   * TODO - Replace the core booster logic with a helper method so it can be reused
   *
   */
  chainStepNeedsBooster(stepAttempts: StepAttempt[]): boolean {
    let numConsecutiveIncomplete = 0;

    // Skip if there are fewer than 3 attempts, or the step has never been mastered.
    if (stepAttempts.length < 3 || !this.stepFirstMastered(stepAttempts)) {
      return false;
    }

    // Only need to look at the last 3 sessions, in reverse date order.
    const lastFewSessions = stepAttempts.slice(-3).reverse();
    for (const stepAttempt of lastFewSessions) {
      if (this.stepIsComplete(stepAttempt)) {
        numConsecutiveIncomplete = 0;
      } else {
        // Post-mastery attempt where step was not completed.
        numConsecutiveIncomplete++;
      }
    }

    // If the number of consecutive incomplete sessions is at or over the threshold,
    // the next step should be a booster.
    return (
      numConsecutiveIncomplete >= NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER ||
      numConsecutiveIncomplete >= NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER
    );
  }

  /**
   * Returns a list of IDs of chain steps that have been focused on. Preserves the sequence in which they were focused,
   * so there will be duplicates and may have been focused on out of order.
   */
  getFocusedChainStepIds(): number[] {
    const focusedChainStepIds = [];

    for (const session of this.chainData.sessions) {
      for (const stepAttempt of session.step_attempts) {
        if (stepAttempt.was_focus_step) {
          // Record whether step has been focused on before
          focusedChainStepIds.push(stepAttempt.chain_step_id);
        }
      }
    }

    return focusedChainStepIds;
  }

  /**
   * Returns true if the given chain step ID has already been the focus step.
   * @param chainStepId
   */
  chainStepHasBeenFocused(chainStepId: number): boolean {
    const focusedChainStepIds = this.getFocusedChainStepIds();
    return focusedChainStepIds.includes(chainStepId);
  }

  /**
   * Returns the id of the chain step that was focused on lately across all chain sessions (i.e. the last one by date.)
   * @param chainStepId
   */
  latestFocusedChainStepId(): number | undefined {
    const focusedChainStepIds = [];

    for (const session of this.chainData.sessions) {
      for (const stepAttempt of session.step_attempts) {
        if (stepAttempt.was_focus_step) {
          // Record whether step has been focused on before
          focusedChainStepIds.push(stepAttempt.chain_step_id);
        }
      }
    }

    if (focusedChainStepIds.length > 0) {
      return focusedChainStepIds[focusedChainStepIds.length - 1];
    }
  }

  /**
   * Given a mastery info for a chain step, returns true if the next attempt for that
   * chain step needs to be the focus step. Otherwise, returns false.
   *
   * @param stepAttempts
   */

  chainStepNeedsFocus(m: MasteryInfo): boolean {
    return !!(
      m.dateIntroduced && // Step has been introduced AND
      !m.dateMastered && // ...but has not been mastered yet AND
      // Challenging behavior occurred more than 3 attempts in a row OR
      (m.numAttemptsSince.lastCompletedWithoutChallenge >= NUM_CHALLENGING_ATTEMPTS_FOR_FOCUS ||
        // Prompting was required more than 3 attempts in a row
        m.numAttemptsSince.lastCompletedWithoutPrompt >= NUM_PROMPTED_ATTEMPTS_FOR_FOCUS)
    );
  }

  /**
   * Given a list of step attempts, returns the number of attempts after
   * the first booster session was introduced.
   * @param stepAttempts
   */
  numSinceBoosterInitiated(stepAttempts: StepAttempt[]): number {
    const boosterStep = this.getBoosterStep(stepAttempts);

    if (boosterStep && boosterStep.id) {
      const boosterStepIndex = stepAttempts.findIndex((s) => s.id === boosterStep.id);
      if (boosterStepIndex !== -1) {
        return stepAttempts.length - (boosterStepIndex + 1);
      }
    }

    return -1;
  }

  /**
   * Given a list of step attempts, returns the number of attempts after
   * the last booster session was mastered.
   * @param stepAttempts
   */
  numSinceBoosterMastered(stepAttempts: StepAttempt[]): number {
    const boosterStep = this.getBoosterStep(stepAttempts);

    if (boosterStep && boosterStep.id) {
      const boosterStepIndex = stepAttempts.findIndex((s) => s.id === boosterStep.id);
      if (boosterStepIndex !== -1) {
        return stepAttempts.length - (boosterStepIndex + 1);
      }
    }

    return -1;
  }

  /**
   * Given a list of step attempts and masteryInfo populated with dates and numAttemptsSince, returns
   * the step status for the entire step (not_complete, mastered, focus)
   *
   * check for completion of last session's step_attempts
   * -- IF: (a step_attempt was incomplete && (total qty of sessions >= MAX_CONSEC_INCOMPLETE))
   * -- THEN: get prior 3 sessions _AND THEN_ check step_attempt[index] against prior_session.step_attempt[index]
   * ------- IF: (prior_session.step_attempt[index] ALSO incomplete)
   * ----------- THEN: incompleteCount += 1
   * ------- ELSE:
   * ----------- THEN: incompleteCount = 0
   * -- IF: (incompleteCount >= MAX_CONSEC_INCOMPLETE)
   * ----------- THEN: FOCUS_STEP = next_session.step_attempt[index]
   * ----------- RETURN: FOCUS_STEP
   * -- ELSE:
   * ----------- FOCUS_STEP = next_session.step_attempt[index+1]
   * ----------- RETURN: FOCUS_STEP
   *
   * @param stepAttempts
   * @param m: MasteryInfo object, populated with milestone dates and numAttemptsSince.
   */
  getStepStatus(stepAttempts: StepAttempt[], m: MasteryInfo): ChainStepStatus {
    const needsBooster = this.chainStepNeedsBooster(stepAttempts);
    const neverAttempted = stepAttempts.every((s) => s.status === ChainStepStatus.not_yet_started);

    if (neverAttempted) {
      return ChainStepStatus.not_yet_started;
    }

    // Step has been mastered, and no booster is required
    if (m.dateMastered && !needsBooster) {
      return ChainStepStatus.mastered;
    }

    // Step required booster, and it was mastered again
    if (m.dateBoosterMastered && !needsBooster) {
      return ChainStepStatus.booster_mastered;
    }

    if ((m.dateBoosterInitiated && !m.dateBoosterMastered) || needsBooster) {
      return ChainStepStatus.booster_needed;
    }

    if (this.chainStepNeedsFocus(m)) {
      return ChainStepStatus.focus;
    }

    return ChainStepStatus.not_complete;
  }

  /**
   * If the given session is a training or booster session, returns the step that
   * is marked as was_focus_step (assumes that only one step will be focus step).
   * Otherwise, returns undefined.
   */
  getFocusStepInSession(session: ChainSession): StepAttempt | undefined {
    if (
      session.step_attempts &&
      session.step_attempts.length > 0 &&
      session.session_type &&
      (session.session_type === ChainSessionType.training || session.session_type === ChainSessionType.booster)
    ) {
      for (const stepAttempt of session.step_attempts) {
        if (stepAttempt.was_focus_step) {
          return stepAttempt;
        }
      }
    }
    return undefined;
  }

  /**
   * Returns a sorted, deduped list of IDs of chain steps that have already been mastered (no booster needed
   * yet) or been re-mastered after a booster.
   */
  getMasteredChainStepIds(): number[] {
    const masteredSteps = this.chainSteps.filter((chainStep) => this.chainStepHasBeenMastered(chainStep.id));
    return masteredSteps.map((s) => s.id);
  }

  /**
   * Returns a sorted, deduped list of IDs of chain steps that have not been mastered yet or that need a booster.
   */
  getUnmasteredChainStepIds(): number[] {
    const masteredSteps = this.chainSteps.filter((chainStep) => !this.chainStepHasBeenMastered(chainStep.id));
    return masteredSteps.map((s) => s.id);
  }

  /**
   * Returns true if the given chain step has already been mastered (no booster needed yet) or been re-mastered
   * after a booster.
   * @param chain_step_id
   */
  chainStepHasBeenMastered(chain_step_id: number): boolean {
    const m = this.masteryInfoMap[chain_step_id];

    if (m) {
      const hasMasteredWithNoBooster = !!(m.dateMastered && !m.dateBoosterInitiated && !m.dateBoosterMastered);
      const hasMasteredBooster = !!(m.dateMastered && m.dateBoosterInitiated && m.dateBoosterMastered);
      return hasMasteredWithNoBooster || hasMasteredBooster;
    }

    return false;
  }

  /**
   * Returns a list of IDs of chain steps that have been focused on, but have either
   * NOT been mastered yet OR need a booster.
   */
  getUnmasteredFocusedChainStepIds(): number[] {
    // Remove all the mastered chain steps from the focused chain step ids.
    return this.focusedChainStepIds.filter((s) => !this.masteredChainStepIds.includes(s));
  }

  /**
   * Builds a new draft session with the given session type.
   * @param sessionType
   */
  setDraftSessionType(sessionType: ChainSessionType): void {
    this.draftSession = this.buildNewDraftSession(sessionType);
  }

  /**
   * Updates the instance chain data with the given SkillSTAR chain data, then
   * updates the instance mastery info map, and draft session with the new data.
   * @param skillstarChain
   */
  updateChainData(skillstarChain: SkillstarChain): void {
    this.chainData = new ChainData(skillstarChain);
    this.masteryInfoMap = this.buildMasteryInfoMap();
    this.focusedChainStepIds = this.getFocusedChainStepIds();
    this.unmasteredChainStepIds = this.getUnmasteredChainStepIds();
    this.masteredChainStepIds = this.getMasteredChainStepIds();
    this.unmasteredFocusedChainStepIds = this.getUnmasteredFocusedChainStepIds();
    this.draftSession = this.buildNewDraftSession();
  }

  /**
   * Returns true if one of the following is true:
   * - there are fewer than 3 past sessions OR
   * - no training session has ever been attempted OR
   * - it's been 4 sessions since the last probe
   */
  canStartProbeSession(): boolean {
    const numSessions = this.chainData.sessions.length;
    const hasHadTrainingSession = this.hasHadTrainingSession;
    const numSessionsSinceLastProbe = this.masteryInfoMap[0].numAttemptsSince.lastProbe;
    return numSessions < 3 || !hasHadTrainingSession || numSessionsSinceLastProbe >= 4;
  }

  /**
   * Returns true if one of the following is true:
   * - there are more than 3 past sessions, but no training session has ever been attempted OR
   * - it's been fewer than 4 sessions since the last probe
   */
  canStartTrainingSession(): boolean {
    const numSessions = this.chainData.sessions.length;
    const hasHadTrainingSession = this.hasHadTrainingSession;
    const numSessionsSinceLastProbe = this.masteryInfoMap[0].numAttemptsSince.lastProbe;

    return (numSessions >= 3 && !hasHadTrainingSession) || (numSessions >= 3 && numSessionsSinceLastProbe < 4);
  }

  /**
   * Updates a specific field (matching the given field name) in a specific draft
   * session step attempt (matching the given chain step ID) with the given value.
   * @param chainStepId
   * @param fieldName
   * @param fieldValue
   */
  updateDraftSessionStep(chainStepId: number, fieldName: StepAttemptFieldName, fieldValue: StepAttemptField): void {
    //  Get the step
    this.draftSession.step_attempts.forEach((stepAttempt, i) => {
      if (stepAttempt.chain_step_id === chainStepId) {
        // Set the value of the fieldName for a specific step
        // @ts-ignore-next-line
        this.draftSession.step_attempts[i][fieldName] = fieldValue;
      }
    });
  }

  /**
   * Returns the step attempt from the draft session matching the given chain step ID.
   * @param chainStepId
   */
  getDraftSessionStep(chainStepId: number): StepAttempt {
    const draftStep = this.draftSession.step_attempts.find((s) => s.chain_step_id === chainStepId);

    if (!draftStep) {
      throw new Error(`No step attempt found in draft session matching chain step ID: ${chainStepId}`);
    }

    return draftStep;
  }

  /**
   * Creates an index of steps, the status for each, and the milestone dates for that step, if applicable.
   */
  private buildMasteryInfoMap(): MasteryInfoMap {
    const masteryInfoMap: MasteryInfoMap = {};
    if (this.chainData && this.chainData.sessions && this.chainData.sessions.length === 0) {
      this.chainSteps.forEach((chainStep) => {
        masteryInfoMap[`${chainStep.id}`] = this.buildMasteryInfoForChainStep(chainStep.id);
      });
      return masteryInfoMap;
    }

    this.chainData.sessions.forEach((session) => {
      session.step_attempts.forEach((stepAttempt) => {
        if (stepAttempt && stepAttempt.chain_step_id !== undefined && stepAttempt.status) {
          masteryInfoMap[`${stepAttempt.chain_step_id}`] = this.buildMasteryInfoForChainStep(stepAttempt.chain_step_id);
        }
      });
    });
    return masteryInfoMap;
  }

  /**
   * For the given chain step ID, calculates the status, number of steps since certain
   * key events occurred, and milestone dates, looking at the step attempts across all
   * chain sessions in the chain data.
   *
   * @param chainStepId
   */
  private buildMasteryInfoForChainStep(chainStepId: number): MasteryInfo {
    const stepAttempts = this.chainData.getAllStepAttemptsForChainStep(chainStepId);

    // Initialize numAttemptsSince
    const m: MasteryInfo = {
      chainStepId,
      stepStatus: ChainStepStatus.not_complete,

      // Dates will be set below, if applicable
      dateIntroduced: undefined,
      dateMastered: undefined,
      dateBoosterInitiated: undefined,
      dateBoosterMastered: undefined,
      numAttemptsSince: {
        firstIntroduced: this.numSinceFirstIntroduced(stepAttempts),
        firstCompleted: this.numSinceFirstCompleted(stepAttempts),
        lastCompleted: this.numSinceLastCompleted(stepAttempts),
        lastCompletedWithoutChallenge: this.numSinceLastCompletedWithoutChallenge(stepAttempts),
        lastCompletedWithoutPrompt: this.numSinceLastCompletedWithoutPrompt(stepAttempts),
        lastFailed: this.numSinceLastFailed(stepAttempts),
        lastFailedWithFocus: this.numSinceFocusStepLastFailed(stepAttempts),
        lastProbe: this.numSinceLastProbe(stepAttempts),
        firstMastered: this.numSinceFirstMastered(stepAttempts),
        boosterInitiated: this.numSinceBoosterInitiated(stepAttempts),
        boosterMastered: this.numSinceBoosterMastered(stepAttempts),
      },

      promptLevel: this.getPromptLevelForChainStep(chainStepId),
    };

    // Initialize dates
    m.dateIntroduced = this.getDateFor(stepAttempts, m.numAttemptsSince.firstIntroduced);
    m.dateMastered = this.getDateFor(stepAttempts, m.numAttemptsSince.firstMastered);
    m.dateBoosterInitiated = this.getDateFor(stepAttempts, m.numAttemptsSince.boosterInitiated);
    m.dateBoosterMastered = this.getDateFor(stepAttempts, m.numAttemptsSince.boosterMastered);

    // Set step status
    m.stepStatus = this.getStepStatus(stepAttempts, m);

    return m;
  }

  /**
   * Returns true if the first given prompt level is better than the second
   * given prompt level. Otherwise, returns false.
   *
   * Throws an error if both target prompt level is invalid.
   * @param actualPromptLevel
   * @param targetPromptLevel
   */
  promptLevelIsBetterThanTarget(
    actualPromptLevel: ChainStepPromptLevel | undefined,
    targetPromptLevel: ChainStepPromptLevel | undefined,
  ): boolean {
    const actualPromptLevelIndex = this.promptHierarchy.findIndex((p) => p.key === actualPromptLevel);
    const targetPromptLevelIndex = this.promptHierarchy.findIndex((p) => p.key === targetPromptLevel);

    if (targetPromptLevelIndex === -1) {
      throw new Error('Target prompt level is not valid. It might not have been populated properly.');
    }

    // Step has not been attempted yet.
    if (actualPromptLevelIndex === -1) {
      return false;
    }

    // Lower number is better.
    return actualPromptLevelIndex <= targetPromptLevelIndex;
  }

  /**
   * Returns last actual prompt level used in a focus step for the given chain step, or undefined if none is found.
   * @param chainStepId
   */
  getPromptLevelForChainStep(chainStepId: number): ChainStepPromptLevel | undefined {
    const focusSteps = this.getFocusStepAttemptsForChainStep(chainStepId);

    if (focusSteps && focusSteps.length > 0) {
      const actualLevel = focusSteps[focusSteps.length - 1].prompt_level;

      if (actualLevel) {
        return actualLevel;
      }
    }
  }
}
