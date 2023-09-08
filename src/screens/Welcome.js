import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Welcome = () => {
  const nav = useNavigation();

  // to navigate to the home screen
  useEffect(() => {
    setTimeout(() => {
      nav.navigate("Home");
    }, 4000);
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#f3920c"} />
      <Animated.View entering={FadeInDown.duration(2000).easing()} >
        <Image
          source={require("../../assets/welcome-img.png")}
          style={{ width: wp(80), height: hp(40) }}
        />
      </Animated.View>
      <Animated.View entering={FadeInUp.duration(2000).easing()}>
        <Text style={styles.title}>FOODIE</Text>
        <Text style={styles.punch}>MAKE YOUR OWN FOOD!</Text>
      </Animated.View>
    </View>
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
  },
  punch: {
    fontSize: hp(2.35),
    color: "white",
  },
});
