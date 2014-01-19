#include <node.h>
#include <node_buffer.h>
#include <v8.h>
#include <cstdlib>
#include <stdlib.h>
#include <windows.h>
#include <string.h>
#include <wchar.h>

#pragma comment(lib,"user32.lib") 

using namespace v8;
using namespace node;
using namespace std;

bool debugEnabled = false;

const char* ToCString(const v8::String::Utf8Value& value) {
  return *value;
}

Handle<Value> setDebugAs(const Arguments& args)
{
	HandleScope scope;

	if(args[0]->IsBoolean()){
		debugEnabled = args[0]->BooleanValue();
	}

	return scope.Close(v8::Boolean::New(debugEnabled));
}

Handle<Value> openProcess(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsString()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a string")));
      	
    v8::String::Utf8Value processNameStr(args[0]);
    const char* processName = ToCString(processNameStr);

    if(debugEnabled)
 	printf("Craziness::openProcess -> %s\n",processName);

 	HWND hWnd = FindWindow(NULL, processName);
 	if(hWnd == NULL){
 		if(debugEnabled)
 			printf("Craziness::openProcess -> Can't find window\n");
 		return scope.Close(v8::Null());
 	}

 	if(debugEnabled)
 	printf("Craziness::openProcess -> hWnd %d\n",hWnd);

	DWORD proc_id;
	GetWindowThreadProcessId(hWnd, &proc_id);
	
	if(debugEnabled)
	printf("Craziness::openProcess -> proc_id %d\n",proc_id);

	HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, 0, proc_id);
 	if(hProcess == NULL){
 		if(debugEnabled)
 		printf("openProcess -> Can't open process\n");
 		return scope.Close(v8::Null());
 	}
 	if(debugEnabled)
 	printf("Craziness::openProcess -> hProcess %d\n",hProcess);

	return scope.Close(Number::New( (int)hProcess ));
}

Handle<Value> readInt(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	int rtnValue = 0;
    
	if(debugEnabled)
	printf("Craziness::readInt -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readInt -> Got value: %d \n", rtnValue);

	return scope.Close(Number::New(rtnValue));
}

Handle<Value> readUint(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	unsigned int rtnValue = 0;
    
	if(debugEnabled)
	printf("Craziness::readUint -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readUint -> Got value: %d \n", rtnValue);

	return scope.Close(Number::New(rtnValue));
}

Handle<Value> readShort(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

    v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);

	short rtnValue = 0;

	if(debugEnabled)
	printf("Craziness::readShort -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readShort -> Got value: %d\n",  rtnValue);

	return scope.Close(Number::New(rtnValue));
}


Handle<Value> readChar(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

    v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);

	signed char rtnValue = 0;

	if(debugEnabled)
	printf("Craziness::readChar -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readChar -> Got value: %d\n",  rtnValue);

	return scope.Close(Number::New(rtnValue));
}

Handle<Value> readBool(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

    v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);

	bool rtnValue = 0;

	if(debugEnabled)
	printf("Craziness::readBool -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readBool -> Got value: %d\n",  rtnValue);

	return scope.Close(v8::Boolean::New(rtnValue));
}

Handle<Value> readInt64(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	__int64 rtnValue = 0;
    
	if(debugEnabled)
	printf("Craziness::readInt64 -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readInt64 -> Got value: %I64d \n", rtnValue);

	return scope.Close(Number::New(rtnValue));
}

Handle<Value> readFloat(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	float rtnValue = 0;
    
	if(debugEnabled)
	printf("Craziness::readFloat -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readFloat -> Got value: %.16f \n", rtnValue);

	return scope.Close(Number::New(rtnValue));
}

Handle<Value> writeFloat(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	float writeValue = args[2]->NumberValue();
    
	if(debugEnabled)
	printf("Craziness::writeFloat -> Writing value %f into memory address 0x%0.2I64X\n", writeValue, memoryAddress);

	WriteProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&writeValue,sizeof(writeValue),0);

	return scope.Close( Null() );
}

Handle<Value> writeInt(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	int writeValue = args[2]->NumberValue();
    
	if(debugEnabled)
	printf("Craziness::writeInt -> Writing value %d into memory address 0x%0.2I64X\n", writeValue, memoryAddress);

	WriteProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&writeValue,sizeof(writeValue),0);

	return scope.Close( Null() );
}

