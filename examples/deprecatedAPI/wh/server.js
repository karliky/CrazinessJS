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

var assembly_code;
var superJumpFreezed = false;
var changeWindow = false;
var chuckNorrisMode = false;
io.sockets.on('connection', function(socket) {
  
  var myProcess = craziness.OpenProcess("WAR.exe");
  var player = [0x00F7611C,0];
  var camera = [0xF76124,0];
  var chuck = [0x00F71B9C,0];
  var basePlayer = craziness.ReadMultiLevelPtr(myProcess,player);
  var baseCamera = craziness.ReadMultiLevelPtr(myProcess,camera);
  var baseChuck = craziness.ReadMultiLevelPtr(myProcess,chuck);
  console.log("Client Connected, process handle:",myProcess)
  
  socket.on("changeCamera",function(data){
    console.log("New camera value",data.value);
    craziness.Write(myProcess,baseCamera + 0x1fc,data.value,"float");
    craziness.Write(myProcess,baseCamera + 0x1fc - 4,data.value,"float");
    craziness.Write(myProcess,baseCamera + 0x1fc + 4,data.value,"float");
  });
  
  socket.on("changeFog",function(data){
    craziness.Write(myProcess,baseCamera + 0x264,data.value,"float");
  });
  
  socket.on("nopFog",function(){
    assembly_code = craziness.Nop(myProcess,0x00473201,8);
    console.log(assembly_code);
  });
  
  socket.on("changeStatus",function(data){
    craziness.Write(myProcess,basePlayer + 0x60,data.value,"int");
  });

  socket.on("changeSpeed",function(data){
    craziness.Write(myProcess,basePlayer + 0x9c,data.value,"float");
  });

  socket.on("changeSuperJump",function(data){
    if( superJumpFreezed ){
      superJumpFreezed = false;
      craziness.unfreeze(basePlayer + 0xac);
    }else{
      superJumpFreezed = true;
      craziness.Write(myProcess,basePlayer + 0xac,800,"float",null,true);
    }
  });

  socket.on("changeWindow",function(){
    if( changeWindow ){
      changeWindow = false;
      craziness.Write(myProcess,baseCamera + 0x1fc + 0x74,1,"float");
    }else{
      changeWindow = true;
      craziness.Write(myProcess,baseCamera + 0x1fc + 0x74,9999,"float");
    }
  });

  socket.on("chuckNorrisMode",function(){
    if( chuckNorrisMode ){
      chuckNorrisMode = false;
      craziness.Write(myProcess,baseChuck + 0x5c,1,"float");
    }else{
      chuckNorrisMode = true;
      craziness.Write(myProcess,baseChuck + 0x5c,9999,"float");
    }
  });

  socket.emit("updateCamera",{ value : craziness.Read(myProcess,baseCamera + 0x1fc).readFloatLE(0)});

  setInterval(function(){
    socket.emit("playerHealth",{health : craziness.Read(myProcess,basePlayer + 0x188).readInt32LE(0), maxHealth : craziness.Read(myProcess,basePlayer + 0x188 + 4).readInt32LE(0)});
  },500);

});

server.listen(3000);


function angleDifference(angle1, angle2){
  if( Math.abs(angle2 - angle1) > Math.PI ){
    return (Math.PI * 2) - Math.abs(angle2 - angle1);
  }else{
    return Math.abs(angle2 - angle1);
  }
}