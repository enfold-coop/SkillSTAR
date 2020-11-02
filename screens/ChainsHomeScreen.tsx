import React, {FC, Fragment, useContext} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {ScorecardItem} from '../_interfaces/Scorecard';
import {ChainNavProps} from '../_types/Chain';
import ScorecardListItem from '../components/Chain/ScorecardListItem';
import {ChainContext} from "../context/ChainProvider";

type Props = {
  route: ChainNavProps<"ChainsHomeScreen">;
  navigation: ChainNavProps<"ChainsHomeScreen">;
};

const ChainsHomeScreen: FC<Props> = (props) => {
  const {currentSkill} = useContext(ChainContext);
  // const { name } = skill.item;

  return (
    <View style={styles.container}>
      {currentSkill?.item.name && (
        <Fragment>
          {/* <Text>{skill.item.name}</Text> */}
          <Text>{currentSkill?.item.name}</Text>
          <Text style={styles.title}>Scorecard</Text>
          <FlatList
            data={currentSkill.item.subItems}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <ScorecardListItem item={item.item} />}
          />
        </Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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

export default ChainsHomeScreen;
