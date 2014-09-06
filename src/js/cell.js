var Cell = function(x, y, board){
   var me = this;
   me.x = x;
   me.y = y;
   me.board = board;
   me.unit = null;
   me.solid = false;
   me.image = grassSpriteSheet.getSprite(0).clone();
   me.gscore = 0;
   me.hscore = 0;
   me.opened = false;

   me.getNeighbors = function(){
      return [me.board.getCell(x+1, y),
              me.board.getCell(x, y+1),
              me.board.getCell(x-1, y),
              me.board.getCell(x, y-1)].filter(function(cell){
               return cell !== null;
              });
   }

   me.draw = function(ctx){
      me.image.draw(ctx, me.x * (board.tileWidth + board.margin)+ board.margin, me.y * (board.tileHeight + board.margin)+ board.margin);
      
   }

   me.drawHighlight = function(ctx, color, delta){
      var color = color.clone();
      color.a = .5;
      ctx.fillStyle = color.toString();
      ctx.fillRect(me.x * (board.tileWidth + board.margin) + board.margin, me.y * (board.tileHeight + board.margin)+ board.margin, board.tileWidth, board.tileHeight);
   }

   return me;
}