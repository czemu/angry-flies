GameVar = {
    score: 0
};

GameVar.Boot = function() {};

GameVar.Boot.prototype = {
    preload: function() {
        this.load.image('loader_empty', 'assets/img/loader_empty.png');
        this.load.image('loader_full', 'assets/img/loader_full.png');
    },
    
    create: function()
    {
        this.game.state.start('Preload');
    }
};