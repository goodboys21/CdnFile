const QRCode = require("qrcode");
const fs = require("fs");
const uploadToCDN = require('./elxyzFile'); // Panggil fungsi upload

function convertCRC16(str) {
    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    let hex = ("000" + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
    return hex;
}

const generateQRIS = async (codeqr) => {
    try {
        let qrisData = codeqr.slice(0, -4);
        const step1 = qrisData.replace("010211", "010212");
        const step2 = step1.split("5802ID");
        const result = step2[0] + "5802ID" + step2[1] + convertCRC16(step2[0] + "5802ID" + step2[1]);

        const filePath = "qr_image.png";
        await QRCode.toFile(filePath, result);

        // Cek apakah QR Code berhasil dibuat
        if (!fs.existsSync(filePath)) {
            console.error("❌ Gagal: File QR Code tidak ditemukan.");
            return { error: "QR Code tidak berhasil dibuat." };
        } else {
            console.log("✅ File QR Code berhasil dibuat, lanjut upload...");
        }

        const uploadedFile = await uploadToCDN(filePath);
        fs.unlinkSync(filePath); // Hapus file setelah di-upload

        return { qrImageUrl: uploadedFile.fileUrl };
    } catch (error) {
        console.error("❌ Error generating and uploading QR code:", error);
        throw error;
    }
};

module.exports = generateQRIS;
