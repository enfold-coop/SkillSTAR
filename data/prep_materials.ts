type Material = {
	id: number;
	title: string;
	img: string;
};

type MaterialsArray = {
	materials: Material[];
};

export const PREP_MATS = [
	{ id: 0, title: "Tooth brush", img: "../" },
	{ id: 1, title: "Tooth paste", img: "../" },
	{ id: 2, title: "Towel", img: "../" },
	{ id: 3, title: "Cabinet", img: "../" },
	{ id: 4, title: "Cup of water", img: "../" },
];
