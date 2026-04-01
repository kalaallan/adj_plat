import { useRef, useState, useCallback, useEffect } from "react";

type Status = "idle" | "connecting" | "open" | "closed" | "error";

type Alert = {
  message: string;
  etudiant?: string;
};

export const useWorkspaceService = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [output, setOutput] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const isConnecting = useRef(false);
  const retryCount = useRef(0);

  // référence SAFE de connect
  type ConnectFn = (
    examId: string,
    userId: string,
    langageId: string,
    role: "etudiant" | "superviseur"
  ) => void;

  const connectRef = useRef<ConnectFn | null>(null);

  // garder les params pour reconnexion
  const paramsRef = useRef<{
    examId: string;
    userId: string;
    langageId: string;
    role: "etudiant" | "superviseur";
  } | null>(null);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
      socketRef.current = null;
      isConnecting.current = false;
    };
  }, []);

  const connect = useCallback((
    examId: string,
    userId: string,
    langageId: string,
    role: "etudiant" | "superviseur"
  ) => {
    if (socketRef.current || isConnecting.current) return;

    paramsRef.current = { examId, userId, langageId, role };

    const url = `ws://localhost:8080/ws/terminal/${examId}/${userId}/${langageId}/${role}`;
    const socket = new WebSocket(url);

    socketRef.current = socket;
    isConnecting.current = true;
    setStatus("connecting");

    socket.onopen = () => {
      setStatus("open");
      isConnecting.current = false;
      retryCount.current = 0; // reset retry
      console.log("Terminal connecté");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "ALERT") {
          setAlerts(prev => [...prev, {
            message: data.message,
            etudiant: data.etudiant
          }]);
          return;
        }

        if (data.type === "OUTPUT") {
          setOutput(prev => prev + data.message);
          return;
        }

      } catch {
        setOutput(prev => prev + event.data);
      }
    };

    socket.onerror = (err) => {
      console.error("Erreur WebSocket:", err);
      setStatus("error");
      isConnecting.current = false;
      socketRef.current = null;
    };

    socket.onclose = () => {
      setStatus("closed");
      socketRef.current = null;
      isConnecting.current = false;

      // Reconnexion automatique sécurisée
      if (paramsRef.current && connectRef.current) {

        if (retryCount.current >= 5) {
          console.warn("Max retry atteint");
          return;
        }

        retryCount.current++;

        setTimeout(() => {
          const p = paramsRef.current!;
          connectRef.current?.(p.examId, p.userId, p.langageId, p.role);
        }, 3000);
      }
    };

  }, []);

  // toujours garder la dernière version de connect
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // CODE → JSON
  const runCode = useCallback((code: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "CODE",
        data: code
      }));
    } else {
      console.error("Terminal hors ligne");
    }
  }, []);

  // INPUT -> JSON
  const sendInput = useCallback((input: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "INPUT",
        data: input
      }));
    }
  }, []);

  // ALERT
  const sendAlert = useCallback((alert: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "ALERT",
        data: alert
      }));
    }
  }, []);

  // Anti-triche
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        sendAlert("Changement d'onglet détecté");
      }
    };

    /*const handleBlur = () => {
      sendAlert("Perte de focus");
    };

    const blockCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      sendAlert("Tentative de copier/coller");
    };*/

    document.addEventListener("visibilitychange", handleVisibility);
    /*window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", blockCopyPaste);
    document.addEventListener("paste", blockCopyPaste);*/

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      /*window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", blockCopyPaste);
      document.removeEventListener("paste", blockCopyPaste);*/
    };
  }, [sendAlert]);

  const disconnect = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
    setStatus("closed");
    isConnecting.current = false;
  }, []);

  const clear = useCallback(() => setOutput(""), []);

  return {
    output,
    status,
    connect,
    runCode,
    sendInput,
    disconnect,
    clear,
    sendAlert,
    alerts
  };
};