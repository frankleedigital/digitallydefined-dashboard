import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { OnboardingProvider } from "./context/OnboardingContext";
import { installGlobalHandlers } from "./lib/error-monitor";
import { validateEnvironment } from "./config/environment";

installGlobalHandlers();
try { validateEnvironment(); } catch { /* diagnostics only */ }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <OnboardingProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </OnboardingProvider>
    </AuthProvider>
  </React.StrictMode>
);
