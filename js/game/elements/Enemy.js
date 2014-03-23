Enemy = function(index, playState, x, y, image)
{
    this.index = index;
    this.playState = playState;
    this.game = this.playState.game;
    
    this.isMoving = false;
    this.speed = 2;
    this.alive = true;
    this.direction = null;
    this.directionChangeCounter = 0;
    
    this.sprite = this.game.add.sprite(x, y, image);
    this.sprite.body.setRectangle(16, 16, 0, 0);
    this.sprite.animations.add('fly', [0, 1]);
};

Enemy.prototype =
{
    update: function()
    {
        this.sprite.animations.play('fly', 6);
        this.move();
    },
    
    randDirection: function()
    {
        var allowedDirections = ['left', 'right', 'up', 'down'];
        this.direction = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
    },
    
    move: function()
    {
        var tileIndexX;
        var tileIndexY;
        var currentTile;
        
        if (this.isMoving)
        {
            currentTile = this.playState.map.getTile(tileIndexX, tileIndexY, 'walls');

            // Reappear on the to opposite side
            if (this.sprite.body.x < -this.playState.tileSize)
            {
                this.sprite.body.x = this.game.width;
            }
            else if (this.sprite.body.x > this.game.width)
            {
                this.sprite.body.x = -this.playState.tileSize;
            }
            else if (this.sprite.body.y < -this.playState.tileSize)
            {
                this.sprite.body.y = this.game.height;
            }
            else if (this.sprite.body.y > this.game.height)
            {
                this.sprite.body.y = -this.playState.tileSize;
            }

            // Current direction
            if (this.direction === 'left' && this.playState.canMove('left', this.sprite.body.x, this.sprite.body.y))
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
        }
        else
        {
            this.directionChangeCounter += 1;
            
            if (this.directionChangeCounter >= 4)
            {
                this.randDirection();
                
                this.isMoving = true;
                this.directionChangeCounter = 0;
            }
        }
    }
};