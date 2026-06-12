import type { ComboboxItem, SelectProps } from '@mantine/core';
import type { ReactNode } from 'react';

import type { AdChipProps } from '../AdChip';

export const CREATE_OPTION_VALUE = '__adselect_create__';

export type AdSelectOption = ComboboxItem & {
  color?: string;
};

export type AdSelectBaseProps = {
  label?: string;
  placeholder?: string;
  data: AdSelectOption[];
  disabled?: boolean;
  required?: boolean;
  classNames?: Record<string, string>;
};

export type AdSelectSingleProps = AdSelectBaseProps &
  Omit<
    SelectProps,
    'data' | 'value' | 'onChange' | 'label' | 'placeholder' | 'multiple'
  > & {
    multiple?: false;
    value: string | null;
    onChange: (value: string | null) => void;
  };

export type AdSelectRenderPillInput = {
  option: AdSelectOption;
  value: string;
  onRemove?: () => void;
  disabled?: boolean;
  reorderProps?: AdChipProps['reorderProps'];
};

export type AdSelectMultipleProps = AdSelectBaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  searchable?: boolean;
  hidePickedOptions?: boolean;
  emptyLabel?: string;
  create?: boolean;
  createLabel?: string | ((input: string) => string);
  onCreate?: (input: string) => void;
  renderPill?: (input: AdSelectRenderPillInput) => ReactNode;
};

export type AdSelectProps = AdSelectSingleProps | AdSelectMultipleProps;
