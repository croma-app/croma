/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import SingleColorCard from '../components/SingleColorCard';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import FloatingActionButton from '../components/FloatingActionButton';
import Colors from '../constants/Styles';
import { useHeaderHeight } from '@react-navigation/elements';
import { logEvent } from '../libs/Helpers';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../libs/Helpers';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import PropTypes from 'prop-types';
import ColorPickerModal from '../components/ColorPickerModal';
import useApplicationStore from '../hooks/useApplicationStore';
import {NUMBER_OF_COLORS_PRO_COUNT} from '../libs/constants';

export default function PaletteScreen({ navigation, route }) {
  const { pro, allPalettes, updatePalette, deleteColorFromPalette, addNewColorToPalette } =
    useApplicationStore();

  const paletteId = route.params.paletteId;

  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const { height } = Dimensions.get('window');
  const palette = allPalettes.find((palette) => palette.id === paletteId);
  const [colors, setColors] = useState(palette?.colors);
  useEffect(() => {
    setColors(allPalettes.find((palette) => palette.id === paletteId)?.colors);
  }, [allPalettes, paletteId]);
  const onColorDelete = React.useCallback(
    (hex) => {
      deleteColorFromPalette(palette.id, palette.colors.find((c) => c.color === hex).id || null);
    },
    [deleteColorFromPalette, palette.colors, palette.id]
  );
  useEffect(() => {
    logEvent('palette_screen');
  });

  useLayoutEffect(() => {
    setNavigationOptions({ navigation, paletteId: palette.id });
  }, [navigation, palette.id]);

  const renderItem = React.useCallback(
    (renderItemParams) => {
      return (
        <ScaleDecorator key={`${renderItemParams.item.id}`}>
          <SingleColorCard
            onPress={() => {
              navigation.navigate('ColorDetails', { hexColor: renderItemParams.item.color });
            }}
            onPressDrag={renderItemParams.drag}
            color={renderItemParams.item}
            onColorDelete={onColorDelete}
          />
        </ScaleDecorator>
      );
    },
    [navigation, onColorDelete]
  );

  const keyExtractor = useCallback((item) => {
    return item.id;
  }, []);

  const colorsToShow = React.useMemo(
    () => colors?.slice(0, pro.plan != 'free' ? colors.length : 4),
    [colors, pro.plan]
  );

  const handleColorSelected = (color) => {
    addNewColorToPalette(palette.id, { hex: color });
    setIsColorPickerVisible(false);
  };

  return (
    <>
      <View style={(styles.container, { minHeight: height - useHeaderHeight() - 16 })}>
        <DraggableFlatList
          data={colorsToShow}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.listview}
          onDragEnd={({ data: reorderedColors }) => {
            // Colors is update in local state first and then updated on the server and in global state.
            // The whole state logic is little messed up now and need refactoring but for now this approach works.
            setColors(reorderedColors);
            updatePalette(palette.id, { ...palette, colors: reorderedColors });
          }}
          ListFooterComponent={ListFooterComponent}
        />
        <FloatingActionButton
          onPress={() => {
            logEvent('palette_screen_add_color');
            if (
              (Platform.OS === 'android' || Platform.OS === 'ios') &&
              colors.length >= NUMBER_OF_COLORS_PRO_COUNT &&
              pro.plan == 'starter'
            ) {
              notifyMessage('Upgrade to Pro to add more than ' + NUMBER_OF_COLORS_PRO_COUNT + ' colors!');
              navigation.navigate('ProVersion', { highlightFeatureId: 9 });
            } else {
              setIsColorPickerVisible(true);
            }
          }}
          
        />
      </View>
      <Modal
        visible={isColorPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsColorPickerVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsColorPickerVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <ColorPickerModal
            onColorSelected={handleColorSelected}
            onClose={() => setIsColorPickerVisible(false)}
            currentPlan={pro.plan}
          />
        </View>
      </Modal>
    </>
  );
}

PaletteScreen.propTypes = {
  navigation: PropTypes.any
};

const CustomHeader = ({ paletteId }) => {
  const { updatePalette, allPalettes } = useApplicationStore();
  const palette = allPalettes.find((p) => p.id === paletteId);
  const [paletteName, setPaletteName] = useState(palette.name);
  const [isEditingPaletteName, setIsEditingPaletteName] = useState(false);

  const onDone = () => {
    updatePalette(palette.id, { ...palette, name: paletteName });
    setIsEditingPaletteName(false);
  };

  const onEdit = () => {
    logEvent('edit_palette_name');
    setIsEditingPaletteName(true);
  };

  return (
    <View style={styles.headerContainer}>
      {isEditingPaletteName ? (
        <>
          <TextInput
            style={styles.input}
            value={paletteName}
            autoFocus={true}
            onChangeText={(name) => {
              setPaletteName(name);
            }}
          />
          <TouchableOpacity onPress={onDone} style={styles.marginTop}>
            <MaterialIcons name="done" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.headerTitle}>
            {paletteName.substring(0, 25) + (paletteName.length > 25 ? '...' : '')}
          </Text>
          <TouchableOpacity onPress={onEdit} style={styles.marginTop}>
            <AntDesign name="edit" size={20} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

CustomHeader.propTypes = { paletteId: PropTypes.string };

const ListFooterComponent = () => {
  return (
    <View style={styles.footerHeight} /> // Adjust the height as needed
  );
};

const setNavigationOptions = (props) => {
  const { navigation, paletteId } = props;
  navigation.setOptions({
    headerTitle: () => <CustomHeader paletteId={paletteId} />
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listview: {
    margin: 8
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%'
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20
  },
  input: {
    color: Colors.white,
    fontSize: 20,
    maxWidth: '80%'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  marginTop: {
    marginTop: 4
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  footerHeight: { height: 200 }
});
