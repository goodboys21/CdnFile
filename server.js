const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000; // Sesuaikan dengan port server kamu

const UPLOAD_DIR = path.join(__dirname, "uploads");

// Pastikan folder upload ada
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Fungsi untuk download file dari Anonfiles
async function downloadFile(url, filename) {
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });

    return new Promise((resolve, reject) => {
        const filePath = path.join(UPLOAD_DIR, filename);
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => resolve(filePath));
        writer.on("error", reject);
    });
}

// Endpoint untuk mengunduh dan menyimpan file dari Anonfiles
app.get("/download", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL Anonfiles diperlukan");

    try {
        const filename = path.basename(url);
        const filePath = await downloadFile(url, filename);
        res.json({ success: true, message: "File berhasil diunduh", link: `/uploads/${filename}` });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal mengunduh file");
    }
});

// Serve file yang sudah diunduh
app.use("/uploads", express.static(UPLOAD_DIR));

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
