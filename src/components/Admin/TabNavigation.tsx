import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from './styles/adminStyles';

interface TabNavigationProps {
  activeTab: 'managers' | 'markets' | 'stores';
  onTabChange: (tab: 'managers' | 'markets' | 'stores') => void;
  counts: { managers: number; markets: number; stores: number };
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs = [
    { id: 'managers' as const, label: `Managers (${counts.managers})` },
    { id: 'markets' as const, label: `Markets (${counts.markets})` },
    { id: 'stores' as const, label: `Stores (${counts.stores})` },
  ];

  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const localStyles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    borderBottomColor: '#16a34a',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#16a34a',
    fontWeight: '600',
  },
});
