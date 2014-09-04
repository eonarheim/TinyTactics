// Tiny Tactics board structure
var Board = ex.Actor.extend({
   constructor: function(tileWidth, tileHeight, margin, rows, cols){
      // Call super constructor
      ex.Actor.apply(this);

      // TODO: Fix this crap
      this.anchor = new ex.Point(0, 0);
      this.x = 20;
      this.y = 20;
      this.scaleX = 3;
      this.scaleY = 3;
      this.width =  (tileWidth + margin) * cols;
      this.height =  (tileHeight + margin) * rows;

      // Current selection
      this.selection = null;
      
      // Draw params
      this.tileWidth = tileWidth;
      this.tileHeight = tileHeight;
      this.margin = margin;
      this.rows = rows;
      this.cols = cols;


      // initialize empty array to hold our units
      this.cells = new Array(rows*cols);
      for(var i = 0; i < this.cols; i++){
         for(var j = 0; j < this.rows; j++){
            this.cells[i + j * this.cols] = new Cell(i, j, this);            
         }
      }

      // Clear the update pipeline so only events are propagated
      this.pipeline = [];
      this.pipeline.push(new ex.EventPropagationModule());

      // Initialize click events
      this.on('click', function(click){
         var cell = this.getCellFromClick(click.x, click.y);
         console.log('Cell clicked', cell);
         if(this.selection != cell){
            this.selection = cell;
         }else{
            this.selection = null;
         }
      });
   },

   addUnit: function(x, y, unit){
      var cell = this.cells[x + y * this.cols];
      unit.cell = cell;
      cell.unit = unit;
      unit.x = x * (this.tileWidth + this.margin) + this.tileWidth/2 + this.margin;
      unit.y = y * (this.tileHeight + this.margin) + this.tileHeight/2 + this.margin;
      unit.width = this.tileWidth;
      unit.height = this.tileHeight;
      this.addChild(unit);
   },

   removeUnit: function(x, y){
      var index = x + y * this.cols;
      var unit = this.cells[index].unit;
      unit.cell = null;
      this.cells[index].unit = null;
      this.removeChild(unit);
      return unit;
   },

   getCell: function(x, y){
      if(x < 0 || x >= this.cols) return null;
      if(y < 0 || y >= this.rows) return null;
      return this.cells[x + y * this.cols];
   },

   getCellFromClick: function(clickX, clickY){
      return this.getCell(Math.floor(clickX/(this.tileWidth+this.margin)/this.scaleX), Math.floor(clickY/(this.tileHeight+this.margin)/ this.scaleY));
   },

   getUnit: function(x, y){
      var potentialCell = this.getCell(x,y);
      if(potentialCell) return potentialCell.unit;
      return null;
   },

   draw: function(ctx, delta){
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.scaleX, this.scaleY);

      var currx = this.margin;
      var curry = this.margin;

      // Draw board
      var unitsToDraw = [];
      for(var i = 0; i < this.cols; i++){
         for(var j = 0; j < this.rows; j++){
            this.getCell(i, j).draw(ctx);

            // if a unit is on a square draw it
            var that = this;
            (function(){
               var unit = null;
               if(unit = that.getUnit(i, j)){               
                  unitsToDraw.push(unit);
                 
               }
            })();


            curry += (this.tileHeight + this.margin);
         }
         curry = this.margin; // restart the y's to the top
         currx += (this.tileWidth + this.margin);
      }

      // Draw units
      unitsToDraw.forEach(function(unit){
          unit.draw(ctx, delta);
      });

      // Draw movement range of unit
      if(this.selection && this.selection.unit){
         this.selection.unit.getMovementRange().forEach(function(cell){
            cell.drawHighlight(ctx, delta);
         });
      }

      ctx.restore();
   }
});