import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { DataVerificationListItem } from "./DataVerificationListItem";
import RandomIntGenerator from "../../_util/KeyGenerator";

type Props = {
	session: {};
};

const DataVerificationList: FC<Props> = (props) => {
	let { session } = props;
	// console.log(session);

	return (
		<View>
			<FlatList
				data={session.data}
				renderItem={({ item, index }) => (
					<DataVerificationListItem stepAttempt={item} />
				)}
				keyExtractor={() => {
					RandomIntGenerator(session.data.length);
				}}
			/>
		</View>
	);
};

export default DataVerificationList;

const styles = StyleSheet.create({});
