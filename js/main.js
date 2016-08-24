var Espiritus = Espiritus || {};
//this game will have only 1 state
Espiritus.Game = {

  //initiate game settings
  init: function() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.setBoundsToWorld(false, true, true, true); //leftbound, rightbound, upperbound, lowerbound
		
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/BG.png');
		this.load.image('cave', 'assets/images/cave.png');
		this.load.image('key', 'assets/images/keyRed.png');
		this.load.image('book', 'assets/images/book.png'); 
		this.load.image('controller', 'assets/images/controller.png'); 
		this.load.image('thermos', 'assets/images/thermos.png'); 
		this.load.image('ticket', 'assets/images/ticket.png'); 
		
    this.load.spritesheet('player', 'assets/images/tiny_people.png', 32, 32, 112, 1, 0);     
  
    this.load.text('level', 'assets/data/level.json');
		
	  this.game.load.tilemap('map', 'assets/data/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiny_tileset', 'assets/tilemaps/tiny_tileset.png');
  },
  //executed after everything is loaded
  create: function() {
		
    this.hell = game.add.tileSprite(0, 0, 1274, 768, 'cave');
		this.background = game.add.tileSprite(1220, 0, 1664, 1024, 'background');

    //parse the file
    this.levelData = JSON.parse(this.game.cache.getText('level'));
		
		this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tiny_tileset');
		
		this.platformLayer = this.map.createLayer('platforms');
    this.platformLayer.resizeWorld();

		//  Set the tiles for collision.
    //  Do this BEFORE generating the bodies below.
    this.map.setCollisionBetween(1, 1000, true, this.platformLayer);
    //setTileIndexCallback works but makes the tile passable
		this.map.setTileIndexCallback(27, this.hitDanger, this);

    this.game.physics.arcade.gravity.y = 200;
		 
    //keys
		var key;
		this.keys = this.add.group();
		this.keys.enableBody = true;
		this.levelData.keyData.forEach(function(element){
			key = this.keys.create(element.x, element.y, 'key');
			key.scale.setTo(0.7);
		}, this);
		
		this.keys.setAll('body.allowGravity', false);
		
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
    this.player.animations.add('walking', [63, 60, 61, 62], 6, true);
		this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};
    this.game.camera.follow(this.player);
		this.player.checkWorldBounds = true;
		
		//this.player.body.debug = true;
  },
  update: function() {
		 this.game.physics.arcade.collide(this.player, this.map);
		 this.game.physics.arcade.collide(this.player, this.platformLayer, this.hitDanger, null, this);
		 
		 this.game.physics.arcade.collide(this.player, this.keys, this.collectKeys, null, this);
		 
		 this.game.physics.arcade.overlap(this.player, this.book, this.collectLifeItem);
		 this.game.physics.arcade.collide(this.player, this.controller, this.collectLifeItem, null, this);
		 this.game.physics.arcade.collide(this.player, this.book, this.collectLifeItem, null, this);
		 
		 
		 
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
		
		// check if player is touching key; if so, collect it
		// this.keys.forEach(function(key){
		// 	this.collectKeys(this.player, key);
		// }, this);
		
		// this.collectLifeItem(this.player, this.book);
		// this.collectLifeItem(this.player, this.controller);
		// this.collectLifeItem(this.player, this.thermos);
		
  },
  killPlayer: function(player, fire) {
    console.log('auch!');
    game.state.start('GameState');
  },
  win: function(player, goal) {
    alert('you win!');
    game.state.start('GameState');
  },
	collectKeys: function(player, key) {
			console.log("got a key");
			key.destroy();
	},
	collectLifeItem: function(player, item){
			console.log("got a " + item.key);
			item.destroy();
	},
	hitDanger: function(player, tile) {
	  // check if player is touching danger tiles; if so, kill it
	  //console.log(tile);
	  if (tile.index === 208) {
	    console.log("ouch");
	  }
	  if (tile.index === 243 && player.body.blocked.left) {
	    console.log("ouch");
	  }
	  if (tile.index === 245 && player.body.blocked.right) {
	    console.log("ouch");
	  }
	  if (tile.index === 234) {
	    console.log("ouch");
	  }
		
	}
  
};

//initiate the Phaser framework
var game = new Phaser.Game(1024, 760, Phaser.AUTO);

game.state.add('GameState', Espiritus.Game);
game.state.start('GameState');

