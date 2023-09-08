import { StyleSheet, Text, View } from "react-native";
import React, { memo, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Welcome from "../screens/Welcome";
import Home from "../screens/Home";
import RecipeDetails from "../screens/RecipeDetails";
import CategoryListItem from "../components/CategoryListItem";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown : false}}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name='RecipeDetails' component={RecipeDetails}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(Navigation);

const styles = StyleSheet.create({});
