type Material = {
	id: number;
	title: string;
	img: string;
};

type MaterialsArray = {
	materials: Material[];
};

export const PREP_MATS = [
	{
		id: 0,
		title: "Tooth brush",
		img: "../assets/images/prep_materials_icon/toothbrush.png",
	},
	{
		id: 1,
		title: "Tooth paste",
		img: "../assets/images/prep_materials_icon/toothpaste.png",
	},
	{
		id: 2,
		title: "Towel",
		img: "../assets/images/prep_materials_icon/towel.png",
	},
	{
		id: 3,
		title: "Cabinet",
		img: "../assets/images/prep_materials_icon/toothbrush.png",
	},
	{
		id: 4,
		title: "Cup of water",
		img: "../assets/images/prep_materials_icon/water.png",
	},
];
