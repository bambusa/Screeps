var roles = {
    harvester: 'harvester',
    upgrader: 'upgrader',
    builder: 'builder',
    repairer: 'repairer'
};

var population = {
    harvester: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
        amount: 6,
        memory: {
            role: roles.harvester
        }
        // fallbackRole: roles.repairer
    },
    upgrader: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
        amount: 4,
        memory: {
            role: roles.upgrader
        }
    },
    repairer: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
        amount: 4,
        memory: {
            role: roles.repairer
        }
        // fallbackRole: roles.upgrader
    },
    builder: {
        body: [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
        amount: 2,
        memory: {
            role: roles.builder
        },
        fallbackRole: roles.repairer
    }
};

var settings = {
    fallbackTicks: 50,
    populationInfoTicks: 50
}

module.exports = {
    roles: roles,
    population: population,
    settings: settings
};