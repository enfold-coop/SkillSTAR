import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SkillListCard } from './index';

export default function SkillsList() {
    return (
       <ScrollView>
           <View  style={styles.container}>
            <Text style={styles.title}>SKILLS LIST</Text>
                <SkillListCard />
            </View>
       </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ccc',
        padding: 20
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    }
  });
