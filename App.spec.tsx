import React from 'react';
import renderer from 'react-test-renderer';
import { wait } from './_util/testing/wait';
import App from './App';

describe('App', () => {
  afterEach(async () => {
    await wait();
  });

  it('renders correctly', async () => {
    const tree = await renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
