import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { Colors } from '../theme/colors';
import { BACKEND_URL } from '../config/api';

export default function PaymentScreen({ route, navigation }) {
  const { totalAmount, orderId: appOrderId } = route.params;
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  const [paymentState, setPaymentState] = useState('creating');

  useEffect(() => { createOrder(); }, []);

  const createOrder = async () => {
    setPaymentState('creating');
    try {
      const res = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, currency: 'INR', receipt: appOrderId }),
      });
      const data = await res.json();
      if (data.success) { setRazorpayOrderId(data.order.id); setPaymentState('idle'); }
      else throw new Error(data.error || 'Failed to create order');
    } catch (err) {
      setPaymentState('failed');
      Alert.alert('Connection Error', `Cannot reach backend.\n\nMake sure:\n1. Backend is running (node server.js)\n2. BACKEND_IP is correct in src/config/api.js\n\nError: ${err.message}`,
        [{ text: 'Retry', onPress: createOrder }, { text: 'Go Back', onPress: () => navigation.goBack() }]);
    }
  };

  const openPayment = async () => {
    if (!razorpayOrderId) return;
    setPaymentState('paying');
    const paymentUrl = `${BACKEND_URL}/payment?order_id=${razorpayOrderId}&amount=${totalAmount}&description=Feast+Factory+Order`;
    await WebBrowser.openBrowserAsync(paymentUrl, { toolbarColor: Colors.primary, controlsColor: Colors.white });
    setPaymentState('verifying');
    try {
      const res = await fetch(`${BACKEND_URL}/api/payment-status/${razorpayOrderId}`);
      const data = await res.json();
      if (data.status === 'paid') setPaymentState('success');
      else setPaymentState('idle');
    } catch { setPaymentState('idle'); }
  };

  if (paymentState === 'success') {
    return (
      <SafeAreaView style={st.root} edges={['top', 'bottom']}>
        <View style={st.successContainer}>
          <Text style={st.successEmoji}>🎉</Text>
          <Text style={st.successTitle}>Payment Successful!</Text>
          <Text style={st.successSub}>Your feast is confirmed. We're preparing your order.</Text>
          <View style={st.amountBox}>
            <Text style={st.amountPaid}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            <Text style={st.amountLabel}>Amount Paid</Text>
          </View>
          <TouchableOpacity style={st.trackBtn} onPress={() => navigation.replace('Tracking')}>
            <Text style={st.trackBtnTxt}>Track Your Order →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}><Text style={st.backIcon}>‹</Text></TouchableOpacity>
        <Text style={st.headerTitle}>Secure Payment</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={st.body}>
        <View style={st.amountCard}>
          <Text style={st.amountCardLabel}>Order Total</Text>
          <Text style={st.amountCardValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          <Text style={st.amountCardSub}>The Feast Factory</Text>
        </View>
        <View style={st.securityRow}>
          {['🔒 SSL Secured', '✓ Razorpay', '🏦 PCI DSS'].map(b => (
            <View key={b} style={st.securityBadge}><Text style={st.securityBadgeTxt}>{b}</Text></View>
          ))}
        </View>
        <View style={st.methodsCard}>
          <Text style={st.methodsTitle}>Accepted Payment Methods</Text>
          <View style={st.methodsRow}>
            {['💳 Cards', '🏦 Net Banking', '📱 UPI', '👛 Wallets'].map(m => (
              <View key={m} style={st.methodChip}><Text style={st.methodChipTxt}>{m}</Text></View>
            ))}
          </View>
        </View>
        {(paymentState === 'creating' || paymentState === 'verifying') && (
          <View style={st.statusRow}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={st.statusTxt}>{paymentState === 'creating' ? 'Setting up secure payment...' : 'Verifying payment...'}</Text>
          </View>
        )}
        <TouchableOpacity style={[st.payBtn, (!razorpayOrderId || paymentState !== 'idle') && st.payBtnOff]} onPress={openPayment} disabled={!razorpayOrderId || paymentState !== 'idle'}>
          {paymentState === 'paying' || paymentState === 'verifying' ? <ActivityIndicator color={Colors.white} /> : (
            <Text style={st.payBtnTxt}>{paymentState === 'creating' ? 'Preparing...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} Securely`}</Text>
          )}
        </TouchableOpacity>
        <Text style={st.disclaimer}>Payments processed securely by Razorpay. UPI test: success@razorpay</Text>
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
  body: { flex: 1, padding: 20 },
  amountCard: { backgroundColor: Colors.primary, borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 16 },
  amountCardLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  amountCardValue: { fontSize: 40, fontWeight: '900', color: Colors.white, marginBottom: 4 },
  amountCardSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  securityRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  securityBadge: { backgroundColor: '#E8F5E9', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  securityBadgeTxt: { fontSize: 12, color: Colors.veg, fontWeight: '600' },
  methodsCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  methodsTitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12, fontWeight: '600' },
  methodsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  methodChip: { backgroundColor: Colors.background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  methodChipTxt: { fontSize: 12, color: Colors.textPrimary, fontWeight: '500' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 12 },
  statusTxt: { fontSize: 13, color: Colors.textSecondary },
  payBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 16 },
  payBtnOff: { backgroundColor: Colors.border },
  payBtnTxt: { fontSize: 16, fontWeight: '800', color: Colors.white },
  disclaimer: { fontSize: 11, color: Colors.textLight, textAlign: 'center', lineHeight: 16 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successEmoji: { fontSize: 72, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: '900', color: Colors.veg, marginBottom: 8 },
  successSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  amountBox: { backgroundColor: '#E8F5E9', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, alignItems: 'center', marginBottom: 28 },
  amountPaid: { fontSize: 32, fontWeight: '900', color: Colors.veg },
  amountLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  trackBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32 },
  trackBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
});
