import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

export default function CustomizerScreen({ navigation }) {
  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
          <Text style={st.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={st.headerTitle}>Customize</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={st.body}>
        <Text style={st.emoji}>🍽️</Text>
        <Text style={st.title}>Use the Find Menu flow</Text>
        <Text style={st.desc}>Our new guided flow helps you find and customize the perfect platter for your event.</Text>
        <TouchableOpacity style={st.btn} onPress={() => navigation.navigate('FindMenu')}>
          <Text style={st.btnTxt}>Find Your Menu →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 30, color: Colors.textPrimary, lineHeight: 34 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  btn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 },
  btnTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
});
