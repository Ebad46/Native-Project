import React, { useState } from 'react';
import { Store, Market, MarketManager } from '../../../types';
import { View, Text, FlatList } from 'react-native';
import { ActionButton } from '../buttons/ActionButton';
import { Card } from '../Card';
import styles from '../styles/adminStyles';
import { AddMarketModal } from '../modals/AddMarketModal';
import { EditMarketModal } from '../modals/EditMarketModal';

interface MarketsTabProps {
  markets: Market[];
  stores: Store[];
  managers: MarketManager[];
  onAdd: (name: string) => Promise<boolean>;
  onEdit: (id: number, name: string) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

export const MarketsTab: React.FC<MarketsTabProps> = ({
  markets,
  stores,
  managers,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const handleEdit = (market: Market) => {
    setSelectedMarket(market);
    setEditModalVisible(true);
  };

  const handleAddClose = () => {
    setAddModalVisible(false);
  };

  const handleEditClose = () => {
    setEditModalVisible(false);
    setSelectedMarket(null);
  };

  // Handler for adding a market
  const handleAdd = async (name: string) => {
    try {
      const ok = await onAdd(name);
      if (ok) {
        setAddModalVisible(false);
        await onRefresh();
      }
      return ok;
    } catch {
      return false;
    }
  };

  // Handler for editing a market
  const handleEditSubmit = async (id: number, name: string) => {
    try {
      const ok = await onEdit(id, name);
      if (ok) {
        setEditModalVisible(false);
        setSelectedMarket(null);
        await onRefresh();
      }
      return ok;
    } catch {
      return false;
    }
  };

  // Handler for deleting a market
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
        <Text style={styles.title}>Add New Market</Text>
      </View>

      <ActionButton
        label="+ Add Market"
        onPress={() => setAddModalVisible(true)}
        variant="primary"
      />

      <Text style={styles.subtitle}>All Markets ({markets.length})</Text>

      {markets.length === 0 ? (
        <Text style={styles.emptyText}>No markets yet. Create one to get started!</Text>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={markets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.name}
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
                  Stores: {stores.filter((s) => s.market_id === item.id).length}
                </Text>
                <Text style={styles.cardMeta}>
                  Managers: {managers.filter((m) => m.market_id === item.id).length}
                </Text>
              </View>
            </Card>
          )}
        />
      )}

      {/* Add Market Modal */}
      <AddMarketModal
        visible={addModalVisible}
        onClose={handleAddClose}
        onSubmit={handleAdd}
      />

      {/* Edit Market Modal */}
      {selectedMarket && (
        <EditMarketModal
          visible={editModalVisible}
          onClose={handleEditClose}
          market={selectedMarket}
          onSubmit={handleEditSubmit}
        />
      )}
    </View>
  );
};