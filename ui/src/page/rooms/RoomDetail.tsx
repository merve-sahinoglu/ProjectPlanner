import {
  Card,
  Checkbox,
  Grid,
  Group,
  Select,
  Tabs,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Dispatch, SetStateAction, useRef } from "react";
import styles from "./RoomDetail.module.css";
import { useTranslation } from "react-i18next";
import Dictionary from "../../constants/dictionary";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import toast from "react-hot-toast";
import { createJsonPatchDocumentFromDirtyForm } from "../../services/json-patch-handler/json-patch-document";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enum/request-type";
import { nameof } from "../../helpers/name-of";
import { RiInformationLine } from "react-icons/ri";
import globalStyles from "../../assets/global.module.css";
import useRequestHandler from "../../hooks/useRequestHandler";
import CircleDot from "../../components/CircleDot/CircleDot";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import { RoomRowProps } from "./props/RoomRowProps";

interface RoomDetailProps {
  selectedRoom: RoomRowProps;
  handleDeleteItem(itemId: string): void;
  handleUpdateItem(item: RoomRowProps): void;
  canAddItem: boolean;
  setCanAddItem: Dispatch<SetStateAction<boolean>>;
  createdItemGuid: string;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  changeCreatedItemGuid(id: string): void;
  handleUpdateItemWithId(item: RoomRowProps, id: string): void;
  changeSelectedItem(item: RoomRowProps | null): void;
}

const roomType = [
  {
    value: "0",
    label: "Single",
  },
  {
    value: "1",
    label: "Double",
  },
];

function RoomDetail({
  canAddItem,
  setCanAddItem,
  handleDeleteItem,
  handleUpdateItem,
  createdItemGuid,
  disabled,
  setDisabled,
  selectedRoom,
  changeCreatedItemGuid,
  handleUpdateItemWithId,
  changeSelectedItem,
}: RoomDetailProps) {
  const { fetchData, sendData } = useRequestHandler();

  const { t } = useTranslation();

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: `${t(Dictionary.Room.Validation.NAME_MIN)}` })
      .max(16, { message: `${t(Dictionary.Room.Validation.NAME_MAX)}` }),
  });

  const form = useForm<RoomRowProps>({
    initialValues: {
      ...selectedRoom,
      roomTypeId: selectedRoom.roomTypeId,
    },
    validate: zodResolver(schema),
  });

  const initialValues = useRef<RoomRowProps>(form.values);

  const sendPostRequestForCreatedItem = async () => {
    const response = await sendData<RoomRowProps, RoomRowProps>(
      createRequestUrl(apiUrl.appointmentRoomsUrl),
      RequestType.Post,
      form.values
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      setDisabled(true);

      initialValues.current = response.value;

      form.setValues(response.value);

      form.resetDirty();

      setCanAddItem(!canAddItem);

      handleUpdateItemWithId(response.value, createdItemGuid);

      changeSelectedItem(response.value);

      changeCreatedItemGuid("");

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
  };

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument = createJsonPatchDocumentFromDirtyForm<RoomRowProps>(
      form,
      form.values
    );

    const response = await sendData(
      createRequestUrl(apiUrl.appointmentRoomsUrl, form.values.id),
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
      form.setFieldValue(nameof<RoomRowProps>("id"), "");
      changeSelectedItem(null);
      return;
    }

    form.setValues(initialValues.current);
    setDisabled(true);
  };

  return (
    <>
      <Card.Section
        className={globalStyles.detailHeader}
        withBorder
        inheritPadding
      >
        <CircleDot isActive={form.values.isAvailable} />
        <Text lineClamp={1} fw={400} fz={20}>
          {form.values.name}
        </Text>
      </Card.Section>
      <Tabs
        keepMounted={false}
        className={styles.itemTab}
        m={0}
        p={0}
        defaultValue="item"
      >
        <Card.Section pb={0}>
          <Tabs.List pl={20}>
            <Tabs.Tab
              leftSection={<RiInformationLine size="1rem" />}
              value="item"
            >
              {t(Dictionary.Room.TITLE)}
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
                {...form.getInputProps(nameof<RoomRowProps>("name"))}
              />
              <Group grow>
                <TextInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.Room.MAX_CAPACITY)}
                  {...form.getInputProps(nameof<RoomRowProps>("maxCapacity"))}
                />
                <Select
                  mt={15}
                  disabled={disabled}
                  {...form.getInputProps(nameof<RoomRowProps>("roomTypeId"))}
                  label={t(Dictionary.Room.ROOM_TYPE_ID)}
                  data={roomType}
                />
              </Group>
              <Group grow>
                <Textarea
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.Room.DESCRIPTION)}
                  {...form.getInputProps(nameof<RoomRowProps>("description"))}
                />
              </Group>
              <Group grow>
                <Checkbox
                  mt={25}
                  disabled={disabled}
                  className={styles.input}
                  label={t(Dictionary.Room.IS_AVAILABLE)}
                  {...form.getInputProps(nameof<RoomRowProps>("isAvailable"), {
                    type: "checkbox",
                  })}
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

export default RoomDetail;
