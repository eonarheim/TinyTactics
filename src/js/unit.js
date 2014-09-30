
var Unit = ex.Actor.extend({
   constructor: function(spriteSheet, engine, health, range, attackRange, owner){
      // Call the super constructor
      ex.Actor.apply(this);
      this.cell = null;
      this.board = null;
      this.owner = owner;
      this.health = health;
      this.range = range;
      this.attackRange = attackRange;
      

      this.attackComplete = false;
      this.selected = false;
      this.moveComplete = false;
      this.actionComplete = false;

   
      this.UISheet = UISheet;
      this.heartSheet = heartSheet;
      this.anchor = new ex.Point(.5, 1);
      var animation = spriteSheet.getAnimationForAll(engine, 200);
      animation.loop = true;
      var darkerAnimation = spriteSheet.getAnimationForAll(engine, 200);
      darkerAnimation.addEffect(new ex.Effects.Colorize(ex.Color.Black));
      darkerAnimation.loop = true;
      
      this.addDrawing("default", animation);
      this.addDrawing("darker", darkerAnimation);

      this.setCenterDrawing(true);

      this.pipeline = [];
      this.pipeline.push(new ex.MovementModule());
      this.pipeline.push(new ex.EventPropagationModule());
    
   },
   
   canMove: function(){
      
   },

   canAttack: function(target){
      return !this.attackComplete && this.getAttackRange().indexOf(target.cell) > -1;
     
   },

   attack: function(target){
      if(this.canAttack(target)){
         Resources.HitSound.play();
         target.health--;
         target.blink(140, 140, 3);
         this.attackComplete = true;
      }
   },

   move: function(cell){
     
   },

   done: function(){
      this.actionComplete = true;
      this.moveComplete = true;
      this.attackComplete = true;
   },

   reset: function(){
      this.attackComplete = false;
      this.selected = false;
      this.moveComplete = false;
      this.actionComplete = false;
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
            if(accum.indexOf(cur) === -1 && !cur.unit){
               accum.push(cur);
            }
            return accum;
         }, []);
      }
      return [];

   },

   getAttackRange: function(){
     if(this.cell){
         var accum = [];
         this._getRangeHelper(this.cell, accum, this.attackRange);
         return accum.reduce(function(accum, cur){
            if(accum.indexOf(cur) === -1){
               accum.push(cur);
            }
            return accum;
         }, []);
      }
      return [];
   },

   update: function(engine, delta){
      // Call super update
      ex.Actor.prototype.update.apply(this, [engine, delta]);

      if(this.actionComplete){
         this.setDrawing("darker");
      }else{
         this.setDrawing("default");
      }


   },

   draw: function(ctx, delta){
      // Call super draw
      ex.Actor.prototype.draw.apply(this, [ctx, delta]);

      this.heartSheet.getSprite(this.health).draw(ctx, this.x-5, this.y-5);
   }
});