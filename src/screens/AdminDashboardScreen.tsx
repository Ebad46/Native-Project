// FILE: screens/AdminDashboardScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAdminData } from '../hooks/useAdminData';
import { Header } from '../components/Admin/header';
import { TabNavigation } from '../components/Admin/TabNavigation';
import { ManagersTab } from '../components/Admin/tabs/ManagersTab';
import { MarketsTab } from '../components/Admin/tabs/MarketsTab';
import { StoresTab } from '../components/Admin/tabs/StoresTab';
import { showConfirm } from '../components/NotificationSystem';

type TabType = 'managers' | 'markets' | 'stores';

export const AdminDashboardScreen: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('managers');

  const {
    markets,
    managers,
    stores,
    loading,
    refreshData,
    addManager,
    editManager,
    deleteManager,
    addMarket,
    editMarket,
    deleteMarket,
    addStore,
    editStore,
    deleteStore,
  } = useAdminData();

  const handleLogout = useCallback(() => {
    showConfirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: logout,
    });
  }, [logout]);

  const handleRefresh = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  const handleDeleteManager = useCallback(
    (id: number, name: string) => {
      showConfirm({
        title: 'Delete Manager',
        message: `Are you sure you want to delete "${name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDangerous: true,
        onConfirm: () => deleteManager(id),
      });
    },
    [deleteManager]
  );

  const handleDeleteMarket = useCallback(
    (id: number, name: string) => {
      showConfirm({
        title: 'Delete Market',
        message: `Are you sure you want to delete "${name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDangerous: true,
        onConfirm: () => deleteMarket(id),
      });
    },
    [deleteMarket]
  );

  const handleDeleteStore = useCallback(
    (id: number, name: string) => {
      showConfirm({
        title: 'Delete Store',
        message: `Are you sure you want to delete "${name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDangerous: true,
        onConfirm: () => deleteStore(id),
      });
    },
    [deleteStore]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onLogout={handleLogout} />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          managers: managers.length,
          markets: markets.length,
          stores: stores.length,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'managers' && (
          <ManagersTab
            managers={managers}
            markets={markets}
            onAdd={addManager}
            onEdit={editManager}
            onDelete={handleDeleteManager}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'markets' && (
          <MarketsTab
            markets={markets}
            stores={stores}
            managers={managers}
            onAdd={addMarket}
            onEdit={editMarket}
            onDelete={handleDeleteMarket}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'stores' && (
          <StoresTab
            stores={stores}
            markets={markets}
            managers={managers}
            onAdd={addStore}
            onEdit={editStore}
            onDelete={handleDeleteStore}
            onRefresh={handleRefresh}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});