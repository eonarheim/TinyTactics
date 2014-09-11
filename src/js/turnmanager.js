var TurnManager = function(board, players){
   var me = this;
   me.turnNumber = 1;
   me.players = players;
   me.board = board;

   me.currentPlayerIndex = 0;
   me.currentPlayer = players[me.currentPlayerIndex];
   me.currentTurnMovedUnits = [];

   console.log(me.currentPlayer, "Turn",me.turnNumber);


   me.getPlayerUnits = function(playerName){
      return me.board.sceneNode.children.filter(function(unit){
         return unit.owner === playerName;
      });
   }

   me.getCurrentPlayerUnits = function(){
      return me.getPlayerUnits(me.currentPlayer);
   }

   me.canMoveUnit = function(unit){
      return me.getCurrentPlayerUnits().indexOf(unit) !== -1;
   }

   me.moveUnit = function(unit, destCell){
      // todo handle unit movement here
   }

   me.endTurn = function(){
      me.turnNumber++;
      me.currentPlayerIndex = (me.currentPlayerIndex+1)%me.players.length;
      me.currentPlayer = me.players[me.currentPlayerIndex];
      me.currentTurnMovedUnits = [];
      console.log(me.currentPlayer, "Turn",me.turnNumber);
   }

   me.getMovesLeft = function(){
      return me.getCurrentPlayerUnits().length - me.currentTurnMovedUnits.length;
   }

   me.runAI = function(){

   }


   return me;
}