Handle<Value> writeChar(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	signed char writeValue = args[2]->NumberValue();
    
	if(debugEnabled)
	printf("Craziness::writeChar -> Writing value %d into memory address 0x%0.2I64X\n", writeValue, memoryAddress);

	WriteProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&writeValue,sizeof(writeValue),0);

	return scope.Close( Null() );
}

Handle<Value> readDouble(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);
	double rtnValue = 0;
    
	if(debugEnabled)
	printf("Craziness::readDouble -> Reading memory from 0x%0.2I64X address\n", memoryAddress);

	ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,&rtnValue,sizeof(rtnValue),0);

	if(debugEnabled)
	printf("Craziness::readDouble -> Got value: %.16f \n", rtnValue);

	return scope.Close(Number::New(rtnValue));
}

Handle<Value> readCString(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

    if (!args[2]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[2] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    int bytesToRead = args[2]->Int32Value();

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);

    char* rtnValue = new char[bytesToRead];
	
	if(debugEnabled)
	printf("Craziness::readCString -> Reading memory from 0x%0.2I64X %d address\n", memoryAddress, bytesToRead);


	if (!ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,rtnValue,bytesToRead + 1,NULL))
	{
		DWORD dw = GetLastError(); 
		printf("ERROR!!! %d ",dw);
	}

	if(debugEnabled)
	printf("Craziness::readCString -> Got value: %s \n", rtnValue);

	return scope.Close(String::New(rtnValue));
}


Handle<Value> readUnicodeString(const Arguments& args) {
	HandleScope scope;

	if (!args[0]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[0] must be a number")));

    if (!args[1]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[1] must be a number")));

    if (!args[2]->IsNumber()) 
        return ThrowException(Exception::TypeError(String::New("arg[2] must be a number")));

	v8::String::Utf8Value procHandle(args[0]);
    const char* procHandleChar = ToCString(procHandle);

	v8::String::Utf8Value procMemAddres(args[1]);
    const char* int64ToChar = ToCString(procMemAddres);

    __int64 processHandle = _atoi64(procHandleChar);
	__int64 memoryAddress = _atoi64(int64ToChar);

	wchar_t *buff;
	size_t length = args[2]->Int32Value();
    buff = (wchar_t *)malloc(length); 
	

	if(debugEnabled)
	printf("Craziness::readUnicodeString -> Reading memory from 0x%0.2I64X Size: %d address\n", memoryAddress, length);


	if (!ReadProcessMemory((HANDLE*)processHandle,(void*)memoryAddress,buff,length,NULL))
	{
		DWORD dw = GetLastError(); 
		printf("ERROR!!! %d ",dw);
	}

	if(debugEnabled)
	wprintf(L"Craziness::readUnicodeString -> Got value: %ls \n", buff);

	Buffer *buff_node = Buffer::New(length);
	memcpy(Buffer::Data(buff_node), buff, length);
	free(buff);
	return scope.Close(buff_node->handle_);
}

void init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("setDebugAs"), FunctionTemplate::New(setDebugAs)->GetFunction());
  exports->Set(String::NewSymbol("readCString"), FunctionTemplate::New(readCString)->GetFunction());
  exports->Set(String::NewSymbol("readUnicodeString"), FunctionTemplate::New(readUnicodeString)->GetFunction());
  exports->Set(String::NewSymbol("readBool"), FunctionTemplate::New(readBool)->GetFunction());
  exports->Set(String::NewSymbol("readShort"), FunctionTemplate::New(readShort)->GetFunction());
  exports->Set(String::NewSymbol("readChar"), FunctionTemplate::New(readChar)->GetFunction());
  exports->Set(String::NewSymbol("readFloat"), FunctionTemplate::New(readFloat)->GetFunction());
  exports->Set(String::NewSymbol("writeFloat"), FunctionTemplate::New(writeFloat)->GetFunction());
  exports->Set(String::NewSymbol("writeInt"), FunctionTemplate::New(writeInt)->GetFunction());
  exports->Set(String::NewSymbol("writeChar"), FunctionTemplate::New(writeChar)->GetFunction());
  exports->Set(String::NewSymbol("readDouble"), FunctionTemplate::New(readDouble)->GetFunction());
  exports->Set(String::NewSymbol("readInt"), FunctionTemplate::New(readInt)->GetFunction());
  exports->Set(String::NewSymbol("readInt64"), FunctionTemplate::New(readInt64)->GetFunction());
  exports->Set(String::NewSymbol("openProcess"), FunctionTemplate::New(openProcess)->GetFunction());
}

NODE_MODULE(crazy, init)