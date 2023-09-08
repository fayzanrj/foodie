import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CategoryListItem = ({
  categoryName,
  categoryImg,
  selectedCategory,
  getRecipes,
  isDarkMode,
}) => {
  // checking is activated and giving background color
  let backgroundColor = categoryName === selectedCategory ? "#f3920c" : null;

  // callback function to get recipe
  const getRecipes1 = useCallback((name) => getRecipes(name), []);
  return (
    categoryName != "Pork" && (
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 8,
        }}
        onPress={() => getRecipes1(categoryName)}
      >
        {/* CATEGORY IMAGE */}
        <View
          style={{
            backgroundColor: backgroundColor,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
          }}
        >
          <Image
          source={{uri : categoryImg}}
            style={{ width: wp(14), height: hp(5), marginBottom: 2 }}
          />
        </View>

        {/* CATEGORY NAME */}
        <Text style={{ color: isDarkMode ? "white" : "black" }}>
          {categoryName}
        </Text>
      </TouchableOpacity>
    )
  );
};
export default memo(CategoryListItem);
