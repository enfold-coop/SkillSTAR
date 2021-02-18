import { useDeviceOrientation } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { participantName } from '../../_util/ParticipantName';
import { useParticipantState } from '../../context/ParticipantProvider';
import { ImageAssets } from '../../data/images';
import CustomColors from '../../styles/Colors';
import { Participant } from '../../types/User';

type AppHeaderProps = {
  name: string;
  onParticipantChange?: (participant: Participant) => void;
};

const AppHeader = (props: AppHeaderProps): JSX.Element => {
  const navigation = useNavigation();
  const { portrait } = useDeviceOrientation();
  const [orient, setOrient] = useState(false);
  const participantState = useParticipantState();

  useEffect(() => {
    setOrient(portrait);
  }, [portrait]);

  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        if (participantState.participant) {
          navigation.setOptions({ title: participantName(participantState.participant) });
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [participantState.participant]);

  return (
    <View style={styles.container}>
      <View style={styles.skillTextContainer}>
        <Image source={ImageAssets.logo} style={orient ? styles.logo : styles.landscapeLogo} />
        <Text style={orient ? styles.headline : styles.headlineLandscape}>{props.name}</Text>
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
