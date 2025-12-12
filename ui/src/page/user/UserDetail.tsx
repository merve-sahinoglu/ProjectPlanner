import { useEffect, useRef, useState, type MouseEvent } from "react";

import {
  Avatar,
  Card,
  Divider,
  FileInput,
  Flex,
  Grid,
  Group,
  PasswordInput,
  Select,
  Switch,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RiInformationLine } from "react-icons/ri";
import { z } from "zod";

import { FLEX_GAP_XS, LEFT_SECTION_FLEX_GAP } from "@constants/constants";
import useRequestManager from "@hooks/useRequestManager";
import { PageState } from "@shared/types/page.types";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import CircleDot from "../../components/CircleDot/CircleDot";
import OperationButtons from "../../components/OperationButtons/OperationButtons";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enums/request-type";
import { nameof } from "../../helpers/name-of";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import {
  createJsonPatchDocumentFromDirtyForm,
  JsonPatchOperationType,
} from "../../services/json-patch-handler/json-patch-document";
import { UserResponse, UserRowProps } from "./props/UserTypes";
import styles from "./UserDetail.module.css";

interface ItemDetailProps {
  selectedUser: UserRowProps;
  changeSelectedItem(item: UserRowProps | null): void;
  handleDeleteItem(itemId: string): void;
  handleUpdateItem(item: UserRowProps): void;
  handleUpdateItemWithId(item: UserRowProps, id: string): void;
  mode: PageState;
  changeMode: (value: PageState) => void;
}

const genders = [
  { value: "0", label: "Unknown" },
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "3", label: "Other" },
];

const userType = [
  { value: "0", label: "Teacher" },
  { value: "1", label: "Chield" },
  { value: "2", label: "Relative" },
];

