import { useState, useMemo } from "react";
import {
  IconCalendarStats,
  IconHome2,
  IconNotebook,
  IconSettings,
} from "@tabler/icons-react";
import { ScrollArea } from "@mantine/core";
import classes from "./Navbar.module.css";
import routes from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { LinksGroup } from "./LinksGroup";
import { useAuthenticationContext } from "../../authentication/AuthenticationContext";

export function AppNavbar() {
  const [activeParent, setActiveParent] = useState<string>("My Page");
  const [activePath, setActivePath] = useState<string>("");
  const auth = useAuthenticationContext();
  const navigate = useNavigate();

  const handleMenuItemSelect = (parentLabel: string) => {
    setActiveParent(parentLabel);
  };

  const handleActiveLink = (path: string, additionalInfo?: string) => {
    const finalPath = additionalInfo ? `${path}/${additionalInfo}` : path;
    setActivePath(finalPath);
    navigate(finalPath);
  };

  const data = useMemo(
    () => [
      {
        icon: IconHome2,
        label: "My Page",
        initiallyOpened: true,
        links: [
          {
            label: "My Notes",
            link: routes.notes,
            additionalInfo: auth.currentUser?.userId,
          },
          {
            label: "My Appointment",
            link: routes.appointment,
            additionalInfo: auth.currentUser?.userId,
          },
        ],
      },
      {
        icon: IconCalendarStats,
        label: "Appointment",
        link: routes.appointment,
      },
      {
        icon: IconNotebook,
        label: "Note",
        link: routes.notes,
      },
      {
        icon: IconSettings,
        label: "Settings",
        links: [
          { label: "User", link: routes.user },
          { label: "User Relation", link: routes.userRelation },
          { label: "Room", link: routes.room },
          { label: "Play Groups", link: routes.playGroups },
        ],
      },
    ],
    [auth.currentUser?.userId]
  );

  return (
    <nav className={classes.navbar}>
      
      <ScrollArea className={classes.links} type="auto" scrollbarSize={8}>
        <div className={classes.linksInner}>
          {data.map((item) => (
            <LinksGroup
              key={item.label}
              {...item}
              activeParent={activeParent}
              activePath={activePath}
              handleActiveLink={handleActiveLink}
              handleMenuItemSelect={handleMenuItemSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
}

export default AppNavbar;
