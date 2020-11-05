/**
 * 升级者
 */
var roleUpgrader = {
    
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.store[RESOURCE_ENERGY] == 0 && creep.memory.upgrading) {
      creep.memory.upgrading= false
      creep.say('切换状态： harvest');
    }
    if(creep.store.getFreeCapacity() == 0 && !creep.memory.upgrading) {
      creep.memory.upgrading= true
      creep.say('切换状态： upgrder');
    }
    
    if(!creep.memory.upgrading){
      creep.auto_get_energy(1)
    }else {
      creep.auto_up_grad()
    }
  }
};

module.exports = roleUpgrader;