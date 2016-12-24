var roles = {
    harvester: 'harvester',
    upgrader: 'upgrader',
    builder: 'builder',
    repairer: 'repairer'
};

var population = {
    harvester: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK],
        amount: 6,
        memory: {
            role: roles.harvester
        }
    },
    upgrader: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK],
        amount: 4,
        memory: {
            role: roles.upgrader
        }
    },
    builder: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK],
        amount: 2,
        memory: {
            role: roles.builder
        }
    },
    repairer: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK],
        amount: 2,
        memory: {
            role: roles.repairer
        }
    }
};

module.exports = {
    roles: roles,
    population: population
};