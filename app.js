let tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;

document.getElementById("username").innerText = user.first_name;

const API = "https://YOUR_BACKEND_URL"; // example: https://playqube.in

// AUTH
fetch(API + "/auth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    telegram_id: user.id,
    username: user.username,
    first_name: user.first_name
  })
})
.then(res => res.json())
.then(data => {
  document.getElementById("coins").innerText = data.coins;
});

// EARN
function earnCoins() {
  fetch(API + "/earn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegram_id: user.id,
      amount: 10
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("coins").innerText = data.coins;
  });
}

// LEADERBOARD
function loadLeaderboard() {
  fetch(API + "/leaderboard")
  .then(res => res.json())
  .then(data => {
    let html = "<h3>🏆 Top Players</h3>";
    data.forEach((u, i) => {
      html += `${i+1}. ${u.username} - ${u.coins} coins <br>`;
    });
    document.getElementById("leaderboard").innerHTML = html;
  });
}
