const BOT_TOKEN = "7248739382:AAGVFqmeaajhaTo74eCR9ABsNJ0akPfsQyQ"; // Ganti dengan token bot
const OWNER_CHAT_ID = "7081489041"; // Ganti dengan chat ID owner
const CUSTOM_DOMAIN = "https://cdn.baguss.web.id/"; // Domain custom kamu

document.getElementById("fileInput").addEventListener("change", function(event) {
    handleFileUpload(event.target.files[0]);
});

function handleFileUpload(file) {
    if (!file) return;

const formData = new FormData();
formData.append("file", fileInput.files[0]);

fetch("https://i.supa.codes/api/upload", {
  method: "POST",
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));
        if (data.status === "success" && data.url) {
            let originalURL = data.url; // Misal: https://i.supa.codes/pYRiy
            let fileID = originalURL.split("/").pop(); // Ambil "pYRiy"
            let customURL = CUSTOM_DOMAIN + fileID; // Ubah ke domain custom

            document.getElementById("result").innerHTML = `
                <p class="text-green-600 font-semibold">✅ File berhasil diupload!</p>
                <a href="${customURL}" class="text-blue-600 underline">${customURL}</a>
            `;
            sendTelegramNotification(file, customURL);
        } else {
            document.getElementById("result").innerHTML = `<p class="text-red-600">❌ Gagal mengunggah file!</p>`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").innerHTML = `<p class="text-red-600">❌ Terjadi kesalahan!</p>`;
    });
}

function sendTelegramNotification(file, fileURL) {
    let message = `🔥 File Baru Icibos! 🔥\n\n` +
                  `📂 Nama: ${file.name}\n` +
                  `🔗 URL: [Klik Disini](${fileURL})\n` +
                  `📏 Ukuran: ${(file.size / 1024).toFixed(2)} KB\n` +
                  `⏳ Waktu: ${new Date().toLocaleString()}\n\n` +
                  `💎 Keep sharing!`;

    let url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    let params = {
        chat_id: OWNER_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true
    };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => console.log("Notifikasi terkirim:", data))
    .catch(error => console.error("Error mengirim notifikasi:", error));
}
