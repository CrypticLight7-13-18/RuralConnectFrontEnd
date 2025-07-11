/**
 * Secure Socket.IO Service
 * Handles authenticated socket connections with proper error handling
 */

import { io } from "socket.io-client";
import { socketURL } from "./api";

class SecureSocketService {
  constructor() {
    this.socket = null;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
    this.isConnected = false;
    this.eventListeners = new Map();
  }

  /**
   * Get authentication token from cookies
   * @returns {string|null} JWT token or null
   */
  getAuthToken() {
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
    
    if (jwtCookie) {
      const token = jwtCookie.split('=')[1];
      return token !== 'loggedout' ? token : null;
    }
    
    return null;
  }

  /**
   * Connect to socket server with authentication
   * @returns {Promise<Socket>} Connected socket instance
   */
  async connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    return new Promise((resolve, reject) => {
      this.socket = io(socketURL, {
        auth: {
          token: token
        },
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      // Connection success
      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully');
        this.isConnected = true;
        this.connectionAttempts = 0;
        resolve(this.socket);
      });

      // Connection error
      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection failed:', error.message);
        this.isConnected = false;
        
        if (error.message.includes('Authentication error')) {
          reject(new Error('Authentication failed. Please log in again.'));
        } else if (this.connectionAttempts < this.maxRetries) {
          this.connectionAttempts++;
          console.log(`🔄 Retrying connection (${this.connectionAttempts}/${this.maxRetries})`);
          setTimeout(() => this.connect(), 2000 * this.connectionAttempts);
        } else {
          reject(new Error('Failed to connect to chat server. Please try again later.'));
        }
      });

      // Disconnection
      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        this.isConnected = false;
        
        // Auto-reconnect for certain reasons
        if (reason === 'io server disconnect') {
          // Server disconnected the socket, try to reconnect
          this.connect().catch(console.error);
        }
      });

      // Authentication error during runtime
      this.socket.on('auth_error', (error) => {
        console.error('🚫 Socket authentication error:', error);
        this.disconnect();
        reject(new Error('Session expired. Please log in again.'));
      });
    });
  }

  /**
   * Safely emit an event with error handling
   * @param {string} event - Event name
   * @param {object} data - Data to send
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} Promise that resolves when acknowledged
   */
  async safeEmit(event, data, timeout = 5000) {
    if (!this.socket?.connected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Socket emit timeout for event: ${event}`));
      }, timeout);

      this.socket.emit(event, data, (response) => {
        clearTimeout(timer);
        
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Safely join a chat room with validation
   * @param {string} chatId - Chat ID to join
   * @returns {Promise} Promise that resolves when joined
   */
  async joinChat(chatId) {
    if (!chatId || typeof chatId !== 'string') {
      throw new Error('Invalid chat ID provided');
    }

    return this.safeEmit('joinChat', { chatId });
  }

  /**
   * Send a message with validation
   * @param {string} chatId - Chat ID
   * @param {string} message - Message content
   * @param {string} role - Sender role
   * @returns {Promise} Promise that resolves when sent
   */
  async sendMessage(chatId, message, role = 'User') {
    if (!chatId || typeof chatId !== 'string') {
      throw new Error('Invalid chat ID provided');
    }
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (message.length > 1000) {
      throw new Error('Message is too long (max 1000 characters)');
    }

    // Sanitize the message before sending
    const sanitizedMessage = message.trim();

    return this.safeEmit('newMessage', {
      chatId,
      message: sanitizedMessage,
      role
    });
  }

  /**
   * Add event listener with cleanup tracking
   * @param {string} event - Event name
   * @param {function} callback - Event callback
   */
  on(event, callback) {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }

    this.socket.on(event, callback);
    
    // Track listeners for cleanup
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} callback - Event callback
   */
  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);
    
    // Update tracking
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    if (this.socket) {
      // Remove all tracked listeners
      this.eventListeners.forEach((listeners, event) => {
        listeners.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      
      this.eventListeners.clear();
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.connectionAttempts = 0;
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Export singleton instance
export const socketService = new SecureSocketService();
export default socketService;
