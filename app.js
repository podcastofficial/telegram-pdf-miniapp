const tg = window.Telegram.WebApp;
tg.expand();

const fileInput = document.getElementById("fileInput");
const statusEl = document.getElementById("status");

function sendAction(action) {
  if (!fileInput.files.length) {
    statusEl.innerText = "❌ Please select files first";
    return;
  }

  // NOTE: GitHub Pages backend nahi chalata
  // Isliye yahan hum bot ko data bhej rahe hain
  // Actual file upload next step me VPS API se hoga

  const payload = {
    action,
    files: fileInput.files.length,
    user_id: tg.initDataUnsafe?.user?.id || null
  };

  tg.sendData(JSON.stringify(payload));
  statusEl.innerText = `✅ ${action.toUpperCase()} request sent to bot`;
}
