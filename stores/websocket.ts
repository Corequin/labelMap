import { defineStore } from 'pinia'
import type {User, Message} from "~/types/types";

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        socket: null as WebSocket | null,
        connected: false,
        username: '',
        users: [] as Array<User>,
        chatMessages: [] as Array<Message>
    }),

    actions: {
        connect() {
            if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
                console.log('WebSocket already connected or connecting');
                return;
            }

            this.socket = new WebSocket("wss://labelmap-ws-production.up.railway.app");

            this.socket.addEventListener('open', (event) => {
                console.log('WebSocket connected');
                this.connected = true;
            });

            this.socket.addEventListener('close', () => {
                console.log('WebSocket disconnected');
                this.connected = false;
                setTimeout(() => {
                    this.connect();
                }, 3000);
            });

            this.socket.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });
        },

        disconnect() {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.close();
            }
        },

        sendMessage(message: any) {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                console.error('WebSocket not connected');
                return false;
            }
            this.socket.send(JSON.stringify(message));
            return true;
        },

        handleMessage(data: any) {
            switch (data.type) {
                case 'init':
                    this.username = data.username;
                    this.users = [...data.users];
                    break;

                case 'userDisconnected':
                    this.users = [...data.users.filter(user => user.username !== this.username)];
                    break;

                case 'getCountries':
                    const index = this.users.findIndex(user => user.username === data.username);
                    this.users[index].visitedCountries = [...data.countries];
                    break;

                case 'chat':
                    const chatMessage = {
                        sender: data.username,
                        recipient: data.recipientUsername,
                        text: data.message,
                        timestamp: data.timestamp || Date.now()
                    };
                    this.chatMessages.push(chatMessage);
                    break;

                default:
                    if (!data.type && data.username && data.posX !== undefined && data.posY !== undefined) {
                        const userIndex = this.users.findIndex(u => u.username === data.username);
                        if (userIndex >= 0) {
                            this.users[userIndex].posX = data.posX;
                            this.users[userIndex].posY = data.posY;
                        } else if (data.username !== this.username) {
                            this.users.push(data);
                        }
                    }
                    break;
            }
        },
        sendChatMessage(recipient: string, message: string) {
            const success = this.sendMessage({
                type: 'chat',
                username: this.username,
                recipientUsername: recipient,
                message: message
            });

            if (success) {
                this.chatMessages.push({
                    sender: this.username,
                    recipient: recipient,
                    text: message,
                    timestamp: Date.now()
                });
            }

            return success;
        }
    }
})