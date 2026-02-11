function showAd(callback) {
    if (window.Adsgram) {
        Adsgram.showInterstitialAd({
            blockId: "17049",
            onClose: callback
        });
    } else {
        callback();
    }
}
