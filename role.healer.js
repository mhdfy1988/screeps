/**
 * 治疗者
 */
var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.searchToHeal()
    }
  };
  
  module.exports = roleHealer;