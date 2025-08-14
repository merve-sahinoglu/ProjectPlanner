import { useId, useState } from "react";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
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

  // highlighting & navigation
  activeParent?: string;
  activePath?: string;
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
  activeParent,
  activePath,
  handleMenuItemSelect,
  handleActiveLink,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links) && links.length > 0;
  const [opened, setOpened] = useState(initiallyOpened || false);
  const collapseId = useId();

  // parent & leaf aktiflik
  const isParentActive = activeParent === label;
  const isLeafActive = (path?: string) => !!path && activePath === path;

  const onParentClick = (e: React.MouseEvent) => {
    if (hasLinks) {
      setOpened((o) => !o);
    } else if (link) {
      handleMenuItemSelect(label);
      handleActiveLink(link, additionalInfo);
    }
    e.preventDefault();
  };

  const onLeafClick = (e: React.MouseEvent, l: Link) => {
    handleMenuItemSelect(label);
    handleActiveLink(l.link, l.additionalInfo);
    e.preventDefault();
  };

  return (
    <>
      <UnstyledButton
        onClick={onParentClick}
        className={`${classes.control} ${
          isParentActive ? classes.controlActive : ""
        }`}
        data-opened={opened || undefined}
      >
        {/* solda renk aksanı */}
        <span
          className={`${classes.accent} ${
            isParentActive ? classes.accentActive : ""
          }`}
        />

        <Group justify="space-between" gap={8} wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon
              radius="md"
              size={34}
              variant={isParentActive ? "gradient" : "light"}
              gradient={{ from: "pink", to: "violet", deg: 35 }}
              color="grape"
              className={classes.icon}
            >
              <Icon size={18} />
            </ThemeIcon>

            <Box className={classes.labelWrap}>
              <Text fw={600} fz="sm" className={classes.label}>
                {label}
              </Text>
              {hasLinks && (
                <Text fz={11} c="dimmed" className={classes.subhint}>
                  {opened ? "Kapat" : "Aç"} • {links!.length} link
                </Text>
              )}
            </Box>
          </Group>

          {hasLinks && (
            <IconChevronRight
              size={16}
              stroke={1.6}
              className={`${classes.chevron} ${
                opened ? classes.chevronOpened : ""
              }`}
              aria-hidden
            />
          )}
        </Group>
      </UnstyledButton>

      {hasLinks ? (
        <Collapse in={opened} id={collapseId}>
          <div className={classes.links}>
            {links!.map((l) => (
              <a
                key={l.label}
                href={l.link}
                className={`${classes.link} ${
                  isLeafActive(l.link) ? classes.linkActive : ""
                }`}
                onClick={(e) => onLeafClick(e, l)}
              >
                {/* aktif yaprak için küçük nokta */}
                <span className={classes.dot} />
                <span>{l.label}</span>
              </a>
            ))}
          </div>
        </Collapse>
      ) : null}
    </>
  );
}
