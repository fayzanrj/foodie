import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import CategoryListItem from "../components/CategoryListItem";
import { categoryData } from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Recipe from "../components/Recipe";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState();
  const [searchTxt, setSearchTxt] = useState();
  const [isloading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const nav = useNavigation()

  const getCategories = async () => {
    const response = await axios(
      "https://themealdb.com/api/json/v1/1/categories.php"
    );
    if (response && response.data) {
      setCategories(response.data.categories);
    }
  };

  const searchRecipe = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
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
  };

  useEffect(() => {
    getCategories();
  }, []);

  const punch1Font = useWindowDimensions().fontScale > 1 ? hp(3.5) : hp(4.5);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", overflow: "scroll" }}>
      <StatusBar backgroundColor={'white'} barStyle={"dark-content"} />
      <Animated.View style={styles.topBar}>
        <Pressable>
          <Image
            source={require("../../assets/welcome-img.png")}
            style={{ width: wp(12), height: hp(6.5) }}
          />
        </Pressable>
        {/* <TouchableOpacity onPress={() => nav.navigate("Favourites")}>
          <MaterialCommunityIcons
            name="cards-heart"
            size={hp(4.5)}
            color={"red"}
          />
        </TouchableOpacity> */}
      </Animated.View>
      <View style={{ paddingHorizontal: "4%", marginTop: "8%" }}>
        <Text style={styles.welcome}>Welcome back!</Text>
        <View style={{ marginTop: "5%" }}>
          <Text style={styles.punch}>Make your own food,</Text>
          <Text style={styles.punch2}>
            with your <Text style={styles.punch3}>own hands</Text>
          </Text>
        </View>
      </View>
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
                  setSelectedCategory={setSelectedCategory}
                />
              )}
            />
          </Animated.View>
        )}
      </View>
      <View style={{ flex: 1, width: "100%", overflow: "scroll" }}>
        <Recipe
          recipes={recipes}
          setRecipes={setRecipes}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setIsLoading={setIsLoading}
          isloading={isloading}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: "2%",
    // marginTop: Platform.OS == "android" ? StatusBar.currentHeight  : 0,
  },
  welcome: {
    color: "#696b6e",
  },
  punch: {
    fontSize: hp(4.5),
    fontFamily: "",
  },
  punch2: {
    fontSize: hp(4),
  },
  punch3: {
    // fontSize :
    color: "#f3920c",
  },
  searchView: {
    width: wp(90),
    height: hp(6),
    backgroundColor: "#c3c5c7",
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
    // justifyContent: "center",
    // alignItems: "center",
  },
});
