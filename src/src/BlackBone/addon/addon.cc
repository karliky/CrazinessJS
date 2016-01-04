#include <iostream>
#include <nan.h>
#include <string>
#include <sstream>

#include "../Config.h"
#include "../Process/Process.h"

using namespace blackbone;

/// Take this proc outside
/// functions so we can reuse it
Process proc;

bool debugMode = false;

void setDebugMode(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  bool mode = info[0]->BooleanValue();
  debugMode = mode;
  info.GetReturnValue().Set(debugMode);
}

void __log(std::string text) {
  std::cout << "## " << text << std::endl;
}

void searchProcess(const Nan::FunctionCallbackInfo<v8::Value>& info) {

  LPCWSTR processName = (LPCWSTR) * v8::String::Value(info[0]->ToString());

  if (debugMode) __log("Searching for process...");

  std::vector<DWORD> found;
  Process::EnumByName( processName, found );

  if (found.size() > 0)
  {
      if (debugMode) {
        __log("Process Found. Attaching to process:");
        std::stringstream sText;
        sText << found.front();
        __log(sText.str());
      }

      if (proc.Attach( found.front() ) != STATUS_SUCCESS)
      {
        if (debugMode) {
          __log("Can't attach to process, status code:");
          std::stringstream sText;
          sText << LastNtStatus();
          __log(sText.str());
        }
          return;
      }

      info.GetReturnValue().Set(true);
  } else {
    info.GetReturnValue().SetUndefined();
  }

}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("searchProcess").ToLocalChecked(),
	  Nan::New<v8::FunctionTemplate>(searchProcess)->GetFunction());
  exports->Set(Nan::New("setDebugMode").ToLocalChecked(),
  	Nan::New<v8::FunctionTemplate>(setDebugMode)->GetFunction());
}

NODE_MODULE(BlackBone, Init)
