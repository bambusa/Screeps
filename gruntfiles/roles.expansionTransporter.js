var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If creep is not in expansion room, move there
     */
    var roomName = creep.memory.claimRoom;
    var spawnRoomName = Game.spawns.Spawn1.roomName;
    /*if (creep.pos.roomName != roomName) {
        creep.moveTo(new RoomPosition(25, 25, roomName));
    }*/

    /**
     * If creep carries energy, go unload it at closest target
     */
    if (creep.carry.energy > 0) {
        var target;
        if (!creep.memory.targetId) {
            target = findClosestTarget(creep, roomName, spawnRoomName);

            // No target available at the moment, activate fallback role
            if (!target) {
                creep.say("No target");
            }
            else {
                creep.memory.targetId = target.id;
            }
        }
        else {
            target = Game.getObjectById(creep.memory.targetId);
            if (target === null) {
                creep.memory.targetId = null;
            }
        }

        // Unload at or move to target
        if (target) {
            var result;
            if (target.progressTotal)
                result = creep.build(target);
            else if (target.hits < (target.hitsMax / 2))
                result = creep.repair(target);
            else
                result = creep.transfer(target, RESOURCE_ENERGY);

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                result = creep.moveTo(target);

                // If path to target is blocked, find new closest target
                if (result == ERR_NO_PATH) {
                    creep.memory.targetId = null;
                }
            }

            // If target is fully loaded, just wait
            else if (result == ERR_FULL) {
                // creep.memory.targetId = null;
                // creep.memory.sourceId = null;
            }

            // If other error, reset source and target
            else if (result != OK) {
                console.log("ERROR while transfering: " + result + " (" + creep.name + ") at " + target.id + ": " + result);
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }

            // If unloaded successfully, recalculate closest source
            else {
                creep.memory.sourceId = null;
            }
        }
    }

    /**
     * If creep has no energy, withdraw it
     */
    else {
        var source;
        if (!creep.memory.sourceId) {
            source = findClosestSource(creep, roomName);

            // No source available at the moment
            if (!source) {
                //creep.say("No source");
            }
            else creep.memory.sourceId = source.id
        }
        else {
            source = Game.getObjectById(creep.memory.sourceId);
            if (source === null) {
                creep.memory.sourceId = null;
            }
        }

        // Harvest or move to source
        if (source) {
            var result = creep.withdraw(source);

            // If not in range, move to source
            if (result == ERR_NOT_IN_RANGE) {

                // If path to source is blocked, find new closest source
                if (creep.moveTo(source) == ERR_NO_PATH) {
                    creep.memory.sourceId = null;
                    creep.memory.targetId = null;
                }
            }

            // If other error, find new closest source
            else if (result != OK) {
                creep.memory.sourceId = null;
                creep.memory.targetId = null;
            }

            // If harvested successfully and storage is full, recalculate nearest target
            else if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.targetId = null;
            }
        }
    }

};

var findClosestSource = function (creep, roomName) {
    var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function (structure) {
            return (structure.room.name == roomName && structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > 0);
        }
    });
    if (!source) {
        //console.log("No transporter container source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep, roomName, spawnRoomName) {
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
        filter: function (structure) {
            return (structure.room.name == roomName);
        }
    });
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.room.name == roomName &&
                (structure.structureType == STRUCTURE_ROAD) &&
                structure.hits < (structure.hitsMax / 2));
            }
        });
    }
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.room.name == spawnRoomName &&
                (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
    }
    if (!target) {
        console.log("No transporter target container found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;