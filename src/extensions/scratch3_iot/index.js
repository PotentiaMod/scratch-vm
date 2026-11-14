const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const { initializeApp } = require("@firebase/app");
const { getDatabase, ref, set, get } = require("@firebase/database");
const { getAuth, signInAnonymously } = require("@firebase/auth");
const formatMessage = require("format-message");

// Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
const blockIconURI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADhUlEQVR4nO2ZT4hVVRzHP5WTqOQiNy0UAsGFG8lVuJFU3GQrUchNtCjdxKihhqNpKqXhzHNMxMFm7i3BYEAo/EM66jhzjv9wIFGRFKU/lhsLXEiBf+Yr97zxed+8e59N99w374E/+O7u4vM5v/PO/M4ZeF4NWAqZr5C/FTCXRiyFtCtECrisDbxIo5UCepxAMe/SaKWAP2IC19VBE41S2sdEBQzGBKKt9AGNUgp4swy+mD/VzTgaoRTyfoJA1IXlZd+JF1TgpAp8Tz2VQr5MEbijr3ml9F0bi1VALq3Mpl5KIYcSBYoSLe6bbl5SG1dLAgVOUi+lkJupAiF3tZdXVWBpDP6ZXVC03SxbZbils7yeH3w34xTyqIqA1MU2tXGrQiClC4rgDTtlkYvhvfwEvuGNqvBRtvFQ2yvgE7ugaKtZOkvwRYEt+Ql0saQqfCfSSqTPUgRiXRiC/7YMvpju/AQCNlcV+BypGWk5qtYFXeFlWQ4kwEcd+Ck/gZADqfB7kVYMCUTZmCKwg1My/JAIb13uRb+LfAQCrqYKbIrBp3WhHelIKrhKOcdk//AdNCnkfiJ8xxBw87B8+j/gLdJp5vgX6GR66upvSICPd2En0o//Ed66LPMvELAwEX53yuo/SXQiHR0RvGRozUNgfaLAuirwa5AOjxDeuhzMQ2B/BfxXVeA/GfG2USzX/AuEXBw2uElrU+DXZoKXLA804PGWF13cFfBPmUAhBb4F6VgmeLn0M82fQMjUitVfkwC/HqnHA7x1R+nb/gS6eKdMYHsCfPSX94QneOuywp9AwOrYuCytyh1eMuz2JxASxMblcvjNSL2e4a0TOO5PIOB82bj8BH4L0qkc4K3L737goxtTdFWMj8tRvkDqyw1eMgzqKBOyC+xjcsW4vNUdc/nB25LEDF8v0U/H5dYawVsnsMiHQHNpXC4MtbYW8NalJbtAwB43Lu+qObxkCbML7OJndfBoFOAlw5nsAt/xW83BbUngr+wChnmyXBkFgevqZ0FmAScxQJMMzTLcrQH4PRk26ghjvcCXiZxnkgztsjzMYbsMuoeuXl7zDl4h0sdMWYxH+As6zazcwRMeZRfJ8GsG+NsyfCiN4n86NcB4t2ct/45gxe+7rXiOidRLqY8pKY+1w9OjfqZTryXLWzJcSjwWfV4T8yz1MkaWj2S4IcMvMnzs9ZXheVE/9RhWKOxUDYbwOwAAAABJRU5ErkJggg==";

