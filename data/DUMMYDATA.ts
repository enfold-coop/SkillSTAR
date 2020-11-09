/**
 * -- DUMMY DATA for SkillsHomeScreen --
 * - Skill name,
 * - skill subitems
 * -- subitems scores:
 * ---- "In-Progress": 0,
 * ---- "Mastered": 1,
 * ---- "Needs Support": 2,
 */

export const DUMMY_SKILLS_ARR = [
	{
		name: "Brushing Teeth",
		subItems: [
			{ id: "A", title: "Prepare Materials", score: 0 },
			{ id: "B", title: "Brush Top", score: 2 },
			{ id: "C", title: "Brush Outside", score: 0 },
			{ id: "D", title: "Brush Inside", score: 1 },
			{ id: "E", title: "Spit & Rinse", score: 2 },
			{ id: "F", title: "Clean Up", score: 1 },
		],
	},
	{
		name: "Flossing Teeth",
		subItems: [
			{ id: "A", title: "Prepare Materials", score: 0 },
			{ id: "B", title: "Floss Top", score: 2 },
			{ id: "C", title: "Floss Outside", score: 0 },
			{ id: "D", title: "Floss Inside", score: 1 },
			{ id: "E", title: "Toss the Floss", score: 2 },
			{ id: "F", title: "Eat Candy", score: 1 },
		],
	},
	{
		name: "Brushing Hair",
		subItems: [
			{ id: "A", title: "Prepare Materials", score: 2 },
			{ id: "B", title: "Brush Top", score: 1 },
			{ id: "C", title: "Brush Outside", score: 1 },
			{ id: "D", title: "Brush Inside", score: 0 },
			{ id: "E", title: "Toss the Brush", score: 0 },
			{ id: "F", title: "Eat More Candy", score: 2 },
		],
	},
];
