var express = require("express"),
app = express(),
craziness = require("craziness"),
http = require("http"),
path = require('path'),
sleep = require('sleep');

server = http.createServer(app);
var io = require('socket.io').listen(server);
var pi = Math.PI;
io.set('log level', 0);

app.use(express.static(__dirname + '/'));

io.sockets.on('connection', function(socket) {
  console.log("Client connected");
  var myProcess = craziness.OpenProcess("Warhammer: Age of Reckoning, Version 1.4.7, Copyright 2001-2012 Electronic Arts, Inc.");
  var cameraBase = [0xF76124,0];
  var base = craziness.ReadMultiLevelPtr(myProcess,cameraBase);

  socket.on("moveCamera",function(data){
    craziness.Write(myProcess,base + 0xac,craziness.Read(myProcess,base + 0xac).readFloatLE(0) + (data.x / 5),"float");
    craziness.Write(myProcess,base + 0xb0,craziness.Read(myProcess,base + 0xb0).readFloatLE(0) + (data.y / 5),"float");
  });

  socket.on("rotCamera",function(data){

    var currentRotx = craziness.Read(myProcess,base + 0xac).readFloatLE(0);
    var currentRoty = craziness.Read(myProcess,base + 0xb0).readFloatLE(0);
    var currentRotz = craziness.Read(myProcess,base + 0xb4).readFloatLE(0);
    console.log("Moviendo cámara "+data.direction,currentRotx,currentRoty,currentRotz);
    switch (data.direction)
    {
    case "top":
      craziness.Write(myProcess,base + 0xa4,currentRotz - 5000,"float");
      break;
    case "right":
      craziness.Write(myProcess,base + 0xa0,currentRotx + 5000,"float");
      break;
    case "left":
      craziness.Write(myProcess,base + 0xa0,currentRoty - 5000,"float");
      break;
    case "bottom":
      craziness.Write(myProcess,base + 0xa4,currentRotz + 5000,"float");
      break;
    }

  });
  	
});
server.listen(3000);