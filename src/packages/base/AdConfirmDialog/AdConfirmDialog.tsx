import type { FC, ReactNode } from 'react';

import { Group, Text } from '@mantine/core';

import AdModal from '../AdModal/AdModal';

export type AdConfirmDialogProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
};

const AdConfirmDialog: FC<AdConfirmDialogProps> = ({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
}) => {
  return (
    <AdModal opened={opened} onClose={onClose} title={title} size="sm">
      {message ? (
        typeof message === 'string' ? (
          <Text size="sm" c="dimmed">
            {message}
          </Text>
        ) : (
          message
        )
      ) : null}
      <Group justify="flex-end" gap="sm" mt="lg">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: destructive
              ? 'var(--danger, #e53935)'
              : 'var(--primary)',
            color: 'var(--on-primary, #fff)',
            cursor: loading ? 'not-allowed' : 'pointer',
            font: 'inherit',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {confirmLabel}
        </button>
      </Group>
    </AdModal>
  );
};

export default AdConfirmDialog;
