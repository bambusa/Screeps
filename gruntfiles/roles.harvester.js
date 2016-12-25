var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    var target;
    if (!creep.memory.targetId) {
        target = findClosestTarget(creep);

        // No target available at the moment, activate fallback role
        if (!target) {
            creep.memory.targetId = null;
            creep.memory.sourceId = null;
            creep.memory.fallbackUntil = Game.time + configs.settings.fallbackTicks;
        }
        else creep.memory.targetId = target.id
    }
    else {
        target = Game.getObjectById(creep.memory.targetId);
        if (source === target) {
            creep.memory.targetId = null;
        }
    }

    /**
     * If creep can carry more energy and is not near another target, go harvest closest resource
     */
    if (creep.carry.energy < creep.carryCapacity && !(creep.carry.energy >= 50 && creep.pos.inRangeTo(target, 3))) {
        var source;
        if (!creep.memory.sourceId) {
            source = findClosestSource(creep);

            // No source available at the moment, move to park position
            if (!source) {
                creep.say("No source available");
                creep.moveTo(17, 22);
            }
            else creep.memory.sourceId = source.id
        }
        else {
            source = Game.getObjectById(creep.memory.sourceId)
            if (source === null) {
                creep.memory.sourceId = null;
            }
        }

        // Harvest or move to source
        if (source) {
            var result;
            if (source.energyCapacity !== undefined)
                result = creep.harvest(source);
            else
                result = creep.pickup(source);

            // If not in range, move to source
            if (result == ERR_NOT_IN_RANGE) {

                // If path to source is blocked, find new closest source
                if (creep.moveTo(source) == ERR_NO_PATH) {
                    creep.memory.sourceId = null;
                }
            }

            // If other error, find new closest source
            else if (result != OK) {
                creep.memory.sourceId = null;
            }
        }
    }

    /**
     * If creep can't carry more energy, go unload it at closest target
     */
    else {

        // Unload at or move to target
        if (target) {
            var result = creep.transfer(target, RESOURCE_ENERGY);

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                result = creep.moveTo(target);

                // If path to target is blocked, find new closest target
                if (result == ERR_NO_PATH) {
                    creep.memory.targetId = null;
                }
            }

            // If target is fully loaded, find new closest target
            else if (result == ERR_FULL) {
                creep.memory.targetId = null;
            }

            // If other error, activate fallback role
            else if (result != OK) {
                console.log("ERROR while unloading: " + result + " (" + creep.name + ") at " + target.id + ": " + result);
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
                creep.memory.fallbackUntil = Game.time + configs.settings.fallbackTicks;
            }
        }
    }

};

var findClosestSource = function (creep) {
    var source = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (!source) {
        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    }
    if (!source) {
        console.log("No harvester source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {
    var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function (structure) {
            return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity);
        }
    });
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return ((structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity);
            }
        });
    }
    if (!target) {
        console.log("No harvester target found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;