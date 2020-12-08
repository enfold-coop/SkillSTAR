import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import icoMoonConfig from "../assets/fonts/icons/skillstar_icons.json";
export const SkillStarIcons = createIconSetFromIcoMoon(
	icoMoonConfig,
	"SkillStarIcons",
	"skillstar_icons.ttf"
);

export const Icons = {
	mastered: require("../assets/icons/ribbon-icon.png"),
	focus: require("../assets/icons/in-process-icon.png"),
	noStarted: require("../assets/icons/waving-icon.png"),
};
