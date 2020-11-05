/**
 * 控制者
 */
var roleClaimer= {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.goToClaimController(new RoomPosition(creep.memory.x,creep.memory.y,creep.memory.roomName))
    }
  };
  
  module.exports = roleClaimer;