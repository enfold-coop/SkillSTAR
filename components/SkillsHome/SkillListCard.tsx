import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';

import { SkillGrade } from './index';


type Props = {

}

export default function SkillListCard() {
    return (
       <Card style={styles.container}>
            <Text style={styles.title}>Skill ScoreCard Title</Text>
                <View style={styles.subcontainer}>
                    <SkillGrade />
                    <SkillGrade />
                    <SkillGrade />
                    <SkillGrade />
                </View>
                <Button
                    mode="contained" 
                    onPress={()=>console.log("GO TO SKILL")}
                > Go To Skill</Button>
       </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        margin:10,
        flex: 1,
        flexDirection: 'column',
        borderWidth:1,
        borderColor: '#F27030',
    },
    title: {
    padding:10,
      fontSize: 20,
      fontWeight: 'bold',
    },
    subcontainer: {
        display:'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    skillComponent:{
        display:'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 80,
        paddingTop:40,
        paddingBottom:40,
        margin: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5
    }
  });
