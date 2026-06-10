const URL = "https://teachablemachine.withgoogle.com/models/FbooIfkIMq/";
let model, webcam, labelContainer, maxPredictions;

const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");

startButton.addEventListener("click", async () => {
  startButton.disabled = true;
  statusText.textContent = "Loading model...";

  try {
    await init();
    statusText.textContent = "Model loaded. Allow webcam and point at trash.";
  } catch (error) {
    console.error(error);
    statusText.textContent = "Could not load model or webcam. Check console and model path.";
    startButton.disabled = false;
  }
});

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(320, 320, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "";

  for (let i = 0; i < maxPredictions; i++) {
    const div = document.createElement("div");
    div.textContent = "Loading...";
    labelContainer.appendChild(div);
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  prediction.forEach((p, index) => {
    labelContainer.childNodes[index].innerHTML = `${p.className}: ${(
      p.probability * 100
    ).toFixed(1)}%`;
  });
}
