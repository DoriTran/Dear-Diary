import type { FC } from 'react';

import type { AdSelectProps } from './types';

import AdSelectMultiple from './AdSelectMultiple';
import AdSelectSingle from './AdSelectSingle';

const AdSelect: FC<AdSelectProps> = (props) => {
  if (props.multiple) {
    return <AdSelectMultiple {...props} />;
  }

  return <AdSelectSingle {...props} />;
};

export default AdSelect;
