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
import { TouchableHighlight } from "react-native-gesture-handler";

// MOCK SESSIONS ARRAY LENGTH
const MOCKSESSIONSLENGTH = 5;

export class MasteryAlgo {
	PROBE_MAX_CONSECUTIVE_INCOMPLETE:number = 2;
	TRAINING_MAX_CONSECUTIVE_INCOMPLETE:number = 3;
    incompleteCount:number = 0;
    static currentSessionType: ChainSessionType;
    static prevSessionType: ChainSessionType;
    static prevSessionData: SkillstarChain;
    static prevFocusStep: StepAttempt;
    static currFocusStep: StepAttempt;
    static currentSessionNumber: number;
    static prevFocusStepPromptLevel: ChainStepPromptLevel;
    static currFocusStepPromptLevel: ChainStepPromptLevel;
    static currFocusStepId: number;
    static prevFocusStepId: number;
    static sessionsArray: ChainSession[];
    static promptHierarchy: ChainStepPromptLevel[];
    
    constructor() {}

    /// TO-DO ///
    // [X] = set sessionsArray
    // [X] = determine prompt-level
    // [X] = determine if focus is mastered
    // [X] = determine focus-step index
    // [X] = determine current session number
    // [X] = determine probe or trainging session
    // [ ] = determine booster session (line 164)
    // [ ] = determine ...

    
    /**
     * init()
     * --this method initializes and defines all of the above class variables
     * @param chainData all of participant's session history data
     */
    static init(chainData: SkillstarChain){
        this.promptHierarchy = this._convertMapToArray(ChainStepPromptLevelMap);
        this.prevSessionData = this._getPreviousSessionData(chainData);
        this.prevFocusStep = this._getPrevSessionFocusStepData(this.prevSessionData);
        this.setSessionArray(chainData);
        this.determineCurrentSessionNumber(chainData);
        this.determineStepAttemptPromptLevel(chainData);
        this.determineCurrentFocusStepId();
        this._setPrevSessionType();
        this.determinePrevFocusStepId();
        this.isSessionProbeOrTraining();
        this.determineIfBoosterSession(); // line 186?
    }

    // util: converting map to array
    static _convertMapToArray(eMap: {}) {
        return  Object.values(eMap);    
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

    static setSessionArray(chainData:SkillstarChain){
        this.sessionsArray = chainData.sessions;
    }

    static determineCurrentSessionNumber(chainData: SkillstarChain){
        this.currentSessionNumber = chainData.sessions.length + 1;
    }

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
    static determinePrevFocusStepId(){
        if(this.prevFocusStep){
            this.prevFocusStepId = this.prevFocusStep.chain_step?.id;
        }
    }
    // Sets the current focus step id
    static determineCurrentFocusStepId(){
        if(this.prevFocusStep){
            if(this._isPrevFocusMastered()){
                this.currFocusStepId = this.prevFocusStep.chain_step_id + 1;
            } else {
                this.currFocusStepId = this.prevFocusStepId;
            }
        }
    }

    static _setPrevSessionType(){
        this.prevSessionType = this.sessionsArray[this.sessionsArray.length-1].session_type;
    }

    static isSessionProbeOrTraining(){
        if(this.sessionsArray.length % 3 === 0){
            this.currentSessionType = ChainSessionType.probe;
        } else {
            this.currentSessionType = ChainSessionType.training;
        }
    }

	static _determinePrevSessionType(chainData: SkillstarChain) {
		if (chainData && chainData.sessions.length < 1) {
			this.currentSessionType = ChainSessionType.probe;
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

    static _meetsBoosterCriteria(sessions: StepAttempt[], sessionType: string){
        let trainingBoosterMax = sessionType === "training" ? 3 : 2;
        let meetsCritCount = 0;
        for (let i = trainingBoosterMax; i > 0; i--) {
            // console.log(steps[i]);
            if (steps[i].had_challenging_behavior || steps[i].was_prompted) {
                meetsCritCount += 1;
            } else {
                meetsCritCount = 0;
            }
        }
        if(meetsCritCount >= trainingBoosterMax){
            return true;
        } else {
            return false;
        }
    }

    // contains logic to determine if a session is a booster session
    static determineIfBoosterSession(){
        let prevCount = 0;
        // 3. decl var TOTAL_SESSIONS_MET_COUNT = 0
        let TOTAL_SESSIONS_MET_COUNT = 0;
        // 4. decl sessions.length var
        let sessionLength = this.sessionsArray.length;
        // 1. get prevSessType
        let lastSessType = this.sessionsArray[sessionLength-1].session_type;
        // 2. get focusStepId
        let id = this.prevFocusStepId;

        let minAmntPrevMastered = lastSessType === "training" ? 3 : 2;
        // 7. FOR_LOOP:

        // ---- FOR(MAXCRITCOUNT; index--): 
        if(minAmntPrevMastered < sessionLength){
            for (let i = minAmntPrevMastered; i > 0 ; i--) {
                // -------- IF(session[index].step_attempt[stepID] had: CHAL_BEHAV -OR- NEEDED_PROMPTING ): 
                console.log(i);
            }
        } else {
            console.log("*** Doesn't qualify as booster ***");
            return;
        }
        // ------------ THEN: TOTAL_SESSIONS_MET_COUNT += 1
        // -------- ELSE: 
        // ------------ THEN: TOTAL_SESSIONS_MET_COUNT = 0;
        // 8. IF:(TOTAL_SESSIONS_MET_COUNT >= MAXCRITCOUNT):
        // ---- THEN: currSession = BOOSTER
        // 9. ELSE:
        // ---- THEN: currSession = NOT booster
    }

    /**
     * _getNextPromptLevel()
     * @param promptLvl: "string" is the previous prompt level
     * -- from promptHier array, returns an object from prompthier of next prompt level
     */
    static _getNextPromptLevel(promptLvl:string){
        return this.promptHierarchy[this.promptHierarchy.findIndex((e)=>(e["key"] === promptLvl)) - 1];
    }

    static _setCurrPromptLevel(prompt:ChainStepPromptLevel){
        if(prompt != undefined){
            this.currFocusStepPromptLevel = prompt;
        }
    }

    // static _setCurrFocusStepPromptLevel(prompt:){
    //     this.currFocusStepPromptLevel = 
    // }

    /**
     * factors whether prev session's focus step was mastered
     * returns boolean
     */
    static _isPrevFocusMastered(){
        const {completed, prompt_level, had_challenging_behavior} = this.prevFocusStep;
        if(completed && prompt_level === this.promptHierarchy[0].key && !had_challenging_behavior){
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
