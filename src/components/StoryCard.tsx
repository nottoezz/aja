import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { LETTERS } from '../data/letters';

interface StoryCardProps {
  letter: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ letter }) => {
  const content = LETTERS[letter.toUpperCase()];
  const story = content?.story ?? '';

  const lowercaseLetter = letter.toLowerCase();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        <Text style={styles.title}>Storie</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.storyText}>{story}</Text>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F5', // Soft lavender pink
    borderRadius: 20,
    padding: 24,
    minHeight: 400,
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
    fontFamily: 'EduAidBold',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'EduAidBold',
  },
  content: {
    flex: 1,
  },
  storyText: {
    fontSize: 22,
    lineHeight: 32,
    color: '#34495E',
    textAlign: 'left',
    fontFamily: 'EduAidSolid',
  },
});

export default StoryCard;

