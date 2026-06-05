import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const MENU_ITEMS = [
  { icon: '📦', label: 'My Orders', desc: 'View order history' },
  { icon: '📍', label: 'Saved Addresses', desc: 'Manage delivery addresses' },
  { icon: '💰', label: 'Cashback Coins', desc: '0 coins available' },
  { icon: '🎧', label: 'Support', desc: '24/7 customer support' },
  { icon: '⭐', label: 'Rate the App', desc: 'Share your feedback' },
  { icon: 'ℹ️', label: 'About', desc: 'Version 1.0.0' },
];

export default function ProfileScreen({ navigation }) {
  const { activeOrder, platters } = useCart();
  return (
    <SafeAreaView style={st.root} edges={['top']}>
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={st.header}>
        <View style={st.avatar}><Text style={st.avatarTxt}>N</Text></View>
        <Text style={st.name}>Nyruthi</Text>
        <Text style={st.phone}>nyruthi.rdy@gmail.com</Text>
        <View style={st.coinsBadge}>
          <Text style={st.coinsTxt}>🪙 0 coins · BRONZE</Text>
        </View>
      </LinearGradient>
      <ScrollView>
        {activeOrder && (
          <TouchableOpacity style={st.activeOrderCard} onPress={() => navigation.navigate('Tracking')}>
            <Text style={st.activeOrderIcon}>🚚</Text>
            <View style={{ flex: 1 }}>
              <Text style={st.activeOrderTitle}>Active Order #{activeOrder.orderId}</Text>
              <Text style={st.activeOrderSub}>Tap to track your order</Text>
            </View>
            <Text style={st.activeOrderArrow}>›</Text>
          </TouchableOpacity>
        )}
        <View style={st.menuList}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={[st.menuItem, i < MENU_ITEMS.length - 1 && st.menuItemBorder]}>
              <Text style={st.menuIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={st.menuLabel}>{item.label}</Text>
                <Text style={st.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={st.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTxt: { fontSize: 28, fontWeight: '900', color: Colors.primaryDark },
  name: { fontSize: 20, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  phone: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  coinsBadge: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  coinsTxt: { fontSize: 13, color: Colors.secondary, fontWeight: '700' },
  activeOrderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, margin: 16, borderRadius: 16, padding: 16, gap: 12, borderWidth: 2, borderColor: Colors.primary },
  activeOrderIcon: { fontSize: 28 },
  activeOrderTitle: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  activeOrderSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  activeOrderArrow: { fontSize: 22, color: Colors.primary },
  menuList: { backgroundColor: Colors.surface, margin: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { fontSize: 22 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  menuDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  menuArrow: { fontSize: 20, color: Colors.textLight },
});
