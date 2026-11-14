const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const Video = require("../../io/video");
const blazeface = require("@tensorflow-models/blazeface");
const StageLayering = require("../../engine/stage-layering");
const DefaultStageWidth = 480;
const DefaultStageHeight = 360;

const MakerAttributes = {
  color4f: [1.0, 0.0, 0.0, 1.0], // Red color for face boxes
  diameter: 3,
};

const blockIconURI =
  "data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaGVpZ2h0PSI0My4zNDltbSIgaW1hZ2UtcmVuZGVyaW5nPSJvcHRpbWl6ZVF1YWxpdHkiIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB2aWV3Qm94PSIwIDAgNDMzNSA0MzM1IiB3aWR0aD0iNDMuMzQ5bW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IkxheWVyX3gwMDIwXzEiPjxwYXRoIGQ9Im0zNzYzIDEwMDhoLTMwN2MtMjggMC01MS0yMy01MS01MXYtNTc0aC02MzFjLTI4IDAtNTEtMjMtNTEtNTF2LTI4MWMwLTI4IDIzLTUxIDUxLTUxaDk4OWMyOCAwIDUxIDIzIDUxIDUxdjkwNmMwIDI4LTIzIDUxLTUxIDUxem0tMTU5NiAxNDAwYy04NSAwLTE2Ny0xMy0yNDUtMzd2NDA2aDQ5MXYtNDA2Yy03OCAyNC0xNjAgMzctMjQ2IDM3em0tMzQ3LTc1Yy0yOTItMTMzLTQ5Ni00MjctNDk2LTc2OHYtNDUxYzAtNDY1IDM3OS04NDMgODQzLTg0MyA0NjUgMCA4NDQgMzc4IDg0NCA4NDN2NDUxYzAgMzQxLTIwNCA2MzUtNDk2IDc2OHY0NDRoNDk3YzI4MiAwIDUxMSAyMzAgNTExIDUxMXY5OTZjMCAyOC0yMyA1MS01MSA1MWgtMjYwOWMtMjggMC01MS0yMy01MS01MXYtOTk2YzAtMjgyIDIyOS01MTEgNTExLTUxMWg0OTd6bTM0Ny0xOTYxYy00MDggMC03NDEgMzMyLTc0MSA3NDF2NDUxYzAgNDA5IDMzMyA3NDEgNzQxIDc0MSA0MDkgMCA3NDItMzMyIDc0Mi03NDF2LTQ1MWMwLTQwOS0zMzMtNzQxLTc0Mi03NDF6bS0xMjUzIDM4NjFoMjUwN3YtOTQ1YzAtMjI2LTE4NC00MDktNDA5LTQwOWgtMTY4OWMtMjI2IDAtNDA5IDE4My00MDkgNDA5em0yODQ5LTE1NTVoLTk4OWMtMjggMC01MS0yMy01MS01MXYtMjgxYzAtMjggMjMtNTEgNTEtNTFoNjMxdi01NzRjMC0yOCAyMy01MSA1MS01MWgzMDdjMjggMCA1MSAyMyA1MSA1MXY5MDZjMCAyOC0yMyA1MS01MSA1MXptLTkzOS0xMDJoODg5di04MDRoLTIwNnY1NzRjMCAyOC0yMyA1MS01MSA1MWgtNjMyem0tMTI2MyAxMDJoLTk4OWMtMjggMC01MS0yMy01MS01MXYtOTA2YzAtMjggMjMtNTEgNTEtNTFoMzA3YzI4IDAgNTEgMjMgNTEgNTF2NTc0aDYzMWMyOCAwIDUxIDIzIDUxIDUxdjI4MWMwIDI4LTIzIDUxLTUxIDUxem0tOTM5LTEwMmg4ODh2LTE3OWgtNjMxYy0yOCAwLTUxLTIzLTUxLTUxdi01NzRoLTIwNnptMjU3LTE1NjhoLTMwN2MtMjggMC01MS0yMy01MS01MXYtOTA2YzAtMjggMjMtNTEgNTEtNTFoOTg5YzI4IDAgNTEgMjMgNTEgNTF2MjgxYzAgMjgtMjMgNTEtNTEgNTFoLTYzMXY1NzRjMCAyOC0yMyA1MS01MSA1MXptLTI1Ny0xMDJoMjA2di01NzRjMC0yOCAyMy01MSA1MS01MWg2MzF2LTE3OWgtODg4em0yODg1IDBoMjA2di04MDRoLTg4OXYxNzloNjMyYzI4IDAgNTEgMjMgNTEgNTF6Ii8+PHBhdGggZD0ibTI5MDkgMTExM2MwLTQwOS0zMzMtNzQxLTc0Mi03NDEtNDA4IDAtNzQxIDMzMi03NDEgNzQxdjQ1MWMwIDQwOSAzMzMgNzQxIDc0MSA3NDEgNDA5IDAgNzQyLTMzMiA3NDItNzQxeiIgZmlsbD0iI2ZmYzA2ZCIvPjxwYXRoIGQ9Im0yNDEzIDIzNzFjLTc4IDI0LTE2MCAzNy0yNDYgMzctODUgMC0xNjctMTMtMjQ1LTM3djQwNmg0OTF6IiBmaWxsPSIjZTZhZDYyIi8+PHBhdGggZD0ibTMwMTIgMjg3OWgtMTY4OWMtMjI2IDAtNDA5IDE4My00MDkgNDA5djk0NWgyNTA3di05NDVjMC0yMjYtMTg0LTQwOS00MDktNDA5eiIgZmlsbD0iIzFhYTFmZiIvPjxnIGZpbGw9IiMxNzkxZTYiPjxwYXRoIGQ9Im0yODI0IDI1NzZoODg5di04MDRoLTIwNnY1NzRjMCAyOC0yMyA1MS01MSA1MWgtNjMyeiIvPjxwYXRoIGQ9Im0xNTEwIDI1NzZ2LTE3OWgtNjMxYy0yOCAwLTUxLTIzLTUxLTUxdi01NzRoLTIwNnY4MDR6Ii8+PHBhdGggZD0ibTg3OSAyODFoNjMxdi0xNzloLTg4OHY4MDRoMjA2di01NzRjMC0yOCAyMy01MSA1MS01MXoiLz48cGF0aCBkPSJtMjgyNCAxMDJ2MTc5aDYzMmMyOCAwIDUxIDIzIDUxIDUxdjU3NGgyMDZ2LTgwNHoiLz48L2c+PC9nPjwvc3ZnPg==";

