# ML5 Feature Extractor

This sample application is created using [ml5js](https://ml5js.org/) library.

> ml5.js is machine learning for the web in your web browser. It is built on the well-known-one-and-only [TensorFlow.js](https://www.tensorflow.org/js).

## Installation

```bash
git@github.com:yong-asial/ml5-feature-extractor.git
cd ml5-feature-extractor
npm install
```

## Preview

```bash
cd ml5-feature-extractor
npm run dev
```

## How the program is working

- The program (DOM) is fully loaded.
- It will load the core model (MobileNet).
- Now the program is ready to either load the existing custom model or train a new classification.

## Load custom model

- Click on `load` button. It will then load the custom model located in the `model` directory. It is the custom model detecting whether you are wearing mask or not.
- Click on `Start Detecting!` button - You can try facing to your camera by wearing mask or not and observe the `Result` label.

## Train new classification

- Input the class name in the input box `Class 1` and `Class 2`.
- Show something to the camera (for example, not wearning mask) and click `Class 1` button.
- Do the samething but this time show something different to camera (for example, wearing mask) and click `Class 2` button
- Try to differentiate your pose or angle (or anything). Try to add image more than 20 times or so.
- Click `Train` and observe the loss. Once the training is completed, you can click on `Start Detecting!` button
