import { useNavigation } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { DataVerificationListItem } from '../components/Probe/';
import { RootNavProps } from '../navigation/root_types';
import CustomColors from '../styles/Colors';
import { Session } from '../types/CHAIN/Session';

type Props = {
  route: RootNavProps<'BaselineAssessmentScreen'>;
  navigation: RootNavProps<'BaselineAssessmentScreen'>;
  session: Session;
};

const ProbeScreen: FC<Props> = props => {
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [text, setText] = useState('');
  const { session } = props.route.params;

  const incrIndex = () => {
    stepIndex += 1;
    setStepIndex(stepIndex);
  };

  const decIndex = () => {
    if (stepIndex > 0) {
      stepIndex -= 1;
      setStepIndex(stepIndex);
    }
  };

  /**
   * 1. get attempts array
   * 2. load first attempt into DOM
   * 3. increment array logic
   * 4. functionality to write changes to attempt items
   * 5.
   */

  /**
   * <header></header>
   * title
   * data verification components:
   * -- table header: "step", "Task completion?", "Challenging behavior?"
   * -- table row: step name, "yes/no", "yes/no"
   */

  return (
    <ImageBackground
      source={require('../assets/images/sunrise-muted.png')}
      resizeMode={'cover'}
      style={styles.image}
    >
      <View style={styles.container}>
        <AppHeader name='Probe' />
        <View style={styles.formContainer}>
          <DataVerificationListItem />
          {/* <TextInput
						label="Email"
						value={text}
						onChangeText={(text) => setText(text)}
					/> */}
        </View>

        <View style={styles.nextBackBtnsContainer}>
          <Button
            style={styles.backButton}
            color={CustomColors.uva.blue}
            mode='contained'
            onPress={() => {
              decIndex();
            }}
          >
            BACK
          </Button>
          <Button
            style={styles.nextButton}
            color={CustomColors.uva.blue}
            mode='contained'
            onPress={() => {
              if (stepIndex + 1 <= chainSteps.length - 1) {
                incrIndex();
              } else {
                setReadyToSubmit(true);
                navigation.navigate('ProbeScreen', {
                  session,
                });
              }
            }}
          >
            NEXT
          </Button>
        </View>
        {readyToSubmit && (
          <Button
            mode='contained'
            onPress={() => {
              navigation.navigate('ChainsHomeScreen');
            }}
          >
            Submit
          </Button>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  formContainer: {},
  formItemContainer: {},
  formItemLabel: {},
  btnContainer: {},
  formItemButton: {},
  nextBackBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 100,
  },
  nextButton: {
    width: 144,
    margin: 15,
  },
  backButton: {
    width: 144,
    margin: 15,
  },
  inputField: {},
});

export default ProbeScreen;
