import * as React from "react";
import { StyleSheet, Text } from "react-native";
import Touchable from "react-native-platform-touchable";

export default class CromaButton extends React.Component {
  render() {
    const { style, onPress, children, textStyle } = this.props;
    return (
      <Touchable style={[styles.button, style]} onPress={onPress}>
        <Text style={[styles.text, textStyle]}> {children} </Text>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: "#fff",
    elevation: 2,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    textTransform: "uppercase",
    fontWeight: "700",
    color: "#484a4c"
  }
});
