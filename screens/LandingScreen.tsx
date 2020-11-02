import * as React from 'react';
import {ReactElement} from 'react';
import {Button, StyleSheet} from "react-native";
import {RootNavProps as Props} from "../_types/RootNav";
import {Text, View} from "../components/Themed";

export const LandingScreen = ({navigation}: Props<"LandingScreen">): ReactElement => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LANDING</Text>
      <Button
        title="To Skills Home"
        onPress={() => navigation.navigate("SkillsHomeScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
