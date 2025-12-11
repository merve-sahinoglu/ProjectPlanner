import { Dispatch, SetStateAction, useRef } from "react";

import {
  Avatar,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  NumberInput,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RiInformationLine } from "react-icons/ri";
import { z } from "zod";

import globalStyles from "../../assets/global.module.css";
import CircleDot from "../../components/CircleDot/CircleDot";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enums/request-type";
import { nameof } from "../../helpers/name-of";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import useRequestHandler from "../../hooks/useRequestHandler";
import { createJsonPatchDocumentFromDirtyForm } from "../../services/json-patch-handler/json-patch-document";
import ExecutiveAutocomplete from "./ExecutiveAutocomplete";
import styles from "./PlayGroupDetail.module.css";
import {
  PlayGroupResponse,
  PlayGroupRowProps,
} from "./props/PlayGroupRowProps";

interface PlayGroupDetailProps {
  selectedPlayGroup: PlayGroupRowProps;
  handleDeleteItem(itemId: string): void;
  handleUpdateItem(item: PlayGroupRowProps): void;
  canAddItem: boolean;
  setCanAddItem: Dispatch<SetStateAction<boolean>>;
  createdItemGuid: string;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  changeCreatedItemGuid(id: string): void;
  handleUpdateItemWithId(item: PlayGroupRowProps, id: string): void;
  changeSelectedItem(item: PlayGroupRowProps | null): void;
}

