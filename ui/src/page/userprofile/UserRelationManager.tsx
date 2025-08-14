// src/features/user-relation/UserRelationManager.tsx
import { useMemo, useRef, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconDownload, IconPlus, IconSearch } from "@tabler/icons-react";
import type { GridApi } from "ag-grid-community";
import type { UserRelationProps } from "./types";
import UserRelationTable from "./UserRelationTable";
import UserRelationEditor from "./UserRelationEditor";

export default function UserRelationManager() {
  const initialData = useMemo<UserRelationProps[]>(
    () => [
      { id: "rel-1", userId: "user-1", profileGroupId: "group-a" },
      { id: "rel-2", userId: "user-2", profileGroupId: "group-b" },
    ],
    []
  );

  const [rows, setRows] = useState<UserRelationProps[]>(initialData);
  const [editOpened, setEditOpened] = useState(false);
  const [editingRow, setEditingRow] = useState<UserRelationProps | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const [quick, setQuick] = useState("");
  const [density, setDensity] = useState<"compact" | "regular" | "spacious">(
    "regular"
  );



  const [pageSize, setPageSize] = useState<string | null>("250");

  const apiRef = useRef<GridApi<UserRelationProps> | null>(null);

  const rowHeight =
    density === "compact" ? 36 : density === "spacious" ? 56 : 44;

  const handleAdd = (data: UserRelationProps) =>
    setRows((prev) => [data, ...prev]);
  const handleEditOpen = (row: UserRelationProps) => {
    setEditingRow(row);
    setEditOpened(true);
  };
  const handleUpdate = (data: UserRelationProps) => {
    setRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    setEditOpened(false);
    setEditingRow(null);
  };
  const handleDelete = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <Stack gap="lg">
      <Paper
        withBorder
        p="md"
        radius="md"
        style={{
          background: "var(--app-surface, #fff)",
          borderColor: "var(--app-border, #ececf2)",
          boxShadow: "0 8px 28px rgba(76, 29, 149, .08)",
        }}
      >
        <Group justify="space-between" mb="sm" wrap="wrap">
          <Title order={4} fw={800} style={{ letterSpacing: 0.2 }}>
            User Relations
          </Title>

          <Group wrap="wrap" gap="sm">
            <TextInput
              value={quick}
              onChange={(e) => setQuick(e.currentTarget.value)}
              placeholder="Ara (ID, User, Group)"
              leftSection={<IconSearch size={16} />}
              radius="md"
            />
            <Select
              w={120}
              value={pageSize}
              onChange={setPageSize}
              data={["50", "150", "250", "500"].map((v) => ({
                value: v,
                label: `${v}/sayfa`,
              }))}
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setEditOpened(true)}
            >
              Yeni Ekle
            </Button>
          </Group>
        </Group>

        <UserRelationTable
          records={rows}
          onEdit={handleEditOpen}
          onDelete={handleDelete}
          isFetching={isFetching}
          height={520}
          rowHeight={rowHeight}
          quickFilter={quick}
          onApiReady={(api) => {
            apiRef.current = api;
            // page size değişimi
            api.paginationSetPageSize(Number(pageSize ?? "250"));
          }}
        />
      </Paper>

      <Modal
        opened={editOpened}
        onClose={() => {
          setEditOpened(false);
          setEditingRow(null);
        }}
        title={editingRow ? "Relation Düzenle" : "Yeni Relation"}
        size="lg"
        centered
      >
        <UserRelationEditor
          initial={editingRow ?? undefined}
          onCancel={() => {
            setEditOpened(false);
            setEditingRow(null);
          }}
          onSubmit={(data) => {
            editingRow ? handleUpdate(data) : handleAdd(data);
          }}
        />
      </Modal>
    </Stack>
  );
}
