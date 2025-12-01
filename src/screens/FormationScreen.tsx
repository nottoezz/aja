import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PanResponder, Animated } from 'react-native';
import Svg, { Path, G, Polyline } from 'react-native-svg';
import { useFonts } from 'expo-font';

interface FormationScreenProps {
  route: {
    params: {
      letter: string;
      isUppercase: boolean;
    };
  };
  navigation: any;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - 80;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 0.6;
const TOLERANCE = 25; // Maximum allowed distance from path in SVG units
const MAX_STEP_AHEAD = 30; // Maximum allowed jump ahead in path length

interface Stroke {
  pathData: string; // SVG path data string for tracing
  fillPathData: string; // SVG path data for filling the letter shape
  transform?: { translateX: number; translateY: number; scale: number }; // Transform for positioning
  pathLength?: number; // Will be computed
}

const FormationScreen: React.FC<FormationScreenProps> = ({ route, navigation }) => {
  const { letter, isUppercase } = route.params;
  const displayLetter = isUppercase ? letter.toUpperCase() : letter.toLowerCase();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPaths, setDrawingPaths] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  const [strokeCount, setStrokeCount] = useState(0);
  
  // Maximum strokes allowed based on letter
  const maxStrokes = displayLetter === 'A' ? 3 : displayLetter === 'a' ? 1 : 0;
  