function PlayGroupDetail({
  canAddItem,
  setCanAddItem,
  handleDeleteItem,
  handleUpdateItem,
  createdItemGuid,
  disabled,
  setDisabled,
  selectedPlayGroup,
  changeCreatedItemGuid,
  handleUpdateItemWithId,
  changeSelectedItem,
}: PlayGroupDetailProps) {
  const { fetchData, sendData } = useRequestHandler();

  const { t } = useTranslation();

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: `${t(Dictionary.PlayGroup.Validation.NAME_MIN)}` })
      .max(100, { message: `${t(Dictionary.PlayGroup.Validation.NAME_MAX)}` }),
  });

  const form = useForm<PlayGroupRowProps>({
    initialValues: {
      ...selectedPlayGroup,
    },
    validate: zod4Resolver(schema),
  });

  const initialValues = useRef<PlayGroupRowProps>(form.values);

  const sendPostRequestForCreatedItem = async () => {
    const response = await sendData<PlayGroupRowProps, PlayGroupRowProps>(
      createRequestUrl(apiUrl.appointmentPlayGroupUrl),
      RequestType.Post,
      form.values
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      setDisabled(true);

      const retVal = await fetchData<PlayGroupResponse>(
        createRequestUrl(apiUrl.appointmentPlayGroupUrl, response.value.id)
      );

      if (!retVal.isSuccess) return;

      initialValues.current = retVal.value;

      form.setValues(retVal.value);

      form.resetDirty();

      setCanAddItem(!canAddItem);

      handleUpdateItemWithId(retVal.value, createdItemGuid);

      changeSelectedItem(retVal.value);

      changeCreatedItemGuid("");

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
  };

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument =
      createJsonPatchDocumentFromDirtyForm<PlayGroupRowProps>(
        form,
        form.values,
        ["playgroupTherapists"]
      );

    if (form.values.playgroupTherapists.length > 0) {
      const updatedTherapists = form.values.playgroupTherapists.map(
        (therapist) => therapist.therapistId
      );

      const playGroup = {
        op: "replace",
        path: "/playgroupTherapistsId",
        value: updatedTherapists, // Binary olarak saklamak istersen
      };

      patchDocument.push(playGroup);
    }

    const response = await sendData(
      createRequestUrl(apiUrl.appointmentPlayGroupUrl, form.values.id),
      RequestType.Patch,
      patchDocument
    );

    if (response.isSuccess) {
      setDisabled(true);

      form.resetDirty();

      initialValues.current = form.values;

      setCanAddItem(true);

      handleUpdateItem(form.values);

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
  };

  const handleSave = async (event: React.MouseEvent) => {
    event.preventDefault();

    form.validate();

    if (!form.isValid()) return;

    if (!form.isDirty()) return;

    if (createdItemGuid === form.values.id) {
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

    if (createdItemGuid === form.values.id) {
      setCanAddItem(!canAddItem);
      handleDeleteItem(form.values.id);
      setDisabled(true);
      form.reset();
      form.setFieldValue(nameof<PlayGroupRowProps>("id"), "");
      changeSelectedItem(null);
      return;
    }

    form.setValues(initialValues.current);
    setDisabled(true);
  };

  const handleRemoveTherapist = (therapistId: string) => {
    if (!disabled) {
      const updatedTherapists = form.values.playgroupTherapists.filter(
        (therapist) => therapist.therapistId !== therapistId
      );
      form.setFieldValue(
        nameof<PlayGroupRowProps>("playgroupTherapists"),
        updatedTherapists
      );
    }
  };

  const avatars = form.values.playgroupTherapists.map((therapist) => (
    <Avatar
      key={therapist.id}
      name={therapist.therapistName}
      color="initials"
      onClick={() => handleRemoveTherapist(therapist.therapistId)}
      alt={therapist.therapistName}
    />
  ));

  return (
    <>
      <Card.Section className={globalStyles.detailHeader} inheritPadding>
        <CircleDot isActive={form.values.isActive} />
        <Text lineClamp={1} fw={400} fz={20}>
          {form.values.name}
        </Text>
      </Card.Section>
      <Divider mb={20} />
      <Tabs keepMounted={false} defaultValue="item">
        <Card.Section inheritPadding>
          <Tabs.List>
            <Tabs.Tab
              leftSection={<RiInformationLine size="1rem" />}
              value="item"
            >
              {t(Dictionary.PlayGroup.TITLE)}
            </Tabs.Tab>
          </Tabs.List>
        </Card.Section>
        <Tabs.Panel value="item">
          <Grid grow>
            <Grid.Col span={5}>
              <TextInput
                className={styles.input}
                disabled={disabled}
                label={`${t(Dictionary.Room.NAME)}`}
                {...form.getInputProps(nameof<PlayGroupRowProps>("name"))}
              />
              <Group grow>
                <NumberInput
                  className={styles.input}
                  disabled={disabled}
                  label={`${t(Dictionary.PlayGroup.MIN_AGE)}`}
                  {...form.getInputProps(nameof<PlayGroupRowProps>("minAge"))}
                />
                <NumberInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.PlayGroup.MAX_AGE)}
                  {...form.getInputProps(nameof<PlayGroupRowProps>("maxAge"))}
                />
                <NumberInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.PlayGroup.MAX_PARTICIPANTS)}
                  {...form.getInputProps(
                    nameof<PlayGroupRowProps>("maxParticipants")
                  )}
                />
              </Group>
              <Group grow>
                <ExecutiveAutocomplete
                  searchInputLabel="Terapist Seç"
                  placeholder="Terapist ara..."
                  description=""
                  disabled={disabled}
                  apiUrl={createRequestUrl(apiUrl.userUrl)}
                  additionalQueries={{ typeId: 0, isActive: true }}
                  selectedTherapists={form.values.playgroupTherapists} // 🎯 Seçilenleri buradan gönderiyoruz
                  setFieldValue={(
                    newValue: {
                      id: string;
                      therapistId: string;
                      therapistName: string;
                    }[]
                  ) => form.setFieldValue("playgroupTherapists", newValue)} // 🎯 Güncellemeyi buradan yapıyoruz
                  clearValue={
                    () => console.log("clearValue") // 🎯 Temizleme işlemi
                  } // 🎯 Temizleme işlemi
                />
              </Group>
              <Group mt={15}>{avatars}</Group>
              <Group grow>
                <Checkbox
                  mt={25}
                  disabled={disabled}
                  className={styles.input}
                  label={t(Dictionary.PlayGroup.IS_ACTIVE)}
                  {...form.getInputProps(
                    nameof<PlayGroupRowProps>("isActive"),
                    {
                      type: "checkbox",
                    }
                  )}
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
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default PlayGroupDetail;
