var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3003;

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/www'));

io.on('connection', function(socket) {

    socket.on('msg-from-client', function(data) {
        // handle incoming message
        console.log("Receieved from client...", data);

        // send some data
        socket.emit('msg-from-server', {text: 12345});
    });

    socket.on('disconnect', function() {
        // handle disconnect
        console.log("Disconnected");
    });
});
