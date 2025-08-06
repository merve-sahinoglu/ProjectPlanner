import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import classes from "./NavbarLinksGroup.module.css";

interface Link {
  label: string;
  link: string;
  additionalInfo?: string;
}

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  link?: string;
  additionalInfo?: string;
  initiallyOpened?: boolean;
  links?: Link[];
  handleMenuItemSelect: (link: string) => void;
  handleActiveLink: (link: string, additionalInfo?: string) => void;
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  additionalInfo,
  initiallyOpened,
  links,
  handleMenuItemSelect,
  handleActiveLink,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const handleClick = (event: React.MouseEvent, link: Link) => {
    handleMenuItemSelect(link.label);
    handleActiveLink(link.link, link.additionalInfo);
    event.preventDefault();
  };

  const handleBoxClick = (event: React.MouseEvent) => {
  if (!hasLinks && link) {
    handleMenuItemSelect(label);
    handleActiveLink(link, additionalInfo);
    event.preventDefault();
  }
    
  };

  const items = (hasLinks ? links : []).map((link) => (
    <Text<"a">
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => handleClick(event, link)}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box
            style={{ display: "flex", alignItems: "center" }}
            onClick={(event) => handleBoxClick(event)}
          >
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? "rotate(-90deg)" : "none" }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}


