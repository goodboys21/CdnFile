const BOT_TOKEN = "7248739382:AAGVFqmeaajhaTo74eCR9ABsNJ0akPfsQyQ"; // Ganti dengan token bot
const OWNER_CHAT_ID = "7081489041"; // Ganti dengan chat ID owner
const CUSTOM_DOMAIN = "https://cdn.baguss.web.id"; // Ganti dengan domain kamu

document.getElementById("fileInput").addEventListener("change", function(event) {
    handleFileUpload(event.target.files[0]);
});

async function handleFileUpload(file) {
    if (!file) return;

    let formData = new FormData();
    formData.append("file", file);

    try {
        document.getElementById("result").innerHTML = "<p class='text-yellow-600 font-semibold'>⏳ Uploading...</p>";

        let response = await fetch("https://www.anonfile.la/process/upload_file", {
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (result.status && result.data.file.url.short) {
            let originalURL = result.data.file.url.short;

            // **🔄 Replace domain dengan domain custom**
            let newURL = originalURL.replace("anonfiles.com", CUSTOM_DOMAIN);

            document.getElementById("result").innerHTML = `
                <p class="text-green-600 font-semibold">✅ File berhasil diupload!</p>
                <a href="${newURL}" class="text-blue-600 underline">${newURL}</a>
            `;

            sendTelegramNotification(file.name, file.size, newURL);
        } else {
            throw new Error("Gagal mengupload file!");
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").innerHTML = "<p class='text-red-600 font-semibold'>❌ Upload gagal!</p>";
    }
}

function sendTelegramNotification(fileName, fileSize, fileURL) {
    let message = `🔥 File Baru! 🔥\n\n` +
                  `📂 Nama: ${fileName}\n` +
                  `📏 Ukuran: ${(fileSize / 1024).toFixed(2)} KB\n` +
                  `🔗 [Klik Disini](${fileURL})\n\n` +
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
