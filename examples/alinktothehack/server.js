var craziness = require('../../craziness.js').craziness;
craziness.setDebugAs(false);

var GW2 = {
    structs: {
        GetCliContextPtr: 0x017F2B88
    },
    processHandle: null,
    init: function () {
        this.processHandle = craziness.openProcess("Guild Wars 2");
    },
    getControllerCharacter: function () {
        var GetCliContextPtr = craziness.readInt(this.processHandle, this.structs.GetCliContextPtr);
        var character = craziness.readInt(this.processHandle, GetCliContextPtr + 0x4C);


    },
    getCliPlayerList: function () {
        var GetCliContextPtr = craziness.readInt(this.processHandle, this.structs.GetCliContextPtr);
        var CharacterArray = craziness.readInt(this.processHandle, GetCliContextPtr + 0x28);
        var CharacterArrayCount = craziness.readInt(this.processHandle, GetCliContextPtr + 0x30);

        var toReturn = [];
        for (var i = 0; i < CharacterArrayCount; i++) {
            var prt = craziness.readInt(this.processHandle, CharacterArray + (i * 4));
            if (prt != 0)
                toReturn.push(prt);
        }
        return toReturn;
    },
    environment_struct: {
        MapTimeOfDay : { offset : 0x3C8, type: "float"},
        RenderViewDistance : { offset : 0x3D0, type: "float"},
        environment: {
            offset: 0x3C0,
            type: "ptr",
            struct: {
                storm_cycle : { offset: 0x50 ,type: "float" },
                storm : { offset: 0x58 ,type: "float" },
                color : {
                    offset: 0x158,
                    type: "baseAddress",
                    struct: {
                        r : { offset: 0x0, type: "float" },
                        g : { offset: 0x4, type: "float" },
                        b : { offset: 0x8, type: "float" }                        
                    }
                },
                shaders_color: {
                    offset: 0x168,
                    type: "baseAddress",
                    struct: {
                        r : { offset: 0x0, type: "float" },
                        g : { offset: 0x4, type: "float" },
                        b : { offset: 0x8, type: "float" },                        
                        a : { offset: 0xC, type: "float" }                        
                    }
                },
                shadow: {
                    offset: 0x18c,
                    type: "baseAddress",
                    struct: {
                        distance : { offset: 0x0, type: "float" },
                        density : { offset: 0x4, type: "float" }                 
                    }
                },
                blending_color : {
                    offset: 0x254,
                    type: "baseAddress",
                    struct: {
                        r : { offset: 0x0, type: "float" },
                        g : { offset: 0x4, type: "float" },
                        b : { offset: 0x8, type: "float" }                        
                    }
                },
                blending_color_a : {
                    offset: 0x284,
                    type: "baseAddress",
                    struct: {
                        r : { offset: 0x0, type: "float" },
                        g : { offset: 0x4, type: "float" },
                        b : { offset: 0x8, type: "float" }                        
                    }
                },
                shadow_blend: {
                    offset: 0x2d4,
                    type: "baseAddress",
                    struct: {
                        s : { offset: 0x0, type: "float" },
                        inverted : { offset: 0xC, type: "float" },
                    }
                },
                env_color_density : {
                    offset: 0x370,
                    type: "baseAddress",
                    struct: {
                        r : { offset: 0x0, type: "float" },
                        g : { offset: 0x4, type: "float" },
                        b : { offset: 0x8, type: "float" }                        
                    }
                },
                env_color_density_a : {
                    offset: 0x3a0,
                    type: "baseAddress",
                    struct: {
                        r : { offset: 0x0, type: "float" },
                        g : { offset: 0x4, type: "float" },
                        b : { offset: 0x8, type: "float" }                        
                    }
                },
                env_color_density_meidum : {
                    offset: 0x3e0,
                    type: "baseAddress",
                    struct: {
                        r : { offset: 0x0, type: "float" },
                        g : { offset: 0x4, type: "float" },
                        b : { offset: 0x8, type: "float" }                        
                    }
                },
                env_color_full : { offset: 0x3f0, type: "float" },
                env_color_full_brightness : { offset: 0x3fc, type: "float" },
                env_color_sky : { offset: 0x430, type: "float" },
                shadow_density : { offset: 0x43c, type: "float" }
            }
        }
    },
    world_struct: {
        MapName: { offset: 0x0, type: "wchar[256]" },
        MapNamespace: { offset: 0x100, type: "wchar[256]" },
        MapSector: { offset: 0x200, type: "wchar[256]" },
        MapType: { offset: 0x300, type: "wchar[256]" },
        MapId: { offset: 0x400, type: "int" },
        MapTimeOfDay: { offset: 0x404, type: "float" },
        camera_x: { offset: 0x408, type: "float" },
        camera_y: { offset: 0x40C, type: "float" },
        camera_z: { offset: 0x410, type: "float" },
        player_facing: {
            offset: 0x414,
            type: "baseAddress",
            struct: {
                x: { offset: 0x0 ,type: "float" },
                y: { offset: 0x4 ,type: "float" },
                z: { offset: 0x8 ,type: "float" }
            }
        },
        player_angle: {
            offset: 0x420,
            type: "baseAddress",
            struct: {
                x: { offset: 0x0, type: "float" },
                y: { offset: 0x4, type: "float" }
            }   
        },
        player_pos: { 
            offset: 0x42C, 
            type: "baseAddress" , 
            struct:{
                x: { offset: 0x0 ,type: "float" },
                y: { offset: 0x4 ,type: "float" },
                z: { offset: 0x8 ,type: "float" }
            } 
        }
    },
    agent_struct: {
        id: {
            offset: 0x34,
            type: "int"
        },
        agent: {
            offset: 0x44,
            type: "ptr",
            struct: {
                pos: {
                    offset: 0x1C,
                    type: "ptr",
                    struct: {
                        x: {
                            offset: 0x20,
                            type: "float"
                        },
                        y: {
                            offset: 0x24,
                            type: "float"
                        },
                        z: {
                            offset: 0x28,
                            type: "float"
                        },
                    }
                }
            }
        },
        health: {
            offset: 0x168,
            type: "ptr",
            struct: {
                current: {
                    offset: 0x8,
                    type: "float"
                },
                max: {
                    offset: 0xC,
                    type: "float"
                }
            }
        },
        isAlive: {
            offset: 0xA0,
            type: "bool"
        },
        isSwimming: {
            offset: 0x68,
            type: "bool"
        }
    }
};

