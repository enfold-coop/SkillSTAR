import React, { FC } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { SkillListCard } from "./index";
import { RootNavProps } from "../../navigation/root_types";

type SkillsListProps = {
	data?: {}[];
	root: RootNavProps<"SkillsHomeScreen">;
};

const SkillsList: FC<SkillsListProps> = (props) => {
	console.log(props);

	return (
		<View>
			<View style={styles.container}>
				<Text style={styles.title}>SKILLS LIST Placeholder header</Text>
				<FlatList
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
					}}
					data={props.data}
					keyExtractor={(item) => item.name}
					renderItem={(item) => <SkillListCard dataItem={item} />}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#bbb",
		margin: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "900",
		color: "#b72ef2",
	},
});

export default SkillsList;
