import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../theme/colors';

export default function Logo({ size = 80, showText = true }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/52210.jpg')}
        style={{ width: size, height: size * 1.4 }}
        resizeMode="contain"
      />

      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>THE FEAST FACTORY</Text>
          <Text style={styles.tagline}>GREAT FOOD. LASTING IMPRESSIONS.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 10,
    color: Colors.secondary,
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
});
