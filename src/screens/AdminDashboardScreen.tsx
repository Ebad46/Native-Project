// src/screens/AdminDashboardScreen.tsx (WITH EDIT FUNCTIONALITY)

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Modal,
  Picker,
  FlatList,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Market, MarketManager, Store } from '../types';
import { marketService, managerService, storeService, assignmentService } from '../lib/db';
import { showToast, showConfirm } from '../components/NotificationSystem';

interface ComprehensiveData {
  storeId: number;
  storeName: string;
  marketId: number | null;
  marketName: string | null;
  managerId: number | null;
  managerName: string | null;
  managerEmail: string | null;
}

type TabType = 'managers' | 'markets' | 'stores';

export const AdminDashboardScreen: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('managers');
  const [loading, setLoading] = useState(true);

  // Data states
  const [markets, setMarkets] = useState<Market[]>([]);
  const [managers, setManagers] = useState<MarketManager[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveData[]>([]);

  // Add Manager form
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerMarket, setManagerMarket] = useState<number | null>(null);

  // Edit Manager
  const [editingManager, setEditingManager] = useState<MarketManager | null>(null);
  const [editManagerModalVisible, setEditManagerModalVisible] = useState(false);

  // Add Market form
  const [marketName, setMarketName] = useState('');

  // Edit Market
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [editMarketModalVisible, setEditMarketModalVisible] = useState(false);

  // Store Management
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreMarket, setNewStoreMarket] = useState<number | null>(null);
  const [newStoreManager, setNewStoreManager] = useState<number | null>(null);
  const [storeModalVisible, setStoreModalVisible] = useState(false);

  // Edit Store
  const [editingStore, setEditingStore] = useState<ComprehensiveData | null>(null);
  const [editStoreModalVisible, setEditStoreModalVisible] = useState(false);

  // Reassign modal
  const [reassignModalData, setReassignModalData] = useState<{
    storeId: number;
    oldManagerId: number | null;
    visible: boolean;
  }>({
    storeId: 0,
    oldManagerId: null,
    visible: false,
  });
  const [reassignManagerId, setReassignManagerId] = useState<number | null>(null);
  const [reassignMarketFilter, setReassignMarketFilter] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [marketsData, managersData, storesData, assignmentsData] = await Promise.all([
        marketService.getAll(),
        managerService.getAll(),
        storeService.getAll(),
        assignmentService.getAll(),
      ]);

      setMarkets(marketsData);
      setManagers(managersData);
      setStores(storesData);
      setAssignments(assignmentsData);

      const comprehensiveData: ComprehensiveData[] = storesData.map((store) => {
        const market = marketsData.find((m) => m.id === store.market_id);
        const assignment = assignmentsData.find((a) => a.store_id === store.id);
        const manager = managersData.find((m) => m.id === assignment?.manager_id);

        return {
          storeId: store.id,
          storeName: store.store_name,
          marketId: store.market_id,
          marketName: market?.name || 'Unassigned',
          managerId: manager?.id || null,
          managerName: manager?.name || 'Unassigned',
          managerEmail: manager?.email || 'N/A',
        };
      });

      setComprehensiveData(comprehensiveData);
    } finally {
      setLoading(false);
    }
  };

  // ===== MANAGER FUNCTIONS =====
  const handleAddManager = async () => {
    if (!managerName.trim() || !managerEmail.trim() || !managerPassword.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const newManager = await managerService.create(
        managerName,
        managerEmail,
        managerMarket,
        managerPassword
      );
      if (newManager) {
        showToast(`Manager "${managerName}" created!`, 'success');
        setManagerName('');
        setManagerEmail('');
        setManagerPassword('');
        setManagerMarket(null);
        await loadData();
      } else {
        showToast('Failed to create manager', 'error');
      }
    } catch (error) {
      showToast('Failed to create manager', 'error');
    }
  };

  const handleEditManager = (manager: MarketManager) => {
    setEditingManager(manager);
    setManagerName(manager.name);
    setManagerEmail(manager.email);
    setManagerMarket(manager.market_id);
    setManagerPassword(''); // Don't show password
    setEditManagerModalVisible(true);
  };

  const handleSaveManager = async () => {
    if (!editingManager) return;
    if (!managerName.trim() || !managerEmail.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const success = await managerService.update(
        editingManager.id,
        managerName,
        managerEmail,
        managerMarket
      );
      if (success) {
        showToast(`Manager updated!`, 'success');
        setEditingManager(null);
        setEditManagerModalVisible(false);
        setManagerName('');
        setManagerEmail('');
        setManagerMarket(null);
        await loadData();
      } else {
        showToast('Failed to update manager', 'error');
      }
    } catch (error) {
      showToast('Failed to update manager', 'error');
    }
  };

  const handleDeleteManager = (managerId: number, managerName: string) => {
    showConfirm({
      title: 'Delete Manager',
      message: `Delete "${managerName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const success = await managerService.delete(managerId);
          if (success) {
            showToast('Manager deleted', 'success');
            await loadData();
          } else {
            showToast('Failed to delete manager', 'error');
          }
        } catch (error) {
          showToast('Failed to delete manager', 'error');
        }
      },
    });
  };

  // ===== MARKET FUNCTIONS =====
  const handleAddMarket = async () => {
    if (!marketName.trim()) {
      showToast('Please enter market name', 'error');
      return;
    }

    try {
      const newMarket = await marketService.create(marketName);
      if (newMarket) {
        showToast(`Market created!`, 'success');
        setMarketName('');
        await loadData();
      } else {
        showToast('Failed to create market', 'error');
      }
    } catch (error) {
      showToast('Failed to create market', 'error');
    }
  };

  const handleEditMarket = (market: Market) => {
    setEditingMarket(market);
    setMarketName(market.name);
    setEditMarketModalVisible(true);
  };

  const handleSaveMarket = async () => {
    if (!editingMarket) return;
    if (!marketName.trim()) {
      showToast('Please enter market name', 'error');
      return;
    }

    try {
      const success = await marketService.update(editingMarket.id, marketName);
      if (success) {
        showToast('Market updated!', 'success');
        setEditingMarket(null);
        setEditMarketModalVisible(false);
        setMarketName('');
        await loadData();
      } else {
        showToast('Failed to update market', 'error');
      }
    } catch (error) {
      showToast('Failed to update market', 'error');
    }
  };

  const handleDeleteMarket = (marketId: number, marketName: string) => {
    showConfirm({
      title: 'Delete Market',
      message: `Delete "${marketName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const success = await marketService.delete(marketId);
          if (success) {
            showToast('Market deleted', 'success');
            await loadData();
          } else {
            showToast('Failed to delete market', 'error');
          }
        } catch (error) {
          showToast('Failed to delete market', 'error');
        }
      },
    });
  };

  // ===== STORE FUNCTIONS =====
  const handleAddStore = async () => {
    if (!newStoreName.trim()) {
      showToast('Please enter store name', 'error');
      return;
    }

    try {
      const store = await storeService.create(newStoreName, newStoreMarket);
      if (!store) {
        showToast('Failed to create store', 'error');
        return;
      }

      if (newStoreManager && store.id) {
        await assignmentService.assign(newStoreManager, store.id);
      }

      showToast('Store created!', 'success');
      setNewStoreName('');
      setNewStoreMarket(null);
      setNewStoreManager(null);
      setStoreModalVisible(false);
      await loadData();
    } catch (error) {
      showToast('Failed to create store', 'error');
    }
  };

  const handleEditStore = (store: ComprehensiveData) => {
    setEditingStore(store);
    setNewStoreName(store.storeName);
    setNewStoreMarket(store.marketId);
    setNewStoreManager(store.managerId);
    setEditStoreModalVisible(true);
  };

  const handleSaveStore = async () => {
    if (!editingStore) return;
    if (!newStoreName.trim()) {
      showToast('Please enter store name', 'error');
      return;
    }

    try {
      const success = await storeService.update(editingStore.storeId, newStoreMarket);
      if (success) {
        showToast('Store updated!', 'success');
        setEditingStore(null);
        setEditStoreModalVisible(false);
        setNewStoreName('');
        setNewStoreMarket(null);
        setNewStoreManager(null);
        await loadData();
      } else {
        showToast('Failed to update store', 'error');
      }
    } catch (error) {
      showToast('Failed to update store', 'error');
    }
  };

  const handleDeleteStore = (storeId: number, storeName: string) => {
    showConfirm({
      title: 'Delete Store',
      message: `Delete "${storeName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const assignment = assignments.find((a) => a.store_id === storeId);
          if (assignment) {
            await assignmentService.unassign(assignment.manager_id, storeId);
          }

          const success = await storeService.delete(storeId);
          if (success) {
            showToast('Store deleted!', 'success');
            await loadData();
          } else {
            showToast('Failed to delete store', 'error');
          }
        } catch (error) {
          showToast('Failed to delete store', 'error');
        }
      },
    });
  };

  const handleReassignManager = (storeId: number, oldManagerId: number | null) => {
    setReassignManagerId(oldManagerId);
    setReassignMarketFilter(null);
    setReassignModalData({
      storeId,
      oldManagerId,
      visible: true,
    });
  };

  const handleConfirmReassign = async () => {
    try {
      if (reassignModalData.oldManagerId) {
        await assignmentService.unassign(
          reassignModalData.oldManagerId,
          reassignModalData.storeId
        );
      }

      if (reassignManagerId) {
        await assignmentService.assign(reassignManagerId, reassignModalData.storeId);
      }

      showToast('Manager reassigned!', 'success');
      setReassignManagerId(null);
      setReassignMarketFilter(null);
      setReassignModalData({ storeId: 0, oldManagerId: null, visible: false });
      await loadData();
    } catch (error) {
      showToast('Failed to reassign manager', 'error');
    }
  };

  const handleLogout = () => {
    showConfirm({
      title: 'Logout',
      message: 'Are you sure?',
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
        <Text style={styles.headerTitle}>Brake Time Admin</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['managers', 'markets', 'stores'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab as TabType)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === 'managers'
                ? `Managers (${managers.length})`
                : tab === 'markets'
                ? `Markets (${markets.length})`
                : `Stores (${stores.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== MANAGERS TAB ===== */}
        {activeTab === 'managers' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add New Manager</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Manager Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter manager name"
                value={managerName}
                onChangeText={setManagerName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Manager Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter manager email"
                value={managerEmail}
                onChangeText={setManagerEmail}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Login Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={managerPassword}
                onChangeText={setManagerPassword}
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Assign to Market</Text>
              <Picker
                selectedValue={managerMarket}
                onValueChange={(value) => setManagerMarket(value)}
                style={styles.picker}
              >
                <Picker.Item label="No Market" value={null} />
                {markets.map((market) => (
                  <Picker.Item key={market.id} label={market.name} value={market.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddManager}>
              <Text style={styles.addBtnText}>+ Add Manager</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>All Managers</Text>
            {managers.length === 0 ? (
              <Text style={styles.emptyText}>No managers</Text>
            ) : (
              <FlatList
                scrollEnabled={false}
                data={managers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSubtitle}>{item.email}</Text>
                      <Text style={styles.cardSubtitle}>
                        {markets.find((m) => m.id === item.market_id)?.name || 'No Market'}
                      </Text>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.editCardBtn}
                        onPress={() => handleEditManager(item)}
                      >
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteCardBtn}
                        onPress={() => handleDeleteManager(item.id, item.name)}
                      >
                        <Text style={styles.deleteBtnText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* ===== MARKETS TAB ===== */}
        {activeTab === 'markets' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add New Market</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Market Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter market name"
                value={marketName}
                onChangeText={setMarketName}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddMarket}>
              <Text style={styles.addBtnText}>+ Add Market</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>All Markets</Text>
            {markets.length === 0 ? (
              <Text style={styles.emptyText}>No markets</Text>
            ) : (
              <FlatList
                scrollEnabled={false}
                data={markets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        Stores: {stores.filter((s) => s.market_id === item.id).length}
                      </Text>
                      <Text style={styles.cardSubtitle}>
                        Managers: {managers.filter((m) => m.market_id === item.id).length}
                      </Text>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.editCardBtn}
                        onPress={() => handleEditMarket(item)}
                      >
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteCardBtn}
                        onPress={() => handleDeleteMarket(item.id, item.name)}
                      >
                        <Text style={styles.deleteBtnText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* ===== STORES TAB ===== */}
        {activeTab === 'stores' && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.addBtn} onPress={() => setStoreModalVisible(true)}>
              <Text style={styles.addBtnText}>+ Add Store</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Store Management</Text>
            {comprehensiveData.length === 0 ? (
              <Text style={styles.emptyText}>No stores yet</Text>
            ) : (
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, { flex: 0.7 }]}>ID</Text>
                  <Text style={[styles.headerCell, { flex: 1.3 }]}>Store</Text>
                  <Text style={[styles.headerCell, { flex: 1 }]}>Market</Text>
                  <Text style={[styles.headerCell, { flex: 1 }]}>Manager</Text>
                  <Text style={[styles.headerCell, { flex: 1.2 }]}>Actions</Text>
                </View>

                {comprehensiveData.map((item) => (
                  <View key={item.storeId} style={styles.tableRow}>
                    <Text style={[styles.cell, { flex: 0.7 }]}>{item.storeId}</Text>
                    <Text style={[styles.cell, { flex: 1.3 }]}>{item.storeName}</Text>
                    <Text style={[styles.cell, { flex: 1 }]}>{item.marketName}</Text>
                    <Text style={[styles.cell, { flex: 1 }]}>{item.managerName}</Text>
                    <View style={[styles.cell, { flex: 1.2, flexDirection: 'column' }]}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleEditStore(item)}
                      >
                        <Text style={styles.actionBtnText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.deleteActionBtn]}
                        onPress={() => handleDeleteStore(item.storeId, item.storeName)}
                      >
                        <Text style={styles.actionBtnText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Store Modal */}
      <Modal visible={storeModalVisible} animationType="slide" onRequestClose={() => setStoreModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setStoreModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Store</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Store Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter store name"
                value={newStoreName}
                onChangeText={setNewStoreName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Select Market</Text>
              <Picker
                selectedValue={newStoreMarket}
                onValueChange={(value) => setNewStoreMarket(value)}
                style={styles.picker}
              >
                <Picker.Item label="No Market" value={null} />
                {markets.map((market) => (
                  <Picker.Item key={market.id} label={market.name} value={market.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Assign Manager</Text>
              <Picker
                selectedValue={newStoreManager}
                onValueChange={(value) => setNewStoreManager(value)}
                style={styles.picker}
              >
                <Picker.Item label="No Manager" value={null} />
                {managers.map((manager) => (
                  <Picker.Item
                    key={manager.id}
                    label={`${manager.name}`}
                    value={manager.id}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddStore}>
              <Text style={styles.submitBtnText}>Create Store</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Store Modal */}
      <Modal visible={editStoreModalVisible} animationType="slide" onRequestClose={() => setEditStoreModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditStoreModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Store</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Store Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter store name"
                value={newStoreName}
                onChangeText={setNewStoreName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Market</Text>
              <Picker
                selectedValue={newStoreMarket}
                onValueChange={(value) => setNewStoreMarket(value)}
                style={styles.picker}
              >
                <Picker.Item label="No Market" value={null} />
                {markets.map((market) => (
                  <Picker.Item key={market.id} label={market.name} value={market.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Manager</Text>
              <Picker
                selectedValue={newStoreManager}
                onValueChange={(value) => setNewStoreManager(value)}
                style={styles.picker}
              >
                <Picker.Item label="No Manager" value={null} />
                {managers.map((manager) => (
                  <Picker.Item key={manager.id} label={manager.name} value={manager.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveStore}>
              <Text style={styles.submitBtnText}>Save Store</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Manager Modal */}
      <Modal visible={editManagerModalVisible} animationType="slide" onRequestClose={() => setEditManagerModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditManagerModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Manager</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Manager Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter manager name"
                value={managerName}
                onChangeText={setManagerName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Manager Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter manager email"
                value={managerEmail}
                onChangeText={setManagerEmail}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Assign to Market</Text>
              <Picker
                selectedValue={managerMarket}
                onValueChange={(value) => setManagerMarket(value)}
                style={styles.picker}
              >
                <Picker.Item label="No Market" value={null} />
                {markets.map((market) => (
                  <Picker.Item key={market.id} label={market.name} value={market.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveManager}>
              <Text style={styles.submitBtnText}>Save Manager</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Market Modal */}
      <Modal visible={editMarketModalVisible} animationType="slide" onRequestClose={() => setEditMarketModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditMarketModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Market</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Market Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter market name"
                value={marketName}
                onChangeText={setMarketName}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveMarket}>
              <Text style={styles.submitBtnText}>Save Market</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
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
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#2563eb',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2937',
    marginTop: 20,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editCardBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  deleteCardBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 10,
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'flex-start',
  },
  cell: {
    fontSize: 10,
    color: '#1f2937',
  },
  actionBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 2,
    marginBottom: 2,
  },
  deleteActionBtn: {
    backgroundColor: '#ef4444',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCloseText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    padding: 16,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});