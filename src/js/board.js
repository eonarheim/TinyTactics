// Tiny Tactics board structure
var Board = ex.Actor.extend({
   constructor: function(tileWidth, tileHeight, margin, rows, cols){
      // Call super constructor
      ex.Actor.apply(this);
      
      this.tileWidth = tileWidth;
      this.tileHeight = tileHeight;
      this.margin = margin;
      this.rows = rows;
      this.cols = cols;

      // initialize empty array to hold our units
      this.units = new Array(rows*cols);

      // Clear the update pipeline so only events are propagated
      this.pipeline = [];
      this.pipeline.push(new ex.EventPropagationModule());
   },

   addUnit: function(x, y, unit){
      this.units[x + y * this.cols] = unit;
      unit.x = x * (this.tileWidth + this.margin) + this.tileWidth/2;
      unit.y = y * (this.tileHeight + this.margin) + this.tileHeight/2;
      unit.width = this.tileWidth;
      unit.height = this.tileHeight;
      this.addChild(unit);
   },

   removeUnit: function(x, y){
      var index = x + y * this.cols;
      var unit = this.units[index];
      this.units[index] = null;
      this.removeChild(unit);
      return unit;
   },

   getUnit: function(x, y){
      return this.units[x + y * this.cols];
   },


   draw: function(ctx, delta){
      var currx = this.margin;
      var curry = this.margin;
      for(var i = 0; i < this.cols; i++){
         for(var j = 0; j < this.rows; j++){
            ctx.fillStyle = ex.Color.Green.toString();
            ctx.fillRect(currx, curry, this.tileWidth, this.tileHeight);

            // if a unit is on a square draw it
            var unit = null;
            if(unit = this.getUnit(i, j)){               
               unit.draw(ctx, delta);               
            }


            curry += (this.tileHeight + this.margin);
         }
         curry = this.margin; // restart the y's to the top
         currx += (this.tileWidth + this.margin);
      }
   }
});