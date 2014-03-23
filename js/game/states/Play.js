GameVar.Play = function(game)
{
    this.game = game;
    this.tileSize = 32;
    this.tileTypes = {'wall': 1, 'wall_2': 2, 'coin': 3};
    this.hud = null;
    this.hudHeight = 32;
    this.scoreText = null;
    this.coinsTotal = 264;
    this.coinsCollected = 0;
    this.enemies = [];
    this.spawnedEnemies = 5;
    this.enemySpawnTimer = null;
    this.cursors = null;
    this.fireballs = [];
    this.fireButton = null;
};

GameVar.Play.prototype =
{
    create: function()
    {
        var that = this;
     
        this.background = this.add.tileSprite(0, 0, 800, 640, 'background');

        this.map = this.add.tilemap('level_1');
        this.map.addTilesetImage('boxes', 'boxes');
        this.map.addTilesetImage('coin', 'coin');
        this.map.setCollision(1);
        this.map.setCollision(2);

        this.layer = this.map.createLayer('walls');
        this.layer.resizeWorld();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.coin_collected = this.add.audio('coin_collected');
        this.shot = this.add.audio('shot');
        this.hit = this.add.audio('hit');
        this.dying = this.add.audio('dying');
        
        this.scoreText = this.game.add.text(5, 5, 'SCORE: '+GameVar.score,
        {
            font: 'bold 18px Arial',
            fill: '#fff',
            stroke: '#753a21',
            strokeThickness: 5
        });
        
        // Create player
        this.player = new Player(this, 384, 320, 'player');
        
        // Create enemies
        for (var i = 0; i < 5; i++)
        {
            this.enemies.push(new Enemy(i, this, 384, 256, 'enemy'));
        }
        
        this.enemySpawnTimer = this.time.events.loop(5000, function() {
            that.enemies.push(new Enemy(1, that, 384, 256, 'enemy'));
            that.spawnedEnemies += 1;
        });
        
        // Create fireballs
        this.fireballs = this.game.add.group();
        this.fireballs.createMultiple(5, 'fireball');
        this.fireballs.setAll('outOfBoundsKill', true);
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    
    update: function()
    {
        this.player.update();

        for (var i = 0; i < this.enemies.length; i++)
        {
            if (this.enemies[i].alive)
            {
                this.physics.overlap(this.player.sprite, this.enemies[i].sprite, this.enemyHitsPlayer, null, this);
                this.physics.overlap(this.fireballs, this.enemies[i].sprite, this.fireballHitsEnemy, null, this);
                this.enemies[i].update();
            }
        }
        
        this.physics.collide(this.fireballs, this.layer, this.fireballHitsWall);
        
        if (this.spawnedEnemies >= 15)
        {
            this.time.events.remove(this.spawnEnemyTimer);
        }
        
        // Remove stopped fireballs
        this.fireballs.forEachAlive(function(fireball)
        {
            if (fireball.body.velocity.x === 0 && fireball.body.velocity.y === 0)
            {
                fireball.kill();
            }
        });        
        
        // Scroll the background
        this.background.tilePosition.y += 0.3;
    },

    render: function() {},
    
    isOnWholeTile: function(x, y)
    {
        return this.isOnTileCenter(parseInt(x)) && this.isOnTileCenter(parseInt(y));
    },

    isOnTileCenter: function(x)
    {
        return x % this.tileSize === 0;
    },
    
    canMove: function(direction, x, y)
    {
        if ( ! this.isOnWholeTile(x, y))
        {
            return true;
        }
        
        var layerIndex = this.map.getLayer('walls');
        var tileIndexX = this.layer.getTileX(x);
        var tileIndexY = this.layer.getTileY(y);  
        var tileLeft;
        var tileRight;
        var tileBelow;
        var tileAbove;
        
        if (direction === 'left')
        {
            tileLeft = this.map.getTileLeft(layerIndex, tileIndexX, tileIndexY);

            if ( ! tileLeft || ! tileLeft.collides)
            {
                return true;
            }
        }
        else if (direction === 'right')
        {
            tileRight = this.map.getTileRight(layerIndex, tileIndexX, tileIndexY);

            if ( ! tileRight || ! tileRight.collides)
            {
                return true;
            }
        }
        else if (direction === 'up')
        {
            tileAbove = this.map.getTileAbove(layerIndex, tileIndexX, tileIndexY);

            if ( ! tileAbove || ! tileAbove.collides)
            {
                return true;
            }
        }
        else if (direction === 'down')
        {
            tileBelow = this.map.getTileBelow(layerIndex, tileIndexX, tileIndexY);

            if ( ! tileBelow || ! tileBelow.collides)
            {
                return true;
            }
        }

        return false;
    },
    
    enemyHitsPlayer: function()
    {
        this.time.events.remove(this.enemySpawnTimer);
        this.player.sprite.destroy();
        
        for (var i = 0; i < this.enemies.length; i++)
        {
            this.dying.play();
            this.enemies[i].sprite.destroy();
        }
        
        this.game.state.start('Loss');
    },
    
    fireballHitsEnemy: function(enemy, fireball) {
        enemy.kill();
        fireball.kill();
        
        this.hit.play();
        this.addScore(100);
    },
    
    fireballHitsWall: function(fireball) {
        fireball.kill();
    },
    
    addScore: function(score)
    {
        GameVar.score += score;
        this.scoreText.setText('SCORE: '+GameVar.score);
    },
    
    removeScore: function(score)
    {
        GameVar.score -= score;
        
        if (GameVar.score < 0)
        {
            GameVar.score = 0;
        }
        
        this.scoreText.setText('SCORE: '+GameVar.score);
    }
};