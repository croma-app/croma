import React from "react";
import { ScrollView } from "react-native";
import { SavePalette } from "../components/SavePalette";
import { logEvent } from "../libs/Helpers";

export default function SavePaletteScreen(props) {
  logEvent("save_palette_screen");
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SavePalette
        title={"ADD NEW PALETTE"}
        navigationPath={"Home"}
        navigation={props.navigation}
      />
    </ScrollView>
  );
}
