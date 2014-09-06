var Cloud = ex.Actor.extend({
   constructor: function(x, y){
      ex.Actor.apply(this, [x, y]);
      this.width = 400;
      this.height = 400;
      this.dx = ex.Util.randomInRange(-30, -100);
      var cloud = cloudSheet.getSprite(0);
      cloud.setScaleX(4);
      cloud.setScaleY(4);
      this.addDrawing("default", cloud);
      this.setCenterDrawing(true);
   },

   update: function(engine, delta){
      ex.Actor.prototype.update.apply(this, [engine, delta]);
      var screenCoords =  engine.worldToScreenCoordinates(new ex.Point(this.x, this.y));

      if(screenCoords.x + this.width < 0){
         this.x = engine.width + this.width;
      }
   }

});