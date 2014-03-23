GameVar.Win = function(game) {
    this.game = game;
}

GameVar.Win.prototype =
{
    create: function()
    {
        var text_game_over = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 25, 'You Win', {
            font: 'bold 52px Arial',
            fill: '#FFF',
        });
        
        var text_score = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 25, 'Your score: '+GameVar.score, {
            font: 'bold 30px Arial',
            fill: '#ffcc00',
        });
        
        text_game_over.anchor.setTo(0.5, 0.5);
        text_score.anchor.setTo(0.5, 0.5);
    }
};