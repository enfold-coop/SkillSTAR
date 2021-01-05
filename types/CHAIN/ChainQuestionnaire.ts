import { ChainSession } from "./ChainSession";

export interface ChainQuestionnaire {
	id: number;
	last_updated: Date;
	participant_id: number;
	user_id: number;
	time_on_task_ms: number;
	sessions: ChainSession[];

	// TODO: Add the group?
}
