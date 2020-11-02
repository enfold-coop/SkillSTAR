import {ChainNavProps} from '../_types/Chain';
import {RootNavProps} from '../_types/RootNav';

export interface SkillSubItem {
	title: string;
	score: number;
}

export interface SkillItem {
	name: string;
	subItems: SkillSubItem[];
}

export interface SkillDataItem {
	item: SkillItem;
}

export interface ListCardProps {
	dataItem: SkillDataItem;
	route?: ChainNavProps<"ChainsHomeScreen">;
	navigation?: ChainNavProps<"ChainsHomeScreen">;
}

export interface SkillGradeProps {
	data: SkillSubItem[];
	name: string;
};

export interface SkillsListProps {
	data?: SkillItem[];
	root?: RootNavProps<"SkillsHomeScreen">;
}
