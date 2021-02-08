import { SkillstarChain } from '../../types/chain/ChainData';
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
  last_updated: new Date('2021-01-05T13:00:00.000000+00:00'),
  participant_id: 704609662,
  user_id: 4,
  time_on_task_ms: 276853,

  // Purposefully make these out of order.
  sessions: [
    mockSession5, // training
    mockSession0, // probe
    mockSession2, // probe
    mockSession1, // probe
    mockSession4, // training
    mockSession3, // training
  ],
};
