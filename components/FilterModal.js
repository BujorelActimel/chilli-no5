import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterModal = ({ visible, onClose, onApply, onClear, currentFilters }) => {
  const [spicyLevel, setSpicyLevel] = useState(currentFilters.spicyLevel);
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange);
  const [category, setCategory] = useState(currentFilters.category);

  useEffect(() => {
    setSpicyLevel(currentFilters.spicyLevel);
    setPriceRange(currentFilters.priceRange);
    setCategory(currentFilters.category);
  }, [currentFilters]);

  const handleApply = () => {
    onApply({ spicyLevel, priceRange, category });
  };

  const clearFilters = () => {
    setSpicyLevel(null);
    setPriceRange(null);
    setCategory(null);
    onClear();
  };

  const isRangeEqual = (range1, range2) => {
    if (range1 === null && range2 === null) return true;
    if (range1 === null || range2 === null) return false;
    return range1[0] === range2[0] && range1[1] === range2[1];
  };

  const renderPriceRangeOptions = () => {
    const ranges = [
      { label: 'Any', value: null },
      { label: '£0 - £5', value: [0, 5] },
      { label: '£5 - £10', value: [5, 10] },
      { label: '£10 - £15', value: [10, 15] },
      { label: '£15+', value: [15, Infinity] },
    ];
    return (
      <View style={styles.optionsContainer}>
        {ranges.map((range) => (
          <TouchableOpacity
            key={range.label}
            style={[
              styles.optionButton, 
              isRangeEqual(priceRange, range.value) && styles.selectedOption
            ]}
            onPress={() => setPriceRange(range.value)}
          >
            <Text style={styles.optionText}>{range.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSpicyLevelOptions = () => {
    const levels = [null, 1, 2, 3, 4, 5];
    return (
      <View style={styles.optionsContainer}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level === null ? 'any' : level}
            style={[styles.optionButton, spicyLevel === level && styles.selectedOption]}
            onPress={() => setSpicyLevel(level)}
          >
            <Text style={styles.optionText}>{level === null ? 'Any' : level}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategoryOptions = () => {
    const categories = ['Any', 'Hot Sauce', 'BBQ Sauce', 'Chilli Oil', 'Seasoning'];
    return (
      <View style={styles.optionsContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.optionButton, category === (cat === 'Any' ? null : cat) && styles.selectedOption]}
            onPress={() => setCategory(cat === 'Any' ? null : cat)}
          >
            <Text style={styles.optionText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={styles.sectionTitle}>Spicy Level</Text>
            {renderSpicyLevelOptions()}
            <Text style={styles.sectionTitle}>Price Range</Text>
            {renderPriceRangeOptions()}
            <Text style={styles.sectionTitle}>Category</Text>
            {renderCategoryOptions()}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'GothamBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#E40421',
  },
  optionText: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  clearButtonText: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: '#E40421',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
  },
  applyButtonText: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default FilterModal;