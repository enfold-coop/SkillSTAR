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

// Settings
const NUM_COMPLETE_PROBE_ATTEMPTS_FOR_MASTERY = 2;
const NUM_COMPLETE_TRAINING_ATTEMPTS_FOR_MASTERY = 3;
const NUM_INCOMPLETE_PROBE_ATTEMPTS_FOR_BOOSTER = 2;
const NUM_INCOMPLETE_TRAINING_ATTEMPTS_FOR_BOOSTER = 3;

/**
 * Holds the chain data and mastery info for each step in the chain data.
 * Also provides quick access to the current chain session, focus step, and
 * mastery state for each step in the current session.
 */
export class ChainMastery {
  chainData: ChainData;
  masteryInfoMap: MasteryInfoMap;
  sessions: ChainSession[];
  prevFocusStep?: StepAttempt;
  currFocusStep?: StepAttempt;
  prevFocusStepPromptLevel?: ChainStepPromptLevel;
  currFocusStepPromptLevel?: ChainStepPromptLevel;
  currFocusStepId?: number;
  static promptHierarchy = Object.values(ChainStepPromptLevelMap).sort((a, b) => a.order - b.order);
  PROBE_MAX_CONSECUTIVE_INCOMPLETE = 2;
  TRAINING_MAX_CONSECUTIVE_INCOMPLETE = 3;
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

    // TODO: Populate the stepMastery array based on the chainData.
    this.masteryInfoMap = this.buildMasteryInfoMap();

    // TODO: Set the current session.

    // TODO: Set the current focus step, if applicable.

    this.prevFocusStep = this.prevSessionFocusStepData;
    this.sessions = chainData.sessions;
    this.determineStepAttemptPromptLevel(chainData);
    this.determineCurrentFocusStepId();
    this.determinePrevFocusStepId();
    this.isSessionProbeOrTraining();
    this.getCurrFocusStep();
    // this.determineIfBoosterSession(); // line 186?
  }

  get prevSessionData(): ChainSession {
    return this.chainData.lastSession;
  }

  get promptHierarchy() {
    return ChainMastery.promptHierarchy;
  }

  // TODO
  //  [X] set sessions
  //  [X] determine prompt level
  //  [X] determine if focus is mastered
  //  [X] determine focus-step index
  //  [X] determine current session number
  //  [X] determine probe or training session
  //  [ ] determine booster session
  //  [ ] determine ...

  //

  getCurrFocusStep() {
    if (this.prevFocusStep && this.prevFocusStep.completed) {
      // get prev focus step's id and set currFocusStep
      //  (this.prevFocusStep.chain_step_id as number) + 1;
      // Construct new session.
      // Add a focus step
      //
      // Add a focus step.
    }
  }

  /**
   *
   * @param session : prev session data
   * -- finds and returns focus step of previous session
   */
  get prevSessionFocusStepData(): StepAttempt | undefined {
    return this.prevSessionData.step_attempts.find(e => {
      if (e.status === ChainStepStatus.focus) {
        return e;
      }
    });
  }

  // Returns the current session number by indexing (+1) of the total sessions length
  get currentSessionNumber(): number {
    return this.chainData.sessions.length + 1;
  }

  /** GET STEP_ATTEMPT PROMPT LEVEL */
  /**
   * determineStepAttemptPromptLevel()
   * -- determines and sets current session's focus step prompt-level
   * @param chainData : all of participant's session history data
   */
  determineStepAttemptPromptLevel() {
    const prevPromptLevel = this.prevFocusStep ? this.prevFocusStep.prompt_level : undefined;

    if (prevPromptLevel && this.prevFocusStep && this.prevFocusStep.completed) {
      this.setCurrPromptLevel(ChainMastery.getNextPromptLevel(prevPromptLevel).key);
    } else if (prevPromptLevel && this.prevFocusStep && !this.prevFocusStep.completed) {
      this.setCurrPromptLevel(prevPromptLevel);
    } else {
      // Otherwise, start at the end of the promptHierarchy.
      this.setCurrPromptLevel(this.promptHierarchy[this.promptHierarchy.length].key);
    }
  }

  get prevFocusStepId(): number | undefined {
    if (this.prevFocusStep && this.prevFocusStep.chain_step_id !== undefined) {
      return this.prevFocusStep.chain_step_id;
    }
  }

  // Sets the current focus step id
  get currentFocusStepId(): number {
    if (this.prevFocusStep && this.prevFocusStep.chain_step_id !== undefined) {
      if (this._isPrevFocusMastered()) {
        return this.prevFocusStep.chain_step_id + 1;
      } else {
        return this.prevFocusStepId;
      }
    }
  }

  get prevSessionType(): ChainSessionType | undefined {
    return this.sessions[this.sessions.length - 1].session_type;
  }

  get currentSessionType(): ChainSessionType {
    if (this.sessions.length % 3 === 0) {
      return ChainSessionType.probe;
    } else {
      return ChainSessionType.training;
    }
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

    const id = this.prevFocusStepId;
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

  setCurrPromptLevel(prompt: ChainStepPromptLevel) {
    if (prompt !== undefined) {
      this.currFocusStepPromptLevel = prompt;
    }
  }

  /**
   * factors whether prev session's focus step was mastered
   * returns boolean
   */
  get _isPrevFocusMastered(): boolean {
    const { completed, prompt_level, had_challenging_behavior } = this.prevFocusStep;
    return completed && prompt_level === this.promptHierarchy[0].key && !had_challenging_behavior;
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

    if (stepAttempts.length > 0) {
      m.dateIntroduced = stepAttempts[0].date;
    }

    if (m.numAttemptsSince.firstMastered >= 0) {
      const firstMasteredIndex = stepAttempts.length - m.numAttemptsSince.firstMastered - 1;
      m.dateMastered = stepAttempts[firstMasteredIndex].date;
    }

    if (m.numAttemptsSince.boosterInitiated >= 0) {
      const boosterInitiatedIndex = stepAttempts.length - m.numAttemptsSince.boosterInitiated - 1;
      m.dateBoosterInitiated = stepAttempts[boosterInitiatedIndex].date;
    }

    if (m.numAttemptsSince.boosterInitiated >= 0) {
      const boosterMasteredIndex = stepAttempts.length - m.numAttemptsSince.boosterMastered - 1;
      m.dateBoosterMastered = stepAttempts[boosterMasteredIndex].date;
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
    let n = -1;
    stepAttempts.forEach(stepAttempt => {
      if (stepAttempt.date) {
        n++;
      }
    });
    return n;
  }

  /**
   * Given a list of step attempts, returns the number of attempts after
   * the last booster session was mastered.
   * @param stepAttempts
   * @private
   */
  private _numSinceBoosterMastered(stepAttempts: StepAttempt[]): number {
    let n = -1;
    stepAttempts.forEach(stepAttempt => {
      if (stepAttempt.date) {
        n++;
      }
    });
    return n;
  }
}
