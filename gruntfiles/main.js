var configs = require("configs");
var population = require("population");
var harvester = require("roles.harvester");
var upgrader = require("roles.upgrader");
var builder = require("roles.builder");
var repairer = require("roles.repairer");

module.exports.loop = function () {
    // Count creeps for roles
    var populationCount = {};
    for (var key in configs.roles) {
        populationCount[configs.roles[key]] = 0;
    }

    // Creep role routines
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        populationCount[creep.memory.role]++;

        // Get role and if valid, replace with fallback role
        var role = creep.memory.role;
        if (creep.memory.fallbackUntil && creep.memory.fallbackUntil > Game.time) {
            var fallbackRole = configs.population[creep.memory.role].fallbackRole;
            if (fallbackRole) {
                if (creep.memory.fallbackUntil == (Game.time + configs.settings.fallbackTicks - 1)) {
                    creep.say("Fallback");
                    creep.memory.source = null;
                    creep.memory.target = null;
                }
                role = fallbackRole;
            }
        }
        else if (creep.memory.fallbackUntil && creep.memory.fallbackUntil == Game.time) {
            creep.say("Standard");
            creep.memory.source = null;
            creep.memory.target = null;
            creep.memory.fallbackUntil = null;
        }

        switch (role) {
            case configs.roles.harvester:
                harvester.loop(creep);
                break;
            case configs.roles.upgrader:
                upgrader.loop(creep);
                break;
            case configs.roles.builder:
                builder.loop(creep);
                break;
            case configs.roles.repairer:
                repairer.loop(creep);
                break;
            default:
                console.log("ERROR unknown creep role: " + creep.memory.role);
                break;
        }
    }

    population.loop(populationCount);
};