import React, {FC} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {ScorecardListProps} from '../../_interfaces/Scorecard';
import ScorecardListItem from './ScorecardListItem';

const ScorecardList: FC<ScorecardListProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scorecard Item List ...</Text>
      <FlatList
        data={props.subItems}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <ScorecardListItem item={item}/>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ScorecardList;
