// src/features/user-relation/UserRelationEditor.tsx
import { useEffect, useRef } from "react";
import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import UserRelationProps from "./types";
import { nameof } from "../../helpers/name-of";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import Dictionary from "../../constants/dictionary";
import { useTranslation } from "react-i18next";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";

type Props = {
  initial?: Partial<UserRelationProps>;
  onCancel?: () => void;
  onSubmit: (data: UserRelationProps) => void;
};

export default function UserRelationEditor({
  initial,
  onCancel,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  const form = useForm<UserRelationProps>({
    initialValues: {
      id: initial?.id ?? "",
      userId: initial?.userId ?? "",
      profileGroupId: initial?.profileGroupId ?? "",
      userFullName: initial?.userFullName ?? "",
      profileGroupName: initial?.profileGroupName ?? "",
    },
    validate: {
      userId: (v) => (!v ? "Kullanıcı zorunlu" : null),
      profileGroupId: (v) => (!v ? "Grup zorunlu" : null),
    },
  });

  const initialValues = useRef<UserRelationProps>(form.values);

  const clearUserId = () => {
    form.setFieldValue("userId", "");
  };

  const clearProfileGroupId = () => {
    form.setFieldValue("profileGroupId", "");
  };

  // dışarıdan initial değişirse formu güncelle
  useEffect(() => {
    if (initial)
      form.setValues({
        id: initial.id ?? "",
        userId: initial.userId ?? "",
        profileGroupId: initial.profileGroupId ?? "",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id, initial?.userId, initial?.profileGroupId]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        const id =
          values.id ||
          (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2));
        onSubmit({ ...values, id });
      })}
    >
      <Stack gap="md">
        <FormAutocomplete
          searchInputLabel={t(Dictionary.Appointment.THERAPIST_ID)}
          placeholder={t(Dictionary.Appointment.THERAPIST_ID)}
          description=""
          disabled={false}
          apiUrl={createRequestUrl(apiUrl.userUrl)}
          form={form}
          formInputProperty="userId"
          {...form.getInputProps(nameof<UserRelationProps>("userId"))}
          initialData={[
            {
              value:
                initialValues.current && initialValues.current.userId
                  ? initialValues.current.userId
                  : "",
              label:
                initialValues.current && initialValues.current.userFullName
                  ? `${initialValues.current.userFullName}`
                  : "",
            },
          ]}
          clearValue={clearUserId}
        />
        
        <FormAutocomplete
          searchInputLabel={t(Dictionary.ProfileGroup.PROFILE_NAME)}
          placeholder={t(Dictionary.ProfileGroup.PROFILE_NAME)}
          description=""
          disabled={false}
          apiUrl={createRequestUrl(apiUrl.profileGroupUrl)}
          form={form}
          formInputProperty="profileGroupId"
          {...form.getInputProps(nameof<UserRelationProps>("profileGroupId"))}
          initialData={[
            {
              value:
                initialValues.current && initialValues.current.profileGroupId
                  ? initialValues.current.profileGroupId
                  : "",
              label:
                initialValues.current && initialValues.current.profileGroupName
                  ? `${initialValues.current.profileGroupName}`
                  : "",
            },
          ]}
          clearValue={clearProfileGroupId}
        />

        <Group justify="flex-end" mt="sm">
          {onCancel && (
            <Button variant="default" onClick={onCancel}>
              İptal
            </Button>
          )}
          <Button type="submit">Kaydet</Button>
        </Group>
      </Stack>
    </form>
  );
}
