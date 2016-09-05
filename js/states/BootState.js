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
  },
  preload: function() {
  	this.load.image('preloadBar', 'assets/images/loadingBar.png');
  },
  create: function() {
  	this.state.start('PreloadState');
  }
};
