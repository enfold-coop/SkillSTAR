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
    static prevSessionData = null;
    static prevFocusStep = null;
    static currFocusStep = null;
    static currentSessionNumber = 0;
    static prevFocusStepPromptLevel = null;
    static currFocusStepPromptLevel = null;
    static prevFocusStepId = 0;
    static currFocusStepId = 0;

    static promptHierarchy:{}[];
    
    constructor() {}

    /// TO-DO ///
    // [X] = determine prompt-level
    // [X] = determine if focus is mastered
    // [X] = determine focus-step index
    // [ ] = determine probe or trainging session
    // [ ] = determine current session number
    // [ ] = determine current session number
    // [ ] = determine ...

    
    /**
     * init()
     * --this method initializes and defines all of the above class variables
     * @param chainData all of participant's session history data
     */
    static init(chainData: SkillstarChain){
        // DEFINE: currentSessionNumber = 0;
        // DEFINE: currentSessionType = ChainSessionType;
        // DEFINE: prevFocusStepPromptLevel = null;
        // DEFINE: currFocusStepPromptLevel = null;
        this.promptHierarchy = this._convertMapToArray(ChainStepPromptLevelMap);
        this.prevSessionData = this._getPreviousSessionData(chainData);
        this.prevFocusStep = this._getPrevSessionFocusStepData(this.prevSessionData);
        this.determineStepAttemptPromptLevel(chainData);
        this.determineCurrentFocusStep();
    }

    static isSessionProbeOrTraining(){
        // create array of all training sessions
        // get length of array
        // IF(length of array % 3 === 0)
        // ---- THEN currSessionType = "Probe"
        // ELSE:
        // ---- THEN currSessionType = "Training"
    }

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

    // all of participant's session history data
    static _getPreviousSessionData(chainData: SkillstarChain){
        return chainData.sessions[chainData.sessions.length - 1];
    }

    /**
     * 
     * @param session : prev session data
     * -- finds and returns focus step of previous session
     */
    static _getPrevSessionFocusStepData(session: ChainSession) {
        return session.step_attempts.find((e) => {
            let s = e.status;
            if(s === "focus"){
                return e;
            }
        });
    }

    // util: converting map to array
    static _convertMapToArray(eMap: {}){
        return  Object.values(eMap);    
    }

    /**
     * _getNextPromptLevel()
     * @param promptLvl: "string" is the previous prompt level
     * -- from promptHier array, returns an object from prompthier of next prompt level
     */
    static _getNextPromptLevel(promptLvl:string){
        return this.promptHierarchy[this.promptHierarchy.findIndex((e)=>(e["key"]===promptLvl)) - 1];
    }

    static _setCurrPromptLevel(prompt:string){
        if(prompt != undefined){
            this.currFocusStepPromptLevel = prompt;
        }
    }

    // static _setCurrFocusStepPromptLevel(prompt:){
    //     this.currFocusStepPromptLevel = 
    // }

    /** GET STEP_ATTEMPT PROMPT LEVEL */
    /**
     * determineStepAttemptPromptLevel()
     * -- determines and sets current session's focus step prompt-level
     * @param chainData : all of participant's session history data
     */
    static determineStepAttemptPromptLevel(chainData: SkillstarChain){
        // this.promptHierarchy = this._convertMapToArray(ChainStepPromptLevelMap);
        // let prevSessionData = this._getPreviousSessionData(chainData);
        // let prevFocusStep = this._getPrevSessionFocusStepData(prevSessionData);

        let prevPromptLevel = this.prevFocusStep?.prompt_level;

        if(this.prevFocusStep && this.prevFocusStep.completed){
            this._setCurrPromptLevel(this._getNextPromptLevel(prevPromptLevel).key);
        } else if(this.prevFocusStep && !this.prevFocusStep.completed) {
            this._setCurrPromptLevel(prevPromptLevel);
        } else {
            this._setCurrPromptLevel(this.promptHierarchy[this.promptHierarchy.length])
        }
    }

    // 
    static determineCurrentFocusStepId(){
        if(this.prevFocusStep){
            if(this._isPrevFocusMastered()){
                this.currFocusStepId = this.prevFocusStep.chain_step_id + 1;
            } else {
                this.currFocusStepId = this.prevFocusStepId;
            }
        }
    }

    /**
     * factors whether prev session's focus step was mastered
     * returns boolean
     */
    static _isPrevFocusMastered(){
        const {completed, prompt_level, had_challenging_behavior} = this.prevFocusStep;
        if(completed && prompt_level === "none" && !had_challenging_behavior){
            return true;
        } else {
            return false;
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
}
