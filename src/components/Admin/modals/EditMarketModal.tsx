import { Market } from '../../../types';
import React, { useState } from 'react';
import { ActionButton } from '../buttons/ActionButton';
import { FormInput } from '../inputs/FormInput';
import { Modal, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/adminStyles';

interface EditMarketModalProps {
  visible: boolean;
  market: Market;
  onClose: () => void;
  onSubmit: (id: number, name: string) => Promise<boolean>;
}

export const EditMarketModal: React.FC<EditMarketModalProps> = ({
  visible,
  market,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(market.name);

  const handleSubmit = async () => {
    const success = await onSubmit(market.id, name);
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
          <Text style={styles.title}>Edit Market</Text>
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
