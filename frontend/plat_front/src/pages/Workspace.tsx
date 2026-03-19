import {} from "react";

import Header from "../components/header";
import { useAppSelector } from "../store/hooks";
import type { RootState } from "../store";

import { useNavigate } from "react-router-dom";

const Workspace = () => {
  const useSelector = useAppSelector;
  const { role } = useSelector((state: RootState) => state.login);

  const navigate = useNavigate();

  // Contenu personnalisé selon rôle
  const roleData = {
    etudiant: {
      title: "Bienvenue !",
      subtitle: "Sélectionnez un examen et testez vos connaissances.",
      color: "bg-blue-100",
      hoverColor: "hover:bg-blue-200",
      button: "Choisir un examen"
    },
    enseignant: {
      title: "Bonjour Enseignant !",
      subtitle: "Créez un nouvel examen  facilement.",
      color: "bg-green-100",
      hoverColor: "hover:bg-green-200",
      button: "Créer un examen"
    },
    superviseur: {
      title: "Superviseur",
      subtitle: "Choisissez un examen en cours pour le superviser et suivre les participants.",
      color: "bg-yellow-100",
      hoverColor: "hover:bg-yellow-200",
      button: "Superviser un examen"
    }
  };

  const currentRole = roleData[role as keyof typeof roleData] || roleData.etudiant;

  const navigationExamen = () => {
    return navigate("/Examen");
  };

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center justify-center gap-8">
          <div
            className={`w-full md:w-2/3 p-10 rounded-2xl shadow-lg text-center transition ${currentRole.color} ${currentRole.hoverColor} cursor-pointer`}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {currentRole.title}
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-6">
              {currentRole.subtitle}
            </p>
            <button
              onClick={navigationExamen}
              className={`px-6 py-3 rounded-full font-semibold text-white transition ${
                role === "etudiant" ? "bg-blue-500 hover:bg-blue-600" :
                role === "enseignant" ? "bg-green-500 hover:bg-green-600" :
                "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {currentRole.button}
            </button>
          </div>

          <p className="text-gray-400 text-sm md:text-base">
            {role === "etudiant" && "Accédez rapidement à vos examens et bonne chance !"}
            {role === "enseignant" && "Créez et corrigez vos examens en quelques clics."}
            {role === "superviseur" && "Surveillez le déroulement des examens en temps réel."}
          </p>
        </div>
      </main>
    </>
  );
};

export default Workspace;