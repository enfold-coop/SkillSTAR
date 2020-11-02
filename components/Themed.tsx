import { Text as DefaultText, View as DefaultView } from "react-native";
import {ReactElement} from 'react';
import * as React from "react";
import {TextProps, ViewProps} from '../_types/Theme';
import Colors from "../styles/Colors";
import useColorScheme from "../hooks/useColorScheme";

export const useThemeColor = (
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string => {
	const theme = useColorScheme();
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}


export const Text = (props: TextProps): ReactElement => {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

	return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export const View = (props: ViewProps): ReactElement => {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background"
	);

	return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
