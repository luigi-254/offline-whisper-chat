import { User, Message } from '../types';

/**
 * Simulates Offline P2P communication using BroadcastChannel.
 * In a real-world scenario, this would interface with native Bluetooth/Wi-Fi Direct APIs.
 */
class P2PService {
  private channel: BroadcastChannel;
  private onMessageReceived?: (message: Message) => void;
  private onUserDiscovered?: (user: User) => void;

  constructor() {
    this.channel = new BroadcastChannel('offline_messenger_p2p');
    this.channel.onmessage = (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'DISCOVERY_PING':
          this.handleDiscoveryPing(data);
          break;
        case 'DISCOVERY_PONG':
          this.handleDiscoveryPong(data);
          break;
        case 'MESSAGE':
          this.handleMessage(data);
          break;
      }
    };
  }

  setListeners(onMsg: (m: Message) => void, onUser: (u: User) => void) {
    this.onMessageReceived = onMsg;
    this.onUserDiscovered = onUser;
  }

  // Broadcast presence to others
  broadcastPresence(user: User) {
    this.channel.postMessage({ type: 'DISCOVERY_PING', data: user });
  }

  // Respond to a discovery ping
  private handleDiscoveryPing(user: User) {
    if (this.onUserDiscovered) this.onUserDiscovered(user);
    // Send back our presence if we receive a ping
    const currentUserRaw = localStorage.getItem('messenger_user');
    if (currentUserRaw) {
      const currentUser = JSON.parse(currentUserRaw);
      this.channel.postMessage({ type: 'DISCOVERY_PONG', data: currentUser });
    }
  }

  private handleDiscoveryPong(user: User) {
    if (this.onUserDiscovered) this.onUserDiscovered(user);
  }

  private handleMessage(message: Message) {
    if (this.onMessageReceived) this.onMessageReceived(message);
  }

  sendMessage(message: Message) {
    this.channel.postMessage({ type: 'MESSAGE', data: message });
  }
}

export const p2p = new P2PService();