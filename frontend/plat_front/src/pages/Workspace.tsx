import { useEffect, useState, useRef, type KeyboardEvent } from "react";
import Header from "../components/header";
import { useAppSelector } from "../store/hooks";
import type { RootState } from "../store";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { useWorkspaceService } from "../services/WorkspaceService";

const Workspace = () => {
  const navigate = useNavigate();
  const { role, utilisateur } = useAppSelector((state: RootState) => state.login);

  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`);
  const [userInput, setUserInput] = useState(""); 

  const { output, status, connect, runCode, sendInput, disconnect, clear } = useWorkspaceService();

  // Ref pour éviter double connexion
  const connected = useRef(false);

  useEffect(() => {
    if (!utilisateur?.id) return;

    // On utilise uniquement la Ref locale. 
    // Au rafraîchissement (F5), elle repasse à false, ce qui est BIEN 
    // car on DOIT recréer le socket qui a été tué par le navigateur.
    if (connected.current) return;

    console.log("Rafraîchissement détecté : Reconnexion automatique...");
    
    connected.current = true;
    connect("EX002", utilisateur.id, "2");

    return () => {
      // Quand on quitte la page ou qu'on rafraîchit
      disconnect();
      connected.current = false;
    };
  }, [utilisateur?.id, connect, disconnect]);

  const navigationExamen = () => navigate("/Examen");

  const handleRunCode = () => {
    clear();
    runCode(code);
  };

  const handleTerminalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.trim() !== "") {
      sendInput(userInput);
      setUserInput("");
    }
  };

  const roleData = {
    etudiant: { title: "Bienvenue !", subtitle: "Sélectionnez un examen et testez vos connaissances.", color: "bg-blue-50", button: "Choisir un examen" },
    enseignant: { title: "Bonjour Enseignant !", subtitle: "Créez un nouvel examen facilement.", color: "bg-green-50", button: "Créer un examen" },
    superviseur: { title: "Superviseur", subtitle: "Choisissez un examen en cours pour le superviser.", color: "bg-yellow-50", button: "Superviser un examen" }
  };

  const currentRole = roleData[role as keyof typeof roleData] || roleData.etudiant;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Banner Rôle */}
        <div className={`w-full md:w-3/4 p-6 rounded-2xl shadow-md text-center mx-auto ${currentRole.color} border border-gray-200`}>
          <h1 className="text-2xl font-bold text-gray-800">{currentRole.title}</h1>
          <p className="text-gray-600 mt-2 mb-4">{currentRole.subtitle}</p>
          <button
            onClick={navigationExamen}
            className="px-6 py-2 rounded-lg bg-white font-semibold shadow hover:bg-gray-100 transition"
          >
            {currentRole.button}
          </button>
        </div>

        {/* Workspace Container */}
        <div className="w-full bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col md:flex-row h-[700px]">
          {/* Editor Panel */}
          <div className="md:w-1/2 flex flex-col bg-gray-800 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-xs font-mono text-gray-400">Main.java</span>
            </div>
            <Editor
              height="100%"
              defaultLanguage="java"
              value={code}
              theme="vs-dark"
              options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true, roundedSelection: true }}
              onChange={(value) => setCode(value || "")}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-xs font-mono ${status === 'open' ? 'text-green-400' : 'text-red-500'}`}>
                ● {status.toUpperCase()}
              </span>
              <button
                onClick={handleRunCode}
                disabled={status !== "open"}
                className="px-6 py-2 bg-indigo-600 rounded-md font-bold text-white hover:bg-indigo-700 disabled:bg-gray-600 transition-shadow"
              >
                RUN
              </button>
            </div>
          </div>

          {/* Terminal Panel */}
          <div className="md:w-1/2 flex flex-col bg-black p-4 border-l border-gray-700">
            <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1">
              <h2 className="text-xs text-gray-400 font-mono uppercase tracking-widest">Output Console</h2>
              <button onClick={clear} className="text-gray-500 hover:text-white text-xs">Clear</button>
            </div>
            <div className="flex-1 w-full overflow-auto bg-black text-green-400 p-3 font-mono text-sm whitespace-pre-wrap rounded">
              {output}
            </div>
            <div className="mt-3 flex items-center bg-gray-900 rounded px-3 py-2 border border-gray-700 focus-within:border-indigo-500">
              <span className="text-green-500 mr-2">{'>'}</span>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                placeholder="Entrée utilisateur..."
                className="bg-transparent border-none outline-none text-white w-full font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Workspace;