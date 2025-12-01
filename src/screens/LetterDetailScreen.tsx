import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import StoryCard from '../components/StoryCard';
import FormationCard from '../components/FormationCard';
import SongCard from '../components/SongCard';

interface LetterDetailScreenProps {
  route: {
    params: {
      letter: string;
    };
  };
  navigation: any;
}

const LetterDetailScreen: React.FC<LetterDetailScreenProps> = ({ route, navigation }) => {
  const { letter } = route.params;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StoryCard letter={letter} />
      <View style={styles.spacer} />
      <FormationCard letter={letter} navigation={navigation} />
      <View style={styles.spacer} />
      <SongCard letter={letter} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Soft pastel gray
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  spacer: {
    height: 24,
  },
});

export default LetterDetailScreen;

