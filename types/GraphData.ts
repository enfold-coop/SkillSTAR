import { SessionPercentage } from '../_util/CalculateMasteryPercentage';

export interface GraphDataSymbolStyle {
  fill: string;
  type: 'circle' | 'diamond' | 'plus' | 'minus' | 'square' | 'star' | 'triangleDown' | 'triangleUp';
}

export interface GraphData {
  data: SessionPercentage[][];
  name: string;
  x: string;
  y: string;
  color: string;
  type: string;
  symbolStyle?: GraphDataSymbolStyle;
}
