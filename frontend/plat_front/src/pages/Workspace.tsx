import { useEffect, useState, useRef } from "react";
import Header from "../components/header";
import { useAppSelector } from "../store/hooks";
import type { RootState } from "../store";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspaceService } from "../services/WorkspaceService";
import type { ExamenDto } from "../types/Examen_type";
import { getExamenById } from "../services/ExamenService";
import TerminalComponent from "../components/TerminalComponent";

const Workspace = () => {
  const { examId } = useParams<{ examId: string }>();
  const { role, utilisateur } = useAppSelector((state: RootState) => state.login);
  const [examSelect, setExamSelect] = useState<ExamenDto | null>(null);
  const navigate = useNavigate();

  const [model, setModel] = useState<boolean>(false); 
  const [alerts, setAlerts] = useState<string[]>([]);
  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
  }`);

  const { output, status, connect, runCode, sendInput, disconnect, clear } = useWorkspaceService();

  // Ref pour éviter double connexion
  const connected = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const message = `Changement d'onglet détecté à ${new Date().toLocaleTimeString()}`;
        
        console.warn(message);

        setAlerts((prev) => [...prev, message]);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!utilisateur?.id || !examId) {
      navigate("/Examen");
      return;
    }
    if (connected.current) return;

    const setupConnection = async () => {
      try {
        console.log("Rafraîchissement détecté : Reconnexion automatique...");
        console.log("Utilisateur ID:", utilisateur.id, "Exam ID:", examId);
        // Récupération de l'examen pour obtenir le langage
        const examen: ExamenDto = await getExamenById(examId);
        console.log("Examen récupéré :", examen);
        const langageId = examen?.langage || "2"; // "2" = fallback Java
        setExamSelect(examen);
        connected.current = true;
        connect(examId, utilisateur.id, langageId);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'examen :", error);
        // fallback si échec
        connect(examId, utilisateur.id, "2");
        connected.current = true;
      }
    };

    setupConnection();

    return () => {
      disconnect();
      connected.current = false;
    };
  }, [utilisateur?.id, connect, disconnect, examId, navigate]);


  const handleRunCode = () => {
    clear();
    runCode(code);
  };

  const roleData = {
    etudiant: { title: `${examSelect?.nom}`, subtitle: `${examSelect?.consigne}`, duree: `${examSelect?.duree}`, alerts: alerts, color: "bg-blue-50", button: "Abandonner" },
    enseignant: { title: "Bonjour Enseignant !", subtitle: "Créez un nouvel examen facilement.", duree: `${examSelect?.duree}`, alerts: alerts, color: "bg-green-50", button: "Arrêter la supervision" },
    superviseur: { title: "Superviseur", subtitle: "Choisissez un examen en cours pour le superviser.", duree: `${examSelect?.duree}`, alerts: alerts, color: "bg-yellow-50", button: "Arrêter la supervision  " }
  };

  const currentRole = roleData[role as keyof typeof roleData] || roleData.etudiant;

  const abandonnerExamen = () => {
    setModel(false);
    navigate("/examen");
  };

  return (
    <>
      <Header />
      {model && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg text-center">
            
            <h2 className="text-xl font-bold mb-4">
              Abandonner
            </h2>

            {role === "etudiant" ? (
              <p className="text-gray-600 mb-4">
                Voulez-vous vraiment abandonner l'examen ?
                <br />
                Votre progression ne sera pas sauvegardée.
              </p>
            ) : (
              <p className="text-gray-600 mb-4">
                Voulez-vous vraiment arrêter la supervision ?
              </p>
            )}

            <div className="flex gap-4">
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded-lg"
                onClick={() => setModel(false)}
              >
                Annuler
              </button>

              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                onClick={(abandonnerExamen)}
              >
                Abandonner
              </button>
            </div>
          </div>
        </div>
        )
      }

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Banner Rôle */}
        <div className={`w-full md:w-3/4 p-6 rounded-2xl shadow-md text-center mx-auto ${currentRole.color} border border-gray-200`}>
          <h1 className="text-2xl font-bold text-gray-800">{currentRole.title}</h1>
          <p className="text-gray-600 mt-2 mb-2">{currentRole.subtitle}</p>
          <p className="text-gray-600 mt-2 mb-4">Durée : {currentRole.duree} min</p>
          {currentRole.alerts.length > 0 && (
            <p className="text-red-600 mt-2 mb-4">Alert : {currentRole.alerts}</p>
          )}
          <button
            className="px-6 py-2 rounded-lg bg-white font-semibold shadow hover:bg-gray-100 transition"
            onClick={() => setModel(true)}
          >
            {currentRole.button}
          </button>
        </div>
        {/* Terminal */}
        {(examId != null) && (
          <TerminalComponent
            code={code}
            setCode={setCode}
            output={output}
            status={status}
            runCode={handleRunCode}
            sendInput={sendInput}
            clear={clear}
          />
        )}
      </main>
    </>
  );
};

export default Workspace;