/**
 * 维修者
 */
var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.repairing = false;
        creep.say('go to harvester');
      }
      if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
          creep.memory.repairing = true;
          creep.say('go to repair');
      }
  
      if(!creep.memory.repairing) {
          creep.auto_get_energy(1)
        }else {
          creep.auto_repair()
        }
  }
  };
  
  module.exports = roleRepair;