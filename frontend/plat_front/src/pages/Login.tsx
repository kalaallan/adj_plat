import { useState,  } from 'react'

import { useAppDispatch } from "../store/hooks";
import {
  setCurrentEtudiant,
  setCurrentEnseignant,
  setCurrentSuperviseur
} from "../store/slices/loginSlice";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '../types/Login_type';
import type { Etudiant, Enseignant, Superviseur } from "../types/User_type"
import { loginEnseignant, loginEtudiant, loginSuperviseur } from '../services/LoginService';

const Login = () => {
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    setError(null);

    const credentials: LoginRequest = { email, password };

    try {
      // Essayer l'étudiant
      const etudiant : Etudiant = await loginEtudiant(credentials);
      console.log('Connecté en tant qu’étudiant:', etudiant);
      dispatch(setCurrentEtudiant(etudiant));
      setError("C'est un étudiant");
      setTimeout(() => {
        setError(null);
      }, 3000);
      navigate('/'); 
      return;
    } catch (e) {
      console.log('Pas étudiant, on teste enseignant...', e);
    }

    try {
      // Essayer l’enseignant
      const enseignant : Enseignant = await loginEnseignant(credentials);
      console.log('Connecté en tant qu’enseignant:', enseignant);
      dispatch(setCurrentEnseignant(enseignant));
      setError("C'est un enseignant");
      setTimeout(() => {
        setError(null);
      }, 3000);
      navigate('/'); 
      return;
    } catch (e) {
      console.log('Pas enseignant, on teste superviseur...', e);
    }

    try {
      // Essayer le superviseur
      const superviseur : Superviseur = await loginSuperviseur(credentials);
      console.log('Connecté en tant que superviseur:', superviseur);
      dispatch(setCurrentSuperviseur(superviseur));
      setError("C'est un superviseur");
      setTimeout(() => {
        setError(null);
      }, 3000);
      navigate('/'); 
      return;
    } catch (e) {
      console.log('Aucun utilisateur trouvé pour ces identifiants', e);
      setError('Email ou mot de passe incorrect');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center flex-col gap-5 ">
        <form className="flex w-96 flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
             id="email" 
             type="email" 
             required
             value={email}
             onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
             id="password"
             type="password"
             required
             value={password}
             onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit">Login</Button>
        </form>
        {/* Message d'erreur ici */}
        <div className="">
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

    </>
  );
}

export default Login;