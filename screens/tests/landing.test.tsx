// __tests__/Intro-test.js
import React from "react";
import renderer from "react-test-renderer";
import Landing from "../Landing";

describe("Landing screen", () => {
	test("renders correctly", () => {
		const tree = renderer.create(<Landing />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
