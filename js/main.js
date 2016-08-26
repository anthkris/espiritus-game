var Espiritus = Espiritus || {};

//initiate the Phaser framework
var game = new Phaser.Game(1024, 768, Phaser.AUTO);

game.state.add('GameState', Espiritus.Game);
game.state.add('HomeState', Espiritus.HomeState);
game.state.add('PreloadState', Espiritus.PreloadState);
game.state.add('BootState', Espiritus.BootState);

game.state.start('BootState');

