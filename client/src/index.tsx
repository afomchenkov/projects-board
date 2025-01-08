import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import "@atlaskit/css-reset";
import "@atlaskit/tokens/css/atlassian-light.css";
import { setGlobalTheme } from "@atlaskit/tokens";

import reportWebVitals from "./reportWebVitals";
import "./styles/reset.scss";
import "./styles/index.scss";

setGlobalTheme("light");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<h2>Loading...</h2>} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
