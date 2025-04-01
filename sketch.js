let capture;
let ocrResult = "";
let isProcessing = false;
let message = "";

const inflammatoryIngredients = [
  "high fructose corn syrup",
  "trans fat",
  "sugar",
  "partially hydrogenated oil",
  "monosodium glutamate",
  "msg",
  "artificial flavors"
];

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  // Create a button to trigger OCR processing
  let btn = createButton("Capture & Process");
  btn.position(10, height + 10);
  btn.mousePressed(processImage);
}

function draw() {
  image(capture, 0, 0, width, height);
  // Display the message if any inflammatory ingredient is detected
  fill(255, 0, 0);
  textSize(32);
  if (message === "INFLAMMATORY") {
    text("INFLAMMATORY", 10, 50);
  }
}

function processImage() {
  if (isProcessing) return;
  isProcessing = true;

  // Ensure the capture's pixels are updated
  capture.loadPixels();
  let imgData = capture.canvas.toDataURL(); // Get the image as a base64 encoded string

  Tesseract.recognize(
    imgData,
    "eng",
    { logger: m => console.log(m) }
  )
    .then(({ data: { text } }) => {
      ocrResult = text;
      console.log("OCR Result:", ocrResult);

      // Check if any inflammatory ingredients are present
      if (containsInflammatory(ocrResult)) {
        message = "INFLAMMATORY";
      } else {
        message = "";
      }
      isProcessing = false;
    })
    .catch(err => {
      console.error(err);
      isProcessing = false;
    });
}

function containsInflammatory(text) {
  let lowerText = text.toLowerCase();
  for (let ingredient of inflammatoryIngredients) {
    if (lowerText.includes(ingredient)) {
      return true;
    }
  }
  return false;
}
