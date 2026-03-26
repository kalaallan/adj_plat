import { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import { useAppSelector } from "../store/hooks";
import type { RootState } from "../store";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { runStudentCode } from "../services/WorkspaceService"; // exécution classique
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { connectTerminal, sendTerminalData, disconnectTerminal } from "../services/TerminalService";

const Workspace = () => {
  const useSelector = useAppSelector;
  const { role, utilisateur } = useSelector((state: RootState) => state.login);

  const [code, setCode] = useState("// Écrivez votre code ici...");
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | undefined>(undefined);

  const navigate = useNavigate();

  // Contenu selon rôle
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
      subtitle: "Créez un nouvel examen facilement.",
      color: "bg-green-100",
      hoverColor: "hover:bg-green-200",
      button: "Créer un examen"
    },
    superviseur: {
      title: "Superviseur",
      subtitle: "Choisissez un examen en cours pour le superviser.",
      color: "bg-yellow-100",
      hoverColor: "hover:bg-yellow-200",
      button: "Superviser un examen"
    }
  };

  const currentRole = roleData[role as keyof typeof roleData] || roleData.etudiant;
  const navigationExamen = () => navigate("/Examen");

  // ✅ Bouton exécution rapide
  const handleRunCode = async () => {
    const result = await runStudentCode({
      code,
      examId: "EX002", // remplacer par examen sélectionné
      studentId: utilisateur?.id ?? "unknown",
      langageId: 2 // Java
    });
    term.current?.write(result + "\n"); // afficher dans le terminal interactif
  };

  // ✅ Terminal interactif WebSocket
  useEffect(() => {
    term.current = new Terminal({ fontSize: 14 });
    term.current.open(terminalRef.current!);

    connectTerminal("EX002", utilisateur?.id ?? "unknown", (msg: string) => {
      term.current?.write(msg);
    });

    term.current.onData((data: string) => sendTerminalData(data));

    return () => {
      disconnectTerminal();
      term.current?.dispose();
    };
  }, [utilisateur]);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className={`w-full md:w-2/3 p-10 rounded-2xl shadow-lg text-center transition ${currentRole.color} ${currentRole.hoverColor} cursor-pointer`}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{currentRole.title}</h1>
            <p className="text-gray-700 text-lg md:text-xl mb-6">{currentRole.subtitle}</p>
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
        </div>

        {/* Éditeur + Terminal */}
        <div className="w-full mt-12 bg-white rounded-2xl shadow-xl overflow-hidden border">
          <div className="flex flex-col md:flex-row h-150">

            {/* Éditeur Monaco */}
            <div className="w-full md:w-1/2 bg-gray-900 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">Éditeur</h2>
                <span className="text-xs text-gray-400">Java</span>
              </div>

              <Editor
                height="100%"
                defaultLanguage="java"
                value={code}
                theme="vs-dark"
                options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false }}
                onChange={(value) => setCode(value || "")}
              />

              <button
                onClick={handleRunCode}
                className="mt-4 px-6 py-2 rounded-full bg-purple-600/50 text-white font-semibold self-end hover:bg-purple-600"
              >
                Exécuter
              </button>
            </div>

            {/* Terminal interactif */}
            <div className="w-full md:w-1/2 bg-gray-100 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-gray-700 font-semibold">Terminal</h2>
                <span className="text-xs text-gray-500">Interactif</span>
              </div>
              <div ref={terminalRef} style={{ width: "100%", height: "500px", backgroundColor: "black" }} />
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default Workspace;