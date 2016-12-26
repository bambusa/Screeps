var roles = {
    harvester: 'harvester',
    upgrader: 'upgrader',
    builder: 'builder',
    repairer: 'repairer',
    claimer: 'claimer'
};

var population = {
    harvester: {
        body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK],
        amount: 8,
        memory: {
            role: roles.harvester
        }
    },
    upgrader: {
        body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
        amount: 4,
        memory: {
            role: roles.upgrader
        }
    },
    repairer: {
        body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
        amount: 4,
        memory: {
            role: roles.repairer
        },
        fallbackRole: roles.upgrader
    },
    builder: {
        body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
        amount: 2,
        memory: {
            role: roles.builder
        },
        fallbackRole: roles.repairer
    },
    claimer: {
        body: [MOVE, CLAIM],
        amount: 2, // per room
        memory: {
            role: roles.claimer
        },
        rooms: ['E23N78']
    }
};

var settings = {
    fallbackTicks: 50,
    populationInfoTicks: 50
};

module.exports = {
    roles: roles,
    population: population,
    settings: settings
};