// @ts-expect-error - ignore
import "@fontsource-variable/inter";
import { PostHogProvider } from "@posthog/react";
import { registerLicense } from "@syncfusion/ej2-base";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import posthog from "posthog-js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./i18n";
import "./styles/global.css";
import "./styles/scheduler.css";

registerLicense(import.meta.env["VITE_APP_SYNCFUSION_KEY"]);

if (import.meta.env.MODE !== "development") {
  posthog.init(import.meta.env["VITE_PUBLIC_POSTHOG_KEY"], {
    api_host: import.meta.env["VITE_PUBLIC_POSTHOG_HOST"],
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
    debug: import.meta.env.MODE === "development",
  });
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    {import.meta.env.MODE === "development" ? (
      <App />
    ) : (
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    )}
  </StrictMode>,
);
