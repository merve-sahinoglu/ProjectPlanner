import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AppHeader from "./header/AppHeader";
import AppNavbar from "./navbar/AppNavbar";

interface MainProps {
  children?: React.ReactNode;
}

function Main({ children }: MainProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  return (
    <>
      <AppShell
        header={{ height: 50 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <AppHeader
            mobileOpened={mobileOpened}
            desktopOpened={desktopOpened}
            toggleMobile={toggleMobile}
            toggleDesktop={toggleDesktop}
          ></AppHeader>
        </AppShell.Header>
        <AppShell.Navbar mt={5} h={"100%"}>
          <AppNavbar></AppNavbar>
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}

export default Main;
