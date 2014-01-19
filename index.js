var craziness = {
	cpp : require('./build/Release/crazy')
}

craziness.setDebugAs = function(bool){
	return craziness.cpp.setDebugAs(bool);
};

craziness.openProcess = function(processName){
	return craziness.cpp.openProcess.call(this, processName);
}
craziness.readInt = function(processHandle, address){
	return craziness.cpp.readInt(processHandle, address);
}
craziness.readFloat = function(processHandle, address){
	return craziness.cpp.readFloat(processHandle, address);
}
craziness.readBool = function(processHandle, address){
	return craziness.cpp.readBool(processHandle, address);
}
craziness.writeFloat = function(processHandle, address, value){
	return craziness.cpp.writeFloat(processHandle, address, value);
}
craziness.writeInt = function(processHandle, address, value){
	return craziness.cpp.writeFloat(processHandle, address, value);
}
craziness.writeChar = function(processHandle, address, value){
	return craziness.cpp.writeChar(processHandle, address, value);
}
craziness.readChar = function(processHandle, address, value){
	return craziness.cpp.readChar(processHandle, address, value);
}
craziness.readUnicodeString = function(processHandle, address, length){
	/*
		Ok, let me explain this fucking piece of shit-code... basically I shuck at C++ 
		so this is the only way I found to manage unicode in V8-Node.
	*/

	length = parseInt(length) / 2;
	var buff = craziness.cpp.readUnicodeString(processHandle, address, length).toString('utf8', 0, length).split("\u0000");
	return buff.join("").substr(0, length);
}
craziness.writeAssembly = function(processHandle, address, byteArray){
	var assembly = [];
	for (var i = 0; i < byteArray.length; i++) {
		assembly.push(craziness.readChar(processHandle, address + i, byteArray[i]).toHex());
		craziness.writeChar(processHandle, address + i, byteArray[i]);
	};
	return assembly;
}
craziness.nop = function(processHandle, address, length){
	var assembly = [];
	for (var i = 0; i < length; i++) {
		assembly.push(craziness.readChar(processHandle, address + i, byteArray[i]).toHex());
		craziness.writeChar(processHandle, address + i, 0x90);
	};
	return assembly;
}
craziness.read = function(processHandle, address, type){

	switch(type){
		case "ptr":
		case "int":
			return craziness.readInt(processHandle, address);
		break;
		case "float":
			return craziness.readFloat(processHandle, address);
		break;
		case "bool":
			return craziness.readBool(processHandle, address);
		break;
		case "short":
			return craziness.readShort(processHandle, address);
		break;
		case "int64":
			return craziness.readInt64(processHandle, address);
		break;
		case "float64":
		case "double":
			return craziness.readDouble(processHandle, address);
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
			return craziness.readCString(processHandle, address, length);
		break;
		case "wchar":
			return craziness.readUnicodeString(processHandle, address, length);
		break;
	}

	return null;
};

craziness.readStruct = function(processHandle, base, struct){
	
	var rtn = {};
	var ptr = base;
	for(var prop in struct){
		if(struct[prop].type == "ptr"){
			rtn[prop] = craziness.readStruct(processHandle, craziness.read(processHandle, ptr + struct[prop].offset, "ptr"), struct[prop].struct);
		}else if(struct[prop].type == "baseAddress"){
			rtn[prop] = craziness.readStruct(processHandle, ptr + struct[prop].offset, struct[prop].struct);
		}else{
			rtn[prop] = craziness.read(processHandle, ptr + struct[prop].offset, struct[prop].type);
		}
	};
	
	return rtn;
};

Number.prototype.toHex = function()
{
	return ("0x" + (this.valueOf().toString(16)).toUpperCase());
}

exports.craziness = craziness