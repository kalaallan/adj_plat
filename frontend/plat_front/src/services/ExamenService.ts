import axios from "axios";
import type { Langage, Examen } from "../types/Examen";

const API_URL = "http://localhost:8080/examen/";

export const getAllLangages = async (): Promise<Langage[]> => {
  try {
    const response = await axios.get<Langage[]>(`${API_URL}allLangage`);
    return response.data;
  } catch (error) {
    console.error("Erreur en récupérant les langages :", error);
    throw error;
  } 
};


export const uploadSujet = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<string>(
      `${API_URL}upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data; // "/uploads/xxx.pdf"

  } catch (error) {
    console.error("Erreur upload fichier :", error);
    throw error;
  }
};

export const createExamen = async (examenData: Examen): Promise<void> => {
  try {
    await axios.post(`${API_URL}create`, examenData);   
  } catch (error) {
    console.error("Erreur création examen :", error);
    throw error;
  }
};