import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  Paper,
  Stack,
  Title,
  Divider,
  Modal,
  Grid,
} from "@mantine/core";
import dayjs from "dayjs";
import type { ColDef } from "@ag-grid-community/core"; // ← kendi path'ine göre düzelt
import DataTable from "../../components/DataTable/DataTable";
import AddNoteForm, { AddNoteFormValues } from "./AddNoteForm";
import useRequestHandler from "../../hooks/useRequestHandler";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enum/request-type";
import { useParams } from "react-router-dom";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import { SearchSchema } from "../appointment/types/Appointment";
import Dictionary from "../../constants/dictionary";
import { nameof } from "../../helpers/name-of";
import moment from "moment";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import PictureRenderer from "./PictureRenderer";
import EditNoteForm, { EditNoteFormValues } from "./EditNoteFrom";
import { NoteTitleBar } from "./NoteTitleBar";

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
  const { fetchData, sendData } = useRequestHandler();
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
        valueFormatter: (p) => dayjs(p.value).format("DD-MM-YYYY"),
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
          labelField: "childName", // label'ı data.childName'den al
          defaultMime: "image/jpeg",
        },
      },
      {
        headerName: "Therapist",
        field: "therapistProfilePicture",
        flex: 1,
        sortable: true,
        hide: IdFromUrl === undefined ? false : true, // sadece IdFromUrl varsa göster
        filter: true,
        cellRenderer: PictureRenderer,
        cellRendererParams: {
          labelField: "therapistName",
          defaultMime: "image/jpeg",
        },
      },
    ],
    []
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
      createRequestUrl(apiUrl.profileGroupUsersUrl),
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

  const fetchNotes = async () => {
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
      createRequestUrl(apiUrl.profileGroupUsersUrl),
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
          <Group justify="end" p="md">
            <Button onClick={() => setCreateOpened(true)}>Add note</Button>
          </Group>

          <DataTable<GridNoteItem>
            records={notes}
            columns={columns}
            rowHeight={46}
            isFetching={false}
            onRowClicked={(data) => {
              setEditOpened(true);
              setSelectedNote(data);
            }}
            h={"800px"}
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
                onCancel={() => setEditOpened(false)}
                onSave={handleUpdate}
              />
            </Modal>
          )}
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
