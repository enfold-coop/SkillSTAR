import React, { FC } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import CustomColors from "../../styles/Colors";

type Props = {
	name: string;
};

const AppHeader: FC<Props> = (props) => {
	return (
		<View style={styles.container}>
			<Image
				source={require("../../assets/images/logo.png")}
				style={styles.logo}
			/>
			<View style={styles.skillTextContainer}>
				<Text style={styles.headline}>{props.name}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 10,
		marginTop: 0,
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		color: "#000",
		paddingTop: 0,
		paddingBottom: 10,
		borderBottomWidth: 3,
		borderBottomColor: CustomColors.uva.orange,
	},
	logo: {
		width: 50,
		height: 50,
		marginBottom: 10,
	},
	skillTextContainer: {
		flexDirection: "column",
		justifyContent: "center",
		padding: 0,
		paddingLeft: 30,
	},
	headline: {
		fontSize: 30,
		fontWeight: "800",
		color: "#000",
		alignSelf: "center",
	},
	subHeadline: {
		fontSize: 20,
	},
});

export default AppHeader;
