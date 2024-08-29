import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Alert, Text
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Color from 'pigment/full';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { logEvent } from '../libs/Helpers';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { generateUsingColor } from '../network/color_palette';

function PalettesScreen({ route }) {
  const hexColor = route.params.hexColor;
  const navigation = useNavigation();

  const parseCamelCase = (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const fullColor = new Color(hexColor);
  let items = [];
  for (const i in fullColor) {
    if (/.*scheme$/i.test(i) && typeof fullColor[i] === 'function') {
      let colors = [];
      const paletteColors = fullColor[i]();
      paletteColors.forEach((c) => colors.push({ color: c.tohex() }));
      items.push(
        <PalettePreviewCard
          onPress={() => {
            navigation.navigate('ColorList', { colors: colors });
          }}
          key={i.toString()}
          colors={colors}
          name={parseCamelCase(i.toString())}
        />
      );
    }
  }

  useEffect(() => {
    logEvent('palettes_screen');
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {items}
    </ScrollView>
  );
}

function PalettesScreenAI({ route }) {
  const hexColor = route.params.hexColor;
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPalettes = async () => {
      try {
        const response = await generateUsingColor(hexColor);
        const generatedPalettes = response.data.palettes;
        setPalettes(generatedPalettes);
      } catch (error) {
        console.error('Error fetching AI palettes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPalettes();
    logEvent('palettes_screen_ai');
  }, [hexColor]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        palettes.map((palette, index) => {
          const colors = palette.colors.map((color) => ({ color: color.hex }));
          return (
            <PalettePreviewCard
              onPress={() => {
                navigation.navigate('ColorList', { suggestedName: palette.name, colors });
              }}
              key={index.toString()}
              colors={colors}
              name={palette.name}
            />
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  }
});

// Custom button for the vertical three-dots menu
function ThreeDotsButton({ onPress }) {
  return (
    <TouchableOpacity
      style={{ justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}
      onPress={onPress}>
      <FontAwesome name="ellipsis-v" color={Colors.primary} size={24} />
    </TouchableOpacity>
  );
}

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === 'ThreeDotsMenu') {
            // Handle Three Dots Menu Press
            Alert.alert('Menu', 'Three dots menu pressed!');
          } else {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }
        };

        // Special case for the Three Dots Menu
        if (route.name === 'ThreeDotsMenu') {
          return <ThreeDotsButton key={route.name} onPress={onPress} />;
        }

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', padding: 10 }}>
            <FontAwesome
              name={options.tabBarIcon ? options.tabBarIcon.name : 'circle'}
              color={isFocused ? Colors.primary : '#222'}
              size={24}
            />
            <Text style={{ color: isFocused ? Colors.primary : '#222' }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function PalettesTabNavigator({ navigation, route }) {
  const hexColor = route.params.hexColor;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />} // Use the custom tab bar
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            paddingBottom: 10,
            paddingTop: 10,
            height: 60
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.gray,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600'
          }
        }}>
        <Tab.Screen
          name="Color Theory"
          component={PalettesScreen}
          initialParams={{ hexColor: hexColor }}
          options={{
            tabBarLabel: 'Color Theory',
            tabBarIcon: { name: 'color-palette' }
          }}
        />
        <Tab.Screen
          name="AI"
          component={PalettesScreenAI}
          initialParams={{ hexColor: hexColor }}
          options={{
            tabBarLabel: 'AI',
            tabBarIcon: { name: 'magic' }
          }}
        />
        <Tab.Screen
          name="ThreeDotsMenu"
          component={PalettesScreenAI} // Placeholder component; replace if needed
          options={{
            tabBarLabel: '', // Hide the label for the three dots menu
            tabBarIcon: { name: 'ellipsis-v' }
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
