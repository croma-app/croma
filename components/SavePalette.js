import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import CromaButton from "../components/CromaButton";
import { Croma } from "../store/store";
import { TextDialog } from "./CommanDialogs";

export const SavePalette = props => {
  const [paletteName, setPaletteName] = React.useState(
    props.navigation.getParam("name") ? props.navigation.getParam("name") : ""
  );

  const [isPaletteNameExist, setIsPaletteNameExist] = React.useState(false);
  const { addPalette, allPalettes } = React.useContext(Croma);
  const { title, navigationPath } = props;
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.label}>{title}</Text>
        <TextInput
          style={styles.input}
          value={paletteName}
          placeholder="Enter a name for the palette"
          onChangeText={name => setPaletteName(name)}
        />
      </View>
      <CromaButton
        onPress={async () => {
          if (allPalettes[paletteName]) {
            setIsPaletteNameExist(true);
            setTimeout(() => {
              setIsPaletteNameExist(false);
            }, 3000);
            return null;
          }
          let colorsFromParams = props.navigation.getParam("colors");
          if (typeof colorsFromParams === "string") {
            colorsFromParams = JSON.parse(colorsFromParams);
          }
          const colors = [...new Set(colorsFromParams || [])];
          const palette = { name: paletteName, colors: colors };
          addPalette(palette);
          if (navigationPath === "Palette") {
            props.navigation.navigate(navigationPath, palette);
          } else {
            props.navigation.navigate(navigationPath);
          }
        }}
      >
        Save palette
      </CromaButton>
      {isPaletteNameExist && <TextDialog />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: "#fff",
    elevation: 2,
    height: 92,
    marginVertical: 10,
    padding: 10
  },
  label: {
    flex: 1,
    color: Colors.darkGrey,
    fontWeight: "700"
  },
  input: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 1
  }
});
