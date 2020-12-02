import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

type Props = {
	session: StepAttempt[];
};

const DataVerifList: FC<Props> = ({ session }) => {
	return (
		<View style={styles.container}>
			<FlatList
				data={session}
				renderItem={(item) => <Text>{item.item.instruction}</Text>}
				keyExtractor={() => nanoid()}
			/>
		</View>
	);
};

export default DataVerifList;

const styles = StyleSheet.create({
	container: {},
});
