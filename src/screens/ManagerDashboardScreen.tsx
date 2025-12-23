// src/screens/ManagerDashboardScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Store, Market } from '../types';
import { storeService, marketService, assignmentService } from '../lib/db';
import { showConfirm } from '../components/NotificationSystem';

interface ManagerStoreData {
  storeId: number;
  storeName: string;
  marketName: string;
}

export const ManagerDashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<ManagerStoreData[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!user?.manager_id) {
        console.log('No manager_id found');
        setStores([]);
        setLoading(false);
        return;
      }

      // Get all stores assigned to this manager
      const allStores = await storeService.getAll();
      const allAssignments = await assignmentService.getAll();
      const allMarkets = await marketService.getAll();

      setMarkets(allMarkets);

      // Filter stores assigned to this manager
      const managerAssignments = allAssignments.filter(
        (a) => a.manager_id === user.manager_id
      );

      const managerStores = allStores
        .filter((store) =>
          managerAssignments.some((a) => a.store_id === store.id)
        )
        .map((store) => ({
          storeId: store.id,
          storeName: store.store_name,
          marketName:
            allMarkets.find((m) => m.id === store.market_id)?.name || 'Unassigned',
        }));

      setStores(managerStores);
      console.log(`Loaded ${managerStores.length} stores for manager`);
    } catch (error) {
      console.error('Error loading manager data:', error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    showConfirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      onConfirm: logout,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manager Dashboard</Text>
          <Text style={styles.managerName}>👤 {user?.username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📊 Your Assigned Stores</Text>
          <Text style={styles.infoText}>
            You have access to {stores.length} store{stores.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Stores List */}
        {stores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>❌ No stores assigned yet</Text>
            <Text style={styles.emptySubtext}>
              Contact your admin to assign stores
            </Text>
          </View>
        ) : (
          <View style={styles.storesContainer}>
            {stores.map((store, index) => (
              <View key={store.storeId} style={styles.storeCard}>
                <View style={styles.storeCardHeader}>
                  <View style={styles.storeNumberBadge}>
                    <Text style={styles.storeNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{store.storeName}</Text>
                    <Text style={styles.marketLabel}>🏢 {store.marketName}</Text>
                  </View>
                </View>
                <View style={styles.storeIdContainer}>
                  <Text style={styles.storeIdLabel}>Store ID: </Text>
                  <Text style={styles.storeId}>{store.storeId}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer Info */}
        {stores.length > 0 && (
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>
              ✓ You can view and manage these stores only
            </Text>
            <Text style={styles.footerText}>
              ✓ Contact admin for access changes
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  managerName: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  storesContainer: {
    gap: 12,
  },
  storeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  storeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  marketLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  storeIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  storeIdLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  storeId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  footerInfo: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
    marginBottom: 4,
  },
});