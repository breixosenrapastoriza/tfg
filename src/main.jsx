import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import "./css/fonts.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import UserProvider from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

//</React.StrictMode>
