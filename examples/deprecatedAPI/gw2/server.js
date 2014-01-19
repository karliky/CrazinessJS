var craziness = require('../../build/Release/crazy');

var GW2 = {
    structs: {
        mapTimeOfDay: 0x1CF954A8
    },
    processHandle: null,
    init: function () {
        craziness.setDebugAs(false);
        this.processHandle = craziness.openProcess("Guild Wars 2");
    },
    setTimeOfDay: function (val) {
        craziness.writeFloat(this.processHandle, GW2.structs.mapTimeOfDay, val);
    },
    getTimeOfDay: function () {
        return craziness.readFloat(this.processHandle, GW2.structs.mapTimeOfDay);
    },
    changeDayCycle: function () {
        if ((this.getTimeOfDay() % 2) == 1) {
            this.setTimeOfDay(0);
        } else {
            this.setTimeOfDay(1);
        }
    }
};


/* Start the program */
var hack = GW2;
hack.init();
hack.changeDayCycle();