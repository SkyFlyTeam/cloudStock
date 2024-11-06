import WebSocket from 'ws';
import { Notificacoes } from '../models/Notificacoes'; 

let wss: WebSocket.Server | null = null;

// Inicializa o servidor WebSocket
export function inicializarWebSocket(server: any) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Cliente conectado ao WebSocket');

    ws.on('close', () => {
      console.log('Cliente desconectado do WebSocket');
    });
  });
}

// Função para enviar notificações para todos os clientes conectados
export function broadcastNotificacao(notificacao: Notificacoes) {
  if (!wss) {
    console.warn('WebSocket server não está inicializado.');
    return;
  }

  const payload = { action: 'create', notificacao: notificacao};

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
        console.log(client)
        console.log('enviando broad create')
        client.send(JSON.stringify(payload));
    }
  });
}

// Transmite a exclusão da notificação para os clientes conectados
export function broadcastNotificacaoDelete(Not_id: number) {
    const payload = { action: 'delete', id: Not_id };
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log('enviando broad delete')
            client.send(JSON.stringify(payload));
        }
    });
}
