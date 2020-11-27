import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { DataVerificationListItem } from "./DataVerificationListItem";

type Props = {
	session: {};
};

const DataVerificationList: FC<Props> = (props) => {
	let { session } = props;

	return (
		<View>
			<FlatList
				data={session.data}
				renderItem={({ item, index }) => (
					<DataVerificationListItem stepAttempt={item} />
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

export default DataVerificationList;

const styles = StyleSheet.create({});
