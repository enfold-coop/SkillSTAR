import { ImageRequireSource } from 'react-native';

type Material = {
  id: number;
  title: string;
  image: ImageRequireSource;
};

export const MaterialsItems: Material[] = [
  {
    id: 0,
    title: 'Toothbrush',
    image: require('../assets/images/prep_materials_icon/toothbrush.png'),
  },
  {
    id: 1,
    title: 'Toothpaste',
    image: require('../assets/images/prep_materials_icon/toothpaste.png'),
  },
  {
    id: 2,
    title: 'Towel',
    image: require('../assets/images/prep_materials_icon/towel.png'),
  },
  {
    id: 3,
    title: 'Cup of water',
    image: require('../assets/images/prep_materials_icon/water.png'),
  },
  {
    id: 4,
    title: 'Countertop',
    image: require('../assets/images/prep_materials_icon/medicine.png'),
  },
];
