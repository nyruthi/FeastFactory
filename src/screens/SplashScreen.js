import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import Logo from '../components/Logo';

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60 }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => navigation.replace('Onboarding'), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.primary, '#A52020']} style={st.root}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Logo size={160} showText={false} />
        <Text style={st.title}>The Feast Factory</Text>
        <Text style={st.sub}>India's Premier Food Catering App</Text>
      </Animated.View>
      <Text style={st.tagline}>Crafted with Flavour, Sealed with Love</Text>
    </LinearGradient>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoBox: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
  logoText: { fontSize: 36, fontWeight: '900', color: Colors.primaryDark },
  title: { fontSize: 30, fontWeight: '900', color: Colors.white, textAlign: 'center', letterSpacing: 1 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8 },
  tagline: { position: 'absolute', bottom: 48, fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },
});
