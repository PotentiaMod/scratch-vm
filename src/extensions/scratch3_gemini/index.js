const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const TargetType = require("../../extension-support/target-type");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const formatMessage = require("format-message");
const getMonitorIdForBlockWithArgs = require("../../util/get-monitor-id");

const languages = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Chinese (Simplified)", code: "zh-CN" },
  { name: "Japanese", code: "ja" },
  { name: "Korean", code: "ko" },
  { name: "Russian", code: "ru" },
  { name: "Portuguese", code: "pt" },
  { name: "Hindi", code: "hi" },
];

const partsOfSpeech = [
  { name: "Noun", value: "noun" },
  { name: "Pronoun", value: "pronoun" },
  { name: "Verb", value: "verb" },
  { name: "Adverb", value: "adverb" },
  { name: "Adjective", value: "adjective" },
  { name: "Preposition", value: "preposition" },
  { name: "Conjunction", value: "conjunction" },
  { name: "Interjection", value: "interjection" },
];

// Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
const blockIconURI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAABFFBMVEVHcEwcoOOHbMOOacKKa8Nsess7kdovl953dMiCb8U4k9s5kttuectmfM02k9tqeswdoONGjNYtmd4tmN4knOE9kNkineE0ldw4k9tbgtFueMtag9EknOE4k9s1lNxsecskneFkf85vecpwd8p0dclRhtNreswnm+BLidVdgc87kdp9ccdYgtFne80umN5ifs4coONqe8whnuJkfc2PacE/j9mOacIlneCOacJoe82OacKNasKKa8NQh9NMidQ+kNlif85lfc1agtBegM9ThtJFjNc2lNtBjthpe805kto7kdlJitZNiNRVhNFLidV8csdPh9Ntecsvl91xd8pHi9Z2dcgrmd4nm+CFbcQineIzldxXg9Gl+YXoAAAAP3RSTlMA/hb9zy8WHtNkPEwg0Cpb2uGC2puhbu0JEEIFGN5xFlMDAeOXc/UxXeDO+dC8bDuvbMyfqrp6R4uHRE8tktBFUF/DAAABz0lEQVRIx5WW11rCQBBGVzqE0Iv0Kh0UFRFbiBKBEIpI9/3fwxQiJCaws/fnmzOz+0+CkM5JpRD0mM1gJOqGEplmB4pk7+oxIJIiy05oKwUa2kyH7t5lgV50F2jmHnQ/3q8gRKRO80jNAkCaAwEZA8o4SYH46XlduEQsLxXpzYKXuL0X9gjHYapFcwPJa8aNvATWq7d9yV7ciPE6cIhvGeEmI6Z/nonKhOi1YPpU4rRbzJ5b/hWZTQSEHYaTJ+bmzFeXS6UXxQ4/dwG9+zHYbdPp8shrInjxxG7uD8U1AdNmekBEL4YRi8xX6/VtyKoMuuHp0WTc8IjCa7H34pHt9sITSFulbBtenh/uTUYjT2w0vFjBS0T447nxpYvxY+S/V18qokLEdSKISUW0vdY84Qm04xl1+1WF10ia174Vdfv7KNptevPyhCy6V1nQ8loFTkQt486pvHbzebhxOmjXpHpe/vbZx08qvfw4gakde+EQvFv5MK8wgRf+0lj2GjZwl9Kr7IW9lJD1TZpXwoW/LktSHpOQNd4SvCqQNY5KDLAIQpYKxSassA+fjxoGgd9wR5glYAiKVKBeCAVb0F8FlPSBf3uINBhxFcGIRffqfwEWLqTTfBD7qQAAAABJRU5ErkJggg==";

class Scratch3_gemini {
  constructor(runtime) {
    this.runtime = runtime;
    this.apiKey = "AIzaSyDcM6vALY39_hQzET-A6mLKHOVyc_EY_FM";
    // this.apiKey = process.env.REACT_APP_API_KEY;
    console.log(process.env.REACT_APP_API_KEY);
    this.client = new GoogleGenerativeAI(this.apiKey);
    this.modelId = "gemini-2.5-flash";
    this._questionQueue = [];
    this.generateContent = null;
    // Context controls (defaults only; no extra blocks)
    this.region = "India"; // default region context
    this.audience = "school"; // "school" | "college"

    // Log available models for debugging
    this._logAvailableModels();
  }

