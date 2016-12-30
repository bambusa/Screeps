var roles = {
    transporter: 'transporter',
    harvester: 'harvester',
    upgrader: 'upgrader',
    maintainer: 'maintainer',
    claimer: 'claimer',
    expansionHarvester: 'expansionHarvester',
    expansionTransporter: 'expansionTransporter',
    expansionMaintainer: 'expansionMaintainer',
    soldierMelee: 'soldierMelee'
};

var population = {
    transporter: {
        body: [ //[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
            [MOVE, CARRY, CARRY]],
        amount: 3,
        memory: {
            role: roles.transporter
        }
    },
    harvester: {
        body: [[MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK]
            // [MOVE, CARRY, WORK, WORK, WORK, WORK],
            // [MOVE, CARRY, WORK, WORK]
            ],
        amount: 2,
        memory: {
            role: roles.harvester
        }
    },
    upgrader: {
        body: [[MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK],
            // [MOVE, CARRY, WORK, WORK]
            ],
        amount: 2,
        memory: {
            role: roles.upgrader
        }
    },
    maintainer: {
        body: [[MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
            [MOVE, CARRY, WORK, WORK]],
        amount: 1,
        memory: {
            role: roles.maintainer
        },
        fallbackRole: roles.upgrader
    },
    claimer: {
        body: [[MOVE, MOVE, CLAIM, CLAIM], [MOVE, CLAIM]],
        memory: {
            role: roles.claimer
        },
        rooms: {'W21S71': 1, 'W21S72': 0}
    },
    expansionHarvester: {
        body: [[MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK]
            // [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK],
            // [MOVE, CARRY, WORK, WORK]
            ],
        memory: {
            role: roles.expansionHarvester
        },
        rooms: {'W21S71': 1, 'W21S72': 0}
    },
    expansionTransporter: {
        body: [ //[MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
            [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]],
        memory: {
            role: roles.expansionTransporter
        },
        rooms: {'W21S71': 1, 'W21S72': 0}
    },
    expansionMaintainer: {
        body: [[MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK],
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],
            [MOVE, CARRY, WORK, WORK]],
        memory: {
            role: roles.expansionMaintainer
        },
        rooms: {'W21S71': 1, 'W21S72': 0}
    },
    soldierMelee: {
        body: [ //[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
            //[MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK],
            [MOVE, ATTACK, ATTACK]],
        amount: 0,
        memory: {
            role: roles.soldierMelee
        },
        rooms: {'W21S71': 0, 'W21S72': 0}
    }
};

var settings = {
    fallbackTicks: 50,
    populationInfoTicks: 25
};

module.exports = {
    roles: roles,
    population: population,
    settings: settings
};