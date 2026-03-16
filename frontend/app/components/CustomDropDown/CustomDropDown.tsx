import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList, Platform} from 'react-native';
import styles from './styles';
import styles2 from '../CustomInputText/styles';
import globalStyles from '@/assets/globalStyles/globalStyles';

export type Option = {
  id: number;
  label: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  onSelect?: (item: Option) => void;
};

const CustomDropdown = ({ label, options, onSelect }: Props) => {
  const [selectedValue, setSelectedValue] = useState<Option | null>(options[0] || null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: Option) => {
    setSelectedValue(item);
    setModalVisible(false);
    if (onSelect) onSelect(item);
    console.log(item.value);
  };

  return (
    <View style={styles2.container}>
      <Text style={styles2.label}>{label}</Text>

      <TouchableOpacity
        style={styles2.inputWrapper}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.input, { paddingVertical: Platform.OS === 'ios' ? 12 : 16 }]}>
          {selectedValue ? selectedValue.label : "Seleccione..."}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        style = {globalStyles.alineadoPersonal}
      >
        <TouchableOpacity
          style={[styles.modalOverlay]}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomDropdown;