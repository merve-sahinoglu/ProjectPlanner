import {
  Card,
  Checkbox,
  Grid,
  Group,
  PasswordInput,
  Select,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { container } from "tsyringe";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import RequestHandler from "../../services/request-handler/request-handler";
import styles from "./UserDetail.module.css";
import { UserRowProps } from "./props/UserRowProps";
import { useTranslation } from "react-i18next";
import Dictionary from "../../constants/dictionary";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import toast from "react-hot-toast";
import { createJsonPatchDocumentFromDirtyForm } from "../../services/json-patch-handler/json-patch-document";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enum/request-type";
import { ResponseBase } from "../../services/request-handler/response-base";
import { nameof } from "../../helpers/name-of";
import CircleDot from "../../component/CircleDot/CircleDot";
import { RiInformationLine } from "react-icons/ri";
import { BsBoxes } from "react-icons/bs";
import { DatePickerInput } from "@mantine/dates";
import OperationButtons from "../../component/OperationButtons/OperationButtons";
import useUserPreferences from "../../hooks/useUserPreferenceStore";
import globalStyles from "../../assets/global.module.css";

const requestHandler = container.resolve(RequestHandler);
interface ItemDetailProps {
  selectedUser: UserRowProps | null;
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
  if (!selectedUser) {
    return <></>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const language = useUserPreferences((state) => state.language);

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<UserRowProps>({
    initialValues: {
      birthDate: selectedUser.birthDate,
      cardNumber: selectedUser.cardNumber,
      email: selectedUser.email,
      gender: selectedUser.gender.toString(),
      id: selectedUser.id,
      isActive: selectedUser.isActive,
      name: selectedUser.name,
      surname: selectedUser.surname,
      title: selectedUser.title,
      userName: selectedUser.userName,
      searchText: selectedUser.searchText,
    },
    validate: zodResolver(schema),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const componentMounted = useRef<boolean>(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const initialValues = useRef<UserRowProps>(form.values);

  const sendPostRequestForCreatedItem = async () => {
    const response = (await requestHandler.sendRequest(
      createRequestUrl(apiUrl.userUrl),
      RequestType.Post,
      form.values
    )) as ResponseBase<UserRowProps>;
    if (response.isSuccess) {
      setDisabled(true);

      const createdItem = (await requestHandler.getRequest(
        createRequestUrl(apiUrl.userUrl, response.data.id)
      )) as ResponseBase<UserRowProps>;

      if (createdItem.isSuccess) {
        createdItem.data = {
          ...createdItem.data,
        };

        initialValues.current = createdItem.data;

        form.setValues(createdItem.data);

        form.resetDirty();

        setCanAddItem(!canAddItem);

        handleUpdateItemWithId(createdItem.data, createdItemGuid);

        changeSelectedItem(createdItem.data);

        changeCreatedItemGuid("");

        toast.success(`${t(Dictionary.Success.POSITIVE)}`);
      }
    }
  };

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument = createJsonPatchDocumentFromDirtyForm<UserRowProps>(
      form,
      form.values
    );

    const response = (await requestHandler.sendRequest(
      createRequestUrl(apiUrl.userUrl, form.values.id),
      RequestType.Patch,
      patchDocument
    )) as ResponseBase<UserRowProps>;

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
    // const retVal = checkIfUserHasAuthorization(Authorization.Item.CAN_EDIT);

    // if (!retVal) {
    //   toast.error(t(Dictionary.Authorization.CANT_ACCESS));
    //   return;
    // }

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!componentMounted.current) {
      componentMounted.current = true;
      return;
    }
    form.resetDirty();
  }, [form.values.id]);

  return (
    <>
      <Card.Section
        className={globalStyles.detailHeader}
        withBorder
        inheritPadding
      >
        <CircleDot isActive={form.values.isActive} />
        <Text lineClamp={1} fw={500} fz={20}>
          ({form.values.name}) - {form.values.surname}
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
          <Tabs.List pl={15}>
            <Tabs.Tab
              leftSection={<RiInformationLine size="1rem" />}
              value="item"
            >
              {t(Dictionary.Item.TITLE)}
            </Tabs.Tab>
            <Tabs.Tab
              disabled={!canAddItem}
              leftSection={<BsBoxes size="1rem" />}
              value="itemProperty"
            >
              {t(Dictionary.Item.ITEM_FACILITY_PROPERTIES)}
            </Tabs.Tab>
          </Tabs.List>
        </Card.Section>
        <Tabs.Panel value="item">
          <Grid grow>
            <Grid.Col span={6}>
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
                <DatePickerInput
                  mt={15}
                  locale={language}
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
