import React, {FC} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {SkillsListProps} from '../../_interfaces/Skill';
import SkillListCard from './SkillListCard';

const SkillsList: FC<SkillsListProps> = (props) => {
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>SKILLS LIST Placeholder header</Text>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          data={props.data}
          keyExtractor={(item) => item.name}
          renderItem={(item) => <SkillListCard dataItem={item}/>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bbb",
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#b72ef2",
  },
});

export default SkillsList;
