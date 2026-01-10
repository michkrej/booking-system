import "@fontsource-variable/inter";
import { registerLicense } from "@syncfusion/ej2-base";
import { PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./i18n";
import "./styles/global.css";
import "./styles/scheduler.css";

registerLicense(import.meta.env.VITE_APP_SYNCFUSION_KEY);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    {import.meta.env.MODE === "development" ? (
      <App />
    ) : (
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          defaults: "2025-05-24",
          capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
          debug: import.meta.env.MODE === "development",
        }}
      >
        <App />
      </PostHogProvider>
    )}
  </StrictMode>,
);
