import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';


const logo ={
    uri: '../../assets/images/icon.png'
};

export default function AppHeader() {
    return (
       <View style={styles.container}>
           <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
           <Text style={styles.headline}>HEADER HERE</Text>
       </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-around',
        alignContent:'center',
        color: '#ff00bb',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#aaa'
    },
    logo: {
        width: 64,
        height: 64
    },
    headline: {
        fontSize: 30,
        color: '#fb00aa',
        backgroundColor:'#000',
        alignSelf: 'center',
    }
});
