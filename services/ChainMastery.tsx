import {
  NUM_COMPLETE_ATTEMPTS_FOR_MASTERY,
  NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER,
  NUM_MIN_PROBE_SESSIONS,
  NUM_PROBE_SESSIONS_BETWEEN_TRAINING,
  NUM_TRAINING_SESSIONS_BETWEEN_PROBES,
} from '../constants/MasteryAlgorithm';
import { ChainData, SkillstarChain } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { MasteryInfo, MasteryInfoMap } from '../types/chain/MasteryInfoMap';
import { Milestones, MilestonesMap } from '../types/chain/MilestonesMap';
import { PromptLevel, PromptLevelMap } from '../types/chain/PromptLevelMap';
import {
  ChainStepPromptLevel,
  ChainStepPromptLevelMap,
  ChainStepPromptLevelMapItem,
  ChainStepStatus,
  StepAttempt,
  StepAttemptField,
  StepAttemptFieldName,
} from '../types/chain/StepAttempt';
import { StepAttemptsMap } from '../types/chain/StepAttemptsMap';

/**
 * Holds the chain data and mastery info for each step in the chain data.
 * Also provides quick access to the current chain session, focus step, and
 * mastery state for each step in the current session.
 */
export class ChainMastery {
  static promptHierarchy = Object.values(ChainStepPromptLevelMap).sort((a, b) => a.order - b.order);
  chainSteps: ChainStep[];
  chainData: ChainData;
  stepAttemptsMap: StepAttemptsMap;
  milestonesMap: MilestonesMap;
  promptLevelMap: PromptLevelMap;
  masteryInfoMap: MasteryInfoMap;
  draftSession: ChainSession;
  focusedChainStepIds: number[];
  unmasteredChainStepIds: number[];
  masteredChainStepIds: number[];
  unmasteredChainStepIdsToFocus: number[];
  unmasteredFocusedChainStepIds: number[];
  boosterChainStepIds: number[];
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
    this.stepAttemptsMap = this.buildStepAttemptsMap();
    this.milestonesMap = this.buildMilestonesMap();
    this.focusedChainStepIds = this.getFocusedChainStepIds();
    this.masteredChainStepIds = this.getMasteredChainStepIds();
    this.unmasteredChainStepIds = this.getUnmasteredChainStepIds();
    this.boosterChainStepIds = this.getBoosterChainStepIds();
    this.unmasteredChainStepIdsToFocus = this.getUnmasteredChainStepIdsToFocus();
    this.unmasteredFocusedChainStepIds = this.getUnmasteredFocusedChainStepIds();
    this.promptLevelMap = this.buildPromptLevelMap();
    this.masteryInfoMap = this.buildMasteryInfoMap();
    this.draftSession = this.buildNewDraftSession();
  }

  /**
   * Returns a map of step attempts by chain step ID.
   */
  buildStepAttemptsMap(): StepAttemptsMap {
    const stepAttemptsMap: StepAttemptsMap = [];

    this.chainSteps.forEach((chainStep) => {
      stepAttemptsMap[chainStep.id] = [];
    });

    this.chainData.sessions.forEach((session) => {
      session.step_attempts.forEach((stepAttempt) => {
        stepAttemptsMap[stepAttempt.chain_step_id].push(stepAttempt);
      });
    });

    return stepAttemptsMap;
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
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    return stepAttempts.filter((stepAttempt) => ChainMastery.isFocusOrBoosterStep(stepAttempt));
  }

  /**
   * Returns number of stars (0-3) indicating prior step completion:
   *
   * For the focus or booster-needed step, the number of stars should reflect the previous successful* attempts
   * in prior training sessions only. They should NOT count probe sessions.
   * *actual prompt level needed meets or exceeds target prompt level
   *
   * For a not-yet-started step attempt in a training session, the number of stars should reflect the number of
   * previous sessions (counting probe AND training sessions) with no challenging behavior.
   *
   * For a mastered or booster-mastered step, the number of stars should reflect the previous sessions (counting
   * probe AND training sessions) where the step was completed independently.
   *
   * @param chainStepId
   */
  getNumStars(chainStepId: number): number {
    const masteryInfo = this.masteryInfoMap[chainStepId];
    const isMastered = [ChainStepStatus.mastered, ChainStepStatus.booster_mastered].includes(masteryInfo.stepStatus);

    const recentStepAttempts = this.stepAttemptsMap[chainStepId].slice().reverse(); // slice copies the array, since reverse mutates it.
    const lastPromptLevel = masteryInfo.promptLevel;
    let numAttempts = 0;
    let numStars = isMastered ? NUM_COMPLETE_ATTEMPTS_FOR_MASTERY : 0;
    const isFocusOrBooster = [ChainStepStatus.focus, ChainStepStatus.booster_needed].includes(masteryInfo.stepStatus);

    if (recentStepAttempts.length > 0 && lastPromptLevel) {
      for (const stepAttempt of recentStepAttempts) {
        const isComplete = ChainMastery.stepIsComplete(stepAttempt);

        // If the step is Focus/Booster Needed, count successful training sessions only.
        if (isFocusOrBooster) {
          if (stepAttempt.session_type !== ChainSessionType.probe && ChainMastery.isFocusOrBoosterStep(stepAttempt)) {
            // Only count training sessions.
            numAttempts++;

            if (lastPromptLevel === stepAttempt.target_prompt_level && isComplete) {
              numStars++;
            }
          }
        }

        // If the step is Mastered or Booster Mastered, subtract recent failures from max number of stars.
        else if (isMastered) {
          // Count both training sessions and probes.
          numAttempts++;

          if (!isComplete) {
            numStars--;
            if (numStars === 0) break;
          }
        }

        // If the step is Not Yet Started, count only attempts with no challenging behavior.
        else {
          // Count both training sessions and probes.
          numAttempts++;

          if (!stepAttempt.had_challenging_behavior) {
            numStars++;
          }
        }

        if (numStars >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY || numAttempts >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) break;
      }
    }

    return numStars;
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
   * Returns the chain step ID that should be focused on next, or undefined if all steps have been mastered.
   */
  get nextFocusChainStepId(): number | undefined {
    return this.unmasteredChainStepIdsToFocus[0];
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
   * Returns a list of IDs of the chain steps that need a booster in the next new draft session.
   * If no steps need a booster, returns an empty array.
   */
  getBoosterChainStepIds(): number[] {
    return this.chainSteps
      .filter((chainStep) => this.chainStepNeedsBooster(chainStep.id))
      .map((chainStep) => chainStep.id);
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
    const focusChainStepId: number | undefined = this.nextFocusChainStepId;

    // If no session type is passed in as a parameter, decide what kind of session this should be.
    if (!sessionType) {
      // Should the draft session be...
      // ...a probe session?
      if (this.newDraftSessionShouldBeProbeSession()) {
        newDraftSession.session_type = ChainSessionType.probe;
      }

      // ...a booster?
      else if (this.boosterChainStepIds && this.boosterChainStepIds.length > 0) {
        newDraftSession.session_type = ChainSessionType.booster;
      }

      // ...a training session?
      else if (focusChainStepId !== undefined) {
        newDraftSession.session_type = ChainSessionType.training;
      }
    }

    // If all steps have been mastered, set the session type to probe.
    if (
      focusChainStepId !== undefined &&
      this.boosterChainStepIds.length === 0 &&
      this.masteredChainStepIds.length === this.chainSteps.length
    ) {
      newDraftSession.session_type = ChainSessionType.probe;
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

    // Mark which chain step should be the focus step, if applicable.
    newDraftSession.step_attempts.forEach((stepAttempt) => {
      const masteryInfo = this.masteryInfoMap[stepAttempt.chain_step_id];
      const nonFocusStatuses = [
        ChainStepStatus.mastered,
        ChainStepStatus.booster_mastered,
        ChainStepStatus.booster_needed,
      ];

      // Mark mastered, booster_mastered, and booster_needed steps as not needing focus.
      if (nonFocusStatuses.includes(masteryInfo.stepStatus)) {
        stepAttempt.was_focus_step = false;
      }

      // Mark which chain step should be the focus step.
      else {
        stepAttempt.was_focus_step = stepAttempt.chain_step_id === focusChainStepId;
      }

      // Set the target prompt levels for all steps.
      stepAttempt.target_prompt_level = masteryInfo.promptLevel;

      // Store the draft focus step attempt for convenience.
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
    const numSessions = this.chainData.sessions.length;
    if (numSessions < NUM_MIN_PROBE_SESSIONS) {
      // The first 3-9 sessions should be probes.
      return true;
    }

    // If all steps have been mastered and no boosters are needed, return true.
    if (
      this.unmasteredChainStepIds.length === 0 &&
      this.boosterChainStepIds.length === 0 &&
      this.masteredChainStepIds.length === this.chainSteps.length
    ) {
      return true;
    }

    if (!this.hasHadTrainingSession) {
      return false;
    }

    // 3 probe sessions should occur between every set of 12 training sessions
    let numInitialProbes = 0;
    for (const session of this.chainData.sessions) {
      if (session.session_type === ChainSessionType.probe) {
        numInitialProbes++;
      } else {
        break;
      }
    }

    const numPostProbeSessions = numSessions - numInitialProbes;
    const n = NUM_MIN_PROBE_SESSIONS + numPostProbeSessions;
    const a = NUM_COMPLETE_ATTEMPTS_FOR_MASTERY;
    const b = NUM_TRAINING_SESSIONS_BETWEEN_PROBES;
    const c = NUM_PROBE_SESSIONS_BETWEEN_TRAINING;
    const d = (b + c) / a;

    return Math.floor(n / a) % d === 0;
  }

  /**
   * Given a prompt level, returns the next prompt level in the prompt hierarchy.
   * @param promptLvl: the current prompt level
   */
  static getNextPromptLevel(promptLvl: ChainStepPromptLevel): ChainStepPromptLevelMapItem {
    const currentIndex = ChainMastery.promptHierarchy.findIndex((e) => e.key === promptLvl);
    const nextIndex = currentIndex > 1 ? currentIndex - 1 : 0; // 0 if prompt level is already 0 (none/independent)
    return ChainMastery.promptHierarchy[nextIndex];
  }

  /**
   * Given a prompt level, returns the previous prompt level in the prompt hierarchy.
   * @param promptLvl: the current prompt level
   */
  static getPrevPromptLevel(promptLvl: ChainStepPromptLevel): ChainStepPromptLevelMapItem {
    const maxIndex = ChainMastery.promptHierarchy.length - 1;
    const currentIndex = ChainMastery.promptHierarchy.findIndex((e) => e.key === promptLvl);
    const prevIndex = currentIndex >= maxIndex ? maxIndex : currentIndex + 1; // 3 if prompt level is already 3 (full_physical)
    return ChainMastery.promptHierarchy[prevIndex];
  }

  /**
   * Returns the date of the step attempt where numAttemptsSince was set to 0, if applicable. Otherwise, returns undefined.
   * @param stepAttempts
   * @param numAttemptsSince
   */
  static getDateFor(stepAttempts: StepAttempt[], numAttemptsSince: number): Date | undefined {
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
      if (!ChainMastery.stepIsComplete(stepAttempt)) {
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
   * Given a list of step attempts, returns the number of attempts since the last training or booster session.
   * If no training sessions have ever been completed, returns -1.
   *
   * @param stepAttempts
   */
  numSinceLastTraining(stepAttempts: StepAttempt[]): number {
    let lastTrainingIndex = -1;

    if (!stepAttempts || stepAttempts.length === 0) {
      return -1;
    }

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.session_type !== ChainSessionType.probe) {
        lastTrainingIndex = i;
      }
    });

    return stepAttempts.length - (lastTrainingIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the first time the
   * step was mastered. If the step has never been mastered, returns -1.
   *
   * @param chainStepId
   */
  numSinceFirstMastered(chainStepId: number): number {
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    const milestonesMap = this.milestonesMap[chainStepId];
    const firstMasteredStep = milestonesMap.firstMasteredStep;

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
   *
   * @param stepAttempt
   */
  static isProbeStepComplete(stepAttempt: StepAttempt): boolean {
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
  static isStepFullyCompleted(stepAttempt: StepAttempt): boolean {
    // return !!(!stepAttempt.was_prompted && !stepAttempt.had_challenging_behavior && stepAttempt.completed);
    return !!(!stepAttempt.was_prompted && stepAttempt.completed);
  }

  static isFocusOrBoosterStep(stepAttempt: StepAttempt): boolean {
    return !!(
      stepAttempt.session_type &&
      [ChainSessionType.training, ChainSessionType.booster].includes(stepAttempt.session_type) &&
      (stepAttempt.was_focus_step || stepAttempt.status === ChainStepStatus.booster_needed)
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
  static isFocusStepComplete(stepAttempt: StepAttempt): boolean {
    return !!(
      ChainMastery.isFocusOrBoosterStep(stepAttempt) &&
      stepAttempt.completed &&
      (!stepAttempt.was_prompted ||
        ChainMastery.promptLevelIsBetterThanTarget(stepAttempt.prompt_level, stepAttempt.target_prompt_level))
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
  static isFocusStepMastered(stepAttempt: StepAttempt): boolean {
    return !!(
      ChainMastery.isFocusOrBoosterStep(stepAttempt) &&
      stepAttempt.completed &&
      stepAttempt.prompt_level === ChainStepPromptLevel.none &&
      !stepAttempt.was_prompted
    );
  }

  /**
   * Returns true if the given step meets one of the following criteria:
   * - For probe session, completed with no prompting or interfering challenging behavior
   * - For training session:
   *   - If it was the focus step, completed at the target prompting level
   *   - If not the focus step, completed with no prompting or interfering challenging behavior
   * @param stepAttempt
   */
  static stepIsComplete(stepAttempt: StepAttempt): boolean {
    // Probe attempt is complete with no prompting
    if (stepAttempt.session_type === ChainSessionType.probe) {
      return ChainMastery.isProbeStepComplete(stepAttempt);
    }

    // Focus step attempt was completed either with no prompting or at the target prompt level
    else if (ChainMastery.isFocusOrBoosterStep(stepAttempt)) {
      return ChainMastery.isFocusStepComplete(stepAttempt);
    }

    // Non-focus training/booster step completed with no prompting or challenging behavior
    else {
      return ChainMastery.isStepFullyCompleted(stepAttempt);
    }
  }

  /**
   * Given a list of step attempts, returns true if the next attempt needs to be a booster.
   *
   * @param chainStepId
   */
  chainStepNeedsBooster(chainStepId: number): boolean {
    const stepAttempts = this.stepAttemptsMap[chainStepId];

    // Skip if there are fewer than 3 attempts.
    if (stepAttempts.length < NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER) {
      return false;
    }

    const lastStep = stepAttempts[stepAttempts.length - 1];

    // Throw an error if the last step has no status.
    if (lastStep.status === undefined) {
      throw new Error('Step attempt has no status.');
    }

    // Skip if the step has never been mastered.
    const postMasteryStatuses = [
      ChainStepStatus.mastered,
      ChainStepStatus.booster_needed,
      ChainStepStatus.booster_mastered,
    ];
    if (!postMasteryStatuses.includes(lastStep.status)) {
      return false;
    }

    // Current booster step has been mastered if ALL of last 3 steps:
    // - were at independent prompt level AND
    // - were successful.
    if (lastStep.status === ChainStepStatus.booster_needed) {
      return !this.isBoosterRemastered(chainStepId);
    }

    // Booster is needed if last 3 step attempts ALL failed.
    return stepAttempts.slice(-NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER).every((s) => !ChainMastery.stepIsComplete(s));
  }

  /**
   * Returns true if the given chain step is a booster and has been remastered. Otherwise, returns false.
   * @param chainStepId
   */
  isBoosterRemastered(chainStepId: number): boolean {
    const stepAttempts = this.stepAttemptsMap[chainStepId];

    // Return false if there are fewer than 3 attempts.
    if (stepAttempts.length < NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER) {
      return false;
    }

    const lastStep = stepAttempts[stepAttempts.length - 1];

    // Return false if status is undefined or not a booster step
    if (lastStep.status === undefined || lastStep.status !== ChainStepStatus.booster_needed) {
      return false;
    }

    // Return true if all 3 of the last attempts were successful with no prompting.
    return stepAttempts.slice(-NUM_COMPLETE_ATTEMPTS_FOR_MASTERY).every((stepAttempt) => {
      if (stepAttempt.session_type === ChainSessionType.probe) {
        return ChainMastery.isProbeStepComplete(stepAttempt);
      } else {
        return ChainMastery.isFocusStepMastered(stepAttempt);
      }
    });
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
    return this.focusedChainStepIds.includes(chainStepId);
  }

  /**
   * Returns the id of the chain step that was focused on lately across all chain sessions (i.e. the last one by date.)
   */
  get latestFocusedChainStepId(): number | undefined {
    if (this.focusedChainStepIds.length > 0) {
      return this.focusedChainStepIds[this.focusedChainStepIds.length - 1];
    }
  }

  /**
   * Given a mastery info for a chain step, returns true if the next attempt (i.e., in the next draft session)
   * for that chain step needs to be the focus step. Otherwise, returns false.
   *
   * @param m: MasteryInfo object for a given chain step
   */
  chainStepNeedsFocus(m: MasteryInfo): boolean {
    return !!(
      m.dateIntroduced && // Step has been introduced AND
      !m.dateMastered && // ...but has not been mastered yet AND
      this.unmasteredChainStepIdsToFocus.length > 0 && // ...is first in the list of steps needing focus.
      this.unmasteredChainStepIdsToFocus[0] === m.chainStepId
    );
  }

  /**
   * Given a chain step ID, returns the number of attempts since
   * the first booster session for that chain step was introduced. Returns -1
   * if the step has never had a booster.
   * @param chainStepId
   */
  numSinceBoosterInitiated(chainStepId: number): number {
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    const milestonesMap = this.milestonesMap[chainStepId];
    const boosterStep = milestonesMap.firstBoosterStep;

    if (boosterStep) {
      const boosterStepIndex = stepAttempts.findIndex((s) => s === boosterStep);
      if (boosterStepIndex !== -1) {
        return stepAttempts.length - (boosterStepIndex + 1);
      }
    } else if (this.boosterChainStepIds.includes(chainStepId)) {
      return 0;
    }

    return -1;
  }

  /**
   * Given a chain step ID, returns the number of attempts since a booster
   * session was attempted. Returns -1 if no booster has ever been attempted.
   *
   * @param chainStepId
   */
  numSinceBoosterAttempted(chainStepId: number): number {
    // Find the first step after master that the booster was needed.
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    const milestonesMap = this.milestonesMap[chainStepId];
    const boosterStep = milestonesMap.firstBoosterStep;
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
   * Given a chain step ID, returns the number of attempts after
   * the last booster session was mastered. Returns -1 if no booster or
   * if booster not mastered yet.
   *
   * @param chainStepId
   */
  numSinceBoosterMastered(chainStepId: number): number {
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    const milestonesMap = this.milestonesMap[chainStepId];
    const boosterMasteredStep = milestonesMap.boosterMasteredStep;

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
   * @param stepAttempts
   * @param m: MasteryInfo object, populated with milestone dates and numAttemptsSince.
   */
  getStepStatus(stepAttempts: StepAttempt[], m: MasteryInfo): ChainStepStatus {
    const needsBooster = this.boosterChainStepIds.includes(m.chainStepId);

    // No step attempts yet.
    if (!stepAttempts || stepAttempts.length === 0) {
      return ChainStepStatus.not_yet_started;
    }

    if (m.dateBoosterMastered && !needsBooster) {
      // Step required booster, and it was mastered again
      return ChainStepStatus.booster_mastered;
    }

    if (needsBooster) {
      return ChainStepStatus.booster_needed;
    }

    // Step has been mastered, and no booster is required
    if (m.dateMastered) {
      return ChainStepStatus.mastered;
    }

    // Step should be focused on next
    if (this.chainStepNeedsFocus(m) && this.shouldBeNextFocusStep(m)) {
      return ChainStepStatus.focus;
    }

    return ChainStepStatus.not_complete;
  }

  /**
   *
   * @param m: MasteryInfo object for the chain step
   */
  shouldBeNextFocusStep(m: MasteryInfo): boolean {
    const mostRecentFocusStepId = this.latestFocusedChainStepId;
    const isMostRecentFocusStep = mostRecentFocusStepId !== undefined && mostRecentFocusStepId === m.chainStepId;

    // If this step was most recently focused, make sure it hasn't been mastered already.
    if (isMostRecentFocusStep) {
      return !this.chainStepHasBeenMastered(m.chainStepId);
    }

    // Look at the most recent focus step.
    else if (mostRecentFocusStepId !== undefined) {
      // The most recent focus step has been mastered.
      if (this.chainStepHasBeenMastered(mostRecentFocusStepId)) {
        // Find the next focus step ID.
        const remainingFocusStepIds = this.unmasteredChainStepIdsToFocus.filter((s) => s !== mostRecentFocusStepId);
        return remainingFocusStepIds.length > 0 && m.chainStepId === remainingFocusStepIds[0];
      } else {
        // The most recent focus step is not this one, and it hasn't been mastered yet.
        return false;
      }
    } else {
      // If it hasn't been focused on yet, it'll be next in the list of chain step IDs to focus on.
      return this.unmasteredChainStepIdsToFocus.length > 0 && m.chainStepId === this.unmasteredChainStepIdsToFocus[0];
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
    const masteredSteps = this.masteredChainStepIds;
    const unmasteredSteps = this.chainSteps.filter((chainStep) => !masteredSteps.includes(chainStep.id));
    return unmasteredSteps.map((s) => s.id);
  }

  /**
   * Returns true if the given chain step has already been mastered (no booster needed yet) or been re-mastered
   * after a booster.
   * @param chainStepId
   */
  chainStepHasBeenMastered(chainStepId: number): boolean {
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    let wasBoosterInitiated = false;
    let wasBoosterMastered = false;
    let wasMastered = false;

    stepAttempts.forEach((stepAttempt) => {
      if (!wasMastered && stepAttempt.status === ChainStepStatus.mastered) {
        wasMastered = true;
      } else if (wasMastered && stepAttempt.status === ChainStepStatus.booster_needed) {
        wasBoosterInitiated = true;
        wasBoosterMastered = false; // Un-master if another booster needed.
      } else if (wasMastered && !wasBoosterMastered && stepAttempt.status === ChainStepStatus.booster_mastered) {
        wasBoosterMastered = true;
      }
    });

    // Check if the chain step was just mastered in the last session.
    if (
      (!wasMastered || (wasBoosterInitiated && !wasBoosterMastered)) &&
      stepAttempts.length >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY
    ) {
      const last3Attempts = stepAttempts.slice(-NUM_COMPLETE_ATTEMPTS_FOR_MASTERY);
      const allProbes = last3Attempts.every((stepAttempt) => stepAttempt.session_type === ChainSessionType.probe);
      const allSamePromptLevel = new Set(last3Attempts.map((s) => s.target_prompt_level)).size === 1;
      const allSuccessful =
        allSamePromptLevel &&
        last3Attempts.every((stepAttempt) => {
          if (
            stepAttempt.status === ChainStepStatus.booster_needed || // The attempt was a booster
            stepAttempt.was_focus_step || // This step was the focus
            allProbes // All of the last 3 steps were probes
          ) {
            if (stepAttempt.session_type === ChainSessionType.probe) {
              return ChainMastery.isProbeStepComplete(stepAttempt);
            } else if (ChainMastery.isFocusOrBoosterStep(stepAttempt)) {
              return ChainMastery.isFocusStepMastered(stepAttempt);
            } else {
              return ChainMastery.isStepFullyCompleted(stepAttempt);
            }
          } else {
            return false;
          }
        });

      if (allSuccessful) {
        return true;
      }
    }

    return wasBoosterMastered || (wasMastered && !wasBoosterInitiated);
  }

  /**
   * Returns a list of IDs of unmastered chain steps that need to be focused on AND have never been mastered.
   */
  getUnmasteredChainStepIdsToFocus(): number[] {
    if (this.chainData.sessions.length < NUM_MIN_PROBE_SESSIONS) {
      return [];
    } else {
      // Remove all the mastered chain steps from the focused chain step ids.
      if (this.boosterChainStepIds.length === 0) {
        return this.unmasteredChainStepIds;
      } else {
        return this.unmasteredChainStepIds.filter((s) => !this.boosterChainStepIds.includes(s));
      }
    }
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
    this.stepAttemptsMap = this.buildStepAttemptsMap();
    this.milestonesMap = this.buildMilestonesMap();
    this.focusedChainStepIds = this.getFocusedChainStepIds();
    this.masteredChainStepIds = this.getMasteredChainStepIds();
    this.unmasteredChainStepIds = this.getUnmasteredChainStepIds();
    this.boosterChainStepIds = this.getBoosterChainStepIds();
    this.unmasteredChainStepIdsToFocus = this.getUnmasteredChainStepIdsToFocus();
    this.unmasteredFocusedChainStepIds = this.getUnmasteredFocusedChainStepIds();
    this.promptLevelMap = this.buildPromptLevelMap();
    this.masteryInfoMap = this.buildMasteryInfoMap();
    this.draftSession = this.buildNewDraftSession();
  }

  /**
   * Returns true if one of the following is true:
   * - there are fewer than 3 past sessions OR
   * - no training session has ever been attempted OR
   * - it's been 12 sessions since the last probe
   * - the last session was a probe, and there are have been fewer than 3 probe sessions run
   */
  canStartProbeSession(): boolean {
    const numSessions = this.chainData.sessions.length;
    const hasHadTrainingSession = this.hasHadTrainingSession;
    const allStepsMastered = this.unmasteredChainStepIds.length === 0;
    const numSinceLastProbe = this.masteryInfoMap[0].numAttemptsSince.lastProbe;
    const numSinceLastTraining = this.masteryInfoMap[0].numAttemptsSince.lastTraining;

    return (
      allStepsMastered ||
      numSessions < NUM_MIN_PROBE_SESSIONS ||
      !hasHadTrainingSession ||
      (numSinceLastTraining === 0 && numSinceLastProbe >= NUM_TRAINING_SESSIONS_BETWEEN_PROBES) ||
      (numSinceLastProbe === 0 && numSinceLastTraining < NUM_PROBE_SESSIONS_BETWEEN_TRAINING)
    );
  }

  /**
   * Returns true if one of the following is true:
   * - there are more than 3 past sessions, but no training session has ever been attempted OR
   * - it's been fewer than 12 sessions since the last probe OR
   * - the last 3 sessions were probes
   */
  canStartTrainingSession(): boolean {
    const numSessions = this.chainData.sessions.length;
    const hasHadTrainingSession = this.hasHadTrainingSession;
    const allStepsMastered = this.unmasteredChainStepIds.length === 0;
    const numSinceLastProbe = this.masteryInfoMap[0].numAttemptsSince.lastProbe;
    const numSinceLastTraining = this.masteryInfoMap[0].numAttemptsSince.lastTraining;

    return (
      !allStepsMastered &&
      numSessions >= NUM_MIN_PROBE_SESSIONS &&
      (!hasHadTrainingSession ||
        numSinceLastProbe < NUM_TRAINING_SESSIONS_BETWEEN_PROBES ||
        numSinceLastTraining === NUM_PROBE_SESSIONS_BETWEEN_TRAINING)
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
    this.draftSession.step_attempts.forEach((stepAttempt) => {
      if (stepAttempt.chain_step_id === chainStepId) {
        // Set the value of the fieldName for a specific step
        (stepAttempt[fieldName] as any) = fieldValue;
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
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    const promptLevelMap = this.promptLevelMap[chainStepId];

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
        lastTraining: this.numSinceLastTraining(stepAttempts),
        firstMastered: this.numSinceFirstMastered(chainStepId),
        boosterInitiated: this.numSinceBoosterInitiated(chainStepId),
        boosterLastAttempted: this.numSinceBoosterAttempted(chainStepId),
        boosterMastered: this.numSinceBoosterMastered(chainStepId),
      },

      promptLevel: promptLevelMap.targetPromptLevel,
    };

    // Initialize dates
    m.dateIntroduced = ChainMastery.getDateFor(stepAttempts, m.numAttemptsSince.firstIntroduced);
    m.dateMastered = ChainMastery.getDateFor(stepAttempts, m.numAttemptsSince.firstMastered);
    m.dateBoosterInitiated = ChainMastery.getDateFor(stepAttempts, m.numAttemptsSince.boosterInitiated);
    m.dateBoosterMastered = ChainMastery.getDateFor(stepAttempts, m.numAttemptsSince.boosterMastered);

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
  static promptLevelIsBetterThanTarget(
    actualPromptLevel: ChainStepPromptLevel | undefined,
    targetPromptLevel: ChainStepPromptLevel | undefined,
  ): boolean {
    const actualPromptLevelIndex = ChainMastery.promptHierarchy.findIndex((p) => p.key === actualPromptLevel);
    const targetPromptLevelIndex = ChainMastery.promptHierarchy.findIndex((p) => p.key === targetPromptLevel);

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
   * Adds the current draft session to the chain data, updates the chain data,
   * updates the mastery info, and generates a new draft session.
   */
  resetDraftSession(): void {
    this.draftSession = this.buildNewDraftSession();
  }

  /**
   * Creates an index of chain steps, the milestone step attempts, and target prompt level, if applicable.
   */
  private buildMilestonesMap(): MilestonesMap {
    const milestonesMap: MilestonesMap = {};
    this.chainSteps.forEach((chainStep) => {
      milestonesMap[`${chainStep.id}`] = this.buildMilestonesMapForChainStep(chainStep.id);
    });
    return milestonesMap;
  }

  /**
   * Returns key milestone step attempts and the target prompt level that the next draft session should have
   * for the given chain step ID.
   * @param chainStepId
   */
  buildMilestonesMapForChainStep(chainStepId: number): Milestones {
    const milestones: Milestones = {};
    let numCompleteAttemptsAtThisLevel = 0;
    let numFailedAttemptsAtThisLevel = 0;
    let numConsecutiveCompleteProbes = 0;
    let prevAttemptLevel: ChainStepPromptLevel = ChainStepPromptLevel.full_physical;
    const stepAttempts = this.stepAttemptsMap[chainStepId];

    // Walk through all past step attempts.
    stepAttempts.forEach((stepAttempt) => {
      const isComplete = ChainMastery.stepIsComplete(stepAttempt);
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
        // Step has been mastered for the first time.
        if (!milestones.firstMasteredStep) {
          milestones.firstMasteredStep = stepAttempt;
        }

        // Booster has been re-mastered.
        else if (milestones.firstBoosterStep && !milestones.boosterMasteredStep) {
          milestones.boosterMasteredStep = stepAttempt;
        }
      }

      // If the current prompt level failed in 3 consecutive sessions, move back a prompt level.
      else if (numFailedAttemptsAtThisLevel >= NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER) {
        if (milestones.firstMasteredStep && !milestones.firstBoosterStep) {
          milestones.firstBoosterStep = stepAttempt;
        }
      }

      // If the current prompt level was successful in 3 consecutive sessions, go forward a prompt level.
      else if (numCompleteAttemptsAtThisLevel >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
        if (stepAttempt.target_prompt_level !== undefined) {
          if (stepAttempt.target_prompt_level === ChainStepPromptLevel.none) {
            // Step has been mastered for the first time.
            if (!milestones.firstMasteredStep) {
              milestones.firstMasteredStep = stepAttempt;
            }

            // Booster has been re-mastered.
            else if (milestones.firstBoosterStep && !milestones.boosterMasteredStep) {
              milestones.boosterMasteredStep = stepAttempt;
            }
          }
        } else {
          throw new Error('Step attempt has no target prompt level.');
        }
      }

      if (stepAttempt.target_prompt_level !== undefined) {
        prevAttemptLevel = stepAttempt.target_prompt_level;
      } else {
        throw new Error('Step attempt has no target prompt level.');
      }
    });

    return milestones;
  }

  /**
   * Creates an index of chain steps, the milestone step attempts, and target prompt level, if applicable.
   */
  private buildPromptLevelMap(): PromptLevelMap {
    const promptLevelMap: PromptLevelMap = {};
    this.chainSteps.forEach((chainStep) => {
      promptLevelMap[`${chainStep.id}`] = this.buildPromptLevelMapForChainStep(chainStep.id);
    });
    return promptLevelMap;
  }

  /**
   * Returns key milestone step attempts and the target prompt level that the next draft session should have
   * for the given chain step ID.
   * @param chainStepId
   */
  buildPromptLevelMapForChainStep(chainStepId: number): PromptLevel {
    let numCompleteTrainingAttemptsBeforeFocus = 0;
    let numCompleteAttemptsAtThisLevel = 0;
    let numFailedAttemptsAtThisLevel = 0;
    let numConsecutiveCompleteProbes = 0;
    let numConsecutiveIncompleteChallengingProbes = 0;
    let skipFull = false;
    let firstLevel: ChainStepPromptLevel = ChainStepPromptLevel.full_physical;
    let prevAttemptLevel: ChainStepPromptLevel = ChainStepPromptLevel.full_physical;
    let lastAttemptLevel: ChainStepPromptLevel = ChainStepPromptLevel.full_physical;
    const promptLevelMap: PromptLevel = {};
    const stepAttempts = this.stepAttemptsMap[chainStepId];
    const isNextFocusStep =
      this.unmasteredChainStepIdsToFocus.length > 0 && this.unmasteredChainStepIdsToFocus[0] === chainStepId;
    const hasBeenFocused = this.unmasteredFocusedChainStepIds.includes(chainStepId);

    // Walk through all past step attempts.
    stepAttempts.forEach((stepAttempt) => {
      if (stepAttempt.target_prompt_level === undefined) {
        throw new Error('Step attempt has no target prompt level.');
      }

      const isComplete = ChainMastery.stepIsComplete(stepAttempt);
      const sameLevelAsPrev = prevAttemptLevel === stepAttempt.target_prompt_level;

      if (!hasBeenFocused && stepAttempt.session_type !== ChainSessionType.probe) {
        // Count consecutive completes before this step has ever been focused.
        if (!stepAttempt.had_challenging_behavior) {
          numCompleteTrainingAttemptsBeforeFocus++;
        } else {
          numCompleteTrainingAttemptsBeforeFocus = 0;
        }
      }

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
        } else if (stepAttempt.had_challenging_behavior) {
          numConsecutiveIncompleteChallengingProbes++;
          numFailedAttemptsAtThisLevel++; // Only increment failed attempts if CB occurred.
          numCompleteAttemptsAtThisLevel = 0;
          numConsecutiveCompleteProbes = 0;
        } else {
          numConsecutiveIncompleteChallengingProbes = 0;
          // numFailedAttemptsAtThisLevel++; // Only increment failed attempts if CB occurred.
          numCompleteAttemptsAtThisLevel = 0;
          numConsecutiveCompleteProbes = 0;
        }
      } else {
        // Training or booster session.
        numConsecutiveCompleteProbes = 0;
        numConsecutiveIncompleteChallengingProbes = 0;

        if (isComplete) {
          numCompleteAttemptsAtThisLevel++;
          numFailedAttemptsAtThisLevel = 0;
        } else {
          numCompleteAttemptsAtThisLevel = 0;
          numFailedAttemptsAtThisLevel++;
        }
      }

      // Only count training sessions for skipFull
      skipFull =
        !hasBeenFocused &&
        isNextFocusStep &&
        numCompleteTrainingAttemptsBeforeFocus >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY;
      firstLevel = skipFull ? ChainStepPromptLevel.partial_physical : ChainStepPromptLevel.full_physical;

      const goPrev =
        numConsecutiveIncompleteChallengingProbes >= NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER ||
        numFailedAttemptsAtThisLevel >= NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER;

      const goNext =
        numCompleteAttemptsAtThisLevel >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY &&
        (stepAttempt.was_focus_step || stepAttempt.status === ChainStepStatus.booster_needed);

      // If consecutive probes are completed 3 or more times, the step is mastered, so prompt level should be none (i.e., independent)
      if (numConsecutiveCompleteProbes >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
        lastAttemptLevel = ChainStepPromptLevel.none;
      }

      // If consecutive probes are incomplete 3 or more times WITH challenging behavior OR
      // if the current prompt level failed in 3 consecutive sessions, move back a prompt level.
      else if (goPrev) {
        lastAttemptLevel = ChainMastery.getPrevPromptLevel(stepAttempt.target_prompt_level).key;
      }

      // If the current prompt level was successful in 3 consecutive sessions, go forward a prompt level.
      else if (goNext) {
        lastAttemptLevel = ChainMastery.getNextPromptLevel(stepAttempt.target_prompt_level).key;
      }

      // Otherwise, just set the prompt level to the previous attempt's level.
      else {
        lastAttemptLevel = stepAttempt.target_prompt_level || firstLevel;
      }

      prevAttemptLevel = stepAttempt.target_prompt_level;
    });

    // Return the last prompt level used, if one exists. If not, return full physical.
    if (
      !hasBeenFocused &&
      isNextFocusStep &&
      numCompleteTrainingAttemptsBeforeFocus >= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY
    ) {
      promptLevelMap.targetPromptLevel = ChainStepPromptLevel.partial_physical;
    } else {
      promptLevelMap.targetPromptLevel = lastAttemptLevel || firstLevel;
    }
    return promptLevelMap;
  }

  printDraftSessionSummary(): void {
    const lines: string[] = [];
    lines.push(`======================================`);
    lines.push(`STEP  COMPLETED  PROMPTED  CHALLENGING`);
    lines.push(`--------------------------------------`);

    this.draftSession.step_attempts.forEach((s) => {
      const challenging = s.had_challenging_behavior === true ? 'T' : s.had_challenging_behavior === false ? 'F' : '?';
      const completed = s.completed === true ? 'T' : s.completed === false ? 'F' : '?';
      const prompted = s.was_prompted === true ? 'T' : s.was_prompted === false ? 'F' : '?';
      lines.push(` ${s.chain_step_id}        ${completed}         ${prompted}           ${challenging}`);
    });

    lines.push(`============================`);
    console.log(lines.join('\n'));
  }

  printSessionLog(): void {
    const lines: string[] = [];
    let lastFocusStepIndex = 0;

    // Loop through all sessions and step attempts
    this.chainData.sessions.forEach((session, i) => {
      session.step_attempts.forEach((stepAttempt, j) => {
        if (stepAttempt.was_focus_step) {
          lastFocusStepIndex = j;
        }

        if (
          j === lastFocusStepIndex ||
          stepAttempt.was_focus_step ||
          stepAttempt.status === ChainStepStatus.booster_needed
        ) {
          lines.push(
            `#${i + 1} - ${session.session_type} session - ${stepAttempt.status} step: ${stepAttempt.chain_step_id} @ ${
              stepAttempt.target_prompt_level
            } - ${stepAttempt.completed ? 'COMPLETED' : 'FAILED'}`,
          );
        }
      });
    });

    const numSessions = this.chainData.sessions.length + 1;
    this.draftSession.step_attempts.forEach((stepAttempt, j) => {
      if (stepAttempt.session_type === ChainSessionType.probe) {
        if (j === lastFocusStepIndex) {
          lines.push(`#${numSessions} - Probe session - focus step: ${j} @ ${stepAttempt.target_prompt_level} - DRAFT`);
        }
      } else {
        if (stepAttempt.was_focus_step || stepAttempt.status === ChainStepStatus.booster_needed) {
          lines.push(
            `#${numSessions} - ${stepAttempt.session_type} session - ${stepAttempt.status} step: ${stepAttempt.chain_step_id} @ ${stepAttempt.target_prompt_level} - DRAFT`,
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
