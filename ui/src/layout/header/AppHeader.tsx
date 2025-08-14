import {
  Avatar,
  Burger,
  Container,
  Group,
  Text,
} from "@mantine/core";
import classes from "./AppHeader.module.css";
import UserProfileDropdown from "./UserProfileDropdown";
import KIDS_IMG from "../../assets/images.jpeg";

interface HeaderMenuProps {
  mobileOpened: boolean;
  desktopOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
}

export function AppHeader({
  mobileOpened,
  desktopOpened,
  toggleMobile,
  toggleDesktop,
}: HeaderMenuProps) {
  return (
    <header className={classes.header}>
      <div className={classes.ribbon} />
      <div className={classes.bar}>
          <div className={classes.inner}>
            {/* SOL BLOK: margin-right:auto ile SOLA YAPIŞIK */}
            <div className={classes.left}>
              <Group gap="xs">
                <Burger
                  opened={mobileOpened}
                  onClick={toggleMobile}
                  hiddenFrom="sm"
                  size="sm"
                  aria-label="Open mobile navigation"
                />
                <Burger
                  opened={desktopOpened}
                  onClick={toggleDesktop}
                  visibleFrom="sm"
                  size="sm"
                  aria-label="Toggle sidebar"
                />
              </Group>

              <div className={classes.brand}>
                <div className={classes.logoWrap}>
                  <Avatar
                    src={KIDS_IMG}
                    size={36}
                    radius="xl"
                    alt="Çocuk Eğitim Merkezi"
                    className={classes.logoAvatar}
                  />
                </div>

                <div className={classes.brandText}>
                  <Group gap={6}>
                    <Text fw={900} className={classes.title}>
                      Dilde Eğitim Merkezi
                    </Text>
                  </Group>
                </div>
              </div>
            </div>

            {/* SAĞ BLOK */}
            <Group gap="xs" wrap="nowrap" className={classes.right}>
              <UserProfileDropdown />
            </Group>
          </div>
      </div>
    </header>
  );
}

export default AppHeader;
