import React, { useState } from 'react';
import { Store, Market, MarketManager } from '../../../types';
import { ActionButton } from '../buttons/ActionButton';
import { Card } from '../Card';
import { View, Text, FlatList } from 'react-native';
import styles from '../styles/adminStyles';


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
}) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

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
                      onPress={() => {}}
                      variant="secondary"
                      size="small"
                    />
                    <ActionButton
                      label="Delete"
                      onPress={async () => { await onDelete(item.id); }}
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
    </View>
  );
};