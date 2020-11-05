var roleList ={
  harvester: require('./role.harvester'),
  longDistanceHarverster: require('./role.longDistanceHarverster'),
  carrier: require('./role.carrier'),
  builder: require('./role.builder'),
  repairer: require('./role.repairer'),
  upgrader: require('./role.upgrader'),
  healer: require('./role.healer'),
  meleeAttacker: require('./role.meleeAttacker'),
  remoteAttacker: require('./role.remoteAttacker'),
  patroller: require('./role.patroller'),
  claimer: require('./role.claimer'),
  miner:require('./role.miner'),
  recycler:require('./role.recycler')
}

Creep.prototype.runRole = function(){
  roleList[this.memory.role].run(this)
}

//采集
Creep.prototype.auto_harvest = function(){
  //采集能源
  if(this.getEnergyFromSource()){
    return
  }
}

//采矿
Creep.prototype.auto_mine= function(){
  var mineral = this.getMineral()
  if(mineral){
    this.memory.resourceType = mineral.mineralType
  }
}

//能量储存
Creep.prototype.auto_store_energy= function(){
  //存储优先级 各设施 > storage > 非主采集类的creeps > 返回主基地待命
    //将能量存储进各设施中
  var  targetStructure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_EXTENSION 
            || structure.structureType == STRUCTURE_SPAWN 
            || structure.structureType == STRUCTURE_TOWER) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });
  
  if(targetStructure){
    this.storeResourceInStructure(targetStructure,RESOURCE_ENERGY)
    return 
  }

  //将能量存储进storage中
  var targetStorage = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (structure) => {
        return structure.structureType == STRUCTURE_STORAGE &&
            structure.store.getFreeCapacity() > 0;
    }
  });
  if(targetStorage){
    this.storeResourceInStructure(targetStorage,RESOURCE_ENERGY)
    return 
  }

  if(this.transferEnergyToCreeps()){
    return
  }

  this.back_to_closest_spawn() 
}

//储存矿藏
Creep.prototype.auto_store_mine= function(){
  var targetStorage = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (structure) => {
        return structure.structureType == STRUCTURE_STORAGE &&
            structure.store.getFreeCapacity() > 0;
    }
  });
  if(targetStorage){
    this.storeResourceInStructure(targetStorage,this.memory.resourceType)
    return 
  }
}

//非采集类creeps获取能量2种模式（1：优先从storage,再采集 ，2：优先采集）
Creep.prototype.auto_get_energy= function(pattern){
  switch(pattern){
    case 1 : 
      var targetStorage = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_STORAGE &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        }
      });
      this.getResourceFromStructure(targetStorage,RESOURCE_ENERGY)
      if(!targetStorage){
        this.auto_harvest()
      }
      break;
    case 2 :
      this.auto_harvest()
      break;
  }
}

Creep.prototype.auto_carry = function(){
  /**
   * 运输逻辑暂未完善
   * .....
   */
  this.back_to_closest_spawn()
}

Creep.prototype.auto_build = function(){

  //优先建造spawn
  var sites = _.filter(Game.constructionSites,function(site){
    return site.structureType == STRUCTURE_SPAWN
  })
  if(sites.length > 0){
    this.goBuildByTarget(sites[0])
    return 
  }

  //后期可以加入判断优先建造哪种设施
  if(this.goBuild()){
    return 
  }

  this.back_to_closest_spawn()
}

Creep.prototype.auto_repair = function(){
  //优先修路
  if(this.goRepairRoad()){
    return 
  }

  //修设施
  if(this.goRepairStructures()){
    return 
  }

  //修墙
  if(this.goRepairWall()){
    return 
  }

  this.back_to_closest_spawn()
  
}

//从Source中获取能量
Creep.prototype.getEnergyFromSource = function(){
  var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

  if(source){
   if(this.harvest(source) == ERR_NOT_IN_RANGE) {
     this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
   }
  }
  return source
}

