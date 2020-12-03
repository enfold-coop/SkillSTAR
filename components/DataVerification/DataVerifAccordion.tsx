import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";

import CustomColors from "../../styles/Colors";

type Props = {};

const DataVerifAccordion: FC<Props> = (props) => {
	return (
		<View style={[styles.container]}>
			<View style={[styles.subContainer]}>
				<Text style={styles.question}>
					{"QUESTION QUESTION QUESTION QUESTION QUESTION??"}
				</Text>
				<View style={styles.formContainer}>
					<TouchableOpacity>
						<Text style={styles.input}>INPUT</Text>
					</TouchableOpacity>
					<TouchableOpacity>
						<Text style={styles.input}>INPUT</Text>
					</TouchableOpacity>
					<TouchableOpacity>
						<Text style={styles.input}>INPUT</Text>
					</TouchableOpacity>
					<TouchableOpacity>
						<Text style={styles.input}>INPUT</Text>
					</TouchableOpacity>
					<TouchableOpacity>
						<Text style={styles.input}>INPUT</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default DataVerifAccordion;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 20,
		marginBottom: 40,
		padding: 20,
		borderColor: CustomColors.uva.gray,
		borderWidth: 1,
		borderRadius: 10,
	},
	subContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	question: {
		width: "50%",
		paddingTop: 5,
	},
	formContainer: {
		width: "50%",
	},
	input: {
		padding: 10,
	},
});
