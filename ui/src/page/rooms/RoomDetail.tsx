import { useEffect, useRef, type MouseEvent } from "react";

import {
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  Select,
  Tabs,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RiInformationLine } from "react-icons/ri";
import { z } from "zod";

import useRequestManager from "@hooks/useRequestManager";
import { PageState } from "@shared/types/page.types";
import globalStyles from "../../assets/global.module.css";
import CircleDot from "../../components/CircleDot/CircleDot";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enums/request-type";
import { nameof } from "../../helpers/name-of";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import { createJsonPatchDocumentFromDirtyForm } from "../../services/json-patch-handler/json-patch-document";
import { RoomRowProps } from "./props/RoomRowProps";
import styles from "./RoomDetail.module.css";

interface RoomDetailProps {
  selectedRoom: RoomRowProps;
  changeSelectedItem(item: RoomRowProps | null): void;
  handleDeleteItem(itemId: string): void;
  handleUpdateItem(item: RoomRowProps): void;
  handleUpdateItemWithId(item: RoomRowProps, id: string): void; // create sonrası temp id -> real id için
  mode: PageState;
  changeMode: (value: PageState) => void;
}

const roomType = [
  { value: "0", label: "Single" },
  { value: "1", label: "Double" },
];

function RoomDetail({
  selectedRoom,
  handleDeleteItem,
  handleUpdateItem,
  handleUpdateItemWithId,
  changeSelectedItem,
  mode,
  changeMode,
}: RoomDetailProps) {
  const { isPending, sendData } = useRequestManager();
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
      roomTypeId: selectedRoom.roomTypeId?.toString?.() ?? "0",
    },
    validate: zod4Resolver(schema),
  });

  // Cancel için snapshot
  const initialValuesRef = useRef<RoomRowProps | null>(null);

  // selectedRoom değişince form senkronla + snapshot al
  useEffect(() => {
    const normalized: RoomRowProps = {
      ...selectedRoom,
      roomTypeId: selectedRoom.roomTypeId?.toString?.() ?? "0",
    };

    initialValuesRef.current = normalized;

    form.setValues(normalized);
    form.resetDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  const sendPostRequestForCreatedItem = async () => {
    const response = await sendData<RoomRowProps, RoomRowProps>(
      createRequestUrl(apiUrl.appointmentRoomsUrl),
      RequestType.Post,
      form.values
    );

    if (!response.isSuccess) return;

    changeMode("view");

    const createdRealId = response.value.id;

    const retval: RoomRowProps = {
      ...response.value,
      roomTypeId: response.value.roomTypeId?.toString?.() ?? "0",
    };

    initialValuesRef.current = retval;

    form.setValues(retval);
    form.resetDirty();

    // temp id -> real id güncelle
    handleUpdateItemWithId(retval, createdRealId);
    changeSelectedItem(retval);

    toast.success(`${t(Dictionary.Success.POSITIVE)}`);
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

    if (!response.isSuccess) return;

    changeMode("view");

    form.resetDirty();
    initialValuesRef.current = form.values;

    handleUpdateItem(form.values);

    toast.success(`${t(Dictionary.Success.POSITIVE)}`);
  };

  const handleSave = async (event: MouseEvent) => {
    event.preventDefault();

    const result = form.validate();
    if (result.hasErrors) return;

    if (!form.isDirty()) return;

    if (mode === "create") {
      await sendPostRequestForCreatedItem();
      return;
    }

    await sendPatchRequestForModifiedItem();
  };

  const handleEdit = (event: MouseEvent) => {
    event.preventDefault();
    changeMode("edit");
  };

  const handleCancel = (event: MouseEvent) => {
    event.preventDefault();

    changeMode("view");

    if (mode === "create") {
      // create iptal: temp kaydı listeden kaldır, seçimi temizle
      handleDeleteItem(form.values.id);
      form.reset();
      form.setFieldValue(nameof<RoomRowProps>("id"), "");
      changeSelectedItem(null);
      return;
    }

    if (initialValuesRef.current) {
      form.setValues(initialValuesRef.current);
      form.resetDirty();
    }
  };

  const isDisabled = isPending || mode === "view";

  return (
    <>
      <Card.Section className={globalStyles.detailHeader} inheritPadding>
        <CircleDot isActive={form.values.isAvailable} />
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
              {t(Dictionary.Room.TITLE)}
            </Tabs.Tab>
          </Tabs.List>
        </Card.Section>

        <Tabs.Panel value="item">
          <Grid grow>
            <Grid.Col span={5}>
              <TextInput
                className={styles.input}
                disabled={isDisabled}
                label={t(Dictionary.Room.NAME)}
                {...form.getInputProps(nameof<RoomRowProps>("name"))}
              />

              <Group grow>
                <TextInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.Room.MAX_CAPACITY)}
                  {...form.getInputProps(nameof<RoomRowProps>("maxCapacity"))}
                />
                <Select
                  mt={15}
                  disabled={isDisabled}
                  label={t(Dictionary.Room.ROOM_TYPE_ID)}
                  data={roomType}
                  {...form.getInputProps(nameof<RoomRowProps>("roomTypeId"))}
                />
              </Group>

              <Group grow>
                <Textarea
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.Room.DESCRIPTION)}
                  {...form.getInputProps(nameof<RoomRowProps>("description"))}
                />
              </Group>

              <Group grow>
                <Checkbox
                  mt={25}
                  disabled={isDisabled}
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
            disabled={isDisabled}
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
