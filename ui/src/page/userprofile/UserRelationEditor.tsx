// src/features/user-relation/UserRelationEditor.tsx
import { useEffect } from "react";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { UserRelationProps } from "./types";

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
  const form = useForm<UserRelationProps>({
    initialValues: {
      id: initial?.id ?? "",
      userId: initial?.userId ?? "",
      profileGroupId: initial?.profileGroupId ?? "",
    },
    validate: {
      userId: (v) => (!v ? "Kullanıcı zorunlu" : null),
      profileGroupId: (v) => (!v ? "Grup zorunlu" : null),
    },
  });

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
        <TextInput
          label="User Id"
          placeholder="user-123"
          {...form.getInputProps("userId")}
        />
        <TextInput
          label="Profile Group Id"
          placeholder="group-456"
          {...form.getInputProps("profileGroupId")}
        />
        {/* ID genellikle backend üretir; istersen gösterme */}
        <TextInput
          label="Id"
          placeholder="(oto-üretilecek)"
          disabled
          {...form.getInputProps("id")}
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
