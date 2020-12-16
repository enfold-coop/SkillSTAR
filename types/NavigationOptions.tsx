import {StackNavigationOptions} from '@react-navigation/stack';
import React from 'react';
import CustomColors from '../styles/Colors';

export const screenOpts: StackNavigationOptions = {
	headerStyle: {
		backgroundColor: CustomColors.uva.mountain,
	},
	headerTintColor: CustomColors.uva.white,
	headerTitleStyle: {
		fontWeight: "bold",
		color: "#fff",
	},
};
