import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Market } from '../../../types';
import { ActionButton } from '../buttons/ActionButton';
import { FormInput } from '../inputs/FormInput';
import { Picker } from '@react-native-picker/picker';

interface AddManagerModalProps {
  visible: boolean;
  markets: Market[];
  onClose: () => void;
  onSubmit: (name: string, email: string, password: string, marketId?: number) => Promise<boolean>;
}

export const AddManagerModal: React.FC<AddManagerModalProps> = ({
  visible,
  markets,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marketId, setMarketId] = useState<number | null>(null);

  const handleSubmit = async () => {
    const success = await onSubmit(name, email, password, marketId || undefined);
    if (success) {
      setName('');
      setEmail('');
      setPassword('');
      setMarketId(null);
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
          <Text style={styles.title}>Add Manager</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content}>
          <FormInput
            label="Manager Name *"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
          />

          <FormInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
            keyboardType="email-address"
          />

          <FormInput
            label="Password *"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Assign to Market</Text>
            <Picker
              selectedValue={marketId}
              onValueChange={(value: number | null) => setMarketId(value)}
              style={styles.picker}
            >
              <Picker.Item label="No Market" value={null} />
              {markets.map((m) => (
                <Picker.Item key={m.id} label={m.name} value={m.id} />
              ))}
            </Picker>
          </View>

          <ActionButton
            label="Create Manager"
            onPress={handleSubmit}
            variant="primary"
            size="large"
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeBtn: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});