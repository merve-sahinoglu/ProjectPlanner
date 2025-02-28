import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  NumberInput,
  Select,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { Appointment } from "./types/Appointment";
import { RiInformationLine } from "react-icons/ri";
import globalStyles from "../../assets/global.module.css";
import useRequestHandler from "../../hooks/useRequestHandler";
import { useTranslation } from "react-i18next";
import { useForm, zodResolver } from "@mantine/form";
import Dictionary from "../../constants/dictionary";
import styles from "./Appointment.module.css";
import { nameof } from "../../helpers/name-of";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import RequestType from "../../enum/request-type";
import toast from "react-hot-toast";
import { z } from "zod";
import { createJsonPatchDocumentFromDirtyForm } from "../../services/json-patch-handler/json-patch-document";
import CardGridDetail from "../../components/CardGrid/CardGridDetail";

const appointmentType = [
  {
    value: "0",
    label: "InitialConsultation",
  },
  {
    value: "1",
    label: "SpeechTherapy",
  },
  {
    value: "2",
    label: "PsychologicalTherapy",
  },
  {
    value: "3",
    label: "Game Groups",
  },
];

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
  handleAppointments,
  disabled,
  createdItemGuid,
  changeSelectedItem,
  changeCreatedItemGuid,
  handleUpdateItemWithId,
  setDisabled,
  handleDeleteItem,
  handleUpdateItem,
}) => {
  const { fetchData, sendData } = useRequestHandler();

  const { t } = useTranslation();

  const schema = z.object({
    title: z
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
    validate: zodResolver(schema),
  });

  const initialValues = useRef<Appointment>(form.values);

  const sendPostRequestForCreatedItem = async () => {
    const response = await sendData<Appointment, Appointment>(
      createRequestUrl(apiUrl.userUrl),
      RequestType.Post,
      form.values
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      setDisabled(true);

      initialValues.current = response.value;

      form.setValues(response.value);

      form.resetDirty();

      handleUpdateItemWithId(response.value, createdItemGuid);

      changeSelectedItem(response.value);

      changeCreatedItemGuid("");

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
  };

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument = createJsonPatchDocumentFromDirtyForm<Appointment>(
      form,
      form.values
    );

    const response = await sendData(
      createRequestUrl(apiUrl.userUrl, form.values.appointmenId),
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

    if (createdItemGuid === form.values.appointmenId) {
      sendPostRequestForCreatedItem();
      return;
    }

    sendPatchRequestForModifiedItem();
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

  return (
    <>
      {/* <Card.Section className={globalStyles.detailHeader} inheritPadding>
          <Text lineClamp={1} fw={400} fz={20}>
            {form.values.title}
          </Text>
        </Card.Section> */}
      <Divider mb={20} />
      {/* <Tabs keepMounted={false} defaultValue="item"> */}
      {/* <Card.Section inheritPadding>
          <Tabs.List>
            <Tabs.Tab
              leftSection={<RiInformationLine size="1rem" />}
              value="item"
            >
              {t(Dictionary.PlayGroup.TITLE)}
            </Tabs.Tab>
          </Tabs.List>
        </Card.Section> */}
      {/* <Tabs.Panel value="item"> */}
      <Grid grow>
        <Grid.Col span={5}>
          <TextInput
            className={styles.input}
            disabled={disabled}
            label={`${t(Dictionary.Room.NAME)}`}
            {...form.getInputProps(nameof<Appointment>("title"))}
          />
          <Group grow>
            <FormAutocomplete
              searchInputLabel={"Chield"}
              placeholder={t(Dictionary.CardGrid.SEARCH_INPUT)}
              description=""
              apiUrl={createRequestUrl(apiUrl.userUrl)}
              form={form}
              formInputProperty="chieldId"
              {...form.getInputProps(nameof<Appointment>("chieldId"))}
              clearValue={clearChieldId}
            />
            <FormAutocomplete
              searchInputLabel={"TherapistId"}
              placeholder={t(Dictionary.CardGrid.SEARCH_INPUT)}
              description=""
              apiUrl={createRequestUrl(apiUrl.userUrl)}
              form={form}
              formInputProperty="therapistId"
              {...form.getInputProps(nameof<Appointment>("therapistId"))}
              clearValue={clearChieldId}
            />
          </Group>
          <Group grow>
            <FormAutocomplete
              searchInputLabel={"playgroup"}
              placeholder={t(Dictionary.CardGrid.SEARCH_INPUT)}
              description=""
              apiUrl={createRequestUrl(apiUrl.appointmentPlayGroupUrl)}
              form={form}
              formInputProperty="playgroupId"
              {...form.getInputProps(nameof<Appointment>("playgroupId"))}
              clearValue={clearPlaygroupId}
            />
            <FormAutocomplete
              searchInputLabel={"Room"}
              placeholder={t(Dictionary.CardGrid.SEARCH_INPUT)}
              description=""
              apiUrl={createRequestUrl(apiUrl.userUrl)}
              form={form}
              formInputProperty="chieldId"
              {...form.getInputProps(nameof<Appointment>("roomId"))}
              clearValue={clearChieldId}
            />
          </Group>
          <Group grow>
            <Select
              mt={15}
              disabled={disabled}
              {...form.getInputProps(nameof<Appointment>("statusId"))}
              label={t(Dictionary.User.GENDER)}
              data={appointmentStatus}
            />
            <Select
              mt={15}
              disabled={disabled}
              {...form.getInputProps(nameof<Appointment>("typeId"))}
              label={t(Dictionary.User.GENDER)}
              data={appointmentType}
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
