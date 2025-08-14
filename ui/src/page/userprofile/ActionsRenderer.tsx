// imports:
import type { ICellRendererParams } from "@ag-grid-community/core";
import { ActionIcon } from "@mantine/core";
import { BsTrash } from "react-icons/bs";
import UserRelationProps from "./types";

type ActionsRendererParams = ICellRendererParams<UserRelationProps> & {
  onDelete: (e: React.MouseEvent, user: UserRelationProps) => void;
};

export const ActionsRenderer: React.FC<ActionsRendererParams> = (params) => {
  const user = params.data!;
  return (
    <ActionIcon
      ml="xs"
      color="red"
      onClick={(e) => params.onDelete(e, user)}
      title="Sil"
    >
      <BsTrash />
    </ActionIcon>
  );
};
