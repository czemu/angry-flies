Player = function(playState, x, y, image)
{
    this.playState = playState;
    this.game = this.playState.game;
    
    this.isMoving = false;
    this.speed = 2;
    this.direction = null;
    this.nextDirection = null;
    this.lastFixedPosition = null;
    
    this.fireballSpeed = 400;
    this.fireballTime = null;
    
    this.sprite = this.game.add.sprite(x, y, image);
    this.sprite.body.setRectangle(16, 16, 0, 0);
    this.sprite.animations.add('walk_down', [1, 2]);
    this.sprite.animations.add('walk_up', [4, 5]);
    this.sprite.animations.add('walk_left', [7, 8]);
    this.sprite.animations.add('walk_right', [10, 11]);    
};

Player.prototype =
{
    update: function()
    {
        this.handleControls();
        this.updateNextDirection();
        this.move();
        this.fire();
    },
    
    changeDirection: function(direction) {
        this.nextDirection = direction;
        this.isMoving = true;
    },
    
    updateNextDirection: function()
    {
        if (this.playState.cursors.left.isDown)
        {
            this.nextDirection = 'left';
        }
        else if (this.playState.cursors.right.isDown)
        {
            this.nextDirection = 'right';
        }
        else if (this.playState.cursors.up.isDown)
        {
            this.nextDirection = 'up';
        }
        else if (this.playState.cursors.down.isDown)
        {
            this.nextDirection = 'down';
        }

        if ( ! this.direction)
        {
            this.direction = this.nextDirection;
        }    
    },
    
    move: function()
    {
        var changedDirection = false;
        var tileIndexX;
        var tileIndexY;
        var currentTile;
        
        if (this.isMoving)
        {
            // Reappear on the to opposite side
            if (this.sprite.body.x < -this.playState.tileSize)
            {
                this.sprite.x = this.game.width;
            }
            else if (this.sprite.body.x > this.game.width)
            {
                this.sprite.x = -this.playState.tileSize;
            }
            else if (this.sprite.body.y < -this.playState.tileSize)
            {
                this.sprite.y = this.game.height;
            }
            else if (this.sprite.y > this.game.height)
            {
                this.sprite.y = -this.playState.tileSize;
            }
            
            tileIndexX = this.playState.layer.getTileX(this.sprite.body.x);
            tileIndexY = this.playState.layer.getTileY(this.sprite.body.y);        
            currentTile = this.playState.map.getTile(tileIndexX, tileIndexY, 'walls');
            
            this.getCoin(currentTile);
            
            // Try next direction
            if (this.nextDirection === 'left' && this.sprite.body.y >= this.playState.tileSize && this.sprite.body.y <= this.game.height - this.playState.tileSize && this.playState.isOnWholeTile(this.sprite.body.x, this.sprite.body.y) && this.playState.canMove('left', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.x -= this.speed;
                changedDirection = true;
            }
            else if (this.nextDirection === 'right' && this.sprite.body.y >= this.playState.tileSize && this.sprite.body.y <= this.game.height - this.playState.tileSize && this.playState.isOnWholeTile(this.sprite.body.x, this.sprite.body.y) &&this.playState.canMove('right', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.x += this.speed;
                changedDirection = true;
            }
            else if (this.nextDirection === 'up' && this.sprite.body.x >= this.playState.tileSize && this.sprite.body.x <= this.game.width - this.playState.tileSize && this.playState.isOnWholeTile(this.sprite.body.x, this.sprite.body.y) && this.playState.canMove('up', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.y -= this.speed;
                changedDirection = true;
            }
            else if (this.nextDirection === 'down' && this.sprite.body.x >= this.playState.tileSize && this.sprite.body.x <= this.game.width - this.playState.tileSize && this.playState.isOnWholeTile(this.sprite.body.x, this.sprite.body.y) && this.playState.canMove('down', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.y += this.speed;
                changedDirection = true;
            }
            
            // Current direction
            else if (this.direction === 'left' && this.playState.canMove('left', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.x -= this.speed;
            }
            else if (this.direction === 'right' && this.playState.canMove('right', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.x += this.speed;
            }
            else if (this.direction === 'up' && this.playState.canMove('up', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.y -= this.speed;
            }
            else if (this.direction === 'down' && this.playState.canMove('down', this.sprite.body.x, this.sprite.body.y))
            {
                this.sprite.y += this.speed;
            }
            else
            {
                this.isMoving = false;
            }

            if (changedDirection)
            {
                this.direction = this.nextDirection;
                this.nextDirection = null;
            }

            // Animations
            if (this.isMoving && this.direction === 'down')
            {
                this.sprite.animations.play('walk_down', 6);
            }
            else if (this.isMoving && this.direction === 'up')
            {
                this.sprite.animations.play('walk_up', 6);
            }
            else if (this.isMoving && this.direction === 'right')
            {
                this.sprite.animations.play('walk_right', 6);
            }
            else if (this.isMoving && this.direction === 'left')
            {
                this.sprite.animations.play('walk_left', 6);
            }
        }
        else
        {
            if (this.direction === 'up')
            {
                this.sprite.frame = 3;
            }
            else if (this.direction === 'left')
            {
                this.sprite.frame = 6;
            }
            else if (this.direction === 'right')
            {
                this.sprite.frame = 9;                
            }
            else
            {
                this.sprite.frame = 0;
            }
        }
    },
    
    getCoin: function(currentTile)
    {
        if (currentTile && currentTile.index === this.playState.tileTypes.coin && ! currentTile.collected)
        {
            this.playState.addScore(10);

            currentTile.alpha = 0;
            currentTile.collected = true;
            
            if (this.playState.coinsCollected === this.playState.coinsTotal)
            {
                this.game.state.start('Win');
            }
            
            this.playState.coin_collected.play();
            this.playState.layer.dirty = true;
            this.playState.coinsCollected += 1;
        }
    },
    
    fire: function()
    {
        if (this.playState.fireButton.isDown)
        {
            if (this.playState.game.time.now > this.fireballTime)
            {
                fireball = this.playState.fireballs.getFirstExists(false);
                
                if (fireball)
                {
                    fireball.reset(this.sprite.x, this.sprite.y + 8);
                    
                    if (this.direction === 'up')
                    {
                        fireball.anchor.x = 0;
                        fireball.anchor.y = 1;
                        fireball.body.velocity.y = -this.fireballSpeed;
                    }
                    else if (this.direction === 'down')
                    {
                        fireball.anchor.x = 0;
                        fireball.anchor.y = -0.5;
                        fireball.body.velocity.y = this.fireballSpeed;
                    }
                    else if (this.direction === 'left')
                    {
                        fireball.anchor.x = 0.5;
                        fireball.anchor.y = 0.25;
                        fireball.body.velocity.x = -this.fireballSpeed;
                    }
                    else if (this.direction === 'right')
                    {
                        fireball.anchor.x = -0.5;
                        fireball.anchor.y = 0.25;
                        fireball.body.velocity.x = this.fireballSpeed;
                    }
                    else
                    {
                        fireball.kill();
                    }
                    
                    this.fireballTime = this.playState.game.time.now + 500;
                    this.playState.shot.play();
                    this.playState.removeScore(50);
                }
            }
        }
    },
    
    handleControls: function() {
        if (this.playState.cursors.left.isDown)
        {
            this.nextDirection = 'left';
            this.isMoving = true;
        }
        else if (this.playState.cursors.right.isDown)
        {
            this.nextDirection = 'right';
            this.isMoving = true;
        }
        else if (this.playState.cursors.up.isDown)
        {
            this.nextDirection = 'up';
            this.isMoving = true;
        }
        else if (this.playState.cursors.down.isDown)
        {
            this.nextDirection = 'down';
            this.isMoving = true;
        }
    }
};