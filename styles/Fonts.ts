import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export const customFonts = {
  ...AntDesign.font,
  ...MaterialIcons.font,
  anticon: require('../assets/fonts/AntDesign.ttf'),
  material: require('../assets/fonts/MaterialIcons.ttf'),
  SkillStarIcons: require('../assets/fonts/icons/skillstar_icons.ttf'),
  'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
};
