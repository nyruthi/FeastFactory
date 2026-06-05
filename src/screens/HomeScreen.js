import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import Logo from '../components/Logo';

const { width } = Dimensions.get('window');

const OCCASIONS = [
  { label: 'Office Party', emoji: '💼' }, { label: 'Birthday', emoji: '🎂' },
  { label: 'Pooja', emoji: '🪔' }, { label: 'Wedding', emoji: '💍' },
  { label: 'Get-together', emoji: '🥳' }, { label: 'Corporate', emoji: '🏢' },
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Give Requirements', desc: 'Date, guests, occasion, budget', emoji: '📋' },
  { step: '2', title: 'View & Select Menu', desc: 'Browse curated platters', emoji: '🍽️' },
  { step: '3', title: 'Customize', desc: 'Replace items to your taste', emoji: '✍️' },
  { step: '4', title: 'We Deliver', desc: 'Hot & on time to your venue', emoji: '🚚' },
];

export default function HomeScreen({ navigation }) {
  const { platters } = useCart();
  const cartCount = platters.length;
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerBg = scrollY.interpolate({ inputRange: [0, 80], outputRange: ['transparent', Colors.primary], extrapolate: 'clamp' });

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <Animated.View style={[st.header, { backgroundColor: headerBg }]}>
        <SafeAreaView edges={['top']}>
          <View style={st.headerInner}>
            <View style={st.headerLeft}>
              <Logo size={52} showText={false} />
              <View>
                <Text style={st.headerTitle}>The Feast Factory</Text>
                <Text style={st.headerSub}>📍 Hyderabad, India</Text>
              </View>
            </View>
            <TouchableOpacity style={st.notifBtn} onPress={() => navigation.navigate('Cart')}>
              <Text style={st.notifIcon}>🛒</Text>
              {cartCount > 0 && <View style={st.cartBadge}><Text style={st.cartBadgeTxt}>{cartCount}</Text></View>}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary, '#A52020']} style={st.hero}>
          <Text style={st.heroWelcome}>Welcome to</Text>
          <Text style={st.heroTitle}>The Feast Factory</Text>
          <Text style={st.heroSub}>India's premier food catering app{'\n'}where every meal is a masterpiece</Text>
          <TouchableOpacity style={st.heroCta} onPress={() => navigation.navigate('FindMenu')}>
            <LinearGradient colors={[Colors.secondary, Colors.secondaryLight]} style={st.heroCtaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={st.heroCtaTxt}>Find Your Menu →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* Find Menu section */}
        <View style={st.findSection}>
          <View style={st.orderInfoBar}>
            <Text style={st.orderInfoTxt}>📅 Order 1 day prior</Text>
            <Text style={st.orderInfoDiv}>|</Text>
            <Text style={st.orderInfoTxt}>👥 Min. 10 pax</Text>
            <Text style={st.orderInfoDiv}>|</Text>
            <Text style={st.orderInfoTxt}>📍 Live in Hyderabad</Text>
          </View>
          <TouchableOpacity style={st.findBtn} onPress={() => navigation.navigate('FindMenu')} activeOpacity={0.88}>
            <Text style={st.findBtnIcon}>🔍</Text>
            <View>
              <Text style={st.findBtnTitle}>Find your menu</Text>
              <Text style={st.findBtnSub}>Browse best recommendations</Text>
            </View>
          </TouchableOpacity>
          <View style={st.stepsRow}>
            {HOW_IT_WORKS.map((s, i) => (
              <React.Fragment key={i}>
                <View style={st.stepCard}>
                  <Text style={st.stepNum}>{s.step}</Text>
                  <Text style={st.stepEmoji}>{s.emoji}</Text>
                  <Text style={st.stepTitle}>{s.title}</Text>
                </View>
                {i < HOW_IT_WORKS.length - 1 && <Text style={st.stepArrow}>›</Text>}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={st.statsCard}>
          {[{ val: '40K+', label: 'Orders' }, { val: '500+', label: 'Dishes' }, { val: '50+', label: 'Cuisines' }, { val: '4.9★', label: 'Rating' }].map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={st.statItem}>
                <Text style={st.statVal}>{s.val}</Text>
                <Text style={st.statLabel}>{s.label}</Text>
              </View>
              {i < 3 && <View style={st.statDiv} />}
            </React.Fragment>
          ))}
        </View>

        {/* Occasions */}
        <View style={st.section}>
          <Text style={st.sectionTitle}>Pick Platters By Occasion</Text>
          <View style={st.occasionsGrid}>
            {OCCASIONS.map(o => (
              <TouchableOpacity key={o.label} style={st.occasionCard} onPress={() => navigation.navigate('FindMenu')}>
                <Text style={st.occasionEmoji}>{o.emoji}</Text>
                <Text style={st.occasionLabel}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How it works */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={st.howSection}>
          <Text style={st.howTitle}>How It Works</Text>
          <Text style={st.howSub}>From craving to celebration in 4 simple steps</Text>
          {HOW_IT_WORKS.map((step, i) => (
            <View key={step.step} style={st.howStep}>
              <View style={st.howLeft}>
                <View style={st.howNumBox}><Text style={st.howNum}>{step.step}</Text></View>
                {i < HOW_IT_WORKS.length - 1 && <View style={st.howLine} />}
              </View>
              <View style={st.howContent}>
                <Text style={st.howEmoji}>{step.emoji}</Text>
                <View>
                  <Text style={st.howStepTitle}>{step.title}</Text>
                  <Text style={st.howStepDesc}>{step.desc}</Text>
                </View>
              </View>
            </View>
          ))}
        </LinearGradient>

        {/* Promo */}
        <View style={st.promoBanner}>
          <Text style={st.promoEmoji}>🎉</Text>
          <Text style={st.promoTitle}>First Order? Get 15% OFF</Text>
          <Text style={st.promoCode}>FEAST15</Text>
          <TouchableOpacity style={st.promoBtn} onPress={() => navigation.navigate('FindMenu')}>
            <Text style={st.promoBtnTxt}>Claim Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <TouchableOpacity style={st.cartBar} onPress={() => navigation.navigate('Cart')}>
          <Text style={st.cartBarTxt}>🛒 {cartCount} Platter{cartCount > 1 ? 's' : ''} in cart</Text>
          <Text style={st.cartBarCta}>Go to cart ›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, paddingHorizontal: 16, paddingBottom: 12 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  logoTxt: { fontSize: 13, fontWeight: '900', color: Colors.primaryDark },
  headerTitle: { fontSize: 15, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  notifBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifIcon: { fontSize: 18 },
  cartBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: Colors.secondary, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  cartBadgeTxt: { fontSize: 9, fontWeight: '900', color: Colors.primaryDark },

  hero: { paddingTop: 120, paddingBottom: 36, paddingHorizontal: 24 },
  heroWelcome: { fontSize: 14, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 4 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: Colors.white, letterSpacing: 1, marginBottom: 10 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 22, marginBottom: 24 },
  heroCta: { alignSelf: 'flex-start', borderRadius: 12, overflow: 'hidden' },
  heroCtaGrad: { paddingVertical: 13, paddingHorizontal: 22, borderRadius: 12 },
  heroCtaTxt: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark },

  findSection: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  orderInfoBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F4FF', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 8, marginBottom: 12, gap: 6, flexWrap: 'wrap' },
  orderInfoTxt: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  orderInfoDiv: { color: Colors.border },
  findBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryDark, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 14, gap: 14 },
  findBtnIcon: { fontSize: 28 },
  findBtnTitle: { fontSize: 17, fontWeight: '800', color: Colors.white },
  findBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepCard: { flex: 1, backgroundColor: Colors.background, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  stepNum: { fontSize: 16, fontWeight: '900', color: Colors.primary },
  stepEmoji: { fontSize: 18, marginVertical: 4 },
  stepTitle: { fontSize: 10, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
  stepArrow: { fontSize: 18, color: Colors.textSecondary, paddingHorizontal: 2 },

  statsCard: { flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: 16, marginTop: -16, borderRadius: 16, paddingVertical: 18, elevation: 8, zIndex: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  statLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 3 },
  statDiv: { width: 1, backgroundColor: Colors.border, marginVertical: 8 },

  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14 },
  occasionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  occasionCard: { width: (width - 52) / 3, backgroundColor: Colors.surface, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  occasionEmoji: { fontSize: 28, marginBottom: 6 },
  occasionLabel: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },

  howSection: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 32 },
  howTitle: { fontSize: 22, fontWeight: '900', color: Colors.white, textAlign: 'center' },
  howSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 6, marginBottom: 28 },
  howStep: { flexDirection: 'row', alignItems: 'flex-start' },
  howLeft: { alignItems: 'center', width: 44 },
  howNumBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  howNum: { fontSize: 14, fontWeight: '900', color: Colors.primaryDark },
  howLine: { width: 2, flex: 1, backgroundColor: 'rgba(212,160,23,0.4)', minHeight: 32 },
  howContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingBottom: 28, paddingLeft: 12, flex: 1 },
  howEmoji: { fontSize: 24, marginTop: 4 },
  howStepTitle: { fontSize: 15, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  howStepDesc: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 18 },

  promoBanner: { margin: 16, backgroundColor: Colors.primary, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.secondary },
  promoEmoji: { fontSize: 32, marginBottom: 8 },
  promoTitle: { fontSize: 20, fontWeight: '900', color: Colors.secondaryLight, marginBottom: 8 },
  promoCode: { fontSize: 14, color: Colors.white, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, letterSpacing: 2, marginBottom: 16, fontWeight: '700' },
  promoBtn: { backgroundColor: Colors.secondary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  promoBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark },

  cartBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, paddingBottom: 28 },
  cartBarTxt: { fontSize: 14, fontWeight: '700', color: Colors.white },
  cartBarCta: { fontSize: 14, fontWeight: '800', color: Colors.secondary },
});
