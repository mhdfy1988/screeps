/**
 * 建造者
 */
var roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
          creep.memory.building = false;
          creep.say('S： harvest');
    }
    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
        creep.memory.building = true;
        creep.say('S： build');
    }

    if(creep.memory.building) {
      creep.auto_build()
    }else {
      creep.auto_get_energy(1)
    }
  }
};

module.exports = roleBuilder;