var hack = GW2;
hack.init();

var io = require('socket.io').listen(6565);
io.set('log level', 0);
io.sockets.on('connection', function (socket) {
    console.log("Client Connected");
    
    var timeOfDayBase = craziness.read(hack.processHandle, 0x174FF04, "ptr");
    var environmentBase = craziness.read(hack.processHandle, timeOfDayBase + hack.environment_struct.environment.offset, "ptr");
    var GetCliContextPtr = craziness.read(hack.processHandle, hack.structs.GetCliContextPtr, "ptr");

    socket.on('getWorldData', function (data) {    
        var world = craziness.readStruct(hack.processHandle, 0x017ABA1C , hack.world_struct);
        //world.player_angle.arc = Math.atan2(world.player_angle.x,world.player_angle.y) * (180/Math.PI);
        socket.emit("WorldData",world);  
    });
    socket.on("changeEnvColor", function(data){
        var property = data.prop;
        var color = data.color;
        if(hack.environment_struct.environment.struct[property]){
            var base = hack.environment_struct.environment.struct[property].offset;
            var obj = hack.environment_struct.environment.struct[property].struct;
            for(var prop in obj){
                if(color[prop]){
                    craziness.writeFloat(hack.processHandle, environmentBase + base + obj[prop].offset, color[prop]);
                }
            }
        } 
    });
    socket.on("setTimeOfDay",function(val){
        craziness.writeFloat(hack.processHandle, timeOfDayBase + hack.environment_struct.MapTimeOfDay.offset , val);
        var stru = craziness.readStruct(hack.processHandle, timeOfDayBase, hack.environment_struct);
        console.log(stru);
    });

    socket.on("fixTimeOfDay",function(){
        var assembly = craziness.writeAssembly(hack.processHandle, 0x0085013A , [0xD9,0x9E,0x00,0x19,0x00,0x00]);
        socket.emit("timeOfDayFixed");
    });

    socket.on('getCliPlayerList', function (data) {
        var agents = hack.getCliPlayerList();
        var player_list = [];

        var controlledCharacterPtr = craziness.readInt(hack.processHandle, GetCliContextPtr + 0x4c);
        var controlledCharacterId = craziness.readInt(GW2.processHandle, controlledCharacterPtr + 0x34);

        for (var prop in agents) {

            var player = craziness.readStruct(hack.processHandle, agents[prop], hack.agent_struct);
            player_list.push({
                id : player.id,
                ptr: agents[prop].toHex(),
                isAlive: player.isAlive,
                health: player.health,
                pos: player.agent.pos,
                isControlledCharacter: (controlledCharacterId == player.id) ? true : false,
                isInWater: player.isSwimming
            });
        }

        socket.emit('getCliPlayerList', { players: player_list });
    });

});