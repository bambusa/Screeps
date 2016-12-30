var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If creep can carry more energy, go harvest closest resource
     */
    if (creep.carry.energy < creep.carryCapacity) {
        var source;
        if (!creep.memory.sourceId) {
            source = findClosestSource(creep);

            // No source available at the moment
            if (!source) {
                creep.say("No source");
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

            // else if (result == ERR_NOT_ENOUGH_RESOURCES)
            //     console.log("Harvested " + source.ticksToRegeneration + " before regeneration");

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
            target = findClosestTarget(creep);

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
            var result = creep.transfer(target, RESOURCE_ENERGY);

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
                // creep.memory.sourceId = null;
            }
        }
    }

};

var findClosestSource = function (creep) {
    var source;
    var sources = creep.room.find(FIND_SOURCES);
    for (var id in sources) {
        var thisSource = sources[id];
        var harvestersAround = thisSource.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: function(creep) {
                return (creep.memory.role == configs.roles.harvester);
            }
        })
        if (!harvestersAround.length) {
            var source = thisSource;
            break;
        }
    }
    if (!source) {
        console.log("No harvester source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function (structure) {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
        }
    });
    if (!target) {
        console.log("No harvester target container found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;