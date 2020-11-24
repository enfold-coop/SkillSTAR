import React, {useContext, useState} from "react";
import {Image, ImageBackground, StyleSheet, View} from "react-native";
import {Button, TextInput} from "react-native-paper";
import {AuthContext} from '../context/AuthProvider';
import {RootNavProps as Props} from "../navigation/root_types";
import {ApiService} from '../services/ApiService';
import CustomColors from "../styles/Colors";
import {AuthProviderProps} from '../types/AuthProvider';

export default function LandingScreen({navigation}: Props<"LandingScreen">) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const api = new ApiService();
  const context = useContext<AuthProviderProps>(AuthContext);

  return (
    <ImageBackground
      source={require("../assets/images/sunrise-muted.png")}
      resizeMode={"cover"}
      style={styles.image}
    >
      <View style={styles.container}>
        <Image
          style={{
            alignSelf: "center",
            width: 400,
            height: 400,
            marginBottom: 40,
          }}
          source={require("../assets/images/logo.png")}
        />
        {/**
         * New user?
         * -- Yes: background survey,
         * -- No: baseline assesssment
         */}
        <TextInput
          textContentType="emailAddress"
          autoCompleteType="username"
          label="Email"
          mode="outlined"
          value={email}
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          textContentType="password"
          autoCompleteType="password"
          secureTextEntry={true}
          label="Password"
          mode="outlined"
          value={password}
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
        />
        {/* </View> */}
        <Button
          style={styles.button}
          color={CustomColors.uva.blue}
          mode="contained"
          onPress={() => api.login(email, password).then(user => {
            context.state.user = user;
            console.log('user', user);
            navigation.navigate("BaselineAssessmentScreen");
          })
          }
        >
          Log In
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    padding: 0,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    width: 200,
    alignSelf: "center",
    margin: 10,
  },
  button: {
    margin: 22,
    width: 122,
    alignSelf: "center",
  },
  logo: {
    alignSelf: "center",
    width: 200,
    height: 200,
  },
});
