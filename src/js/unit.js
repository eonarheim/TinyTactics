var Unit = ex.Actor.extend({
   constructor: function(spriteSheet, engine, health, range, attackRange, owner){
      // Call the super constructor
      ex.Actor.apply(this);
      this.cell = null;
      this.owner = owner;
      this.health = health;
      this.range = range;
      this.attackRange = attackRange;

      this.heartSheet = heartSheet;
      this.anchor = new ex.Point(.5, 1);
      var animation = spriteSheet.getAnimationForAll(engine, 200);
      animation.loop = true;
      this.addDrawing("default", animation);
      this.setCenterDrawing(true);

      this.pipeline = [];
      this.pipeline.push(new ex.MovementModule());
      this.pipeline.push(new ex.EventPropagationModule());
    
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
      this.heartSheet.getSprite(this.health).draw(ctx, this.x-5, this.y-5);


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