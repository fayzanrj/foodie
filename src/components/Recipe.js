import {
  ActivityIndicator,
  Image,
  Platform,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import MasonryList from "@react-native-seoul/masonry-list";
import { mealData } from "../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { CachedImage } from "../helper/image";

const Recipe = ({
  setRecipes,
  recipes,
  selectedCategory,
  isloading,
  setIsLoading
}) => {

  const nav = useNavigation();

  const getRandomRecpies = async () => {
    const response = await axios(
      "https://themealdb.com/api/json/v1/1/filter.php?a=Indian"
    );
    if (response && response.data) {
      setRecipes(response.data.meals);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRandomRecpies();
  }, []);

  const getSelectedCategoryRecipe = async () => {
    setIsLoading(true);
    const response = await axios(
      `https://themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
    );
    if (response && response.data) {
      await setRecipes(response.data.meals);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSelectedCategoryRecipe();
  }, [selectedCategory]);

  const numofCol = useWindowDimensions().fontScale <= 1 ? 2 : 1;
  
  return (
    <View
      style={{
        flex: 1,
        padding: ".2%",
        marginTop: "2%",
      }}
    >
      <Text
        style={{
          fontSize: hp(3),
          marginBottom: "2%",
          alignSelf: "flex-start",
          paddingLeft: 10,
        }}
      >
        Recipes
      </Text>
      {isloading ? (
        <View style={{ height: "100%", justifyContent: "center" }}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        recipes && (
          <MasonryList
            // onEndReachedThreshold={1}
            keyExtractor={(item) => item.id}
            refreshControl={false}
            horizontal={true}
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recipes}
            numColumns={numofCol}
            renderItem={({ item, i }) => (
              <RecipeCard meal={item} nav={nav} index={i} />
            )}
          />
        )
      )}
    </View>
  );
};

export default Recipe;

const RecipeCard = ({ meal, index, nav }) => {
  const isEven = index % 2 == 0;
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
        onPress={() => nav.navigate("RecipeDetails", {...meal})}
      >
        <CachedImage
        // sharedTransitionTag={meal.strMeal}
          uri={meal.strMealThumb}
          style={{
            height: "80%",
            // width: index % 3 == 0 ? wp(30) : wp(50),
            width: wp(50),
            borderRadius: 20,
          }}
        />
        <Text>
          {meal.strMeal.length > 20
            ? meal.strMeal.slice(0, 22) + "...."
            : meal.strMeal}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({});
