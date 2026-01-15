import {
    Button,
    Group,
    Paper,
    SimpleGrid,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import Dictionary from "../../helpers/translation/dictionary/dictionary";
import classes from "./contact.module.css";
import { ContactIconsList } from "./ContactIcons";

export function ContactUs() {
  const { t } = useTranslation();
  return (
    <Paper shadow="md" radius="lg">
      <div className={classes.wrapper}>
        <div className={classes.contacts}>
          <Text fz="lg" fw={700} className={classes.title} c="#fff">
            {t(Dictionary.Contact.TITLE)}
          </Text>

          <ContactIconsList />
        </div>

        <form
          className={classes.form}
          onSubmit={(event) => event.preventDefault()}
        >
          <Text fz="lg" fw={700} className={classes.title}>
            {t(Dictionary.Contact.TITLE)}
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label={t(Dictionary.Contact.NAME)} placeholder={t(Dictionary.Contact.NAME)} />
              <TextInput
                label={t(Dictionary.Contact.EMAIL)}
                placeholder="hello@mantine.dev"
                required
              />
            </SimpleGrid>

            <TextInput mt="md" label={t(Dictionary.Contact.SUBJECT)} placeholder={t(Dictionary.Contact.SUBJECT)} required />

            <Textarea
              mt="md"
              label={t(Dictionary.Contact.MESSAGE)}
              placeholder={t(Dictionary.Contact.MESSAGE)}
              minRows={3}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" className={classes.control}>
                {t(Dictionary.Contact.SEND)}
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}
