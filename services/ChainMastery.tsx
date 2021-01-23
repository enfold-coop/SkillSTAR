import {
  NUM_CHALLENGING_ATTEMPTS_FOR_FOCUS,
  NUM_COMPLETE_PROBE_ATTEMPTS_FOR_MASTERY,
  NUM_COMPLETE_TRAINING_ATTEMPTS_FOR_MASTERY,
  NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER,
  NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER,
  NUM_PROMPTED_ATTEMPTS_FOR_FOCUS,
} from '../constants/MasteryAlgorithm';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { MasteryInfo, MasteryInfoMap } from '../types/chain/MasteryLevel';
import { ChainData } from '../types/chain/ChainData';
import {
  ChainStepPromptLevel,
  ChainStepPromptLevelMap,
  ChainStepPromptLevelMapItem,
  ChainStepStatus,
  StepAttempt,
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
  draftSession?: ChainSession;
  incompleteCount = 0;
  focusedChainStepIds: number[];
  masteredChainStepIds: number[];
  unmasteredFocusedChainStepIds: number[];

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
    if (this.prevFocusStepChainStepId !== undefined) {
      return this.prevFocusStepChainStepId;
    }

    // There isn't a current unmastered focus step. Find the biggest chain step ID that has been mastered and increment it.
    if (this.masteredChainStepIds.length > 0) {
      const biggestId = this.masteredChainStepIds[this.masteredChainStepIds.length - 1];
      const focusStepId = biggestId + 1;

      if (focusStepId < this.chainSteps.length) {
        return focusStepId;
      } else {
        // All steps have been mastered.
        return undefined;
      }
    } else {
      // No steps have been mastered yet. The first step should be focused.
      return this.chainSteps[0].id;
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
   * Returns a draft session. This will be a container for the not-yet-completed session that the user
   * is currently inputting data for. Depending on the state of the instance's chain data and mastery
   * info, this may be:
   * - An empty probe session, if the user has no attempted sessions yet
   * - The next session the participant should be attempting, if there is one.
   * - An empty probe session, if there are none left to attempt (???)
   *
   * A draft session has not been saved to the database yet, so nothing in the session
   * will have IDs or backend-populated nested members (such as chain_step in the step_attempts).
   * The draft session will be stored in AsyncStorage until the user successfully completes
   * the session, submits the data, and connects to the internet.
   *
   */
  buildNewDraftSession(): ChainSession {
    const newDraftSession: ChainSession = {
      step_attempts: [],
    };
    let focusChainStepId: number | undefined = undefined;
    let boosterChainStepId: number | undefined = undefined;

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

    // Populate step attempts
    newDraftSession.step_attempts = this.chainSteps.map(chainStep => {
      return {
        chain_step_id: chainStep.id,
        chain_step: chainStep,
        status: ChainStepStatus.not_complete,
        session_type: newDraftSession.session_type,
      } as StepAttempt;
    });

    // For booster and training sessions, mark which chain step should be the focus and/or booster step, if applicable.
    if (
      newDraftSession.session_type === ChainSessionType.booster ||
      newDraftSession.session_type === ChainSessionType.training
    ) {
      newDraftSession.step_attempts.forEach((stepAttempt, i) => {
        // Mark which chain step should be the focus step.
        if (focusChainStepId !== undefined) {
          newDraftSession.step_attempts[i].was_focus_step = stepAttempt.chain_step_id === focusChainStepId;

          if (focusChainStepId === stepAttempt.chain_step_id) {
            newDraftSession.step_attempts[i].status = ChainStepStatus.focus;
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
      if (focusChainStepId) {
        // Get all the step attempts across all sessions for the focus step.
        const draftFocusStepIndex = newDraftSession.step_attempts.findIndex(s => s.chain_step_id === focusChainStepId);
        const focusStepPastAttempts = this.chainData.getAllStepAttemptsForChainStep(focusChainStepId);
        let numTargetLevelsMet = 0;
        let lastAttemptLevel: ChainStepPromptLevel | undefined = undefined;
        let lastAttemptSessionType: ChainSessionType | undefined = undefined;

        // Look at the most recent attempts.
        for (const pastAttempt of focusStepPastAttempts.reverse()) {
          // Look at the target prompt levels vs. the actual prompt levels.
          const isConsecutive =
            lastAttemptLevel === pastAttempt.target_prompt_level && lastAttemptSessionType === pastAttempt.session_type;

          if (isConsecutive && pastAttempt.target_prompt_level === pastAttempt.prompt_level) {
            numTargetLevelsMet++;
          } else {
            numTargetLevelsMet = 0;
          }

          // If the last 2 or 3 (depending on session type) attempts were completed at the target prompt level,
          // move on to the next prompt level.
          if (
            (pastAttempt.session_type === ChainSessionType.training &&
              numTargetLevelsMet > NUM_COMPLETE_TRAINING_ATTEMPTS_FOR_MASTERY) ||
            (pastAttempt.session_type === ChainSessionType.booster &&
              numTargetLevelsMet > NUM_COMPLETE_TRAINING_ATTEMPTS_FOR_MASTERY) ||
            (pastAttempt.session_type === ChainSessionType.probe &&
              numTargetLevelsMet > NUM_COMPLETE_PROBE_ATTEMPTS_FOR_MASTERY)
          ) {
            // Set the target prompt level for the focus step in the draft session
            if (lastAttemptLevel) {
              const nextLevel = lastAttemptLevel
                ? this.getNextPromptLevel(lastAttemptLevel).key
                : ChainStepPromptLevel.partial_physical;
              newDraftSession.step_attempts[draftFocusStepIndex].target_prompt_level = nextLevel;
              break;
            }
          }

          lastAttemptLevel = pastAttempt.target_prompt_level;
          lastAttemptSessionType = pastAttempt.session_type;
        }

        // If this is a training session and target level hasn't been set yet,
        // set the target prompt level to the target prompt level from the last focus step.
        if (draftFocusStepIndex >= 0) {
          const draftFocusStepAttempt = newDraftSession.step_attempts[draftFocusStepIndex];
          if (
            (newDraftSession.session_type === ChainSessionType.training ||
              newDraftSession.session_type === ChainSessionType.booster) &&
            !draftFocusStepAttempt.target_prompt_level
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
    if (this.chainData.sessions.length < 3) {
      // The first 3-9 sessions should be probes.
      return true;
    } else {
      // There are at least 4 attempts since the last probe session.
      for (const masteryInfo of Object.values(this.masteryInfoMap)) {
        if (masteryInfo.numAttemptsSince.lastProbe !== -1) {
          return masteryInfo.numAttemptsSince.lastProbe >= 4;
        }
      }
    }

    // No probe sessions have ever been attempted. The next one should be a probe.
    return true;
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
   * Given a prompt level, returns the next prompt level in the prompt hierarchy.
   * @param promptLvl: the previous prompt level
   */
  getNextPromptLevel(promptLvl: ChainStepPromptLevel): ChainStepPromptLevelMapItem {
    const currentIndex = this.promptHierarchy.findIndex(e => e.key === promptLvl);
    const nextIndex = currentIndex > 1 ? currentIndex - 1 : 0; // 0 if prompt level is already 0 (none/independent)
    return this.promptHierarchy[nextIndex];
  }

  /** GET STEP_ATTEMPT PROMPT LEVEL */
  /**
   * determineStepAttemptPromptLevel()
   * -- determines and sets current session's focus step prompt-level
   * @param chainData : all of participant's session history data
   */
  determineStepAttemptPromptLevel(): void {
    const prevPromptLevel = this.previousFocusStep ? this.previousFocusStep.prompt_level : undefined;

    if (prevPromptLevel && this.previousFocusStep && this.previousFocusStep.completed) {
      this.setCurrPromptLevel(this.getNextPromptLevel(prevPromptLevel).key);
    } else if (prevPromptLevel && this.previousFocusStep && !this.previousFocusStep.completed) {
      this.setCurrPromptLevel(prevPromptLevel);
    } else {
      // Otherwise, start at the end of the promptHierarchy.
      this.setCurrPromptLevel(this.promptHierarchy[this.promptHierarchy.length].key);
    }
  }

  setCurrPromptLevel(prompt: ChainStepPromptLevel): void {
    if (prompt !== undefined && this.currentFocusStep) {
      this.currentFocusStep.prompt_level = prompt;
    }
  }

  /**
   * Creates an index of steps, the status for each, and the milestone dates for that step, if applicable.
   */
  private buildMasteryInfoMap(): MasteryInfoMap {
    const masteryInfoMap: MasteryInfoMap = {};
    this.chainData.sessions.forEach(session => {
      session.step_attempts.forEach(stepAttempt => {
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
        lastProbe: this.numSinceLastProbe(stepAttempts),
        firstMastered: this.numSinceFirstMastered(stepAttempts),
        boosterInitiated: this.numSinceBoosterInitiated(stepAttempts),
        boosterMastered: this.numSinceBoosterMastered(stepAttempts),
      },
    };

    // Initialize dates
    m.dateIntroduced = this.getDateFor(stepAttempts, m.numAttemptsSince.firstIntroduced);
    m.dateMastered = this.getDateFor(stepAttempts, m.numAttemptsSince.firstMastered);
    m.dateBoosterInitiated = this.getDateFor(stepAttempts, m.numAttemptsSince.boosterInitiated);
    m.dateBoosterMastered = this.getDateFor(stepAttempts, m.numAttemptsSince.boosterMastered);

    // Set step status
    m.stepStatus = this.getStepStatus(stepAttempts, m); // TODO

    return m;
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
    let n = -1;
    let completedOnce = false;
    stepAttempts.forEach(stepAttempt => {
      if (stepAttempt.completed) {
        completedOnce = true;
      }

      if (completedOnce) {
        n++;
      }
    });

    return n;
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step was
   * last completed successfully
   * @param stepAttempts
   */
  numSinceLastCompleted(stepAttempts: StepAttempt[]): number {
    let lastCompletedIndex = -1;

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

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.completed && !stepAttempt.was_prompted) {
        lastCompletedIndex = i;
      }
    });

    return stepAttempts.length - (lastCompletedIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the last probe session.
   * If no probe sessions have ever been completed, returns -1.
   *
   * @param stepAttempts
   */
  numSinceLastProbe(stepAttempts: StepAttempt[]): number {
    let lastProbeIndex = -1;

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
      const stepIndex = stepAttempts.findIndex(s => s === firstMasteredStep);
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
      stepAttempt.completed &&
      stepAttempt.session_type === ChainSessionType.probe &&
      stepAttempt.prompt_level === ChainStepPromptLevel.none
    );
  }

  /**
   * Returns true if the given step was:
   * - a training session AND
   * - the focus step AND
   * - completed AND
   * - at the target prompt level
   * @param stepAttempt
   */
  isFocusStepComplete(stepAttempt: StepAttempt): boolean {
    return !!(
      stepAttempt.completed &&
      stepAttempt.session_type === ChainSessionType.training &&
      !!stepAttempt.was_focus_step &&
      stepAttempt.target_prompt_level === stepAttempt.prompt_level
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
    let numConsecutiveCompleteProbes = -1;
    let numConsecutiveCompleteTraining = -1;
    let prevAttempt: StepAttempt | undefined = undefined;

    for (const thisAttempt of stepAttempts) {
      if (thisAttempt.completed) {
        const isConsecutive = prevAttempt ? prevAttempt.session_type === thisAttempt.session_type : false;

        // Count consecutive session types
        if (this.isProbeStepComplete(thisAttempt)) {
          numConsecutiveCompleteProbes = isConsecutive ? numConsecutiveCompleteProbes + 1 : 1;
          numConsecutiveCompleteTraining = 0;
        } else if (this.isFocusStepComplete(thisAttempt)) {
          numConsecutiveCompleteProbes = 0;
          numConsecutiveCompleteTraining = isConsecutive ? numConsecutiveCompleteTraining + 1 : 1;
        }
      } else {
        numConsecutiveCompleteProbes = -1;
        numConsecutiveCompleteTraining = -1;
      }

      if (
        numConsecutiveCompleteProbes === NUM_COMPLETE_PROBE_ATTEMPTS_FOR_MASTERY ||
        numConsecutiveCompleteTraining === NUM_COMPLETE_TRAINING_ATTEMPTS_FOR_MASTERY
      ) {
        return thisAttempt;
      }

      prevAttempt = thisAttempt;
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
    if (stepAttempt.session_type === ChainSessionType.probe) {
      return !(stepAttempt.was_prompted || (stepAttempt.had_challenging_behavior && !stepAttempt.completed));
    } else if (stepAttempt.session_type === ChainSessionType.training && stepAttempt.was_focus_step) {
      return (
        stepAttempt.status === ChainStepStatus.mastered &&
        !stepAttempt.was_prompted &&
        stepAttempt.prompt_level === stepAttempt.target_prompt_level
      );
    } else {
      return !!(
        stepAttempt.status === ChainStepStatus.mastered &&
        !stepAttempt.was_prompted &&
        !stepAttempt.had_challenging_behavior &&
        stepAttempt.completed
      );
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
    let numConsecutiveIncompleteProbes = -1;
    let numConsecutiveIncompleteTraining = -1;
    let lastSessionType: ChainSessionType | undefined = undefined;
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
            const isConsecutive = lastSessionType === stepAttempt.session_type;

            // Count consecutive session types
            if (stepAttempt.session_type === ChainSessionType.probe) {
              numConsecutiveIncompleteProbes = isConsecutive ? numConsecutiveIncompleteProbes + 1 : 1;
              numConsecutiveIncompleteTraining = 0;
            } else if (stepAttempt.session_type === ChainSessionType.training) {
              numConsecutiveIncompleteProbes = 0;
              numConsecutiveIncompleteTraining = isConsecutive ? numConsecutiveIncompleteTraining + 1 : 1;
            }

            // If the number of consecutive incomplete sessions is at or over the threshold,
            // the next step should be a booster.
            if (
              numConsecutiveIncompleteProbes > NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER ||
              numConsecutiveIncompleteTraining > NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER
            ) {
              // The step after this one will be the first booster step.
              needsBooster = true;
            }
          }
        }
      }

      lastSessionType = stepAttempt.session_type;
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
    let numConsecutiveIncompleteProbes = -1;
    let numConsecutiveIncompleteTraining = -1;
    let lastSessionType: ChainSessionType | undefined = undefined;

    // Skip if there are fewer than 3 attempts, or the step has never been mastered.
    if (stepAttempts.length < 3 || !this.stepFirstMastered(stepAttempts)) {
      return false;
    }

    // Only need to look at the last 3 sessions, in reverse date order.
    const lastFewSessions = stepAttempts.slice(-3).reverse();
    for (const stepAttempt of lastFewSessions) {
      if (!this.stepIsComplete(stepAttempt)) {
        // Post-mastery attempt where step was not completed.
        const isConsecutive = lastSessionType === stepAttempt.session_type;

        // Count consecutive session types
        if (stepAttempt.session_type === ChainSessionType.probe) {
          numConsecutiveIncompleteProbes = isConsecutive ? numConsecutiveIncompleteProbes + 1 : 1;
          numConsecutiveIncompleteTraining = 0;
        } else if (stepAttempt.session_type === ChainSessionType.training) {
          numConsecutiveIncompleteProbes = 0;
          numConsecutiveIncompleteTraining = isConsecutive ? numConsecutiveIncompleteTraining + 1 : 1;
        }

        // If the number of consecutive incomplete sessions is at or over the threshold,
        // the next step should be a booster.
        if (
          numConsecutiveIncompleteProbes > NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER ||
          numConsecutiveIncompleteTraining > NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER
        ) {
          return true;
        }
      }

      lastSessionType = stepAttempt.session_type;
    }

    return false;
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
   * Given a chain step ID, returns true if the next attempt for that chain step needs to be the focus step.
   * Otherwise, returns false.
   *
   * @param stepAttempts
   */
  chainStepNeedsFocus(chainStepId: number): boolean {
    // Check for already-mastered (no booster needed yet) and booster-mastered steps
    const masteredChainStepIds = this.getMasteredChainStepIds();
    const wasMastered = masteredChainStepIds.includes(chainStepId);

    if (wasMastered) {
      // It's been mastered already, and no booster is needed. Return false.
      return false;
    }

    return this.nextFocusChainStepId === chainStepId;
  }

  /**
   * Given a list of step attempts, returns the number of attempts after
   * the first booster session was introduced.
   * @param stepAttempts
   */
  numSinceBoosterInitiated(stepAttempts: StepAttempt[]): number {
    const boosterStep = this.getBoosterStep(stepAttempts);

    if (boosterStep && boosterStep.id) {
      const boosterStepIndex = stepAttempts.findIndex(s => s.id === boosterStep.id);
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
      const boosterStepIndex = stepAttempts.findIndex(s => s.id === boosterStep.id);
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
    if (
      // Step has been mastered, and no booster is required OR
      (m.dateMastered && m.numAttemptsSince.firstMastered >= 0 && !m.dateBoosterInitiated) ||
      // Step required booster, and it was mastered again
      (m.dateBoosterMastered && m.numAttemptsSince.boosterMastered >= 0)
    ) {
      return ChainStepStatus.mastered;
    }

    if (
      // Step has been introduced, but not mastered yet AND
      m.dateIntroduced &&
      !m.dateMastered &&
      // Challenging behavior occurred more than 3 attempts in a row OR
      (m.numAttemptsSince.lastCompletedWithoutChallenge >= NUM_CHALLENGING_ATTEMPTS_FOR_FOCUS ||
        // Prompting was required more than 3 attempts in a row
        m.numAttemptsSince.lastCompletedWithoutPrompt >= NUM_PROMPTED_ATTEMPTS_FOR_FOCUS)
    ) {
      return ChainStepStatus.focus;
    }

    if (m.dateBoosterMastered) {
      return ChainStepStatus.focus;
    }

    if (m.dateBoosterInitiated || this.chainStepNeedsBooster(stepAttempts)) {
      return ChainStepStatus.booster_needed;
    }

    return ChainStepStatus.not_complete;
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
    const masteredSteps = this.chainSteps.filter(chainStep => this.chainStepHasBeenMastered(chainStep.id));
    return masteredSteps.map(s => s.id);
  }

  /**
   * Returns true if the given chain step has already been mastered (no booster needed yet) or been re-mastered
   * after a booster.
   * @param chain_step_id
   */
  chainStepHasBeenMastered(chain_step_id: number): boolean {
    const m = this.masteryInfoMap[`${chain_step_id}`];
    return !!(
      m &&
      ((m.dateMastered && !m.dateBoosterInitiated && !m.dateBoosterMastered) ||
        (m.dateMastered && m.dateBoosterInitiated && m.dateBoosterMastered))
    );
  }

  /**
   * Returns a list of IDs of chain steps that have been focused on, but have either
   * NOT been mastered yet OR need a booster.
   */
  getUnmasteredFocusedChainStepIds(): number[] {
    // Remove all the mastered chain steps from the focused chain step ids.
    return this.focusedChainStepIds.filter(s => !this.masteredChainStepIds.includes(s));
  }
}
