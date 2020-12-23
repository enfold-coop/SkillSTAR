import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import CustomColors from "../../styles/Colors";

type Props = {
	dimensions: {};
};

const LineGraph: FC<Props> = (props) => {
	const { dimensions } = props;

	return (
		<View style={styles.container}>
			<LineChart
				data={{
					labels: [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
					],
					datasets: [
						{
							data: [
								Math.random() * 10,
								Math.random() * 10,
								Math.random() * 10,
								Math.random() * 10,
								Math.random() * 10,
								Math.random() * 10,
							],
						},
					],
				}}
				width={dimensions.width ? dimensions.width - 20 : 200} // from react-native
				height={dimensions.width ? dimensions.width / 2 - 20 : 200}
				yAxisLabel="x"
				yAxisInterval={10} //
				chartConfig={{
					backgroundColor: CustomColors.uva.white,
					backgroundGradientFrom: CustomColors.uva.cyanSoft,
					backgroundGradientTo: CustomColors.uva.cyan,
					decimalPlaces: 0, // optional, defaults to 2dp
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) =>
						`rgba(255, 255, 255, ${opacity})`,

					style: {
						borderRadius: 16,
					},
					propsForDots: {
						r: "6",
						strokeWidth: "2",
						stroke: CustomColors.uva.orangeSoft,
					},
				}}
				style={{
					marginVertical: 8,
					borderRadius: 5,
				}}
			/>
		</View>
	);
};

export default LineGraph;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});
