import React, {FC} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Card} from "react-native-paper";
import {SkillGradeProps, SkillSubItem} from '../../_interfaces/Skill';
import {MasteryIcons} from "../../styles/MasteryIcons";

function createSkillTitleString(data: SkillSubItem[]): string {
  return data
    .map((e) => e.title)
    .join(', ');
}

const SkillGrade: FC<SkillGradeProps> = (props) => {
  return (
    <Card style={styles.container}>
      {MasteryIcons(props.data[0].score)}
      <View style={styles.subcontainer}>
        <Text style={styles.skillGrade}>{props.name}: </Text>
        <View style={styles.skillList}>
          <Text>{createSkillTitleString(props.data)}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
  },
  icon: {
    width: 50,
    height: 50,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  subcontainer: {
    padding: 5,
    display: "flex",
    flexDirection: "column",
  },
  skillList: {
    display: "flex",
    flexDirection: "row",
  },
  skillTitle: {
    padding: 2,
  },
  skillGrade: {
    fontWeight: "600",
  },
});

export default SkillGrade;
