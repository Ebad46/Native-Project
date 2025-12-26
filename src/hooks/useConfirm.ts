import { useState, useCallback } from 'react';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);

  const show = useCallback((options: ConfirmOptions) => {
    setConfirmState(options);
  }, []);

  const confirm = useCallback(async () => {
    if (confirmState?.onConfirm) {
      await confirmState.onConfirm();
    }
    setConfirmState(null);
  }, [confirmState]);

  const cancel = useCallback(() => {
    if (confirmState?.onCancel) {
      confirmState.onCancel();
    }
    setConfirmState(null);
  }, [confirmState]);

  return {
    confirmState,
    show,
    confirm,
    cancel,
  };
};