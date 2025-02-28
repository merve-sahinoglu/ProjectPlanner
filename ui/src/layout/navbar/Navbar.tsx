import { useState } from "react";
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconHome2,
  IconSettings,
} from "@tabler/icons-react";
import { Title, Tooltip, UnstyledButton } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Navbar.module.css";
import routes from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const mainLinksMockdata = [
  {
    icon: IconHome2,
    label: "Home",
    SubLinks: [{ label: "My Callender", root: routes.user }],
  },
  { icon: IconGauge, label: "" },
  {
    icon: IconCalendarStats,
    label: "Appointment",
    SubLinks: [{ label: "My Appointment", root: routes.appointment }],
  },
  {
    icon: IconDeviceDesktopAnalytics,
    label: "Instructor",
    root: routes.instructor,
  },
  {
    icon: IconSettings,
    label: "Settings",
    SubLinks: [
      { label: "User", root: routes.user },
      { label: "Room", root: routes.room },
      {
        label: "Play Groups",
        root: routes.playGroups,
      },
    ],
  },
];

export function Navbar() {
  const [active, setActive] = useState("Home");
  const [activeLink, setActiveLink] = useState("User");

  const navigate = useNavigate();

  const handleMenuItemSelect = (route: string) => {
    setActive(route);
  };

  const handleActiveLink = (route: string) => {
    setActiveLink(route);
    navigate(route);
  };

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => handleMenuItemSelect(link.label)}
        className={classes.mainLink}
        data-active={link.label === active || undefined}
      >
        <link.icon size={22} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const activeMenu = mainLinksMockdata.find((link) => link.label === active);

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <MantineLogo type="mark" size={30} />
          </div>
          {mainLinks}
        </div>
        {activeMenu?.SubLinks && (
          <div className={classes.main}>
            <Title order={4} className={classes.title}>
              {active}
            </Title>
            {activeMenu.SubLinks.map((subLink) => (
              <a
                className={classes.link}
                data-active={activeLink === subLink.label || undefined}
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handleActiveLink(subLink.root);
                }}
                key={subLink.label}
              >
                {subLink.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
