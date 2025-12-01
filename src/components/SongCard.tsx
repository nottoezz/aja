import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { useAudioPlayer } from "expo-audio";
import { LETTERS } from "../data/letters";

interface SongCardProps {
  letter: string;
}

const SongCard: React.FC<SongCardProps> = ({ letter }) => {
  const content = LETTERS[letter.toUpperCase()];
  const player = useAudioPlayer(content.songAudio);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const lyrics = content.lyrics;

  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const playSound = async () => {
    try {
      if (player.playing) {
        // Treat pressing the green button while playing as a full stop.
        await player.pause();
        await player.seekTo(0);
      } else {
        await player.play();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // The dedicated stop button is replaced by an orange Action button.

  const lowercaseLetter = letter.toLowerCase();
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const stopButtonScale = useRef(new Animated.Value(1)).current;

  const handlePlayPressIn = () => {
    Animated.spring(playButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPressOut = () => {
    Animated.spring(playButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleActionPressIn = () => {
    Animated.spring(stopButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleActionPressOut = () => {
    Animated.spring(stopButtonScale, {
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
        <Text style={styles.title}>Liedjie</Text>
      </View>

      <View style={styles.lyricsContainer}>
        <ScrollView>
          <Text style={styles.lyricsText}>{lyrics}</Text>
          {content.songArtwork && (
            <Image
              source={content.songArtwork}
              style={styles.songArtwork}
              resizeMode="contain"
            />
          )}
        </ScrollView>
        {/* Repeat indicator (×2) on the right side for all songs */}
        <View style={styles.repeatContainer}>
          <Text style={styles.repeatText}>×2</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Animated.View style={{ transform: [{ scale: playButtonScale }] }}>
          <TouchableOpacity
            style={[styles.button, styles.playButton]}
            onPress={playSound}
            onPressIn={handlePlayPressIn}
            onPressOut={handlePlayPressOut}
          >
            <Text style={styles.buttonText}>
              {player.playing ? "Stop" : "Speel"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: stopButtonScale }] }}>
          <TouchableOpacity
            style={[styles.button, styles.actionButton]}
            onPress={() => setIsActionModalVisible(true)}
            onPressIn={handleActionPressIn}
            onPressOut={handleActionPressOut}
          >
            <Text style={styles.buttonText}>Aksie</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Action modal */}
      <Modal
        visible={isActionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Aksie vir {letter.toUpperCase()}
            </Text>
            <Image
              source={content.actionImage}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <ScrollView style={styles.modalDescriptionContainer}>
              <Text style={styles.modalDescription}>
                {content.actionDescription}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.button, styles.modalCloseButton]}
              onPress={() => setIsActionModalVisible(false)}
            >
              <Text style={styles.buttonText}>Maak toe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF5E6", // Soft peach/coral for the card background
    borderRadius: 20,
    padding: 24,
    minHeight: 500,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 16,
  },
  letterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  letter: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#4A90E2",
    fontFamily: "TeachersPet",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#2C3E50",
    fontFamily: "TeachersPet",
  },
  lyricsContainer: {
    backgroundColor: "#FFFFFF", // White section behind lyrics and artwork
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    minHeight: 200,
    position: "relative",
  },
  lyricsText: {
    fontSize: 20,
    lineHeight: 32,
    color: "#34495E",
    textAlign: "center",
    fontFamily: "TeachersPet",
  },
  songArtwork: {
    width: "100%",
    height: 260, // larger artwork since lyrics are shorter (*2 notation)
    marginTop: 16,
    borderRadius: 12,
  },
  repeatContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  repeatText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#E74C3C",
    fontFamily: "TeachersPet",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    backgroundColor: "#27AE60",
  },
  actionButton: {
    backgroundColor: "#F39C12", // orange action button
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "TeachersPet",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2C3E50",
    fontFamily: "TeachersPet",
  },
  modalImage: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  modalDescriptionContainer: {
    maxHeight: 160,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 20,
    color: "#34495E",
    textAlign: "center",
    fontFamily: "TeachersPet",
  },
  modalCloseButton: {
    backgroundColor: "#4A90E2",
  },
});

export default SongCard;
