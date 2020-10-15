import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

export default function SkillListCard() {
    return (
       <ScrollView>
           <View  style={styles.container}>
            <Text style={styles.title}>Skill ScoreCard Title</Text>
                <View style={styles.subcontainer}>
                    <View style={styles.skill}>
                        <Text>Skill A</Text>
                    </View>
                    <View style={styles.skill}>
                        <Text>Skill B</Text>
                    </View>
                    <View style={styles.skill}>
                        <Text>Skill C</Text>
                    </View>
                    <View style={styles.skill}>
                        <Text>Skill D</Text>
                    </View>
                    
                </View>
            </View>
       </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        margin:20,
        flex: 1,
        flexDirection: 'column',
        borderWidth:1,
        borderColor: '#F27030',
        borderRadius: 5
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
    skill:{
        padding: 80,
        paddingTop:40,
        paddingBottom:40,
        margin: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5
    }
  });
