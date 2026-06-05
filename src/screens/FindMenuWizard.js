import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const STEPS = ['Date', 'Guests', 'Occasion', 'Meal', 'Location', 'Budget'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const OCCASIONS = [
  { label: 'Social gathering', emoji: '🥳' }, { label: 'Birthdays & Milestones', emoji: '🎂' },
  { label: 'Housewarming/Traditional Events', emoji: '🏡' }, { label: 'Baby Shower & Early Childhood', emoji: '👶' },
  { label: 'Corporate & Business Events', emoji: '💼' }, { label: 'Wedding & Related Events', emoji: '💍' },
  { label: 'Institutional Events', emoji: '🏛️' }, { label: 'Food Donation', emoji: '🤲' },
];
const MEALS = [
  { label: 'Breakfast', emoji: '🍳', vegOnly: true }, { label: 'Lunch', emoji: '🍛', vegOnly: false },
  { label: 'Hi-tea & Snacks', emoji: '☕', vegOnly: true }, { label: 'Dinner', emoji: '🍽️', vegOnly: false },
];
const VENUES = [
  { label: 'House', emoji: '🏠' }, { label: 'Office', emoji: '🏢' },
  { label: 'Farmhouse', emoji: '🏡' }, { label: 'Banquet', emoji: '🎪' }, { label: 'Resort', emoji: '🏨' },
];
const ADDRESSES = [
  { id: '1', label: '504B', full: '504B, HITEC City, Hyderabad, Telangana, 500081' },
  { id: '2', label: 'Office', full: 'Cyber Towers, Madhapur, Hyderabad, 500033' },
];

const makeDate = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };

