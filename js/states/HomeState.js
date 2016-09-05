var Espiritus = Espiritus || {};

Espiritus.HomeState = {
    create: function() {
        this.player = this.add.sprite(this.game.world.width/2, this.game.world.height/2 -150, 'player', 62);
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(2);
        this.player.animations.add('walking', [63, 60, 61, 62], 10, true);
        this.player.play('walking');
        this.game.physics.arcade.enable(this.player);
    	this.player.body.allowGravity = false;
    	
    	this.penumbra = this.game.add.audio('penumbra');
        this.penumbra.play();
        this.penumbra.loop = true;
        this.penumbra.volume = 0.5;
        
        this.ghostWhoosh = this.game.add.audio('ghostWhoosh');
        
        this.message = "* Where are you going?\n* There is no escape\n* from the Void.\n* I have only to call you\n* and you will return.";
        this.textObject = this.game.add.bitmapText(0, 300, 'nokia', this.message, 48);
        this.textObject.align = 'center';
        this.textObject.x = this.game.width / 2 - this.textObject.textWidth / 2;
        this.textObject.visible = false;
        this.displayLetterByLetterText(this.textObject, this.message, function(game) {  
            // stuff you want to do at the end of the animation
            // eg. this.input.onDown.addOnce(this.start, this);
            this.player.body.velocity.x = 150;
            this.game.time.events.add(1000 * 4.8, function(){
                this.startGame();
            }, this);
        }, this);
        this.ghostWhoosh.play();
            
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
    startGame: function(){
        this.game.state.start('GameState');
    }
};