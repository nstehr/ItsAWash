/**
 * 
 */

function SparkController()
{
	this.request = require('request');
	this.pingSpark = function()
	{
		this.request(
				{
					url:'http://api.spark.io/v1/devices/53ff68066667574827222567\?access_token=1c19adfdfcf50419234b35586a8cbcd63d436f84'
				},
				function(error,response,body)
				{
					if((!error)||(response.statusCode == 200))
					{
						console.log(body)
					}					
				});
	};
	this.solenoidControl = function(dev,on)
	{
		var url='https://api.spark.io/v1/devices/53ff68066667574827222567/'+dev+'-'+(on?'on':'off');
		var options=
		{
			url:url,
			headers:
			{
				'User-Agent': 'Its-a-wash/0.0.1',
				'Content-Type': 'application/x-www-form-urlencoded'				
			},
			form:
			{
				access_token:'1c19adfdfcf50419234b35586a8cbcd63d436f84',
				args:''
			},
			method:'POST'
		};
		this.request(options,
				function(error, response, body)
				{
					if((!error)||(response.statusCode == 200))
					{
						console.log(body)
					}
					else
					{
						console.log('error: '+error);
						console.log(response.statusCode);
					}
				});
	};
	this.waterTapOn=function()
	{
		this.solenoidControl('water',true);
	};
	this.waterTapOff=function()
	{
		this.solenoidControl('water',false);
	};
	this.soapOn=function()
	{
		this.solenoidControl('soap',true);
	};
	this.soapOff=function()
	{
		this.solenoidControl('soap',false);
	};
}

function ClientEventSender()
{
}

function StateBase()
{
	this.onEnter=function() {};
	this.onLeave=function() {};
	this.onLightOn=function() {};
	this.onLightOff=function() {};
	this.onScaleOn=function() {};
	this.onScaleOff=function() {};
	this.onTimerExpire=function() {};
}

StateInitial=function()
{
}

StateInitial.prototype=new StateBase();

function StateMachine()
{
	this.setState=function(state)
	{
		this.currentState.onLeave(this);
		this.currentState=state;
		this.currentState.onEnter(this);
	}
	this.currentState=new StateBase();
	this.sparkController=new SparkController();
	this.clientEventSender=new ClientEventSender();
}

function Server()
{
	var self=this;
	this.stateMachine=new StateMachine();
	this.port=80;
	this.start=function()
	{
		var express = require('express');
		var app = express();
		var server = require('http').createServer(app);
		var io = require('socket.io')(server);
		var port = this.port;

		server.listen(port, function() {
		    console.log('Server listening at port %d', port);
		});
		console.log(__dirname);
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
	}
}

var server=new Server();
server.port=3003;
server.start();
