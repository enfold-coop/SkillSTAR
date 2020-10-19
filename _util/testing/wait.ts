import {act} from '@testing-library/react-native';

export async function wait(ms = 0) {
  await act(async () => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  });
}
