var Cell = function(x, y, board){
   var me = this;
   me.x = x;
   me.y = y;
   me.board = board;
   me.unit = null;
   me.solid = false;
   me.image = terrainSheet.getSprite(ex.Util.randomIntInRange(0,5)).clone();
   me.gscore = 0;
   me.hscore = 0;
   me.opened = false;
   me.shiftMax = 2;
   me.direction = (Math.random()<=.5?-.1:.1);
   me.currentShift = ex.Util.randomIntInRange(-me.shiftMax, me.shiftMax);
   me.shiftDuration = 1000; //ms
   me.count = 0;

   me.getCenterPoint = function(){
      return new ex.Point(me.x*(board.tileWidth + board.margin) + board.tileWidth/2, me.y*(board.tileHeight + board.margin) + board.tileHeight/2);
   }

   me.getNeighbors = function(){
      return [me.board.getCell(x+1, y),
              me.board.getCell(x, y+1),
              me.board.getCell(x-1, y),
              me.board.getCell(x, y-1)].filter(function(cell){
               return cell !== null && !cell.unit;
              });
   }

   me.draw = function(ctx, delta){

      me.image.draw(ctx, me.x * (board.tileWidth + board.margin)+ board.margin, me.y * (board.tileHeight + board.margin)+ board.margin);
    /*  me.count += delta;
      if(me.count > me.shiftDuration){
         me.currentShift += me.direction;
         if(Math.abs(me.currentShift) > me.shiftMax){
            me.direction *= -1;
         }
         me.count = 0;
      }      */
   }

   me.drawHighlight = function(ctx, color, delta){
      var color = color.clone();
      color.a = .5;
      ctx.fillStyle = color.toString();
      ctx.fillRect(me.x * (board.tileWidth + board.margin) + board.margin, me.y * (board.tileHeight + board.margin)+ board.margin, board.tileWidth, board.tileHeight);
   }

   return me;
}