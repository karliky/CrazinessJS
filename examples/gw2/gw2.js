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


  var myProcess = craziness.OpenProcess("Guild Wars 2");
  var playerVisualBase = [0x015E3548,0x44,0x1c,0x5c,0];
  var playerRealBase = [0x015E3548,0x44,0x1c,0x88,0];

  var playerVisualBase = craziness.ReadMultiLevelPtr(myProcess,playerVisualBase);
  var playerRealBase = craziness.ReadMultiLevelPtr(myProcess,playerRealBase);

  setInterval(function(){
    var cos = craziness.Read(myProcess,playerVisualBase + 0x94).readFloatLE(0);
    var sin = craziness.Read(myProcess,playerVisualBase + 0x98).readFloatLE(0);
    var result = Math.atan2(cos,sin) * (180 / Math.PI);
    if(result < 0) result += 360;
    socket.emit("rotation",{data : result});
    var x = craziness.Read(myProcess,playerRealBase + 0xd0).readFloatLE(0);
    var y = craziness.Read(myProcess,playerRealBase + 0xd4).readFloatLE(0);
    var z = craziness.Read(myProcess,playerRealBase + 0xd8).readFloatLE(0);
    console.log(x,y,z);
    socket.emit("infoList",{coords : []});
  },10);

  /*craziness.listen([0x11,0x01],function(){
   teleport(myProcess,playerVisualBase,playerRealBase)
  });*/

});

server.listen(3000);

function teleport(myProcess,playerVisualBase,playerRealBase){
  var destino = {
      x : craziness.Read(myProcess,0x016B3628).readFloatLE(0) / 32,
      y : craziness.Read(myProcess,0x016B3628 + 4).readFloatLE(0) / 32,
      z : Math.abs(craziness.Read(myProcess,0x016B3628 + 8).readFloatLE(0) / 32)
    }
  
  if(destino.x.toString() == "Infinity") { 
    craziness.Write(myProcess,0x016A5548,0,"int"); return false; 
  }

  while (true){
    craziness.Write(myProcess,playerRealBase + 0xc8,-1,"float"); // No clip
    craziness.Write(myProcess,0x016B4E98,1,"int");
    var playerPos = {
      xVisual : craziness.Read(myProcess,playerVisualBase + 0xb4).readFloatLE(0),
      yVisual : craziness.Read(myProcess,playerVisualBase + 0xb8).readFloatLE(0),
      zVisual : craziness.Read(myProcess,playerVisualBase + 0xbc).readFloatLE(0),
      xReal : craziness.Read(myProcess,playerRealBase + 0xD0).readFloatLE(0),
      yReal : craziness.Read(myProcess,playerRealBase + 0xD4).readFloatLE(0),
      zReal : craziness.Read(myProcess,playerRealBase + 0xD8).readFloatLE(0)
    }
    craziness.Write(myProcess,0x016B4E98,0,"int");
    

    var dx= destino.x - playerPos.xVisual;
    var dy= destino.y - playerPos.yVisual;
    var dz= destino.z - playerPos.zVisual;
    var v = 0.3;

    var dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
    console.log("Distance",dist);

    if(dist<=v) {
      console.log("Hemos llegado al punto, salimos del bucle infinito.");
      craziness.Write(myProcess,playerRealBase + 0xc8,1,"float"); // No clip

      craziness.Write(myProcess,playerVisualBase + 0xbc,playerPos.zVisual +10,"float");
      craziness.Write(myProcess,playerRealBase + 0xD8,playerPos.zVisual +10,"float");
      
      craziness.Write(myProcess,0x016B4E98,0,"int");
      break;
    } else {
      craziness.Write(myProcess,playerVisualBase + 0xb4,playerPos.xVisual + (v*dx/dist),"float");
      craziness.Write(myProcess,playerVisualBase + 0xb8,playerPos.yVisual + (v*dy/dist),"float");
      craziness.Write(myProcess,playerVisualBase + 0xbc,playerPos.zVisual + (v*dz/dist),"float");

      craziness.Write(myProcess,playerRealBase + 0xD0,playerPos.xVisual + (v*dx/dist),"float");
      craziness.Write(myProcess,playerRealBase + 0xD4,playerPos.yVisual + (v*dy/dist),"float");
      craziness.Write(myProcess,playerRealBase + 0xD8,playerPos.zVisual + (v*dz/dist),"float");
    }
    
  };
  craziness.Write(myProcess,playerRealBase + 0xc8,1,"float"); // No clip
}