  const [fontsLoaded] = useFonts({
    TeachersPet: require('../../assets/fonts/TeachersPet.ttf'),
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const completeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (strokeCount >= maxStrokes) {
      Animated.spring(completeAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [strokeCount, maxStrokes]);

  // Define stroke paths for each letter using EXACT font paths
  const getStrokes = (): Stroke[] => {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2; // Center vertically to match background letter
    const targetFontSize = CANVAS_HEIGHT * 0.85; // Match the font size used in Text component

    if (displayLetter === 'A') {
      // EXACT Patrick Hand A path - viewBox: 0 0 33.38 49.506
      const viewBoxA = { width: 33.38, height: 49.506 };
      // Scale so viewBox height matches target font size
      const scale = targetFontSize / viewBoxA.height;
      
      // Full A path for filling
      const fullAPath = `M 17.628 0 Q 19.503 0 20.778 1.65 A 18.361 18.361 0 0 1 22.651 5.059 A 71.245 71.245 0 0 1 24.078 8.475 A 101.152 101.152 0 0 1 27.01 17.471 Q 29.76 27.255 32.431 41.883 A 504.275 504.275 0 0 1 33.303 46.8 Q 33.378 47.1 33.378 47.663 Q 33.378 48.225 32.666 48.863 Q 31.953 49.5 30.641 49.5 Q 29.328 49.5 28.428 48.863 A 2.419 2.419 0 0 1 28.063 48.544 A 3.598 3.598 0 0 1 27.228 46.763 Q 26.928 45.3 26.103 41.025 A 198.298 198.298 0 0 0 24.922 35.168 Q 24.078 31.359 23.703 31.125 A 7.285 7.285 0 0 0 21.763 30.581 A 62.365 62.365 0 0 0 17.741 30 A 129.313 129.313 0 0 0 12.769 29.486 A 24.073 24.073 0 0 0 11.028 29.4 Q 9.378 29.4 9.078 29.7 A 4.011 4.011 0 0 0 8.342 31.289 Q 7.147 35.156 5.403 47.925 A 2.386 2.386 0 0 1 2.633 49.35 A 8.937 8.937 0 0 1 2.553 49.35 Q 0.003 49.35 0.003 47.175 Q 0.003 41.775 3.978 26.55 Q 6.839 15.592 9.001 9.957 A 33.248 33.248 0 0 1 10.578 6.375 A 16.571 16.571 0 0 1 14.101 1.496 A 5.333 5.333 0 0 1 17.628 0 Z M 17.328 8.325 A 2.57 2.57 0 0 0 15.911 9.783 Q 15.092 11.126 13.965 13.706 A 86.33 86.33 0 0 0 13.428 14.962 A 90.447 90.447 0 0 0 11.437 20.073 Q 10.653 22.338 10.653 23.175 Q 10.653 23.55 10.803 23.7 Q 11.403 24.3 15.528 24.75 A 103.925 103.925 0 0 0 19.889 25.156 A 18.448 18.448 0 0 0 21.003 25.2 Q 22.353 25.2 22.503 25.013 Q 22.653 24.825 22.653 23.813 Q 22.653 22.942 21.158 17.475 A 342.259 342.259 0 0 0 20.628 15.563 A 45.639 45.639 0 0 0 19.027 10.679 Q 18.056 8.325 17.328 8.325 Z`;

      // Stroke 1: Left diagonal (from top center down left side) - tracing path
      const leftDiagonal = `M 17.628 0 Q 19.503 0 20.778 1.65 A 18.361 18.361 0 0 1 22.651 5.059 A 71.245 71.245 0 0 1 24.078 8.475 A 101.152 101.152 0 0 1 27.01 17.471 Q 29.76 27.255 32.431 41.883 A 504.275 504.275 0 0 1 33.303 46.8 Q 33.378 47.1 33.378 47.663 Q 33.378 48.225 32.666 48.863 Q 31.953 49.5 30.641 49.5 Q 29.328 49.5 28.428 48.863 A 2.419 2.419 0 0 1 28.063 48.544 A 3.598 3.598 0 0 1 27.228 46.763 Q 26.928 45.3 26.103 41.025 A 198.298 198.298 0 0 0 24.922 35.168 Q 24.078 31.359 23.703 31.125 A 7.285 7.285 0 0 0 21.763 30.581 A 62.365 62.365 0 0 0 17.741 30 A 129.313 129.313 0 0 0 12.769 29.486 A 24.073 24.073 0 0 0 11.028 29.4 Q 9.378 29.4 9.078 29.7 A 4.011 4.011 0 0 0 8.342 31.289 Q 7.147 35.156 5.403 47.925 A 2.386 2.386 0 0 1 2.633 49.35 A 8.937 8.937 0 0 1 2.553 49.35 Q 0.003 49.35 0.003 47.175 Q 0.003 41.775 3.978 26.55 Q 6.839 15.592 9.001 9.957 A 33.248 33.248 0 0 1 10.578 6.375 A 16.571 16.571 0 0 1 14.101 1.496 A 5.333 5.333 0 0 1 17.628 0`;

      // Stroke 1 fill: Left side of A (from center line to left edge)
      const leftDiagonalFill = `M 17.628 0 Q 19.503 0 20.778 1.65 A 18.361 18.361 0 0 1 22.651 5.059 A 71.245 71.245 0 0 1 24.078 8.475 A 101.152 101.152 0 0 1 27.01 17.471 Q 29.76 27.255 32.431 41.883 A 504.275 504.275 0 0 1 33.303 46.8 Q 33.378 47.1 33.378 47.663 Q 33.378 48.225 32.666 48.863 Q 31.953 49.5 30.641 49.5 Q 29.328 49.5 28.428 48.863 A 2.419 2.419 0 0 1 28.063 48.544 A 3.598 3.598 0 0 1 27.228 46.763 Q 26.928 45.3 26.103 41.025 A 198.298 198.298 0 0 0 24.922 35.168 Q 24.078 31.359 23.703 31.125 A 7.285 7.285 0 0 0 21.763 30.581 A 62.365 62.365 0 0 0 17.741 30 A 129.313 129.313 0 0 0 12.769 29.486 A 24.073 24.073 0 0 0 11.028 29.4 Q 9.378 29.4 9.078 29.7 A 4.011 4.011 0 0 0 8.342 31.289 Q 7.147 35.156 5.403 47.925 A 2.386 2.386 0 0 1 2.633 49.35 A 8.937 8.937 0 0 1 2.553 49.35 Q 0.003 49.35 0.003 47.175 Q 0.003 41.775 3.978 26.55 Q 6.839 15.592 9.001 9.957 A 33.248 33.248 0 0 1 10.578 6.375 A 16.571 16.571 0 0 1 14.101 1.496 A 5.333 5.333 0 0 1 17.628 0 Z`;

      // Stroke 2: Right diagonal (from top center down right side) - tracing path
      const rightDiagonal = leftDiagonal;

      // Stroke 2 fill: Right side of A (from center line to right edge)
      const rightDiagonalFill = `M 17.628 0 Q 19.503 0 20.778 1.65 A 18.361 18.361 0 0 1 22.651 5.059 A 71.245 71.245 0 0 1 24.078 8.475 A 101.152 101.152 0 0 1 27.01 17.471 Q 29.76 27.255 32.431 41.883 A 504.275 504.275 0 0 1 33.303 46.8 Q 33.378 47.1 33.378 47.663 Q 33.378 48.225 32.666 48.863 Q 31.953 49.5 30.641 49.5 Q 29.328 49.5 28.428 48.863 A 2.419 2.419 0 0 1 28.063 48.544 A 3.598 3.598 0 0 1 27.228 46.763 Q 26.928 45.3 26.103 41.025 A 198.298 198.298 0 0 0 24.922 35.168 Q 24.078 31.359 23.703 31.125 A 7.285 7.285 0 0 0 21.763 30.581 A 62.365 62.365 0 0 0 17.741 30 A 129.313 129.313 0 0 0 12.769 29.486 A 24.073 24.073 0 0 0 11.028 29.4 Q 9.378 29.4 9.078 29.7 A 4.011 4.011 0 0 0 8.342 31.289 Q 7.147 35.156 5.403 47.925 A 2.386 2.386 0 0 1 2.633 49.35 A 8.937 8.937 0 0 1 2.553 49.35 Q 0.003 49.35 0.003 47.175 Q 0.003 41.775 3.978 26.55 Q 6.839 15.592 9.001 9.957 A 33.248 33.248 0 0 1 10.578 6.375 A 16.571 16.571 0 0 1 14.101 1.496 A 5.333 5.333 0 0 1 17.628 0 Z`;

      // Stroke 3: Horizontal bar (the inner path) - tracing path
      const horizontalBar = `M 17.328 8.325 A 2.57 2.57 0 0 0 15.911 9.783 Q 15.092 11.126 13.965 13.706 A 86.33 86.33 0 0 0 13.428 14.962 A 90.447 90.447 0 0 0 11.437 20.073 Q 10.653 22.338 10.653 23.175 Q 10.653 23.55 10.803 23.7 Q 11.403 24.3 15.528 24.75 A 103.925 103.925 0 0 0 19.889 25.156 A 18.448 18.448 0 0 0 21.003 25.2 Q 22.353 25.2 22.503 25.013 Q 22.653 24.825 22.653 23.813 Q 22.653 22.942 21.158 17.475 A 342.259 342.259 0 0 0 20.628 15.563 A 45.639 45.639 0 0 0 19.027 10.679 Q 18.056 8.325 17.328 8.325`;

      // Stroke 3 fill: Horizontal bar area
      const horizontalBarFill = `M 17.328 8.325 A 2.57 2.57 0 0 0 15.911 9.783 Q 15.092 11.126 13.965 13.706 A 86.33 86.33 0 0 0 13.428 14.962 A 90.447 90.447 0 0 0 11.437 20.073 Q 10.653 22.338 10.653 23.175 Q 10.653 23.55 10.803 23.7 Q 11.403 24.3 15.528 24.75 A 103.925 103.925 0 0 0 19.889 25.156 A 18.448 18.448 0 0 0 21.003 25.2 Q 22.353 25.2 22.503 25.013 Q 22.653 24.825 22.653 23.813 Q 22.653 22.942 21.158 17.475 A 342.259 342.259 0 0 0 20.628 15.563 A 45.639 45.639 0 0 0 19.027 10.679 Q 18.056 8.325 17.328 8.325 Z`;

      // Center the scaled viewBox
      const scaledWidth = viewBoxA.width * scale;
      const scaledHeight = viewBoxA.height * scale;
      const offsetX = centerX - scaledWidth / 2;
      const offsetY = centerY - scaledHeight / 2;

      return [
        {
          pathData: leftDiagonal,
          fillPathData: leftDiagonalFill, // Fill only left side
          transform: { translateX: offsetX, translateY: offsetY, scale },
        },
        {
          pathData: rightDiagonal,
          fillPathData: rightDiagonalFill, // Fill only right side
          transform: { translateX: offsetX, translateY: offsetY, scale },
        },
        {
          pathData: horizontalBar,
          fillPathData: horizontalBarFill, // Fill only bar area
          transform: { translateX: offsetX, translateY: offsetY, scale },
        },
      ];
    } else if (displayLetter === 'a') {
      // EXACT Patrick Hand a path - viewBox: 0 0 26.106 35.857
      const viewBoxa = { width: 26.106, height: 35.857 };
      // Scale so viewBox height matches target font size
      const scale = targetFontSize / viewBoxa.height;
      
      // Stroke 1: Circle (the inner path - anti-clockwise from top) - tracing path
      const circlePath = `M 14.106 6.827 Q 9.831 6.827 7.731 9.302 Q 5.631 11.777 5.631 18.377 A 23.032 23.032 0 0 0 6.406 24.922 A 5.363 5.363 0 0 0 11.631 29.477 Q 13.206 29.477 15.119 28.052 Q 17.031 26.627 17.781 24.827 Q 19.206 20.777 19.206 15.977 A 20.463 20.463 0 0 0 18.582 10.354 A 7.21 7.21 0 0 0 18.044 9.002 Q 16.881 6.827 14.106 6.827`;

      // Stroke 1 fill: Circle area
      const circleFill = `M 14.106 6.827 Q 9.831 6.827 7.731 9.302 Q 5.631 11.777 5.631 18.377 A 23.032 23.032 0 0 0 6.406 24.922 A 5.363 5.363 0 0 0 11.631 29.477 Q 13.206 29.477 15.119 28.052 Q 17.031 26.627 17.781 24.827 Q 19.206 20.777 19.206 15.977 A 20.463 20.463 0 0 0 18.582 10.354 A 7.21 7.21 0 0 0 18.044 9.002 Q 16.881 6.827 14.106 6.827 Z`;

      // Stroke 2: Vertical line (the right side vertical stroke) - tracing path
      const verticalLine = `M 25.206 6.902 L 25.056 12.152 Q 24.981 14.627 24.981 17.027 L 26.106 33.977 A 2.193 2.193 0 0 1 23.581 35.786 A 11.639 11.639 0 0 1 22.281 35.852 L 21.194 35.852 Q 20.331 35.852 19.994 35.177 A 1.884 1.884 0 0 1 19.804 34.323 A 3.071 3.071 0 0 1 19.919 33.527 A 2.869 2.869 0 0 0 20.015 32.778 A 4.071 4.071 0 0 0 19.731 31.352 Q 16.281 35.027 10.581 35.027 A 9.517 9.517 0 0 1 0.89 26.763 A 32.156 32.156 0 0 1 0.006 18.677 A 31.337 31.337 0 0 1 1.147 9.663 A 15.466 15.466 0 0 1 3.419 4.952 Q 6.831 0.302 13.206 0.302 Q 16.206 0.302 19.206 1.352 Q 20.181 0.002 21.906 0.002 A 3.347 3.347 0 0 1 25.07 3.574 A 13.977 13.977 0 0 1 25.206 5.627 L 25.206 6.902`;

      // Stroke 2 fill: Vertical line area (the outer shape minus the circle)
      const verticalLineFill = `M 25.206 6.902 L 25.056 12.152 Q 24.981 14.627 24.981 17.027 L 26.106 33.977 A 2.193 2.193 0 0 1 23.581 35.786 A 11.639 11.639 0 0 1 22.281 35.852 L 21.194 35.852 Q 20.331 35.852 19.994 35.177 A 1.884 1.884 0 0 1 19.804 34.323 A 3.071 3.071 0 0 1 19.919 33.527 A 2.869 2.869 0 0 0 20.015 32.778 A 4.071 4.071 0 0 0 19.731 31.352 Q 16.281 35.027 10.581 35.027 A 9.517 9.517 0 0 1 0.89 26.763 A 32.156 32.156 0 0 1 0.006 18.677 A 31.337 31.337 0 0 1 1.147 9.663 A 15.466 15.466 0 0 1 3.419 4.952 Q 6.831 0.302 13.206 0.302 Q 16.206 0.302 19.206 1.352 Q 20.181 0.002 21.906 0.002 A 3.347 3.347 0 0 1 25.07 3.574 A 13.977 13.977 0 0 1 25.206 5.627 L 25.206 6.902 Z`;

      // Center the scaled viewBox
      const scaledWidth = viewBoxa.width * scale;
      const scaledHeight = viewBoxa.height * scale;
      const offsetX = centerX - scaledWidth / 2;
      const offsetY = centerY - scaledHeight / 2;

      return [
        {
          pathData: circlePath,
          fillPathData: circleFill, // Fill only circle area
          transform: { translateX: offsetX, translateY: offsetY, scale },
        },
        {
          pathData: verticalLine,
          fillPathData: verticalLineFill, // Fill vertical line area
          transform: { translateX: offsetX, translateY: offsetY, scale },
        },
      ];
    }
    return [];
  };


  // Create PanResponder for drawing
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      // Prevent drawing if max strokes reached
      if (strokeCount >= maxStrokes) {
        return;
      }
      
      const { locationX, locationY } = evt.nativeEvent;
      setIsDrawing(true);
      setCurrentPath([{ x: locationX, y: locationY }]);
    },
    onPanResponderMove: (evt) => {
      if (!isDrawing) return;
      // Prevent drawing if max strokes reached
      if (strokeCount >= maxStrokes) {
        setIsDrawing(false);
        return;
      }
      
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
    },
    onPanResponderRelease: () => {
      if (isDrawing && currentPath.length > 0 && strokeCount < maxStrokes) {
        setDrawingPaths((prev) => [...prev, currentPath]);
        setStrokeCount((prev) => prev + 1);
        setCurrentPath([]);
      }
      setIsDrawing(false);
    },
    onPanResponderTerminate: () => {
      if (isDrawing && currentPath.length > 0 && strokeCount < maxStrokes) {
        setDrawingPaths((prev) => [...prev, currentPath]);
        setStrokeCount((prev) => prev + 1);
        setCurrentPath([]);
      }
      setIsDrawing(false);
    },
  });

