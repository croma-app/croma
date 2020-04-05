import React from "react";

import SingleColorCard from "../components/SingleColorCard";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  ToastAndroid
} from "react-native";
import { UndoDialog, DialogContainer } from "../components/CommanDialogs";
import { Croma } from "../store/store";
import ActionButton from "react-native-action-button";
import Colors from "../constants/Colors";
import { Header } from "react-navigation";
import EmptyView from "../components/EmptyView";
export default function PaletteScreen(props) {
  const { height, width } = Dimensions.get("window");
  const paletteName = props.navigation.getParam("name");
  const {
    isPro,
    allPalettes,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette
  } = React.useContext(Croma);
  const colors = allPalettes[paletteName].colors;
  const deletedColors = allPalettes[paletteName].deletedColors
    ? allPalettes[paletteName].deletedColors
    : [];

  const deleteColor = index => {
    colorDeleteFromPalette(props.navigation.getParam("name"), index);
  };

  return (
    <>
      <View
        style={(styles.container, { minHeight: height - Header.HEIGHT - 16 })}
      >
        <ScrollView
          style={styles.listview}
          showsVerticalScrollIndicator={false}
        >
          {colors.slice(0, isPro ? colors.length : 4).map((colorObj, index) => {
            return (
              <SingleColorCard
                key={colorObj.color}
                onPress={() =>
                  props.navigation.navigate("ColorDetails", {
                    color: colorObj.color
                  })
                }
                color={colorObj.color}
                colorDeleteFromPalette={() => {
                  deleteColor(index);
                }}
              ></SingleColorCard>
            );
          })}
          <EmptyView />
        </ScrollView>
        <ActionButton
          offsetY={60}
          bgColor="rgba(68, 68, 68, 0.6)"
          hideShadow={Platform.OS === "web" ? true : false}
          buttonColor={Colors.accent}
          onPress={() => {
            if (Platform.OS === 'android' && colors.length >= 4 && isPro === false) {
              ToastAndroid.show("Unlock pro to add more than 4 colors!", ToastAndroid.LONG);
            } else {
              props.navigation.navigate("ColorPicker", {
                onDone: color => {
                  addColorToPalette(paletteName, color);
                }
              });
            }
          }}
        />
      </View>
      <DialogContainer>
        {deletedColors.map(colorObj => (
          <UndoDialog
            name={colorObj.color}
            undoDeletionByName={colorName => {
              undoColorDeletion(paletteName, colorName);
            }}
          />
        ))}
      </DialogContainer>
    </>
  );
}
PaletteScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("name")
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listview: {
    margin: 8
  }
});
