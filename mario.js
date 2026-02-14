let tg = window.Telegram.WebApp;
tg.expand();

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let coins;
let score = 0;
let scoreText;

let moveLeft = false;
let moveRight = false;

function preload() {
    this.load.image('ground', 'assets/ground.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('player', 'assets/player.png');
}

function create() {
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 390, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 300, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 5,
        setXY: { x: 200, y: 0, stepX: 100 }
    });

    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    // TOUCH EVENTS
    document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
    document.getElementById("left").addEventListener("touchend", () => moveLeft = false);

    document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
    document.getElementById("right").addEventListener("touchend", () => moveRight = false);

    document.getElementById("jump").addEventListener("touchstart", () => {
        if (player.body.touching.down) {
            player.setVelocityY(-330);
        }
    });
}

function update() {
    if (moveLeft) {
        player.setVelocityX(-160);
    }
    else if (moveRight) {
        player.setVelocityX(160);
    }
    else {
        player.setVelocityX(0);
    }
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (coins.countActive(true) === 0) {
        sendScoreToBackend(score);
    }
}

function sendScoreToBackend(score) {
    const user = tg.initDataUnsafe.user;

    fetch("https://YOUR_BACKEND_URL/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            telegram_id: user.id,
            amount: score
        })
    });
}