  const clearDrawing = () => {
    setDrawingPaths([]);
    setCurrentPath([]);
    setIsDrawing(false);
    setStrokeCount(0);
    completeAnim.setValue(0);
  };

  const handleClearPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleClearPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (!fontsLoaded) {
    return null;
  }

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
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        {/* Handwritten font letter template (background guide) */}
        <View style={styles.letterTemplateContainer} pointerEvents="none">
          <Text style={styles.letterTemplate}>{displayLetter}</Text>
        </View>

        {/* Drawing layer */}
        <Svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={styles.drawingLayer}
          pointerEvents="box-none"
        >
          {/* Render completed paths */}
          {drawingPaths.map((path, index) => (
            <Polyline
              key={`path-${index}`}
              points={path.map((p) => `${p.x},${p.y}`).join(' ')}
              stroke="#4A90E2"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* Render current path being drawn */}
          {currentPath.length > 0 && (
            <Polyline
              points={currentPath.map((p) => `${p.x},${p.y}`).join(' ')}
              stroke="#4A90E2"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>

      <View style={styles.controls}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearDrawing}
            onPressIn={handleClearPressIn}
            onPressOut={handleClearPressOut}
          >
            <Text style={styles.clearButtonText}>Skoon Vee</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Completion message at top */}
      {strokeCount >= maxStrokes && (
        <Animated.View
          style={[
            styles.completeContainer,
            {
              opacity: completeAnim,
              transform: [
                {
                  scale: completeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.completeText}>Klaar!</Text>
        </Animated.View>
      )}

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Strokes: {strokeCount} / {maxStrokes}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Soft pastel blue
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  canvasContainer: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  letterTemplateContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -CANVAS_HEIGHT * 0.08 }], // Move letter up to better center it
    zIndex: 1,
  },
  letterTemplate: {
    fontSize: CANVAS_HEIGHT * 0.85,
    fontFamily: 'TeachersPet',
    color: '#DDD',
    opacity: 0.5,
    textAlign: 'center',
  },
  drawingLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  controls: {
    width: '100%',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'TeachersPet',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 18,
    color: '#7F8C8D',
    fontWeight: '500',
    fontFamily: 'TeachersPet',
  },
  completeContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  completeText: {
    fontSize: 26,
    color: '#27AE60',
    fontWeight: '600',
    fontFamily: 'TeachersPet',
  },
});

export default FormationScreen;
