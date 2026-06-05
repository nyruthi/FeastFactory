import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatTimer(secs) {
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export default function CartScreen({ navigation }) {
  const { platters, totalAmount, removePlatterFromCart } = useCart();
  const [timer, setTimer] = useState(3 * 60 * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (platters.length === 0) return;
    intervalRef.current = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(intervalRef.current);
  }, [platters.length]);

  const savings = Math.round(totalAmount * 0.015);
  const cashback = Math.round(totalAmount * 0.12);

  if (platters.length === 0) {
    return (
      <SafeAreaView style={st.emptyRoot} edges={['top', 'bottom']}>
        <View style={st.emptyHeader}><Text style={st.emptyHeaderTitle}>Cart</Text></View>
        <View style={st.emptyState}>
          <Text style={st.emptyEmoji}>🛒</Text>
          <Text style={st.emptyTitle}>Your cart is empty</Text>
          <Text style={st.emptyDesc}>Browse platters and add them to your cart</Text>
          <TouchableOpacity style={st.browseBtn} onPress={() => navigation.navigate('FindMenu')}>
            <Text style={st.browseBtnTxt}>Find Your Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}><Text style={st.backIcon}>‹</Text></TouchableOpacity>
        <View><Text style={st.headerTitle}>Cart</Text><Text style={st.headerSub}>{platters.length} Platter{platters.length > 1 ? 's' : ''}</Text></View>
        <TouchableOpacity style={st.supportBtn}><Text>🎧</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={st.readyRow}>
          <Text style={st.readyTxt}>Ready to order ({platters.length})</Text>
          <TouchableOpacity><Text style={st.shareTxt}>↗ Share Menu</Text></TouchableOpacity>
        </View>

        <FlatList
          data={platters} horizontal keyExtractor={item => String(item.id)}
          showsHorizontalScrollIndicator={false} contentContainerStyle={st.platterList}
          snapToInterval={332} decelerationRate="fast"
          renderItem={({ item }) => {
            const eventDate = item.requirements?.date ? `${item.requirements.date.getDate()} ${MONTHS[item.requirements.date.getMonth()]}` : '';
            const lineTotal = item.platter.pricePerPerson * item.guestCount + (item.deliveryDetails?.charge || 0);
            return (
              <View style={st.platterCard}>
                <View style={st.cardHeader}>
                  <Text style={st.cardSvcType}>{item.platter.serviceType === 'delivery_box' ? 'Delivery box' : item.platter.serviceType === 'meal_box' ? 'Meal Box' : 'BBQ Grill'}</Text>
                  <TouchableOpacity><Text style={st.knowMore}>Know more ›</Text></TouchableOpacity>
                </View>
                <View style={st.cardPriceRow}>
                  <View>
                    <Text style={st.cardPlatterName}>{item.platter.name}</Text>
                    <Text style={st.cardPricePer}>₹{item.platter.pricePerPerson}/person</Text>
                  </View>
                  <View style={st.cardTotalBlock}>
                    <Text style={st.cardTotalLabel}>Total</Text>
                    <Text style={st.cardTotal}>₹{lineTotal.toLocaleString('en-IN')} ›</Text>
                  </View>
                  <TouchableOpacity onPress={() => removePlatterFromCart(item.id)} style={st.moreBtn}><Text style={st.moreBtnTxt}>⋮</Text></TouchableOpacity>
                </View>
                <View style={st.eventSection}>
                  <View style={st.eventSectionHeader}>
                    <Text style={st.eventSectionTitle}>Event details</Text>
                    <TouchableOpacity><Text style={st.editTxt}>✏️ Edit</Text></TouchableOpacity>
                  </View>
                  <View style={st.eventDetailsRow}>
                    <View style={st.eventDetailBox}>
                      <Text style={st.eventDetailMain}>{eventDate}, {item.deliveryTime?.split('-')[0]?.trim()}</Text>
                      <Text style={st.eventDetailSub}>{item.requirements?.mealType}</Text>
                    </View>
                    <View style={st.eventDetailBox}>
                      <Text style={st.eventDetailMain}>{item.guestCount} guests</Text>
                      <Text style={st.eventDetailSub}>{item.vegCount} veg & {item.nonVegCount} non-veg</Text>
                    </View>
                  </View>
                  <View style={st.deliveryTimeRow}>
                    <Text style={st.infoIcon}>ℹ️ </Text>
                    <Text style={st.deliveryTimeTxt}>Delivered between {item.deliveryTime}</Text>
                  </View>
                  {item.deliveryDetails && <View style={st.serviceBadge}><Text style={st.serviceBadgeTxt}>🚚 {item.deliveryDetails.name} service</Text></View>}
                  <Text style={st.addrTxt} numberOfLines={1}>📍 {item.requirements?.address?.label} | {item.requirements?.address?.full}</Text>
                </View>
                <View style={st.itemsRow}>
                  <TouchableOpacity style={st.itemsBtn}><Text style={st.itemsBtnTxt}>🍽 {item.platter.itemCount} Items ›</Text></TouchableOpacity>
                  <TouchableOpacity style={st.itemsBtn}><Text style={st.itemsBtnTxt}>🍴 Add cutlery</Text></TouchableOpacity>
                </View>
              </View>
            );
          }}
        />

        <TouchableOpacity style={st.explorePlatters} onPress={() => navigation.navigate('FindMenu')}>
          <Text style={st.explorePlattersLbl}>Explore more platters ›</Text>
        </TouchableOpacity>

        <View style={st.confidenceSection}>
          <Text style={st.confidenceTitle}>#BOOKWITHCONFIDENCE</Text>
          {[['💰','EARN CASH BACK COINS',`Up to 12% cashback (≈₹${cashback.toLocaleString('en-IN')} on this order)`],['🎧','POST ORDER SUPPORT','Dedicated support team available 24/7'],['🔒','PRICE LOCK GUARANTEE','Pay now and lock your price before the timer ends']].map(([e,t,s]) => (
            <View key={t} style={st.confidenceItem}>
              <Text style={st.confidenceEmoji}>{e}</Text>
              <View><Text style={st.confidenceItemTitle}>{t}</Text><Text style={st.confidenceItemSub}>{s}</Text></View>
            </View>
          ))}
        </View>
        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={st.payFooter}>
        <View style={st.timerBar}>
          <Text style={st.timerBarTxt}>🔒 Lock price before timer ends</Text>
          <View style={st.timerBadge}><Text style={st.timerTxt}>⏱ {formatTimer(timer)}</Text></View>
        </View>
        <View style={st.payRow}>
          <View>
            <Text style={st.totalAmt}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            {savings > 0 && <Text style={st.savingsTxt}>Pay now & save ₹{savings.toLocaleString('en-IN')}</Text>}
          </View>
          <TouchableOpacity style={st.payBtn} onPress={() => navigation.navigate('Payment', { totalAmount, orderId: `FF${Date.now().toString().slice(-6)}` })}>
            <Text style={st.payBtnTxt}>Pay total</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  emptyRoot: { flex: 1, backgroundColor: Colors.background },
  emptyHeader: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  emptyHeaderTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  browseBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 },
  browseBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 12 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textSecondary },
  supportBtn: { marginLeft: 'auto', width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  readyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  readyTxt: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  shareTxt: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  platterList: { paddingHorizontal: 16, paddingBottom: 4, gap: 12 },
  platterCard: { width: 320, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFF8E8', borderBottomWidth: 1, borderBottomColor: Colors.border },
  cardSvcType: { fontSize: 13, fontWeight: '700', color: Colors.secondary },
  knowMore: { fontSize: 12, color: Colors.textSecondary },
  cardPriceRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  cardPlatterName: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  cardPricePer: { fontSize: 12, color: Colors.textSecondary },
  cardTotalBlock: { flex: 1, alignItems: 'flex-end' },
  cardTotalLabel: { fontSize: 11, color: Colors.textSecondary },
  cardTotal: { fontSize: 15, fontWeight: '800', color: Colors.primary },
  moreBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  moreBtnTxt: { fontSize: 18, color: Colors.textSecondary, lineHeight: 20 },
  eventSection: { paddingHorizontal: 14, paddingVertical: 12 },
  eventSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  eventSectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  editTxt: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  eventDetailsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  eventDetailBox: { flex: 1, backgroundColor: Colors.background, borderRadius: 10, padding: 10 },
  eventDetailMain: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  eventDetailSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  deliveryTimeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, marginBottom: 8 },
  infoIcon: { fontSize: 13 },
  deliveryTimeTxt: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  serviceBadge: { backgroundColor: Colors.textPrimary, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8 },
  serviceBadgeTxt: { fontSize: 11, color: Colors.white, fontWeight: '600' },
  addrTxt: { fontSize: 12, color: Colors.textSecondary },
  itemsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border },
  itemsBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.border },
  itemsBtnTxt: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  explorePlatters: { paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center' },
  explorePlattersLbl: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  confidenceSection: { backgroundColor: Colors.primaryDark, margin: 16, borderRadius: 16, padding: 16 },
  confidenceTitle: { fontSize: 14, fontWeight: '900', color: Colors.secondary, textAlign: 'center', letterSpacing: 1, marginBottom: 16 },
  confidenceItem: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  confidenceEmoji: { fontSize: 28 },
  confidenceItemTitle: { fontSize: 12, fontWeight: '800', color: Colors.white, letterSpacing: 0.3, marginBottom: 2 },
  confidenceItemSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  payFooter: { borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface },
  timerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.veg, paddingHorizontal: 16, paddingVertical: 8 },
  timerBarTxt: { fontSize: 13, fontWeight: '600', color: Colors.white },
  timerBadge: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  timerTxt: { fontSize: 13, fontWeight: '800', color: Colors.white },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 16 },
  totalAmt: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  savingsTxt: { fontSize: 12, color: Colors.veg, fontWeight: '600' },
  payBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 },
  payBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
});
