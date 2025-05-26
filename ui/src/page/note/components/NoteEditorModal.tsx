import { Button, Modal } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import { Note } from "../types";

type Props = {
  opened: boolean;
  onClose: () => void;
  editor: Editor | null;
  note: Note | null;
  onSave: () => void;
};

export function NoteEditorModal({
  opened,
  onClose,
  editor,
  note,
  onSave,
}: Props) {
  return (
    <Modal opened={opened} onClose={onClose} size="lg" title={note?.title}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />
      </RichTextEditor>
      <Button mt="md" onClick={onSave}>
        Kaydet
      </Button>
    </Modal>
  );
}
