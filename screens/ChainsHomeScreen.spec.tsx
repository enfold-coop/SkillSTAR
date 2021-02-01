import React from 'react';
import renderer from 'react-test-renderer';
import { wait } from '../_util/testing/wait';
import { ChainMasteryProvider } from '../context/ChainMasteryProvider';
import { ParticipantProvider } from '../context/ParticipantProvider';
import { UserProvider } from '../context/UserProvider';
import ChainsHomeScreen from './ChainsHomeScreen';

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

describe('ChainsHomeScreen', () => {
  afterEach(async () => {
    await wait();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(
        <UserProvider>
          <ParticipantProvider>
            <ChainMasteryProvider>
              <ChainsHomeScreen />
            </ChainMasteryProvider>
          </ParticipantProvider>
        </UserProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
