var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If creep is not in expansion room, move there
     */
    var roomName = creep.memory.claimRoom;
    /*if (creep.pos.roomName != roomName) {
        creep.moveTo(new RoomPosition(25, 25, roomName));
    }*/

    /**
     * If creep can carry more energy, go harvest closest resource
     */
    if (creep.carry.energy < creep.carryCapacity) {
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
            var result = creep.harvest(source);

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

    /**
     * If creep can't carry more energy, go unload it at closest target
     */
    else {
        var target;
        if (!creep.memory.targetId) {
            target = findClosestTarget(creep, roomName);

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
            else if (target.hits < target.hitsMax / 2)
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

};

var findClosestSource = function (creep, roomName) {
    var source = creep.pos.findClosestByPath(FIND_SOURCES, {
        filter: function (source) {
            return (source.room.name == roomName)
        }
    });
    if (!source) {
        console.log("No harvester source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep, roomName) {
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
        filter: function (source) {
            return (source.room.name == roomName && source.structureType == STRUCTURE_CONTAINER)
        }
    });
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.room.name == roomName && structure.structureType == STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
    }
    if (!target) {
        console.log("No harvester target container found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;