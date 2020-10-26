/**
 * -- DUMMY DATA for SkillsHomeScreen --
 * - Skill name,
 * - skill subitems
 * -- subitems scores:
 * ---- "In-Progress": 0,
 * ---- "Mastered": 1,
 * ---- "Needs Support": 2,
 */

// function FetchDummyData(): [] {
// 	DUMMYARR.forEach((e, i) => {
// 		let item: DUMMYDATAITEM = {
// 			id: e.id,
// 			skill: e.skill,
// 			mastered: e.mastered,
// 		};
// 		DUMMYARR[i] = item;
// 	});
// 	return DUMMYARR;
// }

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
];
