import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import PackagesScreen from '../screens/PackagesScreen';
import CustomizerScreen from '../screens/CustomizerScreen';
import CartScreen from '../screens/CartScreen';
import TrackingScreen from '../screens/TrackingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FindMenuWizard from '../screens/FindMenuWizard';
import SuggestedServicesScreen from '../screens/SuggestedServicesScreen';
import PlattersScreen from '../screens/PlattersScreen';
import PlatterDetailScreen from '../screens/PlatterDetailScreen';
import FillDetailsScreen from '../screens/FillDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { Colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar({ state, descriptors, navigation }) {
  const { platters } = useCart();
  const cartCount = platters.length;
  const tabs = [
    { name: 'HomeTab', icon: '🏠', label: 'Home' },
    { name: 'CartTab', icon: '🛒', label: 'Cart', badge: cartCount > 0 ? cartCount : null },
    { name: 'ProfileTab', icon: '👤', label: 'Profile' },
  ];
  return (
    <View style={st.tabBar}>
      {state.routes.map((route, index) => {
        const tab = tabs[index];
        const focused = state.index === index;
        return (
          <TouchableOpacity key={route.key} style={st.tab} onPress={() => { if (!focused) navigation.navigate(route.name); }} activeOpacity={0.8}>
            <View style={[st.iconWrap, focused && st.iconWrapActive]}>
              <Text style={st.tabIcon}>{tab.icon}</Text>
              {tab.badge != null && <View style={st.badge}><Text style={st.badgeTxt}>{tab.badge}</Text></View>}
            </View>
            <Text style={[st.tabLabel, focused && st.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const st = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: Colors.surface, paddingTop: 10, paddingBottom: 24, borderTopWidth: 1, borderTopColor: Colors.border, elevation: 12 },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconWrapActive: { backgroundColor: '#FFF0F0' },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: Colors.textLight },
  tabLabelActive: { color: Colors.primary, fontWeight: '800' },
  badge: { position: 'absolute', top: 2, right: 2, backgroundColor: Colors.primary, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeTxt: { fontSize: 10, fontWeight: '900', color: Colors.white },
});

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
      <Stack.Screen name="Home" component={MainTabs} options={{ animation: 'fade' }} />
      <Stack.Screen name="FindMenu" component={FindMenuWizard} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="SuggestedServices" component={SuggestedServicesScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Platters" component={PlattersScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="PlatterDetail" component={PlatterDetailScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="FillDetails" component={FillDetailsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Packages" component={PackagesScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Customizer" component={CustomizerScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
