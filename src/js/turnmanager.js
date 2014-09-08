var TurnManager = function(board, players){
   var me = this;
   me.turnNumber = 1;
   me.players = players;
   me.board = board;

   me.currentPlayerIndex = 0;
   me.currentPlayer = players[me.currentPlayerIndex];
   me.currentTurnMovedUnits = [];


   me.getPlayerUnits = function(playerName){
      return me.board.sceneNode.children.filter(function(unit){
         unit.owner === playerName;
      });
   }

   me.getCurrentPlayerUnits = function(){
      me.getPlayerUnits(me.currentPlayer);
   }

   me.endTurn = function(){
      me.turnNumber++;
      me.currentPlayerIndex = (me.currentPlayerIndex+1)%me.players.length;
      me.currentPlayer = me.players[me.currentPlayerIndex];
      me.currentTurnMovedUnits = [];
   }


   return me;
}