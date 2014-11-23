$(function() {
	var socket = io();
	var stateMachine = new StateMachine();

	var ServerMessages = [
	['EnterWashroom', function(msg){
		stateMachine.run('greet')
	}],
	['Flush', function(msg){
		stateMachine.run('prompt')
	}],
	['HandDetected', function(msg){
		stateMachine.run('wethands')
	}],
	['HandRemoved', function(msg){
		stateMachine.interruptState();
	}],
	['msg-from-server', function(msg){
		stateMachine.run('wethands');
	}],
	]

	$.each(ServerMessages, function(index, tuple){
		socket.on(tuple[0], tuple[1]);
	})

socket.emit('msg-from-client', {test: "abcd"});
});