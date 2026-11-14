const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const Cast = require("../../util/cast");
const TargetType = require("../../extension-support/target-type");
const ml5 = require("ml5");
const { log } = require("@tensorflow/tfjs-core");
const jsQR = require("jsqr");
// const tf = require("@tensorflow/tfjs");

class Scratch3CameraStreamBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    this.runtime.emit("EXTENSION_DATA_LOADING", true);
    this.imageElement = null;
    this.intervalId = null;
    this.facemesh = null;
    this.faces = [];
    this.canvas = null;
    this.context = null;
    this.faceDetectionInterval = null;

    // qr properties 
    this.qrScanningInterval = null;
    this.qrData = null;
    this.qrCanvas = null;
    this.qrContext = null;
    this.qrOverlayCanvas = null;  

    // Existing properties
    this.handpose = null;
    this.hadPrediction = null;
    this.handLandmarks = [];
    this.handDetectionActive = false;
    this.landmarkCanvas = null;

    // Add these properties
    this.tmModel = null;
    this.tmPredictions = [];
    this.tmDetectionActive = false;
    this.tmCanvas = null;
    this.tmMaxPredictions = 0;
    this.isModelLoaded = false;

    this.loadRequiredScripts();
    // Add arrow detection properties

     this.arrowDetectionActive = false;
     this.arrowCanvas = null;
     this.arrowContext = null;
     this.directionHistory = [];
     this.lastDirection = "None";
     this.instantConfidence = 0;
     this.arrowDetectionInterval = null;
     
     // Configuration settings (add these)
     this.confidenceThreshold = 60;
     this.minArea = 800;
     this.edgeThreshold = 40;
     this.detectionMemory = 3;
     this.flipForwardBackward = true;
     this.flipLeftRight = false;
     this.MIN_STABLE_TIME_MS = 1000;

     this.detectedShape = "None";
     this.shapeConfidence = 0;

    // Load OpenCV.js
    this.loadOpenCV();
    console.log("Extension initialized");
  }
  async loadRequiredScripts() {
    return new Promise((resolve) => {
      if (window.tmImage && window.tf) {
        console.log("Scripts already loaded");
        resolve();
        return;
      }
      console.log("Loading TensorFlow.js...");
      const tfScript = document.createElement('script');
      tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
      tfScript.onload = () => {
        console.log("TensorFlow.js loaded, loading Teachable Machine...");
        const tmScript = document.createElement('script');
        tmScript.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js';
        tmScript.onload = () => {
          console.log("Teachable Machine loaded");
          resolve();
        };
        document.head.appendChild(tmScript);
      };
      document.head.appendChild(tfScript);
    });
  }
  loadOpenCV() {
    if (typeof cv !== 'undefined' && cv.Mat) {
      this.opencvLoaded = true;
      this.isModelLoaded = true;
      return;
    }
    
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/opencv.js@1.2.1/opencv.min.js');
    
    script.onload = () => {
      this.checkOpenCVReady();
    };
    
    script.onerror = () => {
      console.error("Failed to load OpenCV.js");
    };
    
    document.body.appendChild(script);
  }
  
  checkOpenCVReady() {
    if (typeof cv !== 'undefined' && cv.Mat) {
      this.opencvLoaded = true;
      this.isModelLoaded = true;
    } else {
      setTimeout(() => this.checkOpenCVReady(), 100);
    }
  }

  get EXTENSION_ID() {
    return "ipweb";
  }

  getInfo() {
    return [
      {
        id: "camerastream",
        name: formatMessage({
          id: "cameraStream.categoryName",
          default: "IP Webcam",
          description: "IP webcam or URL video stream",
        }),
        blocks: [
          {
            opcode: "startStream",
            text: formatMessage({
              id: "cameraStream.startStream",
              default: "start [URL]",
            }),
            blockType: BlockType.COMMAND,
            arguments: {
              URL: {
                type: ArgumentType.STRING,
                defaultValue: "http://192.168.0.101:81/stream", // Default IP webcam URL
              },
            },
          },
          {
            opcode: "stopStream",
            text: formatMessage({
              id: "cameraStream.stopStream",
              default: "stop streaming",
            }),
            blockType: BlockType.COMMAND,
          },
          {
            opcode: "startFaceDetection",
            text: formatMessage({
              id: "faceSensing.startFaceDetection",
              default: "Start Face Detection [STATE]",
              description: "Block to start face detection",
            }),
            blockType: BlockType.COMMAND,
            arguments: {
              STATE: {
                type: ArgumentType.STRING,
                menu: "onOffMenu",
                defaultValue: "on",
              },
            },
            filter: [TargetType.SPRITE],
          },
          
          {
            opcode: "faceCount",
            text: formatMessage({
              id: "faceSensing.faceCount",
              default: "No of face detected",
              description: "Block to start face detection",
            }),
            blockType: BlockType.REPORTER,
            filter: [TargetType.SPRITE],
          },
          {
            opcode: 'detectExpression',
            text: formatMessage({
              id: "faceSensing.detectExpression",
              default: "get face expression",
              description: "Block to start face detection",
            }),
            blockType: BlockType.REPORTER,
          },
          {
            opcode: "getLandmarkX",
            text: formatMessage({
              id: "faceSensing.getLandmarkX",
              default: "get [LANDMARK] X",
            }),
            blockType: BlockType.REPORTER,
            arguments: {
              LANDMARK: {
                type: ArgumentType.STRING,
                menu: "landmarkMenu",
              },
            },
            filter: [TargetType.SPRITE],
          },
          {
            opcode: "getLandmarkY",
            text: formatMessage({
              id: "faceSensing.getLandmarkY",
              default: "get [LANDMARK] Y",
            }),
            blockType: BlockType.REPORTER,
            arguments: {
              LANDMARK: {
                type: ArgumentType.STRING,
                menu: "landmarkMenu",
              },
            },
            filter: [TargetType.SPRITE],
          },
          {
            opcode: "areaOfBox",
            text: formatMessage({
              id: "faceSensing.areaOfBox",
              default: "area of Box",
            }),
            blockType: BlockType.REPORTER,
          },         
        ],
        menus: {
          onOffMenu: {
            acceptReporters: true,
            items: [
              { text: formatMessage({ id: "on", default: "on" }), value: "on" },
              {
                text: formatMessage({ id: "off", default: "off" }),
                value: "off",
              },
            ],
          },
          landmarkMenu: {
            acceptReporters: true,
            items: [
              { text: "Nose Tip", value: "4" },
              { text: "Left Eye Center", value: "133" },
              { text: "Right Eye Center", value: "362" },
              { text: "Mouth Left Corner", value: "61" },
              { text: "Mouth Right Corner", value: "291" },
              { text: "Forehead Center", value: "10" },
            ],
          },
        },
      },
      {
        id: "qrDetection",
        name: formatMessage({
          id: "cameraStream.qrDetection",
          default: "QR Detection",
          description: "IP webcam or URL video stream",
        }),
        blocks: [ 
          {
            opcode: "startStream",
            text: formatMessage({
              id: "cameraStream.startStream",
              default: "start [URL]",
            }),
            blockType: BlockType.COMMAND,
            arguments: {
              URL: {
                type: ArgumentType.STRING,
                defaultValue: "http://192.168.0.101:81/stream", // Default IP webcam URL
              },
            },
          },
          {
            opcode: "stopStream",
            text: formatMessage({
              id: "cameraStream.stopStream",
              default: "stop streaming",
            }),
            blockType: BlockType.COMMAND,
          },        
          {
            opcode: "startQRDetection",
            text: formatMessage({
              id: "qrDetection.start",
              default: "start QR detection from IP camera",
            }),
            blockType: BlockType.COMMAND
          },
          {
            opcode: "stopQRDetection",
            text: formatMessage({
              id: "qrDetection.stop",
              default: "stop QR detection",
            }),
            blockType: BlockType.COMMAND
          },
          {
            opcode: "getQRData",
            text: formatMessage({
              id: "qrDetection.getData",
              default: "QR code data",
            }),
            blockType: BlockType.REPORTER
          }
        ],
        menus: {
          onOffMenu: {
            acceptReporters: true,
            items: [
              { text: formatMessage({ id: "on", default: "on" }), value: "on" },
              {
                text: formatMessage({ id: "off", default: "off" }),
                value: "off",
              },
            ],
          },
        },
      },

      {
        id: "handDetection",
        name: formatMessage({
          id: "cameraStream.handDetection",
          default: "Hand Detection",
          description: "IP webcam or URL video stream",
        }),
        blocks: [
          {
            opcode: "startHandDetection",
            blockType: BlockType.COMMAND,
            text: "Start hand detection [STATE]",
            arguments: {
              STATE: {
                type: ArgumentType.STRING,
                menu: "onOffMenu",
                defaultValue: "on"
              }
            }
          },
          {
            opcode: "stopHandDetection",
            blockType: BlockType.COMMAND,
            text: "Stop hand detection"
          },
          {
            opcode: "getHandX",
            blockType: BlockType.REPORTER,
            text: "Hand [LANDMARK] X",
            arguments: {
              LANDMARK: {
                type: ArgumentType.STRING,
                menu: "handLandmarkMenu",
                defaultValue: "1"
              }
            }
          },
          // {
          //   opcode: "getHandY",
          //   blockType: BlockType.REPORTER,
          //   text: "Hand [LANDMARK] Y",
          //   arguments: {
          //     LANDMARK: {
          //       type: ArgumentType.STRING,
          //       menu: "handLandmarkMenu",
          //       defaultValue: "1"
          //     }
          //   }
          // },
          {
            opcode: "getHandZ",
            blockType: BlockType.REPORTER,
            text: "Hand [LANDMARK] Z",
            arguments: {
              LANDMARK: {
                type: ArgumentType.STRING,
                menu: "handLandmarkMenu",
                defaultValue: "1"
              }
            }
          },
          
          {
            opcode: "toggleLandmarks",
            blockType: BlockType.COMMAND,
            text: "Draw landmarks [DRAW]",
            arguments: {
              DRAW: {
                type: ArgumentType.STRING,
                menu: "onOffMenu",
                defaultValue: "on"
              }
            }
          }        
        ],
        menus: {
          onOffMenu: {
            acceptReporters: true,
            items: [
              { text: formatMessage({ id: "on", default: "on" }), value: "on" },
              {
                text: formatMessage({ id: "off", default: "off" }),
                value: "off",
              },
            ],
          },
          handLandmarkMenu: {
            acceptReporters: true,
            items:[
                { text: "Wrist", value: "0" },
                { text: "Thumb CMC", value: "1" },
                { text: "Thumb MCP", value: "2" },
                { text: "Thumb IP", value: "3" },
                { text: "Thumb Tip", value: "4" },
                { text: "Index Finger MCP", value: "5" },
                { text: "Index Finger PIP", value: "6" },
                { text: "Index Finger DIP", value: "7" },
                { text: "Index Finger Tip", value: "8" },
                { text: "Middle Finger MCP", value: "9" },
                { text: "Middle Finger PIP", value: "10" },
                { text: "Middle Finger DIP", value: "11" },
                { text: "Middle Finger Tip", value: "12" },
                { text: "Ring Finger MCP", value: "13" },
                { text: "Ring Finger PIP", value: "14" },
                { text: "Ring Finger DIP", value: "15" },
                { text: "Ring Finger Tip", value: "16" },
                { text: "Pinky MCP", value: "17" },
                { text: "Pinky PIP", value: "18" },
                { text: "Pinky DIP", value: "19" },
                { text: "Pinky Tip", value: "20" }
            ]
          }
        },
      },
      {
        id: "teachableMachine",
        name: "Teachable Machine",
        blocks: [
          {
            opcode: "loadTMModel",
            text: "load model from [URL]",
            blockType: BlockType.COMMAND,
            arguments: {
              URL: {
                type: ArgumentType.STRING,
                defaultValue: "https://your-model-url/"
              }
            }
          },
          {
            opcode: "startTMDetection",
            text: "start TM detection [STATE]",
            blockType: BlockType.COMMAND,
            arguments: {
              STATE: {
                type: ArgumentType.STRING,
                menu: "onOffMenu",
                defaultValue: "on"
              }
            }
          },
          {
            opcode: "getTopPrediction",
            text: "top prediction",
            blockType: BlockType.REPORTER
          }
        ],
        menus: {
          onOffMenu: {
            acceptReporters: true,
            items: [
              { text: formatMessage({ id: "on", default: "on" }), value: "on" },
              {
                text: formatMessage({ id: "off", default: "off" }),
                value: "off",
              },
            ],
          }
        }
      },
      {
        id: "arrowDetectionBlocks",
        name: "Arrow Detection",
        blocks:[
          {
            opcode: "startArrowDetection",
            text: formatMessage({
              id: "arrowDetectionBlocks.startArrowDetection",
              default: "start detection [STATE]",
              description: "Block to start arrow detection",
            }),
            blockType: BlockType.COMMAND,
            arguments:{
              STATE:{
                type: ArgumentType.STRING,
                menu: "onOffMenu",
                defaultValue: "on"
              }
            }
          },
          {
            opcode: "getArrowDirection",
            text: "current arrow direction",
            blockType: BlockType.REPORTER
          },
          {
            opcode: "getArrowConfidence",
            text: "arrow detection confidence",
            blockType: BlockType.REPORTER
          },
          {
            opcode: "getDetectedShape",
            text: "detected shape",
            blockType: BlockType.REPORTER
          },
          {
            opcode: "getShapeConfidence",
            text: "shape detection confidence",
            blockType: BlockType.REPORTER
          }
        ],
        menus: {
          onOffMenu: {
            acceptReporters: true,
            items: [
              { text: formatMessage({ id: "on", default: "on" }), value: "on" },
              {
                text: formatMessage({ id: "off", default: "off" }),
                value: "off",
              },
            ],
          }
        }
      }
    ];
  }
  async loadTMModel(args) {
    try {
      const modelURL = Cast.toString(args.URL);
      console.log("Loading TM model from:", modelURL);

      await this.loadRequiredScripts();

      this.tmModel = await window.tmImage.load(
        `${modelURL}model.json`,
        `${modelURL}metadata.json`
      );
      
      this.tmMaxPredictions = this.tmModel.getTotalClasses();
      this.isModelLoaded = true;
      console.log("TM Model loaded with", this.tmMaxPredictions, "classes");
    } catch (error) {
      console.error("TM Model loading failed:", error);
      this.showAlert("Failed to load TM model!");
    }
  }
  startTMDetection(args) {
    const state = Cast.toString(args.STATE);
    
    if (state === "on") {
      if (!this.isModelLoaded) {
        this.showAlert("Load TM model first!");
        return;
      }
      
      if (!this.imageElement) {
        this.showAlert("Start IP camera first!");
        return;
      }

      this.tmDetectionActive = true;
      this.createTMPredictionCanvas();
      this.tmPredictionLoop();
    } else {
      this.stopTMDetection();
    }
  }

  async tmPredictionLoop() {
    while (this.tmDetectionActive) {
      try {
        if (!this.imageElement.complete || this.imageElement.naturalWidth === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }

        this.tmPredictions = await this.tmModel.predict(this.imageElement);
        this.drawTMPredictions();
        await new Promise(resolve => requestAnimationFrame(resolve));
      } catch (error) {
        console.error("TM Prediction error:", error);
        this.tmDetectionActive = false;
      }
    }
  }

  createTMPredictionCanvas() {
    if (!this.tmCanvas) {
      this.tmCanvas = document.createElement("canvas");
      this.tmCanvas.style.position = "absolute";
      this.tmCanvas.style.top = "20px";
      this.tmCanvas.style.left = "20px";
      this.tmCanvas.style.zIndex = "1000";
      document.body.appendChild(this.tmCanvas);
    }
    return this.tmCanvas;
  }

  drawTMPredictions() {
    const ctx = this.tmCanvas.getContext("2d");
    ctx.clearRect(0, 0, this.tmCanvas.width, this.tmCanvas.height);
    
    if (this.tmPredictions.length > 0) {
      const top = this.tmPredictions.reduce((a, b) => 
        a.probability > b.probability ? a : b
      );
      
      ctx.fillStyle = "#FFA500";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${top.className}: ${Math.round(top.probability * 100)}%`,
        10, 30
      );
    }
  }

  getTopPrediction() {
    if (!this.tmPredictions.length) return "";
    return this.tmPredictions.reduce((a, b) => 
      a.probability > b.probability ? a : b
    ).className;
  }

  stopTMDetection() {
    this.tmDetectionActive = false;
    if (this.tmCanvas) {
      this.tmCanvas.remove();
      this.tmCanvas = null;
    }
  }
  async startStream({ URL }) {
    console.log("startStream called with URL:", URL);
    try {
      await this.setupImageStream(URL);
      console.log("Image stream started.");
    } catch (error) {
      console.error("Error starting image stream:", error);
    }
  }

  stopStream() {
    this.stopArrowDetection();
    console.log("stopStream called");
    this.stopTMDetection();
    try {
      if (this.imageElement) {
        this.imageElement.style.display = "none"; // Hide the image instead of removing it
      }
      if (this.intervalId) {
        clearInterval(this.intervalId); // Stop the image refresh
        this.intervalId = null;
      }
      this.stopQRDetection();

      if (this.qrOverlayCanvas && this.qrOverlayCanvas.parentNode) {
        this.qrOverlayCanvas.parentNode.removeChild(this.qrOverlayCanvas);
        this.qrOverlayCanvas = null;
      }
      
      console.log("Image stream stopped.");
    } catch (error) {
      console.error("Error stopping image stream:", error);
    }
  }

  async faceCount(){
    console.log("face counter start");
    console.log("face count");
    
      return this.faces.length;
      
  }
  
// Add the detectExpression method to the class
detectExpression() {
  if (!this.faces || this.faces.length === 0) {
    return "No face detected";
  }
  const landmarks = this.faces[0].keypoints;
  return this.calculateExpression(landmarks);
}

// Update the calculateExpression method with normalized coordinates
calculateExpression(landmarks) {
  if (!landmarks || landmarks.length < 468) {
    return "No face detected";
  }

  // Get image dimensions for normalization
  const imageWidth = this.imageElement.width;
  const imageHeight = this.imageElement.height;

  // Normalize functions
  const normalizeX = (x) => x / imageWidth;
  const normalizeY = (y) => y / imageHeight;

  // Key landmarks
  const mouthLeft = landmarks[61];
  const mouthRight = landmarks[291];
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  const leftEyebrow = landmarks[105];
  const rightEyebrow = landmarks[334];
  const leftInnerEyebrow = landmarks[336];  // Left eyebrow inner point
  const rightInnerEyebrow = landmarks[107]; // Right eyebrow inner point

  // Calculate normalized mouth dimensions
  const mouthHeight = Math.abs(normalizeY(upperLip[1]) - normalizeY(lowerLip[1]));
  const mouthWidth = Math.abs(normalizeX(mouthRight[0]) - normalizeX(mouthLeft[0]));

  // Calculate eyebrow features
  const leftInnerEyebrowY = normalizeY(leftInnerEyebrow[1]);
  const rightInnerEyebrowY = normalizeY(rightInnerEyebrow[1]);
  const leftEyebrowY = normalizeY(leftEyebrow[1]);
  const rightEyebrowY = normalizeY(rightEyebrow[1]);
  
  // Average Y positions for inner and outer eyebrows
  const innerEyebrowAvgY = (leftInnerEyebrowY + rightInnerEyebrowY) / 2;
  const outerEyebrowAvgY = (leftEyebrowY + rightEyebrowY) / 2;
  const eyebrowRaiseDifference = outerEyebrowAvgY - innerEyebrowAvgY;

  // Calculate mouth corner positions relative to lips
  const upperLipY = normalizeY(upperLip[1]);
  const lowerLipY = normalizeY(lowerLip[1]);
  const midLipY = (upperLipY + lowerLipY) / 2;
  const mouthCornersY = (normalizeY(mouthLeft[1]) + normalizeY(mouthRight[1])) / 2;
  const mouthCornersDifference = mouthCornersY - midLipY;

  // Define thresholds (adjust based on testing)
  const MOUTH_SURPRISE_HEIGHT = 0.07;
  const MOUTH_SMILE_WIDTH = 0.15;
  const MOUTH_SMILE_HEIGHT = 0.03;
  const EYEBROW_SAD_DIFFERENCE = 0.02; // Inner vs outer eyebrow position
  const MOUTH_SAD_DIFFERENCE = 0.02;    // Mouth corners vs lip center

  // Check expressions in order of priority
  if (mouthHeight > MOUTH_SURPRISE_HEIGHT && mouthWidth > MOUTH_SMILE_WIDTH) {
    return "Surprised";
  } else if (mouthWidth > MOUTH_SMILE_WIDTH && mouthHeight > MOUTH_SMILE_HEIGHT) {
    return "Smiling";
  } else if (
    eyebrowRaiseDifference > EYEBROW_SAD_DIFFERENCE &&
    mouthCornersDifference > MOUTH_SAD_DIFFERENCE) {
    return "Sad";
  } else {
    return "Neutral";
  }
}


  getLandmarkX(args) {
    const landmarkIndex = Cast.toNumber(args.LANDMARK);
    if (!this.faces.length) return 0;
    
    const face = this.faces[0];
    if (landmarkIndex < 0 || landmarkIndex >= face.keypoints.length) return 0;
    
    // Convert X to center-based coordinate system
    const originalX = face.keypoints[landmarkIndex][0];
    return Math.round(originalX - (this.imageElement.width / 2));
  }
  
  getLandmarkY(args) {
    const landmarkIndex = Cast.toNumber(args.LANDMARK);
    if (!this.faces.length) return 0;
    
    const face = this.faces[0];
    if (landmarkIndex < 0 || landmarkIndex >= face.keypoints.length) return 0;
    
    // Convert Y to center-based coordinate system (inverted Y-axis)
    const originalY = face.keypoints[landmarkIndex][1];
    return Math.round((originalY - (this.imageElement.height / 2)) * -1);
  }
  async setupImageStream(url) {
    if (!this.imageElement) {
      this.imageElement = document.createElement("img");
      // Set crossOrigin attribute for CORS handling
      this.imageElement.crossOrigin = "anonymous"; // Added line
      this.imageElement.style.position = "absolute";
      this.imageElement.style.top = "100px";
      this.imageElement.style.right = "10px";
      this.imageElement.width = 480;
      this.imageElement.height = 360;
      document.body.appendChild(this.imageElement); 
    }
    this.imageElement.style.display = "block";

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timed out"));
        this.showAlert(`
          Camera Connection Failed:
          1. Verify IP address and port
          2. Ensure device is on same network
          3. Check if IP Webcam app is running
        `);
      }, 8000);

      this.imageElement.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      this.imageElement.onerror = (error) => {
        clearTimeout(timeout);
        reject(error);
      };

      this.imageElement.src = `${url}?time=${new Date().getTime()}`;
    });
  }

  stopStream() {
    console.log("stopStream called");
    try {
      if (this.imageElement) {
        this.imageElement.style.display = "none";
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.predictions = [];
      
      // Stop all detection systems
      this.stopQRDetection();
      this.stopFaceDetection();
      this.stopHandDetection();

      // Cleanup canvases
      [this.qrOverlayCanvas, this.arrowCanvas].forEach(canvas => {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      });

      this.qrOverlayCanvas = null;
      this.arrowCanvas = null;
      
      console.log("Image stream stopped completely");
    } catch (error) {
      console.error("Error stopping stream:", error);
    }
  }
  
  async startFaceDetection({ STATE }) {
    if (STATE === "off") {
      this.stopFaceDetection();
      return;
    }

    if (!this.facemesh) {
      this.showAlert("Loading Face Detection Model. Please wait...");
      // Load the face detection model
      this.facemesh = await ml5.facemesh(this.imageElement, () => {
        console.log("Face detection model loaded!");
        this.closeAlert();
      });

      // Set up prediction callback
      this.facemesh.on("predict", (results) => {
        this.faces = results.map((face) => ({ keypoints: face.scaledMesh }));
        console.log("Face detection results:", this.faces);
        this.drawBoundingBox();
      });
    }

    // Start face detection interval
    this.faceDetectionInterval = setInterval(() => {
      if (this.imageElement && 
          this.imageElement.complete && 
          this.imageElement.naturalHeight !== 0) {
        this.facemesh.predict(this.imageElement);
      }
    }, 100);
  }

  areaOfBox() {
    if (!this.faces || this.faces.length === 0) {
        return 0; // Return 0 if no face detected
    }

    let face = this.faces[0]; // Get the first detected face
    const keypoints = face.keypoints;

    const xs = keypoints.map((point) => point[0]);
    const ys = keypoints.map((point) => point[1]);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;
    const area = width * height;

    // Define max possible area (full image area)
    const maxWidth = this.canvas.width;  
    const maxHeight = this.canvas.height;
    const maxArea = maxWidth * maxHeight;

    // Normalize area to 0-100 range
    const normalizedArea = (area / maxArea) * 100;

    return Math.round(Math.min(100, Math.max(0, normalizedArea))); // Ensure it stays within 0-100
}


  stopFaceDetection() {
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }
    this.clearCanvas(this.canvas);
  }
  startQRDetection() {
    if (!this.qrCanvas) {
      this.qrCanvas = document.createElement('canvas');
      this.qrContext = this.qrCanvas.getContext('2d');
    }

    // Create overlay canvas for boundary box if it doesn't exist
    if (!this.qrOverlayCanvas) {
      this.qrOverlayCanvas = document.createElement('canvas');
      this.qrOverlayCanvas.style.position = 'absolute';
      this.qrOverlayCanvas.style.top = this.imageElement.style.top;
      this.qrOverlayCanvas.style.right = this.imageElement.style.right;
      this.qrOverlayCanvas.style.zIndex = '1000';
      document.body.appendChild(this.qrOverlayCanvas);
    }

    // Set canvas sizes to match video stream
    this.qrCanvas.width = this.imageElement.width;
    this.qrCanvas.height = this.imageElement.height;
    this.qrOverlayCanvas.width = this.imageElement.width;
    this.qrOverlayCanvas.height = this.imageElement.height;

    const overlayCtx = this.qrOverlayCanvas.getContext('2d');

    // Start QR scanning interval
    this.qrScanningInterval = setInterval(() => {
      if (!this.imageElement || this.imageElement.naturalWidth === 0) return;

      try {
        // Clear previous frame
        overlayCtx.clearRect(0, 0, this.qrOverlayCanvas.width, this.qrOverlayCanvas.height);

        // Draw current frame to canvas
        this.qrContext.drawImage(
          this.imageElement,
          0, 0, this.qrCanvas.width, this.qrCanvas.height
        );

        // Get image data
        const imageData = this.qrContext.getImageData(
          0, 0, this.qrCanvas.width, this.qrCanvas.height
        );

        // Scan for QR codes
        const code = jsQR(
          imageData.data,
          imageData.width,
          imageData.height,
          { inversionAttempts: "dontInvert" }
        );

        if (code) {
          this.qrData = code.data;
          console.log('QR Code detected:', this.qrData);
          
          // Draw boundary box
          this.drawQRBoundary(overlayCtx, code.location);
        } else {
          this.qrData = null;
          // Draw "No QR" text when nothing detected
          this.drawNoQRIndicator(overlayCtx);
        }
      } catch (error) {
        console.error('QR scanning error:', error);
        this.qrData = null;
      }
    }, 500); // Scan every 500ms
  }
  drawQRBoundary(ctx, location) {
    ctx.strokeStyle = '#00FF00'; // Green boundary
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    // Draw boundary around QR code
    ctx.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
    ctx.lineTo(location.topRightCorner.x, location.topRightCorner.y);
    ctx.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
    ctx.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
    ctx.closePath();
    ctx.stroke();
    
    // Add label
    ctx.fillStyle = '#00FF00';
    ctx.font = '16px Arial';
    ctx.fillText('QR Detected', location.topLeftCorner.x, location.topLeftCorner.y - 10);
  }
  


  stopQRDetection() {
    if (this.qrScanningInterval) {
      clearInterval(this.qrScanningInterval);
      this.qrScanningInterval = null;
    }
    this.qrData = null;
    
    // Clear overlay
    if (this.qrOverlayCanvas) {
      const ctx = this.qrOverlayCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.qrOverlayCanvas.width, this.qrOverlayCanvas.height);
    }
  }
    getQRData() {
      return this.qrData || 'NULL';
    }
  drawBoundingBox() {
    if (!this.canvas) {
      // Create a canvas for drawing bounding boxes
      this.canvas = document.createElement("canvas");
      this.canvas.style.position = "absolute";
      this.canvas.style.top = this.imageElement.style.top;
      this.canvas.style.right = this.imageElement.style.right;
      this.canvas.width = this.imageElement.width;
      this.canvas.height = this.imageElement.height;
      document.body.appendChild(this.canvas);
      this.context = this.canvas.getContext("2d");
    }
    console.log("face length", this.faces.length);
    if (!this.context || !this.faces.length) {
      return console.log("nothing to draw");
    }

    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw bounding boxes around detected faces
    this.faces.forEach((face) => {
      const keypoints = face.keypoints;
      const xs = keypoints.map((point) => point[0]);
      const ys = keypoints.map((point) => point[1]);
      
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);

      // Draw rectangle around detected face
      this.context.strokeStyle = "red";
      this.context.lineWidth = 2;
      this.context.strokeRect(minX, minY, maxX - minX, maxY - minY);
    });
  }

  clearCanvas(canvas) {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  async startHandDetection(args) {
    const state = Cast.toString(args.STATE);
    if (state === "off") return this.stopHandDetection();
  
    if (!this.handpose) {
      this.showAlert("Loading Handpose model...");
      this.handpose = await ml5.handpose(
        this.imageElement,
        { flipHorizontal: true },
        () => {
          this.closeAlert();
          console.log("Handpose model ready!");
        }
      );
  
      // Set up prediction event listener
      this.handpose.on("predict", results => {
        this.handPredictions = results;
        if (this.drawLandmarks) {
          this.drawHandLandmarks();
        }
      });
    }
  
    // Start prediction loop
    this.handDetectionInterval = setInterval(() => {
      if (this.imageElement.complete && this.handpose) {
        this.handpose.predict(this.imageElement);
      }
    }, 100);
  }

  handDetectionLoop() {
    if (this.handDetectionInterval) clearInterval(this.handDetectionInterval);
    this.handDetectionInterval = setInterval(async () => {
      if (!this.imageElement.complete) return;
      
      const hands = await this.handpose.detect();
      this.handLandmarks = (hands && hands[0] && hands[0].landmarks) || [];
      this.drawHandLandmarks();
    }, 100);
  }
  
  drawHandLandmarks() {
    if (!this.landmarkCanvas) {
      this.landmarkCanvas = document.createElement('canvas');
      this.landmarkCanvas.width = this.imageElement.width;
      this.landmarkCanvas.height = this.imageElement.height;
      this.landmarkCanvas.style.position = 'absolute';
      this.landmarkCanvas.style.top = this.imageElement.style.top;
      this.landmarkCanvas.style.right = this.imageElement.style.right;
      document.body.appendChild(this.landmarkCanvas);
    }
  
    const ctx = this.landmarkCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.landmarkCanvas.width, this.landmarkCanvas.height);
  
    this.handPredictions.forEach(prediction => {
      // Draw landmarks (flipped horizontally)
      prediction.landmarks.forEach(landmark => {
        const flippedX = this.imageElement.width - landmark[0]; // Flip X coordinate
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(flippedX, landmark[1], 5, 0, 2 * Math.PI);
        ctx.fill();
      });
  
      // Draw connections between landmarks (flipped horizontally)
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      prediction.annotations.forEach(annotation => {
        const points = Object.values(annotation);
        ctx.beginPath();
        const firstPoint = points[0];
        ctx.moveTo(this.imageElement.width - firstPoint[0], firstPoint[1]);
        for (let i = 1; i < points.length; i++) {
          const point = points[i];
          ctx.lineTo(this.imageElement.width - point[0], point[1]);
        }
        ctx.stroke();
      });
    });
  }

  getHandX(args) {
    const idx = Cast.toNumber(args.LANDMARK);
    if (!this.handPredictions.length || !this.handPredictions[0].landmarks[idx]) {
      return 0;
    }
    
    const originalX = this.handPredictions[0].landmarks[idx][0];
    const centeredX = (this.imageElement.width - originalX) - (this.imageElement.width / 2);
    
    return Math.round(centeredX);
  }
  

  // getHandY(args) {
  //   const idx = Cast.toNumber(args.LANDMARK);
  //   if (!this.handPredictions.lengtFh || !this.handPredictions[0].landmarks[idx]) {
  //     return 0;
  //   }
    
  //   const originalY = this.handPredictions[0].landmarks[idx][1];
  //   const centeredY = (this.imageElement.width - originalY) - (this.imageElement.width / 2);
    
  //   return Math.round(centeredY);
  // }
  getHandZ(args) {
    const idx = Cast.toNumber(args.LANDMARK);
    if (!this.handPredictions.length || !this.handPredictions[0].landmarks[idx]) {
      return 0;
    }
  
    const landmarks = this.handPredictions[0].landmarks;
    const wristZ = landmarks[0][2]; // Wrist (landmark 0) as reference
    const currentZ = landmarks[idx][2];
    const scaledZ = Math.round((currentZ - wristZ) * 10);
  
    // Initialize history for this landmark
    if (!this.zHistory[idx]) {
      this.zHistory[idx] = [];
    }
  
    // Add new value and keep the array size reasonable
    const history = this.zHistory[idx];
    history.push(scaledZ);
    if (history.length > 5) { // adjust the number of frames to "slow down" updates
      history.shift();
    }
  
    // Return average value
    const sum = history.reduce((a, b) => a + b, 0);
    return Math.round(sum / history.length);
  }
stopHandDetection() {
  if (this.handDetectionInterval) {
    clearInterval(this.handDetectionInterval);
    this.handDetectionInterval = null;
  }
  this.handPredictions = [];
  if (this.landmarkCanvas) {
    this.landmarkCanvas.remove();
    this.landmarkCanvas = null;
  }
}
  toggleLandmarks(args) {
    this.drawLandmarks = Cast.toString(args.DRAW) === "on";
    if (!this.drawLandmarks && this.landmarkCanvas) {
      this.landmarkCanvas.getContext('2d').clearRect(0, 0, 480, 360);
    }
  }

  // Add arrow detection methods
   startArrowDetection(args) {
    const state = Cast.toString(args.STATE);
    if (state === "on") {
      if (!this.opencvLoaded) {
        this.showAlert("OpenCV not loaded!");
        return;
      }
      if (!this.imageElement) {
        this.showAlert("Start IP camera first!");
        return;
      }
      this.arrowDetectionActive = true;
      this.createArrowCanvas();
      this.startArrowDetectionLoop();
    } else {
      this.stopArrowDetection();
    }
  }

  createArrowCanvas() {
    if (!this.arrowCanvas) {
      this.arrowCanvas = document.createElement('canvas');
      this.arrowCanvas.width = this.processingWidth || 320;
      this.arrowCanvas.height = this.processingHeight || 240;
      this.arrowCanvas.style.display = 'none';
      document.body.appendChild(this.arrowCanvas);
      this.arrowContext = this.arrowCanvas.getContext('2d');
    }
  }

  startArrowDetectionLoop() {
    this.arrowDetectionInterval = setInterval(() => {
      this.processArrowFrame().catch(error => {
        console.error('Arrow detection error:', error);
      });
    }, 200);
  }
  async processArrowFrame() {
    const resources = [];
    
    try {
      // Verify IP camera image is ready
      if (!this.imageElement || 
          !this.imageElement.complete || 
          this.imageElement.naturalWidth === 0) {
        return;
      }
  
      // Set up processing canvas
      const ctx = this.arrowCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.arrowCanvas.width, this.arrowCanvas.height);
      
      // Draw IP camera frame to processing canvas
      ctx.drawImage(
        this.imageElement,
        0, 0, this.arrowCanvas.width, this.arrowCanvas.height
      );
  
      // Get image data for OpenCV processing
      const imageData = ctx.getImageData(
        0, 0, this.arrowCanvas.width, this.arrowCanvas.height
      );
      
      // Create OpenCV Mat from image data
      const src = new cv.Mat(this.arrowCanvas.height, this.arrowCanvas.width, cv.CV_8UC4);
      resources.push(src);
      src.data.set(imageData.data);
  
      // Convert to grayscale
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      resources.push(gray);
  
      // Apply Gaussian blur
      const blurred = new cv.Mat();
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
      resources.push(blurred);
  
      // Edge detection
      const edges = new cv.Mat();
      cv.Canny(blurred, edges, this.edgeThreshold, this.edgeThreshold * 3);
      resources.push(edges);
  
      // Morphological operations
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
      const dilated = new cv.Mat();
      cv.dilate(edges, dilated, kernel);
      cv.erode(dilated, edges, kernel);
      resources.push(kernel, dilated);
  
      // Find contours
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      resources.push(contours, hierarchy);
  
      let instantDirection = "None";
      let maxScore = 0;
      let instantConfidence = 0;
      
      // Add shape detection variables
      let detectedShape = "None";
      let shapeConfidence = 0;
  
      // Process each contour
      for (let i = 0; i < contours.size(); ++i) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt);
        if (area < this.minArea) continue;
  
        const rect = cv.boundingRect(cnt);
        const moments = cv.moments(cnt);
        if (moments.m00 === 0) continue;
  
        const cx = moments.m10 / moments.m00;
        const cy = moments.m01 / moments.m00;
  
        const hull = new cv.Mat();
        cv.convexHull(cnt, hull, false, true);
        const hullArea = cv.contourArea(hull);
        const solidity = area / hullArea;
        resources.push(hull);
  
        const width = rect.width;
        const height = rect.height;
        const aspectRatio = width / height;
        
        // Approximate contour to polygon
        const epsilon = 0.02 * cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, epsilon, true);
        resources.push(approx);
        
        const vertices = approx.rows;
        
        // Shape detection logic
        if (vertices === 3 && solidity > 0.85) {
          // Triangle detection
          const triangleConfidence = 80 + (solidity * 20); // Base confidence on solidity
          if (triangleConfidence > shapeConfidence) {
            detectedShape = "Triangle";
            shapeConfidence = triangleConfidence;
          }
        } else if (vertices >= 7 && vertices <= 9 && solidity > 0.8) {
          // Octagon detection (allowing some flexibility in vertex count)
          // Calculate circularity: 4Ï€ Ã— area / perimeterÂ²
          const perimeter = cv.arcLength(cnt, true);
          const circularity = (4 * Math.PI * area) / (perimeter * perimeter);
          
          // Octagons have high circularity
          if (circularity > 0.7) {
            const octagonConfidence = 70 + (circularity * 30); // Base confidence on circularity
            if (octagonConfidence > shapeConfidence) {
              detectedShape = "Octagon";
              shapeConfidence = octagonConfidence;
            }
          }
        }
  
        // Original arrow detection logic
        let leftScore = 0, rightScore = 0, upScore = 0, downScore = 0;
  
        // Direction scoring logic
        if (solidity < 0.8) {
          if (aspectRatio > 1.3) { // Horizontal arrow
            let horizontalOffset = cx - (rect.x + width/2);
            if (this.flipLeftRight) horizontalOffset = -horizontalOffset;
            
            if (horizontalOffset < 0) {
              rightScore = area * (1 + Math.abs(horizontalOffset/width)*3);
            } else {
              leftScore = area * (1 + Math.abs(horizontalOffset/width)*3);
            }
          } else if (aspectRatio < 0.7) { // Vertical arrow
            let verticalOffset = cy - (rect.y + height/2);
            if (this.flipForwardBackward) verticalOffset = -verticalOffset;
            
            if (verticalOffset < 0) {
              downScore = area * (1 + Math.abs(verticalOffset/height)*3);
            } else {
              upScore = area * (1 + Math.abs(verticalOffset/height)*3);
            }
          }
        }
  
        // Determine direction from scores
        const scores = [
          { dir: "Right", score: leftScore },
          { dir: "Left", score: rightScore },
          { dir: "Forward", score: upScore },
          { dir: "Backward", score: downScore }
        ].sort((a, b) => b.score - a.score);
  
        if (scores[0].score > maxScore && scores[0].score > 0) {
          instantDirection = scores[0].dir;
          maxScore = scores[0].score;
          instantConfidence = scores[1] && scores[1].score > 0
            ? ((scores[0].score - scores[1].score) / scores[0].score * 100)
            : 100;
        }
      }
  
      // Update direction history for arrow
      this.directionHistory.push(instantDirection);
      while (this.directionHistory.length > this.detectionMemory) {
        this.directionHistory.shift();
      }
  
      // Calculate arrow direction confidence
      const counts = {};
      for (const dir of this.directionHistory) {
        counts[dir] = (counts[dir] || 0) + 1;
      }
      
      let currentDirection = "None";
      let maxCount = 0;
      for (const dir in counts) {
        if (counts[dir] > maxCount) {
          maxCount = counts[dir];
          currentDirection = dir;
        }
      }
  
      // Update final arrow direction
      this.instantConfidence = Math.round((maxCount / this.directionHistory.length) * 100);
      if (this.instantConfidence >= this.confidenceThreshold) {
        this.lastDirection = currentDirection;
      } else {
        this.lastDirection = "None";
      }
          
      // Update shape detection properties
      this.detectedShape = detectedShape;
      this.shapeConfidence = Math.round(shapeConfidence);
  
    } catch (error) {
      console.error('Arrow and shape detection error:', error);
      this.errorCount++;
      if (this.errorCount >= this.maxErrorsBeforeReset) {
        this.resetDetection();
      }
    } finally {
      // Cleanup OpenCV resources
      resources.forEach(res => {
        try {
          if (res && !res.isDeleted) res.delete();
        } catch (e) {
          console.warn('Error cleaning resource:', e);
        }
      });
    }
  }
  
  getArrowDirection() {
    return this.lastDirection || "None";
  }

  getArrowConfidence() {
    return this.instantConfidence || 0;
  }
  // Add these methods to get shape information
  getDetectedShape() {
    return this.detectedShape || "None";
  }

  getShapeConfidence() {
    return this.shapeConfidence || 0;
  }

  stopArrowDetection() {
    this.arrowDetectionActive = false;
    if (this.arrowDetectionInterval) {
      clearInterval(this.arrowDetectionInterval);
    }
    if (this.arrowCanvas) {
      this.arrowCanvas.remove();
      this.arrowCanvas = null;
    }
  }


  showAlert(message) {
    if (this.popupElement) 
        this.closeAlert(); // Prevent duplicate alerts

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;
    
   // Style for alert popup
   popup.style.cssText = 
  'position: fixed;' +
  'top: 100px;' +
  'left: 50%;' +
  'transform: translateX(-50%);' +
  'background: rgba(0, 0, 0, 0.8);' +
  'color: white;' +
  'padding: 20px;' +
  'height: auto;' +
  'width: auto;' +
  'border-radius: 10px;' +
  'z-index: 10000;' +
  'font-size: 16px;' +
  'text-align: center;' +
  'display: flex;' +
  'align-items: center;' +
  'justify-content: center;' +
  'box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);';
   document.body.appendChild(popup);
   this.popupElement = popup;
 }

 closeAlert() {
   if (this.popupElement) {
       this.popupElement.remove();
       this.popupElement = null;
   }
 }
}

module.exports = Scratch3CameraStreamBlocks;