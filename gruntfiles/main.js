var configs = require("configs");
var population = require("population");
var harvester = require("roles.harvester");
var upgrader = require("roles.upgrader");
var maintainer = require("roles.maintainer");
var transporter = require("roles.transporter");
var claimer = require("roles.claimer");

module.exports.loop = function () {
    // Count creeps for roles
    var populationCount = {};
    for (var key in configs.roles) {
        populationCount[configs.roles[key]] = 0;
    }
    populationCount[configs.roles.claimer].overall = 0;

    // Creep role routines
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        // Count creeps for each role
        if (creep.memory.role == configs.roles.claimer) {
            populationCount[creep.memory.role].overall++;
            var roomCount = populationCount[creep.memory.role][creep.memory.claimRoom];
            if (!roomCount)
                roomCount = 1;
            else
                roomCount++;
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
            default:
                console.log("ERROR unknown creep role: " + creep.memory.role);
                break;
        }
    }

    population.loop(populationCount);
};