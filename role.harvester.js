/**
 * 采集者
 */
var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.harvesting = true;
        creep.say('S：harvest');
    }
    if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
        creep.memory.harvesting = false;
        creep.say('S: store');
    }


    if(creep.memory.harvesting) {
        creep.auto_harvest()
      }
      else {
        creep.auto_store_energy()
      }
}
};

module.exports = roleHarvester;