import { useState } from "react";
import Header from "../components/Header";

const Examen = () => {
  const [formOpen, setFormOpen] = useState(false);

  // état du formulaire
  const [formData, setFormData] = useState({
    codeEx: "",
    nom: "",
    matiere: "",
    duree: "",
    consigne: "",
    sujet: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBoxClick = () => {
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Ici tu peux appeler ton API backend
  };

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Gestion des examens</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Participer à un examen */}
          <div
            className="flex-1 bg-blue-100 hover:bg-blue-200 transition rounded-lg p-10 text-center cursor-pointer shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">Participer à un examen</h2>
            <p className="text-gray-700">Accédez aux examens disponibles et participez facilement.</p>
          </div>

          {/* Créer un examen */}
          <div
            onClick={() => handleBoxClick()}
            className="flex-1 bg-green-100 hover:bg-green-200 transition rounded-lg p-10 text-center cursor-pointer shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">Créer un examen</h2>
            <p className="text-gray-700">Créez un nouvel examen et configurez toutes les options.</p>
          </div>

          {/* Superviser un examen */}
          <div
            className="flex-1 bg-yellow-100 hover:bg-yellow-200 transition rounded-lg p-10 text-center cursor-pointer shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">Superviser un examen</h2>
            <p className="text-gray-700">Surveillez les examens en cours et gérez les participants.</p>
          </div>
        </div>

        {/* Formulaire centré */}
        {formOpen && (
          <div className="mt-10 flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg space-y-4"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Créer un examen</h2>

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
      </main>
    </>
  );
};

export default Examen;