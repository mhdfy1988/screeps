/**
 * 巡逻者
 */
var rolePatroller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // console.log(creep.memory.role)
        // console.log(creep.room.name)
        // console.log(creep.memory.route)
        // console.log(creep.memory.index)
        if(creep.searchToRangeAttack()){
            return 
        }

        var nextFlag = _.find(Game.flags,(flag) => {
            return flag.name == creep.memory.route[creep.memory.index]
        })
        if(nextFlag.pos.x == creep.pos.x 
        && nextFlag.pos.y == creep.pos.y 
        && nextFlag.pos.roomName == creep.pos.roomName){
            var index = _.findIndex(creep.memory.route,function(flagName){    
                return flagName == nextFlag.name
            })
            // console.log(index)
            if(index >= 0 && creep.memory.index == index){
                if(creep.memory.index == 0){
                    creep.memory.increase = 1
                }else if(creep.memory.index == creep.memory.route.length-1){
                    creep.memory.increase = -1
                }
                creep.memory.index  += creep.memory.increase
            }
        }

        var flag = _.find(Game.flags,(flag) => {
            return flag.name == creep.memory.route[creep.memory.index]
       })
    //    console.log(flag)
        creep.moveTo(flag,{visualizePathStyle: {stroke: '#FFFF00'}})
    } 
  };
  
  module.exports = rolePatroller;