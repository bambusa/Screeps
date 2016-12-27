var roles = {
    transporter: 'transporter',
    harvester: 'harvester',
    upgrader: 'upgrader',
    maintainer: 'maintainer',
    claimer: 'claimer'
};

var population = {
    transporter: {
        body: [[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]],
        amount: 5,
        memory: {
            role: roles.transporter
        }
    },
    harvester: {
        body: [[MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK], [MOVE, CARRY, WORK, WORK]],
        amount: 4,
        memory: {
            role: roles.harvester
        }
    },
    upgrader: {
        body: [[MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK], [MOVE, CARRY, WORK, WORK]],
        amount: 3,
        memory: {
            role: roles.upgrader
        }
    },
    maintainer: {
        body: [[MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK], [MOVE, CARRY, WORK, WORK]],
        amount: 3,
        memory: {
            role: roles.maintainer
        },
        fallbackRole: roles.upgrader
    },
    claimer: {
        body: [[MOVE, CLAIM]],
        amount: 0, // per room
        memory: {
            role: roles.claimer
        },
        rooms: ['W21S71']
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