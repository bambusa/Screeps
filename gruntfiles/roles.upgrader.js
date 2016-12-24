module.exports.loop = function (creep) {

    /**
     * If creep carries energy, upgrade or go to closest target
     */
    if (creep.carry.energy > 0) {
        // console.log("upgrading: " + creep.name);
        var target = creep.room.controller;
        if (!target) {
            console.log("Found no controller in room for: " + creep.name);
        }

        // Upgrade or move to target
        if (target) {
            var result = creep.upgradeController(target);

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                result = creep.moveTo(target);
            }

            // If other error, log it and move to parking position
            else if (result != OK) {
                console.log("ERROR while upgrading: " + result + " (" + creep.name + ")");
                creep.memory.targetId = null;
                creep.moveTo(16, 22);
            }
        }
    }

    /**
     * If creep isn't carrying any energy, collect some at closest structure
     */
    if (creep.carry.energy < creep.carryCapacity) {
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
            source = Game.getObjectById(creep.memory.sourceId)
        }

        // Collect from or move to source
        if (source) {
            var result = creep.withdraw(source, RESOURCE_ENERGY);

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
};

var findClosestSource = function (creep) {
    var source = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: function (structure) {
            return structure.energy > 0;
        }
    });
    if (!source) {
        console.log("No closest source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

/*
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
 */