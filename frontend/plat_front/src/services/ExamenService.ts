import axios from "axios";
import type { Langage } from "../types/Examen";

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