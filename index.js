/** 
 * CrazinessJS, Memory Management through JavaScript
 * 
 * Description: Global namespace is "Craziness"
 *
 * @author Carlos Hernández Gómez || @k4rliky
 */
var windowsApi = require('./windowsApi.js');
var Craziness = {}
var FFI = require('ffi');
var ref = require('ref');
var sleep = require('sleep');
var crazinessCPP = require('./build/Release/helpers');
Craziness.version = 0.1
Craziness.timeToFreeze = 40;
Craziness.interval = null;
Craziness.freezedValues = [];
/*
** Opens an existing local process object.
*
* @method OpenProcess
*
* @param {string} lpWindowName The window name (the window's title)
*/
exports.OpenProcess = function(processText){
	var process , processId, hProcessSnap;

	if(processText.indexOf(".exe") != -1){
		processId = crazinessCPP.getProcessByName( processText );
		return windowsApi.OpenProcess( processId );
	}else{
		process = windowsApi.FindWindow( processText );
		if(process != 0){
			processId = windowsApi.GetWindowThreadProcessId( process );
			if(processId != 0){
				return windowsApi.OpenProcess( processId );
			}else{
				return false
			}
		}else{
			return false
		}
	}
}
/**
* Writes memory from ptr
*
* @method Write
*
* @param {int} A handle to the process
* @param {array} An array with pointer address structure
*/
exports.Write = function(processHandle,ptr,value,type,size,freeze) {
	var size = size || 4
	var val = new Buffer(size);
	switch(type)
	{
	case "int":
	  val.writeInt32LE(parseInt(value),0);
	  break;
	case "float":
	  val.writeFloatLE(parseFloat(value),0);
	  break;
	default:
	  val.writeInt32LE(value,0);
	}
	if(freeze){
		Craziness.freezedValues[ptr] = true;
		Craziness.interval = setInterval(function(){
			if( Craziness.freezedValues[ptr] ){
				windowsApi.Write(processHandle, ptr,val, size);
			}else{
				clearInterval(Craziness.interval);
			}
		},Craziness.timeToFreeze);
	}else{
		return windowsApi.Write(processHandle, ptr,val, size);
	}
}
/**
* Reads memory from ptr
*
* @method Read
*
* @param {int} A handle to the process
* @param {int} A pointer address
* @param {int} Size of bytes to read (Defaults to 0x4)
*/
exports.Read = function(process,ptr,size) {
	var size = size || 4;
	return windowsApi.Read(process, ptr, size);
}
exports.Nop = function(processHandle,ptr,numBytes){
	var valRtrn = new Buffer(numBytes);
	var ptrOriginal = ptr;
	for (var i=0 ; i < numBytes ; i++){
		valRtrn.writeUInt8(windowsApi.Read(processHandle, ptr, 1).readUInt8(0),i);
		ptr +=1;
	}
	
	var val = new Buffer(numBytes);
	for (var i=0 ; i < numBytes ; i++){
		val.writeUInt8(144,i); // 144 == 0x90 and 0x90 == NOP
	}
	windowsApi.Write(processHandle, ptrOriginal,val, numBytes);

	return valRtrn;
}
/**
* Find pointers address
*
* @method ReadMultiLevelPtr
*
* @param {int} A handle to the process
* @param {array} An array with pointer address structure
*/
exports.ReadMultiLevelPtr = function(process,offsets) { 
   var Address = offsets[0]; 
   var offset = 0; 
   for (var i = 1; i < offsets.length; i++) 
	  
   { 	
      Address = windowsApi.ReadPtr(process, Address, 4)
      Address += offsets[i]; 
   } 
   return Address; 
}

/**
* Checks for keystroke
* http://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
* http://msdn.microsoft.com/en-us/library/windows/desktop/ms646293(v=vs.85).aspx
*/
exports.listenKey = function(key) {
	return windowsApi.GetAsyncKeyState(key);
}
exports.sendKey = function(target,keyCode){
	target = target || "keyboard"
	crazinessCPP.sendKey(target,keyCode);
}
exports.between = function(angl,first,last){
    return (first < last ? angl >= first && angl <= last : angl >= last && angl <= first);
}

exports.listenKeys =  function(key,callback){
    if(typeof key == "number"){
      setInterval(function(){
      	var result = exports.listenKey(key);
        if(result){
          callback(result);
        }
    },50);
    }else{
      setInterval(function(){
        var allPressed = false;
        for (var i = key.length - 1; i >= 0; i--) {
          if(exports.listenKey(key[i])){allPressed = true;}else{ allPressed = false; break; }
        };
        if(allPressed){
          callback(allPressed);
        }
      },50);
  }
}

exports.radiansToDegrees = function(radians){
	return radians * (180/Math.PI);
}

exports.degreesToRadians = function(degrees){
	return degrees * (Math.PI/180);
}
exports.unfreeze = function(ptr){
	Craziness.freezedValues[ptr] = false;
}
exports.setWindowOnTop = function(){
	setTimeout(function(){
		crazinessCPP.setWindowOnTop("Crazy Example");
	},100);
}
exports.Craziness = Craziness;