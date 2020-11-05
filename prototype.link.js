
StructureLink.prototype.auto_transferEnergy = function(){
    if(this.room.memory.linkMap[this.id]){
        // console.log(this.id)
        // console.log(this.room.memory.linkMap)
        var targetId = this.room.memory.linkMap[this.id]
        var target = Game.getObjectById(targetId)
        var amount = Math.min(target.store.getFreeCapacity(),this.store.getUsedCapacity()/0.97)
        this.transferEnergy(target,amount)
    }
}