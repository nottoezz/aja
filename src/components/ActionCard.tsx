import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { LETTERS } from '../data/letters';

interface ActionCardProps {
  letter: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ letter }) => {
  const lowercaseLetter = letter.toLowerCase();
  const content = LETTERS[letter.toUpperCase()];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 400,
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
        <Text style={styles.title}>Aksie</Text>
      </View>

      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{ scale: imageScale }],
          },
        ]}
      >
        <Image source={content.actionImage} style={styles.image} resizeMode="contain" />
      </Animated.View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Volg die aksie om die letter te leer!
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFACD', // Soft yellow/cream
    borderRadius: 20,
    padding: 24,
    minHeight: 500,
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 20,
    minHeight: 300,
  },
  image: {
    width: '100%',
    height: 300,
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  descriptionText: {
    fontSize: 20,
    color: '#34495E',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'EduAidSolid',
  },
});

export default ActionCard;

