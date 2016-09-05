var Espiritus = Espiritus || {};

Espiritus.GameOverState = {
    init: function(death, lifeItemNum) {
        this.death = death;
        this.lifeItemNum = lifeItemNum;
    },
    create: function() {
        //console.log(this.death);
        if (this.death === "water") {
            this.message = "* Rest, my child.\n* Sleep deep.\n* Dream no more.";
        } else if (this.death === "spike") {
            this.message = "* No more pain.\n* No more striving.\n* Rest.";
        } else if (this.death === "win" && this.lifeItemNum < 3) {
            this.message = "You think you've escaped.\nHa, ha, ha.\nBut you'll return.\nYou've left your\nmemories behind.";
        } else if (this.death === "win" && this.lifeItemNum === 3) {
            this.message = "Go, then, with my blessing.\nBut never forget...\nWe will meet again.";
        } else {
            this.message = "* It's so easy.\n* Letting go.\n* So peaceful.";
        }
        this.textObject = this.game.add.bitmapText(0, 300, 'nokia', this.message, 48);
        this.textObject.align = 'center';
        this.textObject.x = this.game.width / 2 - this.textObject.textWidth / 2;
        this.textObject.visible = false;
        var that = this;
        this.displayLetterByLetterText(this.textObject, this.message, function(game) {  
                // stuff you want to do at the end of the animation
                // eg. this.input.onDown.addOnce(this.start, this);
                this.game.time.events.add(1000 * 2, function() {
                if (that.death !== "win") {
                    this.startAgain =  this.game.add.bitmapText(0, 500, 'nokia', "Return to the Void", 36);
                    this.startAgain.align = 'center';
                    this.startAgain.x = this.game.width / 2 - this.startAgain.textWidth / 2;
                    this.startAgain.inputEnabled = true;
                    this.startAgain.events.onInputDown.add(this.restartGame, this);
                } else {
                    this.gameOver =  this.game.add.bitmapText(0, 550, 'nokia', "A small game of the Void by K. Anthony", 20);
                    this.gameOver.align = 'center';
                    this.gameOver.x = this.game.width / 2 - this.gameOver.textWidth / 2;
                }  
                
                }, this);
            }, this);
    },
    displayNextLetter: function() {
		this.textObject.visible = true;
        this.textObject.text = this.message.substr(0, this.counter);
        this.counter += 1;
    },
    displayLetterByLetterText:function (textObject, message, onCompleteCallback) {
        var timerEvent = this.game.time.events.repeat(110, message.length, this.displayNextLetter, 
                                { textObject: textObject, message: message, counter: 1 });
        timerEvent.timer.onComplete.addOnce(onCompleteCallback, this);
    },
    restartGame: function(){
        this.game.state.start('GameState');
    }
};