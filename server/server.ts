const username = [
    'Lynx philosophe',
    'Kangourou turbulant',
    'Gorille végétarien',
    'Chat sprinteur',
    'Tortue timide',
    'Aligator mignon',
    'Aigle myope',
    'Éléphant acrobate',
    'Chameau surfeur',
    'Hibou bavard'
];
const users : {username: string, posX: number, posY: number, visitedCountries: string[], lastHeartbeat?: number}[] = [];

const CLEANUP_INTERVAL = 10000;
const HEARTBEAT_TIMEOUT = 7000;

function cleanInactiveUsers(server: any) {
    const now = Date.now();
    const inactiveUsers = users.filter(user => now - (user.lastHeartbeat || 0) > HEARTBEAT_TIMEOUT);

    if (inactiveUsers.length > 0) {
        inactiveUsers.forEach(user => {
            const index = users.findIndex(u => u.username === user.username);
            if (index !== -1) {
                console.log(`Removing inactive user: ${user.username}`);
                users.splice(index, 1);
                username.push(user.username);
            }
        });

        // Notify remaining users about disconnections
        if (users.length > 0) {
            server.publish("users", JSON.stringify({
                type: 'userDisconnected',
                users: users
            }));
        }
    }
}

const server = Bun.serve<{ id: string }>({
    port: 4000,
    fetch(req, server) {
        username.sort(() => Math.random() - 0.5);
        if (server.upgrade(req, {
            data: { username: username.shift() }
        })) {
            return;
        }
        return new Response('Upgrade failed', { status: 500 });
    },
    websocket: {
        open(ws) {
            ws.send(JSON.stringify({
                type: 'init',
                username: ws.data.username,
                users: users
            }));
            ws.subscribe("users");
            users.push({
                username: ws.data.username,
                posX: 0,
                posY: 0,
                visitedCountries: [],
                lastHeartbeat: Date.now()
            });
        },
        message(ws, receivedData) {
            const data = JSON.parse(receivedData);
            const userIndex = users.findIndex(user => user.username === ws.data.username);
            if (userIndex !== -1) {
                users[userIndex].lastHeartbeat = Date.now();
            }
            if(data.type === "heartbeat") {
                ws.send(JSON.stringify({ type: "heartbeat_ack" }));
                return;
            }
            else if(data.type === "position") {
                const index = users.findIndex(user => user.username === ws.data.username);
                users[index] = {...users[index], posX: data.posX, posY: data.posY};
                server.publish("users", JSON.stringify(users[index]));
            }
            else if(data.type === "visitedCountry") {
                const index = users.findIndex(user => user.username === ws.data.username);
                if(!users[index].visitedCountries.includes(data.country) ) {
                    users[index].visitedCountries.push(data.country);
                }
            }
            else if(data.type === "removeVisitedCountry") {
                const index = users.findIndex(user => user.username === data.username);
                if(users[index].visitedCountries.includes(data.country) ) {
                    users[index].visitedCountries = users[index].visitedCountries.filter(c => c !== data.country);
                }
            }
            else if(data.type === 'getCountries') {
                const index = users.findIndex(user => user.username === data.username);
                ws.send(JSON.stringify({
                    type: 'getCountries',
                    username: data.username,
                    countries: users[index].visitedCountries
                }));
            }
        },
        close(ws) {
            const index = users.findIndex(user => user.username === ws.data.username);
            if (index !== -1) {
                console.log("User disconnected:", users[index].username);
                users.splice(index, 1);
                server.publish("users", JSON.stringify({
                    type: 'userDisconnected',
                    users: users
                }));
                ws.unsubscribe("users");
                username.push(ws.data.username);
            }
        },
    }
});

setInterval(() => cleanInactiveUsers(server), CLEANUP_INTERVAL);
console.log(`WebSocket server running on ws://localhost:${server.port}`);