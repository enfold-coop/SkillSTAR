import { ChainSession } from './ChainSession';

export interface SkillstarChain {
  id?: number;
  last_updated?: Date;
  participant_id: number;
  user_id?: number;
  time_on_task_ms?: number;
  sessions: ChainSession[];

  // TODO: Add the group?
}

export class ChainData {
  id?: number;
  last_updated?: Date;
  participant_id: number;
  user_id?: number;
  time_on_task_ms?: number;
  sessions: ChainSession[];

  constructor(skillstarChain: SkillstarChain) {
    this.id = skillstarChain.id;
    this.last_updated = skillstarChain.last_updated;
    this.participant_id = skillstarChain.participant_id;
    this.user_id = skillstarChain.user_id;
    this.time_on_task_ms = skillstarChain.time_on_task_ms;
    this.sessions = skillstarChain.sessions;
  }
}
