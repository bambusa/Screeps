var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If storage is not full, go withdraw closest resource
     */
    if (creep.carry.energy < 50) {
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
            else if (source.energy < (creep.carryCapacity / 2)) {
                source = findClosestSource(creep);
            }
        }

        // Harvest or move to source
        if (source) {
            var result = creep.withdraw(source, RESOURCE_ENERGY);

            // If not in range, move to source
            if (result == ERR_NOT_IN_RANGE) {

                // If path to source is blocked, find new closest source
                var moveResult = creep.moveTo(source);
                if (moveResult == ERR_NO_PATH) {
                    creep.memory.sourceId = null;
                    creep.memory.targetId = null;
                }
                /*else if (moveResult == OK) {
                    var look = creep.pos.lookFor(LOOK_STRUCTURES);
                    // console.log("looking at " +JSON.stringify(look[0]))
                    if (!(look.length > 0 && look[0].structureType && look[0].structureType == 'road')) {
                        // console.log("New road for transporter");
                        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                    }
                }*/
            }

            // If other error, find new closest source
            else if (result != OK) {
                creep.memory.sourceId = null;
                creep.memory.targetId = null;
            }

            // If withdrawed successfully, recalculate closest target
            else {
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
                //creep.say("No target");
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
            if (!target.store) {
                target = findClosestTarget(creep);
            }
        }

        // Unload at or move to target
        if (target) {
            var result = creep.transfer(target, RESOURCE_ENERGY);

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                var moveResult = creep.moveTo(target);
                if (moveResult == ERR_NO_PATH) {
                    creep.memory.targetId = null;
                }
                /*else if (moveResult == OK) {
                    var look = creep.pos.lookFor(LOOK_STRUCTURES);
                    // console.log("looking at " +JSON.stringify(look[0]))
                    if (!(look.length > 0 && look[0].structureType && look[0].structureType == 'road')) {
                        // console.log("New road for transporter");
                        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                    }
                }*/
            }

            // If target is fully loaded, find new closest target
            else if (result == ERR_FULL) {
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }

            // If other error, activate fallback role
            else if (result != OK) {
                console.log("ERROR while transfering: " + result + " (" + creep.name + ") at " + target.id + ": " + result);
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }

            // If transfered successfully, reset source and target
            else {
                creep.memory.targetId = null;
                creep.memory.sourceId = null;
            }
        }
    }

};

var findClosestSource = function (creep) {
    var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(source) {
            return (source.structureType == STRUCTURE_CONTAINER && source.store[RESOURCE_ENERGY] > 50);
        }
    });
    if (!source) {
        console.log("No transporter source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {

    // Prio 1: Towers
    var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function (structure) {
            return ((structure.structureType == STRUCTURE_TOWER) &&
            structure.energy < (structure.energyCapacity / 1.1));
        }
    });

    // Prio 2: Spawn and extensions
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                structure.energy < structure.energyCapacity);
            }
        });
    }

    if (!target) {
        console.log("No transporter container target container found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;