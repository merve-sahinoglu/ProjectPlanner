import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./services/language/i18n.ts";

createRoot(document.getElementById("root")!).render(<App />);
