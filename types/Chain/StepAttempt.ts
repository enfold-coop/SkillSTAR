import {ChainStep} from './ChainStep';


export enum ChallengingBehaviorSeverity {
	'mild' = 'Mild',
	'moderate' = 'Moderate',
	'severe' = 'Severe',
}

export interface ChallengingBehavior {
	id: number;
	time: Date;
}

export interface StepAttempt {
	id?: number;
	last_updated?: Date;
	date?: Date;
	status?: string;
	completed?: boolean;
	chain_step_id: number;
	chain_step?: ChainStep;
	was_prompted?: boolean;
	prompt_level?: string;
	had_challenging_behavior?: boolean;
	challenging_behavior_severity?: ChallengingBehaviorSeverity;
	challenging_behaviors?: ChallengingBehavior[];
}
