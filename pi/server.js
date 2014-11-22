/**
 * 
 */


function PiServer()
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
	this.waterTapControl = function(on)
	{
		var url='https://api.spark.io/v1/devices/53ff68066667574827222567/water-';
		if(on)
		{
			url+='on';
		}
		else
		{
			url+='off';
		}
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
				});
	};
}

var pi=new PiServer();
pi.pingSpark();
pi.waterTapControl(true);
