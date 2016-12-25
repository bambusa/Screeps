var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If creep carries energy, build or go to closest target
     */
    if (creep.carry.energy > 0) {
        // console.log("building: " + creep.name);

        // No target in memory
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

        // Upgrade or move to target
        if (target) {
            var result = creep.build(target);

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                result = creep.moveTo(target);
            }

            // If other error, activate fallback role
            else if (result != OK) {
                console.log("ERROR while building: " + result + " (" + creep.name + ") at " + target.id + ": " + result);
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
                creep.memory.fallbackUntil = Game.time + configs.settings.fallbackTicks;
            }
        }
    }

    /**
     * If creep isn't carrying any energy, collect some at closest structure
     */
    else if (!creep.room.memory.needSpawn && creep.carry.energy < creep.carryCapacity) {
        // console.log("collecting: " + creep.name);

        // No source in memory
        var source;
        if (!creep.memory.sourceId) {
            source = findClosestSource(creep);

            // No source available at the moment, move to park position
            if (!source) {
                creep.say("No source available");
                creep.moveTo(16, 22);
            }
            else creep.memory.sourceId = source.id
        }
        else {
            source = Game.getObjectById(creep.memory.sourceId);
            if (source === null) {
                creep.memory.sourceId = null;
            }
        }

        // Collect from or move to source
        if (source) {
            var result = creep.withdraw(source, RESOURCE_ENERGY);

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
};

var findClosestSource = function (creep) {
    var source = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: function (structure) {
            return structure.energy > 0;
        }
    });
    if (!source) {
        console.log("No builder source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {
    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (!target) {
        console.log("No builder target found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;
