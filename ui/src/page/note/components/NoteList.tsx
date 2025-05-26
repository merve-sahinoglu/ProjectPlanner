import { Card, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { Note } from "../types";

type Props = {
  notes: Note[];
  onSelect: (note: Note) => void;
};

export function NoteList({ notes, onSelect }: Props) {
  return (
    <ScrollArea h={400}>
      <Stack gap="sm">
        {notes.map((note) => (
          <Card
            key={note.id}
            withBorder
            p="sm"
            mb={8}
            onClick={() => onSelect(note)}
            style={{ cursor: "pointer" }}
          >
            <Group justify="space-between">
              <Text fw={500}>{note.title}</Text>
              <Text size="xs" color="dimmed">
                {note.createdAt}
              </Text>
            </Group>
          </Card>
        ))}
      </Stack>
    </ScrollArea>
  );
}
