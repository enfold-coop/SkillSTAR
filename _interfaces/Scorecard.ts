export interface ScorecardListRenderItemInfo {
	item: ScorecardItem;
}

export interface ScorecardItem {
	id: string;
	title: string;
	score: number;
}

export interface ScorecardListSubItem {
	name: string;
	id: string;
}

export interface ScorecardListProps {
	name: string;
	subItems: ScorecardItem[];
}
