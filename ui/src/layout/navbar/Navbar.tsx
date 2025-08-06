import { useState } from "react";
import {
  IconCalendarStats,
  IconHome2,
  IconSettings,
} from "@tabler/icons-react";
import { Group, ScrollArea, Title } from "@mantine/core";
import classes from "./Navbar.module.css";
import routes from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { LinksGroup } from "./LinksGroup";

export function Navbar() {
  const [active, setActive] = useState("My Page");
  const [activeLink, setActiveLink] = useState("User");

  const navigate = useNavigate();

  const handleMenuItemSelect = (route: string) => {
    setActive(route);
  };

  const handleActiveLink = (route: string, additionalInfo?: string) => {
    setActiveLink(route);
    if (additionalInfo) {
      navigate(`/appointment/${additionalInfo}`);
    } else {
      navigate(route);
    }
  };

  const userId = "fe1d676f-1eb6-4c97-9f41-237322e1cc1f"; // Replace with actual user ID logic

  const mainLinksMockdata = [
    {
      icon: IconHome2,
      label: "My Page",
      initiallyOpened: true,
      links: [
        { label: "My Notes", link: routes.notes },
        {
          label: "My Appointment",
          link: routes.appointment,
          additionalInfo: userId,
        },
      ],
    },
    {
      icon: IconCalendarStats,
      label: "Appointment",

      link: `${routes.appointment}`,
    },
    {
      icon: IconSettings,
      label: "Settings",
      links: [
        { label: "User", link: routes.user },
        { label: "Room", link: routes.room },
        {
          label: "Play Groups",
          link: routes.playGroups,
        },
      ],
    },
  ];

  const links = mainLinksMockdata.map((item) => (
    <LinksGroup
      {...item}
      key={item.label}
      handleActiveLink={handleActiveLink}
      handleMenuItemSelect={handleMenuItemSelect}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Title order={4} className={classes.title}>
            {active}
          </Title>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </nav>
  );
}
