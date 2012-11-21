Craziness JS
=============
Memory management through JavaScript.

##Install
Make sure you've installed all the necessary [build tools for Windows](https://github.com/TooTallNate/node-gyp#installation), then invoke:
 ```javascript
npm install craziness
 ```
As the documentation has not been finished yet, please take a look at the folder /examples to know how to start with Craziness.
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

Craziness.version = "0.0.1";

##Contribute
Craziness JS is still on alpha development, if you want to help me please e-mail me karliky [at] gmail.com or tweet me @k4rliky

###LICENSE
Copyright (C) <2012> <@k4rliky>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.