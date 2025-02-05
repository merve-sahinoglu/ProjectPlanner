import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { StrictMode } from "react";
import { mantineTheme } from "./assets/theme";
import AppRouter from "./AppRouter";

function App() {
  return (
    <StrictMode>
      <MantineProvider theme={mantineTheme}>
        <ModalsProvider>
          <AppRouter />
        </ModalsProvider>
      </MantineProvider>
    </StrictMode>
  );
}

export default App;