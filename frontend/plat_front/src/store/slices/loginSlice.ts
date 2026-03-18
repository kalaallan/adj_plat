import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Etudiant, Enseignant, Superviseur } from "../../types/User_type";

interface LoginState {
  utilisateur: Etudiant | Enseignant | Superviseur | null;
  role: "etudiant" | "enseignant" | "superviseur" | null;
}

const initialState: LoginState = {
  utilisateur: null,
  role: null
};


const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {

    setCurrentEtudiant(state, action: PayloadAction<Etudiant>) {
      state.utilisateur = action.payload;
      state.role = "etudiant";
    },

    setCurrentEnseignant(state, action: PayloadAction<Enseignant>) {
      state.utilisateur = action.payload;
      state.role = "enseignant";
    },

    setCurrentSuperviseur(state, action: PayloadAction<Superviseur>) {
      state.utilisateur = action.payload;
      state.role = "superviseur";
    },

    logout(state) {
      state.utilisateur = null;
      state.role = null;
    }

  },
});


export const {
  setCurrentEtudiant,
  setCurrentEnseignant,
  setCurrentSuperviseur,
  logout
} = loginSlice.actions;
export default loginSlice.reducer;
