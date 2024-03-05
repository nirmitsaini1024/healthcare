async function query(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const data = reader.result;
            fetch(
                "https://api-inference.huggingface.co/models/youngp5/skin-conditions",
                {
                    headers: { Authorization: "Bearer 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" },
                    method: "POST",
                    body: data,
                }
            )
            .then(response => {
                if (response.status === 503) {
                    throw new Error('Hugging Face API is currently unavailable');
                }
                return response.json();
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}

document.getElementById('classifyButton').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];
    if (file) {
        try {
            const result = await query(file);
            document.getElementById('result').innerText = JSON.stringify(result);
            console.log('Result:', result);
        } catch (error) {
            console.error('Error querying model:', error);
            alert('Error: ' + error.message);
        }
    } else {
        alert('Please select an image.');
    }
});
