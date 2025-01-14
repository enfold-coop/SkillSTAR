import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, Card, Title } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { useChainMasteryState } from '../context/ChainMasteryProvider';
import { ImageAssets } from '../data/images';
import { MaterialsItems } from '../data/prep_materials';
import CustomColors from '../styles/Colors';
import { ChainSessionType } from '../types/chain/ChainSession';
import { RootStackParamList } from '../types/NavigationOptions';

const PrepareMaterialsScreen = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [chainSessionType, setChainSessionType] = useState<ChainSessionType>();
  const chainMasteryState = useChainMasteryState();

  /**
   * BEGIN: LIFECYCLE CALLS
   */
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        if (
          !isCancelled &&
          !chainSessionType &&
          chainMasteryState.chainMastery &&
          chainMasteryState.chainMastery.draftSession &&
          chainMasteryState.chainMastery.draftSession.session_type
        ) {
          setChainSessionType(chainMasteryState.chainMastery.draftSession.session_type);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, []);
  /**
   * END: LIFECYCLE CALLS
   */

  const materialsList = MaterialsItems.map((m) => (
    <Card style={styles.listItem} key={'materials_list_item_' + m.id}>
      <Animatable.View animation={'fadeIn'} style={styles.listItem}>
        <Image style={styles.itemIcon} source={m.image} />
        <Title style={styles.itemTitle}>{m.title}</Title>
      </Animatable.View>
    </Card>
  ));

  return (
    <ImageBackground source={ImageAssets.sunrise_muted} resizeMode={'cover'} style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Prepare Materials'} />
        {materialsList}
        <Animatable.View animation={'bounceIn'}>
          <Button
            mode={'contained'}
            color={CustomColors.uva.blue}
            style={styles.nextBtn}
            labelStyle={{ fontSize: 24, paddingVertical: 5 }}
            onPress={() => {
              if (chainSessionType === ChainSessionType.probe) {
                navigation.navigate('BaselineAssessmentScreen');
              } else {
                navigation.navigate('StepScreen');
              }
            }}
          >{`Next`}</Button>
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
    padding: 0,
    margin: 10,
    width: 222,
    alignSelf: 'flex-end',
  },
});

export default PrepareMaterialsScreen;
