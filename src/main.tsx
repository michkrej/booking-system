import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { registerLicense } from "@syncfusion/ej2-base";

import App from "./App";

import "@fontsource-variable/inter";
import "./styles/global.css";
import "./styles/scheduler.css";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
registerLicense(import.meta.env.VITE_APP_SYNCFUSION_KEY);

const container = document.getElementById("root");
const root = createRoot(container!!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
