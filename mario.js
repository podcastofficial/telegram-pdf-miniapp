let tg = window.Telegram.WebApp;
tg.expand();

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 700 }, debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, platforms, enemies;
let score = 0;
let lives = 3;
let scoreText, livesText;
let moveLeft = false;
let moveRight = false;
let gameEnded = false;

function preload() {
    this.load.image('ground', 'assets/ground.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
}

function create() {

    score = 0;
    lives = 3;
    gameEnded = false;

    platforms = this.physics.add.staticGroup();
    platforms.create(window.innerWidth/2, 420, 'ground')
        .setScale(3, 1)
        .refreshBody();

    player = this.physics.add.sprite(100, 300, 'player');
    player.setScale(0.5);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 1,
        setXY: { x: 400, y: 300, stepX: 250 }
    });

    enemies.children.iterate(function (enemy) {
        enemy.setScale(0.3);
        enemy.setCollideWorldBounds(true);
        enemy.setVelocityX(100);
        enemy.setBounce(1);
    });

    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', 
        { fontSize: '18px', fill: '#fff' });

    livesText = this.add.text(16, 40, 'Lives: 3', 
        { fontSize: '18px', fill: '#fff' });

    setupTouch();
}

function update() {
    if (gameEnded) return;

    if (moveLeft) player.setVelocityX(-200);
    else if (moveRight) player.setVelocityX(200);
    else player.setVelocityX(0);
}

function hitEnemy(player, enemy) {

    if (gameEnded) return;

    lives--;
    livesText.setText("Lives: " + lives);

    player.setTint(0xff0000);
    setTimeout(() => player.clearTint(), 200);

    if (lives <= 0) {
        endGame(this);
    }
}

function endGame(scene) {

    gameEnded = true;

    scene.add.text(window.innerWidth/2 - 70, 200,
        'GAME OVER',
        { fontSize: '28px', fill: '#ff0000' });

    scene.add.text(window.innerWidth/2 - 80, 240,
        'Tap To Restart',
        { fontSize: '18px', fill: '#ffffff' });

    scene.input.once('pointerdown', () => {
        scene.scene.restart();
    });
}

function setupTouch() {

    document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
    document.getElementById("left").addEventListener("touchend", () => moveLeft = false);

    document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
    document.getElementById("right").addEventListener("touchend", () => moveRight = false);

    document.getElementById("jump").addEventListener("touchstart", () => {
        if (player.body.touching.down) {
            player.setVelocityY(-500);
        }
    });
}
