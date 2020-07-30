import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import CromaButton from "../components/CromaButton";
import { CromaColorPicker as ColorPicker } from "croma-color-picker";
import { logEvent } from "../libs/Helpers";
export default function ColorPickerScreen(props) {
  const [color, setColor] = useState("#db0a5b");
  logEvent("color_picker_screen");
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <ColorPicker
          onChangeColor={color => {
            setColor(color);
          }}
          style={[{ height: 350, flex: 1 }]}
        />
        <CromaButton
          onPress={() => {
            props.navigation.goBack();
            props.navigation.getParam("onDone")({ color: color });
          }}
        >
          Done
        </CromaButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    margin: 8
  }
});
