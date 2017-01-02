var configs = require("configs");

/** @param {StructureTower} tower **/
module.exports.loop = function (tower) {
    var target = findClosestTarget(tower);
    if (target) {

        var result;
        // If creep
        if (target.carry) {

            // Heal own creep
            if (target.owner.username == 'HerrLehmann') {
                result = tower.heal(target);
            }

            // Attack hostile creep
            else {
                result = tower.attack(target);
            }
        }

        // If structure
        else {
            result = tower.repair(target);
        }

        if (result != OK)
            console.log("ERROR tower " + result);
    }
};

var findClosestTarget = function (tower) {

    // Prio 1: Hostile creeps
    var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    // Prio 2: Injured own creeps
    if (!target) {
        target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function (creep) {
                return (creep.hits < creep.hitsMax);
            }
        });
    }

    // Prio 3: Damaged structures
    if (!target && tower.energy > (tower.energyCapacity / 1.2)) {
        target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.hits <= 5000 && structure.hits < structure.hitsMax / 2);
            }
        });
    }

    /*if (!target) {
        console.log("No tower target found for " + tower.id);
    }*/
    return target;
};
module.exports.findClosestTarget = findClosestTarget;