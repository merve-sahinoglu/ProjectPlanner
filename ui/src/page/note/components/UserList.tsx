import { Card, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";

export type User = {
  id: string;
  name: string;
};

type Props = {
  users: User[];
  onSelect: (user: User) => void;
};

export function UserList({ users, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack w={250}>
      <TextInput
        placeholder="Kullanıcı Ara..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <ScrollArea h={400}>
        {filtered.map((user) => (
          <Card
            key={user.id}
            withBorder
            shadow="sm"
            p="xs"
            mb={8}
            onClick={() => onSelect(user)}
            style={{ cursor: "pointer" }}
          >
            <Text>{user.name}</Text>
          </Card>
        ))}
      </ScrollArea>
    </Stack>
  );
}
