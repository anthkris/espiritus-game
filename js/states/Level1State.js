var Espiritus = Espiritus || {};
Espiritus.Game = {
  //executed after everything is loaded
    create: function() {
        this.cursors = game.input.keyboard.createCursorKeys();
        this.hell = game.add.tileSprite(0, 0, 1274, 768, 'cave');
    	this.background = game.add.tileSprite(1220, 0, 1248, 768, 'background');
    	this.voidTimer = 0;
    	this.ghostWhoosh = this.game.add.audio('ghostWhoosh');
    	this.itemSparkle = this.game.add.audio('itemSparkle');
    	this.splashSound = this.game.add.audio('splashSound');
    	
    	this.worldBound = game.add.sprite(2395, 256, 'worldBound');
    	this.game.physics.arcade.enable(this.worldBound);
    	this.worldBound.body.allowGravity = false;
    	this.worldBound.body.immovable = true;
    	//this.worldBound.alpha = 0;
    
        //parse the file
        this.levelData = JSON.parse(this.game.cache.getText('level'));
        this.voidData = JSON.parse(this.game.cache.getText('void'));
    		
    	this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiny_tileset');
    		
    	this.platformLayer = this.map.createLayer('platforms');
        this.platformLayer.resizeWorld();
    
    		//  Set the tiles for collision.
        //  Do this BEFORE generating the bodies belosw.
        this.map.setCollisionBetween(1, 1000, true, this.platformLayer);
        // if don't return true, will allow tile to be impassable (which is fine in waters)
    	this.map.setTileIndexCallback([27, 28], this.drownInWater, this);
    
        this.game.physics.arcade.gravity.y = 200;
    		 
        //keys
    	var key;
    	this.keys = this.add.group();
    	this.keys.enableBody = true;
    	this.levelData.keyData.forEach(function(element) {
    		key = this.keys.create(element.x, element.y, 'key');
    		key.scale.setTo(0.7);
    	}, this);
    	this.keys.setAll('body.allowGravity', false);
    	
    	this.hudKeys = this.add.group();
    	
    	
    	// Life Items
    	this.book = this.add.sprite(this.levelData.lifeItem1.x, this.levelData.lifeItem1.y, 'book');
    	this.book.scale.setTo(0.2);
    	this.game.physics.arcade.enable(this.book);
    	this.book.body.allowGravity = false;
    	
    	this.controller = this.add.sprite(this.levelData.lifeItem2.x, this.levelData.lifeItem2.y, 'controller');
    	this.controller.scale.setTo(0.3);
    	this.game.physics.arcade.enable(this.controller);
    	this.controller.body.allowGravity = false;
    	
    	this.thermos = this.add.sprite(this.levelData.lifeItem3.x, this.levelData.lifeItem3.y, 'thermos');
    	this.thermos.scale.setTo(0.2);
    	this.game.physics.arcade.enable(this.thermos);
    	this.thermos.body.allowGravity = false;
    
        //create player
        this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 62);
        this.player.anchor.setTo(0.5);
        this.player.animations.add('walking', [63, 60, 61, 62], 10, true);
    	this.game.physics.arcade.enable(this.player);
    	
        this.player.customParams = {keyNum: 0, lifeItemNum: 0};
        this.game.camera.follow(this.player);
    	this.player.checkWorldBounds = true;
    	//  This adjusts the collision body size to be a 20x23 box.
        //  3, 6 is the X and Y offset of the newly sized box.
        this.player.body.setSize(20, 23, 5, 6);
        this.voidMessages();
        
        // text dialogue setup
        //this.bookMessage = "This book reminds me of something... \nI remember reading it, long ago.";
    },
    update: function() {
    	 this.game.physics.arcade.collide(this.player, this.map);
    	 this.game.physics.arcade.collide(this.player, this.platformLayer, this.hitDanger, null, this);
    	 this.game.physics.arcade.collide(this.player, this.worldBound, this.theVoid, null, this);
    	 this.game.physics.arcade.collide(this.player, this.keys, this.collectKeys, null, this);
    	 
    	 this.game.physics.arcade.overlap(this.player, this.book, this.collectLifeItem, null, this);
    	 this.game.physics.arcade.collide(this.player, this.controller, this.collectLifeItem, null, this);
    	 this.game.physics.arcade.collide(this.player, this.thermos, this.collectLifeItem, null, this);
    	 
        if (this.player.body.onFloor()) {
            this.player.customParams.mustJump = true;
    	}
    
        if (this.cursors.left.isDown) {
          this.player.body.velocity.x = -this.levelData.runningSpeed;
          this.player.scale.setTo(-1, 1);
          this.player.play('walking');
        }
        else if (this.cursors.right.isDown) {
          this.player.body.velocity.x = this.levelData.runningSpeed;
          this.player.scale.setTo(1, 1);
          this.player.play('walking');
        }
        else {
          this.player.animations.stop();
          this.player.frame = 62;
    	  this.player.body.velocity.x = -this.levelData.pullSpeed;
        }
    		
        if (this.cursors.up.isDown && this.player.customParams.mustJump) {
          this.player.body.velocity.y = -this.levelData.jumpingSpeed;
          this.player.customParams.mustJump = false;
        }
    	// check if player is out of bounds; if so, kill it
    	this.player.events.onOutOfBounds.add(this.killPlayer, this);
    },
    render: function() {
        //this.game.debug.body(this.player);
    },
    showLifeItemDialog: function(message, item, player) {
    	this.dialog = new Espiritus.Dialog(this.game, message, item, player, this);
    },
    killPlayer: function(player, death) {
      	 if (player.x > this.game.world.width) {
      	 	this.win(player);
      	 } else {
      	 	//console.log('auch!');
        	this.game.state.start('GameOverState', true, false, death, player.customParams.lifeItemNum);
      	 }
    },
    win: function(player) {
        if (player.customParams.keyNum === 4) {
            //alert('you win!');
            this.game.state.start('GameOverState', true, false, "win", player.customParams.lifeItemNum); 
        } else {
            player.body.x = this.game.width - player.body.width;
        }
    },
    collectKeys: function(player, key) {
        player.customParams.keyNum++;
    	//console.log("got " + player.customParams.keyNum + " key(s)");
    	key.destroy();
    	this.itemSparkle.play();
    	this.createHudKey(player);
    	var message;
    	
    	if(player.customParams.keyNum === 1) {
    	    message = "(A key.\nThere must a door somewhere.\nA way out.)";
    	    this.dialog = new Espiritus.Dialog(this.game, message, "key", player, this);
    	}
    	if (player.customParams.keyNum === 4) {
            this.worldBound.destroy();
            message = "(Somehwere, a door unlocked.)";
    	    this.dialog = new Espiritus.Dialog(this.game, message, "key", player, this);
    	}
    },
    collectLifeItem: function(player, item) {
    	//console.log("got a " + item.key);
    	player.customParams.lifeItemNum++;
    	this.itemSparkle.play();
    	if (item.key === "book") {
    		this.showLifeItemDialog(this.levelData.lifeItem1.message, item.key, this.player);
    	}
    	if (item.key === "controller") {
    		this.showLifeItemDialog(this.levelData.lifeItem2.message, item.key, this.player);
    	}
    	if (item.key === "thermos") {
    		this.showLifeItemDialog(this.levelData.lifeItem3.message, item.key, this.player);
    	}
    	item.destroy();
    	this.levelData.pullSpeed -= 40;
    	this.levelData.runningSpeed += 40;
    },
    hitDanger: function(player, tile) {
        // check if player is touching danger tiles; if so, kill it
        if (tile.index === 208) {
            this.killPlayer(player, "spike");
        }
        if (tile.index === 234 && player.body.blocked.up) {
            this.killPlayer(player, "spike");
        }
        if ((tile.index === 233 && player.body.blocked.right) || (tile.index === 233 && player.body.blocked.up)) {
            this.killPlayer(player, "spike");
        }
        if ((tile.index === 235 && player.body.blocked.left) || (tile.index === 235 && player.body.blocked.up)) {
            this.killPlayer(player, "spike");
        }
        if (tile.index === 243 && player.body.blocked.left) {
            this.killPlayer(player, "spike");
        }
        if (tile.index === 245 && player.body.blocked.right) {
            this.killPlayer(player, "spike");
        }
    },
    drownInWater: function(player, tile) {
        //console.log("drowning...");
        this.splashSound.play();
        this.game.state.start('GameOverState', true, false, 'water', player.customParams.lifeItemNum);
    },
    theVoid: function() {
        this.theVoidVoice = "* You'll never escape.\n* You belong here.\n* You belong to me.";
        if (this.game.time.now > this.voidTimer) {
            this.voidMessage = new Espiritus.VoidDialog(this.game, this.theVoidVoice, this.player);
            this.ghostWhoosh.play();
            this.voidTimer = this.game.time.now + 12000;
        }
    },
    voidMessages: function() {
        this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){
            this.voidItemVoice = this.voidData.voidMessages[this.game.rnd.integerInRange(0, 3)];
            this.voidItemMessage = new Espiritus.VoidDialog(this.game, this.voidItemVoice, this.player);
            this.ghostWhoosh.play();
        }, this);
    },
    createHudKey: function(player) {
        for (var i = 1; i <= player.customParams.keyNum; i++) {
            var hudKeyX = 30 * i;
            var hudKeyY = 30;
            this.hudKey = this.hudKeys.create(hudKeyX, hudKeyY, 'key');
            this.hudKey.anchor.setTo(0.5);
            this.hudKey.fixedToCamera = true;
        }
    }
};