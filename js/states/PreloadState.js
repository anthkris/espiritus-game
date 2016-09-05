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
	this.load.image('modalBG', 'assets/images/dialog_BG.png');
	this.load.image('voidBG', 'assets/images/void_BG.png');
	this.load.image('worldBound', 'assets/images/worldBound.png');
	
	this.load.audio('penumbra', ['assets/audio/Penumbra.mp3', 'assets/audio/Penumbra.ogg']);
	this.load.audio('ghostWhoosh', ['assets/audio/klankbeeld-horror-whoosh-003.mp3', 'assets/audio/klankbeeld-horror-whoosh-003.ogg']);
	this.load.audio('itemSparkle', ['assets/audio/soughtaftersounds-menu-click-sparkle.mp3', 'assets/audio/soughtaftersounds-menu-click-sparkle.ogg']);
	this.load.audio('splashSound', ['assets/audio/kayyy-splash.mp3', 'assets/audio/kayyy-splash.ogg']);

    this.load.spritesheet('player', 'assets/images/tiny_people.png', 32, 32, 112, 1, 0);     

    this.load.text('level', 'assets/data/level.json');
    this.load.text('void', 'assets/data/voidMessage.json');
	
	this.game.load.tilemap('map', 'assets/data/level1.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.image('tiny_tileset', 'assets/tilemaps/tiny_tileset.png');
	
    this.game.load.bitmapFont('nokiaBlack', 'assets/fonts/nokia16black.png', 'assets/fonts/nokia16black.xml');
    this.game.load.bitmapFont('nokia', 'assets/fonts/nokia.png', 'assets/fonts/nokia.xml');
    this.game.load.bitmapFont('stampingNico', 'assets/fonts/stampingNicoBlack.png', 'assets/fonts/stampingNicoBlack.xml');
    this.game.load.bitmapFont('stampingNicoWhite', 'assets/fonts/stampingNicoWhite.png', 'assets/fonts/stampingNicoWhite.xml');
  },
  create: function() {
    this.state.start('HomeState');
  }
};