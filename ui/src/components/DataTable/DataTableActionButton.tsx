import { ICellRendererParams } from "@ag-grid-community/core";
import { ActionIcon } from "@mantine/core";

interface DataTableDeleteButtonProps<T> {
  handleClick: (event: React.MouseEvent, rowData: T) => void;
  icon: React.ReactNode; // Can be any React element (e.g., icon components)
  color?: string;
}

function DataTableActionButton<T>({ colDef, node }: ICellRendererParams<T>) {
const {
    handleClick,
    icon,
    color = "red",
  } = colDef?.cellRendererParams as DataTableDeleteButtonProps<T>;

  if (!node.data) return <></>;

  return (
    <ActionIcon
      ml={10}
      color={color}
      onClick={(e) => {
        e.stopPropagation();
        handleClick(e, node.data!)
      }}
    >
      {icon}
    </ActionIcon>
  );
}

export default DataTableActionButton;
