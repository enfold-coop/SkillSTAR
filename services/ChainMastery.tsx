import {
  NUM_CHALLENGING_ATTEMPTS_FOR_FOCUS,
  NUM_COMPLETE_PROBE_ATTEMPTS_FOR_MASTERY,
  NUM_COMPLETE_TRAINING_ATTEMPTS_FOR_MASTERY,
  NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER,
  NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER,
  NUM_PROMPTED_ATTEMPTS_FOR_FOCUS,
} from '../constants/MasteryAlgorithm';
import { ChainSession, ChainSessionType } from '../types/CHAIN/ChainSession';
import { MasteryInfo, MasteryInfoMap } from '../types/CHAIN/MasteryLevel';
import { ChainData } from '../types/CHAIN/SkillstarChain';
import {
  ChainStepPromptLevel,
  ChainStepPromptLevelMap,
  ChainStepStatus,
  StepAttempt,
} from '../types/CHAIN/StepAttempt';

// MOCK SESSIONS ARRAY LENGTH
const MOCKSESSIONSLENGTH = 5;

/**
 * Holds the chain data and mastery info for each step in the chain data.
 * Also provides quick access to the current chain session, focus step, and
 * mastery state for each step in the current session.
 */
export class ChainMastery {
  promptHierarchy = Object.values(ChainStepPromptLevelMap).sort((a, b) => a.order - b.order);
  chainData: ChainData;
  masteryInfoMap: MasteryInfoMap;
  draftSession?: ChainSession;
  incompleteCount = 0;

