import React from "react";
import { Platform, Linking } from "react-native";
import { createStackNavigator } from "react-navigation";
import { createAppContainer } from "react-navigation";
import ColorDetailsScreen from "../screens/ColorDetailScreen";
import ColorPickerScreen from "../screens/ColorPickerScreen";
import PalettesScreen from "../screens/PalettesScreen";
import SavePaletteScreen from "../screens/SavePaletteScreen";
import AddPaletteManuallyScreen from "../screens/AddPaletteManuallyScreen";
import ColorListScreen from "../screens/ColorListScreen";
import PaletteScreen from "../screens/PaletteScreen";
import HomeScreen from "../screens/HomeScreen";
import Colors from "../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";



const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});
const RootStack = createStackNavigator(
  {
    ColorDetails: ColorDetailsScreen,
    ColorPicker: ColorPickerScreen,
    Palettes: PalettesScreen,
    SavePalette: SavePaletteScreen,
    ColorList: ColorListScreen,
    Palette: PaletteScreen,
    Home: HomeScreen,
    AddPaletteManually: AddPaletteManuallyScreen
  },
  {
    initialRouteName: "Home",
    transparentCard: true,
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerRight: (
        Platform.OS === 'web' ?
          <>
            <Touchable
              style={{ padding: '5px' }}
              onPress={() => {
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=app.croma"
                )
              }}
            >
              <Entypo name="google-play" style={{
                fontSize: 25,
                height: 25,
                color: "white"
              }} />
            </Touchable>
            <Touchable
              style={{ padding: '5px', marginRight: '10px' }}
              onPress={() => {
                Linking.openURL(
                  "https://github.com/croma-app/croma-react"
                )
              }}
            >
              <Entypo name="github" style={{
                fontSize: 25,
                height: 25,
                color: "white"
              }} />
            </Touchable>
          </>
          : ''
      ),
      headerTintColor: "#fff"
    }
  }
);

const AppContainer = createAppContainer(RootStack);

export default RootStack;
