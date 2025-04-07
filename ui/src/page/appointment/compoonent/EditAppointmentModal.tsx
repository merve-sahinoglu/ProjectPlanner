import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Grid, Group, Select, Textarea, TextInput } from "@mantine/core";
import {
  Appointment,
  AppointmentResponse,
  AppointmentType,
  SelectedDates,
} from ".././types/Appointment";
import useRequestHandler from "../../../hooks/useRequestHandler";
import { useTranslation } from "react-i18next";
import { useForm, zodResolver } from "@mantine/form";
import Dictionary from "../../../constants/dictionary";
import styles from ".././Appointment.module.css";
import { nameof } from "../../../helpers/name-of";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import FormAutocomplete from "../../../components/Autocomplete/FormAutocomplete";
import OperationButtons from "../../../components/OperationButtons/OperationButtons";
import RequestType from "../../../enum/request-type";
import toast from "react-hot-toast";
import { z } from "zod";
import { createJsonPatchDocumentFromDirtyForm } from "../../../services/json-patch-handler/json-patch-document";
import DateTimeSelector from "../../../components/DateTimeSelector/DateTimeSelector";

const appointmentStatus = [
  {
    value: "0",
    label: "Scheduled",
  },
  {
    value: "1",
    label: "Completed",
  },
  {
    value: "2",
    label: "Canceled",
  },
];
interface EditAppointmentFormProps {
  closeOnSave: () => void;
  itemGuid: string;
  disabled: boolean;
  changeSelectedItem(item: Appointment | null): void;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  handleUpdateItem(item: Appointment): void;
}

