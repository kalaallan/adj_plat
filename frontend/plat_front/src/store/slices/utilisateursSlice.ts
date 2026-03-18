/*import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Etudiant, Enseignant, Superviseur } from "../../types/User_type";
import * as utilisateurService from "../../services/UserService";

interface UtilisateursState {
  etudiants: Etudiant[];
  enseignants: Enseignant[];
  superviseurs: Superviseur[];
  loading: boolean;
  error: string | null;
}

const initialState: UtilisateursState = {
  etudiants: [],
  enseignants: [],
  superviseurs: [],
  loading: false,
  error: null
};

export const fetchEtudiants = createAsyncThunk(
  "utilisateurs/fetchEtudiants",
  async () => {
    return await utilisateurService.getEtudiants();
  }
);

export const fetchEnseignants = createAsyncThunk(
  "utilisateurs/fetchEnseignants",
  async () => {
    return await utilisateurService.getEnseignants();
  }
);

export const fetchSuperviseurs = createAsyncThunk(
  "utilisateurs/fetchSuperviseurs",
  async () => {
    return await utilisateurService.getSuperviseurs();
  }
);

const utilisateursSlice = createSlice({
  name: "utilisateurs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEtudiants.pending, (state: UtilisateursState) => {
      state.loading = true;
    });
    builder.addCase(fetchEnseignants.pending, (state: UtilisateursState) => {
      state.loading = true;
    });
    builder.addCase(fetchSuperviseurs.pending, (state: UtilisateursState) => {
      state.loading = true;
    });

    builder.addCase(
      fetchEtudiants.fulfilled,
      (state, action: PayloadAction<Etudiant[]>) => {
        state.loading = false;
        state.etudiants = action.payload;
      }
    );

    builder.addCase(fetchEnseignants.fulfilled, (state, action: PayloadAction<Enseignant[]>) => {
      state.enseignants = action.payload;
    });

    builder.addCase(fetchSuperviseurs.fulfilled, (state, action: PayloadAction<Superviseur[]>) => {
      state.superviseurs = action.payload;
    });

    builder.addCase(fetchEtudiants.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erreur";
    });
    builder.addCase(fetchEnseignants.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erreur";
    });

    builder.addCase(fetchSuperviseurs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erreur";
    });
  }
});

export default utilisateursSlice.reducer;*/