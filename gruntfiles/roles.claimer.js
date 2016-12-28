/** @param {Creep} creep **/
module.exports.loop = function (creep) {
    var target;
    if (!creep.memory.targetId) {
        target = findClosestTarget(creep);

        // No target available at the moment, activate fallback role
        if (target) {
            creep.memory.targetId = target.id
        }
    }
    else {
        target = Game.getObjectById(creep.memory.targetId);
        if (target === null) {
            creep.memory.targetId = null;
        }
    }

    // Claim or move to target
    if (target) {
        var result = creep.reserveController(target);

        // If not in range, move to target
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

        // If other error, log it and move to parking position
        else if (result != OK && !creep.spawning) {
            console.log("ERROR while claiming: " + result + " (" + creep.name + " at " + target.id + ")");
            creep.memory.targetId = null;
        }
    }

};

var findClosestTarget = function (creep) {
    var target;
    if (creep.memory.claimRoom) {
        var roomName = creep.memory.claimRoom;
        var room = Game.rooms[roomName];
        if (!room) {
            console.log("ERROR can't find room " + roomName + " or controller for " + creep.name);
            creep.moveTo(new RoomPosition(25, 25, roomName));
        }
        else {
            var target = room.controller;
        }
    }
    else {
        console.log("ERROR no claimRoom in memory for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;
