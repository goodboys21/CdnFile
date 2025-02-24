const BOT_TOKEN = "7248739382:AAGVFqmeaajhaTo74eCR9ABsNJ0akPfsQyQ"; // Ganti dengan token bot
const OWNER_CHAT_ID = "7081489041"; // Ganti dengan chat ID owner

let uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];

document.getElementById("fileInput").addEventListener("change", function(event) {
    handleFileUpload(event.target.files[0]);
});

function handleFileUpload(file) {
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        let fileData = {
            id: generateID(),
            name: file.name,
            type: file.type,
            size: (file.size / 1024).toFixed(2) + " KB",
            content: e.target.result,
            time: new Date().toLocaleString()
        };

        uploadedFiles.push(fileData);
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));

        let proxyURL = `https://cdn.baguss.web.id/api/proxy?path=${encodeURIComponent(fileData.name)}`;

        document.getElementById("result").innerHTML = `
            <p class="text-green-600 font-semibold">✅ File berhasil diupload!</p>
            <a href="${proxyURL}" class="text-blue-600 underline">${proxyURL}</a>
        `;

        sendTelegramNotification(fileData, proxyURL);
    };

    reader.readAsDataURL(file);
}

function sendTelegramNotification(fileData, fileURL) {
    let message = `🔥 *File Baru Icibos!* 🔥\n\n` +
                  `📂 *Nama:* ${fileData.name}\n` +
                  `🔗 *URL:* [Klik Disini](${fileURL})\n` +
                  `📏 *Ukuran:* ${fileData.size}\n` +
                  `⏳ *Waktu:* ${fileData.time}\n\n` +
                  `💎 *Keep sharing!*`;

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

function generateID() {
    return Math.random().toString(36).substr(2, 10);
}

function checkURLForFile() {
    let urlParams = new URLSearchParams(window.location.search);
    let fileID = urlParams.get("bagus");

    if (fileID) {
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
