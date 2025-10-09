import { Button, Group, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import FormAutocomplete from "../../components/Autocomplete/FormAutocomplete";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import { nameof } from "../../helpers/name-of";
import { useRef } from "react";

// Projendeki gerçek import yoluna göre düzelt:

export type EditNoteFormValues = {
  id: string; // Not ID'si, düzenleme için gerekli
  date: Date | null;
  childId: string;
  childName?: string; // Çocuğun adı, opsiyonel
  therapistId: string;
  noteHtml: string;
  childProfilePicture: Blob | number[];
};

type Props = {
  data: EditNoteFormValues;
  onSave: (values: EditNoteFormValues) => void;
  onDelete: (values: EditNoteFormValues) => void;
};

export default function EditNoteForm({ data, onSave, onDelete }: Props) {
  const form = useForm<EditNoteFormValues>({
    initialValues: {
      id: data.id ?? "",
      date: data.date ?? new Date(),
      childId: data.childId ?? "",
      childName: data.childName ?? "",
      therapistId: data.therapistId ?? "",
      noteHtml: data.noteHtml ?? "",
      childProfilePicture: data.childProfilePicture ?? null,
    },
    validate: {
      date: (v) => (v ? null : "Tarih seçiniz"),
      childId: (v) => (v.trim() ? null : "Child ID zorunlu"),
      therapistId: (v) => (v.trim() ? null : "Therapist ID zorunlu"),
      noteHtml: (v) => (v.trim() ? null : "Not boş olamaz"),
    },
  });

  const initialValues = useRef<EditNoteFormValues>(form.values);

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

  const handleDeleteClick = () => {
    onDelete(form.values); // parent'a değerleri gönder
  };

  return (
    <Stack gap="md">
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

      <Group justify="space-between" gap="sm">
        <Button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={handleDeleteClick}
          type="button"
        >
          Delete
        </Button>
        <Button onClick={handleSaveClick} type="button">
          Save
        </Button>
      </Group>
    </Stack>
  );
}
