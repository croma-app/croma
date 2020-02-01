import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import CromaButton from "../components/CromaButton";
import { CromaColorPicker as ColorPicker } from "croma-color-picker";
export default function ColorPickerScreen(props) {
  const [color, setColor] = useState("#db0a5b");
  return (
    <ScrollView>
      <View style={styles.container}>
        <ColorPicker
          onChangeColor={color => {
            console.log("oncolorchange called", color);
            setColor(color);
          }}
          style={[{ height: 300, verticalMargin: 8, flex: 1 }]}
        />
        <CromaButton
          onPress={() => {
            console.log(props.navigation.getParam("onDone"));
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