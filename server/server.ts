const server = Bun.serve<{ id: string }>({
    port: 4000,
    fetch(req, server) {
        if (server.upgrade(req, {
            data: { id: crypto.randomUUID() }
        })) {
            return;
        }
        return new Response('Upgrade failed', { status: 500 });
    },
    websocket: {
        open(ws) {
            const msg = `${ws.data.id} has entered the chat`;
            ws.subscribe("users");
            server.publish("users", msg);
        },
        message(ws, position) {
            server.publish("users", `${ws.data.id}: ${position}`);
        },
        close(ws) {
            const msg = `${ws.data.username} has left the chat`;
            ws.unsubscribe("users");
            server.publish("users", msg);
        },
    }
});

console.log(`WebSocket server running on ws://localhost:${server.port}`);