const Message = {
  FaceDetection_Name: {
    hi: "चेहरे का पहचान", // Start face detection
    en: "Face Detection",
  },
  startFaceDetection: {
    hi: "चेहरा पहचानना शुरू करें", // Start face detection
    en: "start face detection",
  },
  stopFaceDetection: {
    hi: "चेहरा पहचानना बंद करें", // Stop face detection
    en: "stop face detection",
  },
  getX: {
    hi: "व्यक्ति संख्या [PERSON_NUMBER] , मुख्य बिंदु संख्या [X_KEYPOINT] का x",
    en: "x of [PERSON_NUMBER] point [X_KEYPOINT]",
  },
  getY: {
    hi: "व्यक्ति संख्या [PERSON_NUMBER] , मुख्य बिंदु संख्या [Y_KEYPOINT] का y",
    en: "y of [PERSON_NUMBER] point [Y_KEYPOINT]",
  },
  peopleCount: {
    hi: "लोगों की संख्या",
    en: "people count",
  },
  videoToggle: {
    hi: "वीडियो को [VIDEO_STATE] करें",
    en: "turn video [VIDEO_STATE]",
  },
  setRatio: {
    hi: "अनुपात को [RATIO] करें",
    en: "set ratio to [RATIO]",
  },
  setInterval: {
    hi: "प्रत्येक [INTERVAL] सेकंड में लेबल करें",
    en: "Label once every [INTERVAL] seconds",
  },
  clearMark: {
    hi: "चेहरे पर सेट बॉक्स साफ़ करें",
    en: "clear face bounding boxes",
  },
  setVideoTransparency: {
    hi: "वीडियो पारदर्शिता को [TRANSPARENCY] पर सेट करें",
    en: "set video transparency to [TRANSPARENCY]",
  },
  setSizeToFaceSize: {
    hi: "व्यक्ति संख्या [PERSON_NUMBER] के चेहरे के आकार को आकार सेट करें",
    en: "set size to [PERSON_NUMBER] face size",
  },
  pointInDirectionOfFaceTilt: {
    hi: "व्यक्ति संख्या [PERSON_NUMBER] के चेहरे की झुकाव की दिशा में इशारा करें",
    en: "point in direction of [PERSON_NUMBER] face tilt",
  },
  on: {
    hi: "चालू",
    en: "on",
  },
  off: {
    hi: "बंद",
    en: "off",
  },
  video_on_flipped: {
    hi: "फ्लिप किया हुआ",
    en: "on flipped",
  },
  please_wait: {
    hi: "सेटअप में समय लगता है। ब्राउज़र अटक जाएगा, कृपया प्रतीक्षा करें।",
    en: "Setup takes a while. The browser will get stuck, but please wait.",
  },
};
const AvailableLocales = ["en", "hi"];


