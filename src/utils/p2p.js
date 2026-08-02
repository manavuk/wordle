import Peer from 'peerjs';

export class P2PManager {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.isHost = false;
    this.onMessageCallback = null;
    this.onStatusCallback = null;
    this.roomId = null;
  }

  // Clean up existing connections
  disconnect() {
    if (this.conn) {
      try {
        this.conn.close();
      } catch (e) {
        console.error('Error closing connection:', e);
      }
      this.conn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {
        console.error('Error destroying peer:', e);
      }
      this.peer = null;
    }
  }

  // Initialize Host Room
  createRoom(onRoomCreated, onConnect, onMessage, onError) {
    this.disconnect();
    this.isHost = true;
    this.onMessageCallback = onMessage;

    // Generate neat short 6-character room code
    const shortId = 'WDL-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    this.roomId = shortId;

    try {
      this.peer = new Peer(shortId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        if (onRoomCreated) onRoomCreated(id);
      });

      this.peer.on('connection', (connection) => {
        this.conn = connection;
        this.setupConnectionHandlers(onConnect, onError);
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS Host Error:', err);
        let msg = 'Failed to create room signaling session.';
        if (err.type === 'unavailable-id') {
          msg = 'Room code collision. Please try creating a room again.';
        } else if (err.type === 'network') {
          msg = 'Network connection to PeerJS server failed.';
        }
        if (onError) onError(new Error(msg));
      });
    } catch (err) {
      console.error('PeerJS Initialization Error:', err);
      if (onError) onError(err);
    }
  }

  // Initialize Guest Room
  joinRoom(roomId, onConnect, onMessage, onError) {
    this.disconnect();
    this.isHost = false;
    this.onMessageCallback = onMessage;
    const cleanRoomId = roomId.trim().toUpperCase();
    this.roomId = cleanRoomId;

    try {
      this.peer = new Peer({
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', () => {
        this.conn = this.peer.connect(this.roomId, { reliable: true });
        this.setupConnectionHandlers(onConnect, onError);
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS Guest Error:', err);
        let msg = 'Could not connect to host. Please verify room code.';
        if (err.type === 'peer-unavailable') {
          msg = 'Room code not found or Host has closed the session.';
        }
        if (onError) onError(new Error(msg));
      });
    } catch (err) {
      console.error('PeerJS Join Error:', err);
      if (onError) onError(err);
    }
  }

  setupConnectionHandlers(onConnect, onError) {
    if (!this.conn) return;

    const notifyConnect = () => {
      if (onConnect) onConnect();
    };

    // Fix for PeerJS Gotcha: connection may already be open when received by Host
    if (this.conn.open) {
      notifyConnect();
    } else {
      this.conn.on('open', notifyConnect);
    }

    this.conn.on('data', (data) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    });

    this.conn.on('close', () => {
      if (this.onStatusCallback) {
        this.onStatusCallback('disconnected');
      }
    });

    this.conn.on('error', (err) => {
      console.error('PeerJS Connection Error:', err);
      if (onError) onError(err);
    });
  }

  send(data) {
    if (this.conn && this.conn.open) {
      try {
        this.conn.send(data);
      } catch (err) {
        console.error('Error sending P2P message:', err);
      }
    }
  }
}
