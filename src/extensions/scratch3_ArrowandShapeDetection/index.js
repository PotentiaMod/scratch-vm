const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const TargetType = require("../../extension-support/target-type");
const formatMessage = require("format-message");

const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAgVBMVEVHcEwwMmMwM2YwMmIwMmMwMmMxNm8wMmMyOno/Ze0wMmNAZu8wMmNAZu8wMmMwMmNAZu9AZu9AZu9AZu86U7tAZu8wMmMwMmNAZu9AZu9AZu9AZvBAZu8/ZewwMWIwMmNAZu8wMmNAZu8wMmNAZu8wMWEwMmMwMmMwMmNAZu8wMmP8Ue8lAAAAKXRSTlMAugcSHeML1gSZyvn2Sd9y8rfFQOpiw0PTc+vhizYZrBaXI16pGiWH6cCzHk8AAAHUSURBVEjHtZZte4IgFIbJysGQRMipqMuVbqP//wOnrJIX2fC6tudDfYj76rxwHg4AhrqKUUnL5gxCxRmWSmUeSJBa3kWrIOJcylmChCCN1JXFzgH4XuzMP6kNhHKbiD/2ySGN9EywgcgKRoZgeh2VXDQkfxzGGR0/jxtLnxNy3SwigrMJ2VtKFPKyHFiVC8zaYWfqTSGp3vgZETknnMea4Hhid0quydtWa7yeOmZZfXzWdJpObou0mEvfmhWedHzSpBAA9ZJnDiHRVpPb15auRnKXWArsV+SH9CGvWrYQmF3k4VHkDlGJWiSwjex8rexUsTLC89IKzHdhILo1r8yEhfiuJVHlFZnbShR5Ln8//coIcXuJfCNWqzlHWP6O3AcZq9wXiAXkpm+ErkFugdHAwN7Hr1Xpfyb7MX2iuiHYiiLDRnrkd5iu9yEHS7PDdA1dRNCrpmEYXj9mh4G8KeWqyz+pChqxuLgUD0uu/maQUazZReQ6zG1WMA52mPugNX1wYOCs/CJrtdIdXzSpQm0vusGCcy/Kpu19F0bZ+OZq2DiIWp6zMId5pEPqQIfxFzrg4XOeVwBNuc9rwCN+SJ5SuGpVAPaqYC0kfPXak//bchW2wn0BXKyu2pR4fFQAAAAASUVORK5CYII=";

