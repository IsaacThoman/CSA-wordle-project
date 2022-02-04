const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        let emptyPlayer = {words:['','','','','',''],keyboardColors:{},playerID:0,rowChecked: -1,won:false};
        io.emit('playerData',emptyPlayer)
    });


    socket.on('playerData', (msg) => {
        io.emit('playerData',msg);
    });

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});