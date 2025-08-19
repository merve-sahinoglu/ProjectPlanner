// src/features/user-relation/UserRelationManager.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import type { GridApi } from "ag-grid-community";
import UserRelationTable from "./UserRelationTable";
import UserRelationEditor from "./UserRelationEditor";
import UserRelationProps, { UserRelationFormValues } from "./types";
import useRequestHandler from "../../hooks/useRequestHandler";
import RequestType from "../../enum/request-type";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import toast from "react-hot-toast";
import formatSearchQuery from "../../helpers/trim-search-query";

let den = 0;

export default function UserRelationManager() {
  const { fetchData, sendData } = useRequestHandler();

  const [rows, setRows] = useState<UserRelationProps[]>([]);
  const [editOpened, setEditOpened] = useState(false);
  const [editingRow, setEditingRow] = useState<UserRelationProps | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [pageSize, setPageSize] = useState<string | null>("250");
  const apiRef = useRef<GridApi<UserRelationProps> | null>(null);

  const loadList = async (searchText?: string) => {
    setIsFetching(true);
    try {
      const request: { [key: string]: any } = {
        searchText: searchText ? formatSearchQuery(searchText) : undefined,
      };

      if (request.searchText === undefined) {
        delete request.searchText;
      }

      const res = await fetchData<UserRelationProps[]>(
        createRequestUrl(apiUrl.profileGroupUsersUrl),
        request
      );
      if (res.isSuccess) setRows(res.value);
      else toast.error(res.error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddSubmit = async (vals: UserRelationFormValues) => {
    const res = await sendData<UserRelationFormValues, UserRelationProps>(
      createRequestUrl(apiUrl.profileGroupUsersUrl),
      RequestType.Post,
      vals
    );
    if (!res.isSuccess) {
      toast.error(res.error);
      return;
    }
    toast.success("İlişki eklendi");
    setEditOpened(false);
    setEditingRow(null);
    await loadList();
  };

  const handleQuickSearch = (value: string) => {
    if (value.length == 0 || value.length > 1) {
      loadList(value);
    }
  };

  const handleUpdateSubmit = async (vals: UserRelationFormValues) => {
    if (!editingRow) return;
    // önce sil
    const del = await sendData<null, null>(
      createRequestUrl(apiUrl.profileGroupUsersUrl, editingRow.id),
      RequestType.Delete,
      null as any
    );
    if (!del.isSuccess) {
      toast.error(del.error ?? "Güncelleme başarısız (silme)");
      return;
    }
    // sonra ekle
    const add = await sendData<UserRelationFormValues, UserRelationProps>(
      createRequestUrl(apiUrl.profileGroupUsersUrl),
      RequestType.Post,
      vals
    );
    if (!add.isSuccess) {
      toast.error(add.error ?? "Güncelleme başarısız (ekleme)");
      return;
    }
    toast.success("İlişki güncellendi");
    setEditOpened(false);
    setEditingRow(null);
    await loadList();
  };

  const handleDelete = async (id: string) => {
    const res = await sendData<null, null>(
      createRequestUrl(apiUrl.profileGroupUsersUrl, id),
      RequestType.Delete,
      null as any
    );
    if (!res.isSuccess) {
      toast.error(res.error);
      return;
    }
    toast.success("İlişki silindi");
    await loadList();
  };

  useEffect(() => {
    loadList();
  }, []);

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
          padding: "1rem",
        }}
      >
        <Group justify="space-between" mb="sm" wrap="wrap">
          <Title order={4} fw={800} style={{ letterSpacing: 0.2 }}>
            User Relations
          </Title>

          <Group wrap="wrap" gap="sm">
            <TextInput
              onChange={(e) => handleQuickSearch(e.currentTarget.value)}
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
              onClick={() => {
                setEditingRow(null);
                setEditOpened(true);
              }}
            >
              Yeni Ekle
            </Button>
          </Group>
        </Group>

        <UserRelationTable
          records={rows}
          onEdit={(row) => {
            setEditingRow(row);
            setEditOpened(true);
          }}
          onDelete={handleDelete}
          isFetching={isFetching}
          height={520}
          rowHeight={44}
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
          onSubmit={(vals) => {
            editingRow ? handleUpdateSubmit(vals) : handleAddSubmit(vals);
          }}
        />
      </Modal>
    </Stack>
  );
}
