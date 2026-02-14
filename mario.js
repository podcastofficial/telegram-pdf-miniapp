let tg = window.Telegram.WebApp;
tg.expand();

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 900 }, debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, ground, enemies;
let moveLeft = false;
let moveRight = false;
let lives = 3;
let livesText;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
}

function create() {

    const width = this.scale.width;
    const height = this.scale.height;

    // Fake 3D ground
    ground = this.add.rectangle(width/2, height-40, width, 80, 0x3b2f2f);
    this.physics.add.existing(ground, true);

    player = this.physics.add.sprite(120, height-200, 'player');
    player.setScale(0.4);
    player.setCollideWorldBounds(true);
    player.setBounce(0.1);
    player.setDepth(5);

    this.physics.add.collider(player, ground);

    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 1,
        setXY: { x: width-200, y: height-200, stepX: 150 }
    });

    enemies.children.iterate(function(enemy){
        enemy.setScale(0.3);
        enemy.setBounce(1);
        enemy.setCollideWorldBounds(true);
        enemy.setVelocityX(120);
    });

    this.physics.add.collider(enemies, ground);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    livesText = this.add.text(20,20,"Lives: 3",
        {fontSize:"20px", fill:"#fff"});
}

function update() {

    if(moveLeft) player.setVelocityX(-300);
    else if(moveRight) player.setVelocityX(300);
    else player.setVelocityX(0);
}

function hitEnemy(player, enemy) {

    lives--;
    livesText.setText("Lives: "+lives);

    player.setTint(0xff0000);
    setTimeout(()=>player.clearTint(),200);

    if(lives <= 0){
        this.scene.restart();
        lives = 3;
    }
}

document.getElementById("left").addEventListener("touchstart",()=>moveLeft=true);
document.getElementById("left").addEventListener("touchend",()=>moveLeft=false);

document.getElementById("right").addEventListener("touchstart",()=>moveRight=true);
document.getElementById("right").addEventListener("touchend",()=>moveRight=false);

document.getElementById("jump").addEventListener("touchstart",()=>{
    if(player.body.touching.down){
        player.setVelocityY(-700);
    }
});
