import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Select, Button, Box } from "@mantine/core";
import { z } from "zod";

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
});

interface InstructorFormProps {
  instructor: Instructor;

  onClose: () => void;

  onSave: (instructor: Instructor) => void;
}

interface Instructor {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  type: "dil terapisi" | "müzik terapisi" | "özel eğitim";
}

export default function InstructorEdit({
  instructor,
  onClose,
  onSave,
}: InstructorFormProps) {
  const form = useForm({
    initialValues: {
      id: instructor.id ?? "",
      name: instructor.name ?? "",
      surname: instructor.surname ?? "",
      email: instructor.email ?? "",
      phone: instructor.phone ?? "",
      type: instructor.type ?? "",
    },
    validate: zodResolver(InstructorSchema),
  });

  function saveInstructor(instructor: Instructor) {
    onSave(instructor);
    onClose();
  }

  return (
    <Box mx="auto" maw={400}>
      <form onSubmit={form.onSubmit((values) => saveInstructor(values))}>
        <TextInput
          label="ID"
          placeholder="UUID"
          {...form.getInputProps("id")}
          required
        />
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
        <Button type="submit" mt="md">
          Kaydet
        </Button>
      </form>
    </Box>
  );
}
