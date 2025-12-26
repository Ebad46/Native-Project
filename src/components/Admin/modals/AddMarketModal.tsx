import React, { useState } from 'react';
import { ActionButton } from '../buttons/ActionButton';
import { FormInput } from '../inputs/FormInput';
import { Modal, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/adminStyles';

interface AddMarketModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
}

export const AddMarketModal: React.FC<AddMarketModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    const success = await onSubmit(name);
    if (success) {
      setName('');
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
          <Text style={styles.title}>Add Market</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content}>
          <FormInput
            label="Market Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g., North Market"
          />

          <ActionButton
            label="Create Market"
            onPress={handleSubmit}
            variant="primary"
            size="large"
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
