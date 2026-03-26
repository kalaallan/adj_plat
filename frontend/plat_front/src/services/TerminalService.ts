let ws: WebSocket | null = null;

export const connectTerminal = (
  examId: string,
  studentId: string,
  onMessage: (msg: string) => void
) => {
  ws = new WebSocket(`ws://localhost:8080/ws/terminal/${examId}/${studentId}`);
  ws.onmessage = (event) => onMessage(event.data);
};

export const sendTerminalData = (data: string) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(data);
  }
};

export const disconnectTerminal = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};