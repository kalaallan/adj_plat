import { useState, useEffect } from "react";
import Header from "../components/header";
import {
  getAllLangages,
  createExamen,
  uploadSujet,
} from "../services/ExamenService";
import type { ExamenDto, Langage } from "../types/Examen_type";

import { useAppSelector } from "../store/hooks";
import type { RootState } from "../store";
import { getAllExamens } from "../services/ExamenService";
import { getEnseignants } from "../services/UserService";
import type { Enseignant } from "../types/User_type";

const Examen = () => {
  const [examens, setExamens] = useState<ExamenDto[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [langages, setLangages] = useState<Langage[]>([]);
  const useSelector = useAppSelector;
  const { utilisateur, role } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataExamens, dataEnseignants, dataLangages] = await Promise.all([
          getAllExamens(),
          getEnseignants(),
          getAllLangages(),
        ]);
        setExamens(dataExamens);
        setEnseignants(dataEnseignants);
        setLangages(dataLangages);
      } catch (error) {
        console.error("Erreur récupération données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [formOpen, setFormOpen] = useState(false);
  const [openExamens, setOpenExamens] = useState(false);

  useEffect(() => {
    if (utilisateur && role === "enseignant") {
      setFormData((prev) => ({
        ...prev,
        enseignant: utilisateur.id,
      }));
    }
  }, [utilisateur, role]);

  // état du formulaire
  const [formData, setFormData] = useState({
    codeEx: "",
    nom: "",
    matiere: "",
    duree: "",
    consigne: "",
    sujet: null as File | null,
    statut: "CREER",
    langage: "",
    enseignant: "",
  });

  // Crée un mapping id -> nom complet
  const enseignantsMap = Object.fromEntries(
    enseignants.map((e) => [e.id, `${e.prenom} ${e.nom}`]),
  );

  if (loading)
    return <p className="text-center mt-10">Chargement des examens...</p>;

  // Fonction pour récupérer le nom de l'enseignant
  const getNomEnseignant = (id: string) => enseignantsMap[id] || "Inconnu";

  const renderExamens = (
    statut: string,
    buttonLabel: string,
    buttonColor: string,
    onClickMsg: string,
  ) =>
    examens
      .filter((examen) => examen.statut === statut)
      .map((examen) => (
        <div
          key={examen.codeEx}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">{examen.nom}</h2>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Matière :</span> {examen.matiere}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Durée :</span> {examen.duree} min
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-medium">Enseignant :</span>{" "}
            {getNomEnseignant(examen.enseignant)}
          </p>

          <button
            className={`w-full ${buttonColor} text-white font-semibold py-2 rounded-lg transition hover:opacity-90`}
            onClick={() => alert(`${onClickMsg} : ${examen.nom}`)}
          >
            {buttonLabel}
          </button>
        </div>
      ));

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBoxClick = () => {
    setFormOpen(true);
    setOpenExamens(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.sujet) {
        throw new Error("Fichier requis");
      }

      // Upload
      const fileUrl = await uploadSujet(formData.sujet);
      console.log("Fichier uploadé à :", fileUrl);
      // Préparer données
      const examenData: ExamenDto = {
        codeEx: formData.codeEx,
        nom: formData.nom,
        matiere: formData.matiere,
        duree: Number(formData.duree),
        consigne: formData.consigne,
        sujet: fileUrl, // URL
        statut: formData.statut,
        langage: formData.langage,
        enseignant: formData.enseignant,
      };

      // Create examen
      await createExamen(examenData);
      setFormOpen(false);
      alert("Examen créé avec succès !");
      console.log(" Examen créé");
    } catch (error) {
      console.error(" Erreur :", error);
    }
  };

  const handleCorrectionClick = () => {
    setFormOpen(false);
    setOpenExamens(true);
  };

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Gestion des examens</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Participer à un examen */}
          {role === "etudiant" && (
            <div
              onClick={() => handleBoxClick()}
              className="flex-1 bg-blue-100 hover:bg-blue-200 transition rounded-lg p-10 text-center cursor-pointer shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">
                Participer à un examen
              </h2>
              <p className="text-gray-700">
                Accédez aux examens disponibles et participez facilement.
              </p>
            </div>
          )}

          {/* Créer un examen et corriger vos examens */}
          {role === "enseignant" && (
            <div className="flex space-x-4">
              {/* Bouton pour créer un examen */}
              <div
                onClick={() => handleBoxClick()}
                className="flex-1 bg-green-100 hover:bg-green-200 transition rounded-lg p-10 text-center cursor-pointer shadow-md"
              >
                <h2 className="text-xl font-semibold mb-2">Créer un examen</h2>
                <p className="text-gray-700">
                  Créez un nouvel examen et configurez toutes les options.
                </p>
              </div>

              {/* Bouton pour corriger un examen */}
              <div
                onClick={() => handleCorrectionClick()}
                className="flex-1 bg-blue-100 hover:bg-blue-200 transition rounded-lg p-10 text-center cursor-pointer shadow-md"
              >
                <h2 className="text-xl font-semibold mb-2">Corriger un examen</h2>
                <p className="text-gray-700">
                  Accédez aux examens existants et corrigez-les facilement.
                </p>
              </div>
            </div>
          )}

          {role === "superviseur" && (
            <div
              onClick={() => handleBoxClick()}
              className="flex-1 bg-yellow-100 hover:bg-yellow-200 transition rounded-lg p-10 text-center cursor-pointer shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">
                Superviser un examen
              </h2>
              <p className="text-gray-700">
                Surveillez les examens en cours et gérez les participants.
              </p>
            </div>
          )}
        </div>

        {/* Formulaire centré */}
        {formOpen && role === "enseignant" && (
          <div className="mt-10 flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg space-y-4"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">
                Créer un examen
              </h2>

              <input
                type="text"
                name="codeEx"
                placeholder="Code Examen"
                value={formData.codeEx}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                name="nom"
                placeholder="Nom de l'examen"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Matière et Durée sur la même ligne */}
              <div className="flex gap-4">
                <input
                  type="text"
                  name="matiere"
                  placeholder="Matière"
                  value={formData.matiere}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  name="duree"
                  placeholder="Durée (minutes)"
                  value={formData.duree}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Select Langage */}
              <select
                name="langage"
                value={formData.langage}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choisir un langage</option>
                {langages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.nom}
                  </option>
                ))}
              </select>

              <textarea
                name="consigne"
                placeholder="Consignes"
                value={formData.consigne}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Sujet (PDF uniquement) */}
              <div>
                <label className="block mb-1 font-medium">Sujet (PDF)</label>
                <input
                  type="file"
                  name="sujet"
                  accept=".pdf"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, sujet: e.target.files[0] });
                    }
                  }}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
        {formOpen && role === "etudiant" && (
          <>
            <h1 className="text-3xl font-bold mb-8">Examens disponibles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderExamens(
                "CREER",
                "Lancer",
                "bg-blue-500 hover:bg-blue-600",
                "Lancement de l'examen",
              )}
            </div>
          </>
        )}
        {formOpen && role === "superviseur" && (
          <>
            <h1 className="text-3xl font-bold mb-8">Examens en cours</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderExamens(
                "ENCOURS",
                "Superviser",
                "bg-yellow-500 hover:bg-yellow-600",
                "Lancement de la supervision de l'examen",
              )}
            </div>
          </>
        )}
        {openExamens && role === "enseignant" && (
          <>
            <h1 className="text-3xl font-bold mb-8">Examens en cours</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderExamens(
                "TERMINER",
                "Corriger",
                "bg-green-500 hover:bg-green-600",
                "Lancement de la correction de l'examen",
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Examen;
