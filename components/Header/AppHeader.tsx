import { useDeviceOrientation } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomColors from '../../styles/Colors';
import { Participant } from '../../types/User';
import { SelectParticipant } from '../SelectParticipant/SelectParticipant';

type AppHeaderProps = {
  name: string;
  onParticipantChange?: (participant: Participant) => void;
};

const AppHeader = (props: AppHeaderProps) => {
  const { portrait } = useDeviceOrientation();
  const [orient, setOrient] = useState(false);
  const { onParticipantChange } = props;
  const navigation = useNavigation();

  useEffect(() => {
    setOrient(portrait);
  }, [portrait]);

  return (
    <View style={styles.container}>
      <View style={styles.skillTextContainer}>
        <Image source={require('../../assets/images/logo.png')} style={orient ? styles.logo : styles.landscapeLogo} />
        <Text style={orient ? styles.headline : styles.headlineLandscape}>{props.name}</Text>
        <SelectParticipant
          onChange={(participant: Participant) => {
            if (onParticipantChange) {
              onParticipantChange(participant);
            } else {
              navigation.navigate('ChainsHomeScreen');
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: CustomColors.uva.white,
    borderBottomWidth: 3,
    borderBottomColor: CustomColors.uva.orange,
    backgroundColor: 'transparent',
  },
  skillTextContainer: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    // marginBottom: 10,
  },
  landscapeLogo: {
    width: 30,
    height: 30,
    // marginBottom: 5,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: CustomColors.uva.blue,
    paddingLeft: 20,
    textAlign: 'center',
  },
  headlineLandscape: {
    fontSize: 20,
    fontWeight: '800',
    color: CustomColors.uva.blue,
    paddingLeft: 20,
  },
});

export default AppHeader;
