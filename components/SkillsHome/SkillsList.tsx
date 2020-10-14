import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

export default function SkillsList() {
    return (
       <ScrollView>
           <View  style={styles.container}>
            <Text style={styles.title}>SKILLS LIST</Text>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
                <View style={styles.card}>
                    <Text>a card</Text>
                </View>
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
    },
    card: {
        padding: 100,
        backgroundColor: '#df00df'
    }
  });
