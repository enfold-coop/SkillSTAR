import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { DataVerificationListItem } from "./DataVerificationListItem";

type Props = {
	session: undefined;
	steps: [];
};

const DataVerificationList: FC<Props> = (props) => {
	let { session, steps } = props;
	console.log(steps);

	return (
		<View>
			<Text>testing</Text>
			<FlatList
				data={session.data}
				renderItem={({ item, index }) => (
					<DataVerificationListItem
						instruction={steps[index].instruction}
						stepAttempt={item}
					/>
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

export default DataVerificationList;

const styles = StyleSheet.create({});
