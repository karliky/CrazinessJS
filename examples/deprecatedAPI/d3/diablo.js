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

var myProcess = craziness.OpenProcess("Diablo III")
var myToon = {};
var RACtors = [];
io.sockets.on('connection', function(socket) {
  console.log("New Connection",myProcess);  
  var actors = [0x0186FA3C,0x8c8,0x148,0,0];
  var playerCount = [0x0186FA3C,0x8c8,0x108];
  var actorSizeStruct = 0x42C;
  var baseActors = craziness.ReadMultiLevelPtr(myProcess,actors) + 4;
  var baseCount = craziness.ReadMultiLevelPtr(myProcess,playerCount);
  var actorsTotal = craziness.Read(myProcess,baseCount).readInt32LE(0);

  

  /**
   * Get RACTors
  */
  socket.on('getRACtors', function() {
    var currentOffset = baseActors;
    RACtors = [];
    for (var i = 0; i < actorsTotal; i++) {
      RACtors[i] = []
      RACtors[i].push(currentOffset);
      RACtors[i].push(craziness.Read(myProcess, currentOffset).readInt32LE(0).toString(16).toUpperCase())
      RACtors[i].push(craziness.Read(myProcess, currentOffset + 0x9C).readFloatLE(0))
      RACtors[i].push(craziness.Read(myProcess, currentOffset + 0xA0).readFloatLE(0))
      RACtors[i].push(craziness.Read(myProcess, currentOffset + 0xA4).readFloatLE(0))
      console.log("STRING----");
      //console.log(craziness.Read(myProcess, currentOffset + 0xA4,"string").readCString());

      if(i==4){console.log(RACtors[i][1]);}

      if (RACtors[i][1] == "77BC0000" || RACtors[i][1] == "782B0000" || RACtors[i][1] == "77CB0000") {
        myToon.offset = currentOffset;
        myToon.offsetMain = craziness.Read(myProcess, myToon.offset + 0x380).readInt32LE(0);
        myToon.ClickToMoveToggle = myToon.offsetMain + 0x34;
        myToon.ClickToMoveFix = myToon.offsetMain + 0x20;
        //myToon.data = RACtors[i]
        RACtors[i].push(myToon);
      }
      currentOffset = currentOffset + actorSizeStruct;
    }

    socket.emit('RACtorsList', {
      RACtorsList: RACtors,
      ctmMain: myToon
    });
    RACtors = null;
  })
  /**
   * Move the player around
   */
  socket.on('moveToon', function(data) {

    if(!myToon.offsetMain){ console.log("Toon not found",myToon.offsetMain); return false;}

    var ClickToMoveRotation = myToon.offsetMain + 0x170 + 4;
    var ClickToMoveToX = myToon.offsetMain + 0x3c + 4;
    var ClickToMoveToY = myToon.offsetMain + 0x40 + 4;
    var ClickToMoveToZ = myToon.offsetMain + 0x44 + 4;
    var ClickToMoveCurX = craziness.Read(myProcess, myToon.offsetMain + 0xA8).readFloatLE(0);
    var ClickToMoveCurY = craziness.Read(myProcess, myToon.offsetMain + 0xAC).readFloatLE(0);
    var ClickToMoveCurZ = craziness.Read(myProcess, myToon.offsetMain + 0xB0).readFloatLE(0);


    var _y = ClickToMoveCurX + data.y;
    var _x = ClickToMoveCurY + data.x;
    var _z = ClickToMoveCurZ;

    craziness.Write(myProcess, ClickToMoveToX, _y, 'float');
    craziness.Write(myProcess, ClickToMoveToY, _x, 'float');
    craziness.Write(myProcess, ClickToMoveToZ, _z, 'float');
    craziness.Write(myProcess, myToon.offsetMain + 0x34, 1, 'int');
    craziness.Write(myProcess, myToon.ClickToMoveFix, 69736, 'int')

  });
  /**
   * Stops player movement
   */
  socket.on('stopToon', function(data) {
    if(!myToon.offsetMain){ console.log("stopToon Toon not found",myToon.offsetMain); return false;}

    var ClickToMoveRotation = myToon.offsetMain + 0x170 + 4;
    var ClickToMoveToX = myToon.offsetMain + 0x3c + 4;
    var ClickToMoveToY = myToon.offsetMain + 0x40 + 4;
    var ClickToMoveToZ = myToon.offsetMain + 0x44 + 4;

    var rot = craziness.Read(myProcess, ClickToMoveRotation).readFloatLE(0);
    var ClickToMoveCurX = craziness.Read(myProcess, myToon.offsetMain + 0xA8).readFloatLE(0);
    var ClickToMoveCurY = craziness.Read(myProcess, myToon.offsetMain + 0xAC).readFloatLE(0);
    var ClickToMoveCurZ = craziness.Read(myProcess, myToon.offsetMain + 0xB0).readFloatLE(0);

    craziness.Write(myProcess, ClickToMoveToX, ClickToMoveCurX, 'float');
    craziness.Write(myProcess, ClickToMoveToY, ClickToMoveCurY, 'float');
    craziness.Write(myProcess, ClickToMoveToZ, ClickToMoveCurZ, 'float');
    craziness.Write(myProcess, myToon.ClickToMoveToggle, 1, 'int');
    setTimeout(function(){
      craziness.Write(myProcess, ClickToMoveRotation, rot, 'float');
    },100);
  })

  socket.on('sendkey', function(data) {
    craziness.sendKey("keyboard",data.key);
  });

});

server.listen(3000);