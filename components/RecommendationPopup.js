import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const questions = [
  {
    id: 'purpose',
    text: 'Is this sauce for a gift or for yourself?',
    options: ['Gift', 'For myself']
  },
  {
    id: 'spiciness',
    text: 'How spicy do you like your food?',
    options: ['Mild', 'Medium', 'Hot', 'Extra Hot']
  },
  {
    id: 'pairing',
    text: 'What foods do you want to pair with this sauce?',
    options: ['Mexican', 'Asian', 'BBQ', 'Seafood', 'Vegetarian']
  }
];

export default function RecommendationPopup({ visible, onClose, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeRecommendation();
    }
  };

  const completeRecommendation = () => {
    let recommendedFilters = {
      spicyLevel: null,
      priceRange: null,
      category: null
    };

    // Set spicy level
    switch (answers.spiciness) {
      case 'Mild':
        recommendedFilters.spicyLevel = 1;
        break;
      case 'Medium':
        recommendedFilters.spicyLevel = 3;
        break;
      case 'Hot':
        recommendedFilters.spicyLevel = 4;
        break;
      case 'Extra Hot':
        recommendedFilters.spicyLevel = 5;
        break;
    }

    // Set category based on pairing
    switch (answers.pairing) {
      case 'Mexican':
        recommendedFilters.category = 'Hot Sauce';
        break;
      case 'Asian':
        recommendedFilters.category = 'Chilli Oil';
        break;
      case 'BBQ':
        recommendedFilters.category = 'BBQ Sauce';
        break;
      case 'Seafood':
      case 'Vegetarian':
        recommendedFilters.category = 'Seasoning';
        break;
    }

    // Reset for next use
    setCurrentQuestion(0);
    setAnswers({});

    onComplete(recommendedFilters);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.questionText}>{questions[currentQuestion].text}</Text>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionButton} 
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  questionText: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  optionText: {
    fontFamily: 'GothamBook',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});