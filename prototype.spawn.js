
StructureSpawn.prototype.auto_spawn = function(){

  var role = null
  //采集
  if(this.getMyCreepsByRole('harvester').length < this.memory.minHarvester){
    role = 'harvester'
    this.spawn_custom_creep(this.room.energyAvailable,role);
  }
  

  //本地守卫
  if(role == null){
    var HostileCreeps = this.room.find(FIND_HOSTILE_CREEPS)
    if(HostileCreeps.length > 0){
      if(this.getMyCreepsByRole('remoteAttacker').length < HostileCreeps.length){
        role = 'remoteAttacker'
        this.spawn_rangeAttack_creep(this.room.energyAvailable,role)
      }else if(this.getMyCreepsByRole('healer').length < HostileCreeps.length){
        role = 'healer'
        this.spawn_heal_creep(this.room.energyAvailable,role)
      }
    }
  }

      //回收者
      if(role == null){
        if(this.getMyCreepsByRole('recycler').length < this.memory.minRecycler){
          role = 'recycler'
          this.spawn_special_creep([CARRY,MOVE,CARRY,MOVE,CARRY,MOVE],role);
        }
      }

    //普通
    if(role == null){
      if(this.getMyCreepsByRole('upgrader').length < this.memory.minUpgrader){
        role = 'upgrader'
      }else if(this.getMyCreepsByRole('carrier').length < 0){
          role = 'carrier'
      }
  
      if(role){
          this.spawn_custom_creep(this.room.energyAvailable,role);
      }
    }

    //采矿者
    if(role == null){
      var structures = this.room.find(FIND_MY_STRUCTURES,{
        filter:(structure) => {
          return structure.structureType == STRUCTURE_EXTRACTOR
        }
      })
      if(structures.length > 0 && this.getMyCreepsByRole('miner').length < this.memory.minMiner){
        role = 'miner'
        this.spawn_custom_creep(this.room.energyAvailable,role);
      }
    }

    if(role == null){
      //根据建筑缺失的血量来决定维修者数量
      var totalNeedRepairHits = 0
      var repairNum = 0
      var structures = this.room.find(FIND_STRUCTURES,{
        filter: (structure) => {
          return structure.hits < structure.hitsMax;
          }
      })

      for (var i in structures){
          totalNeedRepairHits += structures[i].hitsMax - structures[i].hits
      }

      if(totalNeedRepairHits > 0 && totalNeedRepairHits < 3000){
        repairNum = 1
      }else if(totalNeedRepairHits >= 3000){
        repairNum = 2
      }
      if(this.getMyCreepsByRole('repairer').length < repairNum){
        role = 'repairer';
        this.spawn_custom_creep(this.room.energyAvailable,role);
      }
    }

  //远程建造队，当出现spawn时才会设置remoteBuildNum
  if(role == null){
    var remoteBuildNum = 0
    var sites = _.filter(Game.constructionSites,function(site){
      return site.structureType == STRUCTURE_SPAWN
    })
  
    if(sites.length > 0){
      remoteBuildNum = 8
    }  

    var total = _.sum(Game.creeps,function(c){
      return c.memory.role == 'builder'
    })
    if(total  < remoteBuildNum) {
      role = 'builder'
      this.spawn_custom_creep(this.room.energyAvailable,role);
    }
  }

  if(role == null){
    //根据建筑工地工程量确定建造者数量
    var sites = this.room.find(FIND_MY_CONSTRUCTION_SITES)
    var totalProgress = 0
    var builderNum = 0
    for(var i in sites){
      totalProgress += sites[i].progressTotal - sites[i].progress
    }
    if(totalProgress > 0 && totalProgress < 2000 ){
      builderNum = 2
    }else if(totalProgress >= 2000 && totalProgress < 4000){
      builderNum = 3
    }else if(totalProgress >= 4000){
      builderNum = 4
    }
    if(this.getMyCreepsByRole('builder').length < builderNum){
      role = 'builder'
      this.spawn_custom_creep(this.room.energyAvailable,role);
    }
  }

  //巡警
  if(role == null) {
    for(let patrolName in this.memory.patrolRoute){
      // console.log(patrolName)
      var route = this.memory.patrolRoute[patrolName]
      var num = _.sum(Game.creeps, (c) =>
      c.memory.role == 'patroller' && c.memory.patrolName == patrolName)
      if(num < 1){
        role = 'patroller'
        this.spawn_patroller(this.room.energyAvailable,route,patrolName)
      }
    }
  }

  //远程采集
  if(role == null) {
    for (let roomName in this.memory.minLongDistanceHarvesters) {
      let numberOfLongDistanceHarvesters = {}
      numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, (c) =>
      c.memory.role == 'longDistanceHarverster' && c.memory.target == roomName)

      if(numberOfLongDistanceHarvesters[roomName] < this.memory.minLongDistanceHarvesters[roomName]){
        role = 'longDistanceHarverster'
        this.spawn_longDistanceHaverster(this.room.energyAvailable,2,this.room.name,roomName)
      }
    }
  }

  //运输工
  if(role == null) {
    _.forEach(this.memory.carryList,(value,key)=>{
      var num = _.sum(Game.creeps, (c) =>
              c.memory.role == 'carrier' 
              && c.memory.source == value.source 
              && c.memory.target == value.target
              && c.memory.resourceType == value.resourceType);
      if(num < value.num){
        role = 'carrier'
        this.spawn_carry_creep([CARRY,MOVE],role,value.source,value.target,value.resourceType);
      }
    })
  }

  this.showSpawningText()
}


