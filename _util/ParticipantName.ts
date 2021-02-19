import { Participant } from '../types/User';

export const participantName = (p: Participant): string | undefined => {
  if (p.identification) {
    const first = p.identification.nickname || p.identification.first_name;
    const last = p.identification.last_name;
    return `${first} ${last}`;
  } else if (p.name) {
    return p.name;
  } else {
    return `${p.id}`;
  }
};
