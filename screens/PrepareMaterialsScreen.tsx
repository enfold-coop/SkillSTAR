import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, Card, Title } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { RootNavProps } from '../navigation/root_types';
import CustomColors from '../styles/Colors';
import { ChainSession, ChainSessionType } from '../types/CHAIN/ChainSession';

type Props = {
  route: RootNavProps<'PrepareMaterialsScreen'>;
  navigation: RootNavProps<'PrepareMaterialsScreen'>;
  chainSession: ChainSession;
};

const PrepareMaterialsScreen: FC<Props> = props => {
  const navigation = useNavigation();
  const { chainSession } = props;
  const [chainSessionType, setChainSessionType] = useState<ChainSessionType>();

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled && chainSession && chainSession.session_type) {
      setChainSessionType(chainSession.session_type);
    }

    return () => {
      isCancelled = true;
    };
  }, [chainSession]);

  const materials = [
    { image: require('../assets/images/prep_materials_icon/toothbrush.png'), title: 'Tooth Brush' },
    { image: require('../assets/images/prep_materials_icon/toothpaste.png'), title: 'Tooth Paste' },
    { image: require('../assets/images/prep_materials_icon/towel.png'), title: 'Towel' },
    { image: require('../assets/images/prep_materials_icon/water.png'), title: 'Cup of Water' },
    { image: require('../assets/images/prep_materials_icon/medicine.png'), title: 'Cabinet' },
  ];

  return (
    <ImageBackground
      source={require('../assets/images/sunrise-muted.jpg')}
      resizeMode={'cover'}
      style={styles.image}
    >
      <View style={styles.container}>
        <AppHeader name='Prepare Materials' />
        {materials.map(m => (
          <Card style={styles.listItem} key={m.title}>
            <Animatable.View animation='fadeIn' style={styles.listItem}>
              <Image style={styles.itemIcon} source={m.image} />
              <Title style={styles.itemTitle}>{m.title}</Title>
            </Animatable.View>
          </Card>
        ))}
        <Animatable.View animation='bounceIn'>
          <Button
            mode='contained'
            color={CustomColors.uva.blue}
            style={styles.nextBtn}
            labelStyle={{ fontSize: 20 }}
            onPress={() => {
              if (chainSessionType === ChainSessionType.training) {
                navigation.navigate('StepScreen');
              } else {
                navigation.navigate('BaselineAssessmentScreen');
              }
            }}
          >
            Next
          </Button>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    padding: 0,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  headline: {
    fontSize: 20,
  },
  listItem: {
    marginTop: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
  },
  itemIcon: {
    width: 80,
    height: 80,
    margin: 20,
    marginLeft: 40,
    marginRight: 130,
  },
  itemTitle: {
    // width: 200,
    fontSize: 34,
    lineHeight: 34,
    alignSelf: 'center',
    fontWeight: '400',
  },
  nextBtn: {
    padding: 10,
    fontSize: 24,
    margin: 10,
    marginRight: 0,
    width: 222,
    alignSelf: 'flex-end',
  },
});

export default PrepareMaterialsScreen;
