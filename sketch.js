
// Grab all the DOM elements
const video = document.getElementById('video');
const videoStatus = document.getElementById('videoStatus');
const loading = document.getElementById('loading');
const label1Button = document.getElementById('label1Button');
const label2Button = document.getElementById('label2Button');
const label1Input = document.getElementById('label1Input');
const label2Input = document.getElementById('label2Input');
const amountOfLabel1Images = document.getElementById('amountOfLabel1Images');
const amountOfLabel2Images = document.getElementById('amountOfLabel2Images');
const train = document.getElementById('train');
const loss = document.getElementById('loss');
const result = document.getElementById('result');
const confidence = document.getElementById('confidence');
const predict = document.getElementById('predict');
predict.disabled = true;

// A variable to store the total loss
let totalLoss = 0;

// Create a webcam capture
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
  video.play();
});

// A function to be called when the model has been loaded
function modelLoaded() {
  loading.innerText = 'MobileNet Model loaded!';
}

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
// Create a new classifier using those features
const classifier = featureExtractor.classification(video, videoReady);

// A function to be called when the video is finished loading
function videoReady() {
  videoStatus.innerText = 'Video ready!';
}

// When the "label1" button is pressed, add the current frame
// from the video with a "label1" to the classifier
label1Button.onclick = function() {
  const label1 = label1Input.textContent || 'without_mask';
  classifier.addImage(label1);
  amountOfLabel1Images.innerText = Number(amountOfLabel1Images.innerText) + 1;
};

// When the "label2" button is pressed, add the current frame
// from the video with a "label2" to the classifier
label2Button.onclick = function() {
  const label2 = label2Input.textContent || 'with_mask';
  classifier.addImage(label2);
  amountOfLabel2Images.innerText = Number(amountOfLabel2Images.innerText) + 1;
};

// When the train button is pressed, train the classifier
train.onclick = function() {
  classifier.train(function(lossValue) {
    if (lossValue) {
      totalLoss = lossValue;
      loss.innerHTML = `Loss: ${totalLoss}`;
    } else {
      loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
      predict.disabled = false;
    }
  });
};

// Show the results
function gotResults(err, results) {
  // Display any error
  if (err) {
    console.error(err);
  }
  if (results && results[0]) {
    result.innerText = results[0].label;
    confidence.innerText = results[0].confidence;
    classifier.classify(gotResults);
  }
}

// Start predicting when the predict button is clicked
predict.onclick = function() {
  classifier.classify(gotResults);
};
