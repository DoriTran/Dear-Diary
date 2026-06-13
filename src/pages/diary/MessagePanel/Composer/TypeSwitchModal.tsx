import type { FC } from 'react';

import { Button, Group, Text } from '@mantine/core';

import type { MessageType } from '@/store/diary/type';

import { AdModal } from '@/packages/base';

export type TypeSwitchModalProps = {
  nextType: MessageType | null;
  onConfirm: () => void;
  onCancel: () => void;
};

const TypeSwitchModal: FC<TypeSwitchModalProps> = ({
  nextType,
  onConfirm,
  onCancel,
}) => {
  return (
    <AdModal
      opened={nextType !== null}
      onClose={onCancel}
      title="Switch type?"
      size="sm"
    >
      <Text size="sm">
        Current content will be converted if possible. Continue?
      </Text>
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Switch Type</Button>
      </Group>
    </AdModal>
  );
};

export default TypeSwitchModal;
