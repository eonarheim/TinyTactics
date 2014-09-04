var Unit = ex.Actor.extend({
   constructor: function(spriteSheet, health, range, owner){
      // Call the super constructor
      ex.Actor.apply(this);
      this.cell = null;
      this.owner = owner;
      this.health = health;
      this.range = range;

      this.anchor = new ex.Point(.5, 1);
      this.addDrawing("default", spriteSheet.getSprite(0).clone());
      this.setCenterDrawing(true);
    
   },

   _getRangeHelper: function(cell, accum, range){
      
      if(range >= 0){
         if(!cell.solid){
            accum.push(cell);
            var that = this;
            cell.getNeighbors().forEach(function(cell){
               that._getRangeHelper(cell, accum, range - 1);
            });
         }
      }
   },

   getMovementRange: function(){
      if(this.cell){
         var accum = [];
         this._getRangeHelper(this.cell, accum, this.range);
         return accum.reduce(function(accum, cur){
            if(accum.indexOf(cur) === -1){
               accum.push(cur);
            }
            return accum;
         }, []);
      }
      return [];

   },
   draw: function(ctx, delta){
      // Call super draw
      ex.Actor.prototype.draw.apply(this, [ctx, delta]);
/*
      if(this.selected){
         for(var i = 0; i < range; i++){
            for(var j = 0; j < range; j++){
               ctx.drawRect(this.x, this.y, this.width, this.height);      
            }
         }
         
      }*/

   }
});