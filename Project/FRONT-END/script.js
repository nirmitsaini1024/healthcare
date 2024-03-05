const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  let file = target.files[0];
  if(file){
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName, file); // Pass the file to the uploadFile function
  }
}

function uploadFile(name, file){ // Modify the function to accept the file
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if(loaded == total){
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });
  let data = new FormData(form);
  data.append('file', file); // Append the file to FormData
  xhr.send(data);
}



document.getElementById('classifyButton').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];
    if (file) {
        try {
            const result = await query(file);
            const resultContainer = document.getElementById('result');
            resultContainer.innerHTML = ''; // Clear previous results
            result.forEach(({ label, score }) => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                const labelElement = document.createElement('div');
                labelElement.classList.add('result-label');
                labelElement.textContent = label;
                const scoreElement = document.createElement('div');
                scoreElement.classList.add('result-score');
                scoreElement.textContent = `Score: ${score.toFixed(2)}`;
                resultItem.appendChild(labelElement);
                resultItem.appendChild(scoreElement);
                resultContainer.appendChild(resultItem);
            });
            console.log('Result:', result);
        } catch (error) {
            console.error('Error querying model:', error);
            alert('Error: ' + error.message);
        }
    } else {
        alert('Please select an image.');
    }
});
