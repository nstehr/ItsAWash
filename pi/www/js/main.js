$(function() {
	var socket = io();

	var ServerMessages = [
	['EnterWashroom', function(msg){
		console.log("enteredwashroom at main.js")
		stateMachine.signal = "EnterWashroom"
		stateMachine.run('greet')

	}],
	['Flush', function(msg){
		stateMachine.run('prompt')
	}],
	['HandDetected', function(msg){
		console.log("HandDetected")
		stateMachine.signal = "HandDetected"
		if (stateMachine.current =='idle'){
			stateMachine.run('wethands')
		}else{
			stateMachine.run(stateMachine.current);
		}
	}],
	['HandRemoved', function(msg){
		console.log("HandRemoved")
		stateMachine.signal = "HandRemoved"
		stateMachine.interruptState();
	}],
	]

	$.each(ServerMessages, function(index, tuple){
		socket.on(tuple[0], tuple[1]);
	})

socket.emit('msg-from-client', {test: "abcd"});
});