class Scratch3ArrowAndShapeDetection {
  constructor(runtime) {
    this.runtime = runtime;
    this.isModelLoaded = false;
    this.detectionActive = false;
    this.videoEnabled = false;
    this.canvas = null;
    this.detectionInterval = null;
    this.opencvLoaded = false;
    this.errorCount = 0;
    this.maxErrorsBeforeReset = 3;
    
    // Arrow detection specific properties
    this.directionHistory = [];
    this.lastDirection = "None";
    this.instantConfidence = 0;
    
    // Configuration settings
    this.confidenceThreshold = 60;
    this.minArea = 800;
    this.edgeThreshold = 40;
    this.detectionMemory = 3;
    this.flipForwardBackward = true;
    this.flipLeftRight = false;
    this.MIN_STABLE_TIME_MS = 1000;
    
    // Processing settings
    this.processingWidth = 320;
    this.processingHeight = 240;
    
    // Create canvas for processing
    this.createCanvas();
    
    // Load OpenCV.js
    this.loadOpenCV();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.processingWidth;
    this.canvas.height = this.processingHeight;
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);
  }

  loadOpenCV() {
    if (typeof cv !== 'undefined' && cv.Mat) {
      this.opencvLoaded = true;
      this.isModelLoaded = true;
      return;
    }
    // Mask Node's process to force browser loader in Electron
    const originalWindowProcess = typeof window !== 'undefined' ? window.process : undefined;
    const originalGlobalProcess = typeof globalThis !== 'undefined' ? globalThis.process : undefined;
    try {
      try { Object.defineProperty(globalThis, 'process', { value: undefined, configurable: true, writable: true }); } catch (_) { globalThis.process = undefined; }
      try { Object.defineProperty(window, 'process', { value: undefined, configurable: true, writable: true }); } catch (_) { window.process = undefined; }
      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/opencv.js@1.2.1/opencv.min.js');
      script.onload = () => { this.checkOpenCVReady(); };
      script.onerror = () => { console.error('Failed to load OpenCV.js'); };
      document.body.appendChild(script);
    } finally {
      // Restore Node's process after loading so GUI can use process.env
      try { Object.defineProperty(globalThis, 'process', { value: originalGlobalProcess, configurable: true, writable: true }); } catch (_) { globalThis.process = originalGlobalProcess; }
      try { Object.defineProperty(window, 'process', { value: originalWindowProcess, configurable: true, writable: true }); } catch (_) { window.process = originalWindowProcess; }
    }
  }
  
  checkOpenCVReady() {
    if (typeof cv !== 'undefined' && cv.Mat) {
      this.opencvLoaded = true;
      this.isModelLoaded = true;
    } else {
      setTimeout(() => this.checkOpenCVReady(), 100);
    }
  }

  openCamera(args) {
    const state = Cast.toString(args.STATE);
    if (state === "on") {
      this.startVideo();
    } else {
      this.stopVideo();
    }
  }

  startVideo() {
    if (!this.videoEnabled) {
      this.runtime.ioDevices.video.enableVideo();
      this.videoEnabled = true;
    }
  }

  stopVideo() {
    if (this.videoEnabled) {
      this.runtime.ioDevices.video.disableVideo();
      this.clearCanvas();
      this.videoEnabled = false;
    }
  }

  async processVideoFrame() {
    const resources = [];
  
    try {
      const video = this.runtime.ioDevices.video.provider &&
                    this.runtime.ioDevices.video.provider.video;
      if (!video || video.readyState < 2) return;
  
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(video, 0, 0, this.processingWidth, this.processingHeight);
  
      const imageData = ctx.getImageData(0, 0, this.processingWidth, this.processingHeight);
      const src = new cv.Mat(this.processingHeight, this.processingWidth, cv.CV_8UC4);
      resources.push(src);
  
      if (src.data && imageData.data && src.data.length >= imageData.data.length) {
        src.data.set(imageData.data);
      } else {
        return;
      }
  
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      resources.push(gray);
  
      const blurred = new cv.Mat();
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
      resources.push(blurred);
  
      const edges = new cv.Mat();
      cv.Canny(blurred, edges, this.edgeThreshold, this.edgeThreshold * 3);
      resources.push(edges);
  
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
      const dilated = new cv.Mat();
      cv.dilate(edges, dilated, kernel);
      cv.erode(dilated, edges, kernel);
      resources.push(kernel, dilated);
  
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      resources.push(contours, hierarchy);
  
      let instantDirection = "None";
      let maxScore = 0;
      let instantConfidence = 0;
  
      for (let i = 0; i < contours.size(); ++i) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt);
        if (area < this.minArea) continue;
  
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * cv.arcLength(cnt, true), true);
        resources.push(approx);
  
        // Detect Stop
        if (approx.rows === 8) {
          instantDirection = "Stop";
          maxScore = area;
          instantConfidence = 100;
          break;
        }
  
        // ✅ Detect Triangle
        if (approx.rows === 3) {
          instantDirection = "Triangle";
          maxScore = area;
          instantConfidence = 100;
          break;
        }
  
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
  
        let leftScore = 0, rightScore = 0, upScore = 0, downScore = 0;
  
        if (solidity < 0.8) {
          if (aspectRatio > 1.3) {
            let horizontalOffset = cx - (rect.x + width / 2);
            if (this.flipLeftRight) horizontalOffset = -horizontalOffset;
  
            if (horizontalOffset < 0) {
              rightScore = area * (1 + Math.abs(horizontalOffset / width) * 3);
            } else {
              leftScore = area * (1 + Math.abs(horizontalOffset / width) * 3);
            }
          } else if (aspectRatio < 0.7) {
            let verticalOffset = cy - (rect.y + height / 2);
            if (this.flipForwardBackward) verticalOffset = -verticalOffset;
  
            if (verticalOffset < 0) {
              downScore = area * (1 + Math.abs(verticalOffset / height) * 3);
            } else {
              upScore = area * (1 + Math.abs(verticalOffset / height) * 3);
            }
          }
        }
  
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
            ? ((scores[0].score - scores[1].score) / scores[0].score) * 100
            : 100;
        }
      }
  
      this.directionHistory.push(instantDirection);
      while (this.directionHistory.length > this.detectionMemory) {
        this.directionHistory.shift();
      }
  
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
  
      const now = Date.now();
      if (currentDirection !== this.lastStableDirection) {
        this.lastStableDirection = currentDirection;
        this.stableDirectionStartTime = now;
      } else if (now - this.stableDirectionStartTime >= this.MIN_STABLE_TIME_MS) {
        this.stableDirection = currentDirection;
      }
  
      this.instantConfidence = Math.round((maxCount / this.directionHistory.length) * 100);
      this.lastDirection = this.instantConfidence >= this.confidenceThreshold ? currentDirection : "None";
  
    } catch (error) {
      console.error('Video processing error:', error);
      this.errorCount++;
      if (this.errorCount >= this.maxErrorsBeforeReset) {
        this.resetDetection();
      }
    } finally {
      resources.forEach(res => {
        try {
          if (res && !res.isDeleted) res.delete();
        } catch (e) {
          console.warn('Error cleaning resource:', e);
        }
      });
    }
  }
  
  
  

  async startDetection(args) {
    const state = Cast.toString(args.STATE);
    
    if (state === "on") {
      if (!this.isModelLoaded) {
        console.log("Load model first!");
        return;
      }
  
      if (!this.videoEnabled) {
        console.log("Enable camera first!");
        return;
      }
      
      this.errorCount = 0;
      this.detectionActive = true;
      this.predictionLoop();
    } else {
      this.detectionActive = false;
      if (this.detectionInterval) {
        clearInterval(this.detectionInterval);
        this.detectionInterval = null;
      }
    }
  }
  
  updateDirectionHistory(detectedDirection) {
    this.directionHistory.push(detectedDirection);
    
    if (this.directionHistory.length > this.detectionMemory) {
      this.directionHistory.shift();
    }
    
    const counts = {};
    for (const dir of this.directionHistory) {
      counts[dir] = (counts[dir] || 0) + 1;
    }
    
    let maxCount = 0;
    let mostFrequentDirection = "None";
    
    for (const dir in counts) {
      if (counts[dir] > maxCount) {
        maxCount = counts[dir];
        mostFrequentDirection = dir;
      }
    }
    
    this.instantConfidence = Math.round((maxCount / this.directionHistory.length) * 100);
    
    if (this.instantConfidence >= this.confidenceThreshold) {
      this.lastDirection = mostFrequentDirection;
    }
  }
  
  resetDetection() {
    this.errorCount = 0;
    this.directionHistory = [];
    this.lastDirection = "None";
    this.instantConfidence = 0;
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    if (this.detectionActive) {
      this.predictionLoop();
    }
  }
  
  getDirection() {
    return this.lastDirection || "None";
  }
  
  getConfidence() {
    return this.instantConfidence || 0;
  }
  
  predictionLoop() {
    if (!this.detectionActive || !this.opencvLoaded) return;
  
    this.detectionInterval = setInterval(() => {
      this.processVideoFrame().catch(error => {
        console.error('Detection error:', error);
        this.errorCount++;
        
        if (this.errorCount >= this.maxErrorsBeforeReset) {
          this.resetDetection();
        }
      });
    }, 200);
  }
  
   

  clearCanvas() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  get EXTENSION_ID() {
    return "arrowShapeDetection";
  } 
  
  getInfo() {
    return [
      {
        id: "arrowDetectionBlocks",
        name: formatMessage({
          id: "arrowDetectionBlocks.categoryName",
          default: "Arrow Detection",
          description: "Arrow Detection",
        }),
        blockIconURI: blockIconURI,
        color1: "#7BB32D",
        blocks: [
          {
            opcode: "openCamera",
            text: formatMessage({
              id: "arrowDetectionBlocks.openCamera",
              default: "open camera [STATE]",
            }),
            blockType: BlockType.COMMAND,
            arguments: {
              STATE: {
                type: ArgumentType.STRING,
                menu: "stateMenu",
                defaultValue: "on"
              }
            }
          },
          {
            opcode: "startDetection",
            text: formatMessage({
              id: "arrowDetectionBlocks.startDetection",
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
            opcode: "getDirection",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "arrowDetectionBlocks.getDirection",
              default: "current arrow direction",
              description: "Returns the current detected arrow direction"
            })
          },
          {
            opcode: "getConfidence",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "arrowDetectionBlocks.getConfidence",
              default: "detection confidence",
              description: "Returns the confidence percentage of the current detection"
            })
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
          stateMenu: {
            acceptReporters: true,
            items: [
              { text: "on", value: "on" },
              { text: "off", value: "off" }
            ]
          }
        },
      },
    ];
  }
}

module.exports = Scratch3ArrowAndShapeDetection;