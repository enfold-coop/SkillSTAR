import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import AppHeader from "../components/Header/AppHeader";
import {RootNavProps} from "../navigation/root_types";

type Props = {
  route: RootNavProps<"NoQuestionnaireScreen">;
  navigation: RootNavProps<"NoQuestionnaireScreen">;
};

const NoQuestionnaireScreen: FC<Props> = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <AppHeader name={"No SkillSTAR data found for participant"}/>
      <Text>Please visit STAR DRIVE to fill out the profile for the selected participant.</Text>
    </View>
  );
};

export default NoQuestionnaireScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
  },
});
