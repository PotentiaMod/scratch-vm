const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iI0ZGNjY4MCIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlM8L3RleHQ+PC9zdmc+';

class ScratchProSenseBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._stopwatches = {};
        this._countdownTimers = {};
    }

    getInfo () {
        return {
            id: 'scratchpro_sense',
            name: 'ScratchPro Sensing',
            blockIconURI: blockIconURI,
            color1: '#FF6680',
            color2: '#E64D66',
            color3: '#CC334D',
            blocks: [
                {
                    opcode: 'systemInfo',
                    blockType: BlockType.REPORTER,
                    text: 'system [PROP]',
                    arguments: {
                        PROP: {
                            type: ArgumentType.STRING,
                            menu: 'systemProps'
                        }
                    },
                    doc: {
                        description: 'Get system information properties like user agent, language, platform, cookies enabled, or online status.',
                        returns: 'The value of the selected system property as a string.'
                    }
                },
                {
                    opcode: 'screenWidth',
                    blockType: BlockType.REPORTER,
                    text: 'screen width',
                    doc: {
                        description: 'Get the total screen width in pixels.',
                        returns: 'The screen width as a number.'
                    }
                },
                {
                    opcode: 'screenHeight',
                    blockType: BlockType.REPORTER,
                    text: 'screen height',
                    doc: {
                        description: 'Get the total screen height in pixels.',
                        returns: 'The screen height as a number.'
                    }
                },
                {
                    opcode: 'windowWidth',
                    blockType: BlockType.REPORTER,
                    text: 'window width',
                    doc: {
                        description: 'Get the browser window inner width in pixels.',
                        returns: 'The window width as a number.'
                    }
                },
                {
                    opcode: 'windowHeight',
                    blockType: BlockType.REPORTER,
                    text: 'window height',
                    doc: {
                        description: 'Get the browser window inner height in pixels.',
                        returns: 'The window height as a number.'
                    }
                },
                '---',
                {
                    opcode: 'dateFormat',
                    blockType: BlockType.REPORTER,
                    text: 'date [FORMAT]',
                    arguments: {
                        FORMAT: {
                            type: ArgumentType.STRING,
                            menu: 'dateFormats'
                        }
                    },
                    doc: {
                        description: 'Get the current date or time in the selected format, such as ISO, date, time, or timestamp.',
                        returns: 'A formatted date/time string or numeric timestamp.'
                    }
                },
                {
                    opcode: 'dateAdd',
                    blockType: BlockType.REPORTER,
                    text: 'add [VALUE] [UNIT] to [DATE]',
                    arguments: {
                        DATE: {
                            type: ArgumentType.STRING,
                            defaultValue: '2024-01-01'
                        },
                        UNIT: {
                            type: ArgumentType.STRING,
                            menu: 'dateUnits'
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Add a number of days, months, or years to a date and return the result as an ISO string.',
                        returns: 'The resulting date as an ISO 8601 string.'
                    }
                },
                {
                    opcode: 'dateDiff',
                    blockType: BlockType.REPORTER,
                    text: 'difference between [A] and [B] in [UNIT]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: '2024-01-01'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: '2024-01-07'
                        },
                        UNIT: {
                            type: ArgumentType.STRING,
                            menu: 'diffUnits'
                        }
                    },
                    doc: {
                        description: 'Calculate the difference between two dates in days, hours, or minutes.',
                        returns: 'The numeric difference in the selected unit.'
                    }
                },
                '---',
                {
                    opcode: 'getRandomColor',
                    blockType: BlockType.REPORTER,
                    text: 'random color',
                    doc: {
                        description: 'Generate a random hex color code.',
                        returns: 'A hex color string like "#a3f07b".'
                    }
                },
                {
                    opcode: 'getRandomUUID',
                    blockType: BlockType.REPORTER,
                    text: 'random UUID',
                    doc: {
                        description: 'Generate a random UUID v4 identifier.',
                        returns: 'A UUID string in the format "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".'
                    }
                },
                {
                    opcode: 'getBattery',
                    blockType: BlockType.REPORTER,
                    text: 'battery level',
                    doc: {
                        description: 'Get the current battery level as a percentage.',
                        returns: 'A number from 0 to 100 representing the battery percentage, or -1 if unavailable.'
                    }
                },
                '---',
                {
                    opcode: 'sensorAccelerometer',
                    blockType: BlockType.REPORTER,
                    text: 'accelerometer data',
                    doc: {
                        description: 'Get accelerometer sensor data including x, y, and z acceleration values.',
                        returns: 'A JSON string with "x", "y", and "z" acceleration values.'
                    }
                },
                {
                    opcode: 'sensorGyroscope',
                    blockType: BlockType.REPORTER,
                    text: 'gyroscope data',
                    doc: {
                        description: 'Get gyroscope orientation data including alpha, beta, and gamma rotation values.',
                        returns: 'A JSON string with "alpha", "beta", and "gamma" orientation values.'
                    }
                },
                {
                    opcode: 'sensorLight',
                    blockType: BlockType.REPORTER,
                    text: 'ambient light level',
                    doc: {
                        description: 'Get the ambient light level from the device\'s light sensor in lux.',
                        returns: 'The light level in lux, or -1 if unavailable.'
                    }
                },
                {
                    opcode: 'sensorProximity',
                    blockType: BlockType.REPORTER,
                    text: 'proximity',
                    doc: {
                        description: 'Get the proximity sensor distance in centimeters.',
                        returns: 'The distance in cm, or -1 if unavailable.'
                    }
                },
                '---',
                {
                    opcode: 'memoryInfo',
                    blockType: BlockType.REPORTER,
                    text: 'memory info',
                    doc: {
                        description: 'Get JavaScript heap memory usage statistics.',
                        returns: 'A JSON string with jsHeapSizeLimit, totalJSHeapSize, and usedJSHeapSize values.'
                    }
                },
                {
                    opcode: 'cpuCores',
                    blockType: BlockType.REPORTER,
                    text: 'CPU cores',
                    doc: {
                        description: 'Get the number of logical CPU cores available on the device.',
                        returns: 'The number of CPU cores as a number.'
                    }
                },
                {
                    opcode: 'maxTouchPoints',
                    blockType: BlockType.REPORTER,
                    text: 'max touch points',
                    doc: {
                        description: 'Get the maximum number of simultaneous touch points the device supports.',
                        returns: 'The maximum touch points as a number.'
                    }
                },
                {
                    opcode: 'colorScheme',
                    blockType: BlockType.REPORTER,
                    text: 'color scheme',
                    doc: {
                        description: 'Detect whether the user prefers a light or dark color scheme.',
                        returns: '"dark" if dark mode is preferred, "light" otherwise.'
                    }
                },
                {
                    opcode: 'reducedMotion',
                    blockType: BlockType.BOOLEAN,
                    text: 'reduced motion?',
                    doc: {
                        description: 'Check if the user prefers reduced motion accessibility settings.',
                        returns: 'True if reduced motion is preferred, false otherwise.'
                    }
                },
                '---',
                {
                    opcode: 'locale',
                    blockType: BlockType.REPORTER,
                    text: 'locale',
                    doc: {
                        description: 'Get the user\'s preferred language and locale settings.',
                        returns: 'A locale string like "en-US" or "zh-CN".'
                    }
                },
                {
                    opcode: 'timezone',
                    blockType: BlockType.REPORTER,
                    text: 'timezone',
                    doc: {
                        description: 'Get the user\'s current IANA timezone identifier.',
                        returns: 'A timezone string like "America/New_York" or "UTC".'
                    }
                },
                {
                    opcode: 'platform',
                    blockType: BlockType.REPORTER,
                    text: 'platform',
                    doc: {
                        description: 'Get the operating system platform identifier.',
                        returns: 'A platform string like "Win32", "MacIntel", "Linux x86_64", or "unknown".'
                    }
                },
                '---',
                {
                    opcode: 'isTouchDevice',
                    blockType: BlockType.BOOLEAN,
                    text: 'touch device?',
                    doc: {
                        description: 'Checks if the device supports touch events.',
                        returns: 'true if touch is supported, false otherwise'
                    }
                },
                {
                    opcode: 'isMobileDevice',
                    blockType: BlockType.BOOLEAN,
                    text: 'mobile device?',
                    doc: {
                        description: 'Checks if the user agent indicates a mobile device.',
                        returns: 'true if mobile, false otherwise'
                    }
                },
                {
                    opcode: 'isAndroid',
                    blockType: BlockType.BOOLEAN,
                    text: 'is Android?',
                    doc: {
                        description: 'Checks if the user agent indicates an Android device.',
                        returns: 'true if Android, false otherwise'
                    }
                },
                {
                    opcode: 'isiOS',
                    blockType: BlockType.BOOLEAN,
                    text: 'is iOS?',
                    doc: {
                        description: 'Checks if the user agent indicates an iOS device (iPhone/iPad).',
                        returns: 'true if iOS, false otherwise'
                    }
                },
                {
                    opcode: 'isWindows',
                    blockType: BlockType.BOOLEAN,
                    text: 'is Windows?',
                    doc: {
                        description: 'Checks if the user agent indicates a Windows OS.',
                        returns: 'true if Windows, false otherwise'
                    }
                },
                {
                    opcode: 'isMac',
                    blockType: BlockType.BOOLEAN,
                    text: 'is Mac?',
                    doc: {
                        description: 'Checks if the user agent indicates a Mac OS.',
                        returns: 'true if Mac, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'randomHexColor',
                    blockType: BlockType.REPORTER,
                    text: 'random hex color',
                    doc: {
                        description: 'Generate a random hex color code in #RRGGBB format.',
                        returns: 'A hex color string like "#a3f07b".'
                    }
                },
                {
                    opcode: 'randomRgbColor',
                    blockType: BlockType.REPORTER,
                    text: 'random RGB color',
                    doc: {
                        description: 'Generate a random RGB color string.',
                        returns: 'An rgb(r,g,b) string like "rgb(123,45,67)".'
                    }
                },
                {
                    opcode: 'randomHslColor',
                    blockType: BlockType.REPORTER,
                    text: 'random HSL color',
                    doc: {
                        description: 'Generate a random HSL color string.',
                        returns: 'An hsl(h,s%,l%) string like "hsl(180,50%,75%)".'
                    }
                },
                {
                    opcode: 'contrastColor',
                    blockType: BlockType.REPORTER,
                    text: 'contrast color for [HEX]',
                    arguments: {
                        HEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff6600'
                        }
                    },
                    doc: {
                        description: 'Return black (#000000) or white (#ffffff) as the best contrast color for the given hex background.',
                        returns: 'A hex color string, either "#000000" or "#ffffff".'
                    }
                },
                {
                    opcode: 'hexToRgb',
                    blockType: BlockType.REPORTER,
                    text: 'hex [HEX] to RGB',
                    arguments: {
                        HEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff6600'
                        }
                    },
                    doc: {
                        description: 'Convert a hex color to a JSON object with r, g, b values.',
                        returns: 'A JSON string like {"r":255,"g":102,"b":0}.'
                    }
                },
                {
                    opcode: 'rgbToHex',
                    blockType: BlockType.REPORTER,
                    text: 'RGB [R] [G] [B] to hex',
                    arguments: {
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        G: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 102
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    doc: {
                        description: 'Convert RGB values to a hex color string.',
                        returns: 'A hex color string like "#ff6600".'
                    }
                },
                {
                    opcode: 'colorBrightness',
                    blockType: BlockType.REPORTER,
                    text: 'brightness of [HEX]',
                    arguments: {
                        HEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff6600'
                        }
                    },
                    doc: {
                        description: 'Calculate the perceived brightness of a hex color (0-255). Uses the luminosity formula.',
                        returns: 'A brightness value between 0 and 255.'
                    }
                },
                '---',
                {
                    opcode: 'colorRgbToHsl',
                    blockType: BlockType.REPORTER,
                    text: 'RGB [R] [G] [B] to HSL',
                    arguments: {
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        G: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    },
                    doc: {
                        description: 'Convert RGB values to HSL color space',
                        returns: 'JSON {h, s, l}'
                    }
                },
                {
                    opcode: 'colorHslToRgb',
                    blockType: BlockType.REPORTER,
                    text: 'HSL [H] [S] [L] to RGB',
                    arguments: {
                        H: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },
                        S: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        L: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        }
                    },
                    doc: {
                        description: 'Convert HSL values to RGB color space',
                        returns: 'JSON {r, g, b}'
                    }
                },
                {
                    opcode: 'colorRgbToHsv',
                    blockType: BlockType.REPORTER,
                    text: 'RGB [R] [G] [B] to HSV',
                    arguments: {
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        G: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    },
                    doc: {
                        description: 'Convert RGB values to HSV color space',
                        returns: 'JSON {h, s, v}'
                    }
                },
                {
                    opcode: 'colorHsvToRgb',
                    blockType: BlockType.REPORTER,
                    text: 'HSV [H] [S] [V] to RGB',
                    arguments: {
                        H: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15
                        },
                        S: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 80
                        },
                        V: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    },
                    doc: {
                        description: 'Convert HSV values to RGB color space',
                        returns: 'JSON {r, g, b}'
                    }
                },
                {
                    opcode: 'colorComplementary',
                    blockType: BlockType.REPORTER,
                    text: 'complementary of [HEX]',
                    arguments: {
                        HEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff6600'
                        }
                    },
                    doc: {
                        description: 'Get the complementary color (360° hue rotation)',
                        returns: 'A hex color string'
                    }
                },
                {
                    opcode: 'colorAnalogous',
                    blockType: BlockType.REPORTER,
                    text: 'analogous colors of [HEX]',
                    arguments: {
                        HEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff6600'
                        }
                    },
                    doc: {
                        description: 'Get 3 analogous colors (±30° hue rotation)',
                        returns: 'JSON array of 3 hex colors'
                    }
                },
                {
                    opcode: 'colorTriadic',
                    blockType: BlockType.REPORTER,
                    text: 'triadic colors of [HEX]',
                    arguments: {
                        HEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff6600'
                        }
                    },
                    doc: {
                        description: 'Get 3 triadic colors (±120° hue rotation)',
                        returns: 'JSON array of 3 hex colors'
                    }
                },
                {
                    opcode: 'colorTemperature',
                    blockType: BlockType.REPORTER,
                    text: 'temperature of [HEX]',
                    arguments: {
                        HEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff6600'
                        }
                    },
                    doc: {
                        description: 'Classify a hex color as warm, cool, or neutral',
                        returns: '"warm", "cool", or "neutral"'
                    }
                },
                {
                    opcode: 'colorBlendMode',
                    blockType: BlockType.REPORTER,
                    text: 'blend [C1] with [C2] using [MODE]',
                    arguments: {
                        C1: {
                            type: ArgumentType.STRING,
                            defaultValue: '#ff0000'
                        },
                        C2: {
                            type: ArgumentType.STRING,
                            defaultValue: '#0000ff'
                        },
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'blendModeMenu'
                        }
                    },
                    doc: {
                        description: 'Blend two hex colors using a blend mode (multiply, screen, overlay, difference)',
                        returns: 'A hex color string'
                    }
                },
                '---',
                {
                    opcode: 'timeStopwatchStart',
                    blockType: BlockType.COMMAND,
                    text: 'start stopwatch [ID]',
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'sw1'
                        }
                    },
                    doc: {
                        description: 'Start a named stopwatch'
                    }
                },
                {
                    opcode: 'timeStopwatchStop',
                    blockType: BlockType.REPORTER,
                    text: 'stop stopwatch [ID]',
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'sw1'
                        }
                    },
                    doc: {
                        description: 'Stop a named stopwatch and return elapsed time in ms',
                        returns: 'Elapsed milliseconds'
                    }
                },
                {
                    opcode: 'timeStopwatchLap',
                    blockType: BlockType.REPORTER,
                    text: 'lap time of stopwatch [ID]',
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'sw1'
                        }
                    },
                    doc: {
                        description: 'Get the current lap time of a stopwatch without stopping it',
                        returns: 'Current elapsed milliseconds'
                    }
                },
                {
                    opcode: 'timeCountdown',
                    blockType: BlockType.COMMAND,
                    text: 'start countdown [SECONDS] seconds',
                    arguments: {
                        SECONDS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    },
                    doc: {
                        description: 'Start a countdown timer that emits an event when done'
                    }
                },
                '---',
                {
                    opcode: 'systemArchitecture',
                    blockType: BlockType.REPORTER,
                    text: 'system architecture',
                    doc: {
                        description: 'Get the system platform/architecture from navigator.platform',
                        returns: 'Platform string or unknown'
                    }
                },
                {
                    opcode: 'systemMemory',
                    blockType: BlockType.REPORTER,
                    text: 'system memory info',
                    doc: {
                        description: 'Get system memory information from performance.memory',
                        returns: 'JSON object or unavailable'
                    }
                },
                {
                    opcode: 'systemGPU',
                    blockType: BlockType.REPORTER,
                    text: 'system GPU info',
                    doc: {
                        description: 'Get GPU information from WebGL context',
                        returns: 'GPU renderer string or unavailable'
                    }
                },
                {
                    opcode: 'systemBattery',
                    blockType: BlockType.REPORTER,
                    text: 'system battery info',
                    doc: {
                        description: 'Get battery information from navigator.getBattery()',
                        returns: 'JSON {level, charging, chargingTime, dischargingTime}'
                    }
                },
                {
                    opcode: 'systemLanguage',
                    blockType: BlockType.REPORTER,
                    text: 'system language',
                    doc: {
                        description: 'Get the system language from navigator.language',
                        returns: 'Language string like en-US'
                    }
                },
                {
                    opcode: 'systemTimezone',
                    blockType: BlockType.REPORTER,
                    text: 'system timezone',
                    doc: {
                        description: 'Get the system IANA timezone identifier',
                        returns: 'Timezone string like America/New_York'
                    }
                }
            ],
            menus: {
                systemProps: {
                    acceptReporters: true,
                    items: ['userAgent', 'language', 'platform', 'cookiesEnabled', 'online']
                },
                dateFormats: {
                    acceptReporters: true,
                    items: ['iso', 'date', 'time', 'datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'timestamp']
                },
                dateUnits: {
                    acceptReporters: true,
                    items: ['days', 'months', 'years']
                },
                diffUnits: {
                    acceptReporters: true,
                    items: ['days', 'hours', 'minutes']
                },
                blendModeMenu: {
                    acceptReporters: true,
                    items: ['multiply', 'screen', 'overlay', 'difference']
                }
            }
        };
    }

    systemInfo (args) {
        try {
            if (!args) return '';
            const prop = Cast.toString(args.PROP);
            switch (prop) {
            case 'userAgent':
                return typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent : '';
            case 'language':
                return typeof navigator !== 'undefined' && navigator.language ? navigator.language : '';
            case 'platform':
                return typeof navigator !== 'undefined' && navigator.platform ? navigator.platform : '';
            case 'cookiesEnabled':
                return typeof navigator !== 'undefined' && typeof navigator.cookieEnabled === 'boolean' ?
                    (navigator.cookieEnabled ? 'true' : 'false') : '';
            case 'online':
                return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ?
                    (navigator.onLine ? 'true' : 'false') : '';
            default:
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    screenWidth () {
        try {
            return typeof screen !== 'undefined' && screen.width ? screen.width : 0;
        } catch (e) {
            return 0;
        }
    }

    screenHeight () {
        try {
            return typeof screen !== 'undefined' && screen.height ? screen.height : 0;
        } catch (e) {
            return 0;
        }
    }

    windowWidth () {
        try {
            return typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : 0;
        } catch (e) {
            return 0;
        }
    }

    windowHeight () {
        try {
            return typeof window !== 'undefined' && window.innerHeight ? window.innerHeight : 0;
        } catch (e) {
            return 0;
        }
    }

    dateFormat (args) {
        try {
            if (!args) return '';
            const format = Cast.toString(args.FORMAT);
            const now = new Date();
            switch (format) {
            case 'iso': return now.toISOString();
            case 'date': return now.toLocaleDateString();
            case 'time': return now.toLocaleTimeString();
            case 'datetime': return now.toLocaleString();
            case 'year': return String(now.getFullYear());
            case 'month': return String(now.getMonth() + 1).padStart(2, '0');
            case 'day': return String(now.getDate()).padStart(2, '0');
            case 'hour': return String(now.getHours()).padStart(2, '0');
            case 'minute': return String(now.getMinutes()).padStart(2, '0');
            case 'second': return String(now.getSeconds()).padStart(2, '0');
            case 'timestamp': return String(now.getTime());
            default: return now.toISOString();
            }
        } catch (e) {
            return '';
        }
    }

    dateAdd (args) {
        try {
            if (!args) return '';
            const dateStr = Cast.toString(args.DATE);
            const unit = Cast.toString(args.UNIT);
            const value = Cast.toNumber(args.VALUE);
            if (!dateStr || !isFinite(value)) return '';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            switch (unit) {
            case 'days': d.setDate(d.getDate() + value); break;
            case 'months': d.setMonth(d.getMonth() + value); break;
            case 'years': d.setFullYear(d.getFullYear() + value); break;
            default: return '';
            }
            return d.toISOString();
        } catch (e) {
            return '';
        }
    }

    dateDiff (args) {
        try {
            if (!args) return 0;
            const aStr = Cast.toString(args.A);
            const bStr = Cast.toString(args.B);
            const unit = Cast.toString(args.UNIT);
            if (!aStr || !bStr) return 0;
            const a = new Date(aStr);
            const b = new Date(bStr);
            if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0;
            const msDiff = b.getTime() - a.getTime();
            switch (unit) {
            case 'days': return Math.floor(msDiff / 86400000);
            case 'hours': return Math.floor(msDiff / 3600000);
            case 'minutes': return Math.floor(msDiff / 60000);
            default: return msDiff;
            }
        } catch (e) {
            return 0;
        }
    }

    getRandomColor () {
        try {
            return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        } catch (e) {
            return '#000000';
        }
    }

    getRandomUUID () {
        try {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        } catch (e) {
            return '';
        }
    }

    getBattery () {
        try {
            if (typeof navigator !== 'undefined' && navigator.getBattery) {
                return navigator.getBattery().then(battery => {
                    if (battery && typeof battery.level === 'number') {
                        return Math.round(battery.level * 100);
                    }
                    return -1;
                }).catch(() => -1);
            }
        } catch (e) {
            log.warn('getBattery error:', e);
        }
        return Promise.resolve(-1);
    }

    sensorAccelerometer () {
        try {
            if (typeof DeviceMotionEvent === 'undefined' || typeof window === 'undefined') {
                return '{"x":0,"y":0,"z":0}';
            }
            const handler = (event) => {
                const acc = event.acceleration || {x: 0, y: 0, z: 0};
                return JSON.stringify({x: acc.x, y: acc.y, z: acc.z});
            };
            return new Promise(resolve => {
                if (DeviceMotionEvent.requestPermission) {
                    DeviceMotionEvent.requestPermission().then(perm => {
                        if (perm === 'granted') {
                            window.addEventListener('devicemotion', function onMotion(e) {
                                window.removeEventListener('devicemotion', onMotion);
                                resolve(handler(e));
                            }, {once: true});
                        } else {
                            resolve('{"x":0,"y":0,"z":0}');
                        }
                    }).catch(() => resolve('{"x":0,"y":0,"z":0}'));
                } else {
                    window.addEventListener('devicemotion', function onMotion(e) {
                        window.removeEventListener('devicemotion', onMotion);
                        resolve(handler(e));
                    }, {once: true});
                    setTimeout(() => resolve('{"x":0,"y":0,"z":0}'), 1000);
                }
            });
        } catch (e) {
            return Promise.resolve('{"x":0,"y":0,"z":0}');
        }
    }

    sensorGyroscope () {
        try {
            if (typeof DeviceOrientationEvent === 'undefined' || typeof window === 'undefined') {
                return '{"alpha":0,"beta":0,"gamma":0}';
            }
            const handler = (event) => {
                return JSON.stringify({
                    alpha: event.alpha || 0,
                    beta: event.beta || 0,
                    gamma: event.gamma || 0
                });
            };
            return new Promise(resolve => {
                if (DeviceOrientationEvent.requestPermission) {
                    DeviceOrientationEvent.requestPermission().then(perm => {
                        if (perm === 'granted') {
                            window.addEventListener('deviceorientation', function onOrientation(e) {
                                window.removeEventListener('deviceorientation', onOrientation);
                                resolve(handler(e));
                            }, {once: true});
                        } else {
                            resolve('{"alpha":0,"beta":0,"gamma":0}');
                        }
                    }).catch(() => resolve('{"alpha":0,"beta":0,"gamma":0}'));
                } else {
                    window.addEventListener('deviceorientation', function onOrientation(e) {
                        window.removeEventListener('deviceorientation', onOrientation);
                        resolve(handler(e));
                    }, {once: true});
                    setTimeout(() => resolve('{"alpha":0,"beta":0,"gamma":0}'), 1000);
                }
            });
        } catch (e) {
            return Promise.resolve('{"alpha":0,"beta":0,"gamma":0}');
        }
    }

    sensorLight () {
        try {
            if (typeof AmbientLightSensor !== 'undefined') {
                return new Promise(resolve => {
                    try {
                        const sensor = new AmbientLightSensor();
                        sensor.onreading = () => resolve(sensor.illuminance);
                        sensor.onerror = () => resolve(-1);
                        sensor.start();
                        setTimeout(() => resolve(-1), 2000);
                    } catch (e) {
                        resolve(-1);
                    }
                });
            }
        } catch (e) {
            log.warn('sensorLight error:', e);
        }
        return Promise.resolve(-1);
    }

    sensorProximity () {
        try {
            if (typeof ProximitySensor !== 'undefined') {
                return new Promise(resolve => {
                    try {
                        const sensor = new ProximitySensor();
                        sensor.onreading = () => resolve(sensor.distance);
                        sensor.onerror = () => resolve(-1);
                        sensor.start();
                        setTimeout(() => resolve(-1), 2000);
                    } catch (e) {
                        resolve(-1);
                    }
                });
            }
        } catch (e) {
            log.warn('sensorProximity error:', e);
        }
        return Promise.resolve(-1);
    }

    memoryInfo () {
        try {
            if (typeof performance !== 'undefined' && performance.memory) {
                const mem = performance.memory;
                return JSON.stringify({
                    jsHeapSizeLimit: mem.jsHeapSizeLimit,
                    totalJSHeapSize: mem.totalJSHeapSize,
                    usedJSHeapSize: mem.usedJSHeapSize
                });
            }
            return '{}';
        } catch (e) {
            return '{}';
        }
    }

    cpuCores () {
        try {
            if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
                return navigator.hardwareConcurrency;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    maxTouchPoints () {
        try {
            if (typeof navigator !== 'undefined' && typeof navigator.maxTouchPoints === 'number') {
                return navigator.maxTouchPoints;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    colorScheme () {
        try {
            if (typeof window !== 'undefined' && window.matchMedia) {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                return isDark ? 'dark' : 'light';
            }
            return 'light';
        } catch (e) {
            return 'light';
        }
    }

    reducedMotion () {
        try {
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    locale () {
        try {
            if (typeof navigator !== 'undefined' && navigator.language) {
                return navigator.language;
            }
            return 'en-US';
        } catch (e) {
            return 'en-US';
        }
    }

    timezone () {
        try {
            if (typeof Intl !== 'undefined') {
                return Intl.DateTimeFormat().resolvedOptions().timeZone;
            }
            return 'UTC';
        } catch (e) {
            return 'UTC';
        }
    }

    platform () {
        try {
            if (typeof navigator !== 'undefined' && navigator.platform) {
                return navigator.platform;
            }
            return 'unknown';
        } catch (e) {
            return 'unknown';
        }
    }

    isTouchDevice () {
        try {
            return typeof window !== 'undefined' && 'ontouchstart' in window;
        } catch (e) {
            return false;
        }
    }

    isMobileDevice () {
        try {
            if (typeof navigator === 'undefined') return false;
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        } catch (e) {
            return false;
        }
    }

    isAndroid () {
        try {
            if (typeof navigator === 'undefined') return false;
            return /Android/i.test(navigator.userAgent);
        } catch (e) {
            return false;
        }
    }

    isiOS () {
        try {
            if (typeof navigator === 'undefined') return false;
            return /iPhone|iPad|iPod/i.test(navigator.userAgent);
        } catch (e) {
            return false;
        }
    }

    isWindows () {
        try {
            if (typeof navigator === 'undefined') return false;
            return /Windows/i.test(navigator.userAgent);
        } catch (e) {
            return false;
        }
    }

    isMac () {
        try {
            if (typeof navigator === 'undefined') return false;
            return /Mac/i.test(navigator.userAgent) && !/Windows/i.test(navigator.userAgent);
        } catch (e) {
            return false;
        }
    }

    randomHexColor () {
        try {
            return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        } catch (e) {
            return '#000000';
        }
    }

    randomRgbColor () {
        try {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgb(${r},${g},${b})`;
        } catch (e) {
            return 'rgb(0,0,0)';
        }
    }

    randomHslColor () {
        try {
            const h = Math.floor(Math.random() * 361);
            const s = Math.floor(Math.random() * 101);
            const l = Math.floor(Math.random() * 101);
            return `hsl(${h},${s}%,${l}%)`;
        } catch (e) {
            return 'hsl(0,0%,0%)';
        }
    }

    contrastColor (args) {
        if (!args) return '#000000';
        try {
            const hex = Cast.toString(args.HEX).replace('#', '');
            if (hex.length < 6) return '#000000';
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#ffffff';
        } catch (e) {
            return '#000000';
        }
    }

    hexToRgb (args) {
        if (!args) return '{"r":0,"g":0,"b":0}';
        try {
            const hex = Cast.toString(args.HEX).replace('#', '');
            if (hex.length < 6) return '{"r":0,"g":0,"b":0}';
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return JSON.stringify({r, g, b});
        } catch (e) {
            return '{"r":0,"g":0,"b":0}';
        }
    }

    rgbToHex (args) {
        if (!args) return '#000000';
        try {
            const r = Math.max(0, Math.min(255, Math.round(Cast.toNumber(args.R))));
            const g = Math.max(0, Math.min(255, Math.round(Cast.toNumber(args.G))));
            const b = Math.max(0, Math.min(255, Math.round(Cast.toNumber(args.B))));
            return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return '#000000';
        }
    }

    colorBrightness (args) {
        if (!args) return 0;
        try {
            const hex = Cast.toString(args.HEX).replace('#', '');
            if (hex.length < 6) return 0;
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return Math.round((r * 299 + g * 587 + b * 114) / 1000);
        } catch (e) {
            return 0;
        }
    }

    colorRgbToHsl (args) {
        if (!args) return '{"h":0,"s":0,"l":0}';
        try {
            let r = Cast.toNumber(args.R) / 255;
            let g = Cast.toNumber(args.G) / 255;
            let b = Cast.toNumber(args.B) / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0, s = 0, l = (max + min) / 2;
            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                else if (max === g) h = ((b - r) / d + 2) / 6;
                else h = ((r - g) / d + 4) / 6;
            }
            return JSON.stringify({
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            });
        } catch (e) {
            return '{"h":0,"s":0,"l":0}';
        }
    }

    colorHslToRgb (args) {
        if (!args) return '{"r":0,"g":0,"b":0}';
        try {
            let h = Cast.toNumber(args.H) / 360;
            let s = Cast.toNumber(args.S) / 100;
            let l = Cast.toNumber(args.L) / 100;
            if (s === 0) {
                const v = Math.round(l * 255);
                return JSON.stringify({r: v, g: v, b: v});
            }
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            return JSON.stringify({
                r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
                g: Math.round(hue2rgb(p, q, h) * 255),
                b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
            });
        } catch (e) {
            return '{"r":0,"g":0,"b":0}';
        }
    }

    colorRgbToHsv (args) {
        if (!args) return '{"h":0,"s":0,"v":0}';
        try {
            let r = Cast.toNumber(args.R) / 255;
            let g = Cast.toNumber(args.G) / 255;
            let b = Cast.toNumber(args.B) / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0, s = 0, v = max;
            const d = max - min;
            s = max === 0 ? 0 : d / max;
            if (max !== min) {
                if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                else if (max === g) h = ((b - r) / d + 2) / 6;
                else h = ((r - g) / d + 4) / 6;
            }
            return JSON.stringify({
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                v: Math.round(v * 100)
            });
        } catch (e) {
            return '{"h":0,"s":0,"v":0}';
        }
    }

    colorHsvToRgb (args) {
        if (!args) return '{"r":0,"g":0,"b":0}';
        try {
            let h = Cast.toNumber(args.H) / 360;
            let s = Cast.toNumber(args.S) / 100;
            let v = Cast.toNumber(args.V) / 100;
            const i = Math.floor(h * 6);
            const f = h * 6 - i;
            const p = v * (1 - s);
            const q = v * (1 - f * s);
            const t = v * (1 - (1 - f) * s);
            let r = 0, g = 0, b = 0;
            switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
            }
            return JSON.stringify({
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            });
        } catch (e) {
            return '{"r":0,"g":0,"b":0}';
        }
    }

    colorComplementary (args) {
        if (!args) return '#000000';
        try {
            const hex = Cast.toString(args.HEX).replace('#', '');
            if (hex.length < 6) return '#000000';
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const hsv = this._rgbToHsv(r, g, b);
            hsv.h = (hsv.h + 180) % 360;
            const rgb = this._hsvToRgb(hsv.h, hsv.s, hsv.v);
            return '#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return '#000000';
        }
    }

    colorAnalogous (args) {
        if (!args) return '[]';
        try {
            const hex = Cast.toString(args.HEX).replace('#', '');
            if (hex.length < 6) return '[]';
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const hsv = this._rgbToHsv(r, g, b);
            const result = [];
            for (const offset of [-30, 0, 30]) {
                const h = ((hsv.h + offset) % 360 + 360) % 360;
                const rgb = this._hsvToRgb(h, hsv.s, hsv.v);
                result.push('#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join(''));
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    colorTriadic (args) {
        if (!args) return '[]';
        try {
            const hex = Cast.toString(args.HEX).replace('#', '');
            if (hex.length < 6) return '[]';
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const hsv = this._rgbToHsv(r, g, b);
            const result = [];
            for (const offset of [0, 120, 240]) {
                const h = ((hsv.h + offset) % 360 + 360) % 360;
                const rgb = this._hsvToRgb(h, hsv.s, hsv.v);
                result.push('#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join(''));
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    colorTemperature (args) {
        if (!args) return 'neutral';
        try {
            const hex = Cast.toString(args.HEX).replace('#', '');
            if (hex.length < 6) return 'neutral';
            const r = parseInt(hex.slice(0, 2), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            if (r > b + 30) return 'warm';
            if (b > r + 30) return 'cool';
            return 'neutral';
        } catch (e) {
            return 'neutral';
        }
    }

    colorBlendMode (args) {
        if (!args) return '#000000';
        try {
            const c1 = Cast.toString(args.C1).replace('#', '');
            const c2 = Cast.toString(args.C2).replace('#', '');
            const mode = Cast.toString(args.MODE);
            if (c1.length < 6 || c2.length < 6) return '#000000';
            const r1 = parseInt(c1.slice(0, 2), 16) / 255;
            const g1 = parseInt(c1.slice(2, 4), 16) / 255;
            const b1 = parseInt(c1.slice(4, 6), 16) / 255;
            const r2 = parseInt(c2.slice(0, 2), 16) / 255;
            const g2 = parseInt(c2.slice(2, 4), 16) / 255;
            const b2 = parseInt(c2.slice(4, 6), 16) / 255;
            let r = 0, g = 0, b = 0;
            const blend = (a, bVal) => {
                switch (mode) {
                case 'multiply': return a * bVal;
                case 'screen': return 1 - (1 - a) * (1 - bVal);
                case 'overlay': return a < 0.5 ? 2 * a * bVal : 1 - 2 * (1 - a) * (1 - bVal);
                case 'difference': return Math.abs(a - bVal);
                default: return a;
                }
            };
            r = Math.round(blend(r1, r2) * 255);
            g = Math.round(blend(g1, g2) * 255);
            b = Math.round(blend(b1, b2) * 255);
            return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return '#000000';
        }
    }

    timeStopwatchStart (args) {
        if (!args) return;
        try {
            const id = Cast.toString(args.ID);
            this._stopwatches[id] = {start: performance.now(), running: true};
        } catch (e) {
            log.warn('timeStopwatchStart error:', e);
        }
    }

    timeStopwatchStop (args) {
        if (!args) return 0;
        try {
            const id = Cast.toString(args.ID);
            const sw = this._stopwatches[id];
            if (!sw) return 0;
            const elapsed = performance.now() - sw.start;
            delete this._stopwatches[id];
            return elapsed;
        } catch (e) {
            return 0;
        }
    }

    timeStopwatchLap (args) {
        if (!args) return 0;
        try {
            const id = Cast.toString(args.ID);
            const sw = this._stopwatches[id];
            if (!sw || !sw.running) return 0;
            return performance.now() - sw.start;
        } catch (e) {
            return 0;
        }
    }

    timeCountdown (args) {
        if (!args) return;
        try {
            const seconds = Cast.toNumber(args.SECONDS);
            if (!isFinite(seconds) || seconds <= 0) return;
            const ms = seconds * 1000;
            setTimeout(() => {
                if (this.runtime) {
                    this.runtime.startHats('scratchpro_sense_timeCountdownDone');
                }
            }, ms);
        } catch (e) {
            log.warn('timeCountdown error:', e);
        }
    }

    systemArchitecture () {
        try {
            if (typeof navigator !== 'undefined' && navigator.platform) {
                return navigator.platform;
            }
            return 'unknown';
        } catch (e) {
            return 'unknown';
        }
    }

    systemMemory () {
        try {
            if (typeof performance !== 'undefined' && performance.memory) {
                return JSON.stringify({
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    usedJSHeapSize: performance.memory.usedJSHeapSize
                });
            }
            return 'unavailable';
        } catch (e) {
            return 'unavailable';
        }
    }

    systemGPU () {
        try {
            if (typeof document !== 'undefined') {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const ext = gl.getExtension('WEBGL_debug_renderer_info');
                    if (ext) {
                        return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
                    }
                    return gl.getParameter(gl.RENDERER);
                }
            }
            return 'unavailable';
        } catch (e) {
            return 'unavailable';
        }
    }

    systemBattery () {
        try {
            if (typeof navigator !== 'undefined' && navigator.getBattery) {
                return navigator.getBattery().then(battery => {
                    if (battery) {
                        return JSON.stringify({
                            level: battery.level,
                            charging: battery.charging,
                            chargingTime: battery.chargingTime,
                            dischargingTime: battery.dischargingTime
                        });
                    }
                    return 'unavailable';
                }).catch(() => 'unavailable');
            }
        } catch (e) {
            log.warn('systemBattery error:', e);
        }
        return Promise.resolve('unavailable');
    }

    systemLanguage () {
        try {
            if (typeof navigator !== 'undefined' && navigator.language) {
                return navigator.language;
            }
            return 'en-US';
        } catch (e) {
            return 'en-US';
        }
    }

    systemTimezone () {
        try {
            if (typeof Intl !== 'undefined') {
                return Intl.DateTimeFormat().resolvedOptions().timeZone;
            }
            return 'UTC';
        } catch (e) {
            return 'UTC';
        }
    }

    _rgbToHsv (r, g, b) {
        const rf = r / 255, gf = g / 255, bf = b / 255;
        const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
        let h = 0, s = 0, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max !== min) {
            if (max === rf) h = ((gf - bf) / d + (gf < bf ? 6 : 0)) * 60;
            else if (max === gf) h = ((bf - rf) / d + 2) * 60;
            else h = ((rf - gf) / d + 4) * 60;
        }
        return {h: ((h % 360) + 360) % 360, s, v};
    }

    _hsvToRgb (h, s, v) {
        const c = v * s;
        const hp = h / 60;
        const x = c * (1 - Math.abs((hp % 2) - 1));
        let r1 = 0, g1 = 0, b1 = 0;
        if (hp < 1) { r1 = c; g1 = x; }
        else if (hp < 2) { r1 = x; g1 = c; }
        else if (hp < 3) { g1 = c; b1 = x; }
        else if (hp < 4) { g1 = x; b1 = c; }
        else if (hp < 5) { r1 = x; b1 = c; }
        else { r1 = c; b1 = x; }
        const m = v - c;
        return {
            r: Math.round((r1 + m) * 255),
            g: Math.round((g1 + m) * 255),
            b: Math.round((b1 + m) * 255)
        };
    }
}

module.exports = ScratchProSenseBlocks;
