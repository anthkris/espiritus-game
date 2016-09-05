var Espiritus = Espiritus || {};

Espiritus.Dialog = function(game, message, item, player) {
  Phaser.Sprite.call(this, game);
    this.message = message;
    this.item = item;
    //console.log(this.item);
    this.player = player;

    if (this.item === "key") {
        this.modalBG = this.game.add.sprite(10, this.game.world.height/2, 'modalBG');
        this.modalBG.scale.setTo(0.2);
        this.textObject = this.game.add.bitmapText(18, this.game.world.height/2 + 5, 'nokia', this.message, 14);
    } else if (this.player.position.y < this.game.world.height / 2) {
        this.modalBG = this.game.add.sprite(this.game.camera.width/4, this.game.world.height - 122, 'modalBG');
        this.textObject = this.game.add.bitmapText(this.game.camera.width/4 + 50, this.game.world.height - 110, 'nokia', this.message, 20);
        this.modalBG.scale.setTo(0.4);
    } else {
        this.modalBG = this.game.add.sprite(this.game.camera.width/4, 50, 'modalBG');
        this.textObject = this.game.add.bitmapText(this.game.camera.width/4 + 50, 70, 'nokia', this.message, 20);
        this.modalBG.scale.setTo(0.4);
    }
    
    
    this.modalBG.fixedToCamera = true;
    
    this.textObject.visible = false;
    this.textObject.fixedToCamera = true;
    this.displayLetterByLetterText(this.textObject, this.message, function(game) {
        // stuff you want to do at the end of the animation
        // eg. this.input.onDown.addOnce(this.start, this);
        this.game.time.events.add(1000, function(){
        	this.fadeOut(this.modalBG);
        	this.fadeOut(this.textObject);
        	if (this.item !== "key") {
        	    this.game.time.events.add(Phaser.Timer.SECOND, function(){
                this.voidItemVoice;
                if (this.item === "book") {
                    this.voidItemVoice = "* What do you want with a book?\n* Release your old self.\n* Remain at peace.";
                } else if (this.item === "controller") {
                    this.voidItemVoice = "* A useless controller.\n* You'd like to think you're the\n  master of your fate, but you aren't.\n* All things come to me.";
                } else if (this.item === "thermos") {
                    this.voidItemVoice = "* A thermos? For your tea?\n* You are in the darkness, my child.\n* The endless night.\n* Rest. Sleep.";
                }
                this.voidItemMessage = new Espiritus.VoidDialog(this.game, this.voidItemVoice, this.player);
                }, this);
        	}
        	
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