import { Dispatch, SetStateAction, useRef } from "react";

import { Grid, Group, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import FormAutocomplete from "../../../components/Autocomplete/FormAutocomplete";
import DateTimeSelector from "../../../components/DateTimeSelector/DateTimeSelector";
import OperationButtons from "../../../components/OperationButtons/OperationButtons";
import { apiUrl, createRequestUrl } from "../../../config/app.config";
import RequestType from "../../../enums/request-type";
import { nameof } from "../../../helpers/name-of";
import Dictionary from "../../../helpers/translation/dictionary/dictionary";
import useRequestHandler from "../../../hooks/useRequestHandler";
import styles from ".././Appointment.module.css";
import {
  Appointment,
  AppointmentType,
  SelectedDates,
} from ".././types/Appointment";

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
  appointment: Appointment;
  closeOnSave: () => void;
  itemGuid: string;
  disabled: boolean;
  changeSelectedItem(item: Appointment | null): void;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  handleUpdateItem(item: Appointment): void;
}

const EditAppointmentModal: React.FC<EditAppointmentFormProps> = ({
  itemGuid,
  disabled,
  changeSelectedItem,
  setDisabled,
  handleUpdateItem,
  appointment,
}) => {
  const { sendData } = useRequestHandler();

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
      roomId: appointment.roomId || "",
      roomName: appointment.roomName || "",
      playgroupId: appointment.playgroupId || "",
      playgroupName: appointment.playgroupName || "",
      id: appointment.id || 0,
      appointmenId: appointment.appointmenId,
      chieldId: appointment.chieldId,
      therapistId: appointment.therapistId,
      typeId: appointment.typeId.toString(),
      statusId: appointment.statusId.toString(),
      name: appointment.name,
      description: appointment.description,
      chieldName: appointment.chieldName,
      therapistName: appointment.therapistName || "",
      appointmentDays:
        appointment.appointmentDays &&
        appointment.appointmentDays
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
          )
          .map((date) => ({
            ...date,
            start: new Date(date.start),
            end: new Date(date.end),
          })),
    },
    validate: zod4Resolver(schema),
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

  const sendPutRequestForModifiedItem = async () => {
    const updateAppointment = {
      id: form.values.id,
      appointmenId: form.values.appointmenId,
      chieldId: appointment.chieldId,
      playgroupId: form.values.playgroupId || null,
      playgroupName: form.values.playgroupName || null,
      roomId: form.values.roomId || null,
      roomName: form.values.roomName || null,
      therapistId: form.values.therapistId,
      therapistName: form.values.therapistName,
      typeId: form.values.typeId,
      statusId: form.values.statusId,
      name: form.values.name,
      description: form.values.description,
      appointmentDays:
        form.values.appointmentDays?.map((day) => ({
          id: day.id,
          start: day.start.toISOString(),
          end: day.end.toISOString(),
          lineStatusId: day.lineStatusId,
        })) || [],
    };

    const response = await sendData(
      createRequestUrl(apiUrl.appointmentUrl, form.values.appointmenId),
      RequestType.Put,
      updateAppointment
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

    sendPutRequestForModifiedItem();
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    setDisabled(false);
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();

    if (itemGuid === form.values.appointmenId) {
      setDisabled(true);
      form.reset();
      form.setFieldValue(nameof<Appointment>("appointmenId"), "");
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
              disabled={true}
              {...form.getInputProps(nameof<Appointment>("typeId"))}
              label={t(Dictionary.Appointment.TYPE_ID)}
              data={appointmentTypes}
            />
            <FormAutocomplete
              searchInputLabel={t(Dictionary.Appointment.ROOM_ID)}
              placeholder={t(Dictionary.Appointment.ROOM_ID)}
              initialSearchValue={appointment?.roomName || ""}
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
              initialSearchValue={appointment?.chieldName || ""}
              disabled={true}
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
                    initialValues.current && initialValues.current.therapistId
                      ? initialValues.current.therapistId
                      : "",
                  label:
                    initialValues.current && initialValues.current.therapistName
                      ? `${initialValues.current.therapistName}`
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
