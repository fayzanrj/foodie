import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
  const nav = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      nav.navigate("Home");
    }, 2000);
  });
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../../assets/welcome-img.png")}
          style={{ width: wp(80), height: hp(40) }}
        />
      </View>
      <Text style={styles.title}>FOODIE</Text>
      <Text style={styles.punch}>MAKE YOUR OWN FOOD!</Text>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3920c",
  },
  title: {
    fontSize: hp(8),
    color: "white",
    // fontFamily: "monospace",
  },
  punch: {
    fontSize: hp(2.35),
    color: "white",
    // fontFamily :
  },
});
