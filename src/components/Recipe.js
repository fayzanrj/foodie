import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import MasonryList from "@react-native-seoul/masonry-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInRight } from "react-native-reanimated";
import initialRecipes from "../constants/initialRecipes";

const Recipe = ({
  setRecipes,
  recipes,
  isDarkMode,
  isloading,
  setIsLoading,
}) => {
  const nav = useNavigation();

  // GETTING RANDOM RECIPE FUNCTION
  const getRandomRecpies = async () => {
    setRecipes(initialRecipes)
    setIsLoading(false);
  };

  //
  useEffect(() => {
    getRandomRecpies();
  }, []);

  // determining number of columns
  const numofCol = useWindowDimensions().fontScale <= 1 ? 2 : 1;

  return (
    <View
      style={{
        flex: 1,
        padding: ".2%",
        marginTop: "2%",
      }}
    >
      {/* RECIPE HEADING */}
      <Text
        style={{
          fontSize: hp(3),
          marginBottom: "2%",
          alignSelf: "flex-start",
          paddingLeft: 10,
          color: isDarkMode ? "white" : "black",
        }}
      >
        Recipes
      </Text>
      {isloading ? (
        // LOADING ICON
        <View style={{ height: "100%", justifyContent: "center" }}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        // RECIPE LIST
        recipes && (
          <MasonryList
            keyExtractor={(item) => item.id}
            refreshControl={false}
            horizontal={true}
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recipes}
            numColumns={numofCol}
            renderItem={({ item, i }) => (
              <RecipeCard
                meal={item}
                nav={nav}
                index={i}
                isDarkMode={isDarkMode}
              />
            )}
          />
        )
      )}
    </View>
  );
};

// RECIPE CARD (RECIPE LISTT ITEM)
const RecipeCard = React.memo(({ meal, index, nav, isDarkMode }) => {
  const isEven = index % 2 == 0;

  // PROPS TO PASS RECIPE DETAILS SCREEN
  const newProps = {
    meal: meal,
    isDarkMode: isDarkMode,
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100)
        .duration(600)
        .springify()}
    >
      <Pressable
        style={{
          width: "100%",
          paddingRight: isEven ? 8 : 0,
          paddingLeft: isEven ? 0 : 8,
          marginHorizontal: 10,
        }}
        onPress={() => nav.navigate("RecipeDetails", { ...newProps })}
      >
        {/* RECIPE IMAGE */}
        <Image
          source={{ uri: meal.strMealThumb }}
          style={{
            height: "80%",
            width: wp(50),
            borderRadius: 20,
          }}
        />
        {/* RECIPE NAME */}
        <Text style={{ color: isDarkMode ? "white" : "black" }}>
          {meal.strMeal.length > 20
            ? meal.strMeal.slice(0, 22) + "...."
            : meal.strMeal}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

export default memo(Recipe);
