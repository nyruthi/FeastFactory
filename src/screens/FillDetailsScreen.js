import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { PLATTERS } from '../data/platters';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DELIVERY_WINDOWS = ['7:30 PM - 8:30 PM','12:00 PM - 1:00 PM','1:00 PM - 2:00 PM','8:00 PM - 9:00 PM'];
const SERVICE_TYPES = [
  { id: 'standard', name: 'Standard', charge: 289, recommended: true, desc: 'Order delivered to your building/office entrance' },
  { id: 'doorstep', name: 'Doorstep', charge: 489, recommended: false, desc: 'Order delivered to your doorstep. Perfect for high-rise buildings' },
  { id: 'assisted', name: 'Assisted', charge: 1998, recommended: false, desc: 'Helps with doorstep service for up to 3 hrs. 1 staff = ₹999' },
];

export default function FillDetailsScreen({ route, navigation }) {
  const { platterId, guestCount, sepVegNonVeg, addons } = route.params;
  const platter = PLATTERS.find(p => p.id === platterId);
  const { requirements, addPlatterToCart } = useCart();
  const [deliveryTime, setDeliveryTime] = useState(DELIVERY_WINDOWS[0]);
  const [serviceType, setServiceType] = useState('standard');
  const [instructions, setInstructions] = useState('');
  const [openSection, setOpenSection] = useState(null);
  const toggle = (k) => setOpenSection(prev => prev === k ? null : k);
  const vegCount = requirements?.dietaryType === 'mixed' ? parseInt(requirements?.vegGuests || 0) : requirements?.dietaryType === 'pure_veg' ? guestCount : 0;
  const nonVegCount = guestCount - vegCount;
  const selectedSvc = SERVICE_TYPES.find(s => s.id === serviceType);
  const eventDate = requirements?.date ? `${requirements.date.getDate()}th ${MONTHS[requirements.date.getMonth()]}` : '';

  const handleAddToCart = () => {
    addPlatterToCart({ id: Date.now(), platter, guestCount, vegCount, nonVegCount, deliveryTime, deliveryDetails: selectedSvc, addons: addons || [], sepVegNonVeg, instructions, requirements });
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}><Text style={st.backIcon}>‹</Text></TouchableOpacity>
          <Text style={st.headerTitle}>Fill Details</Text>
          <TouchableOpacity style={st.supportBtn}><Text>🎧</Text></TouchableOpacity>
        </View>

        <View style={st.summaryCard}>
          <View style={st.summaryTop}>
            <View style={{ flex: 1 }}>
              <Text style={st.summaryOcc}>{requirements?.occasion}</Text>
              <Text style={st.summaryName}>{platter.name}</Text>
              <Text style={st.summaryMeta}>{eventDate} • {requirements?.mealType} • {guestCount}({vegCount}) Guests</Text>
            </View>
            <TouchableOpacity><Text style={st.editTxt}>Edit ✏️</Text></TouchableOpacity>
          </View>
          <View style={st.addrRow}>
            <Text>📍 </Text>
            <Text style={st.addrTxt} numberOfLines={2}>{requirements?.address?.label}  {requirements?.address?.full}</Text>
          </View>
        </View>

        <Text style={st.sectionTitle}>Fill remaining details</Text>

        <TouchableOpacity style={st.accordion} onPress={() => toggle('time')}>
          <View style={st.accordionLeft}>
            <View style={st.checkCircle}><Text style={st.checkTxt}>✓</Text></View>
            <View><Text style={st.accordionLbl}>Delivery time</Text><Text style={st.accordionVal}>{deliveryTime}</Text></View>
          </View>
          <Text style={st.chevron}>{openSection === 'time' ? '∧' : '∨'}</Text>
        </TouchableOpacity>
        {openSection === 'time' && (
          <View style={st.accordionBody}>
            {DELIVERY_WINDOWS.map(w => (
              <TouchableOpacity key={w} style={st.optionRow} onPress={() => { setDeliveryTime(w); toggle('time'); }}>
                <View style={[st.radio, deliveryTime === w && st.radioSel]}>{deliveryTime === w && <View style={st.radioDot} />}</View>
                <Text style={[st.optionTxt, deliveryTime === w && st.optionTxtSel]}>{w}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={st.accordion} onPress={() => toggle('service')}>
          <View style={st.accordionLeft}>
            <View style={st.checkCircle}><Text style={st.checkTxt}>✓</Text></View>
            <View><Text style={st.accordionLbl}>🚚 Delivery & service type</Text><Text style={st.accordionVal}>{selectedSvc?.name}</Text></View>
          </View>
          <Text style={st.chevron}>{openSection === 'service' ? '∧' : '∨'}</Text>
        </TouchableOpacity>
        {openSection === 'service' && (
          <View style={st.accordionBody}>
            {SERVICE_TYPES.map(svc => (
              <TouchableOpacity key={svc.id} style={[st.svcCard, serviceType === svc.id && st.svcCardSel]} onPress={() => setServiceType(svc.id)}>
                <View style={st.svcTop}>
                  <View style={{ flex: 1 }}>
                    <View style={st.svcNameRow}>
                      <Text style={st.svcName}>{svc.name}</Text>
                      {svc.recommended && <View style={st.recBadge}><Text style={st.recBadgeTxt}>Recommended</Text></View>}
                    </View>
                    <Text style={st.svcDesc}>{svc.desc}</Text>
                  </View>
                  <Text style={st.svcCharge}>₹{svc.charge}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={st.optionalLabel}>OPTIONAL</Text>
        <TouchableOpacity style={st.accordion} onPress={() => toggle('instructions')}>
          <View style={st.accordionLeft}>
            <Text style={st.accordionIcon}>📄</Text>
            <Text style={st.accordionLblGray}>Special instructions</Text>
          </View>
          <Text style={st.chevron}>{openSection === 'instructions' ? '∧' : '∨'}</Text>
        </TouchableOpacity>
        {openSection === 'instructions' && (
          <View style={st.accordionBody}>
            <TextInput style={st.instrInput} multiline placeholder="Any special requests..." placeholderTextColor={Colors.textLight} value={instructions} onChangeText={setInstructions} />
          </View>
        )}

        <TouchableOpacity style={st.helpCard}>
          <Text style={st.helpEmoji}>🙋</Text>
          <View style={{ flex: 1 }}><Text style={st.helpTitle}>Need help? Request a call back!</Text><Text style={st.helpSub}>We'll call you soon.</Text></View>
          <Text style={st.chevron}>∨</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={st.footer}>
        <TouchableOpacity style={st.skipBtn} onPress={() => navigation.navigate('Cart')}><Text style={st.skipBtnTxt}>Skip</Text></TouchableOpacity>
        <TouchableOpacity style={st.addCartBtn} onPress={handleAddToCart}><Text style={st.addCartBtnTxt}>Add to cart</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  supportBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  summaryCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  summaryTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  summaryOcc: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  summaryName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  summaryMeta: { fontSize: 12, color: Colors.textSecondary },
  editTxt: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  addrRow: { flexDirection: 'row', alignItems: 'flex-start' },
  addrTxt: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  accordion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.veg, alignItems: 'center', justifyContent: 'center' },
  checkTxt: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  accordionIcon: { fontSize: 18 },
  accordionLbl: { fontSize: 14, color: Colors.textSecondary },
  accordionLblGray: { fontSize: 14, color: Colors.textSecondary },
  accordionVal: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  chevron: { fontSize: 16, color: Colors.textSecondary },
  accordionBody: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  optionTxt: { fontSize: 14, color: Colors.textPrimary },
  optionTxtSel: { fontWeight: '700', color: Colors.primary },
  svcCard: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: 12, marginBottom: 10 },
  svcCardSel: { borderColor: Colors.primary, backgroundColor: '#FFF8F8' },
  svcTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  svcNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  svcName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  recBadge: { backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  recBadgeTxt: { fontSize: 10, color: Colors.white, fontWeight: '700' },
  svcDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  svcCharge: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  optionalLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  instrInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 12, fontSize: 14, color: Colors.textPrimary, minHeight: 80, textAlignVertical: 'top' },
  helpCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 12 },
  helpEmoji: { fontSize: 28 },
  helpTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  helpSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface },
  skipBtn: { flex: 1, borderWidth: 2, borderColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  skipBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.primary },
  addCartBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  addCartBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
});
