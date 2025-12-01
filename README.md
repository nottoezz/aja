# Afrikaans Phonics MVP

A React Native Expo app for teaching Afrikaans phonics, similar to Jolly Phonics. This MVP focuses on the letter A.

## Features

- **Home Screen**: Clean alphabet grid (currently showing letter A)
- **Story Card**: Short Afrikaans story related to the letter
- **Formation Card**: Interactive letter tracing functionality
- **Song Card**: Song lyrics with audio playback
- **Action Card**: Visual action image for the letter

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on iOS simulator:
```bash
npm run ios
```

4. Run on Android emulator:
```bash
npm run android
```

## Project Structure

```
├── App.tsx                 # Main app entry with navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Alphabet grid home screen
│   │   └── LetterDetailScreen.tsx  # Letter detail with tabs
│   └── components/
│       ├── StoryCard.tsx           # Story display component
│       ├── FormationCard.tsx       # Letter tracing component
│       ├── SongCard.tsx            # Song with audio player
│       └── ActionCard.tsx          # Action image display
├── assets/
│   ├── audio/
│   │   └── letter-a.wav           # Audio file for letter A
│   └── images/
│       └── letter-a-action.png     # Action image for letter A
├── actions/                        # Original action images
├── songs/                          # Original song files
└── words/                          # Original lyrics files
```

## Technologies Used

- React Native with Expo
- React Navigation
- expo-av (for audio playback)
- react-native-svg (for letter tracing)

