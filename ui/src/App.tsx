import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { StrictMode } from "react";
import { mantineTheme } from "./assets/theme";
import AppRouter from "./AppRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./services/query-client";
import { MantineEmotionProvider } from "@mantine/emotion";
import "@mantine/tiptap/styles.css";
import { AuthenticationProvider } from "./authentication/AuthenticationContext";

function App() {
  return (
    <StrictMode>
      <AuthenticationProvider>
        <MantineProvider theme={mantineTheme}>
          <MantineEmotionProvider>
            <QueryClientProvider client={queryClient}>
              <ModalsProvider>
                <AppRouter />
              </ModalsProvider>
            </QueryClientProvider>
          </MantineEmotionProvider>
        </MantineProvider>
      </AuthenticationProvider>
    </StrictMode>
  );
}

export default App;
