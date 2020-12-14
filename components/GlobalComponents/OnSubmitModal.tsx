import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { Portal, Provider, Button } from "react-native-paper";
import CustomColors from "../../styles/Colors";

const OnSubmitModal = (props) => {
	const [isActive, setIsActive] = useState(true);
	return (
		<Modal
			// animationType="slide"
			transparent={true}
			visible={isActive}
			onRequestClose={() => {
				console.log("close me");
			}}
		>
			<View style={styles.container}>
				<View style={styles.subContainer}>
					<Text style={styles.headline}>
						Are you sure you're ready to submit this data?
					</Text>
					<View style={styles.btnContainer}>
						<Button
							style={styles.submitBtn}
							color={CustomColors.uva.gray}
							mode="contained"
							onPress={() => {
								setIsActive(false);
							}}
						>
							No
						</Button>
						<Button
							style={styles.submitBtn}
							mode="contained"
							onPress={() => {
								console.log("submit");
							}}
						>
							Yes
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default OnSubmitModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 150,
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	subContainer: {
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 30,
	},
	btnContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	headline: {
		fontSize: 20,
		padding: 20,
		alignSelf: "center",
	},
	verifText: {
		textAlign: "center",
		fontSize: 18,
		fontWeight: "600",
	},
	modal: {
		// height: 600,
		width: 400,
	},
	exitBtn: {
		alignSelf: "flex-start",
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
		height: 40,
		width: 80,
	},
	submitBtn: {
		// marginLeft: 280,
		// marginTop: 100,
		backgroundColor: CustomColors.uva.orange,
		color: CustomColors.uva.gray,
		width: 122,
		margin: 5,
	},
});
