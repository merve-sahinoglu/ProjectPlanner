import { Button, Group, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { RichTextEditor } from "@mantine/tiptap";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useTranslation } from "react-i18next";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import { nameof } from "../../helpers/name-of";
import Dictionary from "../../helpers/translation/dictionary/dictionary";

// Projendeki gerçek import yoluna göre düzelt:

export type AddNoteFormValues = {
  date: Date | null;
  childId: string;
  therapistId: string;
  noteHtml: string;
};

type Props = {
  therapistId: string;
  childId?: string;
  onSave: (values: AddNoteFormValues) => void;
  onCancel: () => void;
};

export default function AddNoteForm({
  onSave,
  onCancel,
  therapistId,
  childId,
}: Props) {
  const { t } = useTranslation();
  const form = useForm<AddNoteFormValues>({
    initialValues: {
      date: new Date(),
      childId: childId ?? "",
      therapistId: therapistId,
      noteHtml: "",
    },
    validate: {
      date: (v) => (v ? null : t(Dictionary.Validation.Input.MIN)),
      childId: (v) => (v.trim() ? null : t(Dictionary.Validation.Input.MIN)),
      therapistId: (v) => (v.trim() ? null : t(Dictionary.Validation.Input.MIN)),
      noteHtml: (v) => (v.trim() ? null : t(Dictionary.Validation.Input.MIN)),
    },
  });

  // RichTextEditor – form ile senkron
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: form.values.noteHtml,
    onUpdate: ({ editor }) => form.setFieldValue("noteHtml", editor.getHTML()),
  });

  const handleSaveClick = () => {
    const res = form.validate();
    if (res.hasErrors) return;
    onSave(form.values); // parent'a değerleri gönder
    form.reset(); // temizle
    editor?.commands.setContent(""); // editörü temizle
  };

  const clearChildId = () => form.setFieldValue("childId", "");

  return (
    <Stack gap="md">
      <Group align="flex-end" wrap="wrap" gap="md">
        <DateInput
          label={t(Dictionary.Note.Notebook.DATE)}
          placeholder={t(Dictionary.Note.Notebook.DATE)}
          value={form.values.date}
          {...form.getInputProps(nameof<AddNoteFormValues>("date"))}
          w={220}
        />

        <FormAutocomplete
          searchInputLabel={t(Dictionary.Appointment.CHILD_ID)}
          placeholder={t(Dictionary.Appointment.CHILD_ID)}
          description=""
          apiUrl={createRequestUrl(apiUrl.userUrl)}
          form={form}
          formInputProperty="childId"
          {...form.getInputProps(nameof<AddNoteFormValues>("childId"))}
          clearValue={clearChildId}
        />
      </Group>

      <div>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          {/* Editör alanını büyüt */}
          <RichTextEditor.Content style={{ minHeight: 320 }} />
        </RichTextEditor>

        {form.errors.noteHtml && (
          <div
            style={{
              color: "var(--mantine-color-red-6)",
              fontSize: 12,
              marginTop: 6,
            }}
          >
            {form.errors.noteHtml}
          </div>
        )}
      </div>

      <Group justify="flex-end" gap="sm">
        <Button variant="light" onClick={onCancel} type="button">
          {t(Dictionary.Button.CANCEL)}
        </Button>
        <Button onClick={handleSaveClick} type="button">
          {t(Dictionary.Button.SAVE)}
        </Button>
      </Group>
    </Stack>
  );
}
