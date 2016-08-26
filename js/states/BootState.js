var Espiritus = Espiritus || {};

Espiritus.BootState = {
    //initiate some game-level settings
  init: function() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.setBoundsToWorld(false, true, true, true); //leftbound, rightbound, upperbound, lowerbound
		
    //this.cursors = this.game.input.keyboard.createCursorKeys();
  },
  preload: function() {
  	this.load.image('preloadBar', 'assets/images/bar.png');
  	this.load.image('logo', 'assets/images/logo.png');
  },
  create: function() {
  	this.state.start('PreloadState');
  }
};
