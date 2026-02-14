let tg = window.Telegram.WebApp;
tg.expand();

const config = {
    type: Phaser.AUTO,
    width: 800,
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
let cursors;
let platforms;
let coins;
let score = 0;
let scoreText;

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

    coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
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
