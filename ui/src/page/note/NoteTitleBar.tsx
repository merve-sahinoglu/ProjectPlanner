// NoteTitleBar.tsx
import { Avatar, Badge, Group, Stack, Text, Title, rem } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import React from "react";

type NoteTitleBarProps = {
  name: string; // çocuğun adı veya başlık
  date?: Date | string | null; // tarih
  avatar?: Blob | number[]; // opsiyonel: avatar url
  rightSection?: React.ReactNode; // opsiyonel ikon/aksiyonlar
};

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  // tr-TR tarih + kısa saat
  return dt.toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function normalize(raw: any, mime = "image/jpeg"): string {
    let v: any = raw;

    if (typeof v === "string") {
      const dataUrl = normalizeDataUrl(v, mime);
      if (dataUrl) return dataUrl;
    }

  const s = String(raw).trim();

  // Zaten http(s)/blob ise bırak
  if (/^(https?:|blob:)/i.test(s)) return s;

  // Doğru data: header'ı varsa olduğu gibi dön
  if (/^data:[^,]+,/.test(s)) return s;

  // Yanlış "data:/9j..." gelmişse → "data:<mime>;base64,<base64>"
  if (s.startsWith("data:/")) {
    return `data:${mime};base64,${s.slice(5)}`; // "data:".length === 5
  }

  // İçindeki gerçek base64’i yakala (en az 20 karakter)
  const m = s.match(/([A-Za-z0-9+/=]{20,})/);
  if (m) return `data:${mime};base64,${m[1]}`;

  // Son çare: base64 gibi davran
  return `data:${mime};base64,${s}`;
}

function normalizeDataUrl(raw: string, mime = "image/jpeg"): string {
  const s = String(raw).trim();

  // Zaten http(s)/blob ise bırak
  if (/^(https?:|blob:)/i.test(s)) return s;

  // Doğru data: header'ı varsa olduğu gibi dön
  if (/^data:[^,]+,/.test(s)) return s;

  // Yanlış "data:/9j..." gelmişse → "data:<mime>;base64,<base64>"
  if (s.startsWith("data:/")) {
    return `data:${mime};base64,${s.slice(5)}`; // "data:".length === 5
  }

  // İçindeki gerçek base64’i yakala (en az 20 karakter)
  const m = s.match(/([A-Za-z0-9+/=]{20,})/);
  if (m) return `data:${mime};base64,${m[1]}`;

  // Son çare: base64 gibi davran
  return `data:${mime};base64,${s}`;
}


export function NoteTitleBar({
  name,
  date,
  avatar,
  rightSection,
}: NoteTitleBarProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Group wrap="nowrap" gap="sm">
        <Avatar src={normalize(avatar)} radius="xl" size={100}>
          {name?.[0] ?? "?"}
        </Avatar>

        <Stack gap={2}>
          <Title
            order={4}
            fw={800}
            style={{ lineHeight: 1.1, fontSize: rem(26) }}
          >
            {name}
          </Title>

          <Group gap="xs">
            <Badge
              variant="light"
              radius="sm"
              size={"lg"}
              leftSection={
                <IconCalendar size={18} style={{ marginRight: rem(2) }} />
              }
            >
              {formatDate(date)}
            </Badge>
          </Group>
        </Stack>
      </Group>

      {rightSection}
    </Group>
  );
}
