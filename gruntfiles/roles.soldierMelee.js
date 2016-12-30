var configs = require("configs");

var sentence = ['Sorry,', 'not sorry', '<3 <3 <3'];

/** @param {Creep} creep **/
module.exports.loop = function (creep) {
    if (!creep.spawning) {
        var targetRoom = creep.memory.claimRoom;
        if (!targetRoom)
            targetRoom = Memory.attackRoom;
        if (targetRoom && creep.room.name != targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom));
        }
        else {
            var saying = creep.saying;
            var index = sentence.indexOf(saying);
            if (index == sentence.length - 1) index = -1;
            index++;
            creep.say(sentence[index], true);

            var target = findClosestHostileCreep(creep);
            if (!target)
                target = findClosestWall(creep);
            if (!target)
                target = findClosestHostileStructures(creep);
            if (target) {
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
             // console.log("ERROR nothing to attack for " + creep.name);
             }
        }
    }
};

var findClosestHostileCreep = function (creep) {
    var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    return target;
};

var findClosestWall = function (creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(structure) {
            return (structure.structureType == STRUCTURE_WALL);
        }
    });
    return target;
};

var findClosestHostileStructures = function (creep) {
    var target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
        filter: function(structure) {
            return (structure.structureType != STRUCTURE_CONTROLLER);
        }
    });
    return target;
};