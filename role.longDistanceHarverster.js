/**
 * 跨房间采集者
 */
var roleLongDistanceHarverster = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.say('S: harvest');
        }
        if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('S: store');
        }
  
  
        if(creep.memory.harvesting) {
            if(creep.room.name != creep.memory.home){
                var resource = creep.searchRecyclableResource(RESOURCE_ENERGY)
                if(resource){
                    creep.recycleResource(resource.obj,RESOURCE_ENERGY,resource.type)
                    return 
                }
            }
            
            if(creep.room.name == creep.memory.target){
                creep.auto_harvest()
            }else{
                creep.goTargetRoom()
            }
        }
        else {
            if(creep.room.name == creep.memory.home){
                var targetStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return   (structure.structureType == STRUCTURE_LINK
                            || structure.structureType == STRUCTURE_EXTENSION 
                            || structure.structureType == STRUCTURE_SPAWN 
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_STORAGE
                            ) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                // console.log(targetStructure)
                if(targetStructure){
                    creep.storeResourceInStructure(targetStructure,RESOURCE_ENERGY)
                }
            }else{
                creep.goHomeRoom()
            }
        }
  }
  };
  
  module.exports = roleLongDistanceHarverster;