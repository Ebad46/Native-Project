import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { MarketManager, Market } from '../../../types';
import { AddManagerModal } from '../modals/AddManagerModal';
import { EditManagerModal } from '../modals/EditManagerModal';
import { ActionButton } from '../buttons/ActionButton';
import { Card } from '../Card';

interface ManagersTabProps {
  managers: MarketManager[];
  markets: Market[];
  onAdd: (name: string, email: string, password: string, marketId?: number) => Promise<boolean>;
  onEdit: (id: number, name: string, email: string, password?: string, marketId?: number) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

export const ManagersTab: React.FC<ManagersTabProps> = ({
  managers,
  markets,
  onAdd,
  onEdit,
  onDelete,
  onRefresh, // added
}) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<MarketManager | null>(null);

  const handleEdit = (manager: MarketManager) => {
    setSelectedManager(manager);
    setEditModalVisible(true);
  };

  const handleAddClose = () => {
    setAddModalVisible(false);
  };

  const handleEditClose = () => {
    setEditModalVisible(false);
    setSelectedManager(null);
  };

  // local handlers that call parent callbacks and refresh
  const handleAdd = async (name: string, email: string, password: string, marketId?: number) => {
    try {
      const ok = await onAdd(name, email, password, marketId);
      if (ok) {
        setAddModalVisible(false);
        await onRefresh();
      }
      return ok;
    } catch {
      return false;
    }
  };

  const handleEditSubmit = async (id: number, name: string, email: string, password?: string, marketId?: number) => {
    try {
      const ok = await onEdit(id, name, email, password, marketId);
      if (ok) {
        setEditModalVisible(false);
        setSelectedManager(null);
        await onRefresh();
      }
      return ok;
    } catch {
      return false;
    }
  };

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
      <View style={styles.header}>
        <Text style={styles.title}>Add New Manager</Text>
      </View>

      <ActionButton
        label="+ Add Manager"
        onPress={() => setAddModalVisible(true)}
        variant="primary"
      />

      <Text style={styles.subtitle}>All Managers ({managers.length})</Text>

      {managers.length === 0 ? (
        <Text style={styles.emptyText}>No managers yet. Create one to get started!</Text>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={managers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.name}
              subtitle={item.email}
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
                    onPress={async () => { await handleDelete(item.id); }} // use local handler
                    variant="danger"
                    size="small"
                  />
                </View>
              }
            >
              <Text style={styles.cardMeta}>
                {markets.find((m) => m.id === item.market_id)?.name || 'No Market'}
              </Text>
            </Card>
          )}
        />
      )}

      <AddManagerModal
        visible={addModalVisible}
        markets={markets}
        onClose={handleAddClose}
        onSubmit={handleAdd} // wired to local handler
      />

      {selectedManager && (
        <EditManagerModal
          visible={editModalVisible}
          manager={selectedManager}
          markets={markets}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit} // wired to local handler
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    paddingVertical: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
});
