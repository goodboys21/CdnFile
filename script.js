const BOT_TOKEN = "7248739382:AAGVFqmeaajhaTo74eCR9ABsNJ0akPfsQyQ"; // Ganti dengan token bot
const OWNER_CHAT_ID = "7081489041"; // Ganti dengan chat ID owner

document.getElementById("fileInput").addEventListener("change", function(event) {
    handleFileUpload(event.target.files[0]);
});

function handleFileUpload(file) {
    if (!file) return;

    let formData = new FormData();
    formData.append("file", file);

    fetch("https://cdn.rafaelxd.tech/", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.url) {
            let fileURL = data.url.replace("cdn.rafaelxd.tech", "cdn.baguss.web.id");

            document.getElementById("result").innerHTML = `
                <p class="text-green-600 font-semibold">✅ File berhasil diupload!</p>
                <a href="${fileURL}" class="text-blue-600 underline">${fileURL}</a>
            `;

            sendTelegramNotification(file, fileURL);
        } else {
            document.getElementById("result").innerHTML = `<p class="text-red-600">❌ Gagal upload file</p>`;
        }
    })
    .catch(error => {
        console.error("Error upload:", error);
        document.getElementById("result").innerHTML = `<p class="text-red-600">❌ Gagal upload file</p>`;
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

function checkURLForFile() {
    let urlParams = new URLSearchParams(window.location.search);
    let fileID = urlParams.get("bagus");

    if (fileID) {
        let uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
        let file = uploadedFiles.find(f => f.id === fileID);

        if (file) {
            if (file.type.startsWith("image/")) {
                document.body.innerHTML = `<img src="${file.content}" alt="${file.name}" class="uploaded-image">`;
            } else {
                document.body.innerHTML = `<pre>${file.content}</pre>`;
            }
        } else {
            document.body.innerHTML = `<p>⚠️ File tidak ditemukan</p>`;
        }
    }
}

checkURLForFile();
