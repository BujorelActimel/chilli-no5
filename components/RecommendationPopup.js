import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../products';

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

export default function RecommendationPopup({ visible, onClose, navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      showRecommendations();
    }
  };

  const showRecommendations = () => {
    let recommendedProducts = products;

    if (answers.spiciness === 'Mild') {
      recommendedProducts = recommendedProducts.filter(p => p.spicyLevel <= 2);
    } else if (answers.spiciness === 'Medium') {
      recommendedProducts = recommendedProducts.filter(p => p.spicyLevel === 3);
    } else if (answers.spiciness === 'Hot') {
      recommendedProducts = recommendedProducts.filter(p => p.spicyLevel === 4);
    } else if (answers.spiciness === 'Extra Hot') {
      recommendedProducts = recommendedProducts.filter(p => p.spicyLevel === 5);
    }

    if (answers.pairing) {
      recommendedProducts = recommendedProducts.filter(p => 
        p.pairings.some(pairing => pairing.toLowerCase().includes(answers.pairing.toLowerCase()))
      );
    }

    onClose();
    setCurrentQuestion(0);
    setAnswers({});
    navigation.navigate('RecommendationResults', { recommendations: recommendedProducts });
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