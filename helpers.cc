#include <node.h>
#include <v8.h>
#include <windows.h>
#include <tlhelp32.h>
#include <tchar.h>
#include <iostream>
#include <string>

using namespace v8;
using namespace std;
static inline char *TO_CHAR(Handle<Value> val) {
    String::Utf8Value utf8(val->ToString());

    int len = utf8.length() + 1;
    char *str = (char *) calloc(sizeof(char), len);
    strncpy(str, *utf8, len);

    return str;
}

Handle<Value> getProcessByName(const Arguments& args) {
	HandleScope scope;
	HANDLE hProcessSnap;
	HANDLE hProcess;
	PROCESSENTRY32 pe32;
	DWORD dwPriorityClass;
	char *processName = TO_CHAR(args[0]->ToString());

	hProcessSnap = CreateToolhelp32Snapshot( TH32CS_SNAPPROCESS, 0 );
	pe32.dwSize = sizeof( PROCESSENTRY32 );
	Process32First( hProcessSnap, &pe32 );
	do
	{
	if (strcmp(processName,pe32.szExeFile) == 0){
		return scope.Close(Number::New(pe32.th32ProcessID));
	}
	} while( Process32Next( hProcessSnap, &pe32 ) );

	CloseHandle( hProcessSnap );

	return scope.Close(String::New(""));
}
Handle<Value> setWindowOnTop(const Arguments& args) {
	char *WindowName = TO_CHAR(args[0]->ToString());
	HWND hwnd = FindWindow(NULL,TEXT(WindowName)); 
	HandleScope scope;
	SetWindowPos( hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE );
	return scope.Close(String::New(""));
}


Handle<Value> sendKey(const Arguments& args) {

	HandleScope scope;
	INPUT ip;
	char *target = TO_CHAR(args[0]->ToString());
	Local<Number> keyCode = Local<Number>::Cast(args[1]);

	if (strcmp(target,"keyboard") == 0){
		ip.type = INPUT_KEYBOARD;
		std::cout << "KEYBOARD! \n" << ip.type;
		ip.ki.dwFlags = 0;
	}else if(strcmp(target,"mouse") == 0){
		ip.type = INPUT_MOUSE;
		std::cout << "MOUSE! \n" << ip.type;
		ip.ki.dwFlags = MOUSEEVENTF_RIGHTDOWN;
	}

	ip.ki.wScan = 0;
	ip.ki.time = 0;
	ip.ki.dwExtraInfo = 0;
	ip.ki.wVk = ((double)keyCode->Value());
	SendInput(1, &ip, sizeof(INPUT));
	ip.ki.dwFlags = KEYEVENTF_KEYUP;
	SendInput(1, &ip, sizeof(INPUT));

	return scope.Close(String::New(""));
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("getProcessByName"), FunctionTemplate::New(getProcessByName)->GetFunction());
  target->Set(String::NewSymbol("setWindowOnTop"), FunctionTemplate::New(setWindowOnTop)->GetFunction());
  target->Set(String::NewSymbol("sendKey"), FunctionTemplate::New(sendKey)->GetFunction());
}
NODE_MODULE(helpers, init)