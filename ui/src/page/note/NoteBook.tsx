import { useEffect, useMemo, useState } from "react";

// ← kendi path'ine göre düzelt
import { Button, Divider, Grid, Group, Modal, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ColDef } from "ag-grid-community";
import dayjs from "dayjs";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import useRequestManager from "@hooks/useRequestManager";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import DataTable from "../../components/DataTable/DataTable";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enums/request-type";
import { nameof } from "../../helpers/name-of";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import { SearchSchema } from "../appointment/types/Appointment";
import AddNoteForm, { AddNoteFormValues } from "./AddNoteForm";
import EditNoteForm, { EditNoteFormValues } from "./EditNoteFrom";
import { NoteTitleBar } from "./NoteTitleBar";
import PictureRenderer from "./PictureRenderer";

export type NoteItem = {
  id: string;
  date: Date; // ✅ Date olarak kalıyor
  childId: string;
  therapistId: string;
  noteHtml: string;
};

export type GridNoteItem = {
  id: string;
  date: Date; // ✅ Date olarak kalıyor
  childId: string;
  childName: string;
  therapistId: string;
  therapistName: string;
  noteHtml: string;
  therapistProfilePicture: Blob | number[];
  childProfilePicture: Blob | number[];
};

export default function NoteBook() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<GridNoteItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<GridNoteItem | null>(null);
  const [createOpened, setCreateOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const { fetchData, sendData } = useRequestManager();
  const { userId: IdFromUrl } = useParams();
  const form = useForm<SearchSchema>({
    initialValues: {
      childId: undefined,
      therapistId: undefined,
      startDate: moment(new Date()).startOf("day").format("DD.MMM.YYYY HH:mm"),
      endDate: moment(new Date()).add(1, "days").format("DD.MMM.YYYY HH:mm"),
    },
  });

  const columns = useMemo<ColDef<GridNoteItem>[]>(
    () => [
      {
        headerName: "Date",
        field: "date",
        valueFormatter: (p: {
          value: string | number | Date | dayjs.Dayjs | null | undefined;
        }) => dayjs(p.value).format("DD-MM-YYYY"),
        width: 140,
        sortable: true,
      },
      {
        headerName: "Child",
        field: "childProfilePicture",
        flex: 1,
        sortable: true,
        filter: true,
        cellRenderer: PictureRenderer,
        cellRendererParams: {
          labelField: "childName",
          defaultMime: "image/jpeg",
        },
      },
      {
        headerName: "Therapist",
        field: "therapistProfilePicture",
        flex: 1,
        sortable: true,
        hide: IdFromUrl === undefined ? false : true,
        filter: true,
        cellRenderer: PictureRenderer,
        cellRendererParams: {
          labelField: "therapistName",
          defaultMime: "image/jpeg",
        },
      },
    ],
    [IdFromUrl] // ✅ eklendi
  );

  const handleCreate = async (values: AddNoteFormValues) => {
    const newItem: NoteItem = {
      id: crypto.randomUUID(),
      date: values.date!, // validate sayesinde Date garantili
      childId: values.childId,
      therapistId: values.therapistId,
      noteHtml: values.noteHtml,
    };

    const response = await sendData<NoteItem, GridNoteItem>(
      createRequestUrl(apiUrl.noteUrl),
      RequestType.Post,
      newItem
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      const updated = [response.value, ...notes];
      setNotes(updated);
      setCreateOpened(false);
    }
  };

  const handleUpdate = async (value: EditNoteFormValues) => {
    const response = await sendData<EditNoteFormValues, GridNoteItem>(
      createRequestUrl(apiUrl.profileGroupUsersUrl, value.id),
      RequestType.Put,
      value
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      const updated = notes.map((note) =>
        note.id === response.value.id ? response.value : note
      );
      setNotes(updated);
      setEditOpened(false);
    }
  };

  const handleDelete = async (value: EditNoteFormValues) => {
    const response = await sendData<EditNoteFormValues, GridNoteItem>(
      createRequestUrl(apiUrl.profileGroupUsersUrl, value.id),
      RequestType.Delete,
      value
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      const newList = notes.filter((note) => note.id !== value.id);
      setNotes(newList);
      setEditOpened(false);
    }
  };

  const fetchNotes = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: { [key: string]: any } = {
      childId: form.values.childId ?? undefined,
      therapistId: IdFromUrl ?? form.values.therapistId,
      dateFrom: undefined,
      dateTo: undefined,
    };

    if (request.chieldId === undefined) {
      delete request.chieldId;
    }

    if (request.therapistId === undefined) {
      delete request.therapistId;
    }
    if (request.dateFrom === undefined) {
      delete request.dateFrom;
    }
    if (request.dateTo === undefined) {
      delete request.dateTo;
    }

    const response = await fetchData<GridNoteItem[]>(
      createRequestUrl(apiUrl.noteUrl),
      request
    );

    if (response.isSuccess) {
      setNotes(response.value || []);
    }
  };
  const clearChildId = () => {
    form.setFieldValue("childId", "");
  };

  const clearTherapistId = () => {
    form.setFieldValue("therapistId", "");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotes();
  }, []);

  return (
    <Stack gap="lg">
      <Grid>
        {IdFromUrl === undefined && (
          <Grid.Col span={{ xs: 2 }}>
            <Group grow mt={40}>
              <>
                <FormAutocomplete
                  searchInputLabel={t(Dictionary.Appointment.CHIELD_ID)}
                  placeholder={t(Dictionary.Appointment.CHIELD_ID)}
                  description=""
                  apiUrl={createRequestUrl(apiUrl.userUrl)}
                  form={form}
                  {...form.getInputProps(nameof<SearchSchema>("childId"))}
                  formInputProperty="childId"
                  clearValue={clearChildId}
                />
                <FormAutocomplete
                  searchInputLabel={t(Dictionary.Appointment.THERAPIST_ID)}
                  placeholder={t(Dictionary.Appointment.THERAPIST_ID)}
                  description=""
                  apiUrl={createRequestUrl(apiUrl.userUrl)}
                  form={form}
                  {...form.getInputProps(nameof<SearchSchema>("therapistId"))}
                  formInputProperty="therapistId"
                  clearValue={clearTherapistId}
                />
              </>
            </Group>
          </Grid.Col>
        )}
        <Grid.Col span={{ xs: IdFromUrl === undefined ? 10 : 12 }}>
          {IdFromUrl !== undefined && (
            <Group justify="end" p="md">
              <Button onClick={() => setCreateOpened(true)}>Add note</Button>
            </Group>
          )}

          <DataTable<GridNoteItem>
            records={notes}
            columns={columns}
            isFetching={false}
            onRowClicked={(data) => {
              setEditOpened(true);
              setSelectedNote(data);
            }}
            h={800}
            hasPagination={true}
          />

          <Divider />
          <Modal
            opened={createOpened}
            onClose={() => setCreateOpened(false)}
            title="Add note"
            size="xl"
          >
            <AddNoteForm
              onCancel={() => setCreateOpened(false)}
              onSave={handleCreate}
              therapistId={IdFromUrl ?? form.values.therapistId ?? ""}
            />
          </Modal>
          {selectedNote && (
            <Modal
              opened={editOpened}
              onClose={() => setEditOpened(false)}
              title={
                <NoteTitleBar
                  name={selectedNote.childName ?? "Not"}
                  date={selectedNote.date}
                  avatar={selectedNote.childProfilePicture /* varsa */}
                />
              }
              size="xl"
            >
              <EditNoteForm
                data={selectedNote}
                onSave={handleUpdate}
                onDelete={handleDelete}
              />
            </Modal>
          )}
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
