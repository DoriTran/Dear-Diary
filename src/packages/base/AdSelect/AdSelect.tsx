import type { FC } from 'react';

import { Select } from '@mantine/core';

import type { AdSelectProps, AdSelectSingleProps } from './types';

import styles from './AdSelect.module.css';
import AdSelectMultiple from './AdSelectMultiple';

const AdSelectSingle: FC<AdSelectSingleProps> = ({
  label,
  placeholder,
  data,
  value,
  onChange,
  disabled,
  required,
  classNames,
  ...rest
}) => {
  const mergedClassNames = {
    label: styles.label,
    input: styles.input,
    dropdown: styles.dropdown,
    option: styles.option,
    ...classNames,
  };

  return (
    <Select
      {...rest}
      label={label}
      placeholder={placeholder}
      data={data}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      classNames={mergedClassNames}
    />
  );
};

const AdSelect: FC<AdSelectProps> = (props) => {
  if (props.multiple) {
    return <AdSelectMultiple {...props} />;
  }

  return <AdSelectSingle {...props} />;
};

export default AdSelect;
