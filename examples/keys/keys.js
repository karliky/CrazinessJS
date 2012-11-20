var express = require("express"),
app = express(),
craziness = require("craziness"),
http = require("http"),
path = require('path'),
sleep = require('sleep');

server = http.createServer(app);
var io = require('socket.io').listen(server);

io.set('log level', 0);

app.use(express.static(__dirname + '/'));

io.sockets.on('connection', function(socket) {
  socket.on("check",function(){

  });
});

server.listen(3000);

var keys = {
  listen :  function(key,callback){
    if(typeof key == "number"){
      while(true){
        var result = craziness.listenKey(key);
        if(result){
          callback(result);
        }
        sleep.sleep(0.1);
      }
    }else{
      console.log("Comprobando teclas");
      while(true){
        var allPressed = true;
        for (var i = key.length - 1; i >= 0; i--) {
          if(craziness.listenKey(key[i])){allPressed = true;}else{ allPressed = false; break; }
        };
        if(allPressed){
          callback(allPressed);
        }
        sleep.sleep(0.1);
      }
    }
  }
}

keys.listen([0x11,0x31],function(result){
  console.log("Callback working: ",result);
});