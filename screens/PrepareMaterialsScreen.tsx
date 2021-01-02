import React, { FC, useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Title } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";
import AppHeader from "../components/Header/AppHeader";
import { session } from "../context/initial_states/initialSession";
import { store } from "../context/ChainProvider";

type Props = {
	route: RootNavProps<"PrepareMaterialsScreen">;
	navigation: RootNavProps<"PrepareMaterialsScreen">;
	sessionType: "";
};

const PrepareMaterialsScreen: FC<Props> = (props) => {
	const { state } = useContext(store);
	console.log(state.sessionType);

	const navigation = useNavigation();
	const { sessionType } = props;

	const [type, setType] = useState();
	// console.log(sessionType);

	useEffect(() => {
		// setType(props.route.params);
	}, []);

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.jpg")}
			resizeMode={"cover"}
			style={styles.image}
		>
			<View style={styles.container}>
				<AppHeader name="Prepare Materials" />
				<Card style={styles.listItem}>
					<Animatable.View animation="fadeIn" style={styles.listItem}>
						<Image
							style={styles.itemIcon}
							source={require("../assets/images/prep_materials_icon/toothbrush.png")}
						/>
						<Title style={styles.itemTitle}>Tooth Brush</Title>
					</Animatable.View>
				</Card>
				<Card style={styles.listItem}>
					<Animatable.View animation="fadeIn" style={styles.listItem}>
						<Image
							style={styles.itemIcon}
							source={require("../assets/images/prep_materials_icon/toothpaste.png")}
						/>
						<Title style={styles.itemTitle}>Tooth Paste</Title>
					</Animatable.View>
				</Card>
				<Card style={styles.listItem}>
					<Animatable.View animation="fadeIn" style={styles.listItem}>
						<Image
							style={styles.itemIcon}
							source={require("../assets/images/prep_materials_icon/towel.png")}
						/>
						<Title style={styles.itemTitle}>Towel</Title>
					</Animatable.View>
				</Card>
				<Card style={styles.listItem}>
					<Animatable.View animation="fadeIn" style={styles.listItem}>
						<Image
							style={styles.itemIcon}
							source={require("../assets/images/prep_materials_icon/water.png")}
						/>
						<Title style={styles.itemTitle}>Cup of Water</Title>
					</Animatable.View>
				</Card>
				<Card style={styles.listItem}>
					<Animatable.View animation="fadeIn" style={styles.listItem}>
						<Image
							style={styles.itemIcon}
							source={require("../assets/images/prep_materials_icon/medicine.png")}
						/>
						<Title style={styles.itemTitle}>Cabinet</Title>
					</Animatable.View>
				</Card>

				<Animatable.View animation="bounceIn">
					<Button
						mode="contained"
						color={CustomColors.uva.blue}
						style={styles.nextBtn}
						labelStyle={{ fontSize: 20 }}
						onPress={() => {
							if (state.sessionType === "training") {
								navigation.navigate("StepScreen");
							} else {
								navigation.navigate("BaselineAssessmentScreen");
							}
						}}
					>
						Next
					</Button>
				</Animatable.View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 20,
		alignContent: "flex-start",
		justifyContent: "flex-start",
		padding: 0,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	headline: {
		fontSize: 20,
	},
	listItem: {
		marginTop: 10,
		marginLeft: 10,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignContent: "stretch",
	},
	itemIcon: {
		width: 80,
		height: 80,
		margin: 20,
		marginLeft: 40,
		marginRight: 130,
	},
	itemTitle: {
		// width: 200,
		fontSize: 34,
		lineHeight: 34,
		alignSelf: "center",
		fontWeight: "400",
	},
	nextBtn: {
		padding: 10,
		fontSize: 24,
		margin: 10,
		marginRight: 0,
		width: 222,
		alignSelf: "flex-end",
	},
});

export default PrepareMaterialsScreen;
