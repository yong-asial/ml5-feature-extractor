
// Grab all the DOM elements
const video = document.getElementById('video');
const status = document.getElementById('status');
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
const loadModel = document.getElementById('loadModel');
const saveModel = document.getElementById('saveModel');

// Constant
const DEFAULT_LABEL_1 = 'without_mask';
const DEFAULT_LABEL_2 = 'with_mask';
const THRESHOLD_TRAINING = 20;

// Global variables
let totalLoss = 0;
let isModelReady = false;
let isCustomModelReady = false;
let isVideoReady = false;
let featureExtractor = null;
let classifier = null;
let isTrainingCompleted = false;
let startPredicting = false;

// Starting function
const main = () => {
  // Create a webcam capture
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.play();
  });

  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  // Create a new classifier using those features
  classifier = featureExtractor.classification(video, videoReady);

  status.textContent = 'Loading';
  label1Input.textContent = DEFAULT_LABEL_1;
  label2Input.textContent = DEFAULT_LABEL_2;
};

// Update current status
const updateStatus = () => {
  let text = [];
  if (isVideoReady) text.push('Video is ready');
  if (isModelReady) text.push('Core Model loaded');
  if (isCustomModelReady) text.push('Custom Model loaded');
  if (isTrainingCompleted) text.push('Training Completed');
  if (isTrainingCompleted || isCustomModelReady) text.push('Detecting is ready');
  status.textContent = text.join(', ');
};

// A function to be called when the model has been loaded
const modelLoaded = () => {
  isModelReady = true;
  updateStatus();
};

// A function to be called when the video is finished loading
const videoReady = () => {
  isVideoReady = true;
  updateStatus();
};

// When the "label1" button is pressed, add the current frame
// from the video with a "label1" to the classifier
label1Button.onclick = () => {
  const label1 = label1Input.textContent || DEFAULT_LABEL_1;
  classifier.addImage(label1);
  amountOfLabel1Images.innerText = Number(amountOfLabel1Images.innerText) + 1;
};

// When the "label2" button is pressed, add the current frame
// from the video with a "label2" to the classifier
label2Button.onclick = () => {
  const label2 = label2Input.textContent || DEFAULT_LABEL_2;
  classifier.addImage(label2);
  amountOfLabel2Images.innerText = Number(amountOfLabel2Images.innerText) + 1;
};

// When the train button is pressed, train the classifier
train.onclick = () => {
  if (
    Number(amountOfLabel1Images.innerText) < THRESHOLD_TRAINING || 
    Number(amountOfLabel2Images.innerText) < THRESHOLD_TRAINING
  ) {
    window.alert(`Training data is too little. Please add training set at least ${THRESHOLD_TRAINING} samples per class`);
    return;
  }
  isTrainingCompleted = false;
  classifier.train((lossValue) => {
    if (lossValue) {
      totalLoss = lossValue;
      loss.innerHTML = `Loss: ${totalLoss}`;
    } else {
      loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
      isTrainingCompleted = true;
      updateStatus();
    }
  });
};

// Show the results
const gotResults = (err, results) => {
  // Display any error
  if (err) {
    console.error(err);
  } else if (results && results[0] && startPredicting) {
    result.innerText = results[0].label;
    confidence.innerText = results[0].confidence;
    classifier.classify(gotResults);
  }
}

// Start predicting when the predict button is clicked
predict.onclick = () => {
  if (startPredicting) {
    predict.innerText = 'Start Detecting!';
    startPredicting = false;
  } else if (isTrainingCompleted || isCustomModelReady) {
    classifier.classify(gotResults);
    startPredicting = true;
    predict.innerText = 'Stop Detecting!';
  }
};

// Save current model
saveModel.onclick = () => {
  featureExtractor.save((err, result) => {
    if (err) {
      window.alert('Failed to save model');
      console.error(err);
    }
    window.alert('Model saved successful');
  });
};

// Load existing model
loadModel.onclick = () => {
  path = 'model/model.json';
  featureExtractor.load(path, (err, result) => {
    if (err) {
      window.alert('Failed to load custom model');
      console.error(err);
    }
    isCustomModelReady = true;
    updateStatus();
    window.alert('Custom Model Loaded successful');
  });
}

// Start program
main();