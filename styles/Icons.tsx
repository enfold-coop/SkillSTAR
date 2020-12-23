import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import icoMoonConfig from "../assets/fonts/icons/skillstar_icons.json";
export const SkillStarIcons = createIconSetFromIcoMoon(
	icoMoonConfig,
	"SkillStarIcons",
	"skillstar_icons.ttf"
);

export const MasteryIcons = (level: number) => {
	// const icons = {
	// 	0: () => require("../assets/icons/ribbon-icon.png"),
	// 	1: () => require("../../assets/icons/in-process-icon.png"),
	// 	2: () => require("../../assets/icons/waving-icon"),
	// };
	// return icons[`${level}`];
};
