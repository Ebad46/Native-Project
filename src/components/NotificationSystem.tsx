// src/components/NotificationSystem.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  isDangerous?: boolean;
}

let toastManager: {
  show: (message: string, type: ToastType, duration?: number) => void;
} | null = null;

let confirmManager: {
  show: (options: ConfirmOptions) => void;
} | null = null;

export const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
  if (toastManager) {
    toastManager.show(message, type, duration);
  }
};

export const showConfirm = (options: ConfirmOptions) => {
  if (confirmManager) {
    confirmManager.show(options);
  }
};

// Toast Component
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastManager = {
      show: (message: string, type: ToastType, duration: number = 3000) => {
        const id = Date.now().toString();
        const newToast: ToastMessage = { id, message, type, duration };
        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, duration);
        }
      },
    };

    return () => {
      toastManager = null;
    };
  }, []);

  return (
    <View style={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}
    </View>
  );
};

const ToastItem: React.FC<{
  message: string;
  type: ToastType;
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose());
    }, 2700);

    return () => clearTimeout(timer);
  }, [opacity, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#10b981', icon: '✓' };
      case 'error':
        return { backgroundColor: '#ef4444', icon: '✕' };
      case 'warning':
        return { backgroundColor: '#f59e0b', icon: '!' };
      default:
        return { backgroundColor: '#3b82f6', icon: 'ℹ' };
    }
  };

  const { backgroundColor, icon } = getStyles();

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor, opacity },
      ]}
    >
      <Text style={styles.toastIcon}>{icon}</Text>
      <Text style={styles.toastMessage}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.toastClose}>
        <Text style={styles.toastCloseText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Confirmation Modal Component
export const ConfirmationModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    confirmManager = {
      show: (opts: ConfirmOptions) => {
        setOptions(opts);
        setVisible(true);
      },
    };

    return () => {
      confirmManager = null;
    };
  }, []);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (options?.onConfirm) {
        await options.onConfirm();
      }
      setVisible(false);
      setOptions(null);
    } catch (error) {
      console.error('Confirmation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setOptions(null);
  };

  if (!options) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{options.title}</Text>
          <Text style={styles.modalMessage}>{options.message}</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>
                {options.cancelText || 'Cancel'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                options.isDangerous
                  ? styles.dangerButton
                  : styles.confirmButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text
                style={
                  options.isDangerous
                    ? styles.dangerButtonText
                    : styles.confirmButtonText
                }
              >
                {loading ? 'Processing...' : options.confirmText || 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    pointerEvents: 'none',
  },
  toast: {
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  toastIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  toastMessage: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  toastClose: {
    marginLeft: 10,
    padding: 4,
  },
  toastCloseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});