import {act} from '@testing-library/react-native';

export const wait = async (ms = 0) => {
  await act(async () => {
    return new Promise(resolve => {
      return setTimeout(resolve, ms);
    });
  });
}
