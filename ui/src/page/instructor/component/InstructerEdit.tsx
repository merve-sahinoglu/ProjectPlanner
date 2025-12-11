import {
  Box,
  Button,
  FileInput,
  Group,
  Image,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { BsSave, BsTrash } from "react-icons/bs";
import { z } from "zod";
import { Instructor } from "../types/instructer-types";

const InstructorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  type: z.union([
    z.literal("dil terapisi"),
    z.literal("müzik terapisi"),
    z.literal("özel eğitim"),
  ]),
  profilePicture: z.instanceof(File).nullable().optional(),
});

interface InstructorFormProps {
  instructor: Instructor;

  onClose: () => void;

  onSave: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
}

export default function InstructorEdit({
  instructor,
  onClose,
  onSave,
  onDelete,
}: InstructorFormProps) {
  const [preview, setPreview] = useState<string | null>(
    instructor.profilePicture
      ? URL.createObjectURL(instructor.profilePicture)
      : null
  );

  const form = useForm({
    initialValues: {
      id: instructor.id ?? "",
      name: instructor.name ?? "",
      surname: instructor.surname ?? "",
      email: instructor.email ?? "",
      phone: instructor.phone ?? "",
      type: instructor.type ?? "",
      profilePicture: instructor.profilePicture ?? null,
    },
    validate: zod4Resolver(InstructorSchema),
  });

  function saveInstructor(instructor: Instructor) {
    onSave(instructor);
    onClose();
  }

  function deleteInstructor() {
    onDelete(form.values.id);
    onClose();
  }

  return (
    <Box mx="auto" maw={400}>
      <form onSubmit={form.onSubmit((values) => saveInstructor(values))}>
        <FileInput
          accept="image/png,image/jpeg"
          label="Upload picture"
          placeholder="Upload picture"
          onChange={(file) => {
            form.setFieldValue("profilePicture", file);
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setPreview(reader.result as string);
              reader.readAsDataURL(file);
            } else {
              setPreview(null);
            }
          }}
        />

        {preview && (
          <Image
            src={preview}
            alt="Profile Preview"
            width={100}
            height={100}
            radius="md"
            mt="sm"
          />
        )}
        <TextInput
          label="Ad"
          placeholder="Adınızı girin"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Soyad"
          placeholder="Soyadınızı girin"
          {...form.getInputProps("surname")}
        />
        <TextInput
          label="E-posta"
          placeholder="E-posta adresi"
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Telefon"
          placeholder="Telefon numarası"
          {...form.getInputProps("phone")}
        />
        <Select
          label="Tip"
          placeholder="Eğitim türünü seçin"
          data={["dil terapisi", "müzik terapisi", "özel eğitim"]}
          {...form.getInputProps("type")}
          required
        />
        <Group justify="space-between">
          <Button type="submit" mt="md">
            <BsSave />
          </Button>
          <Button
            type="button"
            onClick={() => {
              deleteInstructor();
            }}
            mt="md"
          >
            <BsTrash />
          </Button>
        </Group>
      </form>
    </Box>
  );
}
