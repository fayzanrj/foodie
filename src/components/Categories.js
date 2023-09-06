import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { categoryData } from "../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    categoryData[0].name
  );
  return (
    <View>
      <CatergoryListItem/>
      <CatergoryListItem/>
      <CatergoryListItem/>
      <CatergoryListItem/>
      <CatergoryListItem/>
      <CatergoryListItem/>
      <CatergoryListItem/>
      <CatergoryListItem/>
    </View>
  );
};

export default Categories;

const CatergoryListItem = () => {
  
};
const styles = StyleSheet.create({});
