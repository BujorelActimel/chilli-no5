// RecommendationScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function RecommendationScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, show recommendations
      showRecommendations();
    }
  };

  const showRecommendations = () => {
    // Simple recommendation logic (you can make this more sophisticated)
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

    // Navigate to results screen with recommendations
    navigation.navigate('RecommendationResults', { recommendations: recommendedProducts });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Your Perfect Sauce</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontFamily: 'AbhayaLibreBold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  questionText: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#1A1A1A',
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