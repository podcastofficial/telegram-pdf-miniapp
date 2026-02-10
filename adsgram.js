function showAd(callback) {
  if (!window.Adsgram) {
    callback();
    return;
  }

  Adsgram.show({
    blockId: "17049",
    onComplete: () => callback(),
    onError: () => callback()
  });
}
