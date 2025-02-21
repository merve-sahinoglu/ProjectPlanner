import {
  Card,
  Checkbox,
  FileInput,
  Grid,
  Group,
  PasswordInput,
  Select,
  Tabs,
  Text,
  TextInput,
  Image,
  Avatar,
  rem,
} from "@mantine/core";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./UserDetail.module.css";
import { UserRowProps } from "./props/UserTypes";
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
import { BsBoxes } from "react-icons/bs";
import { DatePickerInput } from "@mantine/dates";
import useUserPreferences from "../../hooks/useUserPreferenceStore";
import globalStyles from "../../assets/global.module.css";
import useRequestHandler from "../../hooks/useRequestHandler";
import CircleDot from "../../components/CircleDot/CircleDot";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import { IconUpload } from "@tabler/icons-react";

interface ItemDetailProps {
  selectedUser: UserRowProps;
  handleDeleteItem(itemId: string): void;
  handleUpdateItem(item: UserRowProps): void;
  canAddItem: boolean;
  setCanAddItem: Dispatch<SetStateAction<boolean>>;
  createdItemGuid: string;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  changeCreatedItemGuid(id: string): void;
  handleUpdateItemWithId(item: UserRowProps, id: string): void;
  changeSelectedItem(item: UserRowProps | null): void;
}

const genders = [
  {
    value: "0",
    label: "Unknown",
  },
  {
    value: "1",
    label: "Male",
  },
  {
    value: "2",
    label: "Female",
  },
  {
    value: "3",
    label: "Other",
  },
];

function UserDetail({
  canAddItem,
  setCanAddItem,
  handleDeleteItem,
  handleUpdateItem,
  createdItemGuid,
  disabled,
  setDisabled,
  selectedUser,
  changeCreatedItemGuid,
  handleUpdateItemWithId,
  changeSelectedItem,
}: ItemDetailProps) {
  const { fetchData, sendData } = useRequestHandler();

  const { t } = useTranslation();

  const [preview, setPreview] = useState<string | null>(
    selectedUser.profilePicture
      ? URL.createObjectURL(selectedUser.profilePicture as File)
      : null
  );

  const schema = z.object({
    userName: z
      .string()
      .min(1, { message: `${t(Dictionary.Item.Validation.CODE_MIN)}` })
      .max(16, { message: `${t(Dictionary.Item.Validation.CODE_MAX)}` }),
    email: z
      .string()
      .min(1, { message: `${t(Dictionary.Item.Validation.NAME_MIN)}` })
      .max(128, { message: `${t(Dictionary.Item.Validation.NAME_MAX)}` }),
  });

  const form = useForm<UserRowProps>({
    initialValues: { ...selectedUser, gender: selectedUser.gender.toString() },
    validate: zodResolver(schema),
  });

  const initialValues = useRef<UserRowProps>(form.values);

  function fileToByteArray(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result));
        } else {
          reject(new Error("Dosya okunamadı."));
        }
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  }

  // Kullanım
  const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const byteArray = await fileToByteArray(file);
    }
  };

  const sendPostRequestForCreatedItem = async () => {
    debugger;
    if (
      form.values["profilePicture"] !== null &&
      form.values["profilePicture"] !== undefined
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(form.values["profilePicture"] as File);

      reader.onloadend = () => {
        const data = reader.result as string;
        const parsedData = data.split(",");
        if (!data) return;
        const base64 = parsedData[1];
        form.setFieldValue("profilePicture", base64);
      };
    }

    const response = await sendData<UserRowProps, UserRowProps>(
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

      setCanAddItem(!canAddItem);

      handleUpdateItemWithId(response.value, createdItemGuid);

      changeSelectedItem(response.value);

      changeCreatedItemGuid("");

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
  };

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument = createJsonPatchDocumentFromDirtyForm<UserRowProps>(
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
      form.setFieldValue(nameof<UserRowProps>("id"), "");
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
        <CircleDot isActive={form.values.isActive} />
        <Text lineClamp={1} fw={400} fz={20}>
          ({form.values.userName}) - {form.values.name} {form.values.surname}
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
              {t(Dictionary.User.TITLE)}
            </Tabs.Tab>
            {/* <Tabs.Tab
              disabled={!canAddItem}
              leftSection={<BsBoxes size="1rem" />}
              value="itemProperty"
            >
              {t(Dictionary.Item.ITEM_FACILITY_PROPERTIES)}
            </Tabs.Tab> */}
          </Tabs.List>
        </Card.Section>
        <Tabs.Panel value="item">
          <Grid grow>
            <Grid.Col span={5}>
              <Group>
                <Avatar src={preview} size={90} />
                <FileInput
                  clearable
                  disabled={disabled}
                  accept="image/png,image/jpeg"
                  label="Attach your picture"
                  {...form.getInputProps(
                    nameof<UserRowProps>("profilePicture")
                  )}
                  placeholder={`${t(Dictionary.ExcelImport.SELECT_FILE)}`}
                  onChange={(file) => {
                    form.setFieldValue("profilePicture", file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setPreview(null);
                    }
                  }}
                />
              </Group>

              <TextInput
                className={styles.input}
                disabled={disabled}
                label={`${t(Dictionary.User.USERNAME)}`}
                {...form.getInputProps(nameof<UserRowProps>("userName"))}
              />
              <PasswordInput
                disabled={disabled}
                mt={15}
                label={t(Dictionary.Login.PASSWORD)}
                {...form.getInputProps(nameof<UserRowProps>("password"))}
              />
              <Group grow>
                <TextInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.User.NAME)}
                  {...form.getInputProps(nameof<UserRowProps>("name"))}
                />
                <TextInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.User.SURNAME)}
                  {...form.getInputProps(nameof<UserRowProps>("surname"))}
                />
              </Group>
              <Group grow>
                <TextInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.User.USER_TITLE)}
                  {...form.getInputProps(nameof<UserRowProps>("title"))}
                />
                {/* <DatePickerInput
                  mt={15}
                  locale={language}
                  disabled={disabled}
                  label={t(Dictionary.User.BIRTH_DATE)}
                  mx="auto"
                  {...form.getInputProps(nameof<UserRowProps>("birthDate"))}
                /> */}
              </Group>
              <Group grow>
                <Select
                  mt={15}
                  disabled={disabled}
                  {...form.getInputProps(nameof<UserRowProps>("gender"))}
                  label={t(Dictionary.User.GENDER)}
                  data={genders}
                />
                <TextInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.User.EMAIL)}
                  {...form.getInputProps(nameof<UserRowProps>("email"))}
                />
              </Group>
              <Group grow>
                <TextInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.User.CARD_NUMBER)}
                  {...form.getInputProps(nameof<UserRowProps>("cardNumber"))}
                />

                <Checkbox
                  mt={25}
                  disabled={disabled}
                  className={styles.input}
                  label={t(Dictionary.General.STATUS)}
                  {...form.getInputProps("isActive", { type: "checkbox" })}
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

export default UserDetail;
