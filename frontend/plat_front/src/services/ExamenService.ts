import axios from "axios";
import type { Langage, ExamenDto } from "../types/Examen_type";

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

export const getAllExamens = async (): Promise<ExamenDto[]> => {
  try {
    const response = await axios.get<ExamenDto[]>(`${API_URL}allExamens`);
    return response.data;
  } catch (error) {
    console.error("Erreur en récupérant les examens :", error);
    throw error;
  }
};

export const uploadSujet = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<string>(`${API_URL}upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // "/uploads/xxx.pdf"
  } catch (error) {
    console.error("Erreur upload fichier :", error);
    throw error;
  }
};

export const createExamen = async (examenData: ExamenDto): Promise<void> => {
  try {
    await axios.post(`${API_URL}create`, examenData);
  } catch (error) {
    console.error("Erreur création examen :", error);
    throw error;
  }
};

export const getExamenById = async (codeEx: string): Promise<ExamenDto> => {
  try {
    const response = await axios.get<ExamenDto>(`${API_URL}obtExamen/${codeEx}`);
    return response.data;
  } catch (error) {
    console.error("Erreur en récupérant l'examen :", error);
    throw error;
  }
};