const parts = {
  Right_Eye: 0,
  Left_Eye: 1,
  Nose_Tip: 2,
  Mouth: 3,
  Right_Ear: 4,
  Left_Ear: 5
};


class Scratch3Facemesh2ScratchBlocks {
  get PERSON_NUMBER_MENU() {
    let person_number_menu = [];
    for (let i = 1; i <= 10; i++) {
      person_number_menu.push({ text: String(i), value: String(i) });
    }
    return person_number_menu;
  }

  get KEYPOINT_MENU() {
  return [
    { text: "Nose Tip", value: String(parts.Nose_Tip) },
    { text: "Left Eye", value: String(parts.Left_Eye) },
    { text: "Right Eye", value: String(parts.Right_Eye) },
    { text: "Mouth", value: String(parts.Mouth) },
    { text: "Left Ear", value: String(parts.Left_Ear) },
    { text: "Right Ear", value: String(parts.Right_Ear) }
  ];
}

  get VIDEO_MENU() {
    return [
      {
        text: Message.off[this._locale],
        value: "off",
      },
      {
        text: Message.on[this._locale],
        value: "on",
      },
      {
        text: Message.video_on_flipped[this._locale],
        value: "on-flipped",
      },
    ];
  }

  get EXTENSION_ID() {
    return "facemesh2scratch";
  }

  get INTERVAL_MENU() {
    return [
      {
        text: "0.1",
        value: "0.1",
      },
      {
        text: "0.2",
        value: "0.2",
      },
      {
        text: "0.5",
        value: "0.5",
      },
      {
        text: "1.0",
        value: "1.0",
      },
    ];
  }

  get RATIO_MENU() {
    return [
      {
        text: "0.5",
        value: "0.5",
      },
      {
        text: "0.75",
        value: "0.75",
      },
      {
        text: "1",
        value: "1",
      },
      {
        text: "1.5",
        value: "1.5",
      },
      {
        text: "2.0",
        value: "2.0",
      },
    ];
  }
  

  get Landmark_value() {
  return [
    { text: "Nose Tip", value: parts.Nose_Tip },
    { text: "Left Eye", value: parts.Left_Eye },
    { text: "Right Eye", value: parts.Right_Eye },
    { text: "Mouth", value: parts.Mouth },
    { text: "Left Ear", value: parts.Left_Ear },
    { text: "Right Ear", value: parts.Right_Ear }
  ];
}

  constructor(runtime) {
    this.runtime = runtime;

    // State variables
    this.faces = [];
    this.ratio = 0.75;
    this.face_length = 0;
    // this.facemesh = null;
    this.detector = null;
    this._detectionActive = false;
    this.detectionInterval = 100; // Default 100ms
    this.globalVideoTransparency = 0;
    this.videoEnabled = false;

    // Initialize pen layer for drawing bounding boxes (like object detection)
    this._penSkinId = this.runtime.renderer.createPenSkin();
    this._penDrawableId = this.runtime.renderer.createDrawable(
      StageLayering.SPRITE_LAYER
    );
    this.runtime.renderer.updateDrawableProperties(this._penDrawableId, {
      skinId: this._penSkinId,
    });

    // Load model immediately when extension is added
    this.showAlert("Loading Face Detection Model. Please wait...");

  
 
this.runtime.ioDevices.video.enableVideo().then(async () => {
    try {
        // this.detector = await facemesh.load({ maxFaces: 10 });
        this.detector = await blazeface.load();
        console.log("Face Detection Model loaded successfully");
        this.closeAlert();
    } catch(error) {
        console.error("Face model load failed:", error);
        this.closeAlert();
    }
});
  }

  

  
  async _loop() {
    console.log("LOOP RUNNING", {
  active: this._detectionActive,
  detector: !!this.detector,
  video: !!this.runtime.ioDevices.video.provider.video
});

  if (!this._detectionActive) return;

  const video =
    this.runtime.ioDevices.video.provider.video;

  if (this.detector && video) {

    // const predictions = await this.detector.estimateFaces(video, false);
    const predictions =
 await this.detector.estimateFaces(
   video,
   false
 );

    console.log("FACE COUNT:", predictions.length);

if (predictions.length > 0) {
  console.log(
 predictions[0].landmarks.length
);
}

    this.face_length = predictions.length;

    this.faces = predictions.map(face => ({
    // keypoints: face.scaledMesh  
    keypoints: face.landmarks,
    topLeft: face.topLeft,
    bottomRight: face.bottomRight
}));

    this._drawBoundingBoxes();
  }

  setTimeout(() => {
    this._loop();
  }, this.detectionInterval);
}

