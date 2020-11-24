import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

type Props = {
	btnStyle: {};
};

const ToggleButtons: FC<Props> = (props) => {
	let { btnStyle } = props;
	let [btn1Mode, setBtn1Mode] = useState("outlined");
	let [btn2Mode, setBtn2Mode] = useState("outlined");

	const toggleBtn = (btn: string) => {
		if (btn === "btn1") {
			if (btn1Mode === "outlined") {
				setBtn1Mode("contained");
				setBtn2Mode("outlined");
			}
		} else if (btn === "btn2") {
			if (btn2Mode === "outlined") {
				setBtn1Mode("outlined");
				setBtn2Mode("contained");
			}
		}
	};

	return (
		<View style={styles.container}>
			<Button
				style={btnStyle}
				mode={btn1Mode}
				onPress={() => {
					toggleBtn("btn1");
				}}
			>
				Yes
			</Button>
			<Button
				style={btnStyle}
				mode={btn2Mode}
				onPress={() => {
					toggleBtn("btn2");
				}}
			>
				No
			</Button>
		</View>
	);
};

export default ToggleButtons;

const styles = StyleSheet.create({
	container: { flexDirection: "row" },
});
