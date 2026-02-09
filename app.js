const tg = window.Telegram.WebApp;
tg.expand();

const fileInput = document.getElementById("fileInput");
const statusEl = document.getElementById("status");

// 🔴 CHANGE THIS
const API_URL = "http://YOUR_VPS_IP:8000/upload";

function sendAction(action) {
  if (!fileInput.files.length) {
    statusEl.innerText = "❌ Select files first";
    return;
  }

  const formData = new FormData();
  for (const file of fileInput.files) {
    formData.append("files", file);
  }

  formData.append("action", action);
  formData.append("user_id", tg.initDataUnsafe?.user?.id || "guest");

  statusEl.innerText = "⏳ Uploading...";

  fetch(API_URL, { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      statusEl.innerText = "✅ Uploaded. Processing started.";
      tg.sendData(JSON.stringify({
        task_id: data.task_id,
        action: action
      }));
    })
    .catch(() => {
      statusEl.innerText = "❌ Upload failed";
    });
}
