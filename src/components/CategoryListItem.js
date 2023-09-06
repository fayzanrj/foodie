import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { categoryData } from "../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CachedImage } from "../helper/image";

const CategoryListItem = ({
  categoryName,
  categoryImg,
  selectedCategory,
  setSelectedCategory,
}) => {
  let isActive = categoryName === selectedCategory;
  let backgroundColor = isActive ? "#f3920c" : null;
  return (
    categoryName != "Pork" && (
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 8,
        }}
        onPress={() => setSelectedCategory(categoryName)}
      >
        <View
          style={{
            backgroundColor: backgroundColor,
            width: 50,
            height: 50,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
          }}
        >
          {/* <Image
            source={{ uri: categoryImg }}
            style={{ width: wp(14), height: hp(5), marginBottom: 2 }}
          /> */}
          <CachedImage
            uri={categoryImg}
            style={{ width: wp(14), height: hp(5), marginBottom: 2 }}
          />
        </View>
        <Text>{categoryName}</Text>
      </TouchableOpacity>
    )
  );
};

export default CategoryListItem;

const styles = StyleSheet.create({});
