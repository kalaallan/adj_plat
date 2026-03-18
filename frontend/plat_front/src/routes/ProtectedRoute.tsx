import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

  const role = useSelector((state: RootState) => state.login.role);

  // Si pas de rôle → pas connecté
  if (!role) {
    return <Navigate to="/login" />;
  }

  // Si rôle valide → accès autorisé
  if (
    role === "etudiant" ||
    role === "enseignant" ||
    role === "superviseur"
  ) {
    return children;
  }

  // Sinon → sécurité
  return <Navigate to="/login" />;
};

export default ProtectedRoute;