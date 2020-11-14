import React, { FC } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";
import { PREP_MATS } from "../data/prep_materials";

type Props = {
	route: RootNavProps<"PrepareMaterialsScreen">;
	navigation: RootNavProps<"PrepareMaterialsScreen">;
};

const PrepareMaterialsScreen: FC<Props> = (props) => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<Text style={styles.headline}>
				Have you gathered your materials?
			</Text>
			{PREP_MATS.map((e) => {
				return (
					<Card style={{ margin: 2 }}>
						<View style={styles.listItem}>
							<Card.Content>
								<Image
									style={styles.itemIcon}
									source={require("../assets/images/materials/toothbrush.png")}
								/>
							</Card.Content>
							<Card.Title
								title={e.title}
								style={styles.itemTitle}
							/>
						</View>
					</Card>
				);
			})}
			<Button
				mode="contained"
				color={CustomColors.uva.blue}
				style={styles.nextBtn}
				onPress={() => {
					navigation.navigate("StepScreen");
				}}
			>
				Next
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		paddingTop: 30,
		alignContent: "center",
		justifyContent: "center",
	},
	headline: {
		fontSize: 20,
	},
	listItem: {
		margin: 10,
		padding: 10,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignContent: "space-around",
	},
	itemIcon: {
		width: 80,
		height: 80,
	},
	itemTitle: {
		width: 200,
		padding: 10,
	},
	nextBtn: {
		margin: 20,
		width: 122,
		alignSelf: "center",
	},
});

export default PrepareMaterialsScreen;
