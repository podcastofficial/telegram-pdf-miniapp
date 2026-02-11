const tg = window.Telegram.WebApp;
tg.expand();

function runAction(action) {
    showAd(() => {
        tg.sendData(JSON.stringify({
            action: action
        }));
        tg.close();
    });
}
