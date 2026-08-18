const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class ScratchProToolBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'scratchproTool',
            name: 'ScratchPro Tool',
            color1: '#0FBD8C',
            color2: '#0DA57A',
            color3: '#0B8E69',
            blocks: [
                {
                    opcode: 'toNumber',
                    blockType: BlockType.REPORTER,
                    text: 'to number [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '42'
                        }
                    },
                    doc: {
                        description: 'Converts a value to a number. Returns 0 if the value cannot be converted.',
                        example: 'to number "42" returns 42.',
                        returns: 'the numeric representation of the input'
                    }
                },
                {
                    opcode: 'toString',
                    blockType: BlockType.REPORTER,
                    text: 'to string [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '123'
                        }
                    },
                    doc: {
                        description: 'Converts a value to its string representation.',
                        example: 'to string 123 returns "123".',
                        returns: 'the string representation of the input'
                    }
                },
                {
                    opcode: 'toBoolean',
                    blockType: BlockType.REPORTER,
                    text: 'to boolean [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        }
                    },
                    doc: {
                        description: 'Converts a value to a boolean (true or false).',
                        example: 'to boolean "true" returns true.',
                        returns: 'the boolean representation of the input'
                    }
                },
                {
                    opcode: 'typeOf',
                    blockType: BlockType.REPORTER,
                    text: 'type of [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Returns the type of a value as a string: "number", "boolean", "string", "object", or "undefined".',
                        example: 'type of "hello" returns "string".',
                        returns: 'the type name as a string'
                    }
                },
                '---',
                {
                    opcode: 'consoleLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Logs a value to the browser\'s developer console with an info level.',
                        example: 'log "hello" prints hello in the console.'
                    }
                },
                {
                    opcode: 'consoleWarn',
                    blockType: BlockType.COMMAND,
                    text: 'warn [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'warning'
                        }
                    },
                    doc: {
                        description: 'Logs a warning message to the browser\'s developer console.',
                        example: 'warn "something is off" prints a warning in the console.'
                    }
                },
                {
                    opcode: 'consoleError',
                    blockType: BlockType.COMMAND,
                    text: 'error [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'error'
                        }
                    },
                    doc: {
                        description: 'Logs an error message to the browser\'s developer console.',
                        example: 'error "something broke" prints an error in the console.'
                    }
                },
                {
                    opcode: 'consoleAssert',
                    blockType: BlockType.COMMAND,
                    text: 'assert [TEST] log [VALUE]',
                    arguments: {
                        TEST: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: true
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'test failed'
                        }
                    },
                    doc: {
                        description: 'Logs a message to the console if the test condition is false. Useful for debugging assertions.',
                        example: 'assert false log "test failed" prints "Assertion failed: test failed".'
                    }
                },
                '---',
                {
                    opcode: 'ternary',
                    blockType: BlockType.REPORTER,
                    text: 'if [CONDITION] then [TRUE_VAL] else [FALSE_VAL]',
                    arguments: {
                        CONDITION: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: true
                        },
                        TRUE_VAL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'yes'
                        },
                        FALSE_VAL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'no'
                        }
                    },
                    doc: {
                        description: 'Returns one of two values depending on whether the condition is true or false. A conditional (ternary) operator.',
                        example: 'if true then "yes" else "no" returns "yes".',
                        returns: 'the true value if the condition is true, otherwise the false value'
                    }
                },
                {
                    opcode: 'coalesce',
                    blockType: BlockType.REPORTER,
                    text: '[VALUE] ?? [FALLBACK]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        },
                        FALLBACK: {
                            type: ArgumentType.STRING,
                            defaultValue: 'default'
                        }
                    },
                    doc: {
                        description: 'Returns the first value if it is not empty, otherwise returns the fallback value. The nullish coalescing operator.',
                        example: '"" ?? "default" returns "default".',
                        returns: 'the first value if non-empty, otherwise the fallback'
                    }
                },
                {
                    opcode: 'sleep',
                    blockType: BlockType.COMMAND,
                    text: 'sleep [MS] ms',
                    arguments: {
                        MS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    },
                    doc: {
                        description: 'Pauses the script for a specified number of milliseconds.',
                        example: 'sleep 1000 ms pauses the script for 1 second.'
                    }
                },
                {
                    opcode: 'timestamp',
                    blockType: BlockType.REPORTER,
                    text: 'timestamp',
                    disableMonitor: false,
                    doc: {
                        description: 'Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch).',
                        returns: 'the current timestamp as a number'
                    }
                },
                {
                    opcode: 'performanceNow',
                    blockType: BlockType.REPORTER,
                    text: 'performance now',
                    disableMonitor: false,
                    doc: {
                        description: 'Returns a high-resolution timestamp in milliseconds since the page was loaded.',
                        returns: 'the high-resolution time as a number'
                    }
                },
                '---',
                {
                    opcode: 'objectSet',
                    blockType: BlockType.REPORTER,
                    text: 'set [KEY] of [JSON] to [VALUE]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
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
                        description: 'Sets a key-value pair in a JSON object and returns the updated object as a JSON string.',
                        example: 'set "name" of \'{}\' to "Alice" returns \'{"name":"Alice"}\'.',
                        returns: 'the updated JSON object as a string'
                    }
                },
                {
                    opcode: 'objectKeys',
                    blockType: BlockType.REPORTER,
                    text: 'keys of [JSON]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"a":1,"b":2}'
                        }
                    },
                    doc: {
                        description: 'Returns an array of the keys in a JSON object as a JSON string.',
                        example: 'keys of \'{"a":1,"b":2}\' returns \'["a","b"]\'.',
                        returns: 'a JSON string array of the object\'s keys'
                    }
                },
                {
                    opcode: 'objectValues',
                    blockType: BlockType.REPORTER,
                    text: 'values of [JSON]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"a":1,"b":2}'
                        }
                    },
                    doc: {
                        description: 'Returns an array of the values in a JSON object as a JSON string.',
                        example: 'values of \'{"a":1,"b":2}\' returns \'[1,2]\'.',
                        returns: 'a JSON string array of the object\'s values'
                    }
                },
                {
                    opcode: 'arrayLength',
                    blockType: BlockType.REPORTER,
                    text: 'length of [JSON]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '[1,2,3]'
                        }
                    },
                    doc: {
                        description: 'Returns the number of elements in a JSON array.',
                        example: 'length of \'[1,2,3]\' returns 3.',
                        returns: 'the length of the array as a number'
                    }
                },
                {
                    opcode: 'arrayJoin',
                    blockType: BlockType.REPORTER,
                    text: 'join [JSON] with [SEPARATOR]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '["a","b","c"]'
                        },
                        SEPARATOR: {
                            type: ArgumentType.STRING,
                            defaultValue: ', '
                        }
                    },
                    doc: {
                        description: 'Joins all elements of a JSON array into a single string using the specified separator.',
                        example: 'join \'["a","b","c"]\' with ", " returns "a, b, c".',
                        returns: 'the joined string'
                    }
                }
            ]
        };
    }

    toNumber (args) {
        try {
            if (!args || args.VALUE === undefined || args.VALUE === null) return 0;
            const num = Cast.toNumber(args.VALUE);
            return isNaN(num) ? 0 : num;
        } catch (e) {
            return 0;
        }
    }

    toString (args) {
        try {
            if (!args || args.VALUE === undefined || args.VALUE === null) return '';
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    toBoolean (args) {
        try {
            if (!args || args.VALUE === undefined || args.VALUE === null) return false;
            return Cast.toBoolean(args.VALUE);
        } catch (e) {
            return false;
        }
    }

    typeOf (args) {
        try {
            if (!args || args.VALUE === undefined || args.VALUE === null) return 'undefined';
            const val = args.VALUE;
            if (typeof val === 'number') return 'number';
            if (typeof val === 'boolean') return 'boolean';
            if (typeof val === 'string') {
                const num = Cast.toNumber(val);
                if (!isNaN(num) && Cast.toString(num) === val) return 'number';
                const lower = val.toLowerCase();
                if (lower === 'true' || lower === 'false') return 'boolean';
                return 'string';
            }
            if (typeof val === 'object') return 'object';
            return typeof val;
        } catch (e) {
            return 'undefined';
        }
    }

    consoleLog (args) {
        try {
            if (!args) return;
            const value = Cast.toString(args.VALUE);
            log.info(`[Tool] ${value}`);
        } catch (e) {
            // silent
        }
    }

    consoleWarn (args) {
        try {
            if (!args) return;
            const value = Cast.toString(args.VALUE);
            log.warn(`[Tool] ${value}`);
        } catch (e) {
            // silent
        }
    }

    consoleError (args) {
        try {
            if (!args) return;
            const value = Cast.toString(args.VALUE);
            log.error(`[Tool] ${value}`);
        } catch (e) {
            // silent
        }
    }

    consoleAssert (args) {
        try {
            if (!args) return;
            const test = Cast.toBoolean(args.TEST);
            if (!test) {
                const value = Cast.toString(args.VALUE);
                log.warn(`[Tool] Assertion failed: ${value}`);
            }
        } catch (e) {
            // silent
        }
    }

    ternary (args) {
        try {
            if (!args) return '';
            const condition = Cast.toBoolean(args.CONDITION);
            return condition ? Cast.toString(args.TRUE_VAL) : Cast.toString(args.FALSE_VAL);
        } catch (e) {
            return '';
        }
    }

    coalesce (args) {
        try {
            if (!args) return '';
            const value = Cast.toString(args.VALUE);
            return value || Cast.toString(args.FALLBACK);
        } catch (e) {
            return '';
        }
    }

    sleep (args, util) {
        try {
            if (!args || !util) return;
            const ms = Cast.toNumber(args.MS);
            if (isNaN(ms) || ms <= 0) return;
            if (typeof util.stackFrame.sleepMs === 'undefined') {
                util.stackFrame.sleepMs = ms;
            }
            if (util.stackFrame.sleepMs > 0) {
                util.stackFrame.sleepMs -= util.stackFrame.timer ?
                    Date.now() - util.stackFrame.timer :
                    0;
                util.stackFrame.timer = Date.now();
                if (util.stackFrame.sleepMs > 0) {
                    util.yield();
                }
            }
        } catch (e) {
            // silent
        }
    }

    timestamp () {
        try {
            return Date.now();
        } catch (e) {
            return 0;
        }
    }

    performanceNow () {
        try {
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                return performance.now();
            }
            return Date.now();
        } catch (e) {
            return 0;
        }
    }

    objectSet (args) {
        try {
            if (!args) return '{}';
            const jsonStr = Cast.toString(args.JSON);
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            const obj = jsonStr ? JSON.parse(jsonStr) : {};
            if (typeof obj !== 'object' || obj === null) return '{}';
            obj[key] = value;
            return JSON.stringify(obj);
        } catch (e) {
            return '{}';
        }
    }

    objectKeys (args) {
        try {
            if (!args) return '[]';
            const jsonStr = Cast.toString(args.JSON);
            if (!jsonStr) return '[]';
            const obj = JSON.parse(jsonStr);
            if (typeof obj !== 'object' || obj === null) return '[]';
            return JSON.stringify(Object.keys(obj));
        } catch (e) {
            return '[]';
        }
    }

    objectValues (args) {
        try {
            if (!args) return '[]';
            const jsonStr = Cast.toString(args.JSON);
            if (!jsonStr) return '[]';
            const obj = JSON.parse(jsonStr);
            if (typeof obj !== 'object' || obj === null) return '[]';
            return JSON.stringify(Object.values(obj));
        } catch (e) {
            return '[]';
        }
    }

    arrayLength (args) {
        try {
            if (!args) return 0;
            const jsonStr = Cast.toString(args.JSON);
            if (!jsonStr) return 0;
            const arr = JSON.parse(jsonStr);
            if (!Array.isArray(arr)) return 0;
            return arr.length;
        } catch (e) {
            return 0;
        }
    }

    arrayJoin (args) {
        try {
            if (!args) return '';
            const jsonStr = Cast.toString(args.JSON);
            const separator = Cast.toString(args.SEPARATOR);
            if (!jsonStr) return '';
            const arr = JSON.parse(jsonStr);
            if (!Array.isArray(arr)) return '';
            return arr.join(separator);
        } catch (e) {
            return '';
        }
    }
}

module.exports = ScratchProToolBlocks;