  // Draw bounding boxes using renderer (like object detection)
  _drawBoundingBoxes() {
    if (!this.faces.length) return;

    // Clear previous drawings
    this.runtime.renderer.penClear(this._penSkinId);

    // Draw bounding box for each face
    this.faces.forEach((face) => {
      const keypoints = face.keypoints;

     

      const minX = face.topLeft[0];
const minY = face.topLeft[1];

const maxX = face.bottomRight[0];
const maxY = face.bottomRight[1];

      // Apply ratio scaling and convert to stage coordinates
      // Handle mirroring same way as getX/getY methods
      let topLeftX, topRightX, bottomLeftX, bottomRightX;

      if (this.runtime.ioDevices.video.mirror) {
        // Mirrored mode (flipped)
        topLeftX = 240 - maxX * this.ratio;
        topRightX = 240 - minX * this.ratio;
        bottomLeftX = 240 - maxX * this.ratio;
        bottomRightX = 240 - minX * this.ratio;
      } else {
        // Normal mode
        topLeftX = -1 * (240 - minX * this.ratio);
        topRightX = -1 * (240 - maxX * this.ratio);
        bottomLeftX = -1 * (240 - minX * this.ratio);
        bottomRightX = -1 * (240 - maxX * this.ratio);
      }

      // Y coordinates (same for both mirror modes)
      const topLeftY = 180 - minY * this.ratio;
      const topRightY = 180 - minY * this.ratio;
      const bottomLeftY = 180 - maxY * this.ratio;
      const bottomRightY = 180 - maxY * this.ratio;

      // Draw rectangle using pen lines
      this.runtime.renderer.penLine(
        this._penSkinId,
        MakerAttributes,
        topLeftX,
        topLeftY,
        topRightX,
        topRightY
      );
      this.runtime.renderer.penLine(
        this._penSkinId,
        MakerAttributes,
        topRightX,
        topRightY,
        bottomRightX,
        bottomRightY
      );
      this.runtime.renderer.penLine(
        this._penSkinId,
        MakerAttributes,
        bottomRightX,
        bottomRightY,
        bottomLeftX,
        bottomLeftY
      );
      this.runtime.renderer.penLine(
        this._penSkinId,
        MakerAttributes,
        bottomLeftX,
        bottomLeftY,
        topLeftX,
        topLeftY
      );
    });
  }

