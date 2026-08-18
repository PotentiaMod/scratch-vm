const formatMessage = require('format-message');

const ScratchProI18n = {
    scratchpro: {
        categoryName: () => formatMessage({
            id: 'scratchpro.categoryName',
            default: 'ScratchPro',
            description: 'ScratchPro extension category name'
        }),
        categoryDescription: () => formatMessage({
            id: 'scratchpro.categoryDescription',
            default: 'Advanced blocks: HTTP, JSON, arrays, color, utilities.',
            description: 'ScratchPro extension category description'
        })
    },
    tool: {
        categoryName: () => formatMessage({
            id: 'scratchpro.tool.categoryName',
            default: 'Pro Tools',
            description: 'Pro Tools extension category name'
        }),
        toNumber: () => formatMessage({
            id: 'scratchpro.tool.toNumber',
            default: 'to number [VALUE]',
            description: 'Convert value to number'
        }),
        toString: () => formatMessage({
            id: 'scratchpro.tool.toString',
            default: 'to string [VALUE]',
            description: 'Convert value to string'
        }),
        toBoolean: () => formatMessage({
            id: 'scratchpro.tool.toBoolean',
            default: 'to boolean [VALUE]',
            description: 'Convert value to boolean'
        }),
        typeOf: () => formatMessage({
            id: 'scratchpro.tool.typeOf',
            default: 'type of [VALUE]',
            description: 'Get type of value'
        }),
        consoleLog: () => formatMessage({
            id: 'scratchpro.tool.consoleLog',
            default: 'log [VALUE]',
            description: 'Log value to console'
        }),
        consoleWarn: () => formatMessage({
            id: 'scratchpro.tool.consoleWarn',
            default: 'warn [VALUE]',
            description: 'Log warning to console'
        }),
        consoleError: () => formatMessage({
            id: 'scratchpro.tool.consoleError',
            default: 'error [VALUE]',
            description: 'Log error to console'
        }),
        consoleAssert: () => formatMessage({
            id: 'scratchpro.tool.consoleAssert',
            default: 'assert [TEST] log [VALUE]',
            description: 'Assert test and log if false'
        }),
        ternary: () => formatMessage({
            id: 'scratchpro.tool.ternary',
            default: 'if [CONDITION] then [TRUE_VAL] else [FALSE_VAL]',
            description: 'Ternary conditional'
        }),
        coalesce: () => formatMessage({
            id: 'scratchpro.tool.coalesce',
            default: '[VALUE] ?? [FALLBACK]',
            description: 'Nullish coalescing'
        }),
        sleep: () => formatMessage({
            id: 'scratchpro.tool.sleep',
            default: 'sleep [MS] ms',
            description: 'Sleep for milliseconds'
        }),
        timestamp: () => formatMessage({
            id: 'scratchpro.tool.timestamp',
            default: 'timestamp',
            description: 'Current timestamp'
        }),
        performanceNow: () => formatMessage({
            id: 'scratchpro.tool.performanceNow',
            default: 'performance now',
            description: 'Performance timestamp'
        }),
        objectSet: () => formatMessage({
            id: 'scratchpro.tool.objectSet',
            default: 'set [KEY] of [JSON] to [VALUE]',
            description: 'Set object key'
        }),
        objectKeys: () => formatMessage({
            id: 'scratchpro.tool.objectKeys',
            default: 'keys of [JSON]',
            description: 'Object keys'
        }),
        objectValues: () => formatMessage({
            id: 'scratchpro.tool.objectValues',
            default: 'values of [JSON]',
            description: 'Object values'
        }),
        arrayLength: () => formatMessage({
            id: 'scratchpro.tool.arrayLength',
            default: 'length of [JSON]',
            description: 'Array length'
        }),
        arrayJoin: () => formatMessage({
            id: 'scratchpro.tool.arrayJoin',
            default: 'join [JSON] with [SEPARATOR]',
            description: 'Join array elements'
        })
    },
    text: {
        categoryName: () => formatMessage({
            id: 'scratchpro.text.categoryName',
            default: 'Pro Text',
            description: 'Pro Text extension category name'
        }),
        textToUpper: () => formatMessage({
            id: 'scratchpro.text.toUpper',
            default: 'upper case [TEXT]',
            description: 'Convert text to uppercase'
        }),
        textToLower: () => formatMessage({
            id: 'scratchpro.text.toLower',
            default: 'lower case [TEXT]',
            description: 'Convert text to lowercase'
        }),
        textTrim: () => formatMessage({
            id: 'scratchpro.text.trim',
            default: 'trim [TEXT]',
            description: 'Trim whitespace'
        }),
        textReverse: () => formatMessage({
            id: 'scratchpro.text.reverse',
            default: 'reverse [TEXT]',
            description: 'Reverse string'
        }),
        textPadStart: () => formatMessage({
            id: 'scratchpro.text.padStart',
            default: 'pad [TEXT] start to length [LEN] with [CHAR]',
            description: 'Pad string start'
        }),
        textPadEnd: () => formatMessage({
            id: 'scratchpro.text.padEnd',
            default: 'pad [TEXT] end to length [LEN] with [CHAR]',
            description: 'Pad string end'
        }),
        textSplit: () => formatMessage({
            id: 'scratchpro.text.split',
            default: 'split [TEXT] by [SEP]',
            description: 'Split string by separator'
        }),
        textSlice: () => formatMessage({
            id: 'scratchpro.text.slice',
            default: 'slice [TEXT] from [START] to [END]',
            description: 'Slice string'
        }),
        textSubstring: () => formatMessage({
            id: 'scratchpro.text.substring',
            default: 'substring [TEXT] from [START] length [LEN]',
            description: 'Substring'
        }),
        textReplace: () => formatMessage({
            id: 'scratchpro.text.replace',
            default: 'replace [PATTERN] in [TEXT] with [REPLACEMENT]',
            description: 'Replace first match'
        }),
        textReplaceAll: () => formatMessage({
            id: 'scratchpro.text.replaceAll',
            default: 'replace all [PATTERN] in [TEXT] with [REPLACEMENT]',
            description: 'Replace all matches'
        }),
        textRepeat: () => formatMessage({
            id: 'scratchpro.text.repeat',
            default: 'repeat [TEXT] [TIMES] times',
            description: 'Repeat string'
        }),
        textIndexOf: () => formatMessage({
            id: 'scratchpro.text.indexOf',
            default: 'index of [SEARCH] in [TEXT]',
            description: 'Find index of substring'
        }),
        textIncludes: () => formatMessage({
            id: 'scratchpro.text.includes',
            default: '[TEXT] includes [SEARCH]?',
            description: 'Check if text includes substring'
        }),
        textStartsWith: () => formatMessage({
            id: 'scratchpro.text.startsWith',
            default: '[TEXT] starts with [SEARCH]?',
            description: 'Check if text starts with'
        }),
        textEndsWith: () => formatMessage({
            id: 'scratchpro.text.endsWith',
            default: '[TEXT] ends with [SEARCH]?',
            description: 'Check if text ends with'
        }),
        textCharCodeAt: () => formatMessage({
            id: 'scratchpro.text.charCodeAt',
            default: 'char code at [INDEX] in [TEXT]',
            description: 'Get char code'
        }),
        textFromCharCode: () => formatMessage({
            id: 'scratchpro.text.fromCharCode',
            default: 'letter with char code [CODE]',
            description: 'Create char from code'
        }),
        textRegexTest: () => formatMessage({
            id: 'scratchpro.text.regexTest',
            default: '[TEXT] matches regex [REGEX]?',
            description: 'Test regex match'
        }),
        textRegexMatch: () => formatMessage({
            id: 'scratchpro.text.regexMatch',
            default: 'regex match [REGEX] in [TEXT]',
            description: 'Get regex matches'
        }),
        textRegexReplace: () => formatMessage({
            id: 'scratchpro.text.regexReplace',
            default: 'regex replace [REGEX] in [TEXT] with [REPLACEMENT]',
            description: 'Replace with regex'
        }),
        textConcat: () => formatMessage({
            id: 'scratchpro.text.concat',
            default: 'join [A] and [B]',
            description: 'Concatenate strings'
        }),
        textInterpolate: () => formatMessage({
            id: 'scratchpro.text.interpolate',
            default: 'template [TEMPLATE] with {0} [A] {1} [B] {2} [C]',
            description: 'String interpolation'
        }),
        textEscapeHTML: () => formatMessage({
            id: 'scratchpro.text.escapeHTML',
            default: 'escape HTML [TEXT]',
            description: 'Escape HTML entities'
        }),
        textUnescapeHTML: () => formatMessage({
            id: 'scratchpro.text.unescapeHTML',
            default: 'unescape HTML [TEXT]',
            description: 'Unescape HTML entities'
        })
    },
    math: {
        categoryName: () => formatMessage({
            id: 'scratchpro.math.categoryName',
            default: 'Pro Math',
            description: 'Pro Math extension category name'
        }),
        mathClamp: () => formatMessage({
            id: 'scratchpro.math.clamp',
            default: 'clamp [VALUE] between [MIN] and [MAX]',
            description: 'Clamp value between min and max'
        }),
        mathMap: () => formatMessage({
            id: 'scratchpro.math.map',
            default: 'map [VALUE] from [FROM_MIN]..[FROM_MAX] to [TO_MIN]..[TO_MAX]',
            description: 'Map value from one range to another'
        }),
        mathLerp: () => formatMessage({
            id: 'scratchpro.math.lerp',
            default: 'lerp [A] to [B] by [T]',
            description: 'Linear interpolation'
        }),
        mathRoundTo: () => formatMessage({
            id: 'scratchpro.math.roundTo',
            default: 'round [VALUE] to [DECIMALS] decimals',
            description: 'Round to decimal places'
        }),
        mathFloor: () => formatMessage({
            id: 'scratchpro.math.floor',
            default: 'floor [VALUE]',
            description: 'Floor value'
        }),
        mathCeil: () => formatMessage({
            id: 'scratchpro.math.ceil',
            default: 'ceil [VALUE]',
            description: 'Ceiling value'
        }),
        mathSign: () => formatMessage({
            id: 'scratchpro.math.sign',
            default: 'sign of [VALUE]',
            description: 'Sign of value'
        }),
        mathSum: () => formatMessage({
            id: 'scratchpro.math.sum',
            default: '[A] + [B]',
            description: 'Sum two numbers'
        }),
        mathMin: () => formatMessage({
            id: 'scratchpro.math.min',
            default: 'min of [A] and [B]',
            description: 'Minimum of two numbers'
        }),
        mathMax: () => formatMessage({
            id: 'scratchpro.math.max',
            default: 'max of [A] and [B]',
            description: 'Maximum of two numbers'
        }),
        mathAverage: () => formatMessage({
            id: 'scratchpro.math.average',
            default: 'average of list [LIST]',
            description: 'Average of list'
        }),
        mathMedian: () => formatMessage({
            id: 'scratchpro.math.median',
            default: 'median of list [LIST]',
            description: 'Median of list'
        }),
        mathRandomInt: () => formatMessage({
            id: 'scratchpro.math.randomInt',
            default: 'random int from [MIN] to [MAX]',
            description: 'Random integer in range'
        }),
        mathIsPrime: () => formatMessage({
            id: 'scratchpro.math.isPrime',
            default: 'is [VALUE] prime?',
            description: 'Check if prime'
        }),
        mathFactorial: () => formatMessage({
            id: 'scratchpro.math.factorial',
            default: 'factorial of [VALUE]',
            description: 'Factorial'
        }),
        mathGCD: () => formatMessage({
            id: 'scratchpro.math.gcd',
            default: 'gcd of [A] and [B]',
            description: 'Greatest common divisor'
        }),
        mathLCM: () => formatMessage({
            id: 'scratchpro.math.lcm',
            default: 'lcm of [A] and [B]',
            description: 'Least common multiple'
        }),
        mathDegToRad: () => formatMessage({
            id: 'scratchpro.math.degToRad',
            default: '[DEG] degrees to radians',
            description: 'Degrees to radians'
        }),
        mathRadToDeg: () => formatMessage({
            id: 'scratchpro.math.radToDeg',
            default: '[RAD] radians to degrees',
            description: 'Radians to degrees'
        }),
        mathLog: () => formatMessage({
            id: 'scratchpro.math.log',
            default: 'log base [BASE] of [VALUE]',
            description: 'Logarithm with base'
        }),
        mathHypot: () => formatMessage({
            id: 'scratchpro.math.hypot',
            default: 'hypotenuse of [A] and [B]',
            description: 'Hypotenuse'
        })
    },
    data: {
        categoryName: () => formatMessage({
            id: 'scratchpro.data.categoryName',
            default: 'Pro Data',
            description: 'Pro Data extension category name'
        }),
        arrayFromJSON: () => formatMessage({
            id: 'scratchpro.data.arrayFromJSON',
            default: 'array from JSON [JSON]',
            description: 'Create array from JSON'
        }),
        arrayFromRange: () => formatMessage({
            id: 'scratchpro.data.arrayFromRange',
            default: 'array from [START] to [END]',
            description: 'Create array from range'
        }),
        arrayMap: () => formatMessage({
            id: 'scratchpro.data.arrayMap',
            default: 'map [LIST] with [TRANSFORM]',
            description: 'Map array with function'
        }),
        arrayFilter: () => formatMessage({
            id: 'scratchpro.data.arrayFilter',
            default: 'filter [LIST] where [PREDICATE]',
            description: 'Filter array'
        }),
        arraySort: () => formatMessage({
            id: 'scratchpro.data.arraySort',
            default: 'sort [LIST]',
            description: 'Sort array'
        }),
        arrayReverse: () => formatMessage({
            id: 'scratchpro.data.arrayReverse',
            default: 'reverse [LIST]',
            description: 'Reverse array'
        }),
        arrayFlatten: () => formatMessage({
            id: 'scratchpro.data.arrayFlatten',
            default: 'flatten [LIST]',
            description: 'Flatten nested arrays'
        }),
        dictCreate: () => formatMessage({
            id: 'scratchpro.data.dictCreate',
            default: 'create empty dict',
            description: 'Create empty dictionary'
        }),
        dictSet: () => formatMessage({
            id: 'scratchpro.data.dictSet',
            default: 'set [KEY] = [VALUE] in [DICT]',
            description: 'Set dictionary key'
        }),
        dictGet: () => formatMessage({
            id: 'scratchpro.data.dictGet',
            default: 'get [KEY] from [DICT]',
            description: 'Get dictionary value'
        }),
        dictHas: () => formatMessage({
            id: 'scratchpro.data.dictHas',
            default: 'does [DICT] have [KEY]?',
            description: 'Check dictionary key'
        }),
        dictDelete: () => formatMessage({
            id: 'scratchpro.data.dictDelete',
            default: 'delete [KEY] from [DICT]',
            description: 'Delete dictionary key'
        }),
        dictKeys: () => formatMessage({
            id: 'scratchpro.data.dictKeys',
            default: 'keys of [DICT]',
            description: 'Dictionary keys'
        }),
        dictMerge: () => formatMessage({
            id: 'scratchpro.data.dictMerge',
            default: 'merge [A] with [B]',
            description: 'Merge dictionaries'
        }),
        dataParseCSV: () => formatMessage({
            id: 'scratchpro.data.parseCSV',
            default: 'parse CSV [CSV]',
            description: 'Parse CSV string'
        }),
        dataParseJSON: () => formatMessage({
            id: 'scratchpro.data.parseJSON',
            default: 'parse JSON [JSON]',
            description: 'Parse JSON string'
        }),
        dataStringify: () => formatMessage({
            id: 'scratchpro.data.stringify',
            default: 'stringify [VALUE]',
            description: 'Stringify value'
        }),
        dataUUID: () => formatMessage({
            id: 'scratchpro.data.uuid',
            default: 'generate UUID',
            description: 'Generate UUID'
        })
    },
    io: {
        categoryName: () => formatMessage({
            id: 'scratchpro.io.categoryName',
            default: 'Pro I/O',
            description: 'Pro I/O extension category name'
        }),
        storageSet: () => formatMessage({
            id: 'scratchpro.io.storageSet',
            default: 'set storage [KEY] to [VALUE]',
            description: 'Set storage item'
        }),
        storageGet: () => formatMessage({
            id: 'scratchpro.io.storageGet',
            default: 'get storage [KEY]',
            description: 'Get storage item'
        }),
        storageRemove: () => formatMessage({
            id: 'scratchpro.io.storageRemove',
            default: 'remove storage [KEY]',
            description: 'Remove storage item'
        }),
        storageClear: () => formatMessage({
            id: 'scratchpro.io.storageClear',
            default: 'clear storage',
            description: 'Clear all storage'
        }),
        storageKeys: () => formatMessage({
            id: 'scratchpro.io.storageKeys',
            default: 'storage keys',
            description: 'Get all storage keys'
        }),
        httpGet: () => formatMessage({
            id: 'scratchpro.io.httpGet',
            default: 'HTTP GET [URL]',
            description: 'HTTP GET request'
        }),
        httpPost: () => formatMessage({
            id: 'scratchpro.io.httpPost',
            default: 'HTTP POST [URL] body [BODY]',
            description: 'HTTP POST request'
        }),
        httpFetch: () => formatMessage({
            id: 'scratchpro.io.httpFetch',
            default: 'HTTP [METHOD] [URL] headers [HEADERS] body [BODY]',
            description: 'Custom HTTP request'
        }),
        encodeURI: () => formatMessage({
            id: 'scratchpro.io.encodeURI',
            default: 'encode URI [TEXT]',
            description: 'URI encode'
        }),
        decodeURI: () => formatMessage({
            id: 'scratchpro.io.decodeURI',
            default: 'decode URI [TEXT]',
            description: 'URI decode'
        }),
        btoa: () => formatMessage({
            id: 'scratchpro.io.btoa',
            default: 'base64 encode [TEXT]',
            description: 'Base64 encode'
        }),
        atob: () => formatMessage({
            id: 'scratchpro.io.atob',
            default: 'base64 decode [TEXT]',
            description: 'Base64 decode'
        }),
        fileSave: () => formatMessage({
            id: 'scratchpro.io.fileSave',
            default: 'save file [NAME] with [CONTENT]',
            description: 'Save file'
        }),
        fileLoad: () => formatMessage({
            id: 'scratchpro.io.fileLoad',
            default: 'load file',
            description: 'Load file'
        }),
        clipboardWrite: () => formatMessage({
            id: 'scratchpro.io.clipboardWrite',
            default: 'copy [TEXT] to clipboard',
            description: 'Copy to clipboard'
        }),
        clipboardRead: () => formatMessage({
            id: 'scratchpro.io.clipboardRead',
            default: 'read clipboard',
            description: 'Read from clipboard'
        }),
        vibrate: () => formatMessage({
            id: 'scratchpro.io.vibrate',
            default: 'vibrate [MS] ms',
            description: 'Vibrate device'
        }),
        openURL: () => formatMessage({
            id: 'scratchpro.io.openURL',
            default: 'open URL [URL]',
            description: 'Open URL in browser'
        })
    },
    sense: {
        categoryName: () => formatMessage({
            id: 'scratchpro.sense.categoryName',
            default: 'Pro Sense',
            description: 'Pro Sense extension category name'
        }),
        systemInfo: () => formatMessage({
            id: 'scratchpro.sense.systemInfo',
            default: 'system [PROP]',
            description: 'Get system info'
        }),
        screenWidth: () => formatMessage({
            id: 'scratchpro.sense.screenWidth',
            default: 'screen width',
            description: 'Screen width'
        }),
        screenHeight: () => formatMessage({
            id: 'scratchpro.sense.screenHeight',
            default: 'screen height',
            description: 'Screen height'
        }),
        windowWidth: () => formatMessage({
            id: 'scratchpro.sense.windowWidth',
            default: 'window width',
            description: 'Window width'
        }),
        windowHeight: () => formatMessage({
            id: 'scratchpro.sense.windowHeight',
            default: 'window height',
            description: 'Window height'
        }),
        dateFormat: () => formatMessage({
            id: 'scratchpro.sense.dateFormat',
            default: 'date [FORMAT]',
            description: 'Format date'
        }),
        dateAdd: () => formatMessage({
            id: 'scratchpro.sense.dateAdd',
            default: 'add [VALUE] [UNIT] to [DATE]',
            description: 'Add to date'
        }),
        dateDiff: () => formatMessage({
            id: 'scratchpro.sense.dateDiff',
            default: 'difference between [A] and [B] in [UNIT]',
            description: 'Difference between dates'
        }),
        getRandomColor: () => formatMessage({
            id: 'scratchpro.sense.randomColor',
            default: 'random color',
            description: 'Get random color'
        }),
        getRandomUUID: () => formatMessage({
            id: 'scratchpro.sense.randomUUID',
            default: 'random UUID',
            description: 'Generate random UUID'
        }),
        getBattery: () => formatMessage({
            id: 'scratchpro.sense.battery',
            default: 'battery level',
            description: 'Get battery level'
        })
    },
    flow: {
        categoryName: () => formatMessage({
            id: 'scratchpro.flow.categoryName',
            default: 'Pro Flow',
            description: 'Pro Flow extension category name'
        }),
        flowRepeat: () => formatMessage({
            id: 'scratchpro.flow.repeat',
            default: 'repeat [N] times with [VALUE]',
            description: 'Repeat action'
        }),
        flowRetry: () => formatMessage({
            id: 'scratchpro.flow.retry',
            default: 'retry [ATTEMPTS] times [ACTION]',
            description: 'Retry action'
        }),
        flowSwitch: () => formatMessage({
            id: 'scratchpro.flow.switch',
            default: 'switch [VALUE] case [CASE1] result [RESULT1] default [DEFAULT]',
            description: 'Switch case'
        }),
        flowDebounce: () => formatMessage({
            id: 'scratchpro.flow.debounce',
            default: 'debounce [MS] ms value [VALUE]',
            description: 'Debounce value'
        }),
        flowRange: () => formatMessage({
            id: 'scratchpro.flow.range',
            default: 'range [START] to [END] step [STEP]',
            description: 'Create range'
        }),
        flowTimes: () => formatMessage({
            id: 'scratchpro.flow.times',
            default: 'times [N]',
            description: 'Times function'
        }),
        flowLoopBreak: () => formatMessage({
            id: 'scratchpro.flow.loopBreak',
            default: 'loop break [VALUE]',
            description: 'Break from loop'
        }),
        compareEq: () => formatMessage({
            id: 'scratchpro.flow.compareEq',
            default: '[A] = [B]',
            description: 'Equality comparison'
        }),
        compareApprox: () => formatMessage({
            id: 'scratchpro.flow.compareApprox',
            default: 'approx [A] = [B] within [EPSILON]',
            description: 'Approximate comparison'
        }),
        compareBetween: () => formatMessage({
            id: 'scratchpro.flow.compareBetween',
            default: '[VALUE] between [MIN] and [MAX]',
            description: 'Between comparison'
        }),
        tryCatch: () => formatMessage({
            id: 'scratchpro.flow.tryCatch',
            default: 'try [TRY_FN] catch [CATCH_RESULT]',
            description: 'Try-catch block'
        }),
        assertThrows: () => formatMessage({
            id: 'scratchpro.flow.assertThrows',
            default: 'assert throws [VALUE]',
            description: 'Assert throws error'
        })
    },
    ai: {
        categoryName: () => formatMessage({
            id: 'scratchpro.ai.categoryName',
            default: 'Pro AI',
            description: 'Pro AI extension category name'
        })
    },
    gfx: {
        categoryName: () => formatMessage({
            id: 'scratchpro.gfx.categoryName',
            default: 'Pro Graphics',
            description: 'Pro Graphics extension category name'
        })
    },
    packager: {
        categoryName: () => formatMessage({
            id: 'scratchpro.packager.categoryName',
            default: 'Pro Packager',
            description: 'Pro Packager extension category name'
        })
    },
    audio: {
        categoryName: () => formatMessage({
            id: 'scratchpro.audio.categoryName',
            default: 'Pro Audio',
            description: 'Pro Audio extension category name'
        })
    },
    game: {
        categoryName: () => formatMessage({
            id: 'scratchpro.game.categoryName',
            default: 'Pro Game',
            description: 'Pro Game extension category name'
        })
    },
    crypto: {
        categoryName: () => formatMessage({
            id: 'scratchpro.crypto.categoryName',
            default: 'Pro Crypto',
            description: 'Pro Crypto extension category name'
        })
    },
    vibecode: {
        categoryName: () => formatMessage({
            id: 'scratchpro.vibecode.categoryName',
            default: 'Vibe Code',
            description: 'Vibe Code extension category name'
        })
    },
    devtool: {
        title: () => formatMessage({
            id: 'scratchpro.devtool.title',
            default: 'ScratchPro DevTool',
            description: 'DevTool window title'
        }),
        runAll: () => formatMessage({
            id: 'scratchpro.devtool.runAll',
            default: 'Run All Tests',
            description: 'Run all tests button'
        }),
        passLabel: () => formatMessage({
            id: 'scratchpro.devtool.pass',
            default: 'PASS',
            description: 'Pass status label'
        }),
        failLabel: () => formatMessage({
            id: 'scratchpro.devtool.fail',
            default: 'FAIL',
            description: 'Fail status label'
        }),
        testCount: () => formatMessage({
            id: 'scratchpro.devtool.testCount',
            default: 'Tested: {count}',
            description: 'Test count'
        }),
        passCount: () => formatMessage({
            id: 'scratchpro.devtool.passCount',
            default: 'Passed: {pass}',
            description: 'Pass count'
        }),
        failCount: () => formatMessage({
            id: 'scratchpro.devtool.failCount',
            default: 'Failed: {fail}',
            description: 'Fail count'
        }),
        console: () => formatMessage({
            id: 'scratchpro.devtool.console',
            default: 'Console',
            description: 'Console tab label'
        })
    },
    menu: {
        plugins: () => formatMessage({
            id: 'scratchpro.menu.plugins',
            default: 'Plugins',
            description: 'Plugins menu label'
        }),
        pluginsManage: () => formatMessage({
            id: 'scratchpro.menu.pluginsManage',
            default: 'Manage Plugins',
            description: 'Manage plugins menu item'
        }),
        pluginsStore: () => formatMessage({
            id: 'scratchpro.menu.pluginsStore',
            default: 'Plugin Store',
            description: 'Plugin store menu item'
        })
    }
};

module.exports = ScratchProI18n;