  /**
   * constructor
   * --this method initializes and defines all of the above class variables
   * @param chainData all of participant's session history data
   *
   * Params: chainData = the entire SkillstarChain
   *
   */
  constructor(chainData: ChainData) {
    // Initialize the chain data for the class instance.
    this.chainData = new ChainData(chainData);
    this.masteryInfoMap = this.buildMasteryInfoMap();

    // TODO: Populate a draft session.
    //  This will be a container for the not-yet-completed session that the user is currently
    //  inputting data for. It has not been saved to the database yet, so nothing in the session
    //  will have IDs or nested members (such as chain_step in the step_attempts).
    //  The draft session will be stored in AsyncStorage until the user successfully completes
    //  the session, submits the data, and connects to the internet.
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

  // Returns the current session number by indexing (+1) of the total sessions length
  get currentSessionNumber(): number {
    return this.chainData.sessions.length + 1;
  }

  get prevFocusStepChainStepId(): number | undefined {
    if (this.previousFocusStep && this.previousFocusStep.chain_step_id !== undefined) {
      return this.previousFocusStep.chain_step_id;
    }
  }

  /**
   * Returns the chain step ID that should be focused on next, or undefined if not applicable.1
   */
  get nextFocusStepChainStepId(): number | undefined {
    const prev = this.previousFocusStep;
    if (prev && prev.chain_step_id !== undefined) {
      if (this._isPrevFocusMastered) {
        return prev.chain_step_id + 1;
      } else {
        return prev.chain_step_id;
      }
    }
  }

  get currentSessionType(): ChainSessionType {
    if (this.sessions.length % 3 === 0) {
      return ChainSessionType.probe;
    } else {
      return ChainSessionType.training;
    }
  }

  /**
   * factors whether prev session's focus step was mastered
   * returns boolean
   */
  get _isPrevFocusMastered(): boolean {
    const { completed, prompt_level, had_challenging_behavior } = this.previousFocusStep;
    return completed && prompt_level === this.promptHierarchy[0].key && !had_challenging_behavior;
  }

  static _determinePrevSessionType(chainData: ChainData) {
    if (chainData && chainData.sessions.length < 1) {
      this.currentSessionType = ChainSessionType.probe;
    } else {
      const lastSession = chainData.sessions[chainData.sessions.length - 1];
      if (lastSession && lastSession.session_type) {
        this.currentSessionType = lastSession.session_type;
      }
    }
  }

  /**
   * set currentSession
   *
   * Modifies the instance chainData.sessions array.
   *
   * Sets the currentSession to:
   * - An empty probe session, if the user has no attempted sessions yet
   * - The next session the participant should be attempting, if there is one.
   * - An empty probe session, if there are none left to attempt (???)
   */
  // total sessions.length + 1
  static _setCurrentSessionNumber(sessionsLength: number) {
    this.currentSessionNumber = sessionsLength + 1;
  }

  static _findPrevStepAttemptWId(id: number, index: number) {
    // console.log("id");
    // console.log(id);
    // console.log("index");
    // console.log(index);

    for (let i = 0; i < this.sessions[index].step_attempts.length; i++) {
      if (this.sessions[index].step_attempts[i].chain_step_id === id) {
        return this.sessions[index].step_attempts[i];
      }
    }
  }

  static _neededPromptOrHadCB() {
    // TODO: Returns true if a given step (or is it session?) needed prompting or had challenging behavior
  }

  // contains logic to determine if a session is a booster session
  static determineIfBoosterSession() {
    const prevCount = 0;
    const TOTAL_SESSIONS_MET_COUNT = 0;
    const sessionLength = this.sessions.length;
    const lastSessType = this.sessions[sessionLength - 1].session_type;
    console.log(lastSessType);

    const id = this.previousFocusStepId;
    const prevThree = [];
    const minAmntPrevMastered = lastSessType === 'training' ? 3 : 2;
    // 7. FOR_LOOP:

    // ---- FOR(MAXCRITCOUNT; index--):
    if (minAmntPrevMastered < sessionLength) {
      for (let i = minAmntPrevMastered; i > 0; i--) {
        prevThree.push(this._findPrevStepAttemptWId(id, i));
        // console.log(prevThree);
      }
    } else {
      console.log("*** Doesn't qualify as booster ***");
      return;
    }
  }

  /**
   * getNextPromptLevel()
   * @param promptLvl: "string" is the previous prompt level
   * -- from promptHier array, returns an object from prompthier of next prompt level
   */
  static getNextPromptLevel(promptLvl: string) {
    const currentIndex = this.promptHierarchy.findIndex(e => e['key'] === promptLvl);
    const nextIndex = currentIndex > 1 ? currentIndex - 1 : 0; // 0 if prompt level is already 0 (none/independent)
    return this.promptHierarchy[nextIndex];
  }

  getCurrFocusStep() {
    if (this.previousFocusStep && this.previousFocusStep.completed) {
      // get prev focus step's id and set currFocusStep
      //  (this.previousFocusStep.chain_step_id as number) + 1;
      // Construct new session.
      // Add a focus step
      //
      // Add a focus step.
    }
  }

  /** GET STEP_ATTEMPT PROMPT LEVEL */
  /**
   * determineStepAttemptPromptLevel()
   * -- determines and sets current session's focus step prompt-level
   * @param chainData : all of participant's session history data
   */
  determineStepAttemptPromptLevel() {
    const prevPromptLevel = this.previousFocusStep ? this.previousFocusStep.prompt_level : undefined;

    if (prevPromptLevel && this.previousFocusStep && this.previousFocusStep.completed) {
      this.setCurrPromptLevel(ChainMastery.getNextPromptLevel(prevPromptLevel).key);
    } else if (prevPromptLevel && this.previousFocusStep && !this.previousFocusStep.completed) {
      this.setCurrPromptLevel(prevPromptLevel);
    } else {
      // Otherwise, start at the end of the promptHierarchy.
      this.setCurrPromptLevel(this.promptHierarchy[this.promptHierarchy.length].key);
    }
  }

  setCurrPromptLevel(prompt: ChainStepPromptLevel) {
    if (prompt !== undefined) {
      this.currFocusStepPromptLevel = prompt;
    }
  }

  /** FOCUS STEP ALGO */
  // **
  // check for completion of last session's step_attempts
  // -- IF: (a step_attempt was incomplete && (total qty of sessions >= MAX_CONSEC_INCOMPLETE))
  // -- THEN: get prior 3 sessions _AND THEN_ check step_attempt[index] against prior_session.step_attempt[index]
  // ------- IF: (prior_session.step_attempt[index] ALSO incomplete)
  // ----------- THEN: incompleteCount += 1
  // ------- ELSE:
  // ----------- THEN: incompleteCount = 0
  // -- IF: (incompleteCount >= MAX_CONSEC_INCOMPLETE)
  // ----------- THEN: FOCUS_STEP = next_session.step_attempt[index]
  // ----------- RETURN: FOCUS_STEP
  // -- ELSE:
  // ----------- FOCUS_STEP = next_session.step_attempt[index+1]
  // ----------- RETURN: FOCUS_STEP

  /**
   * Creates an index of steps, the status for each, and the milestone dates for that step, if applicable.
   * @private
   */
  private buildMasteryInfoMap(): MasteryInfoMap {
    const masteryInfoMap: MasteryInfoMap = {};

    // TODO: Sort sessions by date.

    this.chainData.sessions.forEach(session => {
      session.step_attempts.forEach(stepAttempt => {
        if (stepAttempt && stepAttempt.chain_step_id && stepAttempt.status) {
          masteryInfoMap[stepAttempt.chain_step_id] = this.buildMasteryInfoForChainStep(stepAttempt.chain_step_id);
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
   * @private
   */
  private buildMasteryInfoForChainStep(chainStepId: number): MasteryInfo {
    const stepAttempts = this.chainData.getAllStepAttemptsForChainStep(chainStepId);

    // Initialize numAttemptsSince
    const m: MasteryInfo = {
      chainStepId,
      stepStatus: ChainStepStatus.not_complete,
      dateIntroduced: undefined, // Will be set below, if applicable
      dateMastered: undefined, // Will be set below, if applicable
      dateBoosterInitiated: undefined, // TODO // Will be set below, if applicable
      dateBoosterMastered: undefined, // TODO // Will be set below, if applicable
      numAttemptsSince: {
        firstIntroduced: this._numSinceFirstIntroduced(stepAttempts),
        firstCompleted: this._numSinceFirstCompleted(stepAttempts),
        lastCompleted: this._numSinceLastCompleted(stepAttempts),
        lastCompletedWithoutChallenge: this._numSinceLastCompletedWithoutChallenge(stepAttempts),
        lastCompletedWithoutPrompt: this._numSinceLastCompletedWithoutPrompt(stepAttempts),
        lastProbe: this._numSinceLastProbe(stepAttempts),
        firstMastered: this._numSinceFirstMastered(stepAttempts),
        boosterInitiated: this._numSinceBoosterInitiated(stepAttempts), // TODO
        boosterMastered: this._numSinceBoosterMastered(stepAttempts), // TODO
      },
    };

    // Initialize dates
    m.dateIntroduced = this._getDateFor(stepAttempts, m.numAttemptsSince.firstIntroduced);
    m.dateMastered = this._getDateFor(stepAttempts, m.numAttemptsSince.firstMastered);
    m.dateBoosterInitiated = this._getDateFor(stepAttempts, m.numAttemptsSince.boosterInitiated);
    m.dateBoosterMastered = this._getDateFor(stepAttempts, m.numAttemptsSince.boosterMastered);

    // Set step status
    m.stepStatus = this._getStepStatus(stepAttempts, m); // TODO

    return m;
  }

  /**
   * Returns the date of the step attempt where numAttemptsSince was set to 0, if applicable. Otherwise, returns undefined.
   * @param stepAttempts
   * @param numAttemptsSince
   * @private
   */
  private _getDateFor(stepAttempts: StepAttempt[], numAttemptsSince: number): Date | undefined {
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
   * @private
   */
  private _numSinceFirstIntroduced(stepAttempts: StepAttempt[]): number {
    // Since the step attempts are sorted by date, the first item is when it was introduced.
    // So just subtract 1 from the total number of attempts.
    return stepAttempts.length - 1;
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the step was
   * completed successfully for the first time.
   * @param stepAttempts
   * @private
   */
  private _numSinceFirstCompleted(stepAttempts: StepAttempt[]): number {
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
   * @private
   */
  private _numSinceLastCompleted(stepAttempts: StepAttempt[]): number {
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
   * @private
   */
  private _numSinceLastCompletedWithoutChallenge(stepAttempts: StepAttempt[]): number {
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
   * @private
   */
  private _numSinceLastCompletedWithoutPrompt(stepAttempts: StepAttempt[]): number {
    let lastCompletedIndex = -1;

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.completed && !stepAttempt.was_prompted) {
        lastCompletedIndex = i;
      }
    });

    return stepAttempts.length - (lastCompletedIndex + 1);
  }

  /**
   * Given a list of step attempts, returns the number of attempts since the last probe session
   * @param stepAttempts
   * @private
   */
  private _numSinceLastProbe(stepAttempts: StepAttempt[]): number {
    let lastProbeIndex = -1;

    stepAttempts.forEach((stepAttempt, i) => {
      if (stepAttempt.session_type === ChainSessionType.probe) {
        lastProbeIndex = i;
      }
    });

    return stepAttempts.length - (lastProbeIndex + 1);
  }

  private _numSinceFirstMastered(stepAttempts: StepAttempt[]): number {
    let n = -1;
    let masteredOnce = false;
    stepAttempts.forEach(stepAttempt => {
      if (stepAttempt.completed && stepAttempt.status === ChainStepStatus.mastered) {
        masteredOnce = true;
      }

      if (masteredOnce) {
        n++;
      }
    });

    return n;
  }

  /**
   * Returns true if the given step was:
   * - a probe session AND
   * - completed with no prompting
   * @param stepAttempt
   * @private
   */
  private _isProbeStepComplete(stepAttempt: StepAttempt): boolean {
    return (
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
   * @private
   */
  private _isFocusStepComplete(stepAttempt: StepAttempt): boolean {
    return (
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
   * @private
   */
  private _stepFirstMastered(stepAttempts: StepAttempt[]): StepAttempt | undefined {
    let masteredStepAttempt: StepAttempt | undefined = undefined;
    let numConsecutiveCompleteProbes = -1;
    let numConsecutiveCompleteTraining = -1;
    let prevAttempt: StepAttempt | undefined = undefined;

    stepAttempts.forEach(thisAttempt => {
      if (thisAttempt.completed) {
        const isConsecutive = prevAttempt ? prevAttempt.session_type === thisAttempt.session_type : false;

        // Count consecutive session types
        if (this._isProbeStepComplete(thisAttempt)) {
          numConsecutiveCompleteProbes = isConsecutive ? numConsecutiveCompleteProbes + 1 : 1;
          numConsecutiveCompleteTraining = 0;
        } else if (this._isFocusStepComplete(thisAttempt)) {
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
        masteredStepAttempt = thisAttempt;
      }

      prevAttempt = thisAttempt;
    });

    return masteredStepAttempt;
  }

  private _stepIsComplete(stepAttempt: StepAttempt): boolean {
    if (stepAttempt.session_type === ChainSessionType.probe) {
      return !(stepAttempt.was_prompted || (stepAttempt.had_challenging_behavior && !stepAttempt.completed));
    } else if (stepAttempt.session_type === ChainSessionType.training && stepAttempt.was_focus_step) {
      return (
        stepAttempt.status === ChainStepStatus.mastered &&
        !stepAttempt.was_prompted &&
        stepAttempt.prompt_level === ChainStepPromptLevel.none
      );
    } else {
      return (
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
   * @private
   */
  private _getBoosterStep(stepAttempts: StepAttempt[]): StepAttempt | undefined {
    let boosterStep: StepAttempt | undefined = undefined;
    let masteredOnce = false;
    let numConsecutiveIncompleteProbes = -1;
    let numConsecutiveIncompleteTraining = -1;
    let lastSessionType: ChainSessionType | undefined;
    let needsBooster = true;

    stepAttempts.forEach(stepAttempt => {
      if (needsBooster) {
        boosterStep = stepAttempt;
      }

      // First attempt where step was mastered.
      if (!masteredOnce && this._stepIsComplete(stepAttempt)) {
        masteredOnce = true;
      } else if (masteredOnce && !this._stepIsComplete(stepAttempt)) {
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
          needsBooster = true;
        }

        lastSessionType = stepAttempt.session_type;
      }
    });

    return boosterStep;
  }

  /**
   * Given a list of step attempts, returns the number of attempts after
   * the first booster session was introduced.
   * @param stepAttempts
   * @private
   */
  private _numSinceBoosterInitiated(stepAttempts: StepAttempt[]): number {
    const boosterStep = this._getBoosterStep(stepAttempts);

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
   * @private
   */
  private _numSinceBoosterMastered(stepAttempts: StepAttempt[]): number {
    const boosterStep = this._getBoosterStep(stepAttempts);

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
   * @param stepAttempts
   * @param m: MasteryInfo object, populated with milestone dates and numAttemptsSince.
   * @private
   */
  private _getStepStatus(stepAttempts: StepAttempt[], m: MasteryInfo): ChainStepStatus {
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

    return ChainStepStatus.not_complete;
  }

  /**
   * If the previous session was a training or booster session, returns the step
   * that is marked as was_focus_step (assumes that only one step will be focus
   * step). Otherwise, returns undefined.
   * @private
   */
  get previousFocusStep(): StepAttempt | undefined {
    if (this.prevSession) {
      return this._getFocusStepInSession(this.prevSession);
    }
    return undefined;
  }

  /**
   * If the last session in the chain data is a training or booster session,
   * returns the step that is marked as was_focus_step (assumes that only one
   * step will be focus step). Otherwise, returns undefined.
   * @private
   */
  get currentFocusStep(): StepAttempt | undefined {
    if (this.currentSession) {
      return this._getFocusStepInSession(this.currentSession);
    }
    return undefined;
  }

  /**
   * If the given session is a training or booster session, returns the step that
   * is marked as was_focus_step (assumes that only one step will be focus step).
   * Otherwise, returns undefined.
   * @private
   */
  private _getFocusStepInSession(session: ChainSession): StepAttempt | undefined {
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
}
