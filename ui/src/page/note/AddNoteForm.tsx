
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

// Projendeki gerçek import yoluna göre düzelt:

export type AddNoteFormValues = {
  date: Date | null;
  childId: string;
  therapistId: string;
  noteHtml: string;
};

type Props = {
  onSave: (values: AddNoteFormValues) => void;
  onCancel: () => void;
};

export default function AddNoteForm({ onSave, onCancel }: Props) {
  const form = useForm<AddNoteFormValues>({
    initialValues: {
      date: new Date(),
      childId: "",
      therapistId: "",
      noteHtml: "",
    },
    validate: {
      date: (v) => v  ? null : "Tarih seçiniz",
      childId: (v) => (v.trim() ? null : "Child ID zorunlu"),
      therapistId: (v) => (v.trim() ? null : "Therapist ID zorunlu"),
      noteHtml: (v) => (v.trim() ? null : "Not boş olamaz"),
    },
  });

  // RichTextEditor – form ile senkron
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: form.values.noteHtml,
    onUpdate: ({ editor }) => form.setFieldValue("noteHtml", editor.getHTML()),
  });

  const handleSubmit = form.onSubmit((values) => {
    onSave(values);
    form.reset();
    editor?.commands.setContent("");
  });

  // FormAutocomplete kullanım notu:
  // BİR tek yaklaşımı kullan (çakışma olmasın):
  // → Bu komponent form ve alan adını alacak şekilde tasarlandıysa SADECE aşağıdaki props'ları ver.
  //   Dışarıdan ayrıca ...getInputProps veya value/onChange YOLLAMA.

  const clearChildId = () => form.setFieldValue("childId", "");
  const clearTherapistId = () => form.setFieldValue("therapistId", "");

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Group align="flex-end" wrap="wrap" gap="md">
          <DateInput
            label="Date"
            placeholder="Pick date"
            value={form.values.date}
            {...form.getInputProps(nameof<AddNoteFormValues>("date"))}
            w={220}
          />

          <FormAutocomplete
            searchInputLabel="Child ID"
            placeholder="Child ID"
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
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
    </form>
  );
}
