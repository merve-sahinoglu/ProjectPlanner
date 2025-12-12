import { useEffect, useRef, type MouseEvent } from "react";

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

import useRequestManager from "@hooks/useRequestManager";
import { PageState } from "@shared/types/page.types";
import globalStyles from "../../assets/global.module.css";
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
import ExecutiveAutocomplete from "./ExecutiveAutocomplete";
import styles from "./PlayGroupDetail.module.css";
import {
  PlayGroupResponse,
  PlayGroupRowProps,
} from "./props/PlayGroupRowProps";

interface PlayGroupDetailProps {
  selectedPlayGroup: PlayGroupRowProps;
  changeSelectedItem(item: PlayGroupRowProps | null): void;
  handleDeleteItem(itemId: string): void;
  handleUpdateItem(item: PlayGroupRowProps): void;
  handleUpdateItemWithId(item: PlayGroupRowProps, id: string): void; // tempId -> realId
  mode: PageState;
  changeMode: (value: PageState) => void;
}

function PlayGroupDetail({
  selectedPlayGroup,
  handleDeleteItem,
  handleUpdateItem,
  handleUpdateItemWithId,
  changeSelectedItem,
  mode,
  changeMode,
}: PlayGroupDetailProps) {
  const { isPending, fetchData, sendData } = useRequestManager();
  const { t } = useTranslation();

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: `${t(Dictionary.PlayGroup.Validation.NAME_MIN)}` })
      .max(100, { message: `${t(Dictionary.PlayGroup.Validation.NAME_MAX)}` }),
  });

  const form = useForm<PlayGroupRowProps>({
    initialValues: { ...selectedPlayGroup },
    validate: zod4Resolver(schema),
  });

  // Cancel için snapshot
  const initialValuesRef = useRef<PlayGroupRowProps | null>(null);

  // selectedPlayGroup değişince senkronla
  useEffect(() => {
    initialValuesRef.current = selectedPlayGroup;
    form.setValues(selectedPlayGroup);
    form.resetDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlayGroup]);

  const sendPostRequestForCreatedItem = async () => {
    const tempId = form.values.id;

    const response = await sendData<PlayGroupRowProps, PlayGroupRowProps>(
      createRequestUrl(apiUrl.appointmentPlayGroupUrl),
      RequestType.Post,
      form.values
    );

    if (!response.isSuccess) return;

    // Create sonrası detay GET (senin eski akışın)
    const retVal = await fetchData<PlayGroupResponse>(
      createRequestUrl(apiUrl.appointmentPlayGroupUrl, response.value.id)
    );

    if (!retVal.isSuccess) return;

    changeMode("view");

    const saved = retVal.value as unknown as PlayGroupRowProps;

    initialValuesRef.current = saved;

    form.setValues(saved);
    form.resetDirty();

    // temp id’li item’ı real id’ye çevir
    handleUpdateItemWithId(saved, response.value.id);

    changeSelectedItem(saved);

    toast.success(`${t(Dictionary.Success.POSITIVE)}`);
  };

  const sendPatchRequestForModifiedItem = async () => {
    const patchDocument =
      createJsonPatchDocumentFromDirtyForm<PlayGroupRowProps>(
        form,
        form.values,
        ["playgroupTherapists"]
      );

    // therapistId listesi backend’in beklediği alan adıyla patch’e ekleniyor
    if (form.values.playgroupTherapists?.length > 0) {
      const updatedTherapists = form.values.playgroupTherapists.map(
        (x) => x.therapistId
      );

      patchDocument.push({
        op: JsonPatchOperationType.Replace,
        path: "/playgroupTherapistsId",
        value: updatedTherapists,
      });
    }

    const response = await sendData(
      createRequestUrl(apiUrl.appointmentPlayGroupUrl, form.values.id),
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
      // create iptal: temp kaydı listeden kaldır
      handleDeleteItem(form.values.id);
      form.reset();
      form.setFieldValue(nameof<PlayGroupRowProps>("id"), "");
      changeSelectedItem(null);
      return;
    }

    if (initialValuesRef.current) {
      form.setValues(initialValuesRef.current);
      form.resetDirty();
    }
  };

  const isDisabled = isPending || mode === "view";

  const handleRemoveTherapist = (therapistId: string) => {
    if (isDisabled) return;

    const updated = form.values.playgroupTherapists.filter(
      (x) => x.therapistId !== therapistId
    );
    form.setFieldValue(
      nameof<PlayGroupRowProps>("playgroupTherapists"),
      updated
    );
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
                disabled={isDisabled}
                label={t(Dictionary.PlayGroup.NAME)}
                {...form.getInputProps(nameof<PlayGroupRowProps>("name"))}
              />

              <Group grow>
                <NumberInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.PlayGroup.MIN_AGE)}
                  {...form.getInputProps(nameof<PlayGroupRowProps>("minAge"))}
                />
                <NumberInput
                  className={styles.input}
                  disabled={isDisabled}
                  label={t(Dictionary.PlayGroup.MAX_AGE)}
                  {...form.getInputProps(nameof<PlayGroupRowProps>("maxAge"))}
                />
                <NumberInput
                  className={styles.input}
                  disabled={isDisabled}
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
                  disabled={isDisabled}
                  apiUrl={createRequestUrl(apiUrl.userUrl)}
                  additionalQueries={{ typeId: 0, isActive: true }}
                  selectedTherapists={form.values.playgroupTherapists}
                  setFieldValue={(newValue) =>
                    form.setFieldValue("playgroupTherapists", newValue)
                  }
                  clearValue={() => console.log("clearValue")}
                />
              </Group>

              <Group mt={15}>{avatars}</Group>

              <Group grow>
                <Checkbox
                  mt={25}
                  disabled={isDisabled}
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

export default PlayGroupDetail;
