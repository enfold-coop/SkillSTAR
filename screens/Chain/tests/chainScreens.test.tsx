// __tests__/Intro-test.js
import React from "react";
import renderer from "react-test-renderer";
import Navigation from "../../../navigation";
import { wait } from "../../../_util/testing/wait";
import { ScoreCardScreen } from "../index";
import MockNavigator from "../../../navigation/MockNavigator";

describe("Rendering CHAIN screens...", () => {
	afterEach(async () => {
		await wait();
	});

	test("renders ScoreCardScreen correctly", async () => {
		const tree = await renderer
			.create(<MockNavigator component={ScoreCardScreen} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	test("renders ScoreCardScreen correctly", async () => {
		const tree = await renderer
			.create(<MockNavigator component={ScoreCardScreen} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
