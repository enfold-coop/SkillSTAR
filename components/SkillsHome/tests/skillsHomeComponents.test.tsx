// __tests__/Intro-test.js
import React from "react";
import renderer from "react-test-renderer";
import { wait } from "../../../_util/testing/wait";
import { SkillGrade, SkillsList, SkillListCard } from "../index";

describe("SkillsHome components rendering...", () => {
	afterEach(async () => {
		await wait();
	});

	test("snapshot: SkillGrade", async () => {
		const tree = await renderer.create(<SkillGrade />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	test("snapshot: SkillsList", () => {
		const tree = renderer.create(<SkillsList />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	test("snapshot: SkillListCard", () => {
		const tree = renderer.create(<SkillListCard />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
