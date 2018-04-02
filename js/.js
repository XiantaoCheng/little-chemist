var menuState = {
    preload: function(){
        game.load.pack('GUIs', 'json/assets.json', null, this);
        game.load.pack('screens', 'json/assets.json', null, this);
        
    },

    create: function(){
        
        var background=game.add.sprite(0,0,'menu');
        background.scale.setTo(0.5,0.5);
        
        var button1 = game.add.button(game.world.centerX - 100, 400, 'start', this.start, this, 0,1,0); 
        var button2 = game.add.button(game.world.centerX - 100, 200, 'start', this.start, this, 0,1,0);     
        button1.scale.setTo(0.5,0.5);
        button2.scale.setTo(2,2);

        game.input.onDown.add(Down_Test,this);
    },
    
    start: function(){
        
    }
    
}
