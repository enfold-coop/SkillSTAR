export interface DUMMYDATAITEM {
	id: number;
	skill: string;
	mastered: number;
}

export const DUMMYARR: DUMMYDATAITEM[] = [
	{
		id: 1,
		skill: "A",
		mastered: 0,
	},
	{
		id: 2,
		skill: "B",
		mastered: 1,
	},
	{
		id: 3,
		skill: "C",
		mastered: 2,
	},
	{
		id: 4,
		skill: "D",
		mastered: 2,
	},
];


export default function FetchDummyData(): DUMMYDATAITEM[]{
    DUMMYARR.forEach((e, i) => {
        let item: DUMMYDATAITEM = {
            id: e.id,
            skill: e.skill,
            mastered: e.mastered,
        };
        DUMMYARR[i] = item;
    });
    return DUMMYARR;
}

