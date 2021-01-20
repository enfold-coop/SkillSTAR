import { ChainSessionType } from '../../types/CHAIN/ChainSession';
import { SkillstarChain } from '../../types/CHAIN/SkillstarChain';
import { ChainStepPromptLevel, ChainStepStatus, ChallengingBehaviorSeverity } from '../../types/CHAIN/StepAttempt';

export const mockChainQuestionnaire: SkillstarChain = {
  id: 2,
  last_updated: new Date('2021-01-04T15:48:05.757662+00:00'),
  participant_id: 704609662,
  user_id: 4,
  time_on_task_ms: 276853,
  sessions: [
    {
      id: 4,
      last_updated: new Date('2021-01-04T15:43:16.083844+00:00'),
      time_on_task_ms: 0,
      date: new Date('2021-01-04T05:00:00'),
      completed: false,
      session_type: ChainSessionType.training,
      step_attempts: [
        {
          id: 3,
          last_updated: new Date('2021-01-04T15:43:16.083844+00:00'),
          chain_step_id: 4,
          chain_step: {
            id: 4,
            name: 'toothbrushing_05',
            instruction: 'Brush the biting surface of your top teeth, moving from one side to the other',
            last_updated: new Date('2020-12-30T15:04:53.894690+00:00'),
          },
          date: new Date('2021-01-04T05:00:00'),
          status: ChainStepStatus.not_complete,
          completed: true,
          was_prompted: true,
          prompt_level: ChainStepPromptLevel.none,
          had_challenging_behavior: false,
          challenging_behavior_severity: ChallengingBehaviorSeverity.mild,
          challenging_behaviors: [
            {
              id: 3,
              last_updated: new Date('2021-01-04T15:43:16.083844+00:00'),
              chain_session_step_id: 3,
              time: new Date('2021-01-04T05:00:00'),
            },
          ],
        },
      ],
    },
    {
      id: 5,
      last_updated: new Date('2021-01-04T15:48:05.744576+00:00'),
      time_on_task_ms: 0,
      date: new Date('2021-01-20T05:00:00'),
      completed: false,
      session_type: ChainSessionType.probe,
      step_attempts: [],
    },
  ],
};
