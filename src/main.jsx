
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SocialFeaturesProvider } from "./context/SocialFeaturesContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocialFeaturesProvider>
      <App />
    </SocialFeaturesProvider>
  </React.StrictMode>
);
