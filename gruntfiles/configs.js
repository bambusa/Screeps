var roles = {
    harvester: 'harvester',
    upgrader: 'upgrader',
    builder: 'builder',
    repairer: 'repairer',
    claimer: 'claimer'
};

var population = {
    harvester: {
        body: [MOVE, CARRY, WORK, WORK],
        amount: 8,
        memory: {
            role: roles.harvester
        }
    },
    upgrader: {
        body: [MOVE, CARRY, WORK, WORK],
        amount: 3,
        memory: {
            role: roles.upgrader
        }
    },
    repairer: {
        body: [MOVE, CARRY, WORK, WORK],
        amount: 0,
        memory: {
            role: roles.repairer
        },
        fallbackRole: roles.upgrader
    },
    builder: {
        body: [MOVE, CARRY, WORK, WORK],
        amount: 3,
        memory: {
            role: roles.builder
        },
        fallbackRole: roles.repairer
    },
    claimer: {
        body: [MOVE, CLAIM],
        amount: 0, // per room
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