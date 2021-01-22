import { mockChainQuestionnaire } from '../../_util/testing/mockChainQuestionnaire';
import { ChainData } from './SkillstarChain';

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
});
