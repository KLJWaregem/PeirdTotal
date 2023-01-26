const express = require('express');
const http = require('http');
const serveStatic = require('serve-static');
const {Server} = require('ws');
const ws_server = new Server({port: 3001});

const app = express();
app.use(serveStatic('ui'));
const webserver = http.createServer(app);
webserver.listen(3000, () => {
    console.log('listening on *:3000');
});
ws_server.on('connection', (ws, client) => {
    console.log('New client connected');
    ws.on('close', () => {
        console.log('Some client has disconnected!');
    });
    ws.on('message', function (message) {
        broadcast(message.toString());
    })
});
function broadcast(message) {
    ws_server.clients.forEach((client) => {
        client.send(message);
    });
}