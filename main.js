        const uploadBox = document.getElementById('uploadBox');
        const fileInput = document.getElementById('imageUpload');
        const imageElement = document.getElementById('image');
        const analyzeButton = document.getElementById('analyzeButton');
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        const predictionText = document.getElementById('prediction');

        let uploadedFile = null; // To store the uploaded file
        let model = null; // To store the loaded MobileNet model

        // Load the MobileNet model only once to save time
        mobilenet.load().then((loadedModel) => {
            model = loadedModel;
        });

        // Show file dialog when upload box is clicked
        uploadBox.addEventListener('click', () => fileInput.click());

        // Handle file input change
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                imageElement.src = e.target.result;
                imageElement.style.display = 'block';
                analyzeButton.disabled = false; // Enable analyze button
                predictionText.style.display = 'none'; // Hide previous results
            };
            reader.readAsDataURL(file);
            uploadedFile = file;
        });

        // Handle Analyze button click
        analyzeButton.addEventListener('click', async () => {
            if (!uploadedFile || !model) return;

            analyzeButton.disabled = true; // Disable the button during analysis
            predictionText.style.display = 'none'; // Hide previous results

            // Show progress bar
            progressBar.style.display = 'block';
            progressFill.style.width = '0%';

            // Simulate progress bar fill
            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                progressFill.style.width = `${progress}%`;

                if (progress >= 100) clearInterval(interval);
            }, 500);

            try {
                // Analyze image
                const predictions = await model.classify(imageElement);
                const topPrediction = predictions[0];

                // Show success result
                progressFill.style.width = '100%';
                predictionText.style.display = 'block';
                predictionText.className = 'result success';
                predictionText.innerHTML = `Prediction: <strong>${topPrediction.className}</strong> (${Math.round(topPrediction.probability * 100)}%)`;
                progressBar.style.display = 'none';
            } catch (error) {
                // Show error result
                predictionText.style.display = 'block';
                predictionText.className = 'result error';
                predictionText.innerText = 'Failed to analyze the image. Please try again.';
                progressBar.style.display = 'none';
            }
        });