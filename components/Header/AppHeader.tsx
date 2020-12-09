import React, {FC} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import CustomColors from "../../styles/Colors";
import {SelectParticipant} from '../SelectParticipant/SelectParticipant';

type Props = {
  name: string;
};

const AppHeader: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.skillTextContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.headline}>{props.name}</Text>
      </View>
      <SelectParticipant />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    margin: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    color: CustomColors.uva.white,
    paddingTop: 0,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: CustomColors.uva.orange,
    backgroundColor: "transparent",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  skillTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  headline: {
    fontSize: 30,
    fontWeight: "800",
    color: CustomColors.uva.blue,
    alignSelf: "center",
    paddingLeft: 20,
  },
  subHeadline: {
    fontSize: 20,
  },
});

export default AppHeader;
