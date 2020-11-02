import * as React from 'react';
import {ReactElement} from 'react';
import {TextProps} from '../_types/Theme';
import {Text} from './Themed';

export const MonoText = (props: TextProps): ReactElement => {
  return <Text {...props} style={[props.style, {fontFamily: 'space-mono'}]}/>;
}