const EditAppointmentModal: React.FC<EditAppointmentFormProps> = ({
  itemGuid,
  closeOnSave,
  disabled,
  changeSelectedItem,
  setDisabled,
  handleUpdateItem,
}) => {
  const { fetchData, sendData } = useRequestHandler();

  const { t } = useTranslation();

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: `${t(Dictionary.PlayGroup.Validation.NAME_MIN)}` })
      .max(100, {
        message: `${t(Dictionary.PlayGroup.Validation.NAME_MAX)}`,
      }),
  });

  const form = useForm<Appointment>({
    initialValues: {
      id: "",
      chieldId: "",
      therapistId: "",
      typeId: "",
      statusId: "",
      name: "",
      description: "",
      teacherId: "",
      chieldName: "",
      teacherName: "",
    },
    validate: zodResolver(schema),
  });

  const initialValues = useRef<Appointment>(form.values);

  const appointmentTypes = [
    {
      value: "0",
      label: t(Dictionary.AppointmentType.INITIAL_CONSULTATION),
    },
    {
      value: "1",
      label: t(Dictionary.AppointmentType.SPEECH_THERAPY),
    },
    {
      value: "2",
      label: t(Dictionary.AppointmentType.PSYCHOLOGICAL_THERAPY),
    },
    {
      value: "3",
      label: t(Dictionary.AppointmentType.GAME_GROUPS),
    },
  ];

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument = createJsonPatchDocumentFromDirtyForm<Appointment>(
      form,
      form.values
    );

    const response = await sendData(
      createRequestUrl(apiUrl.userUrl, form.values.id),
      RequestType.Patch,
      patchDocument
    );

    if (response.isSuccess) {
      setDisabled(true);

      form.resetDirty();

      initialValues.current = form.values;

      handleUpdateItem(form.values);

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
  };

  const handleSave = async (event: React.MouseEvent) => {
    event.preventDefault();

    form.validate();

    if (!form.isValid()) return;

    if (!form.isDirty()) return;

    sendPatchRequestForModifiedItem();
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    setDisabled(false);
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();

    if (itemGuid === form.values.id) {
      setDisabled(true);
      form.reset();
      form.setFieldValue(nameof<Appointment>("id"), "");
      changeSelectedItem(null);
      return;
    }

    form.setValues(initialValues.current);
    setDisabled(true);
  };

  const clearChieldId = () => {
    form.setFieldValue("chieldId", "");
  };
  const clearPlaygroupId = () => {
    form.setFieldValue("playgroupId", "");
  };

  const handleDateTimeChange = (dates: SelectedDates[]) => {
    form.setFieldValue("appointmentDays", dates);
  };

  const fetchAppointment = async () => {
    const response = await fetchData<AppointmentResponse>(
      createRequestUrl(apiUrl.appointmentUrl, itemGuid)
    );
    debugger;
    if (response.isSuccess) {
      console.table(response.value);
      form.setValues({
        ...response.value,
        typeId: response.value.typeId.toString(),
        appointmentDays:
          response.value.appointmentDays &&
          response.value.appointmentDays.map((date) => ({
            ...date,
            start: new Date(date.start),
            end: new Date(date.end),
          })),
      });
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  return (
    <>
      <Grid grow>
        <Grid.Col span={5}>
          <Group grow>
            <TextInput
              className={styles.input}
              disabled={disabled}
              label={`${t(Dictionary.Appointment.TITLE)}`}
              {...form.getInputProps(nameof<Appointment>("name"))}
            />
          </Group>
          <Group grow>
            <Select
              disabled={disabled}
              {...form.getInputProps(nameof<Appointment>("typeId"))}
              label={t(Dictionary.Appointment.TYPE_ID)}
              data={appointmentTypes}
            />
            <FormAutocomplete
              searchInputLabel={t(Dictionary.Appointment.ROOM_ID)}
              placeholder={t(Dictionary.Appointment.ROOM_ID)}
              description=""
              disabled={disabled}
              apiUrl={createRequestUrl(apiUrl.appointmentRoomsUrl)}
              form={form}
              formInputProperty="roomId"
              initialData={[
                {
                  value:
                    initialValues.current && initialValues.current.roomId
                      ? initialValues.current.roomId
                      : "",
                  label:
                    initialValues.current && initialValues.current.roomName
                      ? `${initialValues.current.roomName}`
                      : "",
                },
              ]}
              clearValue={clearChieldId}
              {...form.getInputProps(nameof<Appointment>("roomId"))}
            />
          </Group>
          <Group grow>
            <FormAutocomplete
              searchInputLabel={t(Dictionary.Appointment.CHIELD_ID)}
              placeholder={t(Dictionary.Appointment.CHIELD_ID)}
              description=""
              disabled={disabled}
              apiUrl={createRequestUrl(apiUrl.userUrl)}
              form={form}
              formInputProperty="chieldId"
              {...form.getInputProps(nameof<Appointment>("chieldId"))}
              initialData={[
                {
                  value:
                    initialValues.current && initialValues.current.chieldId
                      ? initialValues.current.chieldId
                      : "",
                  label:
                    initialValues.current && initialValues.current.chieldName
                      ? `${initialValues.current.chieldName}`
                      : "",
                },
              ]}
              clearValue={clearChieldId}
            />
            <FormAutocomplete
              searchInputLabel={t(Dictionary.Appointment.THERAPIST_ID)}
              placeholder={t(Dictionary.Appointment.THERAPIST_ID)}
              description=""
              disabled={disabled}
              apiUrl={createRequestUrl(apiUrl.userUrl)}
              form={form}
              formInputProperty="therapistId"
              {...form.getInputProps(nameof<Appointment>("therapistId"))}
              initialData={[
                {
                  value:
                    initialValues.current && initialValues.current.teacherId
                      ? initialValues.current.teacherId
                      : "",
                  label:
                    initialValues.current && initialValues.current.teacherName
                      ? `${initialValues.current.teacherName}`
                      : "",
                },
              ]}
              clearValue={clearChieldId}
            />
          </Group>
          <Group grow>
            {form.values.typeId == AppointmentType.GAME_GROUPS && (
              <FormAutocomplete
                searchInputLabel={t(Dictionary.Appointment.PLAYGROUP_ID)}
                placeholder={t(Dictionary.Appointment.PLAYGROUP_ID)}
                description=""
                apiUrl={createRequestUrl(apiUrl.appointmentPlayGroupUrl)}
                form={form}
                disabled={disabled}
                formInputProperty="playgroupId"
                {...form.getInputProps(nameof<Appointment>("playgroupId"))}
                clearValue={clearPlaygroupId}
              />
            )}

            {form.values.id && (
              <Select
                mt={15}
                disabled={disabled}
                {...form.getInputProps(nameof<Appointment>("statusId"))}
                label={t(Dictionary.Appointment.STATUS_ID)}
                data={appointmentStatus}
              />
            )}
          </Group>
          <Group grow>
            <Textarea
              disabled={disabled}
              label={t(Dictionary.Appointment.DESCRIPTION)}
              {...form.getInputProps(nameof<Appointment>("description"))}
            />
          </Group>
          <Group grow>
            <DateTimeSelector
              onChange={handleDateTimeChange}
              value={form.values.appointmentDays || []}
            />
          </Group>
        </Grid.Col>
      </Grid>
      <OperationButtons
        disabled={disabled}
        isDirty={form.isDirty()}
        handleSave={handleSave}
        handleEdit={handleEdit}
        handleCancel={handleCancel}
      />
      {/* </Tabs.Panel>
      </Tabs> */}
    </>
  );
};

export default EditAppointmentModal;
