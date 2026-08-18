const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iI0ZGRkYwMCIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCI+RjwvdGV4dD48L3N2Zz4=';

class ScratchProFlowBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._memoCache = {};
        this._counters = {};
    }

    getInfo () {
        return {
            id: 'scratchpro_flow',
            name: 'ScratchPro Flow',
            blockIconURI: blockIconURI,
            color1: '#FFBF00',
            color2: '#DBA800',
            color3: '#B89100',
            blocks: [
                {
                    opcode: 'flowRepeat',
                    blockType: BlockType.REPORTER,
                    text: 'repeat [N] times with [VALUE]',
                    arguments: {
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'item'
                        }
                    },
                    doc: {
                        description: 'Create a JSON array with VALUE repeated N times',
                        returns: 'A JSON array string'
                    }
                },
                {
                    opcode: 'flowRetry',
                    blockType: BlockType.COMMAND,
                    text: 'retry [ATTEMPTS] times [ACTION]',
                    arguments: {
                        ATTEMPTS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        },
                        ACTION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'try'
                        }
                    },
                    doc: {
                        description: 'Retry ACTION up to ATTEMPTS times, logging each attempt'
                    }
                },
                {
                    opcode: 'flowSwitch',
                    blockType: BlockType.REPORTER,
                    text: 'switch [VALUE] case [CASE1] result [RESULT1] default [DEFAULT]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a'
                        },
                        CASE1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a'
                        },
                        RESULT1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'matched'
                        },
                        DEFAULT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'default'
                        }
                    },
                    doc: {
                        description: 'Return RESULT1 if VALUE matches CASE1, otherwise return DEFAULT',
                        returns: 'The matched case result or default'
                    }
                },
                {
                    opcode: 'flowDebounce',
                    blockType: BlockType.REPORTER,
                    text: 'debounce [MS] ms value [VALUE]',
                    arguments: {
                        MS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 300
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        }
                    },
                    doc: {
                        description: 'Return VALUE after debouncing for MS milliseconds',
                        returns: 'The debounced value'
                    }
                },
                '---',
                {
                    opcode: 'flowRange',
                    blockType: BlockType.REPORTER,
                    text: 'range [START] to [END] step [STEP]',
                    arguments: {
                        START: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        END: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        STEP: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Generate a list of numbers from START to END with STEP increment',
                        returns: 'A JSON array of numbers'
                    }
                },
                {
                    opcode: 'flowTimes',
                    blockType: BlockType.REPORTER,
                    text: 'times [N]',
                    arguments: {
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    },
                    doc: {
                        description: 'Generate a JSON array of indices from 0 to N-1',
                        returns: 'A JSON array of indices'
                    }
                },
                {
                    opcode: 'flowLoopBreak',
                    blockType: BlockType.REPORTER,
                    text: 'loop break [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    },
                    doc: {
                        description: 'Act as a break signal in a loop, returning VALUE',
                        returns: 'The value passed in'
                    }
                },
                '---',
                {
                    opcode: 'compareEq',
                    blockType: BlockType.BOOLEAN,
                    text: '[A] = [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a'
                        }
                    },
                    doc: {
                        description: 'Check if A equals B',
                        returns: 'true if equal, false otherwise'
                    }
                },
                {
                    opcode: 'compareApprox',
                    blockType: BlockType.BOOLEAN,
                    text: 'approx [A] = [B] within [EPSILON]',
                    arguments: {
                        A: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1.001
                        },
                        EPSILON: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.01
                        }
                    },
                    doc: {
                        description: 'Check if A is approximately equal to B within EPSILON tolerance',
                        returns: 'true if approximately equal, false otherwise'
                    }
                },
                {
                    opcode: 'compareBetween',
                    blockType: BlockType.BOOLEAN,
                    text: '[VALUE] between [MIN] and [MAX]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        },
                        MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    },
                    doc: {
                        description: 'Check if VALUE is between MIN and MAX inclusive',
                        returns: 'true if in range, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'tryCatch',
                    blockType: BlockType.REPORTER,
                    text: 'try [TRY_FN] catch [CATCH_RESULT]',
                    arguments: {
                        TRY_FN: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
                        CATCH_RESULT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'error'
                        }
                    },
                    doc: {
                        description: 'Evaluate TRY_FN and return its result, or return CATCH_RESULT on error',
                        returns: 'Function result or catch value'
                    }
                },
                {
                    opcode: 'assertThrows',
                    blockType: BlockType.BOOLEAN,
                    text: 'assert throws [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    },
                    doc: {
                        description: 'Check if VALUE throws an error when evaluated as JSON',
                        returns: 'true if it throws, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'flowPipeline',
                    blockType: BlockType.REPORTER,
                    text: 'pipeline start [INITIAL] through [FUNCTIONS]',
                    arguments: {
                        INITIAL: {
                            type: ArgumentType.STRING,
                            defaultValue: '5'
                        },
                        FUNCTIONS: {
                            type: ArgumentType.STRING,
                            defaultValue: '["n=>n*2","n=>n+1"]'
                        }
                    },
                    doc: {
                        description: 'Pass INITIAL through a series of functions left-to-right',
                        returns: 'The pipeline result'
                    }
                },
                {
                    opcode: 'flowCompose',
                    blockType: BlockType.REPORTER,
                    text: 'compose [FUNCTIONS] applied to [VALUE]',
                    arguments: {
                        FUNCTIONS: {
                            type: ArgumentType.STRING,
                            defaultValue: '["x=>x+1","x=>x*2"]'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '5'
                        }
                    },
                    doc: {
                        description: 'Apply FUNCTIONS right-to-left to VALUE',
                        returns: 'The composed result'
                    }
                },
                {
                    opcode: 'flowMemoize',
                    blockType: BlockType.REPORTER,
                    text: 'memoize [KEY] = [VALUE]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'myVal'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '42'
                        }
                    },
                    doc: {
                        description: 'Cache VALUE under KEY, returning the cached value on subsequent calls',
                        returns: 'The cached or computed value'
                    }
                },
                {
                    opcode: 'flowMeasuredTime',
                    blockType: BlockType.REPORTER,
                    text: 'time taken to evaluate [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'compute'
                        }
                    },
                    doc: {
                        description: 'Measure the time in milliseconds to evaluate VALUE',
                        returns: 'Elapsed time in milliseconds'
                    }
                },
                {
                    opcode: 'flowWhen',
                    blockType: BlockType.REPORTER,
                    text: 'when [CONDITION] return [VALUE]',
                    arguments: {
                        CONDITION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'result'
                        }
                    },
                    doc: {
                        description: 'Return VALUE if CONDITION is truthy, otherwise return empty string',
                        returns: 'VALUE if truthy, empty string otherwise'
                    }
                },
                '---',
                {
                    opcode: 'flowRetryResult',
                    blockType: BlockType.REPORTER,
                    text: 'retry result [ATTEMPTS] [FN]',
                    arguments: {
                        ATTEMPTS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        },
                        FN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'tryFn'
                        }
                    },
                    doc: {
                        description: 'Format retry information for ATTEMPTS attempts using FN',
                        returns: 'A formatted retry result string'
                    }
                },
                {
                    opcode: 'flowDelay',
                    blockType: BlockType.COMMAND,
                    text: 'delay [MS] ms',
                    arguments: {
                        MS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        }
                    },
                    doc: {
                        description: 'Wait for MS milliseconds before continuing'
                    }
                },
                {
                    opcode: 'flowTimeout',
                    blockType: BlockType.REPORTER,
                    text: 'timeout [MS] ms return [VALUE]',
                    arguments: {
                        MS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Return VALUE after a timeout of MS milliseconds',
                        returns: 'The value returned after the timeout'
                    }
                },
                '---',
                {
                    opcode: 'flowDoTimes',
                    blockType: BlockType.REPORTER,
                    text: 'do [N] times with [VALUE]',
                    arguments: {
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'item'
                        }
                    },
                    doc: {
                        description: 'Generate a JSON array by repeating VALUE N times',
                        returns: 'A JSON array string'
                    }
                },
                {
                    opcode: 'flowAccumulate',
                    blockType: BlockType.REPORTER,
                    text: 'accumulate [INITIAL] + [VALUE]',
                    arguments: {
                        INITIAL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Add INITIAL and VALUE together and return the sum',
                        returns: 'The sum of both numbers'
                    }
                },
                {
                    opcode: 'flowIncrement',
                    blockType: BlockType.REPORTER,
                    text: 'increment [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    doc: {
                        description: 'Increase VALUE by 1 and return the result',
                        returns: 'The incremented number'
                    }
                },
                {
                    opcode: 'flowDecrement',
                    blockType: BlockType.REPORTER,
                    text: 'decrement [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Decrease VALUE by 1 and return the result',
                        returns: 'The decremented number'
                    }
                },
                {
                    opcode: 'flowMultiply',
                    blockType: BlockType.REPORTER,
                    text: '[A] * [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 4
                        }
                    },
                    doc: {
                        description: 'Multiply A by B',
                        returns: 'The product of A and B'
                    }
                },
                {
                    opcode: 'flowDivide',
                    blockType: BlockType.REPORTER,
                    text: '[A] / [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    doc: {
                        description: 'Divide A by B',
                        returns: 'The quotient of A and B'
                    }
                },
                '---',
                {
                    opcode: 'flowMaxList',
                    blockType: BlockType.REPORTER,
                    text: 'max of list [LIST]',
                    arguments: {
                        LIST: {
                            type: ArgumentType.STRING,
                            defaultValue: '[3,7,2,9,5]'
                        }
                    },
                    doc: {
                        description: 'Find the maximum value in a JSON array',
                        returns: 'The maximum number in the list'
                    }
                },
                {
                    opcode: 'flowMinList',
                    blockType: BlockType.REPORTER,
                    text: 'min of list [LIST]',
                    arguments: {
                        LIST: {
                            type: ArgumentType.STRING,
                            defaultValue: '[3,7,2,9,5]'
                        }
                    },
                    doc: {
                        description: 'Find the minimum value in a JSON array',
                        returns: 'The minimum number in the list'
                    }
                },
                {
                    opcode: 'flowSumList',
                    blockType: BlockType.REPORTER,
                    text: 'sum of list [LIST]',
                    arguments: {
                        LIST: {
                            type: ArgumentType.STRING,
                            defaultValue: '[1,2,3,4,5]'
                        }
                    },
                    doc: {
                        description: 'Sum all numbers in a JSON array',
                        returns: 'The total sum of all numbers'
                    }
                },
                '---',
                {
                    opcode: 'flowUnless',
                    blockType: BlockType.REPORTER,
                    text: 'unless [CONDITION] return [VALUE]',
                    arguments: {
                        CONDITION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'result'
                        }
                    },
                    doc: {
                        description: 'Return VALUE if CONDITION is falsy (opposite of when).',
                        returns: 'VALUE if falsy, empty string otherwise'
                    }
                },
                {
                    opcode: 'flowBoth',
                    blockType: BlockType.BOOLEAN,
                    text: '[A] and [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        }
                    },
                    doc: {
                        description: 'Returns true only if both A and B are truthy.',
                        returns: 'true if both truthy, false otherwise'
                    }
                },
                {
                    opcode: 'flowEither',
                    blockType: BlockType.BOOLEAN,
                    text: '[A] or [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false'
                        }
                    },
                    doc: {
                        description: 'Returns true if either A or B is truthy.',
                        returns: 'true if either is truthy, false otherwise'
                    }
                },
                {
                    opcode: 'flowNeither',
                    blockType: BlockType.BOOLEAN,
                    text: 'neither [A] nor [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false'
                        }
                    },
                    doc: {
                        description: 'Returns true only if both A and B are falsy.',
                        returns: 'true if both falsy, false otherwise'
                    }
                },
                {
                    opcode: 'flowXor',
                    blockType: BlockType.BOOLEAN,
                    text: '[A] xor [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false'
                        }
                    },
                    doc: {
                        description: 'Returns true if A and B are different (exclusive or).',
                        returns: 'true if A !== B, false otherwise'
                    }
                },
                {
                    opcode: 'flowNand',
                    blockType: BlockType.BOOLEAN,
                    text: 'nand [A] [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        }
                    },
                    doc: {
                        description: 'Returns true unless both A and B are truthy (negated AND).',
                        returns: 'true if not both truthy, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'flowTernaryShort',
                    blockType: BlockType.REPORTER,
                    text: 'if [COND] then [TRUE_VAL]',
                    arguments: {
                        COND: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        TRUE_VAL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'result'
                        }
                    },
                    doc: {
                        description: 'If COND is truthy, return TRUE_VAL; otherwise return empty string.',
                        returns: 'TRUE_VAL if truthy, empty string otherwise'
                    }
                },
                {
                    opcode: 'flowIsTruthy',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] truthy?',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Check if VALUE is truthy (not empty, false, 0, null, undefined, or NaN).',
                        returns: 'true if truthy, false otherwise'
                    }
                },
                {
                    opcode: 'flowIsFalsy',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] falsy?',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    },
                    doc: {
                        description: 'Check if VALUE is falsy (empty, false, 0, null, undefined, or NaN).',
                        returns: 'true if falsy, false otherwise'
                    }
                },
                {
                    opcode: 'flowIsType',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] of type [TYPE]?',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'typeMenu'
                        }
                    },
                    doc: {
                        description: 'Check the JavaScript type of VALUE.',
                        returns: 'true if VALUE is of the specified type, false otherwise'
                    }
                },
                {
                    opcode: 'flowCoalesceChain',
                    blockType: BlockType.REPORTER,
                    text: 'coalesce [A] || [B] || [C]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'first'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'second'
                        },
                        C: {
                            type: ArgumentType.STRING,
                            defaultValue: 'third'
                        }
                    },
                    doc: {
                        description: 'Return the first truthy value from three options (nullish coalescing chain).',
                        returns: 'The first truthy value, or empty string if none are truthy'
                    }
                },
                {
                    opcode: 'flowNoop',
                    blockType: BlockType.COMMAND,
                    text: 'noop',
                    doc: {
                        description: 'Do nothing. A placeholder block that performs no operation.'
                    }
                },
                {
                    opcode: 'flowIdentity',
                    blockType: BlockType.REPORTER,
                    text: 'identity [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Return VALUE unchanged. Useful for debugging or chaining.',
                        returns: 'The same value that was passed in'
                    }
                },
                {
                    opcode: 'flowConstant',
                    blockType: BlockType.REPORTER,
                    text: 'constant [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'always this'
                        }
                    },
                    doc: {
                        description: 'Always returns the configured VALUE regardless of input. Useful for fixed outputs.',
                        returns: 'The configured constant value'
                    }
                },
                '---',
                {
                    opcode: 'stateMachineCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create state machine initial [INITIAL]',
                    arguments: {
                        INITIAL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'idle'
                        }
                    },
                    doc: {
                        description: 'Create a state machine with an initial state and empty transitions',
                        returns: 'JSON object with state and transitions'
                    }
                },
                {
                    opcode: 'stateMachineAddTransition',
                    blockType: BlockType.REPORTER,
                    text: 'add transition [SM] from [FROM] to [TO] on [EVENT]',
                    arguments: {
                        SM: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
                        FROM: {
                            type: ArgumentType.STRING,
                            defaultValue: 'idle'
                        },
                        TO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'active'
                        },
                        EVENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'start'
                        }
                    },
                    doc: {
                        description: 'Add a transition to a state machine, return updated state machine',
                        returns: 'Updated state machine JSON'
                    }
                },
                {
                    opcode: 'stateMachineSend',
                    blockType: BlockType.REPORTER,
                    text: 'send event [EVENT] to [SM]',
                    arguments: {
                        SM: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
                        EVENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'start'
                        }
                    },
                    doc: {
                        description: 'Send an event to the state machine, transition if valid',
                        returns: 'JSON {state, changed}'
                    }
                },
                {
                    opcode: 'stateMachineCurrent',
                    blockType: BlockType.REPORTER,
                    text: 'current state of [SM]',
                    arguments: {
                        SM: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    },
                    doc: {
                        description: 'Get the current state from a state machine',
                        returns: 'The current state string'
                    }
                },
                '---',
                {
                    opcode: 'flowApplyN',
                    blockType: BlockType.REPORTER,
                    text: 'apply [FN] to [VALUE] [N] times',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x'
                        },
                        FN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x => x'
                        },
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    doc: {
                        description: 'Apply a function N times to a value (conceptual)',
                        returns: 'The value'
                    }
                },
                {
                    opcode: 'flowThrottle',
                    blockType: BlockType.REPORTER,
                    text: 'throttle [VALUE] every [MS] ms',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        },
                        MS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        }
                    },
                    doc: {
                        description: 'Throttle a value by returning it once per interval (placeholder)',
                        returns: 'The value'
                    }
                },
                {
                    opcode: 'flowCounter',
                    blockType: BlockType.REPORTER,
                    text: 'counter [NAME]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'count'
                        }
                    },
                    doc: {
                        description: 'Increment a named counter and return its value',
                        returns: 'The counter value'
                    }
                },
                {
                    opcode: 'flowCounterReset',
                    blockType: BlockType.COMMAND,
                    text: 'reset counter [NAME]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'count'
                        }
                    },
                    doc: {
                        description: 'Reset a named counter to zero'
                    }
                },
                '---',
                {
                    opcode: 'flowImplication',
                    blockType: BlockType.BOOLEAN,
                    text: '[A] implies [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        }
                    },
                    doc: {
                        description: 'Logical implication: if A then B (!A || B)',
                        returns: 'true if implication holds, false otherwise'
                    }
                },
                {
                    opcode: 'flowEquivalence',
                    blockType: BlockType.BOOLEAN,
                    text: '[A] is equivalent to [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        }
                    },
                    doc: {
                        description: 'Logical equivalence: A and B have the same truth value',
                        returns: 'true if equivalent, false otherwise'
                    }
                },
                {
                    opcode: 'flowNOR',
                    blockType: BlockType.BOOLEAN,
                    text: 'nor [A] [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false'
                        }
                    },
                    doc: {
                        description: 'Logical NOR: true only if both A and B are falsy',
                        returns: 'true if both falsy, false otherwise'
                    }
                },
                {
                    opcode: 'flowXNOR',
                    blockType: BlockType.BOOLEAN,
                    text: 'xnor [A] [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true'
                        }
                    },
                    doc: {
                        description: 'Logical XNOR: true if A and B have the same truth value',
                        returns: 'true if same, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'flowCurry',
                    blockType: BlockType.REPORTER,
                    text: 'curry [FN] with [ARG]',
                    arguments: {
                        FN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x => x'
                        },
                        ARG: {
                            type: ArgumentType.STRING,
                            defaultValue: 'val'
                        }
                    },
                    doc: {
                        description: 'Partially apply ARG to FN (conceptual)',
                        returns: 'JSON describing the curried function'
                    }
                },
                {
                    opcode: 'flowPartial',
                    blockType: BlockType.REPORTER,
                    text: 'partial [FN] with args [ARGS]',
                    arguments: {
                        FN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'f'
                        },
                        ARGS: {
                            type: ArgumentType.STRING,
                            defaultValue: '[]'
                        }
                    },
                    doc: {
                        description: 'Partially apply ARGS to FN (conceptual)',
                        returns: 'JSON describing the partial application'
                    }
                },
                {
                    opcode: 'flowTap',
                    blockType: BlockType.REPORTER,
                    text: 'tap [VALUE] into [FN]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        },
                        FN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x => x'
                        }
                    },
                    doc: {
                        description: 'Call FN with VALUE for side effects, then return VALUE',
                        returns: 'The original VALUE'
                    }
                }
            ],
            menus: {
                typeMenu: {
                    acceptReporters: true,
                    items: ['array', 'object', 'string', 'number', 'boolean', 'function']
                }
            }
        };
    }

    flowRepeat (args) {
        try {
            if (!args) return '[]';
            const n = Cast.toNumber(args.N);
            const value = Cast.toString(args.VALUE);
            if (!isFinite(n) || n <= 0) return '[]';
            const count = Math.min(Math.floor(n), 10000);
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(value);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    flowRetry (args) {
        try {
            if (!args) return;
            const attempts = Cast.toNumber(args.ATTEMPTS);
            const action = Cast.toString(args.ACTION);
            if (!isFinite(attempts) || attempts <= 0) return;
            const maxAttempts = Math.min(Math.floor(attempts), 100);
            for (let i = 0; i < maxAttempts; i++) {
                log.info(`[ScratchPro Flow] retry attempt ${i + 1}/${maxAttempts}: ${action}`);
            }
        } catch (e) {
            log.warn('flowRetry error:', e);
        }
    }

    flowSwitch (args) {
        try {
            if (!args) return '';
            const value = Cast.toString(args.VALUE);
            const case1 = Cast.toString(args.CASE1);
            const result1 = Cast.toString(args.RESULT1);
            const defaultVal = Cast.toString(args.DEFAULT);
            return value === case1 ? result1 : defaultVal;
        } catch (e) {
            return '';
        }
    }

    flowDebounce (args) {
        try {
            if (!args) return '';
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    flowRange (args) {
        try {
            if (!args) return '[]';
            const start = Cast.toNumber(args.START);
            const end = Cast.toNumber(args.END);
            const step = Cast.toNumber(args.STEP);
            if (!isFinite(start) || !isFinite(end) || !isFinite(step) || step === 0) return '[]';
            const result = [];
            if (step > 0) {
                for (let i = start; i <= end; i += step) {
                    if (result.length >= 10000) break;
                    result.push(i);
                }
            } else {
                for (let i = start; i >= end; i += step) {
                    if (result.length >= 10000) break;
                    result.push(i);
                }
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    flowTimes (args) {
        try {
            if (!args) return '[]';
            const n = Cast.toNumber(args.N);
            if (!isFinite(n) || n <= 0) return '[]';
            const count = Math.min(Math.floor(n), 10000);
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(i);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    flowLoopBreak (args) {
        try {
            if (!args) return '';
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    compareEq (args) {
        try {
            if (!args) return false;
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            return a === b;
        } catch (e) {
            return false;
        }
    }

    compareApprox (args) {
        try {
            if (!args) return false;
            const a = Cast.toNumber(args.A);
            const b = Cast.toNumber(args.B);
            const eps = Cast.toNumber(args.EPSILON);
            if (!isFinite(a) || !isFinite(b) || !isFinite(eps)) return false;
            return Math.abs(a - b) < eps;
        } catch (e) {
            return false;
        }
    }

    compareBetween (args) {
        try {
            if (!args) return false;
            const value = Cast.toNumber(args.VALUE);
            const min = Cast.toNumber(args.MIN);
            const max = Cast.toNumber(args.MAX);
            if (!isFinite(value) || !isFinite(min) || !isFinite(max)) return false;
            return min <= value && value <= max;
        } catch (e) {
            return false;
        }
    }

    tryCatch (args) {
        try {
            if (!args) return '';
            const tryFn = Cast.toString(args.TRY_FN);
            const catchResult = Cast.toString(args.CATCH_RESULT);
            const fn = new Function('"use strict"; return (' + tryFn + ')')();
            if (typeof fn === 'function') {
                const result = fn();
                return result !== undefined && result !== null ? Cast.toString(result) : '';
            }
            return Cast.toString(fn);
        } catch (e) {
            return Cast.toString(args ? args.CATCH_RESULT : '');
        }
    }

    assertThrows (args) {
        try {
            if (!args) return false;
            const value = Cast.toString(args.VALUE);
            try {
                JSON.parse(value);
                return false;
            } catch (e) {
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    flowPipeline (args) {
        if (!args) return '';
        try {
            let initial = Cast.toString(args.INITIAL);
            const functions = JSON.parse(Cast.toString(args.FUNCTIONS));
            if (!Array.isArray(functions)) return initial;
            let result = initial;
            for (const fnStr of functions) {
                const fn = new Function('x', `return ${fnStr}`);
                result = Cast.toString(fn(result));
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    flowCompose (args) {
        if (!args) return '';
        try {
            const functions = JSON.parse(Cast.toString(args.FUNCTIONS));
            const value = Cast.toString(args.VALUE);
            if (!Array.isArray(functions)) return value;
            let result = value;
            for (let i = functions.length - 1; i >= 0; i--) {
                const fn = new Function('x', `return ${functions[i]}`);
                result = Cast.toString(fn(result));
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    flowMemoize (args) {
        if (!args) return '';
        try {
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            if (key in this._memoCache) {
                return this._memoCache[key];
            }
            this._memoCache[key] = value;
            return value;
        } catch (e) {
            return '';
        }
    }

    flowMeasuredTime (args) {
        if (!args) return 0;
        try {
            const start = performance.now();
            Cast.toString(args.VALUE);
            const end = performance.now();
            return end - start;
        } catch (e) {
            return 0;
        }
    }

    flowWhen (args) {
        if (!args) return '';
        try {
            const condition = Cast.toString(args.CONDITION);
            const value = Cast.toString(args.VALUE);
            const isTruthy = condition !== '' && condition !== 'false' && condition !== '0' && condition !== 'null' && condition !== 'undefined' && condition !== 'NaN';
            return isTruthy ? value : '';
        } catch (e) {
            return '';
        }
    }

    flowRetryResult (args) {
        if (!args) return '';
        try {
            const attempts = Cast.toNumber(args.ATTEMPTS);
            return `attempts:${Math.max(1, Math.floor(attempts))}`;
        } catch (e) {
            return '';
        }
    }

    flowDelay (args) {
        if (!args) return;
        try {
            const ms = Cast.toNumber(args.MS);
            if (!isFinite(ms) || ms <= 0) return;
            return new Promise(resolve => {
                setTimeout(resolve, ms);
            });
        } catch (e) {
            log.warn('flowDelay error:', e);
        }
    }

    flowTimeout (args) {
        if (!args) return '';
        try {
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    flowDoTimes (args) {
        if (!args) return '[]';
        try {
            const n = Cast.toNumber(args.N);
            const value = Cast.toString(args.VALUE);
            if (!isFinite(n) || n <= 0) return '[]';
            const count = Math.min(Math.floor(n), 10000);
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(value);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    flowAccumulate (args) {
        if (!args) return 0;
        try {
            const initial = Cast.toNumber(args.INITIAL);
            const value = Cast.toNumber(args.VALUE);
            return initial + value;
        } catch (e) {
            return 0;
        }
    }

    flowIncrement (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.VALUE) + 1;
        } catch (e) {
            return 0;
        }
    }

    flowDecrement (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.VALUE) - 1;
        } catch (e) {
            return 0;
        }
    }

    flowMultiply (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.A) * Cast.toNumber(args.B);
        } catch (e) {
            return 0;
        }
    }

    flowDivide (args) {
        if (!args) return 0;
        try {
            const b = Cast.toNumber(args.B);
            if (b === 0) return 0;
            return Cast.toNumber(args.A) / b;
        } catch (e) {
            return 0;
        }
    }

    flowMaxList (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const nums = list.map(n => Cast.toNumber(n));
            return Math.max(...nums);
        } catch (e) {
            return 0;
        }
    }

    flowMinList (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const nums = list.map(n => Cast.toNumber(n));
            return Math.min(...nums);
        } catch (e) {
            return 0;
        }
    }

    flowSumList (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const nums = list.map(n => Cast.toNumber(n));
            return nums.reduce((s, n) => s + n, 0);
        } catch (e) {
            return 0;
        }
    }

    flowUnless (args) {
        if (!args) return '';
        try {
            const condition = Cast.toString(args.CONDITION);
            const value = Cast.toString(args.VALUE);
            const isFalsy = condition === '' || condition === 'false' || condition === '0' || condition === 'null' || condition === 'undefined' || condition === 'NaN';
            return isFalsy ? value : '';
        } catch (e) {
            return '';
        }
    }

    flowBoth (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return truthyA && truthyB;
        } catch (e) {
            return false;
        }
    }

    flowEither (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return truthyA || truthyB;
        } catch (e) {
            return false;
        }
    }

    flowNeither (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return !truthyA && !truthyB;
        } catch (e) {
            return false;
        }
    }

    flowXor (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return truthyA !== truthyB;
        } catch (e) {
            return false;
        }
    }

    flowNand (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return !(truthyA && truthyB);
        } catch (e) {
            return false;
        }
    }

    flowTernaryShort (args) {
        if (!args) return '';
        try {
            const cond = Cast.toString(args.COND);
            const trueVal = Cast.toString(args.TRUE_VAL);
            const truthy = cond !== '' && cond !== 'false' && cond !== '0' && cond !== 'null' && cond !== 'undefined' && cond !== 'NaN';
            return truthy ? trueVal : '';
        } catch (e) {
            return '';
        }
    }

    flowIsTruthy (args) {
        if (!args) return false;
        try {
            const value = Cast.toString(args.VALUE);
            return value !== '' && value !== 'false' && value !== '0' && value !== 'null' && value !== 'undefined' && value !== 'NaN';
        } catch (e) {
            return false;
        }
    }

    flowIsFalsy (args) {
        if (!args) return true;
        try {
            const value = Cast.toString(args.VALUE);
            return value === '' || value === 'false' || value === '0' || value === 'null' || value === 'undefined' || value === 'NaN';
        } catch (e) {
            return true;
        }
    }

    flowIsType (args) {
        if (!args) return false;
        try {
            const value = Cast.toString(args.VALUE);
            const type = Cast.toString(args.TYPE);
            let parsed;
            try { parsed = JSON.parse(value); } catch (e) { parsed = value; }
            switch (type) {
            case 'array': return Array.isArray(parsed);
            case 'object': return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
            case 'string': return typeof parsed === 'string';
            case 'number': return typeof parsed === 'number' && isFinite(parsed);
            case 'boolean': return typeof parsed === 'boolean';
            case 'function': return typeof parsed === 'function';
            default: return false;
            }
        } catch (e) {
            return false;
        }
    }

    flowCoalesceChain (args) {
        if (!args) return '';
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const c = Cast.toString(args.C);
            const isTruthy = (v) => v !== '' && v !== 'false' && v !== '0' && v !== 'null' && v !== 'undefined' && v !== 'NaN';
            return isTruthy(a) ? a : isTruthy(b) ? b : isTruthy(c) ? c : '';
        } catch (e) {
            return '';
        }
    }

    flowNoop () {
    }

    flowIdentity (args) {
        if (!args) return '';
        try {
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    flowConstant (args) {
        if (!args) return '';
        try {
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    stateMachineCreate (args) {
        if (!args) return '{"state":"","transitions":{}}';
        try {
            const initial = Cast.toString(args.INITIAL);
            return JSON.stringify({state: initial, transitions: {}});
        } catch (e) {
            return '{"state":"","transitions":{}}';
        }
    }

    stateMachineAddTransition (args) {
        if (!args) return '{}';
        try {
            const sm = JSON.parse(Cast.toString(args.SM));
            const from = Cast.toString(args.FROM);
            const to = Cast.toString(args.TO);
            const event = Cast.toString(args.EVENT);
            if (!sm || typeof sm !== 'object') return '{}';
            if (!sm.transitions) sm.transitions = {};
            sm.transitions[from + ':' + event] = to;
            return JSON.stringify(sm);
        } catch (e) {
            return '{}';
        }
    }

    stateMachineSend (args) {
        if (!args) return '{"state":"","changed":false}';
        try {
            const sm = JSON.parse(Cast.toString(args.SM));
            const event = Cast.toString(args.EVENT);
            if (!sm || typeof sm !== 'object') return '{"state":"","changed":false}';
            const current = sm.state || '';
            const next = sm.transitions && sm.transitions[current + ':' + event];
            if (next !== undefined) {
                sm.state = next;
                return JSON.stringify({state: next, changed: true});
            }
            return JSON.stringify({state: current, changed: false});
        } catch (e) {
            return '{"state":"","changed":false}';
        }
    }

    stateMachineCurrent (args) {
        if (!args) return '';
        try {
            const sm = JSON.parse(Cast.toString(args.SM));
            if (!sm || typeof sm !== 'object') return '';
            return Cast.toString(sm.state || '');
        } catch (e) {
            return '';
        }
    }

    flowApplyN (args) {
        if (!args) return '';
        try {
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    flowThrottle (args) {
        if (!args) return '';
        try {
            return Cast.toString(args.VALUE);
        } catch (e) {
            return '';
        }
    }

    flowCounter (args) {
        if (!args) return 0;
        try {
            const name = Cast.toString(args.NAME);
            if (!this._counters) this._counters = {};
            this._counters[name] = (this._counters[name] || 0) + 1;
            return this._counters[name];
        } catch (e) {
            return 0;
        }
    }

    flowCounterReset (args) {
        if (!args) return;
        try {
            const name = Cast.toString(args.NAME);
            if (this._counters) {
                this._counters[name] = 0;
            }
        } catch (e) {
            log.warn('flowCounterReset error:', e);
        }
    }

    flowImplication (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return !truthyA || truthyB;
        } catch (e) {
            return false;
        }
    }

    flowEquivalence (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return truthyA === truthyB;
        } catch (e) {
            return false;
        }
    }

    flowNOR (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return !truthyA && !truthyB;
        } catch (e) {
            return false;
        }
    }

    flowXNOR (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const truthyA = a !== '' && a !== 'false' && a !== '0' && a !== 'null' && a !== 'undefined' && a !== 'NaN';
            const truthyB = b !== '' && b !== 'false' && b !== '0' && b !== 'null' && b !== 'undefined' && b !== 'NaN';
            return truthyA === truthyB;
        } catch (e) {
            return false;
        }
    }

    flowCurry (args) {
        if (!args) return '{}';
        try {
            const fn = Cast.toString(args.FN);
            const arg = Cast.toString(args.ARG);
            return JSON.stringify({type: 'curry', fn: fn, arg: arg});
        } catch (e) {
            return '{}';
        }
    }

    flowPartial (args) {
        if (!args) return '{}';
        try {
            const fn = Cast.toString(args.FN);
            const fnArgs = Cast.toString(args.ARGS);
            return JSON.stringify({type: 'partial', fn: fn, args: fnArgs});
        } catch (e) {
            return '{}';
        }
    }

    flowTap (args) {
        if (!args) return '';
        try {
            const value = Cast.toString(args.VALUE);
            return value;
        } catch (e) {
            return '';
        }
    }
}

module.exports = ScratchProFlowBlocks;
