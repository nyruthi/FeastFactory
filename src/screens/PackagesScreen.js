import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

const PACKAGES = [
  { id: 'delivery_box', name: 'Delivery Box', emoji: '📦', tagline: 'Food in shared boxes for gatherings', price: 598, minGuests: 10, tag: 'Best Value', color: Colors.primary, features: ['Shared boxes', 'Premium packaging', 'Heat retention 2-4 hrs', '10-120 guests'] },
  { id: 'meal_box', name: 'Meal Box', emoji: '🍱', tagline: 'One box per person for corporate events', price: 479, minGuests: 10, tag: 'Popular', color: '#D4A017', features: ['Individual boxes', 'Hygienic sealing', 'Easy to carry', '10+ guests'] },
  { id: 'bbq_grill', name: 'BBQ & Grill', emoji: '🔥', tagline: 'Live grilling at your venue', price: 626, minGuests: 15, tag: 'Outdoor', color: '#E64A19', features: ['Live grilling', 'Seasoned chefs', 'Premium ingredients', '15+ guests'] },
];

export default function PackagesScreen({ navigation }) {
  return (
    <SafeAreaView style={st.root} edges={['top']}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
          <Text style={st.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={st.headerTitle}>Our Packages</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {PACKAGES.map(pkg => (
          <View key={pkg.id} style={[st.card, { borderColor: pkg.color }]}>
            {pkg.tag && <View style={[st.tag, { backgroundColor: pkg.color }]}><Text style={st.tagTxt}>{pkg.tag}</Text></View>}
            <View style={st.cardTop}>
              <Text style={st.emoji}>{pkg.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[st.name, { color: pkg.color }]}>{pkg.name}</Text>
                <Text style={st.tagline}>{pkg.tagline}</Text>
              </View>
              <View style={st.priceBlock}>
                <Text style={st.priceFrom}>from</Text>
                <Text style={[st.price, { color: pkg.color }]}>₹{pkg.price}</Text>
                <Text style={st.pricePer}>/person</Text>
              </View>
            </View>
            <View style={st.features}>
              {pkg.features.map(f => <View key={f} style={st.featureRow}><Text style={[st.featureDot, { color: pkg.color }]}>✓ </Text><Text style={st.featureTxt}>{f}</Text></View>)}
            </View>
            <TouchableOpacity style={[st.btn, { backgroundColor: pkg.color }]} onPress={() => navigation.navigate('FindMenu')}>
              <Text style={st.btnTxt}>Order Now →</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1.5, position: 'relative', overflow: 'hidden' },
  tag: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagTxt: { fontSize: 10, fontWeight: '800', color: Colors.white },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  emoji: { fontSize: 36 },
  name: { fontSize: 19, fontWeight: '800', marginBottom: 4 },
  tagline: { fontSize: 12, color: Colors.textSecondary },
  priceBlock: { alignItems: 'flex-end' },
  priceFrom: { fontSize: 11, color: Colors.textLight },
  price: { fontSize: 26, fontWeight: '900' },
  pricePer: { fontSize: 11, color: Colors.textSecondary },
  features: { marginBottom: 14, gap: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureDot: { fontSize: 13, fontWeight: '700' },
  featureTxt: { fontSize: 12, color: Colors.textSecondary },
  btn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnTxt: { fontSize: 14, fontWeight: '800', color: Colors.white },
});
