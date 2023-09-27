import React from 'react';
import { Tooltip } from 'antd';
import { getAxleLabel } from '../constants/axles';

export default function AxlesTooltip({ id }) {
  const category = getAxleLabel(id);
  return <Tooltip title={category}>{id}</Tooltip>;
}
