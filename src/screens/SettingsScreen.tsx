import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Animated,
} from 'react-native';

// Configuration constants
const PRIVACY_POLICY_URL = 'https://your-domain.com/privacy-policy';
const TERMS_OF_USE_URL = 'https://your-domain.com/terms-of-use';
const EARLY_ACCESS_END_DATE = '1 January 2026';
const APP_VERSION = '1.0.0';
const ANNA_BOSCH_YOUTUBE_URL = 'https://www.youtube.com/@annabosch3695';
const EDU_AID_URL = 'https://edu-aid.co.za';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleOpenURL = async (url: string, label: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Unable to open ${label}. Please check the URL.`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${label}. Please try again later.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Early Access Notice */}
        <View style={styles.section}>
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeTitle}>Early Access</Text>
            <Text style={styles.noticeText}>
              You're using an early-access version. Free access ends on {EARLY_ACCESS_END_DATE}.
            </Text>
          </View>
        </View>

        {/* Legal Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.linkContainer}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenURL(PRIVACY_POLICY_URL, 'Privacy Policy')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.linkButton, styles.linkButtonLast]}
              onPress={() => handleOpenURL(TERMS_OF_USE_URL, 'Terms of Use')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Terms of Use</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>Klinkende Klanke</Text>
          </View>
        </View>

        {/* Credits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <View style={styles.creditContainer}>
            <Text style={styles.creditText}>
              Special thanks to <Text style={styles.creditName}>Anna A Bosch</Text> for creating the songs to make the app possible.
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenURL(ANNA_BOSCH_YOUTUBE_URL, 'Anna A Bosch YouTube')}
              activeOpacity={0.7}
            >
              <Text style={styles.creditLink}>Visit YouTube Channel ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.creditContainer}>
            <Text style={styles.creditText}>
              Special thanks to <Text style={styles.creditName}>Edu-Aid</Text> for allowing use of their fonts in our app.
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenURL(EDU_AID_URL, 'Edu-Aid')}
              activeOpacity={0.7}
            >
              <Text style={styles.creditLink}>Visit edu-aid.co.za ›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  noticeBanner: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    fontFamily: 'EduAidBold',
  },
  noticeText: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 22,
    fontFamily: 'EduAidSolid',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    fontFamily: 'EduAidBold',
  },
  linkContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  linkButtonLast: {
    borderBottomWidth: 0,
  },
  linkText: {
    fontSize: 18,
    color: '#4A90E2',
    fontFamily: 'EduAidSolid',
  },
  linkArrow: {
    fontSize: 24,
    color: '#4A90E2',
    fontFamily: 'EduAidBold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontFamily: 'EduAidSolid',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'EduAidBold',
  },
  creditContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  creditText: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'EduAidSolid',
  },
  creditName: {
    fontWeight: 'bold',
    color: '#2C3E50',
    fontFamily: 'EduAidBold',
  },
  creditLink: {
    fontSize: 16,
    color: '#4A90E2',
    fontFamily: 'EduAidSolid',
  },
});

export default SettingsScreen;

