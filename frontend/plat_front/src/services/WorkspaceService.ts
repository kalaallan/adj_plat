import axios from "axios";
import type { RunCodeRequest } from "../types/Workspace_type";


const API_URL = "http://localhost:8080/api/workspace";

export const runStudentCode = async (request: RunCodeRequest): Promise<string> => {
  try {
    const response = await axios.post<string>(`${API_URL}/run`, request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError typé, accès aux champs connus
      return "Erreur : " + (error.response?.data || error.message);
    }
    // Pour tout autre type d'erreur
    return "Erreur inconnue : " + String(error);
  }
};