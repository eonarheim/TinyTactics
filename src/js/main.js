var game = new ex.Engine(800, 800, 'game');

var loader = new ex.Loader();
for(key in Resources){
   loader.addResource(Resources[key]);
}

var unitSpriteSheet = new ex.SpriteSheet(Resources.UnitSpriteSheet, 1, 1, 32, 32);
var grassSpriteSheet = new ex.SpriteSheet(Resources.GrassSpriteSheet, 1, 1, 32, 32);

var board = new Board(32, 32, 2, 6, 6);
game.add(board);
game.camera.setFocus(board.getCenter().x, board.getCenter().y);


game.start(loader).then(function(){
   game.setAntialiasing(false);
   console.log("Loaded!");
   var newUnit = new Unit(unitSpriteSheet, 32, 2, "player1");
   var newUnit2 = new Unit(unitSpriteSheet, 32, 4, "player1");
   board.addUnit(3,0, newUnit);
   board.addUnit(2,5, newUnit2);
   board.getCell(2, 4).solid = true;
}).error(function(e){
   console.error("Error loading resources:" + e);
});