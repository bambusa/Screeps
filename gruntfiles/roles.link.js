module.exports.loop = function () {
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var links = room.find(FIND_MY_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_LINK);
            }
        });

        var cached = true;
        for (var index in links) {
            var link = links[index];
            if (link.energy > 0) {
                if (!Memory[link.id]) {
                    Memory[link.id] = {}
                }

                // If targets are cached
                var targetId = Memory[link.id].targetId;
                if (targetId) {
                    link.transferEnergy(Game.getObjectById(targetId));
                }
                else if (targetId === undefined) {
                    cached = false;
                }
            }
        }

        // Recalculate targets
        if (!cached) {
            var controllerLink = room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_LINK);
                }
            });
            for (var index in links) {
                var link = links[index];
                if (link != controllerLink) {
                    Memory[link.id].targetId = controllerLink.id;
                }
                else {
                    Memory[link.id].targetId = null;
                }
            }
        }
    }
}