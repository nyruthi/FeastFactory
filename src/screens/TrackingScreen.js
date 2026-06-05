import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const STEPS = [
  { icon: '✅', label: 'Order Confirmed', desc: 'Your order has been placed successfully' },
  { icon: '👨‍🍳', label: 'Preparing', desc: 'Our chefs are preparing your feast' },
  { icon: '📦', label: 'Packed', desc: 'Order packed in premium containers' },
  { icon: '🚚', label: 'Out for Delivery', desc: 'Your order is on the way' },
  { icon: '🏠', label: 'Delivered', desc: 'Enjoy your feast!' },
];

export default function TrackingScreen({ navigation }) {
  const { activeOrder, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(s => s < STEPS.length - 1 ? s + 1 : s);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const orderId = activeOrder?.orderId || `FF${Date.now().toString().slice(-6)}`;

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={st.header}>
        <Text style={st.headerTitle}>Order Tracking</Text>
        <Text style={st.orderId}>Order #{orderId}</Text>
      </LinearGradient>
      <ScrollView style={st.body} contentContainerStyle={{ padding: 20 }}>
        <View style={st.statusCard}>
          <Text style={st.statusEmoji}>{STEPS[currentStep].icon}</Text>
          <Text style={st.statusLabel}>{STEPS[currentStep].label}</Text>
          <Text style={st.statusDesc}>{STEPS[currentStep].desc}</Text>
        </View>
        <View style={st.timeline}>
          {STEPS.map((step, i) => (
            <View key={i} style={st.timelineRow}>
              <View style={st.timelineLeft}>
                <View style={[st.timelineDot, i <= currentStep && st.timelineDotActive]}>
                  <Text style={st.timelineDotTxt}>{i <= currentStep ? '✓' : ''}</Text>
                </View>
                {i < STEPS.length - 1 && <View style={[st.timelineLine, i < currentStep && st.timelineLineActive]} />}
              </View>
              <View style={st.timelineContent}>
                <Text style={[st.timelineLabel, i <= currentStep && st.timelineLabelActive]}>{step.icon} {step.label}</Text>
                {i === currentStep && <Text style={st.timelineDesc}>{step.desc}</Text>}
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity style={st.homeBtn} onPress={() => { clearCart(); navigation.replace('Main'); }}>
          <Text style={st.homeBtnTxt}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingVertical: 24, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.white },
  orderId: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  body: { flex: 1 },
  statusCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  statusEmoji: { fontSize: 48, marginBottom: 12 },
  statusLabel: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  statusDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  timeline: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  timelineRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  timelineLeft: { alignItems: 'center', width: 28 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  timelineDotActive: { backgroundColor: Colors.primary },
  timelineDotTxt: { fontSize: 10, fontWeight: '900', color: Colors.white },
  timelineLine: { width: 2, flex: 1, minHeight: 28, backgroundColor: Colors.border, marginVertical: 4 },
  timelineLineActive: { backgroundColor: Colors.primary },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  timelineLabelActive: { color: Colors.textPrimary, fontWeight: '800' },
  timelineDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  homeBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  homeBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
});
