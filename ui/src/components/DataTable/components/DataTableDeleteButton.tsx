import React, { useRef } from 'react';

import { ActionIcon } from '@mantine/core';
import { ICellRendererParams } from 'ag-grid-community';

interface DataTableDeleteButtonProps<T> {
  handleClick: (event: React.MouseEvent, rowData: T) => void;
  icon: React.ReactNode;
  color?: string;
  disabled?: boolean;
}

function DataTableDeleteButton<T>({ colDef, node }: ICellRendererParams<T>) {
  const {
    handleClick,
    icon,
    color = 'red',
    disabled = false,
  } = colDef?.cellRendererParams as DataTableDeleteButtonProps<T>;

  const processRef = useRef(false);

  const onClick = (e: React.MouseEvent, d: T) => {
    if (processRef.current) return;
    e.preventDefault();

    processRef.current = true;

    handleClick(e, d);
  };

  if (!node.data) return null;

  return (
    <ActionIcon
      ml={10}
      color={color}
      variant="subtle"
      onClick={e => onClick(e, node.data!)}
      disabled={disabled}>
      {icon}
    </ActionIcon>
  );
}

export default DataTableDeleteButton;