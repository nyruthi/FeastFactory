import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { PLATTERS, SERVICES } from '../data/platters';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const BUDGET_RANGES = [
  { label: '₹300-400', min: 300, max: 400 }, { label: '₹400-500', min: 400, max: 500 },
  { label: '₹500-600', min: 500, max: 600 }, { label: '₹700-800', min: 700, max: 800 },
];

export default function PlattersScreen({ navigation }) {
  const { requirements, selectedService, platters } = useCart();
  const [activeTab, setActiveTab] = useState(selectedService || 'delivery_box');
  const [vegOnly, setVegOnly] = useState(false);
  const [budgetRange, setBudgetRange] = useState(null);
  const cartCount = platters.length;
  const filtered = PLATTERS.filter(p => {
    if (p.serviceType !== activeTab) return false;
    if (budgetRange && (p.pricePerPerson < budgetRange.min || p.pricePerPerson > budgetRange.max)) return false;
    return true;
  });
  const service = SERVICES.find(s => s.id === activeTab);
  const eventLabel = requirements ? `${requirements.date ? requirements.date.getDate() + ' ' + MONTHS[requirements.date.getMonth()] : ''}, ${requirements.mealType || ''}` : '';

  return (
    <SafeAreaView style={st.root} edges={['top']}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}><Text style={st.backIcon}>‹</Text></TouchableOpacity>
        <TouchableOpacity style={st.eventPill}>
          <Text style={st.eventDate} numberOfLines={1}>{eventLabel}</Text>
          <Text style={st.eventOcc} numberOfLines={1}> · {requirements?.occasion || ''}</Text>
        </TouchableOpacity>
        <View style={st.headerRight}>
          <TouchableOpacity style={st.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={st.iconTxt}>🛒</Text>
            {cartCount > 0 && <View style={st.badge}><Text style={st.badgeTxt}>{cartCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={st.iconBtn}><Text style={st.iconTxt}>🎧</Text></TouchableOpacity>
        </View>
      </View>

      <View style={st.tabs}>
        {SERVICES.map(svc => (
          <TouchableOpacity key={svc.id} style={[st.tab, activeTab === svc.id && st.tabActive]} onPress={() => setActiveTab(svc.id)}>
            <Text style={[st.tabTxt, activeTab === svc.id && st.tabTxtActive]}>{svc.tabLabel}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={st.svcBar}>
        <Text style={st.svcBarTxt}>{service?.emoji}  {service?.tagline}, Min. {service?.minGuests} guests</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.filtersBar} contentContainerStyle={st.filtersContent}>
        <Text style={st.filterLbl}>Budget: </Text>
        {BUDGET_RANGES.map(r => (
          <TouchableOpacity key={r.label} style={[st.filterChip, budgetRange?.label === r.label && st.filterChipSel]} onPress={() => setBudgetRange(budgetRange?.label === r.label ? null : r)}>
            <Text style={[st.filterChipTxt, budgetRange?.label === r.label && st.filterChipTxtSel]}>{r.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[st.vegToggle, vegOnly && st.vegToggleOn]} onPress={() => setVegOnly(v => !v)}>
          <Text style={[st.vegToggleTxt, vegOnly && st.vegToggleTxtOn]}>🟢 Veg</Text>
        </TouchableOpacity>
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={st.empty}>
          <Text style={st.emptyEmoji}>🍽️</Text>
          <Text style={st.emptyTxt}>No platters match your filters</Text>
          <TouchableOpacity onPress={() => { setBudgetRange(null); setVegOnly(false); }}><Text style={st.clearTxt}>Clear filters</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered} horizontal keyExtractor={p => p.id}
          showsHorizontalScrollIndicator={false} contentContainerStyle={st.platterList}
          snapToInterval={312} decelerationRate="fast"
          renderItem={({ item: p }) => (
            <View style={st.platterCard}>
              {p.tag && <View style={st.platterTag}><Text style={st.platterTagTxt}>{p.tag}</Text></View>}
              <Text style={st.platterName}>{p.name}</Text>
              <View style={st.priceLine}>
                <Text style={st.platterPrice}>₹{p.pricePerPerson}</Text>
                <Text style={st.platterPricePer}> / person | Incl. packaging</Text>
              </View>
              <View style={st.customRow}>
                <View style={st.customChip}><Text style={st.customChipTxt}>✓ Adding items</Text></View>
                <View style={st.customChip}><Text style={st.customChipTxt}>✓ Changing items</Text></View>
              </View>
              <View style={st.categoryList}>
                {p.categories.slice(0, 6).map(cat => (
                  <View key={cat.name} style={st.catRow}>
                    <Text style={st.catDot}>•</Text>
                    <Text style={st.catTxt}>{cat.count} {cat.name}</Text>
                  </View>
                ))}
                {p.categories.length > 6 && <Text style={st.moreCats}>+ {p.categories.length - 6} more</Text>}
              </View>
              <TouchableOpacity style={st.viewItemsBtn} onPress={() => navigation.navigate('PlatterDetail', { platterId: p.id })}>
                <Text style={st.viewItemsBtnTxt}>View {p.itemCount} items</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 8 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  eventPill: { flex: 1, backgroundColor: Colors.background, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' },
  eventDate: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  eventOcc: { fontSize: 12, color: Colors.textSecondary },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconTxt: { fontSize: 18 },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.primary, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeTxt: { fontSize: 10, fontWeight: '900', color: Colors.white },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.primary },
  tabTxt: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  tabTxtActive: { color: Colors.primary, fontWeight: '800' },
  svcBar: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  svcBarTxt: { fontSize: 13, color: Colors.textSecondary },
  filtersBar: { flexGrow: 0, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterLbl: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  filterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border },
  filterChipSel: { borderColor: Colors.primary, backgroundColor: '#FFF0F0' },
  filterChipTxt: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  filterChipTxtSel: { color: Colors.primary, fontWeight: '700' },
  vegToggle: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border },
  vegToggleOn: { borderColor: Colors.veg, backgroundColor: '#E8F5E9' },
  vegToggleTxt: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  vegToggleTxtOn: { color: Colors.veg, fontWeight: '700' },
  platterList: { padding: 16, gap: 12 },
  platterCard: { width: 300, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, position: 'relative' },
  platterTag: { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  platterTagTxt: { fontSize: 11, fontWeight: '800', color: Colors.primaryDark },
  platterName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6, marginRight: 80 },
  priceLine: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  platterPrice: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  platterPricePer: { fontSize: 12, color: Colors.textSecondary },
  customRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  customChip: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  customChipTxt: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  categoryList: { marginBottom: 14 },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  catDot: { fontSize: 14, color: Colors.textSecondary, marginRight: 6 },
  catTxt: { fontSize: 13, color: Colors.textPrimary },
  moreCats: { fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic', marginTop: 2 },
  viewItemsBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  viewItemsBtnTxt: { fontSize: 14, fontWeight: '800', color: Colors.white },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTxt: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 12 },
  clearTxt: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});
