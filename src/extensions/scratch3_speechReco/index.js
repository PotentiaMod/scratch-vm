const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");

const iconURI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAP1BMVEVHcEwhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvMhlvM3RuvOAAAAFHRSTlMA8PpBBMm/CjEgdROb5U6nibNg2fsmXOgAAAHySURBVEjHlZZZluMgDEXFLCYz7n+thSvpSgfJybE+jS96gCaA3Rz2ZIdYlk3q6OCbYbBZzpdlG1B/BFKexHJSl5CvYrImkmcBfYx5aaMzjtyVi4fJGncilvnFyiYutvnVmr/n49fPf9p0JXdkSjHkcPV1B31fbGo9ulO7Wtn/3mO/3RQBe0dwab9rfMraF2x0Nddea4x23+whTQniPkyhQIcAh9zOqFgn2Z9KR/I6+bhrLqcb3CPRuIffCuHQuzJxniZMivzKGUejyNoInL1CppQMYiLV9UImh6wLCPIeMgOkeRMpYO4iA/JdJIO4i0jYT5/FOyKIjB3J2O0bEnCPmV3YiGgjPj9K5axyZheWSUwajOYf74332x9iv+QV+Sk801SsLCgk/gcU8lLKIBw2Z9MBjSJv3UggnzFkVw77VfPRBpKAk/lkPARTlfeqmqBJKq8to2FKHFa7rCL4wgQ/VPr8h4bofVyVnUZgPROZhoxoB7gIqjFLZ73QXHEt0Lm8WKodV5QeSGARcfCl7wNSnt0WaftqgAhUcca/Mi45AYqEvQyvZkEl5MI05+TuNbFV3t/amLd3icW0u8TSluTHJs5NC67nayIHfvzBcjEtyIJXQ4w+mEA8g/TThKVXXon3bl7V15EsqtDGo1yMVg8yusAPBoCH9gCzhVkAAAAASUVORK5CYII=";

class Scratch3SpeechRecognitionBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    this._phraseList = this._scanBlocksForPhraseList();
    this._currentUtterance = "";
    this._speechPromises = [];

    // Initialize the speech recognition object
    var SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    console.log(SpeechRecognition);

    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.error("SpeechRecognition API not supported in this environment.");
    }

    // Set up the recognition event handlers
    this.recognition.onstart = this._onRecognitionStart.bind(this);
    console.log(`on start ${this.recognition.onstart}`);
    this.recognition.onspeechend = this._onRecognitionEnd.bind(this);
    console.log(`on speech end ${this.recognition.onspeechend}`);
    this.recognition.onresult = this._onRecognitionResult.bind(this);
    console.log(`on result ${this.recognition.onresult}`);
  }

  get EXTENSION_ID() {
    return "SpeechRecognition";
  }

  _scanBlocksForPhraseList() {
    const words = [];
    this.runtime.targets.forEach((target) => {
      target.blocks.getBlock((block) => {
        if (
          block.opcode === "speech2text_whenIHearHat" &&
          block.fields &&
          block.fields.PHRASE &&
          block.fields.PHRASE.value
        ) {
          words.push(block.fields.PHRASE.value);
        }
      });
    });
    return words;
  }

  _onRecognitionStart() {
    console.log("We are listening. Try speaking into the microphone.");
  }

  _onRecognitionEnd() {
    this.recognition.stop();
  }

  _onRecognitionResult(event) {
    var transcript = event.results[0][0].transcript;
    console.log(`Raw transcript: ${transcript}`);
    var confidence = event.results[0][0].confidence;
  
    // Clean the transcript to remove punctuation
    var cleanTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase();
    console.log(`Cleaned transcript: ${cleanTranscript}`);
  
    this._currentUtterance = cleanTranscript;
  
    // Match against cleaned phrases too
    this._phraseList.forEach((phrase) => {
      const cleanPhrase = phrase.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase();
      if (cleanTranscript.includes(cleanPhrase)) {
        this.runtime.startHats("speech2text_whenIHearHat", {
          PHRASE: phrase,
        });
      }
    });
  
    while (this._speechPromises.length > 0) {
      const resolve = this._speechPromises.shift();
      resolve(this._currentUtterance);
    }
  }
  

  getInfo() {
    return [
      {
        id: "SpeechRecognition",
        name: formatMessage({
          id: "speech2text.name",
          default: "speech recognition",
          description:
            "Listen to the microphone and wait for the user to finish speaking",
        }),
        blockIconURI: iconURI,
        color1: "#d4b77d",
        blocks: [
          {
            opcode: "listenAndWait",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "speech2text.listenAndWait",
              default: "listen and wait",
              description:
                "Listen to the microphone and wait for the user to finish speaking",
            }),
          },
          {
            opcode: "whenIHear",
            blockType: BlockType.HAT,
            text: formatMessage({
              id: "speech2text.whenIHearHat",
              default: "when I hear [PHRASE]",
              description: "Hat block to trigger when a phrase is heard",
            }),
            arguments: {
              PHRASE: {
                type: ArgumentType.STRING,
                defaultValue: formatMessage({
                  id: "speech2text.whenIHearHat_default",
                  default: "hello",
                  description: "Default value for the when I hear hat block",
                }),
              },
            },
          },
          {
            opcode: "mostRecentSpeech",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "speech2text.mostRecentSpeech",
              default: "most recent speech",
              description:
                "Reporter block to return the most recent transcription",
            }),
          },
        ],
        menus: {
          // Any menus required for your extension blocks can be defined here
        },
      },
    ];
  }

  listenAndWait(args, util) {
    return new Promise((resolve, reject) => {
      this._speechPromises.push(resolve);

      // Log the current length of _speechPromises
      console.log("Promises in queue:", this._speechPromises.length);

      try {
        // Start the speech recognition
        this.recognition.start();
        console.log("Speech recognition started");
      } catch (error) {
        // Handle errors that occur during the start of recognition
        console.error("Error starting recognition:", error);
        reject(error);
      }

      // Add an event listener for errors during speech recognition
      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        reject(new Error(`Speech recognition failed: ${event.error}`));
      };

      // Optionally handle recognition end without resolving the promise
      this.recognition.onend = () => {
        console.log("Speech recognition ended");
      };
    });
  }

  mostRecentSpeech(args, util) {
    return this._currentUtterance;
  }

  whenIHear(args, util) {
    const phrase = args.PHRASE;
    if (
      phrase &&
      this._currentUtterance &&
      this._currentUtterance.includes(phrase)
    ) {
      return true;
    }
    return false;
  }
}

module.exports = Scratch3SpeechRecognitionBlocks;
