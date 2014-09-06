var game = new ex.Engine(800, 800, 'game');

var loader = new ex.Loader();
for(key in Resources){
   loader.addResource(Resources[key]);
}

var unitSpriteSheet = new ex.SpriteSheet(Resources.UnitSpriteSheet, 4, 1, 32, 32);
var terrainSheet = new ex.SpriteSheet(Resources.TerrainSheet, 5, 5, 32, 32);

var board = new Board(32, 32, 2, 6, 6);
game.add(board);
game.camera.setFocus(board.getCenter().x, board.getCenter().y);

game.on('keydown', function(e){
   if(e.key === ex.InputKey.D){
      game.isDebug = true;
   }
})

game.start(loader).then(function(){
   game.setAntialiasing(false);
   console.log("Loaded!");
   var newUnit = new Unit(unitSpriteSheet, game, 32, 2, "player1");
   var newUnit2 = new Unit(unitSpriteSheet, game, 32, 4, "player1");
   board.addUnit(3,0, newUnit);
   board.addUnit(2,5, newUnit2);
}).error(function(e){
   console.error("Error loading resources:" + e);
});