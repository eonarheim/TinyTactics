var game = new ex.Engine(800, 800, 'game');
game.backgroundColor = ex.Color.Azure;

// Configure Resources
var loader = new ex.Loader();
for(key in Resources){
   loader.addResource(Resources[key]);
}

var unitSpriteSheet = new ex.SpriteSheet(Resources.UnitSpriteSheet, 4, 1, 32, 32);
var spiderSheet = new ex.SpriteSheet(Resources.SpiderSheet, 4, 1, 32, 32);
var heartSheet = new ex.SpriteSheet(Resources.HeartSheet, 6, 1, 32, 32);
var terrainSheet = new ex.SpriteSheet(Resources.TerrainSheet, 5, 5, 32, 32);
var cloudSheet = new ex.SpriteSheet(Resources.CloudSheet, 1, 1, 100, 100);
var highlightSheet = new ex.SpriteSheet(Resources.HighlightSheet, 5, 1, 32, 32);

var darkHighlight = highlightSheet.getAnimationForAll(game, 100);
darkHighlight.loop = true;
darkHighlight.addEffect(new ex.Effects.Colorize(ex.Color.Red));
darkHighlight.addEffect(new ex.Effects.Opacity(.75));

var lightHighlight = highlightSheet.getAnimationForAll(game, 100);
lightHighlight.loop = true;
lightHighlight.addEffect(new ex.Effects.Opacity(.75));


// Add clouds :3
game.add(new Cloud(800, 0));
game.add(new Cloud(400, 300));
game.add(new Cloud(700, 700));

var board = new Board(32, 32, 2, 6, 6);
var turnManager = new TurnManager(board, ["Player", "Spiders"]);
board.turnManager = turnManager;
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
   var newUnit = new Unit(unitSpriteSheet, game, 5, 4, 1, "Player");
   var newUnit2 = new Unit(unitSpriteSheet, game, 5, 4, 1, "Player");
   board.addUnit(3,0, newUnit);
   board.addUnit(2,5, newUnit2);

   var spider1 = new Unit(spiderSheet, game, 5, 1, 1, "Spiders");
   var spider2 = new Unit(spiderSheet, game, 5, 1, 1, "Spiders");
   spider1.anchor = new ex.Point(.5, .75);
   spider2.anchor = new ex.Point(.5, .75);
   board.addUnit(0,0, spider1);
   board.addUnit(5,5, spider2);

}).error(function(e){
   console.error("Error loading resources:" + e);
});