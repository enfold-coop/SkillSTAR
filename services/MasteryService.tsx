import {ChainQuestionnaire} from '../types/CHAIN/ChainQuestionnaire';
import {ChainSessionType} from '../types/CHAIN/ChainSession';
import {ChainStepPromptLevel, ChainStepStatus, StepAttempt} from '../types/CHAIN/StepAttempt';

/**
 * Mastery Algorithm
 * UTIL function (can be moved to another file)
 *
 * Params: chainData = the entire ChainQuestionnaire
 * Returns one of the following:
 * - An empty probe session, if the user has no attempted sessions yet
 * - The next session the participant should be attempting, if there is one.
 * - An empty probe session, if there are none left to attempt (???)
 */
class MasteryService {

  promptHierarchy= [
    ChainStepPromptLevel.full_physical,
    ChainStepPromptLevel.full_physical,
    ChainStepPromptLevel.full_physical,
    ChainStepPromptLevel.partial_physical,
    ChainStepPromptLevel.partial_physical,
    ChainStepPromptLevel.partial_physical,
    ChainStepPromptLevel.shadow,
    ChainStepPromptLevel.shadow,
    ChainStepPromptLevel.shadow,
    ChainStepPromptLevel.none,
    ChainStepPromptLevel.none,
    ChainStepPromptLevel.none,
  ];

  constructor() {
  }

  // Returns all the step attempts for the given chain that match a certain step name
  static getAllStepAttemptsForChainStepName(chainData: ChainQuestionnaire, chainStepId: number): StepAttempt[] {
    const stepAttempts: StepAttempt[] = [];

    chainData.sessions.forEach(session => {
      session.step_attempts.forEach(stepAttempt => {
        if (stepAttempt.chain_step_id === chainStepId) {
          stepAttempts[chainStepId] = stepAttempt;
        }
      });
    });

    return stepAttempts;
  }

  /**
   * Returns true if: All the step attempts for the given chain matching a certain step ID had challenging behavior
   * more than the given number of attempts, AND the challenging behavior prevented step completion for those steps.
   *
   * @param chainQuestionnaire - All Chain Data for the selected participant
   * @param chainStepId - The specific chain step to focus on
   * @param numAttempts - The minimum number of attempts
   */
  static shouldFocusOnStep(chainQuestionnaire: ChainQuestionnaire, chainStepId: number, numAttempts: number): boolean {
    if (chainQuestionnaire.sessions.length < numAttempts) {
      return false;
    }

    let numChallenging = 0;
    let challengingStepAttempts: StepAttempt[] = [];

    chainQuestionnaire.sessions.forEach(session => {
      session.step_attempts.forEach(stepAttempt => {
        if ((stepAttempt.chain_step_id === chainStepId) && stepAttempt.had_challenging_behavior) {
          if (numChallenging < numAttempts) {
            numChallenging++;
            challengingStepAttempts.push(stepAttempt);
          }
        } else {
          numChallenging = 0;
          challengingStepAttempts = [];
        }
      });
    });

    return (numChallenging >= numAttempts) && challengingStepAttempts.every(sa => !sa.completed);
  }

  // Returns true if challenging behaviors

  static getNextSession(chainData: ChainQuestionnaire) {

    // Some of the sessions will be future/not attempted sessions.
    // We want the next session the participant should be attempting.
    const numSessions = chainData.sessions ? chainData.sessions.length : 0;

    // If there are no sessions, return a probe session.

    // Otherwise, return the first un-attempted session OR the last attempted session, if there are no un-attempted sessions?

    const lastSess = (numSessions > 0) ? chainData.sessions[numSessions - 1] : null;

    // !! overriding type for dev purposes
    // lastSess.session_type = ChainSessionType.training;

    if (lastSess === null) {

    //   return {
    //     sessionCount: 1,
    //     sessionType: ChainSessionType.probe,
    //     buttonText: ''
    //   }
    //   setSessionNmbr(1);
    //   setType("probe");
    //
    //   // Session count (how many sessions attempted)
    //   // i.e., sessions with attempts. Sessions with no attempts would not be included in this count?
    //   dispatch({type: ADD_CURR_SESSION_NMBR, payload: 1});
    //
    //   // chainData.sessions[i].session_type
    //   dispatch({type: ADD_SESSION_TYPE, payload: "probe"});
    // }
    // if (lastSess) {
    //   if (lastSess.session_type === "training" && !lastSess.completed) {
    //     setType("training");
    //     setSessionNmbr(chainData.sessions.length + 1);
    //     dispatch({type: ADD_CURR_SESSION_NMBR, payload: sessionNmbr});
    //     dispatch({type: ADD_SESSION_TYPE, payload: "training"});
    //     setBtnText(START_TRAINING_SESSION_BTN);
    //   }
    //   if (lastSess.session_type === "probe" && !lastSess.completed) {
    //     setType("probe");
    //     setSessionNmbr(chainData.sessions.length + 1);
    //     dispatch({type: ADD_CURR_SESSION_NMBR, payload: sessionNmbr});
    //     dispatch({type: ADD_SESSION_TYPE, payload: "probe"});
    //     setBtnText(START_PROBE_SESSION_BTN);
    //     setAsideContents(PROBE_INSTRUCTIONS);
    //   }
    }
  };

}
