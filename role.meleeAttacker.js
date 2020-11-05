/**
 * 近战攻击者
 */
var roleMeleeAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.searchToAttack()
    }
  };
  
  module.exports = roleMeleeAttacker;