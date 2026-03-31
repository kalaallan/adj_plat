import { useState, type KeyboardEvent } from "react";
import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (value: string) => void;
  output: string;
  status: string;
  runCode: (code: string) => void;
  sendInput: (input: string) => void;
  clear: () => void;
};

const TerminalComponent = ({
  code,
  setCode,
  output,
  status,
  runCode,
  sendInput,
  clear,
}: Props) => {
  const [userInput, setUserInput] = useState("");

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

  return (
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
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            roundedSelection: true,
          }}
          onChange={(value) => setCode(value || "")}
        />
        <div className="mt-2 flex justify-between items-center">
          <span
            className={`text-xs font-mono ${
              status === "open" ? "text-green-400" : "text-red-500"
            }`}
          >
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
          <h2 className="text-xs text-gray-400 font-mono uppercase tracking-widest">
            Output Console
          </h2>
          <button
            onClick={clear}
            className="text-gray-500 hover:text-white text-xs"
          >
            Clear
          </button>
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
  );
};

export default TerminalComponent;
