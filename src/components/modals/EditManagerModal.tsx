interface EditManagerModalProps {
  visible: boolean;
  manager: MarketManager;
  markets: Market[];
  onClose: () => void;
  onSubmit: (id: number, name: string, email: string, password?: string, marketId?: number) => Promise<boolean>;
}

export const EditManagerModal: React.FC<EditManagerModalProps> = ({
  visible,
  manager,
  markets,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(manager.name);
  const [email, setEmail] = useState(manager.email);
  const [password, setPassword] = useState('');
  const [marketId, setMarketId] = useState<number | null>(manager.market_id);

  const handleSubmit = async () => {
    const success = await onSubmit(manager.id, name, email, password || undefined, marketId || undefined);
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
          <Text style={styles.title}>Edit Manager</Text>
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
            label="New Password (Leave empty to keep current)"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
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