const resourceTypes  = {RESOURCE_ENERGY: "energy",
    RESOURCE_POWER: "power",

    RESOURCE_HYDROGEN: "H",
    RESOURCE_OXYGEN: "O",
    RESOURCE_UTRIUM: "U",
    RESOURCE_LEMERGIUM: "L",
    RESOURCE_KEANIUM: "K",
    RESOURCE_ZYNTHIUM: "Z",
    RESOURCE_CATALYST: "X",
    RESOURCE_GHODIUM: "G",

    RESOURCE_SILICON: 'silicon',
    RESOURCE_METAL: 'metal',
    RESOURCE_BIOMASS: 'biomass',
    RESOURCE_MIST: 'mist',

    RESOURCE_HYDROXIDE: "OH",
    RESOURCE_ZYNTHIUM_KEANITE: "ZK",
    RESOURCE_UTRIUM_LEMERGITE: "UL",

    RESOURCE_UTRIUM_HYDRIDE: "UH",
    RESOURCE_UTRIUM_OXIDE: "UO",
    RESOURCE_KEANIUM_HYDRIDE: "KH",
    RESOURCE_KEANIUM_OXIDE: "KO",
    RESOURCE_LEMERGIUM_HYDRIDE: "LH",
    RESOURCE_LEMERGIUM_OXIDE: "LO",
    RESOURCE_ZYNTHIUM_HYDRIDE: "ZH",
    RESOURCE_ZYNTHIUM_OXIDE: "ZO",
    RESOURCE_GHODIUM_HYDRIDE: "GH",
    RESOURCE_GHODIUM_OXIDE: "GO",

    RESOURCE_UTRIUM_ACID: "UH2O",
    RESOURCE_UTRIUM_ALKALIDE: "UHO2",
    RESOURCE_KEANIUM_ACID: "KH2O",
    RESOURCE_KEANIUM_ALKALIDE: "KHO2",
    RESOURCE_LEMERGIUM_ACID: "LH2O",
    RESOURCE_LEMERGIUM_ALKALIDE: "LHO2",
    RESOURCE_ZYNTHIUM_ACID: "ZH2O",
    RESOURCE_ZYNTHIUM_ALKALIDE: "ZHO2",
    RESOURCE_GHODIUM_ACID: "GH2O",
    RESOURCE_GHODIUM_ALKALIDE: "GHO2",

    RESOURCE_CATALYZED_UTRIUM_ACID: "XUH2O",
    RESOURCE_CATALYZED_UTRIUM_ALKALIDE: "XUHO2",
    RESOURCE_CATALYZED_KEANIUM_ACID: "XKH2O",
    RESOURCE_CATALYZED_KEANIUM_ALKALIDE: "XKHO2",
    RESOURCE_CATALYZED_LEMERGIUM_ACID: "XLH2O",
    RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE: "XLHO2",
    RESOURCE_CATALYZED_ZYNTHIUM_ACID: "XZH2O",
    RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE: "XZHO2",
    RESOURCE_CATALYZED_GHODIUM_ACID: "XGH2O",
    RESOURCE_CATALYZED_GHODIUM_ALKALIDE: "XGHO2",

    RESOURCE_OPS: "ops",

    RESOURCE_UTRIUM_BAR: 'utrium_bar',
    RESOURCE_LEMERGIUM_BAR: 'lemergium_bar',
    RESOURCE_ZYNTHIUM_BAR: 'zynthium_bar',
    RESOURCE_KEANIUM_BAR: 'keanium_bar',
    RESOURCE_GHODIUM_MELT: 'ghodium_melt',
    RESOURCE_OXIDANT: 'oxidant',
    RESOURCE_REDUCTANT: 'reductant',
    RESOURCE_PURIFIER: 'purifier',
    RESOURCE_BATTERY: 'battery',

    RESOURCE_COMPOSITE: 'composite',
    RESOURCE_CRYSTAL: 'crystal',
    RESOURCE_LIQUID: 'liquid',

    RESOURCE_WIRE: 'wire',
    RESOURCE_SWITCH: 'switch',
    RESOURCE_TRANSISTOR: 'transistor',
    RESOURCE_MICROCHIP: 'microchip',
    RESOURCE_CIRCUIT: 'circuit',
    RESOURCE_DEVICE: 'device',

    RESOURCE_CELL: 'cell',
    RESOURCE_PHLEGM: 'phlegm',
    RESOURCE_TISSUE: 'tissue',
    RESOURCE_MUSCLE: 'muscle',
    RESOURCE_ORGANOID: 'organoid',
    RESOURCE_ORGANISM: 'organism',

    RESOURCE_ALLOY: 'alloy',
    RESOURCE_TUBE: 'tube',
    RESOURCE_FIXTURES: 'fixtures',
    RESOURCE_FRAME: 'frame',
    RESOURCE_HYDRAULICS: 'hydraulics',
    RESOURCE_MACHINE: 'machine',

    RESOURCE_CONDENSATE: 'condensate',
    RESOURCE_CONCENTRATE: 'concentrate',
    RESOURCE_EXTRACT: 'extract',
    RESOURCE_SPIRIT: 'spirit',
    RESOURCE_EMANATION: 'emanation',
    RESOURCE_ESSENCE: 'essence'}


/**
 * 回收者
 */
var roleRecycler = {

    /** @param {Creep} creep **/
    run: function(creep) {

    //   console.log(creep.memory.recycling)
    //   console.log(creep.room.name+":"+creep.memory.resourceType)
      if(!creep.memory.recycling && creep.store.getUsedCapacity() == 0) {
          creep.memory.recycling = true;
          creep.say('S：recycle');
      }
      
      var resource = creep.searchRecyclableResource(creep.memory.resourceType)
      if(creep.memory.recycling && (creep.store.getFreeCapacity() == 0 || (!resource&&creep.store.getUsedCapacity() > 0))) {
          creep.memory.recycling = false;
          creep.say('S: store');
      }
  
  
      if(creep.memory.recycling) {
        var resource = creep.searchRecyclableResource(creep.memory.resourceType)
        if(creep.memory.resourceType && resource){  
            creep.recycleResource(resource.obj,creep.memory.resourceType,resource.type)
        }else {
            var flag = false;
            for(var i in resourceTypes){
                var resourceType = resourceTypes[i]
                var resource = creep.searchRecyclableResource(resourceType)
                if(resource){
                    flag = true;
                    creep.memory.resourceType =  resourceType
                    creep.recycleResource(resource.obj,creep.memory.resourceType,resource.type)
                    break
                }
            }
            
            if(!flag){
                creep.back_to_closest_spawn()
            }
        }
      }
      else {
          //将回收的资源储存进storage
          var targetStorage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getFreeCapacity() > 0;
            }
          });
          
          if(targetStorage){
            creep.storeResourceInStructure(targetStorage,creep.memory.resourceType)
          }else if(creep.memory.resourceType == RESOURCE_ENERGY){
                creep.transferEnergyToCreeps()
          }
      }
  }
  };

  module.exports = roleRecycler;