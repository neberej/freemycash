
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/inter"; // Defaults to 400
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";

import App from "./app/App";
import "@src/styles/index.scss";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

