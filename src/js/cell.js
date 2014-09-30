var Cell = function(x, y, board){
   var me = this;
   me.x = x;
   me.y = y;
   me.board = board;
   me.unit = null;
   me.solid = false;
   me.image = terrainSheet.getSprite(ex.Util.randomIntInRange(0,5)).clone();
   me.darkHighlight = darkHighlight;
   me.lightHighlight = lightHighlight;
   me.gscore = 0;
   me.hscore = 0;
   me.opened = false;
   me.shiftMax = 2;
   me.direction = (Math.random()<=.5?-.1:.1);
   me.currentShift = ex.Util.randomIntInRange(-me.shiftMax, me.shiftMax);
   me.shiftDuration = 1000; //ms
   me.count = 0;

   me.getDistance = function(cell){
      return Math.abs(this.x - cell.x) + Math.abs(this.y - cell.y);
   }

   me.getCenterPoint = function(){
      return new ex.Point(me.x*(board.tileWidth + board.margin) + board.tileWidth/2 +board.margin, me.y*(board.tileHeight + board.margin) + board.tileHeight/2+board.margin);
   }

   me.getNeighbors = function(){
      return [me.board.getCell(x+1, y),
              me.board.getCell(x, y+1),
              me.board.getCell(x-1, y),
              me.board.getCell(x, y-1)].filter(function(cell){
               return cell !== null;// && !cell.unit;
              });
   }

   me.draw = function(ctx, delta){
      me.image.draw(ctx, me.x * (board.tileWidth + board.margin)+ board.margin, me.y * (board.tileHeight + board.margin)+ board.margin);
   }

   me.drawHighlight = function(ctx, color, delta){

      if(color === 'dark'){
         this.darkHighlight.draw(ctx, me.x * (board.tileWidth + board.margin) + board.margin, me.y * (board.tileHeight + board.margin)+ board.margin);
      }else{
         this.lightHighlight.draw(ctx, me.x * (board.tileWidth + board.margin) + board.margin, me.y * (board.tileHeight + board.margin)+ board.margin);
      }
   }

   return me;
}