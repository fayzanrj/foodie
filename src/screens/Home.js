import {
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import CategoryListItem from "../components/CategoryListItem";
import { Ionicons } from "@expo/vector-icons";
import Recipe from "../components/Recipe";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import categories from "../constants/categories";
import initialRecipes from "../constants/initialRecipes";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTxt, setSearchTxt] = useState();
  const [isloading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // FUNCTION TO SEARCH RECIPES
  const searchRecipe = async () => {
    Keyboard.dismiss();
    setSelectedCategory("");
    setIsLoading(true);
    try {
      const response = await axios(
        `https://themealdb.com/api/json/v1/1/search.php?s=${searchTxt}`
      );
      const response1 = await axios(
        `https://themealdb.com/api/json/v1/1/search.php?f=${searchTxt[0]}`
      );
      if (response && response.data) {
        if (response.data.meals.length > 0) {
          const allRecipes = response.data.meals.concat(response1.data.meals);
          setRecipes(allRecipes);
        } else {
          setRecipes(response1.data.meals);
        }
        setIsLoading(false);
      }
    } catch {
      setRecipes([]);
      setIsLoading(false);
    }
  };

  // FUNCTION TO GET RECIPE FOR A SPECIFIC SELECTED CATEGORY
  const getRecipes = useCallback(async (name) => {
    try {
      setSearchTxt(" ");
      setSelectedCategory(name);
      setIsLoading(true);
      const response = await axios(
        `https://themealdb.com/api/json/v1/1/filter.php?c=${name}`
      );
      if (response && response.data) {
        await setRecipes(response.data.meals);
        setIsLoading(false);
      }
    } catch {
      setRecipes(initialRecipes);
      setIsLoading(false);
    }
  }, []);

  // FUNCTION TO SAVE USER PREFERENCE THEME
  const setDarkMode = useCallback(async () => {
    setIsDarkMode(!isDarkMode);
    isDarkMode
      ? await AsyncStorage.setItem("theme", "light")
      : await AsyncStorage.setItem("theme", "dark");
  });

  // FUCTION TO GET USER PREFERECED THEME
  const getTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      if (theme) {
        theme === "dark" ? setIsDarkMode(true) : setIsDarkMode(false);
      }
    } catch {
      setIsDarkMode(false);
    }
  };

  // USE EFFECT
  useEffect(() => {
    getTheme();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        overflow: "scroll",
        backgroundColor: isDarkMode ? "black" : "white",
      }}
    >
      <StatusBar
        backgroundColor={isDarkMode ? "black" : "white"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      {/* TOP BAR i.e. THEME AND LOGO */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ width: wp(15), height: hp(6) }}
          onPress={() => setDarkMode()}
        >
          <Ionicons
            name="bulb"
            size={hp(4.5)}
            color={isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>
        <View>
          <Image
            source={require("../../assets/welcome-img.png")}
            style={{ width: wp(12), height: hp(6.5) }}
          />
        </View>
      </View>

      {/* GRETTING AND PUNCH LINES */}
      <View style={{ paddingHorizontal: "4%", marginTop: "8%" }}>
        <Text style={{ color: isDarkMode ? "#c9c8c5" : "#636361" }}>
          Welcome back!
        </Text>
        <View style={{ marginTop: "5%" }}>
          <Text
            style={[styles.punch, { color: isDarkMode ? "white" : "black" }]}
          >
            Make your own food,
          </Text>
          <Text
            style={[styles.punch2, { color: isDarkMode ? "white" : "black" }]}
          >
            with your <Text style={styles.punch3}>own hands</Text>
          </Text>
        </View>
      </View>

      {/* SEARCH SECTION */}
      <View style={styles.searchView}>
        <TextInput
          placeholder="Search a recipe"
          style={styles.txtInput}
          placeholderTextColor={"white"}
          onChangeText={(txt) => {
            setSearchTxt(txt);
          }}
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => searchRecipe()}
        >
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* CATEGORY LIST  */}
      <View style={styles.flatListParent}>
        {categories && (
          <Animated.View entering={FadeInLeft.duration(1000).springify()}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={{
                width: "100%",
                height: "100%",
              }}
              horizontal={true}
              data={categories}
              renderItem={({ item, index }) => (
                <CategoryListItem
                  categoryName={item.strCategory}
                  categoryImg={item.strCategoryThumb}
                  selectedCategory={selectedCategory}
                  getRecipes={getRecipes}
                  isDarkMode={isDarkMode}
                />
              )}
            />
          </Animated.View>
        )}
      </View>

      {/* RECIPE LIST SECTION */}
      <View style={{ flex: 1, width: "100%", overflow: "scroll" }}>
        <Recipe
          recipes={recipes}
          setRecipes={setRecipes}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setIsLoading={setIsLoading}
          isloading={isloading}
          isDarkMode={isDarkMode}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "3%",
  },
  punch: {
    fontSize: hp(4.5),
  },
  punch2: {
    fontSize: hp(4),
  },
  punch3: {
    color: "#f3920c",
  },
  searchView: {
    width: wp(90),
    height: hp(6),
    backgroundColor: "#5c5c5b",
    marginTop: "8%",
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "3%",
  },
  txtInput: {
    width: "90%",
    height: "100%",
    paddingHorizontal: "4%",
    color: "white",
    fontSize: hp(2.2),
  },
  searchBtn: {
    backgroundColor: "white",
    padding: "2%",
    borderRadius: 30,
  },
  flatListParent: {
    width: "100%",
    height: "10%",
    marginTop: "5%",
    paddingHorizontal: "2%",
  },
});
