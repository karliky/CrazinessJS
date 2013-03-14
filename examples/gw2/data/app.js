var appjs = require('appjs'),
express = require("express"),
app = express(),
craziness = require("craziness"),
http =      require("http"),
path =      require('path'),
sleep =     require('sleep'),
server =    http.createServer(app),
io =        require('socket.io').listen(server);

io.set('log level', 0);

appjs.serveFilesFrom(__dirname + '/content');

var statusIcon = appjs.createStatusIcon({
  icon:'./data/content/icons/32.png',
  tooltip:'Crazy example'
});

var window = appjs.createWindow({
  width  : 210,
  showChrome : false,
  alpha: true,
  top: 0,
  left: 0,
  height : 210,
  icons  : __dirname + '/content/icons'
});

window.on('create', function(){
  window.frame.show();
  window.frame.center();
});

window.on('ready', function(){
  window.process = process;
  window.module = module;

  function F12(e){ return e.keyIdentifier === 'F12' }
  function Command_Option_J(e){ return e.keyCode === 74 && e.metaKey && e.altKey }
  craziness.setWindowOnTop("Crazy example");
  window.addEventListener('keydown', function(e){
    if (F12(e) || Command_Option_J(e)) {
      window.frame.openDevTools();
    }
  });
});

window.on('close', function(){
  
});

io.sockets.on('connection', function(socket) {
  var myProcess = craziness.OpenProcess("Guild Wars 2");
  console.log("My process",myProcess);
  var playerVisualBase = [0x0163DBD4,0x44,0x1c,0x5c,0];
  var playerRealBase = [0x0163DBD4,0x44,0x1c,0x88,0];
  var superJumpFreezed = false;
  var noClipFreezed = false;
  var mapeditor = false;
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
    socket.emit("infoList",{coords : [x,y,z],jump:superJumpFreezed,noclip:noClipFreezed});
  },40);

  craziness.listenKeys([0x11,0x01],function(){
   teleport(myProcess,playerVisualBase,playerRealBase);
  });

  /*MAPEDITOR
  This is a proof of concept, offsets are dynamics so you won't be able to use.
  */
  var mapInterval = null;
  craziness.listenKeys([0x12,0x43],function(){
   if( mapeditor ){
      mapeditor = false;
      clearInterval(mapInterval);
      /*
      -2544.473389
      12394.40234
      -3362.511963
      */
      sleep.sleep(0.2);
    }else{
      mapeditor = true;
      
      mapInterval = setInterval(function(){
        var destino = {
            x : craziness.Read(myProcess,0x0170EA88).readFloatLE(0),
            y : craziness.Read(myProcess,0x0170EA88 + 4).readFloatLE(0),
            z : craziness.Read(myProcess,0x0170EA88 + 8).readFloatLE(0)
        }

        if(destino.x.toString() == "Infinity") { return false; }

        console.log(destino);
        craziness.Write(myProcess,0x11054E7C,destino.x,"float");
        craziness.Write(myProcess,0x11054E8C,destino.y,"float");
        craziness.Write(myProcess,0x11054E9C,destino.z,"float");
      },50);
      
      sleep.sleep(0.2);
    }
  });
  craziness.listenKeys([0x12,0x5A],function(){
   if( superJumpFreezed ){
      superJumpFreezed = false;
      craziness.unfreeze(playerVisualBase + 0x7c);
      sleep.sleep(0.2);
    }else{
      superJumpFreezed = true;
      craziness.Write(myProcess,playerVisualBase + 0x7c,5,"float",null,true);
      sleep.sleep(0.2);
    }
  });
  craziness.listenKeys([0x12,0x58],function(){
   if( noClipFreezed ){
      noClipFreezed = false;
      craziness.unfreeze(playerRealBase + 0xc8);
      sleep.sleep(0.2);
      craziness.Write(myProcess,playerRealBase + 0xc8,1,"float");
    }else{
      noClipFreezed = true;
      craziness.Write(myProcess,playerRealBase + 0xc8,-1,"float",null,true);
      sleep.sleep(0.2);
    }
  });
});

server.listen(3000);



function teleport(myProcess,playerVisualBase,playerRealBase){
  var destino = {
      x : craziness.Read(myProcess,0x0170EA88).readFloatLE(0) / 32,
      y : craziness.Read(myProcess,0x0170EA88 + 4).readFloatLE(0) / 32,
      z : Math.abs(craziness.Read(myProcess,0x0170EA88 + 8).readFloatLE(0) / 32)
  }
  
  if(destino.x.toString() == "Infinity") { craziness.Write(myProcess,0x01710394,0,"int"); return false; }

  while (true){
    craziness.Write(myProcess,playerRealBase + 0xc8,-1,"float"); // No clip
    craziness.Write(myProcess,0x01710394,1,"int");
    var playerPos = {
      xVisual : craziness.Read(myProcess,playerVisualBase + 0xb4).readFloatLE(0),
      yVisual : craziness.Read(myProcess,playerVisualBase + 0xb8).readFloatLE(0),
      zVisual : craziness.Read(myProcess,playerVisualBase + 0xbc).readFloatLE(0),
      xReal : craziness.Read(myProcess,playerRealBase + 0xD0).readFloatLE(0),
      yReal : craziness.Read(myProcess,playerRealBase + 0xD4).readFloatLE(0),
      zReal : craziness.Read(myProcess,playerRealBase + 0xD8).readFloatLE(0)
    }
    craziness.Write(myProcess,0x01710394,0,"int");
    

    var dx= destino.x - playerPos.xVisual;
    var dy= destino.y - playerPos.yVisual;
    var dz= destino.z - playerPos.zVisual;
    var v = 0.4;

    var dist = Math.sqrt(dx*dx+dy*dy+dz*dz);

    if(dist<=v) {
      console.log("Hemos llegado al punto, salimos del bucle infinito.");
      craziness.Write(myProcess,playerRealBase + 0xc8,1,"float"); // No clip

      craziness.Write(myProcess,playerVisualBase + 0xbc,playerPos.zVisual +10,"float");
      craziness.Write(myProcess,playerRealBase + 0xD8,playerPos.zVisual +10,"float");
      
      craziness.Write(myProcess,0x01710394,0,"int");
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