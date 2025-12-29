import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Store, Market, MarketManager } from '../../../types';
import { ActionButton } from '../buttons/ActionButton';
import { Card } from '../Card';
import styles from '../styles/adminStyles';
import { AddStoreModal } from '../modals/AddStoreModal';
import { EditStoreModal } from '../modals/EditStoreModal';

interface StoresTabProps {
  stores: Store[];
  markets: Market[];
  managers: MarketManager[];
  onAdd: (name: string, marketId?: number, storeId?: number, managerId?: number) => Promise<boolean>;
  onEdit: (id: number, name: string, marketId?: number, managerId?: number) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

export const StoresTab: React.FC<StoresTabProps> = ({
  stores,
  markets,
  managers,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setEditModalVisible(true);
  };

  const handleAddClose = () => {
    setAddModalVisible(false);
  };

  const handleEditClose = () => {
    setEditModalVisible(false);
    setSelectedStore(null);
  };

  // Handler for adding a store
  const handleAdd = async (name: string, marketId?: number, storeId?: number, managerId?: number) => {
    try {
      const ok = await onAdd(name, marketId, storeId, managerId);
      if (ok) {
        setAddModalVisible(false);
        await onRefresh();
      }
      return ok;
    } catch {
      return false;
    }
  };

  // Handler for editing a store
  const handleEditSubmit = async (id: number, name: string, marketId?: number, managerId?: number) => {
    try {
      const ok = await onEdit(id, name, marketId, managerId);
      if (ok) {
        setEditModalVisible(false);
        setSelectedStore(null);
        await onRefresh();
      }
      return ok;
    } catch {
      return false;
    }
  };

  // Handler for deleting a store
  const handleDelete = async (id: number) => {
    try {
      const ok = await onDelete(id);
      if (ok) await onRefresh();
    } catch {
      /* ignore */
    }
  };

  return (
    <View style={styles.section}>
      <ActionButton
        label="+ Add Store"
        onPress={() => setAddModalVisible(true)}
        variant="primary"
      />

      <Text style={styles.subtitle}>Store Management ({stores.length})</Text>

      {stores.length === 0 ? (
        <Text style={styles.emptyText}>No stores yet. Create one to get started!</Text>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={stores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const market = markets.find((m) => m.id === item.market_id);
            const manager = managers.find((m) => m.id === item.manager_id);

            return (
              <Card
                title={item.store_name}
                subtitle={`ID: ${item.id}`}
                actions={
                  <View style={styles.actions}>
                    <ActionButton
                      label="Edit"
                      onPress={() => handleEdit(item)}
                      variant="secondary"
                      size="small"
                    />
                    <ActionButton
                      label="Delete"
                      onPress={async () => {
                        await handleDelete(item.id);
                      }}
                      variant="danger"
                      size="small"
                    />
                  </View>
                }
              >
                <View>
                  <Text style={styles.cardMeta}>
                    Market: {market?.name || 'Unassigned'}
                  </Text>
                  <Text style={styles.cardMeta}>
                    Manager: {manager?.name || 'Unassigned'}
                  </Text>
                </View>
              </Card>
            );
          }}
        />
      )}

      {/* Add Store Modal */}
      <AddStoreModal
        visible={addModalVisible}
        markets={markets}
        managers={managers}
        onClose={handleAddClose}
        onSubmit={handleAdd}
      />

      {/* Edit Store Modal */}
      {selectedStore && (
        <EditStoreModal
          visible={editModalVisible}
          store={selectedStore}
          markets={markets}
          managers={managers}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
        />
      )}
    </View>
  );
};