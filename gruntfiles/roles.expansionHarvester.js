var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {
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

    /**
     * If creep can carry more energy, go harvest closest resource
     */
    // console.log(creep.carry.energy + " " + creep.carryCapacity + " " + creep.pos.isNearTo(source))
    // console.log(creep.carry.energy == 0)
    // console.log(creep.carry.energy < creep.carryCapacity && creep.pos.isNearTo(source))
    if (creep.carry.energy == 0 || (creep.carry.energy < creep.carryCapacity && creep.pos.isNearTo(source))) {

        // Harvest or move to source
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

    /**
     * If creep can't carry more energy, go unload it at closest target
     */
    else {
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
            var result;
            if (target.progressTotal)
                result = creep.build(target);
            else if (target.hits < (target.hitsMax / 2) || (target.hits < target.hitsMax && target.store && target.store[RESOURCE_ENERGY] == target.storeCapacity))
                result = creep.repair(target);
            else
                result = creep.transfer(target, RESOURCE_ENERGY);

            // If not in range, move to target
            if (result == ERR_NOT_IN_RANGE) {
                var moveResult = creep.moveTo(target);

                // If path to target is blocked, find new closest target
                if (moveResult == ERR_NO_PATH) {
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
            else if (!target.progressTotal || (target.hits && target.hits == target.hitsMax) || creep.carry.energy == 0) {
                // creep.memory.sourceId = null;
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
        var sources = creep.room.find(FIND_SOURCES);
        for (var id in sources) {
            var thisSource = sources[id];
            var harvestersAround = thisSource.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: function(creep) {
                    return (creep.memory.role == configs.roles.expansionHarvester);
                }
            });
            if (!harvestersAround.length || harvestersAround[0].id == creep.id) {
                source = thisSource;
                break;
            }
        }
        if (!source) {
            console.log("No source found for " + creep.name);
        }
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {
    var target;
    /*var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
            return (structure.hits < (structure.hitsMax / 2));
        }
    });*/
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
            filter: function (source) {
                return (source.structureType == STRUCTURE_CONTAINER); // || source.structureType == STRUCTURE_ROAD
            }
        });
    }
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
    }
    if (!target) {
        console.log("No target found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;