var TurnManager = function(board, players){
   var me = this;
   me.turnNumber = 1;
   me.players = players;
   me.board = board;

   me.currentPlayerIndex = 0;
   me.currentPlayer = players[me.currentPlayerIndex];
   me.currentTurnMovedUnits = [];

   console.log(me.currentPlayer, "Turn",me.turnNumber);

   me._scripts = [];

   me.getPlayerUnits = function(playerName){
      return me.board.sceneNode.children.filter(function(unit){
         return unit.owner === playerName;
      });
   }

   me.getCurrentPlayerUnits = function(){
      return me.getPlayerUnits(me.currentPlayer);
   }

   me.getEnemyPlayerUnits = function(){
      return me.board.sceneNode.children.filter(function(unit){
         return unit.owner !== me.currentPlayer;
      });
   }

   me.isEnemyUnit = function(unit){
      return me.getCurrentPlayerUnits().indexOf(unit) === -1;
   }

   me.canMoveUnit = function(unit){
      return me.getCurrentPlayerUnits().indexOf(unit) !== -1 && !unit.actionComplete;
   }

   me.getAttackableUnitsInRange = function(unit){
      return unit.getAttackRange().filter(function(e){
         return e.unit && me.isEnemyUnit(e.unit);
      }).map(function(e){
         return e.unit;
      });
   }

   me.endTurn = function(){
      me.getCurrentPlayerUnits().forEach(function(u){
         u.done();
      });
      
      me.turnNumber++;
      me.currentPlayerIndex = (me.currentPlayerIndex+1)%me.players.length;
      me.currentPlayer = me.players[me.currentPlayerIndex];
      me.currentTurnMovedUnits = [];
      console.log(me.currentPlayer, "Turn", me.turnNumber);
      me.getCurrentPlayerUnits().forEach(function(u){
         u.reset();
      });
      if(me.currentPlayerIndex !== 0){
         me.runAI();
      }

   }

   me.getMovesLeft = function(){
      return me.getCurrentPlayerUnits().reduce(function(accum, current){
         if(!current.actionComplete){
            return accum + 1;
         }else{
            return accum;
         }
      }, 0);
   }

   me.delayed = function (delay, fcn){
      var complete = new ex.Promise();
      setTimeout(function(){
         var results = fcn.call();
         complete.resolve(results);
      }, delay);

      return complete;
   }

   me.addScript = function(fcn){
      me._scripts.push(fcn);
   }

   me.playScript = function(delay){
      
      for(var i = 0; i< me._scripts.length; i++){         
         var currentScript = me._scripts[i];   
         setTimeout(currentScript, delay*i + delay);
      }
      
   }

   me.runAI = function(){
      console.log("Running ai");
      var myUnits = me.getCurrentPlayerUnits();
      var enemyUnits = me.getEnemyPlayerUnits();

      //check if any attacks can be made
      myUnits.forEach(function(u){    
         var targets = me.getAttackableUnitsInRange(u);     
         if(targets.length > 0){
            me.addScript(function(){            
               me.board.selection = u.cell;
               me.board.currentUnit = u;
               me.board.selectionFsm.currentState = SelectionStates.Attack;
            });
            me.addScript(function(){
               me.board.selectionFsm.currentState = SelectionStates.NoSelection;
               u.attack(targets[0]);   
            });               
         } 
      });

      me.addScript(function(){
         me.endTurn();
      });

      me.playScript(300);
      //move closer to enemy units

      //attack if able

      //wait if must

      //end turn

      //me.endTurn();
   }


   return me;
}