  // Build a short system-style context string for all prompts
  _buildContext() {
    const audienceLabel = this.audience === "college" ? "college" : "school";
    return `Respond for learners in ${this.region}. Keep it appropriate for ${audienceLabel} students. Prefer Indian context, metric units, INR where relevant.`;
  }

  async _logAvailableModels() {
    try {
      const model = this.client.getGenerativeModel({ model: this.modelId });
      console.log(`Using model: ${this.modelId}`);
      console.log("Model initialized successfully");
    } catch (error) {
      console.error("Error initializing model:", error);
      console.log("Try these alternative model names:");
      console.log("- gemini-1.5-pro-latest");
      console.log("- gemini-1.5-flash-8b-latest");
      console.log("- gemini-2.0-flash-exp");
    }
  }

  get EXTENSION_ID() {
    return "gemini";
  }

  getInfo() {
    return [
      {
        id: "gemini",
        name: formatMessage({
          id: "ai.AiTranslate.name",
          default: "Gemini",
          description: "Name of Extension",
        }),
        blockIconURI: blockIconURI,
        color1: "#AD6EE8",
        blocks: [
          {
            opcode: "AiTranslate",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "ai.AiTranslate",
              default: "Translate [text] into [Hindi]",
              description: "Get the AI response for a given prompt",
            }),
            arguments: {
              text: {
                type: ArgumentType.STRING,
                defaultValue: "Mango",
              },
              Hindi: {
                type: ArgumentType.STRING,
                menu: "languages",
                defaultValue: "Hindi",
              },
            },
          },
          {
            opcode: "AskAI",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "ai.AskAI",
              default: "ask AI [text]",
              description: "Get the AI response for a given prompt",
            }),
            arguments: {
              text: {
                type: ArgumentType.STRING,
                defaultValue: "Hello AI",
              },
            },
          },
          {
            opcode: "GetAI",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "ai.GetAI",
              default: "get AI generated text",
              description: "Get the AI response for a given prompt",
            }),
          },
          {
            opcode: "SummarizeText",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "ai.summarizeText",
              default: "summarize [text]",
              description: "Summarize input text concisely",
            }),
            arguments: {
              text: {
                type: ArgumentType.STRING,
                defaultValue: "Photosynthesis is the process...",
              },
            },
          },
          {
            opcode: "ExplainConcept",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "ai.explainConcept",
              default: "explain [concept]",
              description: "Explain concept simply for students",
            }),
            arguments: {
              concept: {
                type: ArgumentType.STRING,
                defaultValue: "Newton's first law",
              },
            },
          },
        ],
        menus: {
          languages: {
            acceptReporters: true,
            items: languages.map((lang) => lang.name),
            sort: "alphabetical",
          },
          partsOfSpeech: {
            acceptReporters: true,
            items: partsOfSpeech.map((pos) => pos.name),
          },
        },
      },
    ];
  }

  async AiTranslate(args) {
    const text = args.text;
    const targetLanguage = args.Hindi; // Assuming 'Hindi' is used to specify the target language
    try {
      const model = this.client.getGenerativeModel({ model: this.modelId });
      const prompt = `You are a translator. ${this._buildContext()} Translate the text into ${targetLanguage}. Output ONLY the translated text — no quotes, no explanations, no bullets. Text: ${text}`;
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 120,
        },
      });
      // Return the translated text
      return result.response.text();
    } catch (error) {
      return "Error fetching translation response";
    }
  }

  async AskAI(args, util) {
    const text = args.text;
    try {
      console.log("AskAI invoked with:", text);
      const model = this.client.getGenerativeModel({ model: this.modelId });
      const prompt = `Answer the user's question: ${text}. ${this._buildContext()} Keep it factual and concise (1-3 short sentences).`;
      // Use simple string API for broader compatibility
      let result = await model.generateContent(prompt);
      let answer =
        result && result.response && typeof result.response.text === "function"
          ? result.response.text()
          : "";
      if (!answer || !answer.trim()) {
        // Try extracting manually from candidates if helper returned empty
        try {
          const candidates =
            result && result.response && result.response.candidates
              ? result.response.candidates
              : [];
          if (
            candidates.length &&
            candidates[0].content &&
            candidates[0].content.parts &&
            candidates[0].content.parts.length
          ) {
            const part =
              candidates[0].content.parts.find((p) => p.text) ||
              candidates[0].content.parts[0];
            answer = part && part.text ? part.text : "";
          }
        } catch (_) {}
      }
      if (!answer || !answer.trim()) {
        console.log(
          "AskAI: empty first answer, retrying with simplified prompt..."
        );
        const retryPrompt = `Answer briefly: ${text}`;
        result = await model.generateContent(retryPrompt);
        answer =
          result.response && typeof result.response.text === "function"
            ? result.response.text()
            : "";
      }
      console.log(
        "AskAI raw response:",
        JSON.stringify(
          result && result.response ? result.response : {},
          null,
          2
        )
      );
      console.log("AskAI answer:", answer);
      this.generateContent = answer;

      // Display on sprite/stage for command-style feedback
      const target = util && util.target ? util.target : null;
      if (target && target.visible && !target.isStage) {
        this.runtime.emit("SAY", target, "say", answer);
      } else if (target) {
        this.runtime.emit("QUESTION", answer);
      } else {
        console.log(
          "AskAI: no target available to display; only returning text."
        );
      }
      return answer;
    } catch (error) {
      console.error("AskAI error:", error);
      return "Error fetching response";
    }
  }
  GetAI() {
    return this.generateContent;
  }

  async SummarizeText(args) {
    const text = args.text;
    try {
      const model = this.client.getGenerativeModel({ model: this.modelId });
      const prompt = `Summarize the following for ${this.audience} students in India using 2-3 short sentences: ${text}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      return "Error summarizing";
    }
  }

  async ExplainConcept(args) {
    const concept = args.concept;
    try {
      const model = this.client.getGenerativeModel({ model: this.modelId });
      const prompt = `Explain ${concept} for ${this.audience} students in ${this.region}. Use simple words and a short example.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      return "Error explaining";
    }
  }

  async GenerateMCQs(args) {
    const topic = args.topic;
    try {
      const model = this.client.getGenerativeModel({ model: this.modelId });
      const prompt = `Create 3 multiple-choice questions on ${topic} for ${this.audience} students in ${this.region}. Format each as: Question | A) | B) | C) | D) | Answer: <letter>. Return only three lines.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      return "Error creating MCQs";
    }
  }

  async extractPartOfSpeech(args) {
    const text = args.Text;
    const partOfSpeech = args.PartOfSpeech;
    try {
      const model = this.client.getGenerativeModel({ model: this.modelId });

      const prompt = `Extract all ${partOfSpeech} from: "${text}". ${this._buildContext()} Return ONLY a comma-separated list.`;
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 120,
        },
      });

      // Return the extracted part of speech
      return result.response.text();
    } catch (error) {
      return `Error fetching ${partOfSpeech} from the text`;
    }
  }

  getPrimitives() {
    return {
      sensing_askandwait: this.askAndWait,
    };
  }

  getMonitored() {
    return {
      sensing_answer: {
        getId: () => "ai.askAndWaitBlock",
      },
    };
  }

  async askAndWait(args, util) {
    const question = String(args.question);
    const target = util.target;

    return new Promise((resolve) => {
      this._enqueueAsk(question, resolve, target);

      this._askNextQuestion();
    });
  }

  _enqueueAsk(question, resolve, target) {
    console.log(`Enqueuing question: ${question}`);
    this._questionQueue.push({
      question,
      resolve,
      target,
      visible: target.visible,
      isStage: target.isStage,
    });
  }

  async _askNextQuestion() {
    if (this._questionQueue.length === 0) return;

    const current = this._questionQueue.shift();
    const { question, resolve, target, visible, isStage } = current;
    console.log(`Processing question: ${question}`);

    setTimeout(async () => {
      try {
        const prompt = `Answer the question briefly: "${question}". ${this._buildContext()} Limit to 1-2 short sentences.`;
        const model = this.client.getGenerativeModel({ model: this.modelId });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.9,
            maxOutputTokens: 100,
          },
        });
        const answer = result.response.text();

        if (visible && !isStage) {
          this.runtime.emit("SAY", target, "say", answer);
        } else {
          this.runtime.emit("QUESTION", answer);
        }
        console.log(`Answer received: ${answer}`);
        resolve(answer);
      } catch (error) {
        console.error("Error fetching AI answer:", error);
        resolve("Error fetching answer");
      }
    }, 100);
  }

  // No extra blocks exposed; defaults above will be used.
}

module.exports = Scratch3_gemini;
