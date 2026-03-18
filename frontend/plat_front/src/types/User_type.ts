// types/User.ts
export interface Utilisateur {
  id: string;
  email: string;
  nom: string;
  prenom: string;
}

export interface Etudiant extends Utilisateur {
  filiere: string;
  niveau: string;
  examenId: string | null;
}

export interface Enseignant extends Utilisateur {
  matiere: string;
}

export interface Superviseur extends Utilisateur {
  departement: string;
  examenId: string | null;
}