//采矿
Creep.prototype.getMineral = function(){
  var mineral = this.pos.findClosestByPath(FIND_MINERALS)
  if(mineral){
    if(this.harvest(mineral) == ERR_NOT_IN_RANGE) {
      this.moveTo(mineral, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  }
  return mineral
}

//从指定设施中获取指定类型资源
Creep.prototype.getResourceFromStructure = function(targetStructure,resourceType){
  if(targetStructure) {
    if(this.withdraw(targetStructure, resourceType) == ERR_NOT_IN_RANGE) {
        this.moveTo(targetStructure, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  }
}

//将指定资源存储进指定设施
Creep.prototype.storeResourceInStructure= function(targetStructure,resourceType){  
  if(targetStructure) {  
      //取设施和creep资源最小值
      var amount = Math.min(this.store.getUsedCapacity(resourceType),targetStructure.store.getFreeCapacity()) 
      var a = this.transfer(targetStructure, resourceType,amount) 
      if(a == ERR_NOT_IN_RANGE) {
          this.moveTo(targetStructure, {visualizePathStyle: {stroke: '#ffffff'}});
      }
  }
}

//将资源转移给其他非主采集类creeps
Creep.prototype.transferEnergyToCreeps= function(){
  var targetCreep = this.pos.findClosestByPath(FIND_MY_CREEPS, {
    filter: (creep) => {
        return (creep.memory.role == "builder" 
        || creep.memory.role == "repairer" 
        || creep.memory.role == "upgrader" )
        && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  
  if(targetCreep){
    if(this.transfer(targetCreep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targetCreep, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  }

  return targetCreep
}

//建造sites
Creep.prototype.goBuild = function(){
  
  var targetSite = this.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
  if(targetSite) {
      if(this.build(targetSite) == ERR_NOT_IN_RANGE) {
          this.moveTo(targetSite, {visualizePathStyle: {stroke: '#ffffff'}});
      }
  }

  return targetSite
}

//建造指定目标设施
Creep.prototype.goBuildByTarget = function(target){
  if(this.build(target) == ERR_NOT_IN_RANGE) {
    this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
  }
}

//修路
Creep.prototype.goRepairRoad = function(){
  var roadStructure = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) => {
        return structure.structureType == STRUCTURE_ROAD &&
          structure.hits < structure.hitsMax;
    }
  });
  if(roadStructure) {
    if(this.repair(roadStructure) == ERR_NOT_IN_RANGE) {
        this.moveTo(roadStructure, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  }
  return roadStructure
}

//修墙
Creep.prototype.goRepairWall = function(){
  var wallStructure = this.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) => {
        return structure.structureType == STRUCTURE_WALL &&
          structure.hits < structure.hitsMax;
    }
  });

  if(wallStructure) {
    if(this.repair(wallStructure) == ERR_NOT_IN_RANGE) {
        this.moveTo(wallStructure, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  }

  return wallStructure
}

//修我方设施
Creep.prototype.goRepairStructures = function(){
  var targetStructure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (structure) => {
        return structure.hits < structure.hitsMax;
    }
  });

  if(targetStructure) {
    if(this.repair(targetStructure) == ERR_NOT_IN_RANGE) {
        this.moveTo(targetStructure, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  }

  return targetStructure
}

//升级控制器
Creep.prototype.auto_up_grad = function(){
  if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
    this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
  }
}

//返回最近的繁殖基地
Creep.prototype.back_to_closest_spawn = function(){
  var spawn = this.pos.findClosestByPath(FIND_MY_SPAWNS);
  this.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
}

//前往指定房间
Creep.prototype.goToAssignRoom = function(roomName){
  var exit = this.room.findExitTo(roomName)
  this.moveTo(this.pos.findClosestByRange(exit), {visualizePathStyle: {stroke: '#ffffff'}})
}


//返回自己房间
Creep.prototype.goHomeRoom = function(){
  var exit = this.room.findExitTo(this.memory.home)
  this.moveTo(this.pos.findClosestByRange(exit), {visualizePathStyle: {stroke: '#ffffff'}})
}

//前往目标房间
Creep.prototype.goTargetRoom = function(){
  var exit = this.room.findExitTo(this.memory.target)
  this.moveTo(this.pos.findClosestByRange(exit), {visualizePathStyle: {stroke: '#ffaa00'}})
}

//近战攻击
Creep.prototype.searchToAttack = function(){
  //寻找敌方creep
  var targetCreep = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
  if(targetCreep){
    if(this.attack(targetCreep) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetCreep, {visualizePathStyle: {stroke: '#FF0000'}});
    }
  }
  return targetCreep
}

//远程攻击
Creep.prototype.searchToRangeAttack = function(){
  //寻找敌方creep
  var targetCreep = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
  if(targetCreep){
    if(this.rangedAttack(targetCreep) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetCreep, {visualizePathStyle: {stroke: '#FF0000'}});
    }
  }
  return targetCreep
}

//治疗
Creep.prototype.searchToHeal = function(){
  //寻找我发creep
  var targetCreep = this.pos.findClosestByPath(FIND_MY_CREEPS,{
    filter: (creep) => {
      return creep.hits < creep.hitsMax
    }
  });
  if(targetCreep){
    if(this.rangedHeal(targetCreep) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetCreep, {visualizePathStyle: {stroke: '#00FF00'}});
    }
  }
  return targetCreep
}

//控制器
Creep.prototype.goToClaimController = function(roomPosition){
  if(this.room.name != roomPosition.roomName){
    this.moveTo(roomPosition, {visualizePathStyle: {stroke: '#00FF00'}});
  }else{
    if(this.claimController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#00FF00'}});
    }
  }
}

//查找指定类型可回收的资源
Creep.prototype.searchRecyclableResource= function(resourceType){
  // console.log(resourceType)
    var   dropResource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES,{
      filter: (resource) => {
          return resourceType?resource.resourceType == resourceType:true
      }
    })
    if(dropResource){
      return {
        type: 'resource',
        obj: dropResource
      }
    }
  
    var   tombstone = this.pos.findClosestByPath(FIND_TOMBSTONES,{
      filter: (tombstone) =>{
        return resourceType?(tombstone.store.getUsedCapacity(resourceType) > 0):(tombstone.store.getUsedCapacity() > 0)
      }
    })
    if(tombstone){
      return {
        type: 'tombstone',
        obj: tombstone
      }
    }
  
    var   ruin = this.pos.findClosestByPath(FIND_RUINS,{
      filter: (ruin) =>{
        return resourceType?(ruin.store.getUsedCapacity(resourceType) > 0):(ruin.store.getUsedCapacity() > 0)
      }
    })
    if(ruin){
      return {
        type: 'ruin',
        obj: ruin
      }
    }

  return null
}

//回收资源
Creep.prototype.recycleResource= function(resource,resourceType, targetType ){
  if(targetType == 'resource'){
    if(resource){
      if(this.pickup(resource) == ERR_NOT_IN_RANGE) {
        this.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }else if(targetType == 'tombstone' || targetType == 'ruin'){
    if(resource){
      if(this.withdraw(resource,resourceType) == ERR_NOT_IN_RANGE) {
        this.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
}

