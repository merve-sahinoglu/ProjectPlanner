import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  Paper,
  Stack,
  Title,
  Divider,
  Modal,
} from "@mantine/core";
import dayjs from "dayjs";
import type { ColDef } from "@ag-grid-community/core";// ← kendi path'ine göre düzelt
import DataTable from "../../components/DataTable/DataTable";
import AddNoteForm, { AddNoteFormValues } from "./AddNoteForm";

export type NoteItem = {
  id: string;
  date: Date; // ✅ Date olarak kalıyor
  childId: string;
  therapistId: string;
  noteHtml: string;
};

const LS_KEY = "daily_notes_v7";

const loadNotes = (): NoteItem[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<
      Omit<NoteItem, "date"> & { date: string }
    >;
    return parsed.map((n) => ({ ...n, date: new Date(n.date) })); // string → Date
  } catch {
    return [];
  }
};

const saveNotes = (items: NoteItem[]) => {
  const serializable = items.map((n) => ({ ...n, date: n.date.toISOString() })); // Date → string
  localStorage.setItem(LS_KEY, JSON.stringify(serializable));
};

export default function NoteBook() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const columns = useMemo<ColDef<NoteItem>[]>(
    () => [
      {
        headerName: "Date",
        field: "date",
        valueFormatter: (p) =>
          p.value instanceof Date ? dayjs(p.value).format("YYYY-MM-DD") : "",
        width: 140,
        sortable: true,
        filter: "agDateColumnFilter",
      },
      {
        headerName: "Child ID",
        field: "childId",
        flex: 1,
        sortable: true,
        filter: true,
      },
      {
        headerName: "Therapist ID",
        field: "therapistId",
        flex: 1,
        sortable: true,
        filter: true,
      },
    ],
    []
  );

  const handleSave = (values: AddNoteFormValues) => {
    const newItem: NoteItem = {
      id: crypto.randomUUID(),
      date: values.date!, // validate sayesinde Date garantili
      childId: values.childId.trim(),
      therapistId: values.therapistId.trim(),
      noteHtml: values.noteHtml,
    };

    const updated = [newItem, ...notes].sort(
      (a, b) => b.date.getTime() - a.date.getTime() // en yeni üste
    );
    setNotes(updated);
    saveNotes(updated);
    setOpened(false);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={3}>Daily Notes</Title>
        <Button onClick={() => setOpened(true)}>Add note</Button>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Title order={5} mb="sm">
          Notes
        </Title>
        <DataTable<NoteItem>
          records={notes}
          columns={columns}
          isFetching={false}
          h={460}
          hasPagination
        />
      </Paper>

      <Divider />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add note"
        size="xl"
      >
        <AddNoteForm onCancel={() => setOpened(false)} onSave={handleSave} />
      </Modal>
    </Stack>
  );
}
