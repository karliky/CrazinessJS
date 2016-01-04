#include <iostream>
#include <nan.h>
#include <string>

#include "../Config.h"
#include "../Process/Process.h"

using namespace blackbone;

/// Take this proc outside
/// functions so we can reuse it
Process proc;

void searchProcess(const Nan::FunctionCallbackInfo<v8::Value>& info) {

  LPCWSTR processName = (LPCWSTR) * v8::String::Value(info[0]->ToString());

  std::wcout << L"\r\nSearching for process...\n";

  std::vector<DWORD> found;
  Process::EnumByName( processName, found );

  if (found.size() > 0)
  {
      std::wcout << L"\nProcess Found. Attaching to process " << std::dec << found.front() << std::endl;

      if (proc.Attach( found.front() ) != STATUS_SUCCESS)
      {
          std::wcout << L"\nCan't attach to process, status code " << LastNtStatus() << " aborting\n\n";
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
}

NODE_MODULE(BlackBone, Init)
