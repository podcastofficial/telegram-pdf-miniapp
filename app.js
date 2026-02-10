const tg = window.Telegram.WebApp;
tg.expand();

function sendAction(action) {

  // 🔥 Show Adsgram Ad
  showAd(() => {
    tg.sendData(action);
  });

}
