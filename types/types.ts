export interface IMessage {
    type: string;
    [key: string]: any;
}

export interface User {
    username: string;
    posX: number;
    posY: number;
    visitedCountries: string[];
}

export interface IUser extends User {
    lastHeartbeat: number;
}

export interface Message {
    sender: string;
    recipient: string;
    text: string;
    timestamp: number;
}