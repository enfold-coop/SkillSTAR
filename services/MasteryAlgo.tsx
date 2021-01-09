import { SkillstarChain } from "../types/CHAIN/SkillstarChain";
import { ChainSession, ChainSessionType } from "../types/CHAIN/ChainSession";
import { MasteryInfo } from "../types/CHAIN/MasteryLevel";
import {
	ChainStepPromptLevel,
	ChainStepStatus,
    StepAttempt,
    ChainStepPromptLevelMap,
    ChainStepStatusMap,
    ChallengingBehaviorSeverityMap
} from "../types/CHAIN/StepAttempt";

export class MasteryAlgo {
	PROBE_MAX_CONSECUTIVE_INCOMPLETE = 2;
	TRAINING_MAX_CONSECUTIVE_INCOMPLETE = 3;
	incompleteCount = 0;
	static currentSessionType = ChainSessionType;
    static currentSessionNumber = 0;
    static prevFocusStepPromptLevel = null;
    static currFocusStepPromptLevel = null;

	static promptHierarchy:{}[];
    constructor() {}
    
    /**
     * 
     * @param chainData 
     * -- 
     * --this method initializes and defines all of the above class variables
     */
    static init(chainData: SkillstarChain){
        // DEFINE: currentSessionNumber = 0;
        // DEFINE: currentSessionType = ChainSessionType;
        // DEFINE: prevFocusStepPromptLevel = null;
        // DEFINE: currFocusStepPromptLevel = null;
    }

	/** WHAT ARE THE DEFINING CRITERIA FOR A FOCUS-STEP? */
	// 1. (GIVEN: No prior sessions.)
	// 2. (GIVEN: No prior step_attempts.)
	// 3. Prior count of step_attempt[index] at prompt-level < MAX_REQUIRED_ATTEMPTS_AT_PROMPT_LEVEL.
	// 4. Step_attempt[index - 1] is mastered at current prompt-level.
	// 5. Step_attempt[index] was previously mastered, but required add'l prompting
	// 6. Step_attempt[index] completed 3-times WITHOUT add'l prompt NOR severe CB
	// 7.
	// 8.

	/** WHAT DEFINES A FOCUS STEP_ATTEMPT'S MASTERY? */
	// 3x attempt WITHOUT:
	// 1. additional prompting needed
	// 2. interfering CB

	/** GET STEP COMPLETION */
	// -- IF: (prior_session.step_attempt[index].needed_addl_prompting === true)
	// ---- THEN: return false
	// -- IF: (prior_session.step_attempt[index].cb_severity > MAX_ALLOWED_SEVERITY)
	// ---- THEN: return false
	// -- ELSE:
	// ---- THEN: return true

	/** GET SESSION TYPE */
	// -- get last session (sessions[index-1]
	// -- IF ((prior session_type === "probe" && prior session === incomplete) || prior session count < REQUIRED_PROBE_COUNT ):
	// -------- RETURN: "Probe"
	// ------ ELSE:
	// -------- RETURN: "Training"
	// -- IF (prior session_type === "training"):
	// ----- RETURN: "Training"
	static _determinePrevSessionType(chainData: SkillstarChain) {
		if (chainData && chainData.sessions.length < 1) {
			this.currentSessionType = "Probe";
		} else {
			this.currentSessionType =
				chainData.sessions[chainData.sessions.length - 1].session_type;
		}
	}

	/** GET CURRENT SESSION NUMBER */
	// total sessions.length + 1
	static _setCurrentSessionNumber(sessionsLength: number) {
		this.currentSessionNumber = sessionsLength + 1;
    }
    
    static _getPreviousSessionData(chainData: SkillstarChain){
        return chainData.sessions[chainData.sessions.length - 1];
    }

    static _getPrevSessionFocusStepData(session: ChainSession) {
        return session.step_attempts.find((e) => {
            let s = e.status;
            if(s === "focus"){
                return e;
            }
        });
    }

    static _convertMapToArray(eMap: {}){
        return  Object.values(eMap);    
    }

    static _getNextPromptLevel(promptLvl:string){
        return this.promptHierarchy[this.promptHierarchy.findIndex((e)=>(e["key"]===promptLvl)) - 1];
    }

	/** GET STEP_ATTEMPT PROMPT LEVEL */
    static determineStepAttemptPromptLevel(chainData: SkillstarChain){
        
        // 1. get prior_session
        // 2. get prior_Session.focus_step.prompt_level
        let prevSessionData = this._getPreviousSessionData(chainData);
        let prevFocusStep = this._getPrevSessionFocusStepData(prevSessionData);
        let prevPromptLevel = prevFocusStep?.prompt_level;
        
        
        this.promptHierarchy = this._convertMapToArray(ChainStepPromptLevelMap);
        // console.log(this.promptHierarchy);
        let next = this._getNextPromptLevel(prevPromptLevel);
        console.log(next);
        
        
        let nextPromptLevel = prevPromptLevel != undefined ? Object.keys(ChainStepPromptLevel).indexOf(prevPromptLevel) : undefined;
        
        
        
        
        
        if(prevFocusStep){
            // 3. IF: (prior focus_step was completed WITHOUT (add'l prompting && CB)):
            if(prevFocusStep.completed && !prevFocusStep.had_challenging_behavior && !prevFocusStep.was_prompted){
                this.currFocusStepPromptLevel = ChainStepPromptLevel[nextPromptLevel];
            }   
        }
        // ---- THEN: current prompt_level = next prompt_level in hierarchy
        // 4. ELSE:
        // ---- THEN: current prompt_level = prior session._focus_step.prompt_level
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
}
