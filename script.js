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
            content: e.target.result  
        };  

        uploadedFiles.push(fileData);  
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));  

        let fileURL = window.location.origin + "?file=" + fileData.id;

        document.getElementById("result").innerHTML = `
            <p class="text-green-600 font-semibold">✅ File berhasil diupload!</p>
            <a href="${fileURL}" class="text-blue-600 underline">${fileURL}</a>
        `;
    };  

    if (file.type.startsWith("image/")) {  
        reader.readAsDataURL(file);  
    } else {  
        reader.readAsText(file);  
    }  
}

function generateID() {  
    return Math.random().toString(36).substr(2, 10);  
}  

function checkURLForFile() {  
    let urlParams = new URLSearchParams(window.location.search);  
    let fileID = urlParams.get("file");  

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
