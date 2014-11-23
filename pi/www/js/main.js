$(function() {
	var socket = io();

	var ServerMessages = [
	['EnterWashroom', function(msg){
	//TODO
	}],
	['Flush', function(msg){
	//TODO
	}],
	['HandDetected', function(msg){
	//TODO
	}],
	['HandRemoved', function(msg){
	//TODO
	}]
	['msg-from-server', function(msg){
		console.log("msg from server...", data);
	}]
	]

	$.each(ServerMessages, function(tuple){
		socket.on(tuple[0], tuple[1]);
	})

socket.emit('msg-from-client', {test: "abcd"});
});