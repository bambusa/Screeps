var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If creep carries energy, go unload it at closest target
     */
    if (creep.carry.energy > 0) {
        var target;
        if (!creep.memory.targetId) {
            target = findClosestTarget(creep);

            // No target available at the moment, activate fallback role
            if (!target) {
                // creep.say("No target");
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
            var result = creep.transfer(target, RESOURCE_ENERGY);

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                var moveResult = creep.moveTo(target);

                // If path to target is blocked, find new closest target
                if (moveResult == ERR_NO_PATH) {
                    creep.memory.targetId = null;
                }
                /*else if (moveResult == OK) {
                 var look = creep.pos.lookFor(LOOK_STRUCTURES);
                 if (!(look.length > 0 && look[0].structureType && look[0].structureType == 'road')) {
                 creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                 }
                 }*/
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
            source = findClosestSource(creep);

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
            var result = creep.withdraw(source, RESOURCE_ENERGY);

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

var findClosestSource = function (creep) {
    var source;
    if (creep.room.name != creep.memory.claimRoom) {
        creep.moveTo(new RoomPosition(25, 25, creep.memory.claimRoom));
    }
    else {
        source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0);
            }
        });
        if (!source) {
            console.log("No transporter container source found for " + creep.name);
        }
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {
    var target
    if (creep.room.name != creep.memory.homeRoom) {
        creep.moveTo(new RoomPosition(25, 25, creep.memory.homeRoom));
    }
    else {
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return ((structure.structureType == STRUCTURE_CONTAINER) &&
                structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
            }
        });
        if (!target) {
            console.log("No transporter target container found for " + creep.name);
        }
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;