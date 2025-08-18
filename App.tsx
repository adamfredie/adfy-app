import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./src/routes";

// Main App component that wraps everything with AuthProvider and Router
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}