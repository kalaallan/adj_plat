import axios from "axios";
import type { LoginRequest } from "../types/Login_type";
import type { Etudiant, Enseignant, Superviseur } from "../types/User_type";

const API_URL = "http://localhost:8080/api/utilisateurs/";

export const loginEtudiant = async (
  credentials: LoginRequest,
): Promise<Etudiant> => {
  try {
    const response = await axios.post<Etudiant>(
      `${API_URL}login/etudiant`,
      credentials,
    );
    return response.data;
  } catch (error) {
    console.error("Erreur login étudiant :", error);
    throw error;
  }
};

export const loginEnseignant = async (
  credentials: LoginRequest,
): Promise<Enseignant> => {
  try {
    const response = await axios.post<Enseignant>(
      `${API_URL}login/enseignant`,
      credentials,
    );
    return response.data;
  } catch (error) {
    console.error("Erreur login enseignant :", error);
    throw error;
  }
};

export const loginSuperviseur = async (
  credentials: LoginRequest,
): Promise<Superviseur> => {
  try {
    const response = await axios.post<Superviseur>(
      `${API_URL}login/superviseur`,
      credentials,
    );
    return response.data;
  } catch (error) {
    console.error("Erreur login superviseur :", error);
    throw error;
  }
};
