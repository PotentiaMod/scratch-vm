const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzVDQjFENiIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkk8L3RleHQ+PC9zdmc+';

const HTTP_TIMEOUT = 10000;

class ScratchProIOBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._fileInput = null;
        this._ws = null;
        this._speechVoice = null;
        this._speechRate = 1;
        this._speechPitch = 1;
        this._midiAccess = null;
        this._midiOutput = null;
        this._eventSource = null;
        this._lastSSEData = '';
        this._batteryLevel = -1;
        this._batteryCharging = false;
        this._idbDB = null;
        this._idbStore = null;
        this._dbName = '';
        this._storeName = '';
        this._webcamStream = null;
        this._webcamVideo = null;
        this._micStream = null;
        this._screenStream = null;
        this._broadcastChannel = null;
        this._lastBroadcastMessage = '';
        this._wakeLock = null;
    }

    getInfo () {
        return {
            id: 'scratchpro_io',
            name: 'ScratchPro I/O',
            blockIconURI: blockIconURI,
            color1: '#5CB1D6',
            color2: '#2E9BC8',
            color3: '#1C81A8',
            blocks: [
                {
                    opcode: 'storageSet',
                    blockType: BlockType.COMMAND,
                    text: 'set storage [KEY] to [VALUE]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'value'
                        }
                    },
                    doc: {
                        description: 'Store a value in the browser\'s local storage under the specified key. Data persists across sessions.'
                    }
                },
                {
                    opcode: 'storageGet',
                    blockType: BlockType.REPORTER,
                    text: 'get storage [KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    },
                    doc: {
                        description: 'Retrieve a value from the browser\'s local storage by its key.',
                        returns: 'The stored value, or empty string if not found.'
                    }
                },
                {
                    opcode: 'storageRemove',
                    blockType: BlockType.COMMAND,
                    text: 'remove storage [KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    },
                    doc: {
                        description: 'Remove a single entry from local storage by its key.'
                    }
                },
                {
                    opcode: 'storageClear',
                    blockType: BlockType.COMMAND,
                    text: 'clear storage',
                    doc: {
                        description: 'Remove all entries from the browser\'s local storage.'
                    }
                },
                {
                    opcode: 'storageKeys',
                    blockType: BlockType.REPORTER,
                    text: 'storage keys',
                    doc: {
                        description: 'Get a list of all keys currently stored in local storage.',
                        returns: 'A JSON array of all key names as a string.'
                    }
                },
                '---',
                {
                    opcode: 'httpGet',
                    blockType: BlockType.REPORTER,
                    text: 'HTTP GET [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://api.example.com/data'
                        }
                    },
                    doc: {
                        description: 'Send an HTTP GET request to the specified URL and return the response body.',
                        returns: 'The response body as text, or empty string on failure.'
                    }
                },
                {
                    opcode: 'httpPost',
                    blockType: BlockType.REPORTER,
                    text: 'HTTP POST [URL] body [BODY]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://api.example.com/data'
                        },
                        BODY: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"key":"value"}'
                        }
                    },
                    doc: {
                        description: 'Send an HTTP POST request with a JSON body to the specified URL.',
                        returns: 'The response body as text, or empty string on failure.'
                    }
                },
                {
                    opcode: 'httpFetch',
                    blockType: BlockType.REPORTER,
                    text: 'HTTP [METHOD] [URL] headers [HEADERS] body [BODY]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://api.example.com/data'
                        },
                        METHOD: {
                            type: ArgumentType.STRING,
                            defaultValue: 'GET'
                        },
                        HEADERS: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
                        BODY: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    },
                    doc: {
                        description: 'Send an HTTP request with a custom method, headers, and body. Headers should be a JSON object string.',
                        returns: 'The response body as text, or empty string on failure.'
                    }
                },
                '---',
                {
                    opcode: 'encodeURI',
                    blockType: BlockType.REPORTER,
                    text: 'encode URI [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Encode a string for safe use in URLs by escaping special characters.',
                        returns: 'The percent-encoded URI component string.'
                    }
                },
                {
                    opcode: 'decodeURI',
                    blockType: BlockType.REPORTER,
                    text: 'decode URI [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello%20world'
                        }
                    },
                    doc: {
                        description: 'Decode a percent-encoded URI component back to its original string.',
                        returns: 'The decoded string.'
                    }
                },
                {
                    opcode: 'btoa',
                    blockType: BlockType.REPORTER,
                    text: 'base64 encode [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Encode a string to base64 format.',
                        returns: 'The base64-encoded string.'
                    }
                },
                {
                    opcode: 'atob',
                    blockType: BlockType.REPORTER,
                    text: 'base64 decode [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'aGVsbG8='
                        }
                    },
                    doc: {
                        description: 'Decode a base64-encoded string back to its original text.',
                        returns: 'The decoded string.'
                    }
                },
                '---',
                {
                    opcode: 'fileSave',
                    blockType: BlockType.COMMAND,
                    text: 'save file [NAME] with [CONTENT]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data.txt'
                        },
                        CONTENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Download a file with the given name and content. Triggers a browser download dialog.'
                    }
                },
                {
                    opcode: 'fileLoad',
                    blockType: BlockType.REPORTER,
                    text: 'load file',
                    doc: {
                        description: 'Open a file picker dialog and read the selected file\'s contents as text.',
                        returns: 'The text content of the selected file, or empty string if cancelled.'
                    }
                },
                '---',
                {
                    opcode: 'clipboardWrite',
                    blockType: BlockType.COMMAND,
                    text: 'copy [TEXT] to clipboard',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Copy the specified text to the system clipboard.'
                    }
                },
                {
                    opcode: 'clipboardRead',
                    blockType: BlockType.REPORTER,
                    text: 'read clipboard',
                    doc: {
                        description: 'Read text from the system clipboard.',
                        returns: 'The text content of the clipboard, or empty string if unavailable.'
                    }
                },
                {
                    opcode: 'vibrate',
                    blockType: BlockType.COMMAND,
                    text: 'vibrate [MS] ms',
                    arguments: {
                        MS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
                        }
                    },
                    doc: {
                        description: 'Vibrate the device for the specified duration in milliseconds.'
                    }
                },
                {
                    opcode: 'openURL',
                    blockType: BlockType.COMMAND,
                    text: 'open URL [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com'
                        }
                    },
                    doc: {
                        description: 'Open the specified URL in a new browser tab or window.'
                    }
                },
                '---',
                {
                    opcode: 'websocketConnect',
                    blockType: BlockType.COMMAND,
                    text: 'connect websocket [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'wss://echo.websocket.org'
                        }
                    },
                    doc: {
                        description: 'Establish a WebSocket connection to the specified URL. Closes any previous connection first.'
                    }
                },
                {
                    opcode: 'websocketSend',
                    blockType: BlockType.COMMAND,
                    text: 'websocket send [DATA]',
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Send a text message through the currently open WebSocket connection.'
                    }
                },
                {
                    opcode: 'websocketOnMessage',
                    blockType: BlockType.HAT,
                    text: 'on websocket message',
                    arguments: {},
                    doc: {
                        description: 'Triggers when a message is received through the WebSocket connection.'
                    }
                },
                {
                    opcode: 'websocketClose',
                    blockType: BlockType.COMMAND,
                    text: 'close websocket',
                    arguments: {},
                    doc: {
                        description: 'Close the currently open WebSocket connection.'
                    }
                },
                '---',
                {
                    opcode: 'storageSetSession',
                    blockType: BlockType.COMMAND,
                    text: 'set session storage [KEY] to [VALUE]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'value'
                        }
                    },
                    doc: {
                        description: 'Store a value in session storage. Data is cleared when the browser tab is closed.'
                    }
                },
                {
                    opcode: 'storageGetSession',
                    blockType: BlockType.REPORTER,
                    text: 'get session storage [KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    },
                    doc: {
                        description: 'Retrieve a value from session storage by its key.',
                        returns: 'The stored value, or empty string if not found.'
                    }
                },
                '---',
                {
                    opcode: 'cookieSet',
                    blockType: BlockType.COMMAND,
                    text: 'set cookie [KEY] = [VALUE] expires [DAYS] days',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'name'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'value'
                        },
                        DAYS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 7
                        }
                    },
                    doc: {
                        description: 'Set a browser cookie with the specified key, value, and expiration in days.'
                    }
                },
                {
                    opcode: 'cookieGet',
                    blockType: BlockType.REPORTER,
                    text: 'get cookie [KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'name'
                        }
                    },
                    doc: {
                        description: 'Retrieve the value of a browser cookie by its key.',
                        returns: 'The cookie value, or empty string if not found.'
                    }
                },
                '---',
                {
                    opcode: 'geolocationLatitude',
                    blockType: BlockType.REPORTER,
                    text: 'my latitude',
                    arguments: {},
                    doc: {
                        description: 'Get the device\'s current latitude using the GPS or network location.',
                        returns: 'The latitude as a number, or 0 if unavailable.'
                    }
                },
                {
                    opcode: 'geolocationLongitude',
                    blockType: BlockType.REPORTER,
                    text: 'my longitude',
                    arguments: {},
                    doc: {
                        description: 'Get the device\'s current longitude using the GPS or network location.',
                        returns: 'The longitude as a number, or 0 if unavailable.'
                    }
                },
                '---',
                {
                    opcode: 'speechSay',
                    blockType: BlockType.COMMAND,
                    text: 'say [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello world'
                        }
                    },
                    doc: {
                        description: 'Speak the specified text aloud using the browser\'s speech synthesis.'
                    }
                },
                {
                    opcode: 'speechSetVoice',
                    blockType: BlockType.COMMAND,
                    text: 'set speech voice [VOICE]',
                    arguments: {
                        VOICE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Google UK English Female'
                        }
                    },
                    doc: {
                        description: 'Set the voice used for speech synthesis by voice name.'
                    }
                },
                {
                    opcode: 'speechSetRate',
                    blockType: BlockType.COMMAND,
                    text: 'set speech rate [RATE]',
                    arguments: {
                        RATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Set the speech rate between 0.1 and 10, where 1 is normal speed.'
                    }
                },
                {
                    opcode: 'speechSetPitch',
                    blockType: BlockType.COMMAND,
                    text: 'set speech pitch [PITCH]',
                    arguments: {
                        PITCH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Set the speech pitch between 0 and 2, where 1 is normal pitch.'
                    }
                },
                {
                    opcode: 'speechStop',
                    blockType: BlockType.COMMAND,
                    text: 'stop speech',
                    doc: {
                        description: 'Stop any currently playing speech synthesis.'
                    }
                },
                '---',
                {
                    opcode: 'notificationShow',
                    blockType: BlockType.COMMAND,
                    text: 'show notification [TITLE] [BODY]',
                    arguments: {
                        TITLE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello'
                        },
                        BODY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'This is a notification'
                        }
                    },
                    doc: {
                        description: 'Show a system notification with the given title and body. Requires notification permission.'
                    }
                },
                {
                    opcode: 'notificationPermission',
                    blockType: BlockType.REPORTER,
                    text: 'notification permission',
                    doc: {
                        description: 'Check the current notification permission status.',
                        returns: 'One of: "granted", "denied", "default", or "unsupported".'
                    }
                },
                '---',
                {
                    opcode: 'midiNoteOn',
                    blockType: BlockType.COMMAND,
                    text: 'MIDI note on [NOTE] velocity [VELOCITY]',
                    arguments: {
                        NOTE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        },
                        VELOCITY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    },
                    doc: {
                        description: 'Send a MIDI note-on message with the specified note number and velocity.'
                    }
                },
                {
                    opcode: 'midiNoteOff',
                    blockType: BlockType.COMMAND,
                    text: 'MIDI note off [NOTE]',
                    arguments: {
                        NOTE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        }
                    },
                    doc: {
                        description: 'Send a MIDI note-off message for the specified note number.'
                    }
                },
                '---',
                {
                    opcode: 'gamepadConnected',
                    blockType: BlockType.BOOLEAN,
                    text: 'gamepad connected?',
                    doc: {
                        description: 'Check if any gamepad is connected to the device.',
                        returns: 'True if at least one gamepad is connected, false otherwise.'
                    }
                },
                {
                    opcode: 'gamepadAxis',
                    blockType: BlockType.REPORTER,
                    text: 'gamepad [INDEX] axis [AXIS]',
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        AXIS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    doc: {
                        description: 'Get the current value of a specific axis on a connected gamepad.',
                        returns: 'The axis value between -1 and 1, or 0 if unavailable.'
                    }
                },
                {
                    opcode: 'gamepadButton',
                    blockType: BlockType.BOOLEAN,
                    text: 'gamepad [INDEX] button [BUTTON] pressed?',
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        BUTTON: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    doc: {
                        description: 'Check if a specific button on a connected gamepad is currently pressed.',
                        returns: 'True if the button is pressed, false otherwise.'
                    }
                },
                '---',
                {
                    opcode: 'batteryLevel',
                    blockType: BlockType.REPORTER,
                    text: 'battery level',
                    doc: {
                        description: 'Get the current battery level of the device.',
                        returns: 'A number between 0 and 1 representing the battery level, or -1 if unavailable.'
                    }
                },
                {
                    opcode: 'batteryCharging',
                    blockType: BlockType.BOOLEAN,
                    text: 'battery charging?',
                    doc: {
                        description: 'Check if the device battery is currently charging.',
                        returns: 'True if charging, false otherwise.'
                    }
                },
                {
                    opcode: 'networkType',
                    blockType: BlockType.REPORTER,
                    text: 'network type',
                    doc: {
                        description: 'Get the effective network connection type.',
                        returns: 'A string like "4g", "3g", "2g", "slow-2g", or "unknown".'
                    }
                },
                {
                    opcode: 'networkOnline',
                    blockType: BlockType.BOOLEAN,
                    text: 'network online?',
                    doc: {
                        description: 'Check if the device has an active internet connection.',
                        returns: 'True if online, false otherwise.'
                    }
                },
                '---',
                {
                    opcode: 'serverSentEvents',
                    blockType: BlockType.COMMAND,
                    text: 'SSE connect [URL] event [EVENT]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/events'
                        },
                        EVENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'message'
                        }
                    },
                    doc: {
                        description: 'Connect to a Server-Sent Events stream and listen for a specific event type.'
                    }
                },
                {
                    opcode: 'serverSentEventsOnMessage',
                    blockType: BlockType.REPORTER,
                    text: 'last SSE message',
                    doc: {
                        description: 'Get the most recent data received from the Server-Sent Events stream.',
                        returns: 'The last event data string, or empty string if no message received.'
                    }
                },
                '---',
                {
                    opcode: 'colorPicker',
                    blockType: BlockType.REPORTER,
                    text: 'color picker',
                    doc: {
                        description: 'Opens a native browser color picker dialog. Returns the selected hex color.',
                        returns: 'A hex color string like "#ff6600", or "#000000" if cancelled.'
                    }
                },
                {
                    opcode: 'confirmDialog',
                    blockType: BlockType.REPORTER,
                    text: 'confirm [MESSAGE]',
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Are you sure?'
                        }
                    },
                    doc: {
                        description: 'Shows a browser confirm dialog with the given message. Returns true if OK was clicked.',
                        returns: 'true if confirmed, false otherwise.'
                    }
                },
                {
                    opcode: 'promptDialog',
                    blockType: BlockType.REPORTER,
                    text: 'prompt [MESSAGE] default [DEFAULT]',
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Enter your name:'
                        },
                        DEFAULT: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    },
                    doc: {
                        description: 'Shows a browser prompt dialog with the given message and default value.',
                        returns: 'The text entered by the user, or empty string if cancelled.'
                    }
                },
                {
                    opcode: 'alertDialog',
                    blockType: BlockType.COMMAND,
                    text: 'alert [MESSAGE]',
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!'
                        }
                    },
                    doc: {
                        description: 'Shows a browser alert dialog with the given message.'
                    }
                },
                {
                    opcode: 'printPage',
                    blockType: BlockType.COMMAND,
                    text: 'print page',
                    doc: {
                        description: 'Opens the browser print dialog for the current page.'
                    }
                },
                {
                    opcode: 'reloadPage',
                    blockType: BlockType.COMMAND,
                    text: 'reload page',
                    doc: {
                        description: 'Reloads the current browser page.'
                    }
                },
                '---',
                {
                    opcode: 'urlParse',
                    blockType: BlockType.REPORTER,
                    text: 'parse URL [URL] get [PART]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/path?q=hello#hash'
                        },
                        PART: {
                            type: ArgumentType.STRING,
                            menu: 'urlParts'
                        }
                    },
                    doc: {
                        description: 'Parse a URL and extract a specific part (protocol, hostname, pathname, search, or hash).',
                        returns: 'The extracted URL part as a string.'
                    }
                },
                {
                    opcode: 'urlBuild',
                    blockType: BlockType.REPORTER,
                    text: 'build URL from [PARTS]',
                    arguments: {
                        PARTS: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"protocol":"https","hostname":"example.com","pathname":"/path"}'
                        }
                    },
                    doc: {
                        description: 'Build a URL string from a JSON object with protocol, hostname, pathname, search, and/or hash.',
                        returns: 'The constructed URL string.'
                    }
                },
                {
                    opcode: 'queryStringParse',
                    blockType: BlockType.REPORTER,
                    text: 'parse query string [QS]',
                    arguments: {
                        QS: {
                            type: ArgumentType.STRING,
                            defaultValue: '?name=Alice&age=30'
                        }
                    },
                    doc: {
                        description: 'Parse a query string into a JSON object of key-value pairs.',
                        returns: 'A JSON object string of the parsed parameters.'
                    }
                },
                {
                    opcode: 'queryStringBuild',
                    blockType: BlockType.REPORTER,
                    text: 'build query string from [PARAMS]',
                    arguments: {
                        PARAMS: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"name":"Alice","age":30}'
                        }
                    },
                    doc: {
                        description: 'Build a query string from a JSON object of key-value pairs.',
                        returns: 'A query string starting with "?".'
                    }
                },
                {
                    opcode: 'htmlToText',
                    blockType: BlockType.REPORTER,
                    text: 'HTML [HTML] to text',
                    arguments: {
                        HTML: {
                            type: ArgumentType.STRING,
                            defaultValue: '<b>Hello</b> <i>World</i>'
                        }
                    },
                    doc: {
                        description: 'Strip HTML tags from a string, returning only the text content.',
                        returns: 'Plain text with HTML tags removed.'
                    }
                },
                {
                    opcode: 'textToHtml',
                    blockType: BlockType.REPORTER,
                    text: 'text to HTML [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: '<b>hello</b>'
                        }
                    },
                    doc: {
                        description: 'Escape HTML special characters in text to their entity equivalents.',
                        returns: 'HTML-escaped string.'
                    }
                },
                {
                    opcode: 'csvToJSON',
                    blockType: BlockType.REPORTER,
                    text: 'parse CSV [CSV] to JSON',
                    arguments: {
                        CSV: {
                            type: ArgumentType.STRING,
                            defaultValue: 'name,age\\nAlice,30\\nBob,25'
                        }
                    },
                    doc: {
                        description: 'Parse a CSV string (with header row) into a JSON array of objects.',
                        returns: 'A JSON array string of row objects.'
                    }
                },
                {
                    opcode: 'jsonToCSV',
                    blockType: BlockType.REPORTER,
                    text: 'JSON [JSON] to CSV',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
                        }
                    },
                    doc: {
                        description: 'Convert a JSON array of objects to a CSV string with header row.',
                        returns: 'A CSV string.'
                    }
                },
                {
                    opcode: 'numberFormat',
                    blockType: BlockType.REPORTER,
                    text: 'format number [NUMBER] with locale [LOCALE]',
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1234567.89
                        },
                        LOCALE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'en-US'
                        }
                    },
                    doc: {
                        description: 'Format a number using the specified locale (e.g. "1,234,567.89").',
                        returns: 'The locale-formatted number string.'
                    }
                },
                {
                    opcode: 'dateFormatLocale',
                    blockType: BlockType.REPORTER,
                    text: 'format date [DATE] with locale [LOCALE]',
                    arguments: {
                        DATE: {
                            type: ArgumentType.STRING,
                            defaultValue: '2024-01-15'
                        },
                        LOCALE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'en-US'
                        }
                    },
                    doc: {
                        description: 'Format a date string using the specified locale.',
                        returns: 'The locale-formatted date string.'
                    }
                },
                '---',
                {
                    opcode: 'idbOpen',
                    blockType: BlockType.COMMAND,
                    text: 'open IndexedDB [DB_NAME] store [STORE]',
                    arguments: {
                        DB_NAME: {type: ArgumentType.STRING, defaultValue: 'ScratchProDB'},
                        STORE: {type: ArgumentType.STRING, defaultValue: 'store'}
                    },
                    doc: {
                        description: 'Opens (or creates) an IndexedDB database with the specified object store name.'
                    }
                },
                {
                    opcode: 'idbPut',
                    blockType: BlockType.COMMAND,
                    text: 'store [KEY] = [VALUE] in IndexedDB',
                    arguments: {
                        KEY: {type: ArgumentType.STRING, defaultValue: 'myKey'},
                        VALUE: {type: ArgumentType.STRING, defaultValue: 'myValue'}
                    },
                    doc: {
                        description: 'Stores a key-value pair in the IndexedDB object store.'
                    }
                },
                {
                    opcode: 'idbGet',
                    blockType: BlockType.REPORTER,
                    text: 'get [KEY] from IndexedDB',
                    arguments: {
                        KEY: {type: ArgumentType.STRING, defaultValue: 'myKey'}
                    },
                    doc: {
                        description: 'Retrieves a value from IndexedDB by key.',
                        returns: 'The stored value string, or empty string if not found.'
                    }
                },
                {
                    opcode: 'idbDelete',
                    blockType: BlockType.COMMAND,
                    text: 'delete [KEY] from IndexedDB',
                    arguments: {
                        KEY: {type: ArgumentType.STRING, defaultValue: 'myKey'}
                    },
                    doc: {
                        description: 'Deletes a key-value pair from IndexedDB by key.'
                    }
                },
                {
                    opcode: 'idbClear',
                    blockType: BlockType.COMMAND,
                    text: 'clear IndexedDB store',
                    doc: {
                        description: 'Clears all data from the IndexedDB object store.'
                    }
                },
                '---',
                {
                    opcode: 'webcamSnapshot',
                    blockType: BlockType.REPORTER,
                    text: 'webcam snapshot',
                    doc: {
                        description: 'Captures a single frame from the webcam as a data URL.',
                        returns: 'A data URL (base64-encoded image) or empty string if webcam unavailable.'
                    }
                },
                {
                    opcode: 'webcamStart',
                    blockType: BlockType.COMMAND,
                    text: 'start webcam width [WIDTH] height [HEIGHT]',
                    arguments: {
                        WIDTH: {type: ArgumentType.NUMBER, defaultValue: 640},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 480}
                    },
                    doc: {
                        description: 'Starts the webcam stream with the specified resolution.'
                    }
                },
                {
                    opcode: 'webcamStop',
                    blockType: BlockType.COMMAND,
                    text: 'stop webcam',
                    doc: {
                        description: 'Stops the webcam stream and releases the camera.'
                    }
                },
                {
                    opcode: 'microphoneStart',
                    blockType: BlockType.COMMAND,
                    text: 'start microphone',
                    doc: {
                        description: 'Starts the microphone audio input stream.'
                    }
                },
                {
                    opcode: 'microphoneStop',
                    blockType: BlockType.COMMAND,
                    text: 'stop microphone',
                    doc: {
                        description: 'Stops the microphone audio input stream.'
                    }
                },
                {
                    opcode: 'screenCapture',
                    blockType: BlockType.COMMAND,
                    text: 'start screen capture width [WIDTH] height [HEIGHT]',
                    arguments: {
                        WIDTH: {type: ArgumentType.NUMBER, defaultValue: 1280},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 720}
                    },
                    doc: {
                        description: 'Starts screen capture (screen sharing) at the specified resolution.'
                    }
                },
                '---',
                {
                    opcode: 'broadcastChannel',
                    blockType: BlockType.COMMAND,
                    text: 'join broadcast channel [CHANNEL]',
                    arguments: {
                        CHANNEL: {type: ArgumentType.STRING, defaultValue: 'default'}
                    },
                    doc: {
                        description: 'Creates or joins a BroadcastChannel for cross-tab communication.'
                    }
                },
                {
                    opcode: 'broadcastSend',
                    blockType: BlockType.COMMAND,
                    text: 'broadcast send [MESSAGE]',
                    arguments: {
                        MESSAGE: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: {
                        description: 'Sends a message to all tabs listening on the same BroadcastChannel.'
                    }
                },
                {
                    opcode: 'broadcastReceive',
                    blockType: BlockType.REPORTER,
                    text: 'broadcast receive',
                    doc: {
                        description: 'Returns the last message received from the BroadcastChannel.',
                        returns: 'The last received message string, or empty string if none.'
                    }
                },
                {
                    opcode: 'shareAPI',
                    blockType: BlockType.COMMAND,
                    text: 'share title [TITLE] text [TEXT] url [URL]',
                    arguments: {
                        TITLE: {type: ArgumentType.STRING, defaultValue: 'Check this out!'},
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'Hello from ScratchPro'},
                        URL: {type: ArgumentType.STRING, defaultValue: ''}
                    },
                    doc: {
                        description: 'Shares content using the Web Share API (navigator.share).'
                    }
                },
                {
                    opcode: 'canShare',
                    blockType: BlockType.BOOLEAN,
                    text: 'can share?',
                    doc: {
                        description: 'Checks if the Web Share API is supported (navigator.canShare).',
                        returns: 'True if navigator.share is available.'
                    }
                },
                '---',
                {
                    opcode: 'vibratePattern',
                    blockType: BlockType.COMMAND,
                    text: 'vibrate pattern [PATTERN]',
                    arguments: {
                        PATTERN: {type: ArgumentType.STRING, defaultValue: '[200,100,200]'}
                    },
                    doc: {
                        description: 'Vibrates with a pattern. PATTERN should be a JSON array of alternating on/off durations in ms.'
                    }
                },
                {
                    opcode: 'wakeLockRequest',
                    blockType: BlockType.COMMAND,
                    text: 'request wake lock',
                    doc: {
                        description: 'Requests a screen wake lock to prevent the screen from dimming.'
                    }
                },
                {
                    opcode: 'wakeLockRelease',
                    blockType: BlockType.COMMAND,
                    text: 'release wake lock',
                    doc: {
                        description: 'Releases the currently held screen wake lock.'
                    }
                },
                {
                    opcode: 'fullscreenToggle',
                    blockType: BlockType.COMMAND,
                    text: 'toggle fullscreen',
                    doc: {
                        description: 'Toggles the document between fullscreen and normal mode.'
                    }
                },
                {
                    opcode: 'fullscreenElement',
                    blockType: BlockType.REPORTER,
                    text: 'fullscreen element id',
                    doc: {
                        description: 'Returns the ID of the element currently in fullscreen, or empty string if none.',
                        returns: 'The fullscreen element\'s ID string, or empty string.'
                    }
                }
            ],
            menus: {
                urlParts: {
                    acceptReporters: true,
                    items: ['protocol', 'hostname', 'pathname', 'search', 'hash']
                }
            }
        };
    }

    storageSet (args) {
        try {
            if (!args) return;
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            if (!key) return;
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            log.warn('storageSet error:', e);
        }
    }

    storageGet (args) {
        try {
            if (!args) return '';
            const key = Cast.toString(args.KEY);
            if (!key) return '';
            if (typeof localStorage !== 'undefined') {
                const val = localStorage.getItem(key);
                return val !== null ? val : '';
            }
        } catch (e) {
            log.warn('storageGet error:', e);
        }
        return '';
    }

    storageRemove (args) {
        try {
            if (!args) return;
            const key = Cast.toString(args.KEY);
            if (!key) return;
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(key);
            }
        } catch (e) {
            log.warn('storageRemove error:', e);
        }
    }

    storageClear () {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.clear();
            }
        } catch (e) {
            log.warn('storageClear error:', e);
        }
    }

    storageKeys () {
        try {
            if (typeof localStorage !== 'undefined') {
                const keys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    keys.push(localStorage.key(i));
                }
                return JSON.stringify(keys);
            }
        } catch (e) {
            log.warn('storageKeys error:', e);
        }
        return '[]';
    }

    httpGet (args) {
        try {
            if (!args) return Promise.resolve('');
            const url = Cast.toString(args.URL);
            if (!url) return Promise.resolve('');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT);
            return fetch(url, {signal: controller.signal})
                .then(res => {
                    clearTimeout(timeoutId);
                    if (!res.ok) return '';
                    return res.text();
                })
                .catch(() => {
                    clearTimeout(timeoutId);
                    return '';
                });
        } catch (e) {
            return Promise.resolve('');
        }
    }

    httpPost (args) {
        try {
            if (!args) return Promise.resolve('');
            const url = Cast.toString(args.URL);
            const body = Cast.toString(args.BODY);
            if (!url) return Promise.resolve('');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT);
            return fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body,
                signal: controller.signal
            })
                .then(res => {
                    clearTimeout(timeoutId);
                    if (!res.ok) return '';
                    return res.text();
                })
                .catch(() => {
                    clearTimeout(timeoutId);
                    return '';
                });
        } catch (e) {
            return Promise.resolve('');
        }
    }

    httpFetch (args) {
        try {
            if (!args) return Promise.resolve('');
            const url = Cast.toString(args.URL);
            const method = Cast.toString(args.METHOD) || 'GET';
            const headersStr = Cast.toString(args.HEADERS);
            const body = Cast.toString(args.BODY);
            if (!url) return Promise.resolve('');
            let headers = {};
            try {
                if (headersStr) headers = JSON.parse(headersStr);
            } catch (e) {
                headers = {};
            }
            const fetchOpts = {method, headers};
            if (method !== 'GET' && method !== 'HEAD') fetchOpts.body = body;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT);
            fetchOpts.signal = controller.signal;
            return fetch(url, fetchOpts)
                .then(res => {
                    clearTimeout(timeoutId);
                    if (!res.ok) return '';
                    return res.text();
                })
                .catch(() => {
                    clearTimeout(timeoutId);
                    return '';
                });
        } catch (e) {
            return Promise.resolve('');
        }
    }

    encodeURI (args) {
        try {
            if (!args) return '';
            const text = Cast.toString(args.TEXT);
            return encodeURIComponent(text);
        } catch (e) {
            return '';
        }
    }

    decodeURI (args) {
        try {
            if (!args) return '';
            const text = Cast.toString(args.TEXT);
            return decodeURIComponent(text);
        } catch (e) {
            return '';
        }
    }

    btoa (args) {
        try {
            if (!args) return '';
            const text = Cast.toString(args.TEXT);
            if (typeof btoa === 'function') return btoa(text);
            return Buffer.from(text).toString('base64');
        } catch (e) {
            return '';
        }
    }

    atob (args) {
        try {
            if (!args) return '';
            const text = Cast.toString(args.TEXT);
            if (typeof atob === 'function') return atob(text);
            return Buffer.from(text, 'base64').toString('utf-8');
        } catch (e) {
            return '';
        }
    }

    fileSave (args) {
        try {
            if (!args) return;
            const name = Cast.toString(args.NAME) || 'download.txt';
            const content = Cast.toString(args.CONTENT);
            const blob = new Blob([content], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            log.warn('fileSave error:', e);
        }
    }

    fileLoad () {
        return new Promise(resolve => {
            try {
                if (!this._fileInput) {
                    this._fileInput = document.createElement('input');
                    this._fileInput.type = 'file';
                    this._fileInput.style.display = 'none';
                    document.body.appendChild(this._fileInput);
                }
                this._fileInput.value = '';
                this._fileInput.onchange = () => {
                    const file = this._fileInput.files[0];
                    if (!file) {
                        resolve('');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result || '');
                    reader.onerror = () => resolve('');
                    reader.readAsText(file);
                };
                this._fileInput.click();
            } catch (e) {
                log.warn('fileLoad error:', e);
                resolve('');
            }
        });
    }

    clipboardWrite (args) {
        try {
            if (!args) return;
            const text = Cast.toString(args.TEXT);
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                navigator.clipboard.writeText(text).catch(() => {});
            }
        } catch (e) {
            log.warn('clipboardWrite error:', e);
        }
    }

    clipboardRead () {
        try {
            if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
                return navigator.clipboard.readText().catch(() => '');
            }
        } catch (e) {
            log.warn('clipboardRead error:', e);
        }
        return Promise.resolve('');
    }

    vibrate (args) {
        try {
            if (!args) return;
            const ms = Cast.toNumber(args.MS);
            if (isFinite(ms) && navigator.vibrate) {
                navigator.vibrate(ms);
            }
        } catch (e) {
            log.warn('vibrate error:', e);
        }
    }

    openURL (args) {
        try {
            if (!args) return;
            const url = Cast.toString(args.URL);
            if (url && typeof window !== 'undefined' && window.open) {
                window.open(url, '_blank');
            }
        } catch (e) {
            log.warn('openURL error:', e);
        }
    }

    websocketConnect (args) {
        try {
            if (!args) return;
            const url = Cast.toString(args.URL);
            if (!url) return;
            if (this._ws) {
                try { this._ws.close(); } catch (ex) {}
            }
            this._ws = new WebSocket(url);
            this._ws.onmessage = () => {
                this.runtime.startHats('scratchpro_io_websocketOnMessage');
            };
            this._ws.onerror = () => {
                log.warn('WebSocket error');
            };
        } catch (e) {
            log.warn('websocketConnect error:', e);
        }
    }

    websocketSend (args) {
        try {
            if (!args) return;
            const data = Cast.toString(args.DATA);
            if (this._ws && this._ws.readyState === WebSocket.OPEN) {
                this._ws.send(data);
            }
        } catch (e) {
            log.warn('websocketSend error:', e);
        }
    }

    websocketOnMessage () {
        try {
            if (this._ws && this._ws.readyState === WebSocket.OPEN) {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    websocketClose () {
        try {
            if (this._ws) {
                this._ws.close();
                this._ws = null;
            }
        } catch (e) {
            log.warn('websocketClose error:', e);
        }
    }

    storageSetSession (args) {
        try {
            if (!args) return;
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            if (!key) return;
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(key, value);
            }
        } catch (e) {
            log.warn('storageSetSession error:', e);
        }
    }

    storageGetSession (args) {
        try {
            if (!args) return '';
            const key = Cast.toString(args.KEY);
            if (!key) return '';
            if (typeof sessionStorage !== 'undefined') {
                const val = sessionStorage.getItem(key);
                return val !== null ? val : '';
            }
        } catch (e) {
            log.warn('storageGetSession error:', e);
        }
        return '';
    }

    cookieSet (args) {
        try {
            if (!args) return;
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            const days = Cast.toNumber(args.DAYS);
            if (!key || typeof document === 'undefined') return;
            let expires = '';
            if (isFinite(days) && days > 0) {
                const date = new Date();
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                expires = '; expires=' + date.toUTCString();
            }
            document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + expires + '; path=/';
        } catch (e) {
            log.warn('cookieSet error:', e);
        }
    }

    cookieGet (args) {
        try {
            if (!args) return '';
            const key = Cast.toString(args.KEY);
            if (!key || typeof document === 'undefined') return '';
            const decodedKey = encodeURIComponent(key);
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(decodedKey + '=')) {
                    return decodeURIComponent(cookie.substring(decodedKey.length + 1));
                }
            }
            return '';
        } catch (e) {
            log.warn('cookieGet error:', e);
        }
        return '';
    }

    geolocationLatitude () {
        return new Promise(resolve => {
            try {
                if (typeof navigator === 'undefined' || !navigator.geolocation) {
                    resolve(0);
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    pos => resolve(pos.coords.latitude),
                    () => resolve(0)
                );
            } catch (e) {
                resolve(0);
            }
        });
    }

    geolocationLongitude () {
        return new Promise(resolve => {
            try {
                if (typeof navigator === 'undefined' || !navigator.geolocation) {
                    resolve(0);
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    pos => resolve(pos.coords.longitude),
                    () => resolve(0)
                );
            } catch (e) {
                resolve(0);
            }
        });
    }

    speechSay (args) {
        try {
            if (!args) return;
            const text = Cast.toString(args.TEXT);
            if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            if (this._speechVoice) {
                const voices = window.speechSynthesis.getVoices();
                const match = voices.find(v => v.name === this._speechVoice);
                if (match) utterance.voice = match;
            }
            utterance.rate = this._speechRate;
            utterance.pitch = this._speechPitch;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            log.warn('speechSay error:', e);
        }
    }

    speechSetVoice (args) {
        try {
            if (!args) return;
            this._speechVoice = Cast.toString(args.VOICE);
        } catch (e) {
            log.warn('speechSetVoice error:', e);
        }
    }

    speechSetRate (args) {
        try {
            if (!args) return;
            const rate = Cast.toNumber(args.RATE);
            this._speechRate = Math.max(0.1, Math.min(10, rate));
        } catch (e) {
            log.warn('speechSetRate error:', e);
        }
    }

    speechSetPitch (args) {
        try {
            if (!args) return;
            const pitch = Cast.toNumber(args.PITCH);
            this._speechPitch = Math.max(0, Math.min(2, pitch));
        } catch (e) {
            log.warn('speechSetPitch error:', e);
        }
    }

    speechStop () {
        try {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        } catch (e) {
            log.warn('speechStop error:', e);
        }
    }

    notificationShow (args) {
        try {
            if (!args) return;
            const title = Cast.toString(args.TITLE);
            const body = Cast.toString(args.BODY);
            if (!title || typeof Notification === 'undefined') return;
            if (Notification.permission === 'granted') {
                new Notification(title, {body});
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(perm => {
                    if (perm === 'granted') {
                        new Notification(title, {body});
                    }
                });
            }
        } catch (e) {
            log.warn('notificationShow error:', e);
        }
    }

    notificationPermission () {
        try {
            if (typeof Notification === 'undefined') return 'unsupported';
            return Notification.permission;
        } catch (e) {
            return 'unsupported';
        }
    }

    midiNoteOn (args) {
        try {
            if (!args) return;
            const note = Cast.toNumber(args.NOTE);
            const velocity = Cast.toNumber(args.VELOCITY);
            if (!isFinite(note) || !isFinite(velocity)) return;
            if (this._midiOutput) {
                this._midiOutput.send([0x90, note, velocity]);
            } else if (typeof navigator !== 'undefined' && navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess().then(access => {
                    const outputs = access.outputs.values().next();
                    if (outputs.value) {
                        this._midiOutput = outputs.value;
                        this._midiOutput.send([0x90, note, velocity]);
                    }
                }).catch(() => {});
            }
        } catch (e) {
            log.warn('midiNoteOn error:', e);
        }
    }

    midiNoteOff (args) {
        try {
            if (!args) return;
            const note = Cast.toNumber(args.NOTE);
            if (!isFinite(note)) return;
            if (this._midiOutput) {
                this._midiOutput.send([0x80, note, 0]);
            } else if (typeof navigator !== 'undefined' && navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess().then(access => {
                    const outputs = access.outputs.values().next();
                    if (outputs.value) {
                        this._midiOutput = outputs.value;
                        this._midiOutput.send([0x80, note, 0]);
                    }
                }).catch(() => {});
            }
        } catch (e) {
            log.warn('midiNoteOff error:', e);
        }
    }

    gamepadConnected () {
        try {
            if (typeof navigator === 'undefined' || !navigator.getGamepads) return false;
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] !== null) return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    gamepadAxis (args) {
        try {
            if (!args) return 0;
            const index = Cast.toNumber(args.INDEX);
            const axis = Cast.toNumber(args.AXIS);
            if (typeof navigator === 'undefined' || !navigator.getGamepads) return 0;
            const gamepads = navigator.getGamepads();
            const gp = gamepads[index];
            if (!gp || !gp.axes || gp.axes.length <= axis) return 0;
            return gp.axes[axis];
        } catch (e) {
            return 0;
        }
    }

    gamepadButton (args) {
        try {
            if (!args) return false;
            const index = Cast.toNumber(args.INDEX);
            const button = Cast.toNumber(args.BUTTON);
            if (typeof navigator === 'undefined' || !navigator.getGamepads) return false;
            const gamepads = navigator.getGamepads();
            const gp = gamepads[index];
            if (!gp || !gp.buttons || gp.buttons.length <= button) return false;
            return gp.buttons[button].pressed;
        } catch (e) {
            return false;
        }
    }

    batteryLevel () {
        try {
            if (typeof navigator !== 'undefined' && navigator.getBattery) {
                return navigator.getBattery().then(battery => {
                    if (battery && typeof battery.level === 'number') {
                        this._batteryLevel = battery.level;
                        return battery.level;
                    }
                    return -1;
                }).catch(() => -1);
            }
        } catch (e) {
            log.warn('batteryLevel error:', e);
        }
        return Promise.resolve(-1);
    }

    batteryCharging () {
        try {
            if (typeof navigator !== 'undefined' && navigator.getBattery) {
                return navigator.getBattery().then(battery => {
                    if (battery && typeof battery.charging === 'boolean') {
                        this._batteryCharging = battery.charging;
                        return battery.charging;
                    }
                    return false;
                }).catch(() => false);
            }
        } catch (e) {
            log.warn('batteryCharging error:', e);
        }
        return Promise.resolve(false);
    }

    networkType () {
        try {
            if (typeof navigator !== 'undefined' && navigator.connection && navigator.connection.effectiveType) {
                return navigator.connection.effectiveType;
            }
            return 'unknown';
        } catch (e) {
            return 'unknown';
        }
    }

    networkOnline () {
        try {
            if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
                return navigator.onLine;
            }
            return true;
        } catch (e) {
            return true;
        }
    }

    serverSentEvents (args) {
        try {
            if (!args) return;
            const url = Cast.toString(args.URL);
            const eventName = Cast.toString(args.EVENT);
            if (!url || typeof EventSource === 'undefined') return;
            if (this._eventSource) {
                this._eventSource.close();
            }
            this._lastSSEData = '';
            this._eventSource = new EventSource(url);
            this._eventSource.addEventListener(eventName || 'message', (e) => {
                this._lastSSEData = e.data;
            });
            this._eventSource.onerror = () => {};
        } catch (e) {
            log.warn('serverSentEvents error:', e);
        }
    }

    serverSentEventsOnMessage () {
        return this._lastSSEData || '';
    }

    colorPicker () {
        return new Promise(resolve => {
            try {
                const input = document.createElement('input');
                input.type = 'color';
                input.value = '#000000';
                input.style.display = 'none';
                document.body.appendChild(input);
                input.addEventListener('input', () => {
                    document.body.removeChild(input);
                    resolve(input.value);
                });
                input.addEventListener('cancel', () => {
                    document.body.removeChild(input);
                    resolve('#000000');
                });
                input.click();
            } catch (e) {
                resolve('#000000');
            }
        });
    }

    confirmDialog (args) {
        try {
            if (!args) return false;
            const message = Cast.toString(args.MESSAGE);
            if (typeof window === 'undefined' || typeof window.confirm !== 'function') return false;
            return window.confirm(message);
        } catch (e) {
            return false;
        }
    }

    promptDialog (args) {
        try {
            if (!args) return '';
            const message = Cast.toString(args.MESSAGE);
            const defaultVal = Cast.toString(args.DEFAULT);
            if (typeof window === 'undefined' || typeof window.prompt !== 'function') return '';
            const result = window.prompt(message, defaultVal);
            return result !== null ? result : '';
        } catch (e) {
            return '';
        }
    }

    alertDialog (args) {
        try {
            if (!args) return;
            const message = Cast.toString(args.MESSAGE);
            if (typeof window !== 'undefined' && typeof window.alert === 'function') {
                window.alert(message);
            }
        } catch (e) {
            log.warn('alertDialog error:', e);
        }
    }

    printPage () {
        try {
            if (typeof window !== 'undefined' && typeof window.print === 'function') {
                window.print();
            }
        } catch (e) {
            log.warn('printPage error:', e);
        }
    }

    reloadPage () {
        try {
            if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
                window.location.reload();
            }
        } catch (e) {
            log.warn('reloadPage error:', e);
        }
    }

    urlParse (args) {
        if (!args) return '';
        try {
            const urlStr = Cast.toString(args.URL);
            const part = Cast.toString(args.PART);
            if (!urlStr) return '';
            const url = new URL(urlStr);
            switch (part) {
            case 'protocol': return url.protocol;
            case 'hostname': return url.hostname;
            case 'pathname': return url.pathname;
            case 'search': return url.search;
            case 'hash': return url.hash;
            default: return '';
            }
        } catch (e) {
            return '';
        }
    }

    urlBuild (args) {
        if (!args) return '';
        try {
            const partsStr = Cast.toString(args.PARTS);
            if (!partsStr) return '';
            const parts = JSON.parse(partsStr);
            if (typeof parts !== 'object' || parts === null) return '';
            const protocol = parts.protocol || 'https';
            const hostname = parts.hostname || 'localhost';
            const pathname = parts.pathname || '/';
            const search = parts.search || '';
            const hash = parts.hash || '';
            return `${protocol}://${hostname}${pathname}${search}${hash}`;
        } catch (e) {
            return '';
        }
    }

    queryStringParse (args) {
        if (!args) return '{}';
        try {
            let qs = Cast.toString(args.QS);
            if (!qs) return '{}';
            if (qs.startsWith('?')) qs = qs.slice(1);
            const params = new URLSearchParams(qs);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            return JSON.stringify(result);
        } catch (e) {
            return '{}';
        }
    }

    queryStringBuild (args) {
        if (!args) return '';
        try {
            const paramsStr = Cast.toString(args.PARAMS);
            if (!paramsStr) return '';
            const params = JSON.parse(paramsStr);
            if (typeof params !== 'object' || params === null) return '';
            const qs = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                qs.append(key, String(value));
            }
            const str = qs.toString();
            return str ? '?' + str : '';
        } catch (e) {
            return '';
        }
    }

    htmlToText (args) {
        if (!args) return '';
        try {
            const html = Cast.toString(args.HTML);
            if (!html) return '';
            if (typeof document !== 'undefined') {
                const div = document.createElement('div');
                div.innerHTML = html;
                return div.textContent || div.innerText || '';
            }
            return html.replace(/<[^>]*>/g, '');
        } catch (e) {
            return '';
        }
    }

    textToHtml (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        } catch (e) {
            return '';
        }
    }

    csvToJSON (args) {
        if (!args) return '[]';
        try {
            const csv = Cast.toString(args.CSV);
            if (!csv) return '[]';
            const lines = csv.trim().split('\n');
            if (lines.length < 1) return '[]';
            const headers = lines[0].split(',').map(h => h.trim());
            const result = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                if (values.length === 0) continue;
                const row = {};
                headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
                result.push(row);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    jsonToCSV (args) {
        if (!args) return '';
        try {
            const jsonStr = Cast.toString(args.JSON);
            if (!jsonStr) return '';
            const data = JSON.parse(jsonStr);
            if (!Array.isArray(data) || data.length === 0) return '';
            const headers = Object.keys(data[0]);
            const csvLines = [headers.join(',')];
            for (const row of data) {
                const values = headers.map(h => {
                    const val = row[h] !== undefined ? row[h] : '';
                    return String(val);
                });
                csvLines.push(values.join(','));
            }
            return csvLines.join('\n');
        } catch (e) {
            return '';
        }
    }

    numberFormat (args) {
        if (!args) return '';
        try {
            const number = Cast.toNumber(args.NUMBER);
            const locale = Cast.toString(args.LOCALE) || 'en-US';
            if (typeof Intl === 'undefined') return String(number);
            return new Intl.NumberFormat(locale).format(number);
        } catch (e) {
            return '';
        }
    }

    dateFormatLocale (args) {
        if (!args) return '';
        try {
            const dateStr = Cast.toString(args.DATE);
            const locale = Cast.toString(args.LOCALE) || 'en-US';
            if (!dateStr) return '';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '';
            if (typeof Intl === 'undefined') return date.toLocaleDateString();
            return new Intl.DateTimeFormat(locale).format(date);
        } catch (e) {
            return '';
        }
    }

    idbOpen (args) {
        try {
            if (!args) return;
            const dbName = Cast.toString(args.DB_NAME);
            const storeName = Cast.toString(args.STORE);
            if (!dbName || !storeName || typeof indexedDB === 'undefined') return;
            this._dbName = dbName;
            this._storeName = storeName;
            const request = indexedDB.open(dbName);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };
            request.onsuccess = (e) => {
                this._idbDB = e.target.result;
                this._idbStore = storeName;
            };
            request.onerror = () => {
                log.warn('idbOpen error');
            };
        } catch (e) {
            log.warn('idbOpen error:', e);
        }
    }

    idbPut (args) {
        try {
            if (!args) return;
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            if (!key || !this._idbDB || !this._idbStore) return;
            const tx = this._idbDB.transaction([this._idbStore], 'readwrite');
            tx.objectStore(this._idbStore).put(value, key);
        } catch (e) {
            log.warn('idbPut error:', e);
        }
    }

    idbGet (args) {
        try {
            if (!args) return Promise.resolve('');
            const key = Cast.toString(args.KEY);
            if (!key || !this._idbDB || !this._idbStore) return Promise.resolve('');
            return new Promise(resolve => {
                const tx = this._idbDB.transaction([this._idbStore], 'readonly');
                const req = tx.objectStore(this._idbStore).get(key);
                req.onsuccess = () => resolve(req.result !== undefined ? Cast.toString(req.result) : '');
                req.onerror = () => resolve('');
            });
        } catch (e) {
            return Promise.resolve('');
        }
    }

    idbDelete (args) {
        try {
            if (!args) return;
            const key = Cast.toString(args.KEY);
            if (!key || !this._idbDB || !this._idbStore) return;
            const tx = this._idbDB.transaction([this._idbStore], 'readwrite');
            tx.objectStore(this._idbStore).delete(key);
        } catch (e) {
            log.warn('idbDelete error:', e);
        }
    }

    idbClear () {
        try {
            if (!this._idbDB || !this._idbStore) return;
            const tx = this._idbDB.transaction([this._idbStore], 'readwrite');
            tx.objectStore(this._idbStore).clear();
        } catch (e) {
            log.warn('idbClear error:', e);
        }
    }

    webcamSnapshot (args) {
        try {
            if (!args) return Promise.resolve('');
            if (!this._webcamVideo || !this._webcamStream) return Promise.resolve('');
            const canvas = document.createElement('canvas');
            canvas.width = this._webcamVideo.videoWidth || 640;
            canvas.height = this._webcamVideo.videoHeight || 480;
            canvas.getContext('2d').drawImage(this._webcamVideo, 0, 0);
            return Promise.resolve(canvas.toDataURL('image/png'));
        } catch (e) {
            return Promise.resolve('');
        }
    }

    webcamStart (args) {
        try {
            if (!args) return;
            const width = Cast.toNumber(args.WIDTH) || 640;
            const height = Cast.toNumber(args.HEIGHT) || 480;
            if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
            navigator.mediaDevices.getUserMedia({video: {width, height}}).then(stream => {
                this._webcamStream = stream;
                if (!this._webcamVideo) {
                    this._webcamVideo = document.createElement('video');
                    this._webcamVideo.style.display = 'none';
                    document.body.appendChild(this._webcamVideo);
                }
                this._webcamVideo.srcObject = stream;
                this._webcamVideo.play();
            }).catch(() => {});
        } catch (e) {
            log.warn('webcamStart error:', e);
        }
    }

    webcamStop () {
        try {
            if (this._webcamStream) {
                this._webcamStream.getTracks().forEach(t => t.stop());
                this._webcamStream = null;
            }
            if (this._webcamVideo) {
                this._webcamVideo.pause();
                this._webcamVideo.srcObject = null;
            }
        } catch (e) {
            log.warn('webcamStop error:', e);
        }
    }

    microphoneStart () {
        try {
            if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
            navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                this._micStream = stream;
            }).catch(() => {});
        } catch (e) {
            log.warn('microphoneStart error:', e);
        }
    }

    microphoneStop () {
        try {
            if (this._micStream) {
                this._micStream.getTracks().forEach(t => t.stop());
                this._micStream = null;
            }
        } catch (e) {
            log.warn('microphoneStop error:', e);
        }
    }

    screenCapture (args) {
        try {
            if (!args) return;
            const width = Cast.toNumber(args.WIDTH) || 1280;
            const height = Cast.toNumber(args.HEIGHT) || 720;
            if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return;
            navigator.mediaDevices.getDisplayMedia({video: {width, height}}).then(stream => {
                this._screenStream = stream;
            }).catch(() => {});
        } catch (e) {
            log.warn('screenCapture error:', e);
        }
    }

    broadcastChannel (args) {
        try {
            if (!args) return;
            const channel = Cast.toString(args.CHANNEL);
            if (!channel || typeof BroadcastChannel === 'undefined') return;
            if (this._broadcastChannel) {
                this._broadcastChannel.close();
            }
            this._lastBroadcastMessage = '';
            this._broadcastChannel = new BroadcastChannel(channel);
            this._broadcastChannel.onmessage = (e) => {
                this._lastBroadcastMessage = Cast.toString(e.data);
            };
        } catch (e) {
            log.warn('broadcastChannel error:', e);
        }
    }

    broadcastSend (args) {
        try {
            if (!args) return;
            const message = Cast.toString(args.MESSAGE);
            if (this._broadcastChannel) {
                this._broadcastChannel.postMessage(message);
            }
        } catch (e) {
            log.warn('broadcastSend error:', e);
        }
    }

    broadcastReceive () {
        try {
            return this._lastBroadcastMessage || '';
        } catch (e) {
            return '';
        }
    }

    shareAPI (args) {
        try {
            if (!args) return;
            const title = Cast.toString(args.TITLE) || '';
            const text = Cast.toString(args.TEXT) || '';
            const url = Cast.toString(args.URL) || '';
            if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({title, text, url}).catch(() => {});
            }
        } catch (e) {
            log.warn('shareAPI error:', e);
        }
    }

    canShare () {
        try {
            if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function') {
                return navigator.canShare({});
            }
            return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
        } catch (e) {
            return false;
        }
    }

    vibratePattern (args) {
        try {
            if (!args) return;
            const patternStr = Cast.toString(args.PATTERN);
            let pattern = [];
            try {
                pattern = JSON.parse(patternStr);
            } catch (ex) {
                return;
            }
            if (Array.isArray(pattern) && navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        } catch (e) {
            log.warn('vibratePattern error:', e);
        }
    }

    wakeLockRequest () {
        try {
            if (typeof navigator !== 'undefined' && navigator.wakeLock && typeof navigator.wakeLock.request === 'function') {
                navigator.wakeLock.request('screen').then(lock => {
                    this._wakeLock = lock;
                }).catch(() => {});
            }
        } catch (e) {
            log.warn('wakeLockRequest error:', e);
        }
    }

    wakeLockRelease () {
        try {
            if (this._wakeLock && typeof this._wakeLock.release === 'function') {
                this._wakeLock.release();
                this._wakeLock = null;
            }
        } catch (e) {
            log.warn('wakeLockRelease error:', e);
        }
    }

    fullscreenToggle () {
        try {
            if (typeof document === 'undefined') return;
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            } else {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        } catch (e) {
            log.warn('fullscreenToggle error:', e);
        }
    }

    fullscreenElement () {
        try {
            if (typeof document !== 'undefined' && document.fullscreenElement) {
                return document.fullscreenElement.id || document.fullscreenElement.tagName || '';
            }
            return '';
        } catch (e) {
            return '';
        }
    }
}

module.exports = ScratchProIOBlocks;
