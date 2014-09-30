var UnitUI = function(){
   var me = this;
   me.attackButton = new ex.Actor(0, 0, 30, 30);
   me.moveButton = new ex.Actor(0, 0, 30, 30);
   me.waitButton = new ex.Actor(0, 0, 30, 30);

   me.attackButton.anchor.setTo(0,0);
   me.moveButton.anchor.setTo(0,0);
   me.waitButton.anchor.setTo(0,0);


   me.getSelection = function(x, y){
      if(me.attackButton.contains(x/3,y/3)){
         return "Attack";
      }

      if(me.moveButton.contains(x/3,y/3)){
         return "Move";
      }

      if(me.waitButton.contains(x/3,y/3)){
         return "Wait";
      }

      return null;
   }

   me.draw = function(ctx, x, y){

      me.attackButton.x = x - 20 -30;
      me.attackButton.y = y - 20;
      me.attackButton.color = 'red';

      me.moveButton.x = x + 20;
      me.moveButton.y = y - 20;
      me.moveButton.color = 'blue';

      me.waitButton.x = x - 15 ;
      me.waitButton.y = y - 60;
      me.waitButton.color = 'yellow';

     
      me.attackButton.draw(ctx);      
      me.moveButton.draw(ctx);
      me.waitButton.draw(ctx);


   }

   return me;

}