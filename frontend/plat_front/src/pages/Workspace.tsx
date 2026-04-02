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
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const navigate = useNavigate();

  const [model, setModel] = useState(false);
  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
  }`);

  // --- Hook WorkspaceService ---
  const { output, status, connect, runCode, sendInput, disconnect, clear, alerts } =
    useWorkspaceService();

  // --- Ref pour éviter double connexion ---
  const connected = useRef(false);

  // --- Connexion au WS à l'initialisation ---
  useEffect(() => {
    if (!utilisateur?.id || !examId) {
      navigate("/Examen");
      return;
    }
    if (connected.current) return;

    const setupConnection = async () => {
      try {
        const examen: ExamenDto = await getExamenById(examId);
        setTimeLeft((examen.duree || 0) * 60); // en secondes
        setExamSelect(examen);
        const langageId = examen?.langage || "2"; // fallback Java
        connected.current = true;
        connect(examId, utilisateur.id, langageId, role === "enseignant" ? "superviseur" : "etudiant");
      } catch (error) {
        console.error("Erreur récupération examen :", error);
        // fallback si erreur
        connect(examId, utilisateur.id, "2", role === "enseignant" ? "superviseur" : "etudiant");
        connected.current = true;
      }
    };

    setupConnection();

    return () => {
      disconnect();
      connected.current = false;
    };
  }, [examId, utilisateur?.id, connect, disconnect, navigate, role]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min} : ${sec.toString().padStart(2, "0")}`;
  };

  // --- Gestion du code ---
  const handleRunCode = () => {
    clear();
    runCode(code);
  };

  // --- Données rôle pour affichage ---
  const roleData = {
    etudiant: {
      title: `${examSelect?.nom}`,
      subtitle: `${examSelect?.consigne}`,
      duree: formatTime(timeLeft),
      alerts,
      color: "bg-blue-50",
      button: "Abandonner"
    },
    enseignant: {
      title: "Bonjour Enseignant !",
      subtitle: "Créez un nouvel examen facilement.",
      duree: `${examSelect?.duree}`,
      alerts,
      color: "bg-green-50",
      button: "Arrêter la supervision"
    },
    superviseur: {
      title: "Superviseur",
      subtitle: "Choisissez un examen en cours pour le superviser.",
      duree: formatTime(timeLeft),
      alerts,
      color: "bg-yellow-50",
      button: "Arrêter la supervision"
    }
  };

  const currentRole = roleData[role as keyof typeof roleData] || roleData.etudiant;

  const abandonnerExamen = () => {
    setModel(false);
    navigate("/examen");
  };

  return (
    <>
      <Header />

      {/* Modal Abandon */}
      {model && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Abandonner</h2>
            <p className="text-gray-600 mb-4">
              {role === "etudiant"
                ? "Voulez-vous vraiment abandonner l'examen ? Votre progression ne sera pas sauvegardée."
                : "Voulez-vous vraiment arrêter la supervision ?"}
            </p>
            <div className="flex gap-4">
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded-lg"
                onClick={() => setModel(false)}
              >
                Annuler
              </button>
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                onClick={abandonnerExamen}
              >
                Abandonner
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Banner Rôle */}
        <div
          className={`w-full md:w-3/4 p-6 rounded-2xl shadow-md text-center mx-auto ${currentRole.color} border border-gray-200`}
        >
          <h1 className="text-2xl font-bold text-gray-800">{currentRole.title}</h1>
          <p className="text-gray-600 mt-2 mb-2">{currentRole.subtitle}</p>
          <div className="flex justify-center items-center mb-4">
            <div
              className={`px-6 py-3 rounded-full text-lg font-bold shadow-md transition-all
                ${
                  timeLeft > 900
                    ? "bg-green-100 text-green-700"
                    : timeLeft > 300
                    ? "bg-orange-100 text-orange-600"
                    : "bg-red-100 text-red-600 animate-pulse"
                }`}
            >
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          {currentRole.alerts.length > 0 && (
            <p className="text-red-600 mt-2 mb-4">
              Alert : {currentRole.alerts.map(a => a.message).join(", ")}
            </p>
          )}
          <button
            className="px-6 py-2 rounded-lg bg-white font-semibold shadow hover:bg-gray-100 transition"
            onClick={() => setModel(true)}
          >
            {currentRole.button}
          </button>
        </div>

        {/* Terminal */}
        {examId && (
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