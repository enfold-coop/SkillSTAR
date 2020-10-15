import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';

export default function SkillGrade() {
    return (

        <View  style={styles.container}>
            <Image source={require('../../assets/images/skill_icon.png')} style={styles.icon}/>
            <View style={styles.subcontainer}>
                <Text style={styles.skillTitle}>Skill A and B</Text>
                <Text style={styles.skillGrade}>Mastered</Text>
                <Text></Text>
            </View>
        </View>
       
    );
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        margin: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5
    },
    icon: {
        width: 50,
        height: 50,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: '#fff'
    },
    subcontainer: {
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
    },
    skillTitle: {

    },
    skillGrade: {
        fontWeight: '600'
    }
  });
