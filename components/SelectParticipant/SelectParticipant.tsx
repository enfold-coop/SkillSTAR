import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
	ActivityIndicator,
	Button,
	Menu,
	Provider,
	Text,
} from "react-native-paper";
import { AuthContext } from "../../context/AuthProvider";
import CustomColors from "../../styles/Colors";
import { Participant } from "../../types/User";
import { MaterialIcons } from "@expo/vector-icons";

export interface SelectParticipantProps {}

export const SelectParticipant = (
	props: SelectParticipantProps
): ReactElement => {
	const context = useContext(AuthContext);
	const navigation = useNavigation();
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [menuItems, setMenuItems] = useState<ReactElement[]>();

	const [participant, setParticipant] = useState<Participant>();
	const [participants, setParticipants] = useState<Participant[]>();
	const closeMenu = () => setIsVisible(false);
	const openMenu = () => setIsVisible(true);

	const getCachedParticipant = async (): Promise<Participant | undefined> => {
		const cachedJson = await AsyncStorage.getItem("selected_participant");
		if (cachedJson) {
			return JSON.parse(cachedJson) as Participant;
		}
	};

	const selectParticipant = async (selectedParticipant: Participant) => {
		context.state.participant = selectedParticipant;
		await setParticipant(selectedParticipant);
		await AsyncStorage.setItem(
			"selected_participant",
			JSON.stringify(selectedParticipant)
		);
		await navigation.navigate("BaselineAssessmentScreen");
		await closeMenu();
	};

	const participantName = (p: Participant): string | undefined => {
		if (p.identification) {
			const first =
				p.identification.nickname || p.identification.first_name;
			const last = p.identification.last_name;
			return `${first} ${last}`;
		}
	};

	useEffect(() => {
		if (context && context.state) {
			if (!participant) {
				getCachedParticipant().then((p) => {
					if (p) {
						setParticipant(p);
					} else if (!participant && context.state.participant) {
						setParticipant(context.state.participant);
					}
				});
			}
			if (
				!menuItems &&
				context.state.user &&
				context.state.user.participants
			) {
				const dependents = context.state.user.participants.filter(
					(p) => p.relationship === "dependent"
				);
				const items = dependents.map((p: Participant) => {
					return (
						<Menu.Item
							onPress={() => selectParticipant(p)}
							title={participantName(p)}
							key={"participant_" + p.id}
							style={styles.menuItem}
						/>
					);
				});
				setMenuItems(items);
				setParticipants(dependents);
			}
		}
	});

	if (!menuItems || menuItems.length === 0) {
		return (
			<View style={styles.menuContainer}>
				<Text style={{ marginRight: 100 }}>Loading...</Text>
			</View>
		);
	}

	return (
		<View
			style={{
				paddingTop: 50,
				flexDirection: "row",
			}}
		>
			<Menu
				style={styles.menuContainer}
				contentStyle={styles.menuContent}
				visible={isVisible}
				onDismiss={closeMenu}
				anchor={
					<Button
						onPress={openMenu}
						color={CustomColors.uva.orange}
						// mode={"contained"}
					>
						{participant
							? "Participant: " + participantName(participant)
							: "Select Participant"}
						<View style={styles.iconContainer}>
							<MaterialIcons
								name="arrow-drop-down"
								size={24}
								color={CustomColors.uva.orange}
							/>
						</View>
					</Button>
				}
			>
				{menuItems}
			</Menu>
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		paddingTop: 8,
	},
	menuContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginTop: 270,
	},
	menuContent: {
		flexDirection: "column",
		justifyContent: "flex-start",
		alignContent: "space-around",
		padding: 10,
	},
	menuItem: {
		height: 50,
		padding: 10,
	},
});
