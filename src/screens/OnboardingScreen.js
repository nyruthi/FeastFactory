import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  { emoji: '🍽️', title: 'Curated Platters', desc: 'Choose from 50+ pre-curated menus for every occasion — parties, weddings, corporate events and more.' },
  { emoji: '🎯', title: 'Fully Customizable', desc: 'Pick your guest count, occasion, meal type and budget. We suggest the perfect platter for you.' },
  { emoji: '🚚', title: 'Hot & On Time', desc: 'Premium packaging with heat retention up to 4 hours. Delivered fresh to your doorstep.' },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  const next = () => {
    if (index < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
      setIndex(i => i + 1);
    } else {
      navigation.replace('Main');
    }
  };

  return (
    <View style={st.root}>
      <ScrollView
        ref={scrollRef}
        horizontal pagingEnabled scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {SLIDES.map((s, i) => (
          <LinearGradient key={i} colors={[Colors.primaryDark, Colors.primary]} style={st.slide}>
            <Text style={st.emoji}>{s.emoji}</Text>
            <Text style={st.title}>{s.title}</Text>
            <Text style={st.desc}>{s.desc}</Text>
          </LinearGradient>
        ))}
      </ScrollView>
      <View style={st.footer}>
        <View style={st.dots}>
          {SLIDES.map((_, i) => <View key={i} style={[st.dot, i === index && st.dotActive]} />)}
        </View>
        <TouchableOpacity style={st.btn} onPress={next}>
          <Text style={st.btnTxt}>{index === SLIDES.length - 1 ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
        {index < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => navigation.replace('Main')} style={st.skip}>
            <Text style={st.skipTxt}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primaryDark },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.white, textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 16, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 24 },
  footer: { backgroundColor: Colors.primaryDark, paddingHorizontal: 24, paddingBottom: 48, paddingTop: 20, alignItems: 'center', gap: 16 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: Colors.secondary, width: 24 },
  btn: { width: '100%', backgroundColor: Colors.secondary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnTxt: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark },
  skip: { paddingVertical: 8 },
  skipTxt: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});
