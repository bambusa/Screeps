module.exports.loop = function (creep) {

    /**
     * If creep can carry more energy, go harvest closest resource
     */
    if (creep.carry.energy < creep.carryCapacity) {
        // console.log("harvesting: " + creep.name);

        // No source in memory
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
        }

        // Harvest or move to source
        if (source) {
            var result = creep.harvest(source);

            // If not in range, move to source
            if (result == ERR_NOT_IN_RANGE) {

                // If path to source is blocked, find new closest source
                if (creep.moveTo(source) == ERR_NO_PATH) {
                    creep.memory.source = null;
                }
            }

            // If other error, find new closest source
            else if (result != OK) {
                creep.memory.source = null;
            }
        }
    }

    /**
     * If creep can't carry more energy, go unload it at closest target
     */
    else {
        // console.log("unloading: " + creep.name);

        // No target in memory
        var target;
        if (!creep.memory.targetId) {
            target = findClosestTarget(creep);

            // No target available at the moment, move to park position
            if (!target) {
                creep.say("No target available");
                creep.moveTo(17, 22);
            }
            else creep.memory.targetId = target.id
        }
        else {
            target = Game.getObjectById(creep.memory.targetId)
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

            // If target is fully loaded, find new closest target
            else if (result == ERR_FULL) {
                creep.memory.targetId = null;
            }

            // If other error, find new closest source and target
            else {
                creep.memory.targetId = null;
                creep.memory.targetId = null;
            }
        }
    }

};

var findClosestSource = function (creep) {
    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!source) {
        console.log("No closest source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {
    var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function (structure) {
            return structure.energy < structure.energyCapacity;
        }
    });
    if (!target) {
        console.log("No closest target found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;