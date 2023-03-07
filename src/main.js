import Phaser from 'phaser'
import CollectingStarsScene from './scenes/CollectingStarsScene'
import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [CollectingStarsScene]
}

export default new Phaser.Game(config)
