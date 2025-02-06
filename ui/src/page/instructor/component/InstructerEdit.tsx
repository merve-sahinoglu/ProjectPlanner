import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Select, Button, Box, Group } from "@mantine/core";
import { z } from "zod";
import { BsFillSaveFill, BsSave, BsTrash } from "react-icons/bs";

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
  onDelete: (id: string) => void;
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
  onDelete,
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

  function deleteInstructor(event: React.MouseEvent) {
    debugger;
    onDelete(form.values.id);
    onClose();
  }

  return (
    <Box mx="auto" maw={400}>
      <form onSubmit={form.onSubmit((values) => saveInstructor(values))}>
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
            onClick={(e) => {
              deleteInstructor(e);
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
