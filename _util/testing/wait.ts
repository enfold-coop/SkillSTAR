import { act } from '@testing-library/react-native';

export async function wait(ms = 0): Promise<void> {
  await act(async () => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
