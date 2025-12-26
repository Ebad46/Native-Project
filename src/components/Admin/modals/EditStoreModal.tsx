import React, { useState } from 'react';
import { Store } from '../../../types';
import { Market } from '../../../types';
import { MarketManager } from '../../../types';
import { ActionButton } from '../buttons/ActionButton';
import { FormInput } from '../inputs/FormInput';
import { Modal, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/adminStyles';
import { Picker } from '@react-native-picker/picker';


interface EditStoreModalProps {
  visible: boolean;
  store: Store;
  markets: Market[];
  managers: MarketManager[];
  onClose: () => void;
  onSubmit: (id: number, name: string, marketId?: number, managerId?: number) => Promise<boolean>;
}

export const EditStoreModal: React.FC<EditStoreModalProps> = ({
  visible,
  store,
  markets,
  managers,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(store.store_name);
  const [marketId, setMarketId] = useState<number | null>(store.market_id);
  const [managerId, setManagerId] = useState<number | null>(store.manager_id || null);

  const handleSubmit = async () => {
    const success = await onSubmit(store.id, name, marketId || undefined, managerId || undefined);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Store</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content}>
          <FormInput
            label="Store ID (Read-only)"
            value={store.id.toString()}
            onChangeText={() => {}}
            editable={false}
          />

          <FormInput
            label="Store Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Store A"
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Market</Text>
            <Picker
              selectedValue={marketId}
              onValueChange={(value) => setMarketId(value)}
              style={styles.picker}
            >
              <Picker.Item label="No Market" value={null} />
              {markets.map((m) => (
                <Picker.Item key={m.id} label={m.name} value={m.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Manager</Text>
            <Picker
              selectedValue={managerId}
              onValueChange={(value) => setManagerId(value)}
              style={styles.picker}
            >
              <Picker.Item label="No Manager" value={null} />
              {managers.map((m) => (
                <Picker.Item key={m.id} label={m.name} value={m.id} />
              ))}
            </Picker>
          </View>

          <ActionButton
            label="Save Changes"
            onPress={handleSubmit}
            variant="primary"
            size="large"
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};