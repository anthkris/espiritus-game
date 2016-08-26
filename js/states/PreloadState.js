var Espiritus = Espiritus || {};

Espiritus.PreloadState = {
	//load the game assets before the game starts
  preload: function() {
    this.load.image('background', 'assets/images/BG.png');
	this.load.image('cave', 'assets/images/cave.png');
	this.load.image('key', 'assets/images/keyRed.png');
	this.load.image('book', 'assets/images/book.png'); 
	this.load.image('controller', 'assets/images/controller.png'); 
	this.load.image('thermos', 'assets/images/thermos.png'); 
	this.load.image('ticket', 'assets/images/ticket.png'); 
	this.load.image('modalBG', 'assets/images/modalBG.png');
	this.load.image('voidBG', 'assets/images/voidDialogBG.png');
	this.load.image('worldBound', 'assets/images/worldBound.png'); 
	
    this.load.spritesheet('player', 'assets/images/tiny_people.png', 32, 32, 112, 1, 0);     
  
    this.load.text('level', 'assets/data/level.json');
		
	this.game.load.tilemap('map', 'assets/data/level1.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.image('tiny_tileset', 'assets/tilemaps/tiny_tileset.png');
		
    this.game.load.bitmapFont('nokiaBlack', 'assets/fonts/nokia16black.png', 'assets/fonts/nokia16black.xml');
    this.game.load.bitmapFont('nokia', 'assets/fonts/nokia.png', 'assets/fonts/nokia.xml');
  },
  create: function() {
    this.state.start('GameState');
  }
};