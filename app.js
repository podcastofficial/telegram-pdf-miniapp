const tg = window.Telegram.WebApp;
tg.expand();

function merge(){
  const input = document.getElementById("files");
  let form = new FormData();
  for (let f of input.files) {
    form.append("files", f);
  }

  fetch("https://YOUR_VPS_IP:5000/merge", {
    method: "POST",
    body: form
  })
  .then(res => res.blob())
  .then(() => tg.showAlert("✅ PDF merged & saved"));
}