export default function FindMenuWizard({ navigation }) {
  const { setRequirements } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ date: makeDate(1), guestCount: '', vegGuests: '', dietaryType: 'mixed', venueType: null, occasion: null, mealType: null, address: ADDRESSES[0], budget: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return !!form.guestCount && !!form.venueType;
    if (step === 2) return !!form.occasion;
    if (step === 3) return !!form.mealType;
    if (step === 4) return !!form.address;
    if (step === 5) return !!form.budget;
    return false;
  };

  const next = () => {
    if (step < 5) { setStep(s => s + 1); return; }
    setRequirements(form);
    navigation.navigate('SuggestedServices');
  };

  const back = () => { if (step > 0) { setStep(s => s - 1); return; } navigation.goBack(); };
  const days = Array.from({ length: 14 }, (_, i) => makeDate(i + 1));

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <View style={st.header}>
        <TouchableOpacity onPress={back} style={st.backBtn}><Text style={st.backIcon}>‹</Text></TouchableOpacity>
        <Text style={st.headerTitle}>Find your curated menus</Text>
        <TouchableOpacity style={st.supportBtn}><Text style={st.supportIcon}>🎧</Text></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.stepsBar} contentContainerStyle={st.stepsContent}>
        {STEPS.map((label, i) => {
          const done = i < step, active = i === step;
          return (
            <View key={i} style={st.stepItem}>
              <View style={[st.stepCircle, done && st.stepDone, active && st.stepActive]}>
                <Text style={[st.stepNum, (done || active) && st.stepNumWhite]}>{done ? '✓' : i + 1}</Text>
              </View>
              <Text style={[st.stepLabel, active && st.stepLabelActive]}>{label}</Text>
              {active && <View style={st.stepUnder} />}
            </View>
          );
        })}
      </ScrollView>

      <ScrollView style={st.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={st.pad}>
          {step === 0 && <>
            <Text style={st.q}>When's the event?</Text>
            <Text style={st.hint}>📅 Order at least 1 day prior</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={st.dateRow}>
                {days.map((d, i) => { const sel = form.date.toDateString() === d.toDateString(); return (
                  <TouchableOpacity key={i} style={[st.dateBox, sel && st.dateBoxSel]} onPress={() => set('date', d)}>
                    <Text style={[st.dateDow, sel && st.dateWhite]}>{DAYS[d.getDay()]}</Text>
                    <Text style={[st.dateNum, sel && st.dateWhite]}>{d.getDate()}</Text>
                    <Text style={[st.dateMon, sel && st.dateWhite]}>{MONTHS[d.getMonth()]}</Text>
                  </TouchableOpacity>
                ); })}
              </View>
            </ScrollView>
          </>}

          {step === 1 && <>
            <Text style={st.q}>What does your crowd look like?</Text>
            <View style={st.inputRow}>
              <View style={[st.inputBox, { flex: form.dietaryType === 'mixed' ? 1.3 : 2 }]}>
                <Text style={st.inputLbl}>Total guests</Text>
                <TextInput style={st.inputField} keyboardType="number-pad" placeholder="Enter" placeholderTextColor={Colors.textLight} value={form.guestCount} onChangeText={v => set('guestCount', v)} />
              </View>
              {form.dietaryType === 'mixed' && (
                <View style={[st.inputBox, { flex: 1 }]}>
                  <Text style={st.inputLbl}>🟢 Veg guests</Text>
                  <TextInput style={st.inputField} keyboardType="number-pad" placeholder="Enter" placeholderTextColor={Colors.textLight} value={form.vegGuests} onChangeText={v => set('vegGuests', v)} />
                </View>
              )}
            </View>
            <View style={st.chipRow}>
              {[['pure_veg','🟢 Pure veg'],['non_veg','🔴 Non-veg'],['mixed','🟢🔴 Mixed guests']].map(([val, lbl]) => (
                <TouchableOpacity key={val} style={[st.chip, form.dietaryType === val && st.chipSel]} onPress={() => set('dietaryType', val)}>
                  <Text style={[st.chipTxt, form.dietaryType === val && st.chipTxtSel]}>{lbl}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={st.subQ}>Where's the event?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={st.venueRow}>
                {VENUES.map(v => (
                  <TouchableOpacity key={v.label} style={[st.venueCard, form.venueType === v.label && st.venueCardSel]} onPress={() => set('venueType', v.label)}>
                    {form.venueType === v.label && <View style={st.venueTick}><Text style={st.venueTickTxt}>✓</Text></View>}
                    <Text style={st.venueEmoji}>{v.emoji}</Text>
                    <Text style={[st.venueLabel, form.venueType === v.label && st.venueLabelSel]}>{v.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>}

          {step === 2 && <>
            <Text style={st.q}>What's the occasion?</Text>
            {OCCASIONS.map(o => (
              <TouchableOpacity key={o.label} style={[st.listRow, form.occasion === o.label && st.listRowSel]} onPress={() => set('occasion', o.label)}>
                <Text style={st.listEmoji}>{o.emoji}</Text>
                <Text style={[st.listLbl, form.occasion === o.label && st.listLblSel]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </>}

          {step === 3 && <>
            <Text style={st.q}>What meal are you planning?</Text>
            {MEALS.map(m => (
              <TouchableOpacity key={m.label} style={[st.listRow, form.mealType === m.label && st.listRowSel]} onPress={() => set('mealType', m.label)}>
                <Text style={st.listEmoji}>{m.emoji}</Text>
                <Text style={[st.listLbl, form.mealType === m.label && st.listLblSel]}>{m.label}</Text>
                {m.vegOnly && <View style={st.vegTag}><Text style={st.vegTagTxt}>🟢 Veg only</Text></View>}
              </TouchableOpacity>
            ))}
          </>}

          {step === 4 && <>
            <Text style={st.q}>Where should we deliver?</Text>
            {ADDRESSES.map(addr => { const sel = form.address?.id === addr.id; return (
              <TouchableOpacity key={addr.id} style={[st.addrCard, sel && st.addrCardSel]} onPress={() => set('address', addr)}>
                <View style={[st.radio, sel && st.radioSel]}>{sel && <View style={st.radioDot} />}</View>
                <View style={{ flex: 1 }}>
                  <Text style={st.addrLbl}>{addr.label}</Text>
                  <Text style={st.addrFull}>{addr.full}</Text>
                </View>
              </TouchableOpacity>
            ); })}
            <TouchableOpacity style={st.addAddr}><Text style={st.addAddrTxt}>+ Add new address</Text></TouchableOpacity>
          </>}

          {step === 5 && <>
            <Text style={st.q}>What's your budget?</Text>
            <View style={st.budgetCard}>
              <Text style={st.budgetCurr}>₹</Text>
              <TextInput style={st.budgetInput} keyboardType="number-pad" placeholder="600" placeholderTextColor={Colors.textLight} value={form.budget} onChangeText={v => set('budget', v)} />
              <Text style={st.budgetPer}>Per person</Text>
            </View>
            <View style={st.budgetNote}><Text style={st.budgetNoteTxt}>ℹ️  Your budget helps us suggest the right platters</Text></View>
          </>}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={st.footer}>
        <TouchableOpacity style={[st.nextBtn, !canProceed() && st.nextBtnOff]} onPress={next} disabled={!canProceed()}>
          <Text style={st.nextBtnTxt}>{step === 5 ? 'Confirm' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  supportBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  supportIcon: { fontSize: 18 },
  stepsBar: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  stepsContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 4 },
  stepItem: { alignItems: 'center', marginRight: 6, position: 'relative', paddingBottom: 2 },
  stepCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  stepDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNum: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  stepNumWhite: { color: Colors.white },
  stepLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 3 },
  stepLabelActive: { color: Colors.primary, fontWeight: '700' },
  stepUnder: { position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  body: { flex: 1 },
  pad: { padding: 20 },
  q: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  subQ: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 20, marginBottom: 12 },
  hint: { fontSize: 13, color: Colors.textSecondary, marginBottom: 18 },
  dateRow: { flexDirection: 'row', gap: 10, paddingVertical: 4 },
  dateBox: { width: 62, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center' },
  dateBoxSel: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  dateDow: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  dateNum: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginVertical: 2 },
  dateMon: { fontSize: 10, color: Colors.textSecondary },
  dateWhite: { color: Colors.white },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  inputBox: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: 12 },
  inputLbl: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  inputField: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, padding: 0, minHeight: 32 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border },
  chipSel: { borderColor: Colors.primary, backgroundColor: '#FFF0F0' },
  chipTxt: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTxtSel: { color: Colors.primary, fontWeight: '700' },
  venueRow: { flexDirection: 'row', gap: 10, paddingVertical: 4 },
  venueCard: { width: 80, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', position: 'relative' },
  venueCardSel: { borderColor: Colors.primary, backgroundColor: '#FFF0F0' },
  venueTick: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  venueTickTxt: { color: Colors.white, fontSize: 10, fontWeight: '900' },
  venueEmoji: { fontSize: 26, marginBottom: 6 },
  venueLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  venueLabelSel: { color: Colors.primary, fontWeight: '700' },
  listRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, marginBottom: 10 },
  listRowSel: { borderColor: Colors.primary, backgroundColor: '#FFF0F0' },
  listEmoji: { fontSize: 22, marginRight: 12 },
  listLbl: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  listLblSel: { color: Colors.primary, fontWeight: '700' },
  vegTag: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  vegTagTxt: { fontSize: 11, color: Colors.veg, fontWeight: '600' },
  addrCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, marginBottom: 10, gap: 12 },
  addrCardSel: { borderColor: Colors.primary },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioSel: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  addrLbl: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  addrFull: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  addAddr: { alignItems: 'center', paddingVertical: 14, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, borderStyle: 'dashed' },
  addAddrTxt: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  budgetCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 12, marginBottom: 12 },
  budgetCurr: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginRight: 4 },
  budgetInput: { flex: 1, fontSize: 30, fontWeight: '800', color: Colors.textPrimary, padding: 0 },
  budgetPer: { fontSize: 13, color: Colors.textSecondary },
  budgetNote: { backgroundColor: '#EEF2FF', padding: 14, borderRadius: 12 },
  budgetNoteTxt: { fontSize: 13, color: Colors.primary, lineHeight: 20 },
  footer: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextBtnOff: { backgroundColor: Colors.border },
  nextBtnTxt: { fontSize: 16, fontWeight: '800', color: Colors.white },
});
