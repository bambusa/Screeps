var configs = require("configs");
var population = require("population");
var harvester = require("roles.harvester");
var upgrader = require("roles.upgrader");
var maintainer = require("roles.maintainer");
var transporter = require("roles.transporter");
var claimer = require("roles.claimer");
var expansionHarvester = require("roles.expansionHarvester");
var expansionTransporter = require("roles.expansionTransporter");
var expansionMaintainer = require("roles.expansionMaintainer");
var tower = require("roles.tower");
var soldierMelee = require("roles.soldierMelee");

module.exports.loop = function () {
    // Count creeps for roles
    var sourcesOccupied = [];
    var populationCount = {};
    for (var key in configs.roles) {
        if (key != configs.roles.claimer)
            populationCount[configs.roles[key]] = 0;
    }
    populationCount[configs.roles.claimer] = {};
    populationCount[configs.roles.expansionHarvester] = {};
    populationCount[configs.roles.expansionTransporter] = {};
    populationCount[configs.roles.expansionMaintainer] = {};
    populationCount[configs.roles.soldierMelee] = {};

    /**
     * Creeps
     */
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        /*
         Count creeps for each role
         */
        // Count expansion roles for each room
        if (creep.memory.role == configs.roles.claimer || creep.memory.role == configs.roles.expansionHarvester ||
            creep.memory.role == configs.roles.expansionTransporter || creep.memory.role == configs.roles.expansionMaintainer ||
            creep.memory.role == configs.roles.soldierMelee) {
            var roomCount = populationCount[creep.memory.role][creep.memory.claimRoom];
            if (!roomCount)
                populationCount[creep.memory.role][creep.memory.claimRoom] = 1;
            else
                populationCount[creep.memory.role][creep.memory.claimRoom]++;
        }
        else {
            populationCount[creep.memory.role]++;
        }

        // Get role and if valid, replace with fallback role
        var role = creep.memory.role;
        if (creep.memory.fallbackUntil && creep.memory.fallbackUntil > Game.time) {
            var fallbackRole = configs.population[creep.memory.role].fallbackRole;
            if (fallbackRole) {
                if (creep.memory.fallbackUntil == (Game.time + configs.settings.fallbackTicks - 1)) {
                    creep.say("Fallback");
                    creep.memory.sourceId = null;
                    creep.memory.targetId = null;
                }
                role = fallbackRole;
            }
        }
        else if (creep.memory.fallbackUntil && creep.memory.fallbackUntil == Game.time) {
            creep.say("Standard");
            creep.memory.sourceId = null;
            creep.memory.targetId = null;
            creep.memory.fallbackUntil = null;
        }

        switch (role) {
            case configs.roles.harvester:
                harvester.loop(creep);
                break;
            case configs.roles.upgrader:
                upgrader.loop(creep);
                break;
            case configs.roles.maintainer:
                maintainer.loop(creep);
                break;
            case configs.roles.transporter:
                transporter.loop(creep);
                break;
            case configs.roles.claimer:
                claimer.loop(creep);
                break;
            case configs.roles.expansionHarvester:
                expansionHarvester.loop(creep);
                break;
            case configs.roles.expansionTransporter:
                expansionTransporter.loop(creep);
                break;
            case configs.roles.expansionMaintainer:
                expansionMaintainer.loop(creep);
                break;
            case configs.roles.soldierMelee:
                soldierMelee.loop(creep);
                break;
            default:
                console.log("ERROR unknown creep role: " + creep.memory.role);
                break;
        }
    }

    population.loop(populationCount);

    /**
     * Towers
     */
    for (var name in Game.rooms) {
        var towers = Game.rooms[name].find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        })
        for (var towerId in towers) {
            tower.loop(towers[towerId]);
        }
    }
};