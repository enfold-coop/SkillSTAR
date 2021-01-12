import { SkillstarChain } from "../types/CHAIN/SkillstarChain";
import { ChainSession, ChainSessionType } from "../types/CHAIN/ChainSession";
import { MasteryInfo } from "../types/CHAIN/MasteryLevel";
import {
	ChainStepPromptLevel,
	ChainStepStatus,
	StepAttempt,
} from "../types/CHAIN/StepAttempt";

/**
 * Mastery Algorithm
 * UTIL function (can be moved to another file)
 *
 * Params: chainData = the entire SkillstarChain
 * Returns one of the following:
 * - An empty probe session, if the user has no attempted sessions yet
 * - The next session the participant should be attempting, if there is one.
 * - An empty probe session, if there are none left to attempt (???)
 */
export class MasteryService {
	// TODO: Figure out where to ChainProviderContext where the user started in this hierarchy.
	// TODO: Also figure out where to ChainProviderContext where the user currently is, on a session-by-session basis...?
	promptHierarchy = [
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

	constructor() {}

	// TODO: Take a stepId, return a mastery level and list of key milestone dates. Walk through all sessions,
	//  make a list of all steps matching stepId, look at prompt levels and completion to determine
	//  mastery level and these dates:
	//  - date introduced
	//  - date mastered
	//  - date booster training initiated
	//  - date booster training mastered
	static getMasteryInfoForStep(
		chainData: SkillstarChain,
		chainStepId: number
	): MasteryInfo {
		const masteryInfo: MasteryInfo = {
			chainStepId,
			stepStatus: ChainStepStatus.not_complete,
		};

		const steps = this.getAllStepAttemptsForChainStepName(
			chainData,
			chainStepId
		);

		if (steps.length > 0) {
			// First date in the list will be the date introduced.
			masteryInfo.dateIntroduced = steps[0].date;

			// Find the time the step was first mastered
			const masteredStepIndex = steps.findIndex(
				(s) => s.status === ChainStepStatus.mastered
			);
			if (masteredStepIndex !== -1) {
				masteryInfo.stepStatus = ChainStepStatus.mastered;
				masteryInfo.dateMastered = steps[masteredStepIndex].date;

				// Find first booster step
				// - After date mastered
				// - Session type == probe
				//   - 2 consecutive sessions where:
				//     - incomplete AND
				//     - ((prompt level !=== none) OR had_challenging_behavior)
				// - Session type == training
				//   - 3 consecutive sessions where:
				//     - incomplete AND
				//     - (was_prompted OR had_challenging_behavior)
				const stepsAfterMastered = steps.slice(masteredStepIndex);
				const sessionTypes = [
					ChainSessionType.probe,
					ChainSessionType.training,
				];

				let boosterStepIndex = -1;
				sessionTypes.forEach((sessionType) => {
					if (!masteryInfo.dateBoosterInitiated) {
						boosterStepIndex = this.findIndexBoosterIntroduced(
							steps.slice(masteredStepIndex),
							sessionType
						);
						if (boosterStepIndex !== -1) {
							masteryInfo.stepStatus = ChainStepStatus.focus;
							masteryInfo.dateBoosterInitiated =
								stepsAfterMastered[boosterStepIndex].date;
						}
					}
				});

				// Find date booster step mastered
				const stepsAfterBooster = steps.slice(boosterStepIndex);
			}
		}

		return masteryInfo;
	}

	static _sortSessionsByDate(
		unsortedSessions: ChainSession[]
	): ChainSession[] {
		return unsortedSessions.sort((a, b) => {
			if (a.date && b.date) {
				return a.date?.getTime() - b.date?.getTime();
			} else {
				return -1;
			}
		});
	}

	// Returns all the step attempts for the given chain that match a certain step name, sorted by date
	static getAllStepAttemptsForChainStepName(
		chainData: SkillstarChain,
		chainStepId: number
	): StepAttempt[] {
		const stepAttempts: StepAttempt[] = [];

		this._sortSessionsByDate(chainData.sessions).forEach((session) => {
			session.step_attempts.forEach((stepAttempt) => {
				// Add session type to step attempt
				stepAttempt.session_type = session.session_type;

				if (stepAttempt.chain_step_id === chainStepId) {
					stepAttempts[chainStepId] = stepAttempt;
				}
			});
		});

		return stepAttempts;
	}

	/**
	 * findIndexBoosterIntroduced
	 * Returns index of step attempt where more than the number of attempts consecutively were incomplete AND either
	 * required prompting or had challenging behavior
	 *
	 * @param stepAttempts - List of step attempts
	 * @param sessionType - The type of session we're looking for
	 */
	static findIndexBoosterIntroduced(
		stepAttempts: StepAttempt[],
		sessionType: ChainSessionType
	): number {
		const numAttempts = sessionType === ChainSessionType.probe ? 2 : 3;
		let boosterIndex = -1;

		if (stepAttempts.length < numAttempts) {
			return boosterIndex;
		}

		let numConsecutiveAttempts = 0;

		stepAttempts.forEach((stepAttempt, i) => {
			if (
				stepAttempt.session_type === sessionType &&
				!stepAttempt.completed &&
				(stepAttempt.was_prompted ||
					stepAttempt.had_challenging_behavior)
			) {
				if (numConsecutiveAttempts === numAttempts) {
					boosterIndex = i;
				}

				if (numConsecutiveAttempts < numAttempts) {
					numConsecutiveAttempts++;
				}
			} else {
				numConsecutiveAttempts = 0;
			}
		});

		return boosterIndex;
	}

	/**
	 * shouldFocusOnStep
	 * Returns true if: All the step attempts for the given chain matching a certain step ID had challenging behavior
	 * more than the given number of attempts, AND the challenging behavior prevented step completion for those steps.
	 *
	 * @param skillstarChain - All Chain Data for the selected participant
	 * @param chainStepId - The specific chain step to focus on
	 * @param numAttempts - The minimum number of attempts
	 */
	static shouldFocusOnStep(
		skillstarChain: SkillstarChain,
		chainStepId: number,
		numAttempts: number
	): boolean {
		if (skillstarChain.sessions.length < numAttempts) {
			return false;
		}

		let numChallenging = 0;
		let challengingStepAttempts: StepAttempt[] = [];

		this._sortSessionsByDate(skillstarChain.sessions).forEach(
			(session) => {
				session.step_attempts.forEach((stepAttempt) => {
					if (
						stepAttempt.chain_step_id === chainStepId &&
						stepAttempt.had_challenging_behavior
					) {
						if (numChallenging < numAttempts) {
							numChallenging++;
							challengingStepAttempts.push(stepAttempt);
						}
					} else {
						numChallenging = 0;
						challengingStepAttempts = [];
					}
				});
			}
		);

		return (
			numChallenging >= numAttempts &&
			challengingStepAttempts.every((sa) => !sa.completed)
		);
	}

	static getNextSession(chainData: SkillstarChain) {
		// Some of the sessions will be future/not attempted sessions.
		// We want the next session the participant should be attempting.
		const numSessions = chainData.sessions ? chainData.sessions.length : 0;

		// If there are no sessions, return a probe session.

		// Otherwise, return the first un-attempted session OR the last attempted session, if there are no un-attempted sessions?

		const lastSess =
			numSessions > 0 ? chainData.sessions[numSessions - 1] : null;

		// !! overriding type for dev purposes
		// lastSess.session_type = ChainSessionType.training;

		if (lastSess === null) {
			//
		}
	}
}
