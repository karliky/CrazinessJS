Craziness JS
=============
Memory management through JavaScript.

##Exports

Craziness.OpenProcess(processText);
Craziness.Write(processHandle,ptr,value,type,size,freeze);
Craziness.Read(process,ptr,size);
Craziness.Nop(processHandle,ptr,numBytes);
Craziness.ReadMultiLevelPtr(process,offsets);
Craziness.listenKey(key);
Craziness.sendKey(target,keyCode);
Craziness.between(angl,first,last);
Craziness.listenKeys(key,callback);
Craziness.radiansToDegrees(radians);
Craziness.degreesToRadians(degrees);
Craziness.unfreeze(ptr);
Craziness.setWindowOnTop(windowName);
Craziness.version = 0.1
Craziness.timeToFreeze = 40;
Craziness.interval = null;
Craziness.freezedValues = [];

##Contribute
Craziness JS is still on alpha development, if you want to help me please e-mail me karliky [at] gmail.com or tweet me @k4rliky