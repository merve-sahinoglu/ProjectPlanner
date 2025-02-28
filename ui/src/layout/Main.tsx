import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "./navbar/Navbar";
import { Header } from "./header/Header";

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
          <Header
            mobileOpened={mobileOpened}
            desktopOpened={desktopOpened}
            toggleMobile={toggleMobile}
            toggleDesktop={toggleDesktop}
          ></Header>
        </AppShell.Header>
        <AppShell.Navbar mt={5}>
          <Navbar></Navbar>
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}

export default Main;
