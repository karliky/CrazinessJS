var FFI = require('ffi');
var ref = require('ref');

var user32 = new FFI.Library("user32", {
"FindWindowA": [ "uint32", [ "string", "string" ] ],
"GetAsyncKeyState": [ "int32", ["int32"] ],
"GetWindowThreadProcessId" : ["int32", ['int32','pointer']]
});

var kernel32 = new FFI.Library("kernel32", {
"OpenProcess": [ "int32", [ "int32","int32","int32"] ],
"ReadProcessMemory": [ "int32", [ "int32","int32","pointer","int32","pointer"] ],
"WriteProcessMemory": [ "int32", [ "int32","int32","pointer","int32","pointer"] ],
"CreateToolhelp32Snapshot" : ["int32", ["int32","int32"]],
"CloseHandle" : ["int32", ["int32"]],
"Process32First" : ["int32",["int32","pointer"]],
"GetLastError": [ "int32", [] ],
});

exports.FindWindow = function(hWndText) {
	return user32.FindWindowA(null,hWndText);	
}
exports.CreateToolhelp32Snapshot = function() {
	return kernel32.CreateToolhelp32Snapshot(0x00000002,0);	
}
exports.Process32First = function(hWnd,pointer) {
	var out = pointer;
	kernel32.Process32First(hWnd,out);	
	return out;
}
exports.CloseHandle = function(handle) {
	return kernel32.CloseHandle(handle);	
}
exports.GetWindowThreadProcessId = function(hWndProcess){
	var out = ref.alloc('int');
	user32.GetWindowThreadProcessId(hWndProcess, out);
	return out.deref();
}
exports.OpenProcess = function(processID){
	return kernel32.OpenProcess(2097151,0,processID)
}
exports.ReadPtr = function(processHandle,address,size){
	var out = ref.alloc('int');
	kernel32.ReadProcessMemory(processHandle, address, out , size, null);
	return out.deref();
}
exports.Read = function(processHandle,address,size){
	var out;
	if(size == 4) out = ref.alloc('int');

	if(size == 1) out = ref.alloc('uint');
	
	kernel32.ReadProcessMemory(processHandle, address, out , size, null);
	return out;
}
exports.Write = function(processHandle,address,value,size){
	return kernel32.WriteProcessMemory(processHandle, address, value , size, null);
}
exports.GetAsyncKeyState = function(key){
	return ((user32.GetAsyncKeyState(key) == 0) ? false : true);
}