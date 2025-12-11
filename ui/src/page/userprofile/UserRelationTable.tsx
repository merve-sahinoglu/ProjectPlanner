// src/features/user-relation/UserRelationTable.tsx
import { useMemo } from "react";
import { ActionIcon, Avatar, Badge, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type {
  ICellRendererParams,
} from "ag-grid-community";
import UserRelationProps from "./types";
import DataTable from "../../components/DataTable/DataTable";

type Props = {
  records: UserRelationProps[];
  onEdit: (row: UserRelationProps) => void;
  onDelete: (id: string) => void;
  isFetching?: boolean;
  height?: number | string;
  rowHeight?: number;
  /** search bar’dan gelen quick filter */
  quickFilter?: string;
  onApiReady?: (api: unknown) => void;
};

const UserCell: React.FC<ICellRendererParams<UserRelationProps>> = ({
  data,
}) => {
  if (!data) return null;
  const initials = (data.userFullName?.[0] ?? "?").toUpperCase();
  return (
    <Group gap={8}>
      <Avatar size="sm" radius="xl" color="grape">
        {initials}
      </Avatar>
      <span style={{ fontWeight: 600 }}>{data.userFullName}</span>
    </Group>
  );
};

const GroupCell: React.FC<ICellRendererParams<UserRelationProps>> = ({
  data,
}) => {
  if (!data) return null;
  return (
    <Badge variant="light" color="indigo">
      {data.profileGroupName}
    </Badge>
  );
};

type ActionParams = ICellRendererParams<UserRelationProps> & {
  onEdit: (row: UserRelationProps) => void;
  onDelete: (id: string) => void;
};

const ActionsRenderer: React.FC<ActionParams> = (p) => {
  const { data, onEdit, onDelete } = p;
  if (!data) return null;
  return (
    <Group gap="xs" justify="flex-end" w="100%">
      <Tooltip label="Düzenle" withArrow>
        <ActionIcon variant="light" color="grape" onClick={() => onEdit(data)}>
          <IconEdit size={16} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Sil" color="red" withArrow>
        <ActionIcon
          variant="light"
          color="red"
          onClick={() => onDelete(data.id)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default function UserRelationTable({
  records,
  onEdit,
  onDelete,
  isFetching = false,
  height = 520,
  rowHeight = 44,
  quickFilter,
  onApiReady,
}: Props) {
  const columns = useMemo(
    () => [
      {
        headerName: "User",
        field: "userFullName" as keyof UserRelationProps,
        minWidth: 180,
        cellRenderer: UserCell as unknown,
      },
      {
        headerName: "Profile Group",
        field: "profileGroupName" as keyof UserRelationProps,
        minWidth: 160,
        cellRenderer: GroupCell as unknown,
      },
      {
        headerName: "Actions",
        field: "id" as keyof UserRelationProps,
        cellRenderer: ActionsRenderer as unknown,
        cellRendererParams: { onEdit, onDelete },
        minWidth: 50,
        pinned: 'right' as const,
        sortable: false,
        filter: false,
        suppressMenu: true,
        maxWidth: 100,
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable<UserRelationProps>
      records={records}
      columns={columns}
      isFetching={isFetching}
      h={height}
      rowHeight={rowHeight}
      hasPagination
      className="kids" // pastel tema
      quickFilterText={quickFilter}
      onApiReady={onApiReady}
    />
  );
}
