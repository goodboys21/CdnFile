const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const uploadToCDN = async (filePath) => {
    try {
        const form = new FormData();
        form.append("file", fs.createReadStream(filePath));

        const response = await axios.post("https://cdn.bgs.ct.ws/index.php", form, {
            headers: form.getHeaders(),
        });

        return response.data;
    } catch (error) {
        console.error("❌ Upload Error:", error.response ? error.response.data : error.message);
        return { error: "Gagal upload file" };
    }
};

module.exports = uploadToCDN;
