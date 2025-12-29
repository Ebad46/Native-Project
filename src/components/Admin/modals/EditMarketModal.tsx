import React, { useState, useEffect } from 'react';
import { Modal, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Market } from '../../../types';
import { ActionButton } from '../buttons/ActionButton';
import { FormInput } from '../inputs/FormInput';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update state when market prop changes
  useEffect(() => {
    setName(market.name);
  }, [market]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Basic validation
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a market name');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(market.id, name.trim());
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating market:', error);
      Alert.alert('Error', 'Failed to update market. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
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
            placeholder="Enter market name"
            editable={!isSubmitting}
          />

          <ActionButton
            label={isSubmitting ? "Saving..." : "Save Changes"}
            onPress={handleSubmit}
            variant="primary"
            size="large"
            disabled={isSubmitting}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};