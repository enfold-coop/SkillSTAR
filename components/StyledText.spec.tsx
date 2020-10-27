import * as React from 'react';
import renderer from 'react-test-renderer';
import {wait} from '../_util/testing/wait';
import {MonoText} from './StyledText';

describe('App', () => {
  afterEach(async () => {
    await wait();
  });

  it(`renders correctly`, () => {
    const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
