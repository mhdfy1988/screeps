require('./prototype.creep')
require('./prototype.spawn')
require('./prototype.tower')
require('./prototype.link')

module.exports.loop = function () {

    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
          console.log('Clearing non-existing creep memory:', name);
      }
    }

    for (let name in Game.creeps) {
        Game.creeps[name].runRole();
    }

    //塔自动攻击
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        if(tower.auto_attack()){
          continue 
        }
        if(tower.auto_heal()){
          continue 
        }
        if(tower.auto_repair()){
          continue 
        }
    }

    var links = _.filter(Game.structures, s => s.structureType == STRUCTURE_LINK);
    for (let link of links) {
      link.auto_transferEnergy()
    }

    //自动繁殖
    for(let i in Game.spawns) {
      Game.spawns[i].auto_spawn()
    }
  }
