import {
  NUM_CHALLENGING_ATTEMPTS_FOR_FOCUS,
  NUM_COMPLETE_ATTEMPTS_FOR_MASTERY,
  NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER,
  NUM_MIN_PROBE_SESSIONS,
  NUM_PROMPTED_ATTEMPTS_FOR_FOCUS,
  NUM_TRAINING_SESSIONS_BETWEEN_PROBES,
} from '../constants/MasteryAlgorithm';
import { ChainData, SkillstarChain } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { MasteryInfo, MasteryInfoMap, PromptLevelMap } from '../types/chain/MasteryLevel';
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
   * Returns array of booleans indicating prior focus step completion at latest prompt level
   *
   * @param chainStepId
   */
  getPreviousFocusStepAttempts(chainStepId: number): boolean[] {
    const focusStepAttempts = this.getFocusStepAttemptsForChainStep(chainStepId);
    const lastPromptLevel = this.masteryInfoMap[chainStepId].promptLevel;
    const attemptsAtLastLevel = [];

    if (focusStepAttempts.length > 0 && lastPromptLevel) {
      for (const stepAttempt of focusStepAttempts.reverse()) {
        if (stepAttempt.target_prompt_level === lastPromptLevel) {
          attemptsAtLastLevel.push(this.stepIsComplete(stepAttempt));
        } else {
          break;
        }
      }
    }

    return attemptsAtLastLevel;
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
      if (this.chainStepNeedsBooster(chainStep.id, stepAttempts)) {
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
    let focusChainStepId: number | undefined = this.nextFocusChainStepId;
    const boosterChainStepId: number | undefined = this.nextBoosterChainStepId;

    // If no session type is passed in as a parameter, decide what kind of session this should be.
    if (!sessionType) {
      // Should the draft session be...
      // ...a probe session?
      if (this.newDraftSessionShouldBeProbeSession()) {
        newDraftSession.session_type = ChainSessionType.probe;
      }

      // ...a booster?
      else if (boosterChainStepId !== undefined) {
        newDraftSession.session_type = ChainSessionType.booster;
        focusChainStepId = boosterChainStepId;
      }

      // ...a training session?
      else if (focusChainStepId !== undefined) {
        newDraftSession.session_type = ChainSessionType.training;
      }
    }

    // If all steps have been mastered, set the session type to probe.
    if (
      focusChainStepId === undefined &&
      boosterChainStepId === undefined &&
      this.masteredChainStepIds.length === this.chainSteps.length
    ) {
      newDraftSession.session_type = ChainSessionType.probe;
      newDraftSession.step_attempts.forEach((stepAttempt) => (stepAttempt.session_type = ChainSessionType.probe));
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
      newDraftSession.step_attempts.forEach((stepAttempt, i) => {
        // Mark which chain step needs a booster.
        if (boosterChainStepId !== undefined) {
          const isBoosterStep = stepAttempt.chain_step_id === boosterChainStepId;
          newDraftSession.step_attempts[i].was_focus_step = isBoosterStep;

          if (isBoosterStep) {
            this.masteryInfoMap[stepAttempt.chain_step_id].stepStatus = ChainStepStatus.booster_needed;
            newDraftSession.step_attempts[i].status = ChainStepStatus.booster_needed;
            stepAttempt.status = ChainStepStatus.booster_needed;
          }
        }

        // Mark which chain step should be the focus step.
        else if (focusChainStepId !== undefined) {
          const isFocusStep = stepAttempt.chain_step_id === focusChainStepId;
          newDraftSession.step_attempts[i].was_focus_step = isFocusStep;

          if (isFocusStep) {
            this.masteryInfoMap[stepAttempt.chain_step_id].stepStatus = ChainStepStatus.focus;
            newDraftSession.step_attempts[i].status = ChainStepStatus.focus;
            stepAttempt.status = ChainStepStatus.focus;
          }
        }
      });
    }

    // Set the target prompt levels for all steps.
    newDraftSession.step_attempts.forEach((stepAttempt) => {
      // If this if the first booster attempt, go back to the shadow prompt level.
      const masteryInfo = this.masteryInfoMap[stepAttempt.chain_step_id];
      const promptLevelMap = this.getPromptLevelMap(stepAttempt.chain_step_id);
      const targetPromptLevel = promptLevelMap.targetPromptLevel;
      stepAttempt.target_prompt_level = targetPromptLevel;
      masteryInfo.promptLevel = targetPromptLevel;

      if (stepAttempt.was_focus_step) {
        this.draftFocusStepAttempt = stepAttempt;
      }
    });

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
        return masteryInfo.numAttemptsSince.lastProbe >= NUM_TRAINING_SESSIONS_BETWEEN_PROBES;
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
   * Given a prompt level, returns the next prompt level in the prompt hierarchy.
   * @param promptLvl: the previous prompt level
   */
  getPrevPromptLevel(promptLvl: ChainStepPromptLevel): ChainStepPromptLevelMapItem {
    const maxIndex = this.promptHierarchy.length - 1;
    const currentIndex = this.promptHierarchy.findIndex((e) => e.key === promptLvl);
    const prevIndex = currentIndex >= maxIndex ? maxIndex : currentIndex + 1; // 3 if prompt level is already 3 (full_physical)
    return this.promptHierarchy[prevIndex];
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
  numSinceFirstMastered(stepAttempts: StepAttempt[], promptLevelMap: PromptLevelMap): number {
    const firstMasteredStep = promptLevelMap.firstMasteredStep;

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
   * Returns true if the given step was completed with no prompting or challenging behavior
   * @param stepAttempt
   */
  isStepFullyCompleted(stepAttempt: StepAttempt): boolean {
    return !!(!stepAttempt.was_prompted && !stepAttempt.had_challenging_behavior && stepAttempt.completed);
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
      (stepAttempt.session_type === ChainSessionType.training ||
        stepAttempt.session_type === ChainSessionType.booster) &&
      !!stepAttempt.was_focus_step &&
      this.promptLevelIsBetterThanTarget(stepAttempt.prompt_level, stepAttempt.target_prompt_level)
    );
  }

  /**
   * Returns true if the given step was:
   * - a training or booster session AND
   * - the focus step AND
   * - completed AND
   * - with no prompting
   * @param stepAttempt
   */
  isFocusStepMastered(stepAttempt: StepAttempt): boolean {
    return !!(
      stepAttempt.completed &&
      (stepAttempt.session_type === ChainSessionType.training ||
        stepAttempt.session_type === ChainSessionType.booster) &&
      (stepAttempt.was_focus_step || stepAttempt.status === ChainStepStatus.booster_needed) &&
      stepAttempt.prompt_level === ChainStepPromptLevel.none &&
      !stepAttempt.was_prompted
    );
  }

  /**
   * Returns true if the given step was:
   * - marked as booster needed AND
   * - completed AND
   * - with no prompting
   * @param stepAttempt
   */
  isBoosterStepMastered(stepAttempt: StepAttempt): boolean {
    return !!(
      stepAttempt.status === ChainStepStatus.booster_needed &&
      stepAttempt.completed &&
      (this.isProbeStepComplete(stepAttempt) ||
        (stepAttempt.session_type === ChainSessionType.booster &&
          stepAttempt.prompt_level === ChainStepPromptLevel.none))
    );
  }

  /**
   * Given a list of step attempts, returns the first step attempt where the step was
   * completed 3 or more attempts in a row.
   * @param chainStepId
   */
  stepFirstMastered(chainStepId: number): StepAttempt | undefined {
    return this.getPromptLevelMap(chainStepId).firstMasteredStep;
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
      return this.isProbeStepComplete(stepAttempt);
    }

    // Focus step attempt was completed either with no prompting or at the target prompt level
    else if (
      ((stepAttempt.session_type === ChainSessionType.training ||
        stepAttempt.session_type === ChainSessionType.booster) &&
        stepAttempt.was_focus_step) ||
      (stepAttempt.session_type === ChainSessionType.booster && stepAttempt.status === ChainStepStatus.booster_needed)
    ) {
      return !!(
        stepAttempt.completed &&
        (!stepAttempt.was_prompted ||
          this.promptLevelIsBetterThanTarget(stepAttempt.prompt_level, stepAttempt.target_prompt_level))
      );
    }

    // Non-focus training/booster step completed with no prompting or challenging behavior
    else {
      return this.isStepFullyCompleted(stepAttempt);
    }
  }

  /**
   * Given a list of step attempts, returns the first booster step.
   *
   * First Booster session will be first AFTER the first mastered attempt AND after 3 incomplete sessions
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
    if (stepAttempts.length < NUM_MIN_PROBE_SESSIONS) {
      return;
    }

    const attemptFirstMastered = this.stepFirstMastered(stepAttempts[0].chain_step_id);
    if (!attemptFirstMastered) {
      return;
    }

    // Loop through all steps
    for (const stepAttempt of stepAttempts) {
      if (stepAttempt.status === ChainStepStatus.booster_needed) {
        return stepAttempt;
      }

      // Skip ahead to the attempt where the step was first mastered
      if (stepAttempt === attemptFirstMastered) {
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
            if (numConsecutiveIncomplete >= NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER) {
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
  chainStepNeedsBooster(chainStepId: number, stepAttempts: StepAttempt[]): boolean {
    let numConsecutiveIncomplete = 0;
    let numConsecutiveComplete = 0;
    let wasMastered = false;
    let boosterStarted = false;
    let boosterMastered = false;
    const firstMasteredStep = this.stepFirstMastered(chainStepId);

    // Skip if there are fewer than 2 attempts, or the step has never been mastered.
    if (stepAttempts.length < NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER || !firstMasteredStep) {
      return false;
    }

    for (const stepAttempt of stepAttempts) {
      if (stepAttempt === firstMasteredStep) {
        wasMastered = true;
      }

      if (wasMastered) {
        if (this.stepIsComplete(stepAttempt)) {
          numConsecutiveIncomplete = 0;
        } else {
          // Post-mastery attempt where step was not completed.
          numConsecutiveIncomplete++;
        }

        if (numConsecutiveIncomplete >= NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER) {
          boosterStarted = true;
        }
      }

      if (boosterStarted) {
        if (this.isBoosterStepMastered(stepAttempt)) {
          numConsecutiveComplete++;
        } else {
          numConsecutiveComplete = 0;
        }

        if (numConsecutiveComplete >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
          boosterMastered = true;
        }
      }
    }

    return boosterStarted && !boosterMastered;
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
  numSinceBoosterInitiated(chainStepId: number, stepAttempts: StepAttempt[], promptLevelMap: PromptLevelMap): number {
    const boosterStep = promptLevelMap.firstBoosterStep;

    if (boosterStep) {
      const boosterStepIndex = stepAttempts.findIndex((s) => s === boosterStep);
      if (boosterStepIndex !== -1) {
        return stepAttempts.length - (boosterStepIndex + 1);
      }
    } else if (this.chainStepNeedsBooster(chainStepId, stepAttempts)) {
      return 0;
    }

    return -1;
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the
   * a booster session was attempted.
   * @param stepAttempts
   */
  numSinceBoosterAttempted(stepAttempts: StepAttempt[], promptLevelMap: PromptLevelMap): number {
    // Find the first step after master that the booster was needed.
    const boosterStep = promptLevelMap.firstBoosterStep;
    let boosterStepIndex = -1;
    let boosterAttemptedIndex = -1;

    if (boosterStep) {
      stepAttempts.forEach((stepAttempt, i) => {
        if (stepAttempt === boosterStep) {
          boosterStepIndex = i;
        }

        if (i >= boosterStepIndex && stepAttempt.status === ChainStepStatus.booster_needed) {
          boosterAttemptedIndex = i;
        }
      });

      if (boosterAttemptedIndex !== -1) {
        return stepAttempts.length - (boosterAttemptedIndex + 1);
      }
    }

    // Booster step never attempted.
    return -1;
  }

  /**
   * Given a list of step attempts, returns the number of attempts after
   * the last booster session was mastered.
   * @param stepAttempts
   */
  numSinceBoosterMastered(stepAttempts: StepAttempt[], promptLevelMap: PromptLevelMap): number {
    const boosterMasteredStep = promptLevelMap.boosterMasteredStep;

    if (!boosterMasteredStep) {
      return -1;
    }

    const masteredIndex = stepAttempts.findIndex((stepAttempt) => {
      return stepAttempt === boosterMasteredStep;
    });

    return stepAttempts.length - (masteredIndex + 1);
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
    const focusStep = this.currentFocusStep;
    const promptLevelMap = this.getPromptLevelMap(m.chainStepId);

    // No step attempts yet.
    if (!stepAttempts || stepAttempts.length === 0) {
      return ChainStepStatus.not_yet_started;
    }

    if (promptLevelMap.boosterMasteredStep) {
      // Step required booster, and it was mastered again
      return ChainStepStatus.booster_mastered;
    }

    if (this.chainStepNeedsBooster(m.chainStepId, stepAttempts)) {
      return ChainStepStatus.booster_needed;
    }

    // Step has been mastered, and no booster is required
    if (promptLevelMap.firstMasteredStep) {
      return ChainStepStatus.mastered;
    }

    if (this.chainStepNeedsFocus(m) && focusStep && focusStep.chain_step_id === m.chainStepId) {
      return ChainStepStatus.focus;
    }

    return ChainStepStatus.not_complete;
  }

  /**
   * Returns true if the chain step in the given list of step attempts has been mastered.
   * @param stepAttempts
   */
  firstMasteredBoosterStep(stepAttempts: StepAttempt[]): StepAttempt | undefined {
    let numConsecutiveComplete = 0;

    for (const stepAttempt of stepAttempts) {
      if (this.isBoosterStepMastered(stepAttempt)) {
        numConsecutiveComplete++;
      } else {
        numConsecutiveComplete = 0;
      }

      if (numConsecutiveComplete >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
        return stepAttempt;
      }
    }
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
   * @param chainStepId
   */
  chainStepHasBeenMastered(chainStepId: number, masteryInfo?: MasteryInfo): boolean {
    const m = masteryInfo || this.masteryInfoMap[chainStepId];

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
    return (
      numSessions < NUM_MIN_PROBE_SESSIONS ||
      !hasHadTrainingSession ||
      numSessionsSinceLastProbe >= NUM_TRAINING_SESSIONS_BETWEEN_PROBES
    );
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

    return (
      (numSessions >= NUM_MIN_PROBE_SESSIONS && !hasHadTrainingSession) ||
      (numSessions >= NUM_MIN_PROBE_SESSIONS && numSessionsSinceLastProbe < NUM_TRAINING_SESSIONS_BETWEEN_PROBES)
    );
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
    this.chainSteps.forEach((chainStep) => {
      masteryInfoMap[`${chainStep.id}`] = this.buildMasteryInfoForChainStep(chainStep.id);
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
    const promptLevelMap = this.getPromptLevelMap(chainStepId);

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
        lastProbe: this.numSinceLastProbe(stepAttempts),
        firstMastered: this.numSinceFirstMastered(stepAttempts, promptLevelMap),
        boosterInitiated: this.numSinceBoosterInitiated(chainStepId, stepAttempts, promptLevelMap),
        boosterLastAttempted: this.numSinceBoosterAttempted(stepAttempts, promptLevelMap),
        boosterMastered: this.numSinceBoosterMastered(stepAttempts, promptLevelMap),
      },

      promptLevel: promptLevelMap.targetPromptLevel,
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
   * Adds the current draft session to the chain data, updates the chain data,
   * updates the mastery info, and generates a new draft session.
   */
  saveDraftSession(): void {
    const newChainData = this.chainData.clone();
    newChainData.upsertSession(this.draftSession);
    this.updateChainData(newChainData);
  }

  /**
   * Returns the target prompt level that the next draft session should have for the given chain step ID.
   * @param chainStepId
   */
  getPromptLevelMap(chainStepId: number): PromptLevelMap {
    let numCompleteAttemptsAtThisLevel = 0;
    let numFailedAttemptsAtThisLevel = 0;
    let numConsecutiveCompleteProbes = 0;
    let prevAttemptLevel: ChainStepPromptLevel = ChainStepPromptLevel.full_physical;
    let lastAttemptLevel: ChainStepPromptLevel = ChainStepPromptLevel.full_physical;
    const promptLevelMap: PromptLevelMap = {};

    // Walk through all sessions and step attempts.
    this.chainData.sessions.forEach((session) => {
      session.step_attempts.forEach((stepAttempt) => {
        if (stepAttempt.chain_step_id === chainStepId) {
          const isComplete = this.stepIsComplete(stepAttempt);
          const sameLevelAsPrev = prevAttemptLevel === stepAttempt.target_prompt_level;

          // Count the number of complete consecutive attempts at this prompt level.
          if (!sameLevelAsPrev) {
            // Reset all counters
            numCompleteAttemptsAtThisLevel = 0;
            numConsecutiveCompleteProbes = 0;
            numFailedAttemptsAtThisLevel = 0;
          }

          if (stepAttempt.session_type === ChainSessionType.probe) {
            // Probe session.
            if (isComplete) {
              numCompleteAttemptsAtThisLevel++;
              numConsecutiveCompleteProbes++;
              numFailedAttemptsAtThisLevel = 0;
            } else {
              numCompleteAttemptsAtThisLevel = 0;
              numConsecutiveCompleteProbes = 0;
              numFailedAttemptsAtThisLevel++;
            }
          } else {
            // Training or booster session.
            numConsecutiveCompleteProbes = 0;

            if (isComplete) {
              numCompleteAttemptsAtThisLevel++;
              numFailedAttemptsAtThisLevel = 0;
            } else {
              numCompleteAttemptsAtThisLevel = 0;
              numFailedAttemptsAtThisLevel++;
            }
          }

          // If consecutive probes are completed 3 or more times, the step is mastered, so prompt level should be none (i.e., independent)
          if (numConsecutiveCompleteProbes >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
            if (!promptLevelMap.firstMasteredStep) {
              promptLevelMap.firstMasteredStep = stepAttempt;
            } else if (promptLevelMap.firstBoosterStep && !promptLevelMap.boosterMasteredStep) {
              promptLevelMap.boosterMasteredStep = stepAttempt;
            }

            lastAttemptLevel = ChainStepPromptLevel.none;
          }

          // If the current prompt level failed in 3 consecutive sessions, move back a prompt level.
          else if (numFailedAttemptsAtThisLevel >= NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER) {
            if (promptLevelMap.firstMasteredStep && !promptLevelMap.firstBoosterStep) {
              promptLevelMap.firstBoosterStep = stepAttempt;
            }

            if (stepAttempt.target_prompt_level !== undefined) {
              lastAttemptLevel = this.getPrevPromptLevel(stepAttempt.target_prompt_level).key;
            } else {
              throw new Error('Step attempt has no target prompt level.');
            }
          }

          // If the current prompt level was successful in 3 consecutive sessions, go forward a prompt level.
          else if (numCompleteAttemptsAtThisLevel >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
            if (stepAttempt.target_prompt_level !== undefined) {
              if (stepAttempt.target_prompt_level === ChainStepPromptLevel.none) {
                if (!promptLevelMap.firstMasteredStep) {
                  promptLevelMap.firstMasteredStep = stepAttempt;
                } else if (promptLevelMap.firstBoosterStep && !promptLevelMap.boosterMasteredStep) {
                  promptLevelMap.boosterMasteredStep = stepAttempt;
                }
              }

              lastAttemptLevel = this.getNextPromptLevel(stepAttempt.target_prompt_level).key;
            } else {
              throw new Error('Step attempt has no target prompt level.');
            }
          }

          // Otherwise, just set the prompt level to the previous attempt's level.
          else {
            lastAttemptLevel = stepAttempt.target_prompt_level || ChainStepPromptLevel.full_physical;
          }

          if (stepAttempt.target_prompt_level !== undefined) {
            prevAttemptLevel = stepAttempt.target_prompt_level;
          } else {
            throw new Error('Step attempt has no target prompt level.');
          }
        }
      });
    });

    // Return the last prompt level used, if one exists. If not, return full physical.
    promptLevelMap.targetPromptLevel = lastAttemptLevel || ChainStepPromptLevel.full_physical;
    return promptLevelMap;
  }

  printSessionLog(): void {
    const lines: string[] = [];
    let lastFocusStepIndex = 0;

    // Loop through all sessions and step attempts
    this.chainData.sessions.forEach((session, i) => {
      session.step_attempts.forEach((stepAttempt, j) => {
        if (session.session_type === ChainSessionType.probe) {
          if (j === lastFocusStepIndex) {
            lines.push(
              `#${i + 1} - Probe session @ ${stepAttempt.target_prompt_level} - ${
                stepAttempt.completed ? 'COMPLETED' : 'FAILED'
              }`,
            );
          }
        } else {
          if (stepAttempt.was_focus_step) {
            lastFocusStepIndex = j;
            lines.push(
              `#${i + 1} - ${session.session_type} session - ${stepAttempt.status} step: ${
                stepAttempt.chain_step_id
              } @ ${stepAttempt.target_prompt_level} - ${stepAttempt.completed ? 'COMPLETED' : 'FAILED'}`,
            );
          }
        }
      });
    });

    this.draftSession.step_attempts.forEach((stepAttempt, j) => {
      if (stepAttempt.session_type === ChainSessionType.probe) {
        if (j === lastFocusStepIndex) {
          lines.push(
            `#${this.chainData.sessions.length + 1} - Probe session - focus step: ${j} @ ${
              stepAttempt.target_prompt_level
            } - DRAFT`,
          );
        }
      } else {
        if (stepAttempt.was_focus_step) {
          lastFocusStepIndex = j;
          lines.push(
            `#${this.chainData.sessions.length + 1} - ${stepAttempt.session_type} session - ${
              stepAttempt.status
            } step: ${stepAttempt.chain_step_id} @ ${stepAttempt.target_prompt_level} - DRAFT`,
          );
        }
      }
    });

    // Print it all out.
    console.log(`========================================
${lines.join('\n')}
========================================`);
  }
}
