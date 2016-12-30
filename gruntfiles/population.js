var configs = require("configs");

/** @param {Object} populationCount **/
module.exports.loop = function (populationCount) {
    /*if (Memory.nextPopulationInfo <= Game.time) {
        console.log("Current population: " + JSON.stringify(populationCount));
        Memory.nextPopulationInfo = Game.time + configs.settings.populationInfoTicks;
    }*/

    // Population check
    var needSpawn = false;
    roleLoop:
        for (var key in configs.roles) {
            var creepRole = configs.population[key];
            // console.log("populationCount: " + populationCount[configs.roles[key]] + ", amount: " + creepRole.amount);

            // Check amount for each room
            if (key == configs.roles.claimer || key == configs.roles.expansionHarvester || key == configs.roles.expansionTransporter || key == configs.roles.expansionMaintainer || key == configs.roles.soldierMelee) {
                for (var room in creepRole.rooms) {
                    // console.log("check room " + room +": " + populationCount[configs.roles[key]][room] + " / " + creepRole.rooms[room]);
                    if ((!populationCount[configs.roles[key]][room] && creepRole.rooms[room] > 0) || populationCount[configs.roles[key]][room] < creepRole.rooms[room]) {
                            needSpawn = true;
                            var memory = creepRole.memory;
                            memory.claimRoom = room;
                            memory.homeRoom = Game.spawns.Spawn1.room.name;

                            for (var i in creepRole.body) {
                                var body = creepRole.body[i];
                                // console.log("Check body " + JSON.stringify(body));
                                if (Game.spawns.Spawn1.canCreateCreep(body) == OK) {
                                    console.log("Current population: " + JSON.stringify(populationCount));
                                    console.log("Spawning new " + configs.roles[key]);
                                    Game.spawns.Spawn1.createCreep(body, getRandomName(configs.roles[key]), memory);
                                    break roleLoop;
                                }
                            }
                    }
                }
            }

            // Else for every other role
            else {
                if (populationCount[configs.roles[key]] < creepRole.amount) {
                    // console.log("Reserving resources to spawn new creep: " + configs.roles[key]);
                    needSpawn = true;
                    var result;
                    for (var i in creepRole.body) {
                        var body = creepRole.body[i];
                        // console.log("Check body " + JSON.stringify(body));
                        if (Game.spawns.Spawn1.canCreateCreep(body) == OK) {
                            console.log("Current population: " + JSON.stringify(populationCount));
                            console.log("Spawning new " + configs.roles[key]);
                            Game.spawns.Spawn1.createCreep(body, getRandomName(configs.roles[key]), creepRole.memory);
                            break roleLoop;
                        }
                    }
                }
            }
        }
    Game.spawns.Spawn1.room.memory.needSpawn = needSpawn;

    // Cleanup dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Cleanup dead spawns
    for (var name in Memory.spawns) {
        if (!Game.spawns[name]) {
            delete Memory.spawns[name];
        }
    }
};

var names1 = ["Lehmann", "Jackson", "Aiden", "Liam", "Lucas", "Noah", "Mason", "Jayden", "Ethan", "Jacob", "Jack", "Caden", "Logan", "Benjamin", "Michael", "Caleb", "Ryan", "Alexander", "Elijah", "James", "William", "Oliver", "Connor", "Matthew", "Daniel", "Luke", "Brayden", "Jayce", "Henry", "Carter", "Dylan", "Gabriel", "Joshua", "Nicholas", "Isaac", "Owen", "Nathan", "Grayson", "Eli", "Landon", "Andrew", "Max", "Samuel", "Gavin", "Wyatt", "Christian", "Hunter", "Cameron", "Evan", "Charlie", "David", "Sebastian", "Joseph", "Dominic", "Anthony", "Colton", "John", "Tyler", "Zachary", "Thomas", "Julian", "Levi", "Adam", "Isaiah", "Alex", "Aaron", "Parker", "Cooper", "Miles", "Chase", "Muhammad", "Christopher", "Blake", "Austin", "Jordan", "Leo", "Jonathan", "Adrian", "Colin", "Hudson", "Ian", "Xavier", "Camden", "Tristan", "Carson", "Jason", "Nolan", "Riley", "Lincoln", "Brody", "Bentley", "Nathaniel", "Josiah", "Declan", "Jake", "Asher", "Jeremiah", "Cole", "Mateo", "Micah", "Elliot"];
var names2 = ["Schlüpper", "Distaey", "Sophia", "Emma", "Olivia", "Isabella", "Mia", "Ava", "Lily", "Zoe", "Emily", "Chloe", "Layla", "Madison", "Madelyn", "Abigail", "Aubrey", "Charlotte", "Amelia", "Ella", "Kaylee", "Avery", "Aaliyah", "Hailey", "Hannah", "Addison", "Riley", "Harper", "Aria", "Arianna", "Mackenzie", "Lila", "Evelyn", "Adalyn", "Grace", "Brooklyn", "Ellie", "Anna", "Kaitlyn", "Isabelle", "Sophie", "Scarlett", "Natalie", "Leah", "Sarah", "Nora", "Mila", "Elizabeth", "Lillian", "Kylie", "Audrey", "Lucy", "Maya", "Annabelle", "Makayla", "Gabriella", "Elena", "Victoria", "Claire", "Savannah", "Peyton", "Maria", "Alaina", "Kennedy", "Stella", "Liliana", "Allison", "Samantha", "Keira", "Alyssa", "Reagan", "Molly", "Alexandra", "Violet", "Charlie", "Julia", "Sadie", "Ruby", "Eva", "Alice", "Eliana", "Taylor", "Callie", "Penelope", "Camilla", "Bailey", "Kaelyn", "Alexis", "Kayla", "Katherine", "Sydney", "Lauren", "Jasmine", "London", "Bella", "Adeline", "Caroline", "Vivian", "Juliana", "Gianna", "Skyler", "Jordyn"];

var getRandomName = function (prefix) {
    var name, isNameTaken, tries = 0;
    do {
        var nameArray = Math.random() > .5 ? names1 : names2;
        name = nameArray[Math.floor(Math.random() * nameArray.length)];

        if (tries > 3) {
            name += nameArray[Math.floor(Math.random() * nameArray.length)];
        }

        tries++;
        isNameTaken = Game.creeps[name] !== undefined;
    } while (isNameTaken);

    return "[" + prefix + "] " + name;
};