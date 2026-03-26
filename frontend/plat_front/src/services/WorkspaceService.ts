// useWorkspaceService.ts
import { useRef, useState, useCallback, useEffect } from "react";

type Status = "idle" | "connecting" | "open" | "closed" | "error";

export const useWorkspaceService = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Ref pour éviter double connexion
  const isConnecting = useRef(false);

  useEffect(() => {
    // Nettoyage au démontage
    return () => {
      socketRef.current?.close();
      socketRef.current = null;
      isConnecting.current = false;
    };
  }, []);

  const connect = useCallback((examId: string, studentId: string, langageId: string) => {
    if (socketRef.current || isConnecting.current) return;

    const url = `ws://localhost:8080/ws/terminal/${examId}/${studentId}/${langageId}`;
    const socket = new WebSocket(url);
    socketRef.current = socket;
    isConnecting.current = true;
    setStatus("connecting");

    socket.onopen = () => {
      setStatus("open");
      isConnecting.current = false;
      console.log("Terminal connecté");
    };

    socket.onmessage = (event) => {
      setOutput(prev => prev + event.data);
    };

    socket.onerror = (err) => {
      console.error("Erreur WebSocket:", err);
      setStatus("error");
      isConnecting.current = false;
      socketRef.current = null;
    };

    socket.onclose = (e) => {
      if (e.wasClean) setStatus("closed");
      else setStatus("error");
      socketRef.current = null;
      isConnecting.current = false;
    };
  }, []);

  const runCode = useCallback((code: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(code);
    } else {
      console.error("Terminal hors ligne");
    }
  }, []);

  const sendInput = useCallback((input: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
    }
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
    setStatus("closed");
    isConnecting.current = false;
  }, []);

  const clear = useCallback(() => setOutput(""), []);

  return { output, status, connect, runCode, sendInput, disconnect, clear };
};