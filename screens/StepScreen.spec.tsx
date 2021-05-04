import React from 'react';
import renderer from 'react-test-renderer';
import { TestRendererJSON } from '../_util/testing/testRendererTypes';
import { wait } from '../_util/testing/wait';
import { ChainMasteryProvider } from '../context/ChainMasteryProvider';
import { ParticipantProvider } from '../context/ParticipantProvider';
import { UserProvider } from '../context/UserProvider';
import StepScreen from './StepScreen';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const navModule = jest.requireActual('@react-navigation/native');
  return {
    ...navModule,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe('StepScreen', () => {
  let tree: TestRendererJSON;

  beforeEach(async () => {
    tree = await renderer
      .create(
        <UserProvider>
          <ParticipantProvider>
            <ChainMasteryProvider>
              <StepScreen />
            </ChainMasteryProvider>
          </ParticipantProvider>
        </UserProvider>,
      )
      .toJSON();
  });

  afterEach(async () => {
    await wait();
  });

  it('renders correctly', async () => {
    expect(tree).toMatchSnapshot();
  });
});
