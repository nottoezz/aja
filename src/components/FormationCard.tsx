import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface FormationCardProps {
  letter: string;
  navigation?: any;
}

const FormationCard: React.FC<FormationCardProps> = ({ letter, navigation }) => {
  const lowercaseLetter = letter.toLowerCase();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCardPress = (isUppercase: boolean) => {
    if (navigation) {
      navigation.navigate('Formation', {
        letter: letter,
        isUppercase: isUppercase,
      });
    }
  };

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.letterContainer}>
          <Text style={styles.letter}>{letter}</Text>
          <Text style={styles.letter}>{lowercaseLetter}</Text>
        </View>
        <Text style={styles.title}>Vorm die Letter</Text>
      </View>
      
      <View style={styles.cardsContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.letterCard}
            onPress={() => handleCardPress(true)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardLetter}>{letter}</Text>
              <Text style={styles.cardLabel}>Hoofletter</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.letterCard}
            onPress={() => handleCardPress(false)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardLetter}>{lowercaseLetter}</Text>
              <Text style={styles.cardLabel}>Klein letter</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F7FA', // Soft mint/teal
    borderRadius: 20,
    padding: 24,
    minHeight: 300,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 16,
  },
  letterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  letter: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#4A90E2',
    fontFamily: 'TeachersPet',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'TeachersPet',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  letterCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardLetter: {
    fontSize: 88,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 12,
    fontFamily: 'TeachersPet',
  },
  cardLabel: {
    fontSize: 18,
    color: '#7F8C8D',
    fontWeight: '500',
    fontFamily: 'TeachersPet',
  },
});

export default FormationCard;

