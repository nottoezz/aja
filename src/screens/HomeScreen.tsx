import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LETTERS } from '../data/letters';

interface AnimatedLetterButtonProps {
  letter: string;
  index: number;
  onPress: (letter: string) => void;
}

// Color palette for letter buttons - vibrant, kid-friendly colors
const LETTER_COLORS = [
  '#4A90E2', // Blue
  '#E74C3C', // Red
  '#27AE60', // Green
  '#F39C12', // Orange
  '#9B59B6', // Purple
  '#1ABC9C', // Turquoise
  '#E67E22', // Dark Orange
  '#3498DB', // Light Blue
  '#E91E63', // Pink
  '#00BCD4', // Cyan
  '#FF9800', // Amber
  '#8BC34A', // Light Green
  '#FF5722', // Deep Orange
  '#673AB7', // Deep Purple
  '#009688', // Teal
  '#CDDC39', // Lime
  '#FFC107', // Yellow
  '#FF4081', // Pink Accent
  '#3F51B5', // Indigo
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#FF6F00', // Orange Accent
  '#4CAF50', // Green Accent
  '#2196F3', // Blue Accent
  '#9C27B0', // Purple Accent
  '#00E676', // Green Accent
];

const AnimatedLetterButton: React.FC<AnimatedLetterButtonProps> = ({
  letter,
  index,
  onPress,
}) => {
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;
  
  // Cycle through colors based on index
  const buttonColor = LETTER_COLORS[index % LETTER_COLORS.length];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 500,
        delay: 300 + index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonSlide, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: 300 + index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: buttonFade,
        transform: [
          { translateY: buttonSlide },
          { scale: buttonScale },
        ],
      }}
    >
      <TouchableOpacity
        style={[styles.letterButton, { backgroundColor: buttonColor }]}
        onPress={() => onPress(letter)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <Text style={styles.letterText}>{letter}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Get all letter keys and sort them alphabetically so they appear in correct order
  const alphabet = Object.keys(LETTERS)
    .filter((l) => /^[A-Z]$/.test(l))
    .sort();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLetterPress = (letter: string) => {
    navigation.navigate('LetterDetail', { letter });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Kies 'n Letter</Text>
        <Text style={styles.subtitle}>Choose a Letter</Text>
      </Animated.View>
      
      <View style={styles.grid}>
        {alphabet.map((letter, index) => (
          <AnimatedLetterButton
            key={letter}
            letter={letter}
            index={index}
            onPress={handleLetterPress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4F8', // Slightly more vibrant background
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    fontFamily: 'EduAidBold',
  },
  subtitle: {
    fontSize: 20,
    color: '#7F8C8D',
    fontFamily: 'EduAidSolid',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  letterButton: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  letterText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'EduAidBold',
    marginTop: 20, // push text slightly down to center better within the square
  },
});

export default HomeScreen;

