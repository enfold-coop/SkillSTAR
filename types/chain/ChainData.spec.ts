import { mockChainQuestionnaire } from '../../_util/testing/mockChainQuestionnaire';
import { ChainData } from './ChainData';

describe('ChainData', () => {
  const chainData = new ChainData(mockChainQuestionnaire);

  it('should create an instance', () => {
    expect(chainData).toBeTruthy();
    expect(chainData.sessions).toBeTruthy();
  });

  it('should sort the sessions by date', () => {
    // The sessions are not always sorted when they are sent from the database.
    const dateBefore0 = mockChainQuestionnaire.sessions[0].date;
    const dateBefore1 = mockChainQuestionnaire.sessions[1].date;
    if (dateBefore0 && dateBefore1) {
      expect(dateBefore0.getTime()).toBeGreaterThan(dateBefore1.getTime());
    }

    chainData.sessions.forEach((session, i) => {
      expect(session).toBeTruthy();
      const lastSessionIndex = i - 1;

      if (lastSessionIndex >= 0) {
        const lastSession = chainData.sessions[lastSessionIndex];
        expect(lastSession).toBeTruthy();

        if (lastSession && session) {
          expect(lastSession.date).toBeTruthy();
          expect(session.date).toBeTruthy();
          expect(lastSession.date).toBeInstanceOf(Date);
          expect(session.date).toBeInstanceOf(Date);

          if (lastSession.date && session.date) {
            expect(lastSession.date.getTime()).toBeLessThan(session.date.getTime());
          }
        }
      }
    });
  });

  it('should get all step attempts for a certain chain step', () => {
    const chainStepId = 0;
    const stepAttempts = chainData.getAllStepAttemptsForChainStep(chainStepId);
    expect(stepAttempts).toHaveLength(chainData.sessions.length);
    expect(stepAttempts.every((s) => s.chain_step_id === chainStepId)).toBeTruthy();

    stepAttempts.forEach((stepAttempt, i) => {
      expect(stepAttempt).toBeTruthy();
      const lastStepIndex = i - 1;

      if (lastStepIndex >= 0) {
        const lastStep = chainData.sessions[lastStepIndex];
        expect(lastStep).toBeTruthy();

        if (lastStep && stepAttempt) {
          expect(lastStep.date).toBeTruthy();
          expect(stepAttempt.date).toBeTruthy();
          expect(lastStep.date).toBeInstanceOf(Date);
          expect(stepAttempt.date).toBeInstanceOf(Date);

          if (lastStep.date && stepAttempt.date) {
            expect(lastStep.date.getTime()).toBeLessThan(stepAttempt.date.getTime());
          }
        }
      }
    });
  });

  it('should clone chain data', () => {
    const numStepAttemptsBefore = chainData.sessions.reduce((totalNumAttempts, session) => {
      return totalNumAttempts + session.step_attempts.length;
    }, 0);

    const clonedChainData = chainData.clone();

    // Should not be the same object.
    expect(clonedChainData === chainData).toEqual(false);

    // Should have all the same data, though.
    expect(clonedChainData).toEqual(chainData);

    const numStepAttemptsAfter = chainData.sessions.reduce((totalNumAttempts, session) => {
      return totalNumAttempts + session.step_attempts.length;
    }, 0);

    expect(numStepAttemptsAfter).toEqual(numStepAttemptsBefore);
  });
});
