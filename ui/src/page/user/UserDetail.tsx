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
  Divider,
  Badge,
  Switch,
} from "@mantine/core";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import globalStyles from "../../assets/global.module.css";
import styles from "./UserDetail.module.css";
import { UserRowProps, UserResponse } from "./props/UserTypes";
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
import useRequestHandler from "../../hooks/useRequestHandler";
import CircleDot from "../../components/CircleDot/CircleDot";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import { DateInput } from "@mantine/dates";
import { IconCheck, IconX } from "@tabler/icons-react";

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
      .min(1, { message: `${t(Dictionary.User.Validation.USERNAME_MIN)}` })
      .max(16, { message: `${t(Dictionary.User.Validation.USERNAME_MAX)}` }),
    name: z
      .string()
      .min(1, { message: `${t(Dictionary.User.Validation.NAME_MIN)}` })
      .max(128, { message: `${t(Dictionary.User.Validation.NAME_MAX)}` }),
    surname: z
      .string()
      .min(1, { message: `${t(Dictionary.User.Validation.SURNAME_MIN)}` })
      .max(128, { message: `${t(Dictionary.User.Validation.SURNAME_MAX)}` }),
    title: z
      .string()
      .min(1, { message: `${t(Dictionary.User.Validation.TITLE_MIN)}` })
      .max(128, { message: `${t(Dictionary.User.Validation.TITLE_MAX)}` }),
    gender: z
      .string()
      .min(1, { message: `${t(Dictionary.User.Validation.GENDER_MIN)}` }),
  });

  const form = useForm<UserRowProps>({
    initialValues: { ...selectedUser, gender: selectedUser.gender.toString() },
    validate: zodResolver(schema),
  });

  const initialValues = useRef<UserRowProps>(form.values);

  const userType = [
    {
      value: "0",
      label: "Teacher",
    },
    {
      value: "1",
      label: "Chield",
    },
    {
      value: "2",
      label: "Relative",
    },
  ];

  function base64ToBlob(
    base64: string,
    mimeType: "image/jpeg" | "image/png"
  ): Blob {
    // Check if base64 contains the data URL prefix
    if (!base64) {
      return new Blob(); // Return an empty Blob if base64 is empty
    }
    const base64Data = base64.split(",")[1] || base64; // Take part after the comma or the entire string if no comma

    const byteCharacters = atob(base64Data); // Decode the base64 string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i); // Convert characters to byte values
    }

    const byteArray = new Uint8Array(byteNumbers); // Create Uint8Array from byte numbers
    const blob = new Blob([byteArray], { type: mimeType }); // Create a blob with the correct mime type

    return new File([blob], "image.jpeg", { type: mimeType }); // Return as File
  }

  const sendPostRequestForCreatedItem = async () => {
    if (
      form.values["profilePicture"] !== null &&
      form.values["profilePicture"] !== undefined
    ) {
      const base64 = await readFileAsBase64(
        form.values["profilePicture"] as File
      );
      form.values.profilePicture = base64ToByteArray(base64);
    }

    const response = await sendData<UserRowProps, UserResponse>(
      createRequestUrl(apiUrl.userUrl),
      RequestType.Post,
      form.values
    );

    if (!response.isSuccess) return;

    if (response.isSuccess) {
      setDisabled(true);

      const retval = {
        ...response.value,
        birthDate: response.value.birthDate
          ? new Date(response.value.birthDate)
          : null,
        typeId: response.value.typeId.toString(),
        profilePicture:
          response.value &&
          base64ToBlob(response.value.profilePicture as string, "image/jpeg"),
      };

      initialValues.current = retval;

      form.setValues(retval);

      form.resetDirty();

      setCanAddItem(!canAddItem);

      handleUpdateItemWithId(retval, createdItemGuid);

      changeSelectedItem(retval);

      changeCreatedItemGuid("");

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        if (reader.result) {
          const data = reader.result as string;
          const base64 = data.split(",")[1]; // Base64 verisini al
          resolve(base64);
        } else {
          reject(new Error("FileReader failed to load the file"));
        }
      };

      reader.onerror = () => reject(new Error("File reading error"));
    });
  };

  function base64ToByteArray(base64String: string): number[] {
    const cleanedBase64 = base64String.includes(",")
      ? base64String.split(",")[1]
      : base64String;
    const binaryString = atob(cleanedBase64);
    return Array.from(binaryString, (char) => char.charCodeAt(0)); // Uint8Array yerine number[]
  }

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument = createJsonPatchDocumentFromDirtyForm<UserRowProps>(
      form,
      form.values,
      ["profilePicture"]
    );

    if (
      form.values["profilePicture"] !== null &&
      form.values["profilePicture"] !== undefined
    ) {
      const base64 = await readFileAsBase64(
        form.values["profilePicture"] as File
      );
      const picture = {
        op: "replace",
        path: "/profilePicture",
        value: base64ToByteArray(base64), // Binary olarak saklamak istersen
      };

      patchDocument.push(picture);
    }

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

  const clearRelativeId = () => {
    form.setFieldValue("relativeId", "");
  };

  return (
    <>
      <Card.Section className={globalStyles.detailHeader} inheritPadding>
        <CircleDot isActive={form.values.isActive} />
        <Text lineClamp={1} fw={400} fz={20}>
          ({form.values.userName}) - {form.values.name} {form.values.surname}
        </Text>
      </Card.Section>
      <Divider mb={20} />
      <Tabs keepMounted={false} defaultValue="item">
        <Card.Section pb={0}>
          <Tabs.List>
            <Tabs.Tab
              leftSection={<RiInformationLine size="1rem" />}
              value="item"
            >
              {t(Dictionary.User.TITLE)}
            </Tabs.Tab>
          </Tabs.List>
        </Card.Section>
        <Tabs.Panel value="item">
          <Grid grow>
            <Grid.Col span={5}>
              <Group style={{ alignItems: "space-between" }}>
                <Avatar src={preview} size={90} />
                <FileInput
                  clearable={!disabled}
                  disabled={disabled}
                  accept="image/jpeg"
                  label="Attach your picture"
                  {...form.getInputProps(
                    nameof<UserRowProps>("profilePicture")
                  )}
                  placeholder={`${t(Dictionary.User.SELECT_FILE)}`}
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

                <Switch
                  className={styles.switchGlow}
                  size="md"
                  disabled={disabled}
                  color="teal"
                  onLabel="Aktif"
                  offLabel="Pasif"
                  thumbIcon={
                    form.values.isActive ? (
                      <IconCheck size={12} />
                    ) : (
                      <IconX size={12} />
                    )
                  }
                  {...form.getInputProps("isActive", { type: "checkbox" })}
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
                <Select
                  className={styles.input}
                  disabled={disabled}
                  {...form.getInputProps(nameof<UserRowProps>("typeId"))}
                  label={t(Dictionary.User.USER_TITLE)}
                  data={userType}
                />
                <FormAutocomplete
                  marginTop={15}
                  searchInputLabel={t(Dictionary.User.RELATIVE)}
                  placeholder={t(Dictionary.User.RELATIVE)}
                  description=""
                  disabled={disabled}
                  apiUrl={createRequestUrl(apiUrl.userUrl)}
                  form={form}
                  clearValue={clearRelativeId}
                  formInputProperty="relativeId"
                  additionalQueries={"&typeId=2&isActive=true"}
                  initialData={[
                    {
                      value:
                        initialValues.current &&
                        initialValues.current.relativeId
                          ? initialValues.current.relativeId
                          : "",
                      label:
                        initialValues.current &&
                        initialValues.current.relativeName
                          ? `${initialValues.current.relativeName}`
                          : "",
                    },
                  ]}
                  {...form.getInputProps(nameof<UserRowProps>("relativeId"))}
                />
                <DateInput
                  className={styles.input}
                  disabled={disabled}
                  label={t(Dictionary.User.BIRTH_DATE)}
                  mx="auto"
                  {...form.getInputProps(nameof<UserRowProps>("birthDate"))}
                />
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

                {/* <Checkbox
                  mt={25}
                  disabled={disabled}
                  className={styles.input}
                  label={t(Dictionary.General.STATUS)}
                  {...form.getInputProps("isActive", { type: "checkbox" })}
                /> */}
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
