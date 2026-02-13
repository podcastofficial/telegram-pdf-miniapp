function showAdAndPlay() {

    Adsgram.init({
        pub_id: "17049"
    });

    Adsgram.showRewardedAd({
        onReward: function() {
            alert("🎉 Ad Completed! Game Starting...");
            window.location.href = "snake.html";
        },
        onClose: function() {
            alert("❌ You must watch full ad!");
        }
    });
}
