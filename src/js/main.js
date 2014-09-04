var game = new ex.Engine(600, 600, 'game');

var loader = new ex.Loader();
for(key in Resources){
   loader.addResource(Resources[key]);
}

var unitSpriteSheet = new ex.SpriteSheet(Resources.UnitSpriteSheet, 1, 1, 100, 100);

var board = new Board(60, 60, 10, 6, 6);
game.add(board);


game.start(loader).then(function(){
   console.log("Loaded!");
   var newUnit = new Unit(unitSpriteSheet, 100, 2, "player1");
   var newUnit2 = new Unit(unitSpriteSheet, 100, 2, "player1");
   board.addUnit(3,0, newUnit);
   board.addUnit(2,5, newUnit2);
}).error(function(e){
   console.error("Error loading resources:" + e);
});