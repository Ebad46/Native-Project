import { Store } from '../../../types';
import React, { useState } from 'react';
import { Market } from '../../../types';
import { MarketManager } from '../../../types';
import { ActionButton } from '../buttons/ActionButton';
import { FormInput } from '../inputs/FormInput';
import { Modal, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/adminStyles';
import { Picker } from '@react-native-picker/picker';

interface AddStoreModalProps {
  visible: boolean;
  markets: Market[];
  managers: MarketManager[];
  onClose: () => void;
  onSubmit: (name: string, marketId?: number, storeId?: number, managerId?: number) => Promise<boolean>;
}

export const AddStoreModal: React.FC<AddStoreModalProps> = ({
  visible,
  markets,
  managers,
  onClose,
  onSubmit,
}) => {
  const [storeId, setStoreId] = useState('');
  const [name, setName] = useState('');
  const [marketId, setMarketId] = useState<number | null>(null);
  const [managerId, setManagerId] = useState<number | null>(null);

  const handleSubmit = async () => {
    const success = await onSubmit(
      name,
      marketId || undefined,
      storeId ? parseInt(storeId) : undefined,
      managerId || undefined
    );
    if (success) {
      setStoreId('');
      setName('');
      setMarketId(null);
      setManagerId(null);
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
          <Text style={styles.title}>Add Store</Text>
          <View style={{ width: 60 }} />
        </View>
        

        <ScrollView style={styles.content}>
          <FormInput
            label="Store ID (Optional)"
            value={storeId}
            onChangeText={setStoreId}
            placeholder="Auto-generate if empty"
            keyboardType="numeric"
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
            <Text style={styles.label}>Assign Manager</Text>
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
            label="Create Store"
            onPress={handleSubmit}
            variant="primary"
            size="large"
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
