// src/components/TerminalComponent.tsx
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { connectTerminal, sendTerminalData, disconnectTerminal } from "../services/TerminalService";

const TerminalComponent = ({ examId, studentId }: { examId: string, studentId: string }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | undefined>(undefined);

  useEffect(() => {
    term.current = new Terminal();
    term.current.open(terminalRef.current!);

    connectTerminal(examId, studentId, (msg: string) => term.current?.write(msg));

    term.current.onData((data: string) => sendTerminalData(data));

    return () => {
      disconnectTerminal();
      term.current?.dispose();
    };
  }, [examId, studentId]);

  return <div ref={terminalRef} style={{ width: "100%", height: "500px" }} />;
};

export default TerminalComponent;