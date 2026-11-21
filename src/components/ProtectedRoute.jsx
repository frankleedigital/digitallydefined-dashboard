import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AUTHORIZED_EMAIL = "francesca@digitallydefined.online";

export default function ProtectedRoute({ children }) {
  return children;
}
