/**
 * 远程攻击者
 */
var roleRemoteAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.searchToRangeAttack()
    }
  };
  
  module.exports = roleRemoteAttacker;