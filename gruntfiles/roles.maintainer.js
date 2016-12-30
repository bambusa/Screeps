var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If creep carries energy, maintain or go to closest target
     */
    if (creep.carry.energy > 0) {

        // No target in memory
        var target;
        if (!creep.memory.targetId) {
            target = findClosestTarget(creep);

            // No target available at the moment, activate fallback role
            if (!target) {
                creep.say("No target")
            }
            else {
                creep.memory.targetId = target.id
            }
        }
        else {
            target = Game.getObjectById(creep.memory.targetId);
            if (target === null) {
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }
        }

        // Maintain or move to target
        if (target) {

            var result;
            if (target.progressTotal) {
                result = creep.build(target);
            }
            else {
                result = creep.repair(target);
            }

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

            // If other error, reset source and target
            else if (result != OK) {
                console.log("ERROR while repairing: " + result + " (" + creep.name + ") at " + target.id + ": " + result);
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }

            // If success and hits are maxed or storage is empty, reset source and target
            else if (target.hits == target.hitsMax || creep.carry.energy == 0) {
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }
        }
    }

    /**
     * If creep isn't carrying any energy, collect some at closest container
     */
    else {

        // No source in memory
        var source;
        if (!creep.memory.sourceId) {
            source = findClosestSource(creep);

            // No source available at the moment, move to park position
            if (!source) {
                //creep.say("No source");
            }
            else {
                creep.memory.sourceId = source.id
            }
        }
        else {
            source = Game.getObjectById(creep.memory.sourceId)
            if (source === null) {
                creep.memory.targetId = null;
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
                    creep.memory.targetId = null;
                    creep.memory.sourceId = null;
                }
            }

            // If other error, reset source and target
            else if (result != OK) {
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }

            // If withdrawed successfully, recalculate closest target
            else {
                creep.memory.targetId = null;
            }
        }
    }
};

var findClosestSource = function (creep) {
    var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function (structure) {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 100);
        }
    });
    if (!source) {
        //console.log("No maintainer container source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {

    // Prio 1: Weak structures, that need maintenance
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
            return (structure.hits <= 5000 && structure.hits < (structure.hitsMax / 2));
        }
    });

    // Prio 2: Important construction sites
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
        });
    }

    // Prio 3: Other construction sites
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    }

    // Prio 4: Structures like walls etc. below 150k hits
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.hits <= 150000 && structure.hits < (structure.hitsMax / 1.5));
            }
        });
    }

    // Prio 5: Even tougher structures
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.hits < (structure.hitsMax / 1.1));
            }
        });
    }

    if (!target) {
        console.log("No repairer target found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;
