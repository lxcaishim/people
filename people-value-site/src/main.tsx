import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

const mount = document.getElementById("root");
if (!mount) throw new Error("Root missing");

createRoot(mount).render(
  <StrictMode>
    <App />
  </StrictMode>
);
