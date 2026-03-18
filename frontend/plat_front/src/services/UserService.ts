import axios from "axios";
import type { Etudiant, Enseignant, Superviseur } from "../types/User_type";

const API_URL = "http://localhost:8080/api/utilisateurs/";

/** Récupérer tous les étudiants */
export const getEtudiants = async (): Promise<Etudiant[]> => {
  try {
    const response = await axios.get<Etudiant[]>(`${API_URL}etudiants`);
    return response.data;
  } catch (error) {
    console.error("Erreur en récupérant les étudiants :", error);
    throw error;
  }
};

/** Récupérer tous les enseignants */
export const getEnseignants = async (): Promise<Enseignant[]> => {
  try {
    const response = await axios.get<Enseignant[]>(`${API_URL}enseignants`);
    return response.data;
  } catch (error) {
    console.error("Erreur en récupérant les enseignants :", error);
    throw error;
  }
};

/** Récupérer tous les superviseurs */
export const getSuperviseurs = async (): Promise<Superviseur[]> => {
  try {
    const response = await axios.get<Superviseur[]>(`${API_URL}superviseurs`);
    return response.data;
  } catch (error) {
    console.error("Erreur en récupérant les superviseurs :", error);
    throw error;
  }
};
