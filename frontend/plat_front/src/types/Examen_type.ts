export interface Langage {
  id: string;
  nom: string;
  extension: string;
  imageDocker: string;
  commandeExe: string;
}

export interface ExamenDto {
  codeEx: string;
  nom: string;
  matiere: string;
  duree: number;
  consigne: string;
  statut: string;
  sujet: string; // URL du sujet
  langage: string;
  enseignant: string;
}