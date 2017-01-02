var configs = require("configs");

/** @param {Creep} creep **/
module.exports.loop = function (creep) {

    /**
     * If storage is not full, go withdraw closest resource
     */
    if (creep.carry.energy < (creep.carryCapacity / 2)) {
        var source;
        if (!creep.memory.sourceId) {
            source = findClosestSource(creep);

            // No source available at the moment
            if (!source) {
                // creep.say("No source");
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
            var result;
            if (!source.amount)
                result = creep.withdraw(source, RESOURCE_ENERGY);
            else
                result = creep.pickup(source);

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
            else {
                creep.memory.sourceId = null;
            }
        }
    }

};

var findClosestSource = function (creep) {
    var source = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
        filter: function (source) {
            return (source.amount > 100);
        }
    });
    if (!source) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] && structure.store[RESOURCE_ENERGY] > creep.carryCapacity &&
                structure.id != creep.memory.targetId)
            }
        });
        for (var i in containers) {
            if (!source || source.store[RESOURCE_ENERGY] < containers[i].store[RESOURCE_ENERGY])
                source = containers[i];
        }
    }
    if (!source) {
        console.log("No source found for " + creep.name);
    }
    return source;
};
module.exports.findClosestSource = findClosestSource;

var findClosestTarget = function (creep) {

    // Prio 1: Link to controller
    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: function (structure) {
            return (structure.structureType == STRUCTURE_LINK && structure.energy < (structure.energyCapacity / 1.1));
        }
    });
    if (target && target.pos.inRangeTo(creep.room.controller, 2))
        target = null;

    // Prio 2: Container in room near controller
    if (!target) {
        target = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK);
            }
        });
        if (target && (!target.store || target.store[RESOURCE_ENERGY] < (target.storeCapacity / 1.1)))
            target = null;
    }

    // Prio 3: Spawn and extensions
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                structure.energy < structure.energyCapacity);
            }
        });
    }

    // Prio 4: Towers
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                return ((structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity);
            }
        });
    }

    // Prio 5: Storage
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                return ((structure.structureType == STRUCTURE_STORAGE) &&
                (!structure.store[RESOURCE_ENERGY] || structure.store[RESOURCE_ENERGY] < structure.storeCapacity));
            }
        });
    }

    if (!target) {
        console.log("No target found for " + creep.name);
    }
    return target;
};
module.exports.findClosestTarget = findClosestTarget;