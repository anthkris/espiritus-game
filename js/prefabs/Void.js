var Espiritus = Espiritus || {};

Espiritus.VoidDialog = function(game, message) {
  Phaser.Sprite.call(this, game);
    this.message = message;
    this.voidDialog = this.game.add.sprite(this.game.camera.width/6, 10, 'voidBG');
    this.voidDialog.alpha = 0.6;
    console.log(this.voidDialog);
    this.voidDialog.scale.setTo(0.9);
    this.voidDialog.fixedToCamera = true;
    
    this.textObject = this.game.add.bitmapText(this.game.camera.width/4 + 100, 20, 'nokia', this.message, 24);
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