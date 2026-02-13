function openGame(game) {
  let area = document.getElementById("gameArea");

  if (game === "clicker") {
    area.innerHTML = `
      <h2>⚡ Click Game</h2>
      <button onclick="score++ ; update()">Click Me!</button>
      <p>Score: <span id="score">0</span></p>
    `;
    window.score = 0;
    window.update = function() {
      document.getElementById("score").innerText = score;
    }
  }

  if (game === "snake") {
    area.innerHTML = "<h2>🐍 Snake Game Coming Soon</h2>";
  }

  if (game === "memory") {
    area.innerHTML = "<h2>🧠 Memory Game Coming Soon</h2>";
  }
}