/**
 * Firebase extension for Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

class Scratch3FirebaseBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    this.app = null;
    this.database = null;
    this.auth = null;
    this.firebaseConfig = null;
    this.isAuthenticated = false;
  }
  get EXTENSION_ID() {
    return "Firebase";
  }
  getInfo() {
    return [
      {
        id: "Firebase",
        name: formatMessage({
          id: "scratch3.firebase.name",
          default: "Firebase",
          description: "Firebase Name",
        }),
        blockIconURI: blockIconURI,
        color1: "#EE8596",
        blocks: [
          {
            opcode: "initializeFirebase",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "scratch3.firebase.initializeFirebase",
              default: "Enter API Key [APIKey] and Database URL [DatabaseURL]",
              description: "Initialize Firebase with user-provided credentials",
            }),
            arguments: {
              APIKey: {
                type: ArgumentType.STRING,
                defaultValue: "YOUR_API_KEY",
              },
              DatabaseURL: {
                type: ArgumentType.STRING,
                defaultValue: "YOUR_DATABASE_URL",
              },
            },
          },
          {
            opcode: "getData",
            blockType: BlockType.REPORTER,
            text: formatMessage({
              id: "scratch3.firebase.getData",
              default: "Get data from [Path]",
              description: "Fetch data from a specific path in Firebase",
            }),
            arguments: {
              Path: {
                type: ArgumentType.STRING,
                defaultValue: "users",
              },
            },
          },
          {
            opcode: "setData",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "scratch3.firebase.setData",
              default: "Set data at [Path] to [Value]",
              description: "Set data at a specific path in Firebase",
            }),
            arguments: {
              Path: {
                type: ArgumentType.STRING,
                defaultValue: "users",
              },
              Value: {
                type: ArgumentType.STRING,
                defaultValue: "Hello, Firebase!",
              },
            },
          },
          {
            opcode: "appendToList",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "scratch3.firebase.appendToList",
              default: "Append [Value] to list at [Path]",
              description:
                "Append data to a list stored at a specific path in Firebase",
            }),
            arguments: {
              Path: {
                type: ArgumentType.STRING,
                defaultValue: "messages",
              },
              Value: {
                type: ArgumentType.STRING,
                defaultValue: "Hello, Firebase!",
              },
            },
          },
        ],
      },
    ];
  }
  async initializeFirebase(args) {
    const apiKey = args.APIKey;
    const databaseURL = args.DatabaseURL;

    this.firebaseConfig = {
      apiKey,
      databaseURL,
    };

    try {
      // Initialize Firebase
      this.app = initializeApp(this.firebaseConfig);
      this.database = getDatabase(this.app);
      this.auth = getAuth(this.app);

      // Sign in anonymously to get authentication
      await signInAnonymously(this.auth);
      this.isAuthenticated = true;

      return "Firebase initialized and authenticated successfully";
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      return "Error initializing Firebase: " + error.message;
    }
  }
  async getData(args) {
    if (!this.database) {
      return "Firebase is not initialized";
    }

    if (!this.isAuthenticated) {
      return "Firebase is not authenticated. Please initialize Firebase first.";
    }

    const path = args.Path;
    try {
      const snapshot = await get(ref(this.database, path));
      console.log(snapshot);
      const data = snapshot.val();
      return data ? JSON.stringify(data) : "No data found";
    } catch (error) {
      console.error("Error fetching data:", error);
      return "Error fetching data: " + error.message;
    }
  }
  async setData(args) {
    if (!this.database) {
      return "Firebase is not initialized";
    }

    if (!this.isAuthenticated) {
      return "Firebase is not authenticated. Please initialize Firebase first.";
    }

    const path = args.Path;
    const value = args.Value;
    try {
      await set(ref(this.database, path), value);
      return "Data set successfully";
    } catch (error) {
      console.error("Error setting data:", error);
      return "Error setting data: " + error.message;
    }
  }
  async appendToList(args) {
    const path = args.Path;
    const value = args.Value;

    if (!this.database) {
      return "Firebase is not initialized";
    }

    try {
      // Get the reference to the list at the specified path
      const listRef = ref(this.database, path);

      // Fetch the current data from the list
      const snapshot = await get(listRef);
      let currentList = snapshot.val();

      // If the list doesn't exist yet, initialize it as an empty array
      if (!Array.isArray(currentList)) {
        currentList = [];
      }

      // Append the new value to the list
      currentList.push(value);

      // Set the updated list back in the database
      await set(listRef, currentList);

      return "Value appended to list successfully";
    } catch (error) {
      console.error("Error appending value to list:", error);
      return "Error appending value to list";
    }
  }
}
module.exports = Scratch3FirebaseBlocks;
