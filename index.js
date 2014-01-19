var crazyCpp = require('./build/Release/crazy');

(function(){
	
	var Craziness = function(process_name, debug){
			this.debug 				= debug || false;
			this.cpp 		 		= crazyCpp;
			this.processName 		= process_name;

			if(!this.processName)
				throw new Error("Missing process name");

			this.procHandle = this.openProcess(this.processName);
	};	

	Craziness.prototype.setDebugAs = function(bool){
		bool 		= Boolean(bool);
		this.debug 	= bool;
		return this.cpp.setDebugAs(bool);
	};

	Craziness.prototype.openProcess = function(){
		return this.cpp.openProcess.call(this, this.processName);
	};

	/**
	* Reading functions
	*/
	Craziness.prototype.readInt = function(address){
		return this.cpp.readInt(this.procHandle, address);
	};

	Craziness.prototype.readFloat = function(address){
		return this.cpp.readFloat(this.procHandle, address);
	};

	Craziness.prototype.readBool = function(address){
		return this.cpp.readBool(this.procHandle, address);
	};

	Craziness.prototype.readChar = function(address, value){
		return this.cpp.readChar(this.procHandle, address, value);
	};
	
	Craziness.prototype.readUnicodeString = function(address, length){
	/*
		Ok, let me explain this fucking piece of shit-code... basically I shuck at C++ 
		so this is the only way I found to manage unicode in V8-Node.
	*/

		length = parseInt(length) / 2;
		var buff = this.cpp.readUnicodeString(this.procHandle, address, length).toString('utf8', 0, length).split("\u0000");
		return buff.join("").substr(0, length);
	}
	/**
	* Writing functions
	*/
	Craziness.prototype.writeFloat = function(address, value){
		return this.cpp.writeFloat(this.procHandle, address, value);
	};

	Craziness.prototype.writeInt = function(address, value){
		return this.cpp.writeFloat(this.procHandle, address, value);
	};

	Craziness.prototype.writeChar = function(address, value){
		return this.cpp.writeChar(this.procHandle, address, value);
	};

	Craziness.prototype.writeDouble = function(address, value){
		return this.cpp.writeDouble(this.procHandle, address, value);
	};

	Craziness.prototype.writeBool = function(address, value){
		return this.cpp.writeBool(this.procHandle, address, value);
	};

	Craziness.prototype.writeInt64 = function(address, value){
		return this.cpp.writeInt64(this.procHandle, address, value);
	};

	/**
	* Low level methods
	*/
	Craziness.prototype.writeAssembly = function(address, byteArray){
		var assembly = [];
		for (var i = 0; i < byteArray.length; i++) {
			assembly.push(this.readChar(address + i, byteArray[i]));
			this.writeChar(address + i, byteArray[i]);
		};
		return assembly;
	};

	Craziness.prototype.nop = function(address, length){
		var assembly = [];
		for (var i = 0; i < length; i++) {
			assembly.push(this.readChar(address + i, byteArray[i]));
			this.writeChar(address + i, 0x90);
		};
		return assembly;
	};


	Craziness.prototype.read = function(address, type){

		switch(type){
			case "ptr":
			case "int":
				return this.readInt(address);
			break;
			case "float":
				return this.readFloat(address);
			break;
			case "bool":
				return this.readBool(address);
			break;
			case "short":
				return this.readShort(address);
			break;
			case "int64":
				return this.readInt64(address);
			break;
			case "float64":
			case "double":
				return this.readDouble(address);
			break;
		}
		// In case none of the aboves exists, then the type its a string
		var length = 0;
		if(type.indexOf("wchar") >= 0 || type.indexOf("char") >= 0){
			if(type.substr(0,4) == "char"){
				length = type.match(/(\d+)/)[0];
				type = "char";
			}else{
				length = type.match(/(\d+)/)[0];
				type = "wchar";
			}
		}

		switch(type){
			case "char":
				return this.cpp.readCString(address, length);
			break;
			case "wchar":
				return this.readUnicodeString(address, length);
			break;
		}

		return null;
	};

	Craziness.prototype.readStruct = function(base, struct){
        
        var rtn = {};
        var ptr = base;
        for(var prop in struct){
            if(struct[prop].type == "ptr"){
                    rtn[prop] = this.readStruct(this.read(ptr + struct[prop].offset, "ptr"), struct[prop].struct);
            }else if(struct[prop].type == "baseAddress"){
                    rtn[prop] = this.readStruct(ptr + struct[prop].offset, struct[prop].struct);
            }else{
                    rtn[prop] = this.read(ptr + struct[prop].offset, struct[prop].type);
            }
        };
        
        return rtn;
	};

	module.exports = Craziness;

})();