StructureSpawn.prototype.spawn_special_creep = function(parts,role){
  this.spawnCreep(parts, role+Game.time, 
  {memory: {role: role}});
}

//繁殖治疗者
StructureSpawn.prototype.spawn_heal_creep = function(energy,role){
  var numberOfParts = Math.floor(energy / 300);
  numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));

  var parts = [];
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(MOVE);
  }
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(HEAL);
  }


  this.spawnCreep(parts, role+Game.time, 
    {memory: {role: role}});
}

//繁殖远程攻击者
StructureSpawn.prototype.spawn_rangeAttack_creep = function(energy,role){

  var numberOfParts = Math.floor(energy / 200);
  numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));

  var parts = [];
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(MOVE);
  }
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(RANGED_ATTACK);
  }

  this.spawnCreep(parts, role+Game.time, 
    {memory: {role: role}});
}

//繁殖近战攻击者
StructureSpawn.prototype.spawn_attack_creep = function(energy,role){

  var numberOfParts = Math.floor(energy / 130);
  numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));

  var parts = [];
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(MOVE);
  }
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(ATTACK);
  }

  this.spawnCreep(parts, role+Game.time, 
    {memory: {role: role}});
}

StructureSpawn.prototype.spawn_custom_creep = function(energy,role){

  // create a balanced body as big as possible with the given energy
  var numberOfParts = Math.floor(energy / 200);
  // make sure the creep is not too big (more than 50 parts)
  numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
  var parts = [];
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(WORK);
  }
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(CARRY);
  }
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(MOVE);
  }

  this.spawnCreep(parts, role+Game.time, 
  {memory: {role: role}});
}

StructureSpawn.prototype.spawn_carry_creep = function(parts,role,source,target,resourceType){
  this.spawnCreep(parts, role+Game.time, 
    {memory: {
      role: role,
      source:source,
      target:target,
      resourceType:resourceType
    }});
}

StructureSpawn.prototype.spawn_longDistanceHaverster = function(energy,numberOfWorkParts,home, target){
  // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
  var parts = [];
  for (let i = 0; i < numberOfWorkParts; i++) {
      parts.push(WORK);
  }

  // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
  energy -= 150 * numberOfWorkParts;
  var numberOfParts = Math.floor(energy / 100);
  if(numberOfParts < 2){
       return
  }
  // make sure the creep is not too big (more than 50 parts)
  numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
  for (let i = 0; i < numberOfParts; i++) {
      parts.push(CARRY);
  }
  for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
      parts.push(MOVE);
  }
  this.spawnCreep(parts, 'longDistanceHarverster'+Game.time, 
  {memory: {
    role: 'longDistanceHarverster',
    home: home,
    target: target
  }});

}

StructureSpawn.prototype.spawn_patroller = function(energy,route, patrolName){
  var numberOfParts = Math.floor(energy / 200);
  numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));

  var parts = [];
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(RANGED_ATTACK);
  }
  for (let i = 0; i < numberOfParts; i++) {
    parts.push(MOVE);
  }
  this.spawnCreep(parts, 'patroller'+Game.time, 
  {memory: {
    role: 'patroller',
    route: route,
    patrolName: patrolName,
    index: 0,
    increase : 1
  }});
}

StructureSpawn.prototype.getMyCreepsByRole = function(role){
return  this.room.find(FIND_MY_CREEPS,{
  filter: (creep) => {
      return creep.memory.role == role;}
})
}

StructureSpawn.prototype.showSpawningText = function(role){
  if(this.spawning) { 
  var spawningCreep = Game.creeps[this.spawning.name];
  this.room.visual.text(
      '繁殖' + spawningCreep.memory.role,
      this.pos.x + 1, 
      this.pos.y, 
      {align: 'left', opacity: 0.8});
  }
}