  getInfo() {
    this._locale = this.setLocale();

    return [
      {
        id: "facemesh2scratch",
        name: Message.FaceDetection_Name[this._locale],
        blockIconURI: blockIconURI,
        blocks: [
          {
            opcode: "startFaceDetection",
            blockType: BlockType.COMMAND,
            text: Message.startFaceDetection[this._locale],
          },
          {
            opcode: "stopFaceDetection",
            blockType: BlockType.COMMAND,
            text: Message.stopFaceDetection[this._locale],
          },
          {
            opcode: "getX",
            blockType: BlockType.REPORTER,
            text: Message.getX[this._locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumberMenu",
                defaultValue: "1",
              },
              X_KEYPOINT: {
                type: ArgumentType.STRING,
                menu: "keypointMenu",
                defaultValue: parts.Nose_Tip,
              },
            },
          },
          {
            opcode: "getY",
            blockType: BlockType.REPORTER,
            text: Message.getY[this._locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumberMenu",
                defaultValue: "1",
              },
              Y_KEYPOINT: {
                type: ArgumentType.STRING,
                menu: "keypointMenu",
                defaultValue: parts.Nose_Tip,
              },
            },
          },
          {
            opcode: "getPeopleCount",
            blockType: BlockType.REPORTER,
            text: Message.peopleCount[this._locale],
          },
          {
            opcode: "videoToggle",
            blockType: BlockType.COMMAND,
            text: Message.videoToggle[this._locale],
            arguments: {
              VIDEO_STATE: {
                type: ArgumentType.STRING,
                menu: "videoMenu",
                defaultValue: "on",
              },
            },
          },
          {
            opcode: "setRatio",
            blockType: BlockType.COMMAND,
            text: Message.setRatio[this._locale],
            arguments: {
              RATIO: {
                type: ArgumentType.STRING,
                menu: "ratioMenu",
                defaultValue: "0.75",
              },
            },
          },
          {
            opcode: "setInterval",
            blockType: BlockType.COMMAND,
            text: Message.setInterval[this._locale],
            arguments: {
              INTERVAL: {
                type: ArgumentType.STRING,
                menu: "intervalMenu",
                defaultValue: "0.5",
              },
            },
          },
          {
            opcode: "clearMark",
            blockType: BlockType.COMMAND,
            text: Message.clearMark[this._locale],
          },
          {
            opcode: "setVideoTransparency",
            blockType: BlockType.COMMAND,
            text: Message.setVideoTransparency[this._locale],
            arguments: {
              TRANSPARENCY: {
                type: ArgumentType.NUMBER,
                defaultValue: 50,
              },
            },
          },
          {
            opcode: "setSizeToFaceSize",
            blockType: BlockType.COMMAND,
            text: Message.setSizeToFaceSize[this._locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumberMenu",
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "pointInDirectionOfFaceTilt",
            blockType: BlockType.COMMAND,
            text: Message.pointInDirectionOfFaceTilt[this._locale],
            arguments: {
              PERSON_NUMBER: {
                type: ArgumentType.STRING,
                menu: "personNumberMenu",
                defaultValue: "1",
              },
            },
          },
        ],
        menus: {
          personNumberMenu: {
            acceptReporters: true,
            items: this.PERSON_NUMBER_MENU,
          },
          keypointMenu: {
            acceptReporters: true,
            items: this.Landmark_value,
          },
          videoMenu: {
            acceptReporters: true,
            items: this.VIDEO_MENU,
          },
          ratioMenu: {
            acceptReporters: true,
            items: this.RATIO_MENU,
          },
          intervalMenu: {
            acceptReporters: true,
            items: this.INTERVAL_MENU,
          },
        },
      },
    ];
  }

  startFaceDetection() {
    // Enable video if not already enabled
    if (this.runtime.ioDevices.video) {
      this.runtime.ioDevices.video.enableVideo();
      this.runtime.ioDevices.video.setPreviewGhost(
        this.globalVideoTransparency
      );
    }

    // Start detection loop
    this._detectionActive = true;

    // Model is already loaded in constructor, just start the loop
    if (this.detector) {
   this._loop();
} else {
      console.warn("Face detection model not loaded yet. Please wait...");
    }
  }

  stopFaceDetection() {
    // Stop detection loop
    this._detectionActive = false;

    // Clear bounding boxes
    this.clearMark();

    // Clear face data
    this.faces = [];
    this.face_length = 0;

    // Keep the model in memory so it can be restarted quickly
    // No need to destroy the model - just pause detection

    console.log("Face detection stopped");
  }

  getX(args) {
    const personNumber = parseInt(args.PERSON_NUMBER, 10) - 1;
    const keypoint = parseInt(args.X_KEYPOINT, 10);

    if (
      this.faces[personNumber] &&
      this.faces[personNumber].keypoints &&
      this.faces[personNumber].keypoints[keypoint]
    ) {
      const keypointX = this.faces[personNumber].keypoints[keypoint][0];
      console.log("xkeypoints:-", keypointX);
      return this.runtime.ioDevices.video.mirror
        ? 240 - keypointX * this.ratio
        : -1 * (240 - keypointX * this.ratio);
    } else {
      return "no keypoint";
    }
  }

  getY(args) {
    const personNumber = parseInt(args.PERSON_NUMBER, 10) - 1;
    const keypoint = parseInt(args.Y_KEYPOINT, 10);

    if (
      this.faces[personNumber] &&
      this.faces[personNumber].keypoints &&
      this.faces[personNumber].keypoints[keypoint]
    ) {
      const keypointY = this.faces[personNumber].keypoints[keypoint][1];
      return 180 - keypointY * this.ratio;
    } else {
      return "no keypoint";
    }
  }

  getPeopleCount() {
    return this.face_length;
  }

  videoToggle(args) {
    const videoState = Cast.toString(args.VIDEO_STATE);

    if (videoState === "off") {
      this.globalVideoTransparency = 100;
      this.runtime.ioDevices.video.setPreviewGhost(100);
      this.videoEnabled = false;
    } else {
      this.globalVideoTransparency = 0;
      this.runtime.ioDevices.video.setPreviewGhost(0);
      this.runtime.ioDevices.video.mirror = videoState === "on-flipped";
      this.videoEnabled = true;
    }
  }

  setVideoTransparency(args) {
    const transparency = Cast.toNumber(args.TRANSPARENCY);
    this.globalVideoTransparency = transparency;
    this.runtime.ioDevices.video.setPreviewGhost(transparency);
  }

  setRatio(args) {
    this.ratio = Cast.toNumber(args.RATIO);
  }

  setInterval(args) {
    const interval = Cast.toNumber(args.INTERVAL);
    if (interval <= 0) return;

    // Update detection interval for better performance control
    this.detectionInterval = interval * 1000;
  }

  clearMark() {
    // Clear bounding boxes using renderer (like object detection)
    this.runtime.renderer.penClear(this._penSkinId);
  }

  setSizeToFaceSize(args, util) {
    const personNumber = parseInt(args.PERSON_NUMBER, 10) - 1;

    if (
      this.faces[personNumber] &&
      this.faces[personNumber].keypoints &&
      this.faces[personNumber].keypoints.length > 0
    ) {
      const keypoints = this.faces[personNumber].keypoints;

     
      const width =
 (face.bottomRight[0] - face.topLeft[0])
 * this.ratio;

const height =
 (face.bottomRight[1] - face.topLeft[1])
 * this.ratio;

      
      const faceSize = Math.max(width, height);

      // Set the sprite size
      if (util && util.target) {
        util.target.setSize(faceSize);
      }
    }
  }

  pointInDirectionOfFaceTilt(args, util) {
    const personNumber = parseInt(args.PERSON_NUMBER, 10) - 1;

    if (
      this.faces[personNumber] &&
      this.faces[personNumber].keypoints &&
      this.faces[personNumber].keypoints.length > 0
    ) {
      const keypoints = this.faces[personNumber].keypoints;

      // Get left eye (keypoint 159) and right eye (keypoint 386) positions
      const leftEye = keypoints[parts.Left_Eye];
      const rightEye = keypoints[parts.Right_Eye];

      if (leftEye && rightEye) {
        // Calculate angle between eyes
        const deltaX = rightEye[0] - leftEye[0];
        const deltaY = rightEye[1] - leftEye[1];

        // Calculate angle in degrees (Scratch uses 0=up, 90=right, -90=left)
        // Math.atan2 returns radians, convert to degrees
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // Adjust for Scratch's coordinate system (0 degrees = up, clockwise)
        // atan2 gives 0=right, so we need to adjust
        angle = 90 - angle;

        // Set the sprite direction
        if (util && util.target) {
          util.target.setDirection(angle);
        }
      }
    }
  }

  showAlert(message) {
    if (this.popupElement) this.closeAlert(); // Prevent duplicate alerts

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;
    popup.style.cssText = `
    position: fixed;
    top: 100px; /* Position from the top */
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
    color: white; /* Text color */
    padding: 20px; /* Internal padding for spacing */
    height: 200px; /* Fixed height */
    width: 300px; /* Fixed width */
    border-radius: 10px; /* Rounded corners */
    z-index: 10000; /* Ensures it appears above other elements */
    font-size: 16px; /* Slightly larger text */
    text-align: center; /* Centered text */
    display: flex; /* Flexbox for centering content */
    align-items: center; /* Vertically centered content */
    justify-content: center; /* Horizontally centered content */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5); /* Subtle shadow for depth */
  `;
    document.body.appendChild(popup);
    this.popupElement = popup;
  }

  closeAlert() {
    if (this.popupElement) {
      this.popupElement.remove();
      this.popupElement = null;
    }
  }

  setLocale() {
    const locale = formatMessage.setup().locale;
    if (AvailableLocales.indexOf(locale) !== -1) {
      return locale;
    } else if (locale.startsWith("ja")) {
      return "ja";
    } else {
      return "en";
    }
  }
}

module.exports = Scratch3Facemesh2ScratchBlocks;
