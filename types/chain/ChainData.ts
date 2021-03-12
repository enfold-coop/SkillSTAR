import { deepClone } from '../../_util/deepClone';
import { ChainSession } from './ChainSession';
import { StepAttempt } from './StepAttempt';

export interface SkillstarChain {
  id?: number;
  last_updated?: Date;
  participant_id: number;
  user_id?: number;
  time_on_task_ms?: number;
  sessions: ChainSession[];
}

export class ChainData implements SkillstarChain {
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
    this.sessions = this.sortSessionsInChain(skillstarChain);
  }

  get numSessions(): number {
    return this.sessions.length;
  }

  get lastSession(): ChainSession {
    return this.sessions[this.sessions.length - 1];
  }

  /**
   * Updates the specific chain step attempt with the given data
   * @param sessionId: The id of the session
   * @param chainStepId: The chain_step_id in the step attempt
   * @param newStep: Data to update the step with
   */
  updateStep(sessionId: number, chainStepId: number, newStep: StepAttempt): void {
    this.sessions.forEach((session, i) => {
      if (session.id === sessionId) {
        session.step_attempts.forEach((stepAttempt, j) => {
          if (chainStepId === stepAttempt.chain_step_id) {
            this.sessions[i].step_attempts[j] = newStep;
          }
        });
      }
    });
  }

  /**
   * Updates a specific session with the given data
   * @param sessionId: The id of the session
   * @param newSession: Data to update the session with
   */
  updateSession(sessionId: number, newSession: ChainSession): void {
    this.sessions.forEach((session, i) => {
      if (session.id !== undefined && session.id === sessionId) {
        this.sessions[i] = newSession;
      }
    });

    this.sortSessions();
  }

  /**
   * Adds or updates a given session in the chain data sessions array.
   * @param newSession: Data to update the session with
   */
  upsertSession(newSession: ChainSession): void {
    if (newSession.id !== undefined && newSession.id !== null) {
      this.updateSession(newSession.id, newSession);
    } else {
      this.sessions.push(newSession);
    }

    this.sortSessions();
  }

  /**
   * Returns a specific step within a specific session
   * @param sessionId
   * @param chainStepId
   */
  getStep(sessionId: number, chainStepId: number): StepAttempt | undefined {
    for (const session of this.sessions) {
      if (session.id === sessionId) {
        for (const stepAttempt of session.step_attempts) {
          if (chainStepId === stepAttempt.chain_step_id) {
            return stepAttempt;
          }
        }
      }
    }
  }

  /**
   * Returns all step attempts across all sessions that match the given chainStepId
   * @param chainStepId
   */
  getAllStepAttemptsForChainStep(chainStepId: number): StepAttempt[] {
    const stepAttempts: StepAttempt[] = [];
    this.sessions.forEach((session) => {
      session.step_attempts.forEach((stepAttempt) => {
        if (stepAttempt.chain_step_id === chainStepId) {
          stepAttempts.push(stepAttempt);
        }
      });
    });
    return stepAttempts;
  }

  clone(): ChainData {
    const clonedObject = deepClone<ChainData>(this);
    return new ChainData(clonedObject);
  }

  /**
   * Given a SkillstarChain, returns a list of sessions, sorted by date in ascending order (from past to present).
   * @param skillstarChain
   * @private
   */
  private sortSessionsInChain(skillstarChain: SkillstarChain): ChainSession[] {
    return this.sortSessionDates(this.convertSessionDates(skillstarChain.sessions));
  }

  /**
   * Sorts this instance's list of sessions, sorted by date in ascending order (from past to present).
   * @private
   */
  private sortSessions() {
    this.sessions = this.sortSessionDates(this.convertSessionDates(this.sessions));
  }

  /**
   * Returns the given list of sessions, with all dates converted to Date instances.
   * @param sessions
   */
  private convertSessionDates(sessions: ChainSession[]): ChainSession[] {
    // Make sure all the dates are actually dates
    return sessions.map((s) => {
      if (!s.date) {
        throw new Error('session date is not populated.');
      } else {
        s.date = new Date(s.date);
      }

      // Convert all step attempt dates to strings
      s.step_attempts = s.step_attempts.map((sa) => {
        if (!sa.date) {
          throw new Error('step attempt date is not populated.');
        } else {
          sa.date = new Date(sa.date);
        }
        sa.last_updated = sa.last_updated ? new Date(sa.last_updated) : new Date();
        return sa;
      });
      return s;
    });
  }

  /**
   * Returns the given list of sessions, with all sessions sorted by date.
   * @param sessions
   */
  private sortSessionDates(sessions: ChainSession[]): ChainSession[] {
    return sessions.sort((a, b) => {
      if (a && b && a.date && b.date) {
        return a.date.getTime() - b.date.getTime();
      } else {
        return 0;
      }
    });
  }
}
