import React, { FC } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

import CustomColors from "../../styles/Colors";

type Props = {
	question: string;
	answerOptions: [];
};

const DataVerifAccordion: FC<Props> = (props) => {
	const { question, answerOptions } = props;
	// console.log(answerOptions);

	return (
		<View style={[styles.container]}>
			<View style={[styles.subContainer]}>
				<Text style={styles.question}>{question}</Text>
				<View style={styles.formContainer}>
					<FlatList
						data={answerOptions}
						renderItem={(item) => {
							return (
								// <View>
								<TouchableOpacity>
									<Text style={styles.input}>
										{item.index + 1}. {item.item}
									</Text>
								</TouchableOpacity>
								// </View>
							);
						}}
						keyExtractor={() => nanoid()}
					/>
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
