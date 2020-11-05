# screeps
``` 
server2_screepspl_us
//spawn1
Game.spawns['Spawn1'].memory.minHarvester = 3;
Game.spawns['Spawn1'].memory.minUpgrader = 2;
Game.spawns['Spawn1'].memory.minMiner= 1;
Game.spawns['Spawn1'].memory.minRecycler= 1;
Game.spawns['Spawn1'].memory.minLongDistanceHarvesters = {
     'W12N17' : 2
     ,'W14N17' : 2
     ,'W12N18' : 2
  } ;
Game.spawns['Spawn1'].memory.patrolRoute = {
    'p1_W13N17':['flag2','flag1','flag3','flag4']
};
Game.spawns['Spawn1'].memory.carryList = [{
    source:'5fa269fc00d7d50040278d13',
    target:'5f9dcff6955f60004affe98e',
    resourceType:'energy',
    num:1
}];
Game.rooms['W13N17'].memory.linkMap={
    '5fa34c38896b830030237641':'5fa269fc00d7d50040278d13',
    '5fa345f67e6a4f002e4979de':'5fa269fc00d7d50040278d13'
};

//spawn2
Game.spawns['Spawn2'].memory.minHarvester = 2;
Game.spawns['Spawn2'].memory.minUpgrader = 1;
Game.spawns['Spawn2'].memory.minRecycler= 1;
Game.spawns['Spawn2'].memory.minLongDistanceHarvesters = {
     'W13N18' : 1,
     'W13N19' : 1
} ;
Game.spawns['Spawn2'].memory.patrolRoute = {
    'p1_W12N19':['flag7','flag4','flag5','flag6']
};
```
