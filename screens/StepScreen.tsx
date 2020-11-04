import React, { FC, Fragment } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootNavProps } from "../navigation/root_types";

type Props = {
	route: RootNavProps<"StepScreen">;
	navigation: RootNavProps<"StepScreen">;
};

const StepScreen: FC<Props> = (props) => {
	console.log(props);
	/**
	 * Need to add:
	 * - step number, w/ label
	 * - steps progress bar
	 * - "challenging behavior" button
	 * - view for instructions and/or video
	 * - "Focused step" label
	 * - EXIT button
	 * - NEXT button
	 */
	return (
		<View style={styles.container}>
			<View>
				{/* flex: row */}
				<Text style={styles.headline}>
					Have you gathered your materials?
				</Text>
				{/* PROGRESS BAR */}
			</View>
			<View>
				{/* flex: column */}
				<View>
					{/* flex: row */}
					<TouchableOpacity>
						<Text>DIFFICULTY BUTTON</Text>
					</TouchableOpacity>
					<Text>
						Click on this icon anytime your child is having
						difficulty or experiening challenging behavior.
					</Text>
				</View>
				<View>
					{/* flex: row */}
					{/* <Image source={require("...to focus step icon")}/> */}
				</View>
				<Button
					mode="contained"
					onPress={() => {
						console.log("nav to next step");
					}}
				>
					NEXT
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	headline: {},
	listContainer: {},
	icon: {},
	itemName: {},
});

export default StepScreen;
