import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./components/styles/base/_variables.css";
import "./components/styles/base/_reset.css";
import "./components/styles/utilities.css";
import "./components/styles/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 