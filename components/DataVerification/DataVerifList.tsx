import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import { DataVerifItem } from ".";

type Props = {
	session: StepAttempt[];
};

const DataVerifList: FC<Props> = ({ session }) => {
	return (
		<View style={styles.container}>
			<FlatList
				data={session}
				renderItem={(item) => {
					return <DataVerifItem stepAttempt={item.item} />;
				}}
				keyExtractor={() => nanoid()}
			/>
		</View>
	);
};

export default DataVerifList;

const styles = StyleSheet.create({
	container: {},
});
