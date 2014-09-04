var Unit = ex.Actor.extend({
   constructor: function(spriteSheet, health, range, owner){
      // Call the super constructor
      ex.Actor.apply(this);
      this.owner = owner;
      this.health = health;
      this.range = range;
      this.selected = false;
      this.addDrawing("default", spriteSheet.getSprite(0).clone());
      this.setCenterDrawing(true);

      this.on('click', function(){
         this.selected = !this.selected;
         console.log('Unit owned by ' + this.owner + ' was clicked and is now ' + (this.selected?'':'not ') + 'selected');
         if(this.selected){
            this.currentDrawing.addEffect(new ex.Effects.Colorize(ex.Color.Blue));
         }else{
            this.currentDrawing.clearEffects();
         }
      });
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