/**
 * 运输者
 */
var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(!creep.memory.carrying && creep.store[RESOURCE_ENERGY] == 0) {
          creep.memory.carrying = true;
          creep.say('go to source');
      }
      if(creep.memory.carrying && creep.store.getFreeCapacity() == 0) {
          creep.memory.carrying = false;
          creep.say('go to target');
      }
  
      if(creep.memory.carrying) {
        var sourceId =  creep.memory.source
        var source = Game.getObjectById(sourceId)
        creep.getResourceFromStructure(source,creep.memory.resourceType)
      }
      else {
        var targetId =  creep.memory.target
        var target = Game.getObjectById(targetId)
        creep.storeResourceInStructure(target,creep.memory.resourceType)
      }
  }
  };
  
  module.exports = roleCarrier;