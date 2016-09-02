var Espiritus = Espiritus || {};

Espiritus.VoidDialog = function(game, message, player) {
  Phaser.Sprite.call(this, game);
    this.message = message;
    this.player = player;

     if (this.player.position.y < this.game.world.height/2) {
        this.voidDialog = this.game.add.sprite(this.game.camera.width/4, this.game.world.height - 142, 'voidBG');
        this.textObject = this.game.add.bitmapText(this.game.camera.width/4 + 50, this.game.world.height - 110, 'nokia', this.message, 22);
     } else {
        this.voidDialog = this.game.add.sprite(this.game.camera.width/4, 20, 'voidBG');
        this.textObject = this.game.add.bitmapText(this.game.camera.width/4 + 50, 60, 'nokia', this.message, 22);
     }
     
    //console.log(this.voidDialog);
    this.voidDialog.scale.setTo(0.4);
    this.voidDialog.fixedToCamera = true;
    
    
    this.textObject.visible = false;
    this.textObject.fixedToCamera = true;
    
    this.displayLetterByLetterText(this.textObject, this.message, function() {
        // stuff you want to do at the end of the animation
        // eg. this.input.onDown.addOnce(this.start, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){
        	this.fadeOut(this.voidDialog);
        	this.fadeOut(this.textObject);
        }, this);
        //console.log("text end");
    }, this);
};

Espiritus.VoidDialog.prototype = Object.create(Phaser.Sprite.prototype);
Espiritus.VoidDialog.prototype.constructor = Espiritus.VoidDialog;
Espiritus.VoidDialog.prototype.displayNextLetter = function() {
		this.textObject.visible = true;
        this.textObject.text = this.message.substr(0, this.counter);
        this.counter += 1;
};
Espiritus.VoidDialog.prototype.displayLetterByLetterText = function (textObject, message, onCompleteCallback) {
    var timerEvent = this.game.time.events.repeat(80, message.length, this.displayNextLetter, 
                                { textObject: textObject, message: message, counter: 1 });
    timerEvent.timer.onComplete.addOnce(onCompleteCallback, this);
};
Espiritus.VoidDialog.prototype.fadeOut = function(sprite) {
    var tween = this.game.add.tween(sprite).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
	tween.onComplete.add(function() {
	    //console.log("destroy");
		sprite.destroy();
	}); 
};