import { SkillstarChain } from '../../types/chain/SkillstarChain';
import {
  mockSession0,
  mockSession1,
  mockSession2,
  mockSession3,
  mockSession4,
  mockSession5,
} from './mockChainSessions';

export const mockChainQuestionnaire: SkillstarChain = {
  id: 2,
  last_updated: new Date('2021-01-01T15:48:05.757662+00:00'),
  participant_id: 704609662,
  user_id: 4,
  time_on_task_ms: 276853,

  // Purposefully make these out of order.
  sessions: [mockSession5, mockSession0, mockSession2, mockSession1, mockSession4, mockSession3],
};
