const username = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Ethan', 'Joe', 'John', 'Anna', 'Maria'];
const users : {username: string, posX: number, posY: number, visitedCountries: string[]}[] = [];

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
            users.push({username: ws.data.username, posX: 0, posY: 0});
        },
        message(ws, receivedData) {
            const data = JSON.parse(receivedData);
            if(data.type === "position") {
                const index = users.findIndex(user => user.username === ws.data.username);
                users[index] = {...users[index], posX: data.posX, posY: data.posY};
                server.publish("users", JSON.stringify(users[index]));
            } else if(data.type === "visitedCountry") {
                const index = users.findIndex(user => user.username === ws.data.username);
                if( !users[index].visitedCountries.includes(data.country) ) {
                    users[index].visitedCountries.push(data.country);
                } else {
                    users[index].visitedCountries = users[index].visitedCountries.filter(c => c !== data.country);
                }
            } else if(data.type === 'getCountries') {
                const index = users.findIndex(user => user.username === data.username);
                ws.send(JSON.stringify({
                    type: 'getCountries',
                    countries: users[index].visitedCountries
                }));
            }
        },
        close(ws) {
            const index = users.findIndex(user => user.username === ws.data.username);
            users.splice(index, 1);
            server.publish("users", JSON.stringify({
                type: 'userDisconnected',
                users: users
            }));
            ws.unsubscribe("users");
            username.push(ws.data.username);
        },
    }
});

console.log(`WebSocket server running on ws://localhost:${server.port}`);
