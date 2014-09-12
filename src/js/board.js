// Tiny Tactics board structure
var Board = ex.Actor.extend({
   constructor: function(tileWidth, tileHeight, margin, rows, cols){
      // Call super constructor
      ex.Actor.apply(this);

      // Turn managment
      this.turnManager = null;

      // TODO: Fix this crap
      this.anchor = new ex.Point(0, 0);
      this.x = 20;
      this.y = 20;
      this.scaleX = 3;
      this.scaleY = 3;
      this.width =  (tileWidth + margin) * cols;
      this.height =  (tileHeight + margin) * rows;

      this.selection = null;
      this.currentUnit = null;
      this.currentUnitRange = [];
      this.currentUnitPath = [];

      // Current selection
      this.selectionFsm = selectionFsm;
      var that = this;
      this.selectionFsm.onEnter(SelectionStates.NoSelection, function(){
         that.selection = null;
         that.currentUnit = null;
         that.currentUnitRange = [];
         that.currentUnitPath = [];
         return true;
      });

      this.selectionFsm.onEnter(SelectionStates.UnitHighlighted, function () {
         if(!that.turnManager.canMoveUnit(that.currentUnit)){
            return false;
         }

         that.currentUnitRange = that.currentUnit.getMovementRange();                  
         Resources.SelectSound.play();
         return true;
      });

            
      
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
         if(this.selectionFsm.currentState !== SelectionStates.UnitMoving){
            var cell = this.getCellFromClick(click.x, click.y);             

            if(this.selectionFsm.canGo(SelectionStates.UnitHighlighted)){               
               if(cell && cell.unit && !cell.unit.moveComplete){
                  this.currentUnit = cell.unit;
                  this.selectionFsm.go(SelectionStates.UnitHighlighted);
                  return;
               }
            }

            if(this.selectionFsm.canGo(SelectionStates.UnitMoving)){
               if(this.currentUnitPath.indexOf(cell) > -1){
                  this.selectionFsm.go(SelectionStates.UnitMoving);       
                  this.moveSelectedUnit(cell);           
                  return;
               }
            }

            // If anything else happens go to no selection
            this.selectionFsm.go(SelectionStates.NoSelection);
         }       
      });

      this.on('mousemove', function(mouse){
         var cell = this.getCellFromClick(mouse.x, mouse.y);
         if(this.currentUnit && cell && this.currentUnitRange.indexOf(cell) > -1){
            this.currentUnitPath = this.findPath(this.currentUnit.cell, cell);

         }else{
            this.currentUnitPath = [];
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
   
   setUnit: function(x, y, unit){
      unit.cell.unit = null;
      unit.cell = null;


      var index = x + y * this.cols;      
      unit.cell = this.cells[index];
      this.cells[index].unit = unit;
   },

   moveSelectedUnit: function(destCell){
      var that = this;
      var destCell = destCell;
      this.currentUnitPath.forEach(function(cell){
         var cellCenter = cell.getCenterPoint();
         that.currentUnit.moveTo(cellCenter.x, cellCenter.y, 80);
         that.currentUnit.callMethod(function(){
            Resources.MoveSound.play();
         });
         that.currentUnit.delay(100);
      });
      this.currentUnit.callMethod(function(){
         this.moveComplete = true;
         that.setUnit(destCell.x, destCell.y, this);
         that.selectionFsm.go(SelectionStates.NoSelection);
      });
           
   },

   findPath: function(startCell, endCell){
      // clear nodes of pre-existing values
      this.cells.forEach(function(cell){
         cell.gscore = 0;
         cell.hscore = 0;
         cell.opened = false;
         cell.previousNode = null;
      });
      
      // Define heuristic function
      var heuristicWeight = 1.0;
      var _euclideanHeuristic = function(start, end){
         return Math.sqrt(Math.pow(start.x -end.x,2) + Math.pow(start.y - end.y,2));
      };

      // Path builder
      var _buildPath = function(current){
         var path = [];
         while(current.previousNode){
            path.unshift(current);
            current = current.previousNode;
         }
         path.unshift(current);
         return path;
      };

      var heuristicFcn = _euclideanHeuristic;      
      var startingNode = startCell;
      var endingNode = endCell;

      startingNode.gscore = 0;
      startingNode.hscore = startingNode.gscore + heuristicFcn(startingNode, endingNode) * heuristicWeight;

      var openNodes = [startingNode];
      var closeNodes = [];
      var path = {};
      var bestPathScore = 0;

      while(openNodes.length > 0){
         var current = openNodes.sort(function(a,b){
            return a.hscore - b.hscore;
         })[0];


         // Done!
         if(current == endingNode){
            //console.log("DONE!");
            var finishedPath = _buildPath(current);
            //console.log(finishedPath);
            return finishedPath;
         }

         // Remove current from the open node set
         var index = openNodes.indexOf(current);
         openNodes.splice(index,1);
         closeNodes.push(current);


         // Find the neighbors
         var neighbors = current.getNeighbors().filter(function(node){
            return !node.solid;
         }).filter(function(node){
            return closeNodes.indexOf(node) === -1;
         });
         

         neighbors.forEach(function(node){

            if(openNodes.indexOf(node) === -1){
               node.previousNode = current;
               node.gscore = node.weight + current.gscore;
               node.hscore = node.gscore + heuristicFcn(node, endingNode) * heuristicWeight;

               openNodes.push(node);
            }

         });

      }
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
            this.getCell(i, j).draw(ctx, delta);

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

     

      // Draw movement range of unit
      if(this.selectionFsm.currentState === SelectionStates.UnitHighlighted){
         this.currentUnit.getMovementRange().forEach(function(cell){
            cell.drawHighlight(ctx, "light", delta);
         });

         if(this.currentUnitPath && this.currentUnitPath.length){
            this.currentUnitPath.forEach(function(cell){
               cell.drawHighlight(ctx, "dark", delta);
            });
         }
      }

       // Draw units
      unitsToDraw.forEach(function(unit){
          unit.draw(ctx, delta);
      });

      ctx.restore();
   }
});