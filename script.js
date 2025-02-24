const BOT_TOKEN = "7248739382:AAGVFqmeaajhaTo74eCR9ABsNJ0akPfsQyQ"; // Ganti dengan token bot
const OWNER_CHAT_ID = "7081489041"; // Ganti dengan chat ID owner

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCl2vegFRzTqHf2gW-trjsSkIF18yE2Xww",
    authDomain: "uploader-file-ff6d0.firebaseapp.com",
    databaseURL: "https://uploader-file-ff6d0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "uploader-file-ff6d0",
    storageBucket: "uploader-file-ff6d0.appspot.com",
    messagingSenderId: "425001263233",
    appId: "1:425001263233:web:a4bf49f398ec52e4086d80"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

document.getElementById("fileInput").addEventListener("change", function(event) {  
    handleFileUpload(event.target.files[0]);  
});

function handleFileUpload(file) {  
    if (!file) return;

    const fileID = generateID();
    const storageRef = storage.ref(`uploads/${fileID}-${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on("state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("result").innerHTML = `<p class="text-blue-600">📤 Uploading... ${Math.round(progress)}%</p>`;
        },
        (error) => {
            console.error("Error uploading file:", error);
            document.getElementById("result").innerHTML = `<p class="text-red-600">❌ Gagal mengunggah file!</p>`;
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                saveFileData(file, fileID, downloadURL);
            });
        }
    );
}

function saveFileData(file, fileID, downloadURL) {
    const fileData = {
        id: fileID,
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(2) + " KB",
        url: downloadURL,
        time: new Date().toLocaleString()
    };

    database.ref("uploads/" + fileID).set(fileData)
        .then(() => {
            let fileURL = window.location.origin + "?bagus=" + fileID;
            document.getElementById("result").innerHTML = `
                <p class="text-green-600 font-semibold">✅ File berhasil diupload!</p>
                <a href="${fileURL}" class="text-blue-600 underline">${fileURL}</a>
            `;
            sendTelegramNotification(fileData, fileURL);
        })
        .catch((error) => {
            console.error("Gagal menyimpan ke database:", error);
        });
}

function sendTelegramNotification(fileData, fileURL) {
    let message = `🔥 𝗙𝗶𝗹𝗲 𝗕𝗮𝗿𝘂 𝗜𝗰𝗶𝗯𝗼𝘀 🔥\n\n` +
                  `📂 𝖭𝖺𝗆𝖺: ${fileData.name}\n` +
                  `🔗 𝖴𝗋𝗅: ${fileURL}\n` +
                  `📏 𝖲𝗂𝗓𝖾: ${fileData.size}\n` +
                  `⏳ 𝖶𝖺𝗄𝗍𝗎: ${fileData.time}\n\n` +
                  `𝗙𝗿𝗼𝗺 : 𝖼𝖽𝗇.𝖻𝖺𝗀𝗎𝗌𝗌.𝗐𝖾𝖻.𝗂𝖽`;

    let url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    let params = {
        chat_id: OWNER_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: false
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
    let fileID = urlParams.get("file");  

    if (fileID) {  
        database.ref("uploads/" + fileID).once("value").then((snapshot) => {
            if (snapshot.exists()) {
                let file = snapshot.val();
                if (file.type.startsWith("image/")) {
                    document.body.innerHTML = `<img src="${file.url}" alt="${file.name}" class="uploaded-image">`;
                } else {
                    document.body.innerHTML = `<p>📂 <a href="${file.url}" target="_blank">${file.name}</a></p>`;
                }
            } else {
                document.body.innerHTML = `<p>⚠️ File tidak ditemukan</p>`;
            }
        }).catch(error => {
            console.error("Error fetching file:", error);
        });
    }  
}  

checkURLForFile();
