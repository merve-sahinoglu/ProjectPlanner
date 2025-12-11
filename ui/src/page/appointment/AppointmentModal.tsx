import { Dispatch, SetStateAction, useRef } from "react";

import { Grid, Group, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import DateTimeSelector from "../../components/DateTimeSelector/DateTimeSelector";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enums/request-type";
import { nameof } from "../../helpers/name-of";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import useRequestHandler from "../../hooks/useRequestHandler";
import styles from "./Appointment.module.css";
import {
  Appointment,
  AppointmentType,
  SelectedDates,
} from "./types/Appointment";

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
interface AppointmentFormProps {
  selectedAppointment: Appointment;
  closeOnSave: () => void;
  handleAppointments: (appointments: Appointment[]) => void;
  createdItemGuid: string;
  disabled: boolean;
  changeCreatedItemGuid(id: string): void;
  changeSelectedItem(item: Appointment | null): void;
  handleUpdateItemWithId(item: Appointment, id: string): void;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  handleDeleteItem(itemId: string): void;
  handleUpdateItem(item: Appointment): void;
}

const AppointmentModal: React.FC<AppointmentFormProps> = ({
  selectedAppointment,
  closeOnSave,
  disabled,
  createdItemGuid,
  changeSelectedItem,
  setDisabled,
  handleDeleteItem,
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
      ...selectedAppointment,
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

  const sendPostRequestForCreatedItem = async () => {
    const request = form.values;

    const response = await sendData<Appointment, Appointment>(
      createRequestUrl(apiUrl.appointmentUrl),
      RequestType.Post,
      request
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      setDisabled(true);

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
      closeOnSave();
    }
  };

  const handleSave = async (event: React.MouseEvent) => {
    event.preventDefault();

    form.validate();

    if (!form.isValid()) return;

    if (!form.isDirty()) return;

    sendPostRequestForCreatedItem();
    return;
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    setDisabled(false);
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();

    if (createdItemGuid === form.values.appointmenId) {
      handleDeleteItem(form.values.appointmenId);
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

  const clearTherapistId = () => {
    form.setFieldValue("therapistId", "");
  };

  const clearRoomId = () => {
    form.setFieldValue("roomId", "");
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
              {...form.getInputProps(nameof<Appointment>("roomId"))}
              clearValue={clearRoomId}
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
              clearValue={clearTherapistId}
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

export default AppointmentModal;
