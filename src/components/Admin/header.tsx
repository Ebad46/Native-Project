import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import adminStyles from './styles/adminStyles';
interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <View style={adminStyles.header}>
      <Text style={localStyles.title}>Brake Time Admin</Text>
      <TouchableOpacity style={adminStyles.logoutBtn} onPress={onLogout}>
        <Text style={adminStyles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
