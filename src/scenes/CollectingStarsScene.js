import Phaser from 'phaser'
export default class CollectingStarsScene extends Phaser.Scene
{
    constructor(){
        super('collecting-stars-scene');
    } 
    init(){
        this.platform = undefined
        this.player = undefined

        //initiate cursor
        this.cursor = undefined
        
        //tulisan score
        this.scoreText = undefined
        //value score
        this.score = 0
    }
    preload(){
        //load, dalam hal ini adalah images

        //rumus = 'nama gambar', 'lokasi gambar'
        this.load.image('ground', 'images/platform.png');
        this.load.image('star', 'images/star.png');
        this.load.image('sky', 'images/sky.png');
        this.load.image('bomb', 'images/bomb.png');

        //masukin gambar sprite
        this.load.spritesheet('dude','images/dude.png', {frameWidth:32, frameHeight:48})
    }
    create(){
        //asset yang udah diload -> kita create

        //rumus = (panjang, lebar, nama gambar)
        this.add.image(400, 300, 'sky')

        //statis -> karna platform sifatnya statis
        this.platforms=this.physics.add.staticGroup()

        //assign temboknya
        //rumus = (x, y, nama gambar)
        this.platforms.create(600,400,'ground')
        this.platforms.create(50,250,'ground')
        this.platforms.create(750,220,'ground')

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //assign sprite
        this.player=this.physics.add.sprite(100,450,'dude')

        //pembatas
        this.player.setCollideWorldBounds(true) 
        //ketika sprite menyentuh platfrom (pertama kali) dia berhenti
        this.physics.add.collider(this.player,this.platforms)

        //assign bintang
        this.stars = this.physics.add.group({
            key: 'star',
            repeat:10,
            //loop x awal 50 -> setiap looping x + 70
            setXY: {x:50, y:0, stepX:70} 
        });
        //pembatas
        this.physics.add.collider(this.stars, this.platforms)

        //animasi bounce
        this.stars.children.iterate(function (child){
            // @ts-ignore
             child.setBounceY(0.5);
        });

        //keyboard sebagai input untuk menjalankan karakter
        this.cursor=this.input.keyboard.createCursorKeys()

        //gerakin karkter ke kiri
        this.anims.create({
            //key = keyboard kiri
            key:'left', 
            frames :this.anims.generateFrameNumbers
            //index gambar dude dari 0-3
            ('dude',{start:0, end:3}),
            frameRate:10,
            repeat:-1
        });

        //gerakin karkter hadap depan
        this.anims.create({
            //key = keyboard kanan
            key:'turn', 
            //index ke 4
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        //gerakin karkter ke kanan
        this.anims.create({
            //key = keyboard kanan
            key:'right', 
            frames :this.anims.generateFrameNumbers
            //index gambar dude dari 5-8
            ('dude',{start:5, end:8}),
            frameRate:10,
            repeat:-1
        });

        //bikin sebuah overlap ketika asset saling ketemu atau berada di titik yang sama
        //collectStar -> ketika character sama bintang saling bertemu
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        )

        //ukuran text = 32, warna = kuning
        this.scoreText= this.add.text(16,16,'Score : 0',{
            fontSize: '32px'
        });
    }

    update(){
        //buat yang kiri
        if (this.cursor.left.isDown){
            this.player.setVelocity(-200,200)
            this.player.anims.play('left',true)
        }

        //buat yang kanan
        else if (this.cursor.right.isDown){
            this.player.setVelocity(200,200)
            this.player.anims.play('right',true)
        }

        //kalo gak pencet kiri dan kanan di keyboard, charcter kita turn
        else {
            this.player.setVelocity(0,0)
            this.player.anims.play('turn',true)
        }

        //buat loncat
        if (this.cursor.up.isDown){
            this.player.setVelocity(0, -200)
            this.player.anims.play('turn')
        }

        //jika score sudah 100, kita menang
        if(this.score >= 100){
            this.physics.pause()
            this.add.text(300,300,'You Win!!!', { 
            fontSize: '48px'
        })}
        
    }

    //ketika player dan star saling ketemu (1. Bintang hancur, 2. Score + 10, 3. Tampilin score baru dilayar)
    collectStar(player, star){
        star.destroy();
        this.score += 10;
        this.scoreText.setText('Score : ' +this.score);
    }
}