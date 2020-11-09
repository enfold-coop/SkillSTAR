import React, { FC } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { SkillListCard } from "./index";
import { RootNavProps } from "../../navigation/root_types";

type SkillsListProps = {
	data?: {}[];
	route: RootNavProps<"SkillsHomeScreen">;
	navigation: RootNavProps<"SkillsHomeScreen">;
};

const SkillsList: FC<SkillsListProps> = (props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}></Text>
			{props.data && (
				<FlatList
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
						paddingBottom: 30,
					}}
					data={props.data}
					keyExtractor={(item) => item.name}
					renderItem={(item) => <SkillListCard dataItem={item} />}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "900",
	},
});

export default SkillsList;
