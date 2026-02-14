let tg = window.Telegram.WebApp;
tg.expand();

const API = "https://YOUR_BACKEND_URL"; // change this

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 420,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 600 }, debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, platforms, coins, enemies;
let score = 0;
let lives = 3;
let scoreText, livesText;
let moveLeft = false;
let moveRight = false;
let gameEnded = false;

function preload() {
    this.load.image('ground', 'assets/ground.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
}

function create() {

    gameEnded = false;
    score = 0;
    lives = 3;

    platforms = this.physics.add.staticGroup();
    platforms.create(window.innerWidth/2, 400, 'ground')
        .setScale(3).refreshBody();

    player = this.physics.add.sprite(100, 300, 'player');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    // COINS
    coins = this.physics.add.group({
        key: 'coin',
        repeat: 6,
        setXY: { x: 150, y: 0, stepX: 100 }
    });

    coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);

    // ENEMIES
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 2,
        setXY: { x: 400, y: 0, stepX: 250 }
    });

    enemies.children.iterate(function (enemy) {
        enemy.setBounce(1);
        enemy.setCollideWorldBounds(true);
        enemy.setVelocityX(Phaser.Math.Between(-120,120));
    });

    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', 
        { fontSize: '18px', fill: '#fff' });

    livesText = this.add.text(16, 40, 'Lives: 3', 
        { fontSize: '18px', fill: '#fff' });

    setupTouchControls();
}

function update() {

    if (gameEnded) return;

    if (moveLeft) player.setVelocityX(-180);
    else if (moveRight) player.setVelocityX(180);
    else player.setVelocityX(0);
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitEnemy(player, enemy) {

    if (gameEnded) return;

    lives--;
    livesText.setText('Lives: ' + lives);

    player.setTint(0xff0000);
    setTimeout(() => player.clearTint(), 200);

    if (lives <= 0) {
        endGame(this);
    }
}

function endGame(scene) {

    gameEnded = true;
    player.setVelocity(0,0);

    scene.add.text(window.innerWidth/2 - 70, 200,
        'GAME OVER',
        { fontSize: '28px', fill: '#ff0000' });

    scene.add.text(window.innerWidth/2 - 80, 240,
        'Tap To Restart',
        { fontSize: '18px', fill: '#ffffff' });

    sendScore(score);

    scene.input.once('pointerdown', () => {
        scene.scene.restart();
    });
}

function sendScore(score) {

    if (!tg.initDataUnsafe.user) return;

    fetch(API + "/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            telegram_id: tg.initDataUnsafe.user.id,
            amount: score
        })
    });
}

function setupTouchControls() {

    document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
    document.getElementById("left").addEventListener("touchend", () => moveLeft = false);

    document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
    document.getElementById("right").addEventListener("touchend", () => moveRight = false);

    document.getElementById("jump").addEventListener("touchstart", () => {
        if (player.body.touching.down) {
            player.setVelocityY(-400);
        }
    });
}
