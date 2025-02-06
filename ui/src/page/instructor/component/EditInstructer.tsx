import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Select, Button, Box } from "@mantine/core";
import { z } from "zod";

export default function InstructorForm() {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      type: "",
    },
    validate: zodResolver(InstructorSchema),
  });

  return (
    <Box mx="auto" maw={400}>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
