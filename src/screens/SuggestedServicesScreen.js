import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { SERVICES } from '../data/platters';

export default function SuggestedServicesScreen({ navigation }) {
  const { setSelectedService } = useCart();
  const [selected, setSelected] = useState(SERVICES[0].id);

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}><Text style={st.backIcon}>‹</Text></TouchableOpacity>
          <Text style={st.headerTitle}>Choose service type</Text>
          <TouchableOpacity style={st.supportBtn}><Text>🎧</Text></TouchableOpacity>
        </View>
        <View style={st.sheet}>
          <View style={st.handle} />
          <Text style={st.title}>Suggested services</Text>
          <Text style={st.sub}>Top recommended service</Text>
          <Text style={st.iWant}>I Want</Text>
          {SERVICES.map(svc => {
            const sel = selected === svc.id;
            return (
              <TouchableOpacity key={svc.id} style={[st.card, sel && st.cardSel]} onPress={() => setSelected(svc.id)} activeOpacity={0.85}>
                <View style={st.svcTag}><Text style={st.svcTagTxt}>{svc.name}</Text></View>
                <View style={st.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={st.cardTitle}>{svc.tagline}</Text>
                    <View style={st.idealTag}><Text style={st.idealTxt}>Ideal For {svc.ideal}</Text></View>
                    <Text style={st.priceLabel}>Top matched menu</Text>
                    <Text style={st.price}>@₹{svc.priceFrom}<Text style={st.pricePer}>/person</Text></Text>
                  </View>
                  <View style={st.cardRight}>
                    <Text style={st.svcEmoji}>{svc.emoji}</Text>
                    <View style={[st.radio, sel && st.radioSel]}>{sel && <View style={st.radioDot} />}</View>
                  </View>
                </View>
                {sel && svc.recommended && <View style={st.recRow}><Text style={st.recTxt}>✦ Recommended service</Text></View>}
              </TouchableOpacity>
            );
          })}
          <View style={st.noteRow}><Text style={st.noteTxt}>ℹ️  You can change service later also</Text></View>
        </View>
      </ScrollView>
      <View style={st.footer}>
        <TouchableOpacity style={st.viewBtn} onPress={() => { setSelectedService(selected); navigation.navigate('Platters'); }}>
          <Text style={st.viewBtnTxt}>View platters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  supportBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1, padding: 20, marginTop: 8 },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  sub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
  iWant: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  card: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 16, padding: 16, marginBottom: 12, position: 'relative', overflow: 'hidden' },
  cardSel: { borderColor: Colors.primary, backgroundColor: '#FFF8F8' },
  svcTag: { position: 'absolute', top: 0, left: 0, backgroundColor: '#F0E6FF', paddingHorizontal: 10, paddingVertical: 4, borderBottomRightRadius: 12 },
  svcTagTxt: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  idealTag: { backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 },
  idealTxt: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  priceLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  price: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  pricePer: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
  cardRight: { alignItems: 'center', gap: 12 },
  svcEmoji: { fontSize: 36 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: Colors.primary },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: Colors.primary },
  recRow: { backgroundColor: '#FFF0F0', marginTop: 10, marginHorizontal: -16, marginBottom: -16, paddingVertical: 8, paddingHorizontal: 16 },
  recTxt: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  noteRow: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 12, marginTop: 4 },
  noteTxt: { fontSize: 13, color: Colors.veg, fontWeight: '500' },
  footer: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface },
  viewBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  viewBtnTxt: { fontSize: 16, fontWeight: '800', color: Colors.white },
});
