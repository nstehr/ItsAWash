$(function() {
    var socket = io();

    socket.on('msg-from-server', function(data) {
        console.log("msg from server...", data);
    });

    socket.emit('msg-from-client', {test: "abcd"});
});