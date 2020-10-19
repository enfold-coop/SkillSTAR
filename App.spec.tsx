import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';
import {wait} from './_util/testing/wait';

describe('App', () => {
  afterEach(async () => {
    await wait();
  })

  it('renders correctly', async () => {
    const tree = await renderer.create(<App/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
