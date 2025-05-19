import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";

// Configuración del enrutador
const router = createBrowserRouter(
  [
    {
      path: "/*", // Ruta base que maneja todas las rutas
      element: <App />,
    },
  ],
  {
    future: {
      v7_startTransition: true, // Habilita la bandera para `React.startTransition`
    },
  }
);

// Renderiza la aplicación
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
