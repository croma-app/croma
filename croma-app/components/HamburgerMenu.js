import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  NativeModules,
  StyleSheet,
  Text,
  View
} from "react-native";
import Colors from "../constants/Colors";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import { logEvent } from "../libs/Helpers";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { HEADER_HEIGHT } from "../constants/Layout";
import { CromaContext } from "../store/store";

export default props => {
  const pickImageResult = async base64 => {
    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: base64
    });
  };
  const [appInstallTime, setAppInstallTime] = useState(null);

  const { setColorList, clearPalette } = React.useContext(CromaContext);

  useEffect(() => {
    (async () => {
      const appInstallTime = await NativeModules.CromaModule.getAppInstallTime();
      setAppInstallTime(parseInt(appInstallTime, 10));
    })();
  });

  return (
    <View style={[styles.container]}>
      <Touchable
        onPress={() => {
          logEvent("hm_home_screen");
          props.navigation.navigate("Home");
        }}
      >
        <View style={[styles.titleArea]}>
          <Image
            style={styles.logo}
            source={require("../assets/images/dots.png")}
          />
          <Text style={styles.title}>Croma - Save you colors</Text>
        </View>
      </Touchable>
      <ScrollView>
        <View style={styles.menu}>
          <Touchable
            style={styles.menuItem}
            onPress={() => {
              logEvent("hm_create_new_palette");
              //console.error(props, 'check it man ')
              clearPalette();
              props.navigation.navigate("AddPaletteManually");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={[styles.menuIcon, { paddingLeft: 4 }]}>
                <Ionicons name="md-color-filter" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>Create new palette</Text>
            </View>
          </Touchable>
          <Touchable
            style={styles.menuItem}
            onPress={async () => {
              logEvent("hm_palette_library");
              clearPalette();
              props.navigation.navigate("PaletteLibrary");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons
                  name="palette-swatch"
                  style={styles.icon}
                />
              </View>
              <Text style={styles.textAreaMenuItem}>Palette library</Text>
            </View>
          </Touchable>
          <Touchable
            style={styles.menuItem}
            onPress={async () => {
              const imageResult = await pickImageResult();
              if (!imageResult.cancelled) {
                const pickedColors = await NativeModules.CromaModule.navigateToImageColorPicker(
                  imageResult.uri
                );
                logEvent("hm_pick_colors_from_img", {
                  length: pickedColors.length
                });
                clearPalette();
                setColorList(JSON.parse(pickedColors)?.colors);
                props.navigation.navigate("ColorList");
              }
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="image" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>
                Pick colors from an image
              </Text>
            </View>
          </Touchable>
          <Touchable
            style={styles.menuItem}
            onPress={async () => {
              const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
              logEvent("hm_pick_text_colors_from_camera", {
                length: pickedColors.length
              });
              clearPalette();
              setColorList(JSON.parse(pickedColors)?.colors);
              props.navigation.navigate("ColorList");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons
                  name="credit-card-scan-outline"
                  style={styles.icon}
                />
              </View>
              <Text style={styles.textAreaMenuItem}>Scan color codes</Text>
            </View>
          </Touchable>
          {hasRateUsPeriodExpired(appInstallTime) && (
            <MenuLink
              id={"rate-us"}
              link={"market://details?id=app.croma"}
              icon={<MaterialIcons name="rate-review" style={styles.icon} />}
            >
              Like the App? Rate us
            </MenuLink>
          )}
          <Touchable
            style={styles.menuItem}
            onPress={() => {
              logEvent("hm_pro_benefits");
              props.navigation.navigate("ProVersion");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={[styles.menuIcon, { paddingLeft: 4 }]}>
                <FontAwesome5 name="unlock" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>Pro benefites</Text>
            </View>
          </Touchable>
          <Touchable
            style={styles.menuItem}
            onPress={async () => {
              logEvent("hm_sync_palettes");
              props.navigation.navigate("SyncPalettes");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <FontAwesome5 name="file-import" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>
                import/export palettes
              </Text>
            </View>
          </Touchable>
          <Touchable
            style={styles.menuItem}
            onPress={async () => {
              logEvent("hm_about_us");
              props.navigation.navigate("AboutUs");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={{ ...styles.menuIcon, paddingLeft: 4 }}>
                <MaterialCommunityIcons
                  name="information-outline"
                  style={styles.icon}
                />
              </View>
              <Text style={styles.textAreaMenuItem}>About us</Text>
            </View>
          </Touchable>
        </View>
      </ScrollView>
    </View>
  );

  function hasRateUsPeriodExpired(appInstallTime) {
    if (appInstallTime == null) return false;
    return appInstallTime + fiveDaysDurationMillis() < new Date().getTime();
  }
  function fiveDaysDurationMillis() {
    return 5 * 24 * 60 * 60 * 1000;
  }
};

function MenuLink(props) {
  return (
    <Touchable
      style={[styles.menuItem]}
      onPress={() => {
        logEvent("hm_link_" + props.id);
        Linking.openURL(props.link);
      }}
    >
      <View style={styles.menuItemView}>
        <View style={styles.menuIcon}>{props.icon}</View>
        <Text style={styles.textAreaMenuItem}>{props.children}</Text>
      </View>
    </Touchable>
  );
}
const menuHeight = 50;
const padding = 10;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: -4
  },
  titleArea: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: padding,
    height: HEADER_HEIGHT
  },
  logo: {
    width: 48,
    height: 48,
    padding: padding
  },
  title: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: padding,
    color: "white"
  },
  menu: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "stretch"
  },
  menuItem: {
    height: menuHeight
  },
  menuItemView: {
    flex: 1,
    flexDirection: "row"
  },
  textAreaMenuItem: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: padding,
    alignItems: "flex-start"
  },
  menuIcon: {},
  icon: {
    fontSize: menuHeight - 2 * padding,
    padding: padding,
    color: "black"
  }
});
