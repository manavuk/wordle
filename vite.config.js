import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { WebSocketServer } from 'ws';

function p2pSignalingPlugin() {
  return {
    name: 'p2p-signaling-plugin',
    configureServer(server) {
      const wss = new WebSocketServer({ noServer: true });
      const rooms = new Map(); // roomId -> Set<WebSocket>

      server.httpServer.on('upgrade', (request, socket, head) => {
        const url = new URL(request.url, `http://${request.headers.host}`);
        if (url.pathname === '/p2p-signaling') {
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
          });
        }
      });

      wss.on('connection', (ws) => {
        let currentRoom = null;

        ws.on('message', (raw) => {
          try {
            const data = JSON.parse(raw.toString());
            if (data.type === 'JOIN_ROOM') {
              currentRoom = data.roomId;
              if (!rooms.has(currentRoom)) {
                rooms.set(currentRoom, new Set());
              }
              rooms.get(currentRoom).add(ws);
            } else if (data.type === 'SIGNAL' || data.type === 'GAME_MESSAGE') {
              const targetRoom = data.roomId || currentRoom;
              const clients = rooms.get(targetRoom);
              if (clients) {
                for (const client of clients) {
                  if (client !== ws && client.readyState === 1) {
                    client.send(JSON.stringify(data));
                  }
                }
              }
            }
          } catch (err) {
            console.error('P2P Signaling Error:', err);
          }
        });

        ws.on('close', () => {
          if (currentRoom && rooms.has(currentRoom)) {
            rooms.get(currentRoom).delete(ws);
            if (rooms.get(currentRoom).size === 0) {
              rooms.delete(currentRoom);
            }
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), p2pSignalingPlugin()],
  server: {
    port: 3000,
    open: true,
    host: true
  }
});
