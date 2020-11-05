/**
 * 采矿者
 */
var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(!creep.memory.mining && creep.store.getUsedCapacity() == 0) {
          creep.memory.mining = true;
          creep.say('S：mine');
      }
      if(creep.memory.mining && creep.store.getFreeCapacity() == 0) {
          creep.memory.mining = false;
          creep.say('S: store');
      }
  
  
      if(creep.memory.mining) {
          creep.auto_mine()
      }
      else {
          creep.auto_store_mine()
      }
  }
  };
  
  module.exports = roleMiner;