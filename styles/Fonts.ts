import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const customFonts = {
  ...AntDesign.font,
  ...MaterialIcons.font,
  anticon: require('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf'),
  material: require('../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  SkillStarIcons: require('../assets/fonts/skillstar/fonts/skillstar.ttf'),
  'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
};