function UserDetail({
  selectedUser,
  handleDeleteItem,
  handleUpdateItem,
  handleUpdateItemWithId,
  changeSelectedItem,
  mode,
  changeMode,
}: ItemDetailProps) {
  const { isPending, sendData } = useRequestManager();
  const { t } = useTranslation();

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
    initialValues: {
      ...selectedUser,
      gender: selectedUser.gender?.toString?.() ?? "0",
    },
    validate: zod4Resolver(schema),
  });

  // Cancel'da geri dönmek için snapshot
  const initialValuesRef = useRef<UserRowProps | null>(null);

  // Autocomplete initialData render'da ref okumadan üretmek için state
  const [initialRelative, setInitialRelative] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });

  // Avatar preview
  const [preview, setPreview] = useState<string | null>(null);

  // preview objectUrl cleanup için
  const previewObjectUrlRef = useRef<string | null>(null);

  // selectedUser değişince form + initial snapshot + initialData + preview güncelle
  useEffect(() => {
    const normalized: UserRowProps = {
      ...selectedUser,
      gender: selectedUser.gender?.toString?.() ?? "0",
    };

    // initial snapshot
    initialValuesRef.current = normalized;

    // form değerlerini selectedUser'a senkronla
    form.setValues(normalized);
    form.resetDirty();

    // autocomplete initial data
    setInitialRelative({
      value: selectedUser.relativeId ?? "",
      label: selectedUser.relativeName ? `${selectedUser.relativeName}` : "",
    });

    // preview cleanup
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    const pp = selectedUser.profilePicture as unknown;

    // File/Blob ise objectUrl
    if (pp instanceof Blob) {
      const url = URL.createObjectURL(pp);
      previewObjectUrlRef.current = url;
      setPreview(url);
      return;
    }

    // string ise (url veya data url)
    if (typeof pp === "string" && pp.length > 0) {
      // Elindeki format "raw base64" ise istersen: `data:image/jpeg;base64,${pp}`
      setPreview(pp.startsWith("data:") ? pp : pp);
      return;
    }

    setPreview(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  // Unmount'ta cleanup
  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  function base64ToBlob(
    base64: string,
    mimeType: "image/jpeg" | "image/png"
  ): File {
    if (!base64) return new File([], "image.jpeg", { type: mimeType });

    const base64Data = base64.split(",")[1] || base64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    return new File([blob], "image.jpeg", { type: mimeType });
  }

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        if (reader.result) {
          const data = reader.result as string;
          const base64 = data.split(",")[1];
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
    return Array.from(binaryString, (char) => char.charCodeAt(0));
  }

  const sendPostRequestForCreatedItem = async () => {
    if (
      form.values.profilePicture !== null &&
      form.values.profilePicture !== undefined
    ) {
      const file = form.values.profilePicture as unknown;

      if (file instanceof File) {
        const base64 = await readFileAsBase64(file);

        form.values.profilePicture = base64ToByteArray(base64);
      }
    }

    const response = await sendData<UserRowProps, UserResponse>(
      createRequestUrl(apiUrl.userUrl),
      RequestType.Post,
      form.values
    );

    if (!response.isSuccess) return;

    changeMode("view");

    const createdItemGuid = response.value.id;

    const retval: UserRowProps = {
      ...response.value,
      birthDate: response.value.birthDate
        ? new Date(response.value.birthDate)
        : null,
      typeId: response.value.typeId.toString(),
      gender: response.value.gender?.toString?.() ?? "0",
      profilePicture: response.value?.profilePicture
        ? base64ToBlob(response.value.profilePicture as string, "image/jpeg")
        : null,
    } as unknown as UserRowProps;

    initialValuesRef.current = retval;

    form.setValues(retval);
    form.resetDirty();

    handleUpdateItemWithId(retval, createdItemGuid);
    changeSelectedItem(retval);

    toast.success(`${t(Dictionary.Success.POSITIVE)}`);
  };

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument = createJsonPatchDocumentFromDirtyForm<UserRowProps>(
      form,
      form.values,
      ["profilePicture"]
    );

    if (
      form.values.profilePicture !== null &&
      form.values.profilePicture !== undefined
    ) {
      const file = form.values.profilePicture as unknown;

      if (file instanceof File) {
        const base64 = await readFileAsBase64(file);
        patchDocument.push({
          op: JsonPatchOperationType.Replace,
          path: "/profilePicture",
          value: base64,
        });
      }
    }

    const response = await sendData(
      createRequestUrl(apiUrl.userUrl, form.values.id),
      RequestType.Patch,
      patchDocument
    );

    if (response.isSuccess) {
      changeMode("view");

      form.resetDirty();

      initialValuesRef.current = form.values;

      handleUpdateItem(form.values);

      toast.success(`${t(Dictionary.Success.POSITIVE)}`);
    }
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
      handleDeleteItem(form.values.id);
      form.reset();
      form.setFieldValue(nameof<UserRowProps>("id"), "");
      changeSelectedItem(null);
      return;
    }

    if (initialValuesRef.current) {
      form.setValues(initialValuesRef.current);
      form.resetDirty();
    }
  };

  const clearRelativeId = () => {
    form.setFieldValue("relativeId", "");
  };

  const isDisabled = isPending || mode === "view";

  return (
    <>
      <Flex align="center" gap={LEFT_SECTION_FLEX_GAP}>
        <CircleDot isActive={form.values.isActive} />
        <Text lineClamp={1} fw={400} fz={20} component="span">
          ({form.values.userName}) - {form.values.name} {form.values.surname}
        </Text>
      </Flex>

      <Divider mb={FLEX_GAP_XS} />

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
                  clearable={!isDisabled}
                  disabled={isDisabled}
                  accept="image/jpeg"
                  label="Attach your picture"
                  placeholder={`${t(Dictionary.User.SELECT_FILE)}`}
                  {...form.getInputProps(
                    nameof<UserRowProps>("profilePicture")
                  )}
                  onChange={(file) => {
                    form.setFieldValue("profilePicture", file);

                    // preview cleanup
                    if (previewObjectUrlRef.current) {
                      URL.revokeObjectURL(previewObjectUrlRef.current);
                      previewObjectUrlRef.current = null;
                    }

                    if (file) {
                      // File ise objectUrl ile hızlı preview
                      const url = URL.createObjectURL(file);
                      previewObjectUrlRef.current = url;
                      setPreview(url);
                    } else {
                      setPreview(null);
                    }
                  }}
                />

                <Switch
                  className={styles.switchGlow}
                  size="md"
                  disabled={isDisabled}
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
                disabled={isDisabled}
                label={`${t(Dictionary.User.USERNAME)}`}
                {...form.getInputProps(nameof<UserRowProps>("userName"))}
              />

              <PasswordInput
                disabled={isDisabled}
                mt={15}
                label={t(Dictionary.Login.PASSWORD)}
                {...form.getInputProps(nameof<UserRowProps>("password"))}
              />

              <Group grow>
                <TextInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.User.NAME)}
                  {...form.getInputProps(nameof<UserRowProps>("name"))}
                />
                <TextInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.User.SURNAME)}
                  {...form.getInputProps(nameof<UserRowProps>("surname"))}
                />
              </Group>

              <Group grow>
                <Select
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.User.USER_TITLE)}
                  data={userType}
                  {...form.getInputProps(nameof<UserRowProps>("typeId"))}
                />

                <FormAutocomplete
                  marginTop={15}
                  searchInputLabel={t(Dictionary.User.RELATIVE)}
                  placeholder={t(Dictionary.User.RELATIVE)}
                  description=""
                  disabled={isDisabled}
                  apiUrl={createRequestUrl(apiUrl.userUrl)}
                  form={form}
                  clearValue={clearRelativeId}
                  formInputProperty="relativeId"
                  additionalParameters={{ typeId: 2, isActive: true }}
                  initialData={[initialRelative]}
                  {...form.getInputProps(nameof<UserRowProps>("relativeId"))}
                />

                <DateInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.User.BIRTH_DATE)}
                  mx="auto"
                  {...form.getInputProps(nameof<UserRowProps>("birthDate"))}
                />
              </Group>

              <Group grow>
                <Select
                  mt={15}
                  disabled={isDisabled}
                  label={t(Dictionary.User.GENDER)}
                  data={genders}
                  {...form.getInputProps(nameof<UserRowProps>("gender"))}
                />

                <TextInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.User.EMAIL)}
                  {...form.getInputProps(nameof<UserRowProps>("email"))}
                />
              </Group>

              <Group grow>
                <TextInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.User.CARD_NUMBER)}
                  {...form.getInputProps(nameof<UserRowProps>("cardNumber"))}
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

export default UserDetail;
