/**
 * 
 */

function SparkController()
{
	var self=this;
	request = require('request');
	var extend = require('xtend');
	this.pingSpark = function()
	{
		var url='https://api.spark.io/v1/devices/53ff68066667574827222567\?access_token=1c19adfdfcf50419234b35586a8cbcd63d436f84';
		var eventReceiver=function(error,response,body)
		{
			if((!error)||(response.statusCode == 200))
			{
				console.log(body)
			}
			else
			{
				console.log('error:'+error);
				console.log(response.statusCode);
			}
		}
		this.request(
				{
					url:url
				},
				eventReceiver);
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
		request(options,
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
	this.onLog=function(l)
	{
		console.log(l);
	};
	this.onTrigger=function(e)
	{
		var options=
			{
				url:'https://api.spark.io/v1/devices/53ff68066667574827222567/events?access_token=1c19adfdfcf50419234b35586a8cbcd63d436f84',
				headers:
				{
					'User-Agent': 'Its-a-wash/0.0.1'		
				},
				method:'GET'
			};
		var chunks=[];
		var processItem = function(arr)
		{
			var obj = {};
			for(var i=0;i<arr.length;i++)
			{
				var line = arr[i];
				if (line.indexOf("event:") == 0)
				{
					obj.name = line.replace("event:", "").trim();
				}
				else if (line.indexOf("data:") == 0)
				{
					line = line.replace("data:", "");
					obj = extend(obj, JSON.parse(line));
				}
			}
			e(obj.name);
		};
		var appendToQueue = function(arr)
		{
			for(var i=0;i<arr.length;i++)
			{
				var line = (arr[i] || "").trim();
				if (line == "")
				{
					continue;
				}
				chunks.push(line);
				if (line.indexOf("data:") == 0)
				{
					processItem(chunks);
					chunks = [];
				}
			}
		};
		var onData=function(event)
		{
			var chunk = event.toString();
			appendToQueue(chunk.split("\n"));
		};
		var requestObj=request(options);
		requestObj.on('data',onData);
	};
	this.waterTapOn=function()
	{
		self.solenoidControl('water',true);
	};
	this.waterTapOff=function()
	{
		self.solenoidControl('water',false);
	};
	this.soapOn=function()
	{
		console.log('soap on');
		self.solenoidControl('soap',true);
	};
	this.soapOff=function()
	{
		console.log('soap off');
		self.solenoidControl('soap',false);
	};
}

function ClientEventSender()
{
}

function StateBase()
{
	this.onEnter=function() {};
	this.onLeave=function() {};
	this.onFlush=function() {};
	this.onLightOn=function() {};
	this.onLightOff=function() {};
	this.onScaleOn=function() {};
	this.onScaleOff=function() {};
	this.onTimerExpire=function() {};
}

StateInitial=function()
{
	this.onLightOn=function(sm)
	{
		console.log('onLightOn');
		sm.broadcastToClients('HandRemoved',{});
		sm.sparkController.waterTapOff();
	};
	this.onLightOff=function(sm)
	{
		console.log('onLightOff');
		sm.broadcastToClients('HandDetected',{});
		sm.sparkController.waterTapOn();
	};
	this.onFlush=function(sm)
	{
		sm.broadcastToClients('Flush',{});
	};
}

StateInitial.prototype=new StateBase();

function StateMachine()
{
	var self=this;
	this.setState=function(state)
	{
		this.currentState.onLeave(this);
		this.currentState=state;
		this.currentState.onEnter(this);
	}
	this.currentState=new StateInitial();
	this.sparkController=new SparkController();
	this.clientEventSender=new ClientEventSender();
	this.socket=[];
	this.broadcastToClients=function(eventName,data)
	{
		console.log(self.socket.length);
		self.socket.forEach(
				function(s)
				{
					s.emit(eventName, data);
				});
	}
}

function Server()
{
	var self=this;
	var socketId=1;
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
		        socket._machack_id=socketId++;
		        self.stateMachine.socket[socket._machack_id]=socket;
		    });

		    socket.on('disconnect', function() {
		        // handle disconnect
		        console.log("Disconnected");
		        delete self.stateMachine.socket[socket._machack_id];
		    });
		});
		self.stateMachine.sparkController.onTrigger(
				function(e)
				{
					switch(e)
					{
					case "flushed":
						self.stateMachine.currentState.onFlush(self.stateMachine);
						break;
					case "light-on":
						self.stateMachine.currentState.onLightOn(self.stateMachine);
						break;
					case "light-off":
						self.stateMachine.currentState.onLightOff(self.stateMachine);
						break;
					}
				});
	}
}

var server=new Server();
server.port=3003;
server.start();
