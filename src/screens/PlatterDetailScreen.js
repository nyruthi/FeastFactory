import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { PLATTERS } from '../data/platters';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function PlatterDetailScreen({ route, navigation }) {
  const { platterId } = route.params;
  const platter = PLATTERS.find(p => p.id === platterId);
  const { requirements, platters } = useCart();
  const initGuests = parseInt(requirements?.guestCount) || 10;
  const [sepVegNonVeg, setSepVegNonVeg] = useState(true);
  const [guestCount, setGuestCount] = useState(initGuests);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const cartCount = platters.length;
  const toggleAddon = (a) => setSelectedAddons(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const eventDate = requirements?.date ? `${requirements.date.getDate()} ${MONTHS[requirements.date.getMonth()]}` : '';
  const progressPct = Math.min(100, (guestCount / Math.max(initGuests, 1)) * 100);

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}><Text style={st.backIcon}>‹</Text></TouchableOpacity>
          <View style={st.headerMid}>
            <Text style={st.headerTitle} numberOfLines={1}>{platter.name}</Text>
            <Text style={st.headerSub}>{eventDate} • {requirements?.mealType} • {guestCount} pax</Text>
          </View>
          <View style={st.headerRight}>
            <TouchableOpacity style={st.iconBtn} onPress={() => navigation.navigate('Cart')}>
              <Text>🛒</Text>
              {cartCount > 0 && <View style={st.cartBadge}><Text style={st.cartBadgeTxt}>{cartCount}</Text></View>}
            </TouchableOpacity>
          </View>
        </View>

        <View style={st.hero}>
          <Text style={st.heroEmoji}>📦</Text>
          {platter.features.map((f, i) => (
            <View key={i} style={[st.featureTag, i === 0 ? st.ftLeft : i === 1 ? st.ftRight : st.ftBottom]}>
              <Text style={st.featureTagTxt}>{f}</Text>
            </View>
          ))}
          <TouchableOpacity style={st.aboutBtn}><Text style={st.aboutBtnTxt}>📋 About Delivery Box</Text></TouchableOpacity>
        </View>

        <View style={st.infoBar}>
          <Text style={st.infoItem}>📅 Order 1 day prior</Text>
          <View style={st.infoDivider} />
          <Text style={st.infoItem}>👥 Min. {platter.minGuests} guests</Text>
        </View>

        <View style={st.summaryRow}>
          <View style={{ flex: 1 }}>
            <Text style={st.summaryName}>{platter.name}</Text>
            <Text style={st.summaryPrice}>{platter.itemCount} items <Text style={st.summaryAmt}>@₹{platter.pricePerPerson}</Text><Text style={st.summaryPer}>/person</Text></Text>
          </View>
          <TouchableOpacity style={st.callBtn}><Text style={st.callBtnTxt}>🎧 Request a call</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.badgesRow} contentContainerStyle={st.badgesContent}>
          {['Best Price', 'Pre-curated platter', 'No guesswork', 'Delivery included'].map(b => (
            <View key={b} style={st.featureBadge}><Text style={st.featureBadgeTxt}>✓ {b}</Text></View>
          ))}
        </ScrollView>

        <View style={st.toggleRow}>
          <Text style={st.toggleLbl}>Separate veg & non-veg menu</Text>
          <Switch value={sepVegNonVeg} onValueChange={setSepVegNonVeg} trackColor={{ false: Colors.border, true: Colors.secondary }} thumbColor={Colors.white} />
        </View>

        <View style={st.guestSection}>
          <View style={st.guestRow}>
            <View>
              <Text style={st.guestLbl}>Guest count</Text>
              <Text style={st.guestTotal}>{requirements?.guestCount || guestCount} Guests total</Text>
            </View>
            <View style={st.stepper}>
              <TouchableOpacity style={st.stepBtn} onPress={() => setGuestCount(c => Math.max(platter.minGuests, c - 1))}><Text style={st.stepBtnTxt}>−</Text></TouchableOpacity>
              <Text style={st.stepCount}>{guestCount}</Text>
              <TouchableOpacity style={st.stepBtn} onPress={() => setGuestCount(c => c + 1)}><Text style={st.stepBtnTxt}>+</Text></TouchableOpacity>
            </View>
          </View>
          <View style={st.progressBg}><View style={[st.progressFill, { width: `${progressPct}%` }]} /></View>
        </View>

        <View style={st.whyCard}>
          <Text style={st.whyTitle}>Why this platter fits</Text>
          <View style={st.whyRow}>
            <Text style={st.whyMascot}>🐘</Text>
            <Text style={st.whyTxt}>{platter.whyItFits}</Text>
          </View>
        </View>

        <View style={st.menuSection}>
          {platter.categories.map(cat => (
            <View key={cat.name} style={st.catBlock}>
              <View style={st.catHeader}>
                <Text style={st.catName}>{cat.name}</Text>
                <Text style={st.catCount}>{cat.count} item{cat.count > 1 ? 's' : ''}</Text>
              </View>
              {cat.items.map(item => (
                <View key={item.name} style={st.menuItem}>
                  <View style={[st.vegDot, { backgroundColor: item.isVeg ? Colors.veg : Colors.nonVeg }]} />
                  <View style={st.menuItemInfo}>
                    <Text style={st.menuItemName}>{item.name}</Text>
                    <Text style={st.menuItemSub}>Common for all guests</Text>
                  </View>
                  {item.replaceable && <TouchableOpacity style={st.replaceBtn}><Text style={st.replaceBtnTxt}>Replace</Text></TouchableOpacity>}
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={st.footer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.addonsScroll} contentContainerStyle={st.addonsContent}>
          {platter.addons.map(a => (
            <TouchableOpacity key={a} style={[st.addonChip, selectedAddons.includes(a) && st.addonChipSel]} onPress={() => toggleAddon(a)}>
              <Text style={[st.addonTxt, selectedAddons.includes(a) && st.addonTxtSel]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={st.continueBtn} onPress={() => navigation.navigate('FillDetails', { platterId: platter.id, guestCount, sepVegNonVeg, addons: selectedAddons })}>
          <Text style={st.continueBtnTxt}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 8 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  headerMid: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.primary, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  cartBadgeTxt: { fontSize: 9, fontWeight: '900', color: Colors.white },
  hero: { backgroundColor: Colors.primaryDark, paddingVertical: 40, alignItems: 'center', position: 'relative', minHeight: 200 },
  heroEmoji: { fontSize: 80 },
  featureTag: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  ftLeft: { top: 24, left: 16 }, ftRight: { top: 64, right: 16 }, ftBottom: { bottom: 52, left: 24 },
  featureTagTxt: { fontSize: 11, color: Colors.white, fontWeight: '600' },
  aboutBtn: { position: 'absolute', bottom: 16, left: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  aboutBtnTxt: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  infoBar: { flexDirection: 'row', backgroundColor: Colors.surface, paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  infoItem: { flex: 1, fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  infoDivider: { width: 1, height: 16, backgroundColor: Colors.border },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: Colors.surface, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  summaryName: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  summaryPrice: { fontSize: 14, color: Colors.textSecondary },
  summaryAmt: { color: Colors.primary, fontWeight: '700' },
  summaryPer: { color: Colors.textSecondary },
  callBtn: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12 },
  callBtnTxt: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
  badgesRow: { flexGrow: 0, backgroundColor: Colors.primary },
  badgesContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  featureBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  featureBadgeTxt: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  toggleLbl: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  guestSection: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  guestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  guestLbl: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  guestTotal: { fontSize: 12, color: Colors.textSecondary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  stepBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  stepBtnTxt: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  stepCount: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, minWidth: 28, textAlign: 'center' },
  progressBg: { height: 6, backgroundColor: Colors.error, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.veg, borderRadius: 3 },
  whyCard: { margin: 16, borderWidth: 1.5, borderColor: Colors.primaryLight, borderRadius: 16, padding: 14, backgroundColor: '#FFF8F8' },
  whyTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  whyMascot: { fontSize: 28 },
  whyTxt: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  menuSection: { backgroundColor: Colors.surface, marginTop: 8 },
  catBlock: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.background },
  catName: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  catCount: { fontSize: 12, color: Colors.textSecondary },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.border, gap: 10 },
  vegDot: { width: 16, height: 16, borderRadius: 2, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)' },
  menuItemInfo: { flex: 1 },
  menuItemName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  menuItemSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  replaceBtn: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  replaceBtnTxt: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  footer: { borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface, paddingTop: 10, paddingBottom: 16, paddingHorizontal: 16 },
  addonsScroll: { flexGrow: 0, marginBottom: 10 },
  addonsContent: { gap: 8, paddingVertical: 2 },
  addonChip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border },
  addonChipSel: { borderColor: Colors.primary, backgroundColor: '#FFF0F0' },
  addonTxt: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  addonTxtSel: { color: Colors.primary, fontWeight: '700' },
  continueBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  continueBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
});
