var MouseButton = {
   Left : 1,
   Middle : 2,
   Right : 3,
}

// Tiny Tactics board structure
var Board = ex.Actor.extend({
   constructor: function(tileWidth, tileHeight, margin, rows, cols){
      // Call super constructor
      ex.Actor.apply(this);

      // Turn managment
      this.turnManager = null;

      // Unit UI
      this.unitUI = new UnitUI();

      // particle emitter

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
      this.currentUnitAttack = [];
      this.currentUnitPath = [];

      // Current selection
      this.selectionFsm = selectionFsm;
      var that = this;
      this.selectionFsm.onEnter(SelectionStates.NoSelection, function(){
         that.selection = null;
         
         that.currentUnit = null;
         that.currentUnitRange = [];
         this.currentUnitAttack = [];
         that.currentUnitPath = [];
         return true;
      });

      this.selectionFsm.onEnter(SelectionStates.Selection, function () {
         if(!that.turnManager.canMoveUnit(that.currentUnit)){
            return false;
         }         

         that.currentUnitRange = that.currentUnit.getMovementRange();  
         that.currentUnitAttack = that.currentUnit.getAttackRange();                
         Resources.SelectSound.play();
         return true;
      });

      this.selectionFsm.on(SelectionStates.Confirm, function(entryState){
         if(entryState === SelectionStates.Attack){
            that.selectionFsm.go(SelectionStates.NoSelection);
         }
      })

      // If the unit has not attacked it may enter the attack selection state
      this.selectionFsm.onEnter(SelectionStates.Attack, function(){
         var isAbleToAttack = !that.currentUnit.attackComplete;
         if(!isAbleToAttack){
            console.log("CANT ATTACK");
         }
         return isAbleToAttack;
      });

      // If the unit has not attacked or moved it may enter the move selection state
      this.selectionFsm.onEnter(SelectionStates.Move, function(){
         var isAbleToMove = !that.currentUnit.attackComplete && !that.currentUnit.moveComplete;
         if(!isAbleToMove){
            console.log("CANT MOVE");
         }
         return isAbleToMove;
      });

      this.selectionFsm.onEnter(SelectionStates.Confirm, function(entryState){
         if(entryState === SelectionStates.Attack){
            // todo attack other valid unit;
            var attackUnit = that.attackSelectedUnit(that.selection);
            if(attackUnit){
               that.currentUnit.actionComplete = true;   
            }            
         }

         if(entryState === SelectionStates.Move){
            // has moved may attack other unit
            var complete = that.moveSelectedUnit(that.selection);
            complete.then(function(){
               that.currentUnitAttack = that.currentUnit.getAttackRange();
               that.selectionFsm.go(SelectionStates.Attack);
            });            
         }

         return true;
      });

      this.selectionFsm.onEnter(SelectionStates.Cancel, function(entryState){
         // move unit
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
         // Discover the mouseclick
         var button = null;
         if ("which" in click.mouseEvent) {  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            button = (click.mouseEvent.which == MouseButton.Right)?MouseButton.Right:MouseButton.Left; 
         } else if ("button" in click.mouseEvent) {  // IE, Opera 
            button = (click.mouseEvent.button == 2)?MouseButton.Right:MouseButton.Left; 
         }


         // If the left mouse button is clicked
         if(button === MouseButton.Left){
            
            var cell = this.getCellFromClick(click.x, click.y);             
           
            // Unit selected
            if(cell && cell.unit &&
             this.turnManager.canMoveUnit(cell.unit) && 
             this.selectionFsm.currentState === SelectionStates.NoSelection){
               this.currentUnit = cell.unit;              
               this.selectionFsm.go(SelectionStates.Selection);
               return;
            }

            if(this.selectionFsm.currentState === SelectionStates.Selection){
               var selection = this.unitUI.getSelection(click.x, click.y);
               if(selection === "Attack"){
                  this.selectionFsm.go(SelectionStates.Attack);
                  return;
               }

               if(selection === "Move"){                  
                  this.selectionFsm.go(SelectionStates.Move);
                  return;
               }

               if(selection === "Wait"){
                  this.currentUnit.done();
                  this.selectionFsm.go(SelectionStates.NoSelection);
               }

               this.selectionFsm.go(SelectionStates.NoSelection);
               return;
            }

            if(this.selectionFsm.currentState === SelectionStates.Attack){
               if(this.currentUnitAttack.indexOf(cell) > -1){
                  this.selection = cell;
                  this.selectionFsm.go(SelectionStates.Confirm);
               }else{
                  this.selectionFsm.go(SelectionStates.Cancel);
               }
               return;
            }

            if(this.selectionFsm.currentState === SelectionStates.Move){
               if(this.currentUnitRange.indexOf(cell) > -1){
                  this.selection = cell;
                  this.selectionFsm.go(SelectionStates.Confirm);
               }else{
                  this.selectionFsm.go(SelectionStates.Cancel);
               }

               return;
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

   selectUnit: function(unit){
      this.selection = unit.cell;
      this.currentUnit = unit;
      this.currentUnitRange = unit.getMovementRange();  
      this.currentUnitAttack = unit.getAttackRange();                
      Resources.SelectSound.play();
   },
   addUnit: function(x, y, unit){
      var cell = this.cells[x + y * this.cols];
      unit.cell = cell;
      unit.board = this;
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

   moveSelectedUnitXY: function(x, y){
      this.moveSelectedUnit(this.getCell(x,y));
   },

   moveSelectedUnit: function(destCell){
      var that = this;
      var destCell = destCell;
      var complete = new ex.Promise();
      this.currentUnitPath.forEach(function(cell){
         var cellCenter = cell.getCenterPoint();
         that.currentUnit.moveTo(cellCenter.x, cellCenter.y, 80);
         that.currentUnit.callMethod(function(){
            emitter.x = this.x; 
            emitter.y = this.y;
            console.log(this);
            emitter.emit(5);
            Resources.MoveSound.play();
         });
         that.currentUnit.delay(100);
      });
      this.currentUnit.callMethod(function(){
         this.moveComplete = true;
         that.setUnit(destCell.x, destCell.y, this);
         //that.selectionFsm.go(SelectionStates.NoSelection);
         complete.resolve();
      });
      return complete;
           
   },

   attackSelectedUnit: function(destCell){

      if(destCell.unit && this.turnManager.isEnemyUnit(destCell.unit)){
         this.currentUnit.attack(destCell.unit);
         return true;
      }
      return false;
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
            return !node.solid && !node.unit;
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
   update: function(engine, delta){
      ex.Actor.prototype.update.apply(this, [engine, delta]);
      emitter.update(engine, delta);
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
      if(this.selectionFsm.currentState === SelectionStates.Move){
         this.currentUnit.getMovementRange().forEach(function(cell){
            cell.drawHighlight(ctx, "light", delta);
         });

         if(this.currentUnitPath && this.currentUnitPath.length){
            this.currentUnitPath.forEach(function(cell){
               cell.drawHighlight(ctx, "dark", delta);
            });
         }
      }

       // Draw attack range of unit
      if(this.selectionFsm.currentState === SelectionStates.Attack){
         if(this.currentUnitAttack.length){
            this.currentUnitAttack.forEach(function(cell){
               cell.drawHighlight(ctx,"dark", delta);
            });
         }
      }
      
      emitter.draw(ctx, delta);

       // Draw units
      unitsToDraw.forEach(function(unit){
         if(unit.visible){
            unit.draw(ctx, delta);
         }
      });

      // Draw ui
      if(this.selectionFsm.currentState === SelectionStates.Selection){
         
         var point = new ex.Point(this.currentUnit.x, this.currentUnit.y);

         this.unitUI.draw(ctx, point.x, point.y);

      }

      ctx.restore();
   }
});