var Espiritus = Espiritus || {};

Espiritus.Dialog = function(game, message) {
  Phaser.Sprite.call(this, game);
    this.message = message;
    this.modalBG = this.game.add.sprite(this.game.camera.width/4, this.game.world.height - 122, 'modalBG');
    this.modalBG.scale.setTo(0.7);
    this.modalBG.fixedToCamera = true;
    this.textObject = this.game.add.bitmapText(this.game.camera.width/4 + 100, this.game.world.height - 110, 'nokiaBlack', this.message, 20);
    this.textObject.visible = false;
    this.textObject.fixedToCamera = true;
    this.displayLetterByLetterText(this.textObject, this.message, function() {
        // stuff you want to do at the end of the animation
        // eg. this.input.onDown.addOnce(this.start, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){
        	this.fadeOut(this.modalBG);
        	this.fadeOut(this.textObject);
        }, this);
        //console.log("text end");
    }, this);
};

Espiritus.Dialog.prototype = Object.create(Phaser.Sprite.prototype);
Espiritus.Dialog.prototype.constructor = Espiritus.Dialog;
Espiritus.Dialog.prototype.displayNextLetter = function() {
		this.textObject.visible = true;
        this.textObject.text = this.message.substr(0, this.counter);
        this.counter += 1;
};
Espiritus.Dialog.prototype.displayLetterByLetterText = function (textObject, message, onCompleteCallback) {
    var timerEvent = this.game.time.events.repeat(80, message.length, this.displayNextLetter, 
                                { textObject: textObject, message: message, counter: 1 });
    timerEvent.timer.onComplete.addOnce(onCompleteCallback, this);
};
Espiritus.Dialog.prototype.fadeOut = function(sprite) {
    var tween = this.game.add.tween(sprite).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
	tween.onComplete.add(function() {
	    //console.log("destroy");
		sprite.destroy();
	}); 
};