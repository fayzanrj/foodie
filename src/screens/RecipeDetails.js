import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RecipeDetails = (props) => {
  const [recipe, setRecipe] = useState();
  const [transalated, setTransalted] = useState();
  const [showTranslation, setShowTranslation] = useState(false);
  const nav = useNavigation();

  // SCREEN PROPS
  const newProps = props.route.params;
  const { meal, isDarkMode } = newProps;

  // RECIPE DETAILS GETTING FUNCTION
  const getRecipeDetails = async (id) => {
    const response = await axios(
      `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    if (response && response.data) {
      await setRecipe(response.data.meals[0]);
      // CALLING TRANSLATE FUNCTION
      translate(response.data.meals[0].strInstructions);
    }
  };

  // TRANSLATING THE INSTRUCTIONS OF THE RECIPE DETAILS
  const translate = async (instructions) => {
    const options = {
      method: "POST",
      url: "https://ai-translate.p.rapidapi.com/translates",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "cd5be48b38msh804c03773c683c9p1dce6bjsn494b46d75180",
        "X-RapidAPI-Host": "ai-translate.p.rapidapi.com",
      },
      data: {
        texts: [instructions],
        tls: ["ur"],
        sl: "en",
      },
    };
    try {
      const response = await axios.request(options);
      if (response) {
        setTransalted(response.data[0].texts);
      }
    } catch (instructions) {
      try {
        const options2 = {
          method: "POST",
          url: "https://ai-translate.p.rapidapi.com/translates",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key":
              "59d4d2a486msh980dc57f8398375p1e5d96jsn4a0cfbe339e5",
            "X-RapidAPI-Host": "ai-translate.p.rapidapi.com",
          },
          data: {
            texts: [instructions],
            tls: ["zh", "ru"],
            sl: "en",
          },
        };
        const response = await axios.request(options2);
        if (response) {
          setTransalted(response.data[0].texts);
        }
      } catch (error) {
        setTransalted("");
      }
    }
  };

  // FUNCTION TO DETERMINE WHEN TO SHOW TRANSLATION
  const getTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  // GETTING THE NUMBER OF INDEX OF THE INGREDIENTS
  const getIndex = (recipe) => {
    if (!recipe) return [];
    let indexes = [];
    for (let i = 0; i <= 20; i++) {
      if (recipe["strIngredient" + i]) {
        indexes.push(i);
      }
    }
    return indexes;
  };

  // GET VIDEO ID FUNCTION
  const getYoutubeVideoId = (url) => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  const back = useCallback(()=>{
    nav.goBack()
  })

  useEffect(() => {
    getRecipeDetails(meal.idMeal);
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDarkMode ? "black" : "white" }}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* IMAGE */}
      {/* <Animated.View style={{ alignItems: "center" }}> */}
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: meal.strMealThumb }}
          // sharedTransitionTag={meal.strMeal}
          style={styles.image}
        />
      </View>

      {/* BACK AND FAV BUTTON */}
      <View style={styles.topBtnView}>
        <TouchableOpacity style={styles.topBtn} onPress={back}>
          <Ionicons name="chevron-back" size={hp(4)} color="#f3920c" />
        </TouchableOpacity>
      </View>

      {recipe ? (
        <View style={{ padding: "2.5%", marginTop: "2%" }}>
          {/* TITLE & AREA */}
          <View>
            <Text
              style={[
                styles.title,
                { fontWeight: 700, color: isDarkMode ? "white" : "black" },
              ]}
            >
              {recipe.strMeal}
            </Text>
            <Text
              style={{
                fontSize: hp(2.5),
                color: isDarkMode ? "white" : "black",
              }}
            >
              {recipe.strArea}
            </Text>
          </View>

          {/* INGREDIENTS */}
          <View style={{ marginTop: hp(3) }}>
            <Text
              style={{
                fontSize: hp(2.5),
                fontWeight: 500,
                color: isDarkMode ? "white" : "black",
              }}
            >
              Ingredients
            </Text>
            <View
              style={{
                marginTop: hp(2),
                color: isDarkMode ? "white" : "black",
              }}
            >
              {getIndex(recipe).map((i) => {
                return (
                  <View key={i} style={styles.ingredientItem}>
                    <View style={styles.pointView} />
                    <Text
                      style={[
                        styles.ingredientsText,
                        {
                          fontWeight: 600,
                          color: isDarkMode ? "white" : "black",
                        },
                      ]}
                    >
                      {recipe["strIngredient" + i]}
                    </Text>
                    <Text
                      style={[
                        styles.measure,
                        {
                          fontWeight: 500,
                          color: isDarkMode ? "white" : "black",
                        },
                      ]}
                    >
                      ({recipe["strMeasure" + i]})
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* INSTRUCTIONS */}
          <View style={{ marginTop: hp(3) }}>
            <View>
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontWeight: 500,
                  color: isDarkMode ? "white" : "black",
                }}
              >
                Instructions
              </Text>
              <TouchableOpacity
                style={{ marginTop: hp(1) }}
                onPress={() => {
                  getTranslation();
                }}
              >
                <Text style={{ color: isDarkMode ? "yellow" : "blue" }}>
                  Translate to {showTranslation ? "English" : "Urdu"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: hp(2) }}>
              <Text
                style={{
                  fontSize: hp(2),
                  fontWeight: 500,
                  color: isDarkMode ? "white" : "black",
                }}
              >
                {showTranslation ? transalated : recipe.strInstructions}
              </Text>
            </View>
          </View>

          {/* YOUTUBE VIDEO */}
          {recipe.strYoutube && (
            <View
              style={{
                marginTop: hp(3),
                color: isDarkMode ? "white" : "black",
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontWeight: 500,
                  color: isDarkMode ? "white" : "black",
                }}
              >
                Recipe video
              </Text>
              <View style={{ marginTop: hp(2) }}>
                {/* <YoutubeIframe
                  videoId={getYoutubeVideoId(recipe.strYoutube)}
                  height={hp(35)}
                /> */}
                <Text style={{color : isDarkMode ? "yellow" : 'blue'}} onPress={() => Linking.openURL(recipe.strYoutube)}>Click here to open video in Youtube</Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={{ marginTop: hp(5) }}>
          <ActivityIndicator size={"large"} />
        </View>
      )}
    </ScrollView>
  );
};

export default RecipeDetails;

const styles = StyleSheet.create({
  image: {
    width: wp(98),
    height: hp(50),
    borderRadius: 40,
    padding: 0,
    marginTop: 2,
  },
  topBtnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: wp(100),
    paddingHorizontal: wp(5),
    marginTop: hp(5),
  },
  topBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  title: {
    marginBottom: hp(0.6),
    fontSize: hp(3.5),
  },
  ingredientItem: {
    flexDirection: "row",
    margin: hp(1),
    alignItems: "center",
  },
  pointView: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: "#f3920c",
  },
  ingredientsText: {
    marginLeft: wp(3),
    marginRight: wp(2),
    fontSize: hp(2),
  },
  measure: {
    fontSize: hp(1.8),
  },
});
