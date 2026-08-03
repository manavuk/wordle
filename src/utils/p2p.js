export class P2PManager {
  constructor() {
    this.ws = null;
    this.bc = null;
    this.storageListener = null;
    this.isHost = false;
    this.onMessageCallback = null;
    this.onStatusCallback = null;
    this.roomId = null;
    this.pingInterval = null;
    this.instanceId = 'peer_' + Math.random().toString(36).substring(2, 9);
    this.isConnected = false;
  }

  // Clean up all connection channels
  disconnect() {
    this.isConnected = false;
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
    if (this.bc) {
      try {
        this.bc.close();
      } catch (e) {
        console.error('Error closing BroadcastChannel:', e);
      }
      this.bc = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        console.error('Error closing WebSocket:', e);
      }
      this.ws = null;
    }
  }

  // Initialize Host Room
  createRoom(onRoomCreated, onConnect, onMessage, onError) {
    this.disconnect();
    this.isHost = true;
    this.onMessageCallback = onMessage;

    const shortId = 'WDL-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    this.roomId = shortId;

    this.setupChannels(shortId, onConnect, onError);

    if (onRoomCreated) {
      onRoomCreated(shortId);
    }
  }

  // Initialize Guest Room
  joinRoom(roomId, onConnect, onMessage, onError) {
    this.disconnect();
    this.isHost = false;
    this.onMessageCallback = onMessage;

    const cleanRoomId = roomId.trim().toUpperCase();
    this.roomId = cleanRoomId;

    this.setupChannels(cleanRoomId, onConnect, onError);

    // Ping Host every 500ms over all active channels until match is established
    this.pingInterval = setInterval(() => {
      if (!this.isConnected) {
        this.send({ type: 'GUEST_JOIN' });
      }
    }, 500);

    // Initial immediate ping
    this.send({ type: 'GUEST_JOIN' });
  }

  setupChannels(roomId, onConnect, onError) {
    const handleIncomingMessage = (data) => {
      if (!data || data._sender === this.instanceId) return;

      if (this.isHost && data.type === 'GUEST_JOIN') {
        if (!this.isConnected) {
          this.isConnected = true;
          if (onConnect) onConnect();
        }
      } else if (!this.isHost && data.type === 'START_GAME') {
        if (!this.isConnected) {
          this.isConnected = true;
          if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
          }
          if (onConnect) onConnect();
        }
      }

      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    };

    if (typeof window !== 'undefined') {
      // 1. WebSocket Signaling Server (Primary transport across windows, browsers, and devices)
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/p2p-signaling`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.ws.send(JSON.stringify({ type: 'JOIN_ROOM', roomId }));
          if (!this.isHost) {
            this.send({ type: 'GUEST_JOIN' });
          }
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'GAME_MESSAGE') {
              handleIncomingMessage(data.payload);
            }
          } catch (e) {
            console.error('Error parsing P2P message:', e);
          }
        };

        this.ws.onerror = (err) => {
          console.warn('P2P WebSocket signaling error:', err);
        };
      } catch (e) {
        console.warn('WebSocket signaling unavailable:', e);
      }

      // 2. BroadcastChannel (Intra-browser tab fallback)
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.bc = new BroadcastChannel('wordle_p2p_' + roomId);
          this.bc.onmessage = (event) => {
            handleIncomingMessage(event.data);
          };
        } catch (e) {
          console.warn('BroadcastChannel error:', e);
        }
      }

      // 3. LocalStorage Event Bus (Cross-window fallback)
      this.storageListener = (e) => {
        if (e.key === 'wordle_p2p_bus_' + roomId && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            handleIncomingMessage(data);
          } catch (err) {}
        }
      };
      window.addEventListener('storage', this.storageListener);
    }
  }

  send(data) {
    const payload = { ...data, _sender: this.instanceId, _ts: Date.now() + Math.random() };

    // 1. Send via WebSocket Server
    if (this.ws && this.ws.readyState === 1) {
      try {
        this.ws.send(JSON.stringify({
          type: 'GAME_MESSAGE',
          roomId: this.roomId,
          payload
        }));
      } catch (e) {
        console.error('WS send error:', e);
      }
    }

    // 2. Send via BroadcastChannel
    if (this.bc) {
      try {
        this.bc.postMessage(payload);
      } catch (e) {
        console.error('BroadcastChannel send error:', e);
      }
    }

    // 3. Send via LocalStorage Event Bus
    if (typeof localStorage !== 'undefined' && this.roomId) {
      try {
        localStorage.setItem('wordle_p2p_bus_' + this.roomId, JSON.stringify(payload));
      } catch (e) {}
    }
  }
}
