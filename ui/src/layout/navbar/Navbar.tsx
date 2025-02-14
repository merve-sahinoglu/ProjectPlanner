import {
  IconBulb,
  IconCheckbox,
  IconPlus,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Box,
  Code,
  Group,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import classes from "./navbar.module.css";
import routes from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserInfoIcons } from "../../components/UserInfoIcons/UserInfoIcons";

const links = [
  { icon: IconBulb, label: "Activity", notifications: 3 },
  { icon: IconCheckbox, label: "Tasks", notifications: 4 },
  { icon: IconUser, label: "Contacts" },
];

const collections = [
  { emoji: "👍", label: "Sales" },
  { emoji: "🚚", label: "Deliveries" },
  { emoji: "💸", label: "Discounts" },
  { emoji: "💰", label: "Profits" },
  { emoji: "✨", label: "Reports" },
  { emoji: "📅", label: "Appointment", root: routes.appointment },
  { emoji: "🙈", label: "Instructor", root: routes.instructor },
  { emoji: "💁‍♀️", label: "User", root: routes.user },
];

export function Navbar() {
  const [isSelected, setIsSelected] = useState<string>("");

  const navigate = useNavigate();

  const handleMenuItemSelect = (route: string) => {
    setIsSelected(route);
    navigate(route);
  };

  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    <a
      onClick={() => handleMenuItemSelect(collection.root || "")}
      key={collection.label}
      className={classes.collectionLink}
    >
      <Box
        component="span"
        mr={9}
        fz={16}
        className={isSelected === collection.root ? classes.selected : ""}
      >
        {collection.emoji}
      </Box>{" "}
      {collection.label}
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UserInfoIcons />
      </div>
      <TextInput
        placeholder="Search"
        size="xs"
        leftSection={<IconSearch size={12} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
      />

      <div className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </div>

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </div>
    </nav>
  );
}
