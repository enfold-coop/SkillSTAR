// __tests__/Intro-test.js
import React from "react";
import renderer from "react-test-renderer";
import SkillsHome from "../Landing";

describe("SkillsHome", () => {
	test("renders correctly", () => {
		const tree = renderer.create(<SkillsHome />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
