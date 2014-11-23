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
			e();
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
		self.solenoidControl('soap',true);
	};
	this.soapOff=function()
	{
		self.solenoidControl('soap',false);
	};
	this.onFlush=function(e)
	{
		self.onTrigger(e);
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
	this.currentState=new StateBase();
	this.sparkController=new SparkController();
	this.clientEventSender=new ClientEventSender();
	this.socket=[];
	this.broadcastToClients=function(data)
	{
		self.socket.forEach(
				function(s)
				{
					s.emit('msg-from-server', data);
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
		        self.stateMachine[socket._machack_id]=socket;
		        // send some data
		        //socket.emit('msg-from-server', {text: 12345});
		    });

		    socket.on('disconnect', function() {
		        // handle disconnect
		        console.log("Disconnected");
		        delete self.stateMachine[socket._machack_id];
		    });
		});
		self.stateMachine.sparkController.onFlush(
				function()
				{
					console.log('Flush!');
					self.stateMachine.currentState.onFlush();
				});
	}
}

var server=new Server();
//server.stateMachine.sparkController.waterTapOff();
//server.stateMachine.sparkController.soapOff();
server.port=3003;
server.start();
