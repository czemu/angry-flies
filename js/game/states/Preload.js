GameVar.Preload = function() {};

GameVar.Preload.prototype =
{
    loaderFull: Phaser.Sprite,
    loaderEmpty: Phaser.Sprite,
    
    preload: function()
    {
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 45, 'LOADING', {
            font: 'bold 18px Arial',
            fill: '#fff'
        });
        text.anchor.setTo(0.5, 0.5);
        
        this.loaderEmpty = this.game.add.sprite(0, this.game.world.centerY - 25, 'loader_empty');
        this.preloadBar = this.game.add.sprite(0, this.game.world.centerY - 25, 'loader_full');
        this.game.load.setPreloadSprite(this.preloadBar);
        
        this.load.tilemap('level_1', 'assets/maps/level_1.json', null, Phaser.Tilemap.TILED_JSON);
        
        this.load.image('boxes', 'assets/img/boxes.png');
        this.load.image('coin', 'assets/img/coin.png');
        this.load.image('background', 'assets/img/background.png');
        this.load.image('fireball', 'assets/img/fireball.png');
        this.load.image('game_over', 'assets/img/game_over.png');
        
        this.load.spritesheet('player', 'assets/img/player.png', 32, 32, 12);
        this.load.spritesheet('enemy', 'assets/img/enemy.png', 32, 32, 2);
        
        this.load.audio('coin_collected', 'assets/audio/coin_collected.wav');
        this.load.audio('shot', 'assets/audio/shot.wav');
        this.load.audio('dying', 'assets/audio/dying.wav');
        this.load.audio('hit', 'assets/audio/hit.wav');
    },
    
    create: function()
    {
        this.game.state.start('Play');
    }
};