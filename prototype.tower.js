//塔自动攻击附近敌对creeps
StructureTower.prototype.auto_attack = function(){
    var closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        this.attack(closestHostile);
    }
    return closestHostile
}

//塔自动维修
StructureTower.prototype.auto_repair = function(){
  var closestDamagedStructure = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
  });
  if(closestDamagedStructure) {
      this.repair(closestDamagedStructure);
  }
  return closestDamagedStructure
}

StructureTower.prototype.auto_heal = function(){
    var closestNeedHealCreep = this.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => creep.hits < creep.hitsMax
    });
    if(closestNeedHealCreep) {
        this.heal(closestNeedHealCreep);
    }
    return closestNeedHealCreep
  }



