let coins = 0;

function showAdReward() {

    Adsgram.init({
        pub_id: "17049"
    });

    Adsgram.showRewardedAd({
        onReward: function() {
            coins += 10;
            document.getElementById("coinCount").innerText = coins;
            alert("💰 +10 Coins Added!");
        }
    });
}
