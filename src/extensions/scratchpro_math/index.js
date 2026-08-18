const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iI0NGNjNDRiIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPs+JPC90ZXh0Pjwvc3ZnPg==';

const CONSTANTS = {
    PI: Math.PI,
    E: Math.E,
    SQRT2: Math.SQRT2,
    LN2: Math.LN2,
    LN10: Math.LN10,
    PHI: (1 + Math.sqrt(5)) / 2
};

class ScratchProMathBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._seed = Date.now() % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
    }

    _seedRand () {
        this._seed = (this._seed * 16807) % 2147483647;
        return (this._seed - 1) / 2147483646;
    }

    getInfo () {
        return {
            id: 'scratchpromath',
            name: 'Math',
            blockIconURI: blockIconURI,
            color1: '#CF63CF',
            color2: '#A843A8',
            color3: '#8B2E8B',
            blocks: [
                {
                    opcode: 'mathClamp',
                    blockType: BlockType.REPORTER,
                    text: 'clamp [VALUE] between [MIN] and [MAX]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 50},
                        MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: {
                        description: 'Restricts a number to stay within a specified range.',
                        returns: 'number',
                        example: 'clamp 50 between 0 and 100 => 50 | clamp 150 between 0 and 100 => 100',
                        arguments: {
                            VALUE: 'The number to clamp',
                            MIN: 'The lower bound of the range',
                            MAX: 'The upper bound of the range'
                        }
                    }
                },
                {
                    opcode: 'mathMap',
                    blockType: BlockType.REPORTER,
                    text: 'map [VALUE] from [FROM_MIN]..[FROM_MAX] to [TO_MIN]..[TO_MAX]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 50},
                        FROM_MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        FROM_MAX: {type: ArgumentType.NUMBER, defaultValue: 100},
                        TO_MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        TO_MAX: {type: ArgumentType.NUMBER, defaultValue: 200}
                    },
                    doc: {
                        description: 'Re-maps a number from one range to another.',
                        returns: 'number',
                        example: 'map 50 from 0..100 to 0..200 => 100',
                        arguments: {
                            VALUE: 'The value to re-map',
                            FROM_MIN: 'Lower bound of the current range',
                            FROM_MAX: 'Upper bound of the current range',
                            TO_MIN: 'Lower bound of the target range',
                            TO_MAX: 'Upper bound of the target range'
                        }
                    }
                },
                {
                    opcode: 'mathLerp',
                    blockType: BlockType.REPORTER,
                    text: 'lerp [A] to [B] by [T]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 0},
                        B: {type: ArgumentType.NUMBER, defaultValue: 100},
                        T: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    },
                    doc: {
                        description: 'Linearly interpolates between two values by a factor t.',
                        returns: 'number',
                        example: 'lerp 0 to 100 by 0.5 => 50 | lerp 0 to 100 by 0 => 0',
                        arguments: {
                            A: 'Start value',
                            B: 'End value',
                            T: 'Interpolation factor (0 to 1)'
                        }
                    }
                },
                {
                    opcode: 'mathRoundTo',
                    blockType: BlockType.REPORTER,
                    text: 'round [VALUE] to [DECIMALS] decimals',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 3.14159},
                        DECIMALS: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Rounds a number to a specified number of decimal places.',
                        returns: 'number',
                        example: 'round 3.14159 to 2 decimals => 3.14',
                        arguments: {
                            VALUE: 'The number to round',
                            DECIMALS: 'Number of decimal places'
                        }
                    }
                },
                {
                    opcode: 'mathFloor',
                    blockType: BlockType.REPORTER,
                    text: 'floor [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 3.7}
                    },
                    doc: {
                        description: 'Rounds a number down to the nearest integer.',
                        returns: 'number',
                        example: 'floor 3.7 => 3 | floor -1.5 => -2',
                        arguments: {
                            VALUE: 'The number to round down'
                        }
                    }
                },
                {
                    opcode: 'mathCeil',
                    blockType: BlockType.REPORTER,
                    text: 'ceil [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 3.2}
                    },
                    doc: {
                        description: 'Rounds a number up to the nearest integer.',
                        returns: 'number',
                        example: 'ceil 3.2 => 4 | ceil -1.5 => -1',
                        arguments: {
                            VALUE: 'The number to round up'
                        }
                    }
                },
                {
                    opcode: 'mathSign',
                    blockType: BlockType.REPORTER,
                    text: 'sign of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: -5}
                    },
                    doc: {
                        description: 'Returns the sign of a number: -1, 0, or 1.',
                        returns: 'number',
                        example: 'sign of -5 => -1 | sign of 0 => 0 | sign of 8 => 1',
                        arguments: {
                            VALUE: 'The number to check'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathSum',
                    blockType: BlockType.REPORTER,
                    text: '[A] + [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Adds two numbers together.',
                        returns: 'number',
                        example: '1 + 2 => 3',
                        arguments: {
                            A: 'First addend',
                            B: 'Second addend'
                        }
                    }
                },
                {
                    opcode: 'mathMin',
                    blockType: BlockType.REPORTER,
                    text: 'min of [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Returns the smaller of two numbers.',
                        returns: 'number',
                        example: 'min of 1 and 10 => 1',
                        arguments: {
                            A: 'First number',
                            B: 'Second number'
                        }
                    }
                },
                {
                    opcode: 'mathMax',
                    blockType: BlockType.REPORTER,
                    text: 'max of [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Returns the larger of two numbers.',
                        returns: 'number',
                        example: 'max of 1 and 10 => 10',
                        arguments: {
                            A: 'First number',
                            B: 'Second number'
                        }
                    }
                },
                {
                    opcode: 'mathAverage',
                    blockType: BlockType.REPORTER,
                    text: 'average of list [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'}
                    },
                    doc: {
                        description: 'Calculates the arithmetic mean of numbers in a list.',
                        returns: 'number',
                        example: 'average of list [1,2,3,4,5] => 3',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                },
                {
                    opcode: 'mathMedian',
                    blockType: BlockType.REPORTER,
                    text: 'median of list [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'}
                    },
                    doc: {
                        description: 'Finds the middle value of a sorted number list.',
                        returns: 'number',
                        example: 'median of list [1,2,3,4,5] => 3 | median of [1,2,3,4] => 2.5',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                },
                {
                    opcode: 'mathRandomInt',
                    blockType: BlockType.REPORTER,
                    text: 'random int from [MIN] to [MAX]',
                    arguments: {
                        MIN: {type: ArgumentType.NUMBER, defaultValue: 1},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Generates a random integer between min and max (inclusive).',
                        returns: 'number',
                        example: 'random int from 1 to 10 => 7 (varies)',
                        arguments: {
                            MIN: 'Minimum value (inclusive)',
                            MAX: 'Maximum value (inclusive)'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathIsPrime',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] prime?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 7}
                    },
                    doc: {
                        description: 'Checks if a number is prime.',
                        returns: 'boolean',
                        example: 'is 7 prime? => true | is 4 prime? => false',
                        arguments: {
                            VALUE: 'The number to test'
                        }
                    }
                },
                {
                    opcode: 'mathFactorial',
                    blockType: BlockType.REPORTER,
                    text: 'factorial of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Calculates the factorial (n!) of a non-negative integer.',
                        returns: 'number',
                        example: 'factorial of 5 => 120 | factorial of 0 => 1',
                        arguments: {
                            VALUE: 'Non-negative integer'
                        }
                    }
                },
                {
                    opcode: 'mathGCD',
                    blockType: BlockType.REPORTER,
                    text: 'gcd of [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 12},
                        B: {type: ArgumentType.NUMBER, defaultValue: 18}
                    },
                    doc: {
                        description: 'Calculates the greatest common divisor of two numbers.',
                        returns: 'number',
                        example: 'gcd of 12 and 18 => 6 | gcd of 7 and 13 => 1',
                        arguments: {
                            A: 'First integer',
                            B: 'Second integer'
                        }
                    }
                },
                {
                    opcode: 'mathLCM',
                    blockType: BlockType.REPORTER,
                    text: 'lcm of [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 12},
                        B: {type: ArgumentType.NUMBER, defaultValue: 18}
                    },
                    doc: {
                        description: 'Calculates the least common multiple of two numbers.',
                        returns: 'number',
                        example: 'lcm of 12 and 18 => 36',
                        arguments: {
                            A: 'First integer',
                            B: 'Second integer'
                        }
                    }
                },
                {
                    opcode: 'mathDegToRad',
                    blockType: BlockType.REPORTER,
                    text: '[DEG] degrees to radians',
                    arguments: {
                        DEG: {type: ArgumentType.NUMBER, defaultValue: 180}
                    },
                    doc: {
                        description: 'Converts degrees to radians.',
                        returns: 'number',
                        example: '180 degrees to radians => 3.14159...',
                        arguments: {
                            DEG: 'Angle in degrees'
                        }
                    }
                },
                {
                    opcode: 'mathRadToDeg',
                    blockType: BlockType.REPORTER,
                    text: '[RAD] radians to degrees',
                    arguments: {
                        RAD: {type: ArgumentType.NUMBER, defaultValue: 3.14159}
                    },
                    doc: {
                        description: 'Converts radians to degrees.',
                        returns: 'number',
                        example: '3.14159 radians to degrees => 180',
                        arguments: {
                            RAD: 'Angle in radians'
                        }
                    }
                },
                {
                    opcode: 'mathLog',
                    blockType: BlockType.REPORTER,
                    text: 'log base [BASE] of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 100},
                        BASE: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Calculates the logarithm of a value with a given base.',
                        returns: 'number',
                        example: 'log base 10 of 100 => 2 | log base 2 of 8 => 3',
                        arguments: {
                            VALUE: 'The argument of the logarithm',
                            BASE: 'The base of the logarithm'
                        }
                    }
                },
                {
                    opcode: 'mathHypot',
                    blockType: BlockType.REPORTER,
                    text: 'hypotenuse of [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 3},
                        B: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: {
                        description: 'Computes sqrt(a^2 + b^2) — the length of a right triangle hypotenuse.',
                        returns: 'number',
                        example: 'hypotenuse of 3 and 4 => 5',
                        arguments: {
                            A: 'First leg length',
                            B: 'Second leg length'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathIsEven',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] even?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: {
                        description: 'Checks if a number is even.',
                        returns: 'boolean',
                        example: 'is 4 even? => true | is 3 even? => false',
                        arguments: {
                            VALUE: 'The number to check'
                        }
                    }
                },
                {
                    opcode: 'mathIsOdd',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] odd?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Checks if a number is odd.',
                        returns: 'boolean',
                        example: 'is 3 odd? => true | is 4 odd? => false',
                        arguments: {
                            VALUE: 'The number to check'
                        }
                    }
                },
                {
                    opcode: 'mathIsInteger',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] integer?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Checks if a value is an integer.',
                        returns: 'boolean',
                        example: 'is 5 integer? => true | is 3.14 integer? => false',
                        arguments: {
                            VALUE: 'The value to check'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathToBinary',
                    blockType: BlockType.REPORTER,
                    text: 'binary of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 42}
                    },
                    doc: {
                        description: 'Converts a number to its binary string representation.',
                        returns: 'string',
                        example: 'binary of 42 => "101010"',
                        arguments: {
                            VALUE: 'The number to convert'
                        }
                    }
                },
                {
                    opcode: 'mathToHex',
                    blockType: BlockType.REPORTER,
                    text: 'hex of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 255}
                    },
                    doc: {
                        description: 'Converts a number to its hexadecimal string representation.',
                        returns: 'string',
                        example: 'hex of 255 => "ff" | hex of 16 => "10"',
                        arguments: {
                            VALUE: 'The number to convert'
                        }
                    }
                },
                {
                    opcode: 'mathToOctal',
                    blockType: BlockType.REPORTER,
                    text: 'octal of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 64}
                    },
                    doc: {
                        description: 'Converts a number to its octal string representation.',
                        returns: 'string',
                        example: 'octal of 64 => "100"',
                        arguments: {
                            VALUE: 'The number to convert'
                        }
                    }
                },
                {
                    opcode: 'mathFromBinary',
                    blockType: BlockType.REPORTER,
                    text: 'number from binary [STR]',
                    arguments: {
                        STR: {type: ArgumentType.STRING, defaultValue: '101010'}
                    },
                    doc: {
                        description: 'Parses a binary string to a number.',
                        returns: 'number',
                        example: 'number from binary "101010" => 42',
                        arguments: {
                            STR: 'Binary string to parse'
                        }
                    }
                },
                {
                    opcode: 'mathFromHex',
                    blockType: BlockType.REPORTER,
                    text: 'number from hex [STR]',
                    arguments: {
                        STR: {type: ArgumentType.STRING, defaultValue: 'FF'}
                    },
                    doc: {
                        description: 'Parses a hexadecimal string to a number.',
                        returns: 'number',
                        example: 'number from hex "FF" => 255',
                        arguments: {
                            STR: 'Hexadecimal string to parse'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathBitwiseAND',
                    blockType: BlockType.REPORTER,
                    text: '[A] AND [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 5},
                        B: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Performs bitwise AND on two integers.',
                        returns: 'number',
                        example: '5 AND 3 => 1 (101 & 011 = 001)',
                        arguments: {
                            A: 'First integer',
                            B: 'Second integer'
                        }
                    }
                },
                {
                    opcode: 'mathBitwiseOR',
                    blockType: BlockType.REPORTER,
                    text: '[A] OR [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 5},
                        B: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Performs bitwise OR on two integers.',
                        returns: 'number',
                        example: '5 OR 3 => 7 (101 | 011 = 111)',
                        arguments: {
                            A: 'First integer',
                            B: 'Second integer'
                        }
                    }
                },
                {
                    opcode: 'mathBitwiseXOR',
                    blockType: BlockType.REPORTER,
                    text: '[A] XOR [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 5},
                        B: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Performs bitwise XOR on two integers.',
                        returns: 'number',
                        example: '5 XOR 3 => 6 (101 ^ 011 = 110)',
                        arguments: {
                            A: 'First integer',
                            B: 'Second integer'
                        }
                    }
                },
                {
                    opcode: 'mathBitwiseNOT',
                    blockType: BlockType.REPORTER,
                    text: 'NOT [A]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Performs bitwise NOT (inverts all bits).',
                        returns: 'number',
                        example: 'NOT 5 => -6',
                        arguments: {
                            A: 'The integer to invert'
                        }
                    }
                },
                {
                    opcode: 'mathBitwiseShift',
                    blockType: BlockType.REPORTER,
                    text: '[A] shift left [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: {
                        description: 'Shifts bits of A to the left by B positions.',
                        returns: 'number',
                        example: '1 shift left 4 => 16',
                        arguments: {
                            A: 'The number to shift',
                            B: 'Number of positions to shift left'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathStandardDeviation',
                    blockType: BlockType.REPORTER,
                    text: 'standard deviation of [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'}
                    },
                    doc: {
                        description: 'Calculates the population standard deviation of a number list.',
                        returns: 'number',
                        example: 'standard deviation of [1,2,3,4,5] => 1.414...',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                },
                {
                    opcode: 'mathMode',
                    blockType: BlockType.REPORTER,
                    text: 'mode of [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,2,3,3,3]'}
                    },
                    doc: {
                        description: 'Finds the most frequently occurring value in a list.',
                        returns: 'any',
                        example: 'mode of [1,2,2,3,3,3] => 3',
                        arguments: {
                            LIST: 'JSON array of values'
                        }
                    }
                },
                {
                    opcode: 'mathRange',
                    blockType: BlockType.REPORTER,
                    text: 'range of [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[3,7,2,9,5]'}
                    },
                    doc: {
                        description: 'Calculates the difference between the max and min in a list.',
                        returns: 'number',
                        example: 'range of [3,7,2,9,5] => 7',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathVectorLength',
                    blockType: BlockType.REPORTER,
                    text: 'vector length of [X] [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 3},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: {
                        description: 'Computes the Euclidean length (magnitude) of a 2D vector.',
                        returns: 'number',
                        example: 'vector length of 3 4 => 5',
                        arguments: {
                            X: 'X component of the vector',
                            Y: 'Y component of the vector'
                        }
                    }
                },
                {
                    opcode: 'mathVectorAngle',
                    blockType: BlockType.REPORTER,
                    text: 'vector angle of [X] [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 1},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: {
                        description: 'Computes the angle of a 2D vector in degrees.',
                        returns: 'number',
                        example: 'vector angle of 1 0 => 0 | vector angle of 0 1 => 90',
                        arguments: {
                            X: 'X component of the vector',
                            Y: 'Y component of the vector'
                        }
                    }
                },
                {
                    opcode: 'mathDotProduct',
                    blockType: BlockType.REPORTER,
                    text: 'dot product of ([X1],[Y1]) and ([X2],[Y2])',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 1},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 2},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 3},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: {
                        description: 'Calculates the dot product of two 2D vectors.',
                        returns: 'number',
                        example: 'dot product of (1,2) and (3,4) => 11',
                        arguments: {
                            X1: 'X component of the first vector',
                            Y1: 'Y component of the first vector',
                            X2: 'X component of the second vector',
                            Y2: 'Y component of the second vector'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathConstants',
                    blockType: BlockType.REPORTER,
                    text: '[CONST]',
                    arguments: {
                        CONST: {
                            type: ArgumentType.STRING,
                            menu: 'mathConstantsMenu'
                        }
                    },
                    doc: {
                        description: 'Returns a mathematical constant value.',
                        returns: 'number',
                        example: 'PI => 3.14159... | E => 2.71828...',
                        arguments: {
                            CONST: 'The constant name to retrieve'
                        }
                    }
                },
                {
                    opcode: 'mathIsFinite',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] finite?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 42}
                    },
                    doc: {
                        description: 'Checks if a number is finite (not Infinity or -Infinity).',
                        returns: 'boolean',
                        example: 'is 42 finite? => true | is 1/0 finite? => false',
                        arguments: {
                            VALUE: 'The number to check'
                        }
                    }
                },
                {
                    opcode: 'mathIsNaN',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] NaN?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: NaN}
                    },
                    doc: {
                        description: 'Checks if a value is NaN (Not-a-Number).',
                        returns: 'boolean',
                        example: 'is 0/0 NaN? => true | is 42 NaN? => false',
                        arguments: {
                            VALUE: 'The value to check'
                        }
                    }
                },
                {
                    opcode: 'mathPercent',
                    blockType: BlockType.REPORTER,
                    text: '[PART] as percent of [WHOLE]',
                    arguments: {
                        PART: {type: ArgumentType.NUMBER, defaultValue: 25},
                        WHOLE: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: {
                        description: 'Calculates what percentage one number is of another.',
                        returns: 'number',
                        example: '25 as percent of 100 => 25 | 50 as percent of 200 => 25',
                        arguments: {
                            PART: 'The part value',
                            WHOLE: 'The whole value'
                        }
                    }
                },
                {
                    opcode: 'mathWeightedRandom',
                    blockType: BlockType.REPORTER,
                    text: 'weighted random from [WEIGHTS]',
                    arguments: {
                        WEIGHTS: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'}
                    },
                    doc: {
                        description: 'Picks a random index based on an array of weights.',
                        returns: 'number',
                        example: 'weighted random from [1,2,3] => index (more likely to pick index 2)',
                        arguments: {
                            WEIGHTS: 'JSON array of positive weight values'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathCbrt',
                    blockType: BlockType.REPORTER,
                    text: 'cube root of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 27}
                    },
                    doc: {
                        description: 'Calculates the cube root of a number.',
                        returns: 'number',
                        example: 'cube root of 27 => 3 | cube root of -8 => -2',
                        arguments: {
                            VALUE: 'The number to find the cube root of'
                        }
                    }
                },
                {
                    opcode: 'mathHypot3',
                    blockType: BlockType.REPORTER,
                    text: 'hypotenuse of [A], [B], [C]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 3},
                        B: {type: ArgumentType.NUMBER, defaultValue: 4},
                        C: {type: ArgumentType.NUMBER, defaultValue: 12}
                    },
                    doc: {
                        description: 'Computes sqrt(a^2 + b^2 + c^2) — 3D hypotenuse length.',
                        returns: 'number',
                        example: 'hypotenuse of 3, 4, 12 => 13',
                        arguments: {
                            A: 'First component',
                            B: 'Second component',
                            C: 'Third component'
                        }
                    }
                },
                {
                    opcode: 'mathLog2',
                    blockType: BlockType.REPORTER,
                    text: 'log base 2 of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 8}
                    },
                    doc: {
                        description: 'Calculates the base-2 logarithm of a value.',
                        returns: 'number',
                        example: 'log base 2 of 8 => 3',
                        arguments: {
                            VALUE: 'The value to compute the logarithm of'
                        }
                    }
                },
                {
                    opcode: 'mathLog10',
                    blockType: BlockType.REPORTER,
                    text: 'log base 10 of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: {
                        description: 'Calculates the base-10 logarithm of a value.',
                        returns: 'number',
                        example: 'log base 10 of 100 => 2',
                        arguments: {
                            VALUE: 'The value to compute the logarithm of'
                        }
                    }
                },
                {
                    opcode: 'mathExp',
                    blockType: BlockType.REPORTER,
                    text: 'e ^ [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Calculates e raised to the power of VALUE.',
                        returns: 'number',
                        example: 'e ^ 1 => 2.71828... | e ^ 0 => 1',
                        arguments: {
                            VALUE: 'The exponent'
                        }
                    }
                },
                {
                    opcode: 'mathSigmoid',
                    blockType: BlockType.REPORTER,
                    text: 'sigmoid of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: {
                        description: 'Applies the sigmoid (logistic) activation function: 1/(1+e^-x).',
                        returns: 'number',
                        example: 'sigmoid of 0 => 0.5 | sigmoid of 5 => ~0.993',
                        arguments: {
                            VALUE: 'Input value'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathCombination',
                    blockType: BlockType.REPORTER,
                    text: '[N] choose [K]',
                    arguments: {
                        N: {type: ArgumentType.NUMBER, defaultValue: 5},
                        K: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Calculates the binomial coefficient C(n,k) — n choose k.',
                        returns: 'number',
                        example: '5 choose 2 => 10',
                        arguments: {
                            N: 'Total number of items',
                            K: 'Number of items to choose'
                        }
                    }
                },
                {
                    opcode: 'mathPermutation',
                    blockType: BlockType.REPORTER,
                    text: 'P([N], [K])',
                    arguments: {
                        N: {type: ArgumentType.NUMBER, defaultValue: 5},
                        K: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Calculates the number of permutations P(n,k).',
                        returns: 'number',
                        example: 'P(5, 2) => 20',
                        arguments: {
                            N: 'Total number of items',
                            K: 'Number of items to arrange'
                        }
                    }
                },
                {
                    opcode: 'mathDegToDMS',
                    blockType: BlockType.REPORTER,
                    text: '[DEG] to DMS',
                    arguments: {
                        DEG: {type: ArgumentType.NUMBER, defaultValue: 45.5}
                    },
                    doc: {
                        description: 'Converts decimal degrees to degrees-minutes-seconds format.',
                        returns: 'string',
                        example: '45.5 to DMS => "45°30\'0""',
                        arguments: {
                            DEG: 'Decimal degree value'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathRandomSeed',
                    blockType: BlockType.COMMAND,
                    text: 'set random seed to [SEED]',
                    arguments: {
                        SEED: {type: ArgumentType.NUMBER, defaultValue: 42}
                    },
                    doc: {
                        description: 'Sets the seed for the deterministic random number generator.',
                        example: 'set random seed to 42',
                        arguments: {
                            SEED: 'Seed value (positive integer)'
                        }
                    }
                },
                {
                    opcode: 'mathRandomSeeded',
                    blockType: BlockType.REPORTER,
                    text: 'seeded random 0-1',
                    doc: {
                        description: 'Returns a deterministic pseudo-random number between 0 and 1.',
                        returns: 'number',
                        example: 'seeded random 0-1 => 0.432... (predictable if seed is set)'
                    }
                },
                '---',
                {
                    opcode: 'mathCelsiusToFahrenheit',
                    blockType: BlockType.REPORTER,
                    text: '[C] °C to °F',
                    arguments: {
                        C: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: {
                        description: 'Converts degrees Celsius to degrees Fahrenheit.',
                        returns: 'number',
                        example: '0 °C to °F => 32 | 100 °C to °F => 212',
                        arguments: {
                            C: 'Temperature in Celsius'
                        }
                    }
                },
                {
                    opcode: 'mathFahrenheitToCelsius',
                    blockType: BlockType.REPORTER,
                    text: '[F] °F to °C',
                    arguments: {
                        F: {type: ArgumentType.NUMBER, defaultValue: 32}
                    },
                    doc: {
                        description: 'Converts degrees Fahrenheit to degrees Celsius.',
                        returns: 'number',
                        example: '32 °F to °C => 0 | 212 °F to °C => 100',
                        arguments: {
                            F: 'Temperature in Fahrenheit'
                        }
                    }
                },
                {
                    opcode: 'mathKmToMiles',
                    blockType: BlockType.REPORTER,
                    text: '[KM] km to miles',
                    arguments: {
                        KM: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Converts kilometers to miles.',
                        returns: 'number',
                        example: '1 km to miles => 0.621371 | 10 km to miles => 6.21371',
                        arguments: {
                            KM: 'Distance in kilometers'
                        }
                    }
                },
                {
                    opcode: 'mathMilesToKm',
                    blockType: BlockType.REPORTER,
                    text: '[MILES] miles to km',
                    arguments: {
                        MILES: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Converts miles to kilometers.',
                        returns: 'number',
                        example: '1 mile to km => 1.60934 | 10 miles to km => 16.0934',
                        arguments: {
                            MILES: 'Distance in miles'
                        }
                    }
                },
                {
                    opcode: 'mathKgToLbs',
                    blockType: BlockType.REPORTER,
                    text: '[KG] kg to lbs',
                    arguments: {
                        KG: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Converts kilograms to pounds.',
                        returns: 'number',
                        example: '1 kg to lbs => 2.20462 | 5 kg to lbs => 11.0231',
                        arguments: {
                            KG: 'Weight in kilograms'
                        }
                    }
                },
                {
                    opcode: 'mathLbsToKg',
                    blockType: BlockType.REPORTER,
                    text: '[LBS] lbs to kg',
                    arguments: {
                        LBS: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Converts pounds to kilograms.',
                        returns: 'number',
                        example: '1 lb to kg => 0.453592 | 10 lbs to kg => 4.53592',
                        arguments: {
                            LBS: 'Weight in pounds'
                        }
                    }
                },
                {
                    opcode: 'mathAngleBetween',
                    blockType: BlockType.REPORTER,
                    text: 'angle between ([X1],[Y1]) and ([X2],[Y2])',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 1},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: {
                        description: 'Calculates the angle in degrees from point1 to point2.',
                        returns: 'number',
                        example: 'angle between (0,0) and (1,0) => 0 | angle between (0,0) and (0,1) => 90',
                        arguments: {
                            X1: 'X coordinate of the first point',
                            Y1: 'Y coordinate of the first point',
                            X2: 'X coordinate of the second point',
                            Y2: 'Y coordinate of the second point'
                        }
                    }
                },
                {
                    opcode: 'mathDistance3D',
                    blockType: BlockType.REPORTER,
                    text: '3D distance from ([X1],[Y1],[Z1]) to ([X2],[Y2],[Z2])',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 3},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 4},
                        Z2: {type: ArgumentType.NUMBER, defaultValue: 12}
                    },
                    doc: {
                        description: 'Calculates the Euclidean distance between two 3D points.',
                        returns: 'number',
                        example: '3D distance from (0,0,0) to (3,4,12) => 13',
                        arguments: {
                            X1: 'X coordinate of the first point',
                            Y1: 'Y coordinate of the first point',
                            Z1: 'Z coordinate of the first point',
                            X2: 'X coordinate of the second point',
                            Y2: 'Y coordinate of the second point',
                            Z2: 'Z coordinate of the second point'
                        }
                    }
                },
                {
                    opcode: 'mathMirror',
                    blockType: BlockType.REPORTER,
                    text: 'mirror [VALUE] around [CENTER]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 10},
                        CENTER: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Reflects a value around a center point using the formula 2*center - value.',
                        returns: 'number',
                        example: 'mirror 10 around 5 => 0 | mirror 3 around 5 => 7',
                        arguments: {
                            VALUE: 'The value to reflect',
                            CENTER: 'The center point to reflect around'
                        }
                    }
                },
                {
                    opcode: 'mathScale',
                    blockType: BlockType.REPORTER,
                    text: 'scale [VALUE] from [FROM_MIN]..[FROM_MAX] to [TO_MIN]..[TO_MAX]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 50},
                        FROM_MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        FROM_MAX: {type: ArgumentType.NUMBER, defaultValue: 100},
                        TO_MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        TO_MAX: {type: ArgumentType.NUMBER, defaultValue: 200}
                    },
                    doc: {
                        description: 'Re-maps a number from one range to another without clamping. Alias for map with no bounds.',
                        returns: 'number',
                        example: 'scale 50 from 0..100 to 0..200 => 100 | scale -10 from 0..100 to 0..200 => -20',
                        arguments: {
                            VALUE: 'The value to re-map',
                            FROM_MIN: 'Lower bound of the current range',
                            FROM_MAX: 'Upper bound of the current range',
                            TO_MIN: 'Lower bound of the target range',
                            TO_MAX: 'Upper bound of the target range'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathIsPositive',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] positive?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Checks if a number is greater than zero.',
                        returns: 'boolean',
                        example: 'is 5 positive? => true | is -3 positive? => false',
                        arguments: {
                            VALUE: 'The number to check'
                        }
                    }
                },
                {
                    opcode: 'mathIsNegative',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] negative?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: -5}
                    },
                    doc: {
                        description: 'Checks if a number is less than zero.',
                        returns: 'boolean',
                        example: 'is -5 negative? => true | is 3 negative? => false',
                        arguments: {
                            VALUE: 'The number to check'
                        }
                    }
                },
                {
                    opcode: 'mathIsZero',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] zero?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: {
                        description: 'Checks if a number is exactly zero.',
                        returns: 'boolean',
                        example: 'is 0 zero? => true | is 5 zero? => false',
                        arguments: {
                            VALUE: 'The number to check'
                        }
                    }
                },
                {
                    opcode: 'mathIsMultiple',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [VALUE] a multiple of [OF]?',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 10},
                        OF: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Checks if one number is a multiple of another.',
                        returns: 'boolean',
                        example: 'is 10 a multiple of 5? => true | is 10 a multiple of 3? => false',
                        arguments: {
                            VALUE: 'The number to check',
                            OF: 'The divisor'
                        }
                    }
                },
                {
                    opcode: 'mathNearestMultiple',
                    blockType: BlockType.REPORTER,
                    text: 'nearest multiple of [VALUE] to [OF]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 13},
                        OF: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Rounds a number to the nearest multiple of another number.',
                        returns: 'number',
                        example: 'nearest multiple of 13 to 5 => 15 | nearest multiple of 12 to 5 => 10',
                        arguments: {
                            VALUE: 'The number to round',
                            OF: 'The multiple to round to'
                        }
                    }
                },
                {
                    opcode: 'mathWrappingAdd',
                    blockType: BlockType.REPORTER,
                    text: 'wrapping add [VALUE] + [ADD] within [MIN]..[MAX]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 95},
                        ADD: {type: ArgumentType.NUMBER, defaultValue: 10},
                        MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: {
                        description: 'Adds a value and wraps the result within the specified range.',
                        returns: 'number',
                        example: 'wrapping add 95 + 10 within 0..100 => 5',
                        arguments: {
                            VALUE: 'Starting value',
                            ADD: 'Value to add',
                            MIN: 'Range minimum',
                            MAX: 'Range maximum'
                        }
                    }
                },
                {
                    opcode: 'mathWrappingSub',
                    blockType: BlockType.REPORTER,
                    text: 'wrapping sub [VALUE] - [SUB] within [MIN]..[MAX]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 5},
                        SUB: {type: ArgumentType.NUMBER, defaultValue: 10},
                        MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: {
                        description: 'Subtracts a value and wraps the result within the specified range.',
                        returns: 'number',
                        example: 'wrapping sub 5 - 10 within 0..100 => 95',
                        arguments: {
                            VALUE: 'Starting value',
                            SUB: 'Value to subtract',
                            MIN: 'Range minimum',
                            MAX: 'Range maximum'
                        }
                    }
                },
                {
                    opcode: 'mathTriangleArea',
                    blockType: BlockType.REPORTER,
                    text: 'triangle area base [BASE] height [HEIGHT]',
                    arguments: {
                        BASE: {type: ArgumentType.NUMBER, defaultValue: 10},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Calculates the area of a triangle: 0.5 * base * height.',
                        returns: 'number',
                        example: 'triangle area base 10 height 5 => 25',
                        arguments: {
                            BASE: 'Base length',
                            HEIGHT: 'Height'
                        }
                    }
                },
                {
                    opcode: 'mathCircleArea',
                    blockType: BlockType.REPORTER,
                    text: 'circle area radius [RADIUS]',
                    arguments: {
                        RADIUS: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Calculates the area of a circle: PI * r^2.',
                        returns: 'number',
                        example: 'circle area radius 5 => 78.539...',
                        arguments: {
                            RADIUS: 'Radius of the circle'
                        }
                    }
                },
                {
                    opcode: 'mathCircleCircumference',
                    blockType: BlockType.REPORTER,
                    text: 'circle circumference radius [RADIUS]',
                    arguments: {
                        RADIUS: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Calculates the circumference of a circle: 2 * PI * r.',
                        returns: 'number',
                        example: 'circle circumference radius 5 => 31.415...',
                        arguments: {
                            RADIUS: 'Radius of the circle'
                        }
                    }
                },
                {
                    opcode: 'mathRectangleArea',
                    blockType: BlockType.REPORTER,
                    text: 'rectangle area width [W] height [H]',
                    arguments: {
                        W: {type: ArgumentType.NUMBER, defaultValue: 10},
                        H: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Calculates the area of a rectangle: width * height.',
                        returns: 'number',
                        example: 'rectangle area width 10 height 5 => 50',
                        arguments: {
                            W: 'Width',
                            H: 'Height'
                        }
                    }
                },
                {
                    opcode: 'mathSphereVolume',
                    blockType: BlockType.REPORTER,
                    text: 'sphere volume radius [RADIUS]',
                    arguments: {
                        RADIUS: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Calculates the volume of a sphere: 4/3 * PI * r^3.',
                        returns: 'number',
                        example: 'sphere volume radius 5 => 523.598...',
                        arguments: {
                            RADIUS: 'Radius of the sphere'
                        }
                    }
                },
                {
                    opcode: 'mathCylinderVolume',
                    blockType: BlockType.REPORTER,
                    text: 'cylinder volume radius [RADIUS] height [HEIGHT]',
                    arguments: {
                        RADIUS: {type: ArgumentType.NUMBER, defaultValue: 5},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Calculates the volume of a cylinder: PI * r^2 * h.',
                        returns: 'number',
                        example: 'cylinder volume radius 5 height 10 => 785.398...',
                        arguments: {
                            RADIUS: 'Radius of the cylinder',
                            HEIGHT: 'Height of the cylinder'
                        }
                    }
                },
                {
                    opcode: 'mathPyramidVolume',
                    blockType: BlockType.REPORTER,
                    text: 'pyramid volume base area [BASE] height [HEIGHT]',
                    arguments: {
                        BASE: {type: ArgumentType.NUMBER, defaultValue: 25},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Calculates the volume of a pyramid: 1/3 * base_area * height.',
                        returns: 'number',
                        example: 'pyramid volume base area 25 height 10 => 83.333...',
                        arguments: {
                            BASE: 'Base area',
                            HEIGHT: 'Height'
                        }
                    }
                },
                {
                    opcode: 'mathPythagorean',
                    blockType: BlockType.REPORTER,
                    text: 'pythagorean hypotenuse [A] [B]',
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 3},
                        B: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: {
                        description: 'Calculates the hypotenuse via the Pythagorean theorem: sqrt(a^2 + b^2).',
                        returns: 'number',
                        example: 'pythagorean hypotenuse 3 4 => 5',
                        arguments: {
                            A: 'First leg length',
                            B: 'Second leg length'
                        }
                    }
                },
                '---',
                {
                    opcode: 'mathComplex',
                    blockType: BlockType.REPORTER,
                    text: 'complex [RE] + [IM]i',
                    arguments: {
                        RE: {type: ArgumentType.NUMBER, defaultValue: 3},
                        IM: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: {
                        description: 'Creates a complex number object with real and imaginary parts, returned as JSON {re, im}.',
                        returns: 'JSON object {re, im}',
                        example: 'complex 3 + 4i => {"re":3,"im":4}'
                    }
                },
                {
                    opcode: 'mathComplexAdd',
                    blockType: BlockType.REPORTER,
                    text: 'complex [A] + [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"re":1,"im":2}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"re":3,"im":4}'}
                    },
                    doc: {
                        description: 'Adds two complex numbers: (a.re+b.re, a.im+b.im).',
                        returns: 'JSON object {re, im}',
                        example: 'complex {"re":1,"im":2} + {"re":3,"im":4} => {"re":4,"im":6}'
                    }
                },
                {
                    opcode: 'mathComplexSub',
                    blockType: BlockType.REPORTER,
                    text: 'complex [A] - [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"re":5,"im":6}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"re":3,"im":4}'}
                    },
                    doc: {
                        description: 'Subtracts two complex numbers: (a.re-b.re, a.im-b.im).',
                        returns: 'JSON object {re, im}',
                        example: 'complex {"re":5,"im":6} - {"re":3,"im":4} => {"re":2,"im":2}'
                    }
                },
                {
                    opcode: 'mathComplexMul',
                    blockType: BlockType.REPORTER,
                    text: 'complex [A] * [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"re":1,"im":2}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"re":3,"im":4}'}
                    },
                    doc: {
                        description: 'Multiplies two complex numbers: (a.re*b.re - a.im*b.im, a.re*b.im + a.im*b.re).',
                        returns: 'JSON object {re, im}',
                        example: 'complex {"re":1,"im":2} * {"re":3,"im":4} => {"re":-5,"im":10}'
                    }
                },
                {
                    opcode: 'mathComplexDiv',
                    blockType: BlockType.REPORTER,
                    text: 'complex [A] / [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"re":1,"im":2}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"re":3,"im":4}'}
                    },
                    doc: {
                        description: 'Divides two complex numbers: (a*conj(b))/(b*conj(b)).',
                        returns: 'JSON object {re, im}',
                        example: 'complex {"re":1,"im":2} / {"re":3,"im":4} => {"re":0.44,"im":0.08}'
                    }
                },
                {
                    opcode: 'mathComplexAbs',
                    blockType: BlockType.REPORTER,
                    text: 'magnitude of complex [A]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"re":3,"im":4}'}
                    },
                    doc: {
                        description: 'Computes the magnitude (absolute value) of a complex number: sqrt(re²+im²).',
                        returns: 'number',
                        example: 'magnitude of complex {"re":3,"im":4} => 5'
                    }
                },
                {
                    opcode: 'mathComplexArg',
                    blockType: BlockType.REPORTER,
                    text: 'argument of complex [A] in degrees',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"re":1,"im":1}'}
                    },
                    doc: {
                        description: 'Computes the argument (angle) of a complex number in degrees using atan2(im, re).',
                        returns: 'number (degrees)',
                        example: 'argument of complex {"re":1,"im":1} => 45'
                    }
                },
                {
                    opcode: 'mathComplexConj',
                    blockType: BlockType.REPORTER,
                    text: 'conjugate of complex [A]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"re":3,"im":4}'}
                    },
                    doc: {
                        description: 'Computes the complex conjugate: (re, -im).',
                        returns: 'JSON object {re, im}',
                        example: 'conjugate of complex {"re":3,"im":4} => {"re":3,"im":-4}'
                    }
                },
                '---',
                {
                    opcode: 'mathMatrixCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create matrix [ROWS] x [COLS] filled with [VALUE]',
                    arguments: {
                        ROWS: {type: ArgumentType.NUMBER, defaultValue: 3},
                        COLS: {type: ArgumentType.NUMBER, defaultValue: 3},
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: {
                        description: 'Creates a matrix (2D JSON array) of specified dimensions filled with a value.',
                        returns: 'JSON 2D array',
                        example: 'create matrix 3 x 3 filled with 0 => [[0,0,0],[0,0,0],[0,0,0]]'
                    }
                },
                {
                    opcode: 'mathMatrixIdentity',
                    blockType: BlockType.REPORTER,
                    text: 'identity matrix size [SIZE]',
                    arguments: {
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Creates an identity matrix of the specified size.',
                        returns: 'JSON 2D array',
                        example: 'identity matrix size 3 => [[1,0,0],[0,1,0],[0,0,1]]'
                    }
                },
                {
                    opcode: 'mathMatrixAdd',
                    blockType: BlockType.REPORTER,
                    text: 'matrix [A] + [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[[1,2],[3,4]]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[[5,6],[7,8]]'}
                    },
                    doc: {
                        description: 'Performs element-wise addition of two matrices.',
                        returns: 'JSON 2D array',
                        example: 'matrix [[1,2],[3,4]] + [[5,6],[7,8]] => [[6,8],[10,12]]'
                    }
                },
                {
                    opcode: 'mathMatrixMul',
                    blockType: BlockType.REPORTER,
                    text: 'matrix [A] * [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[[1,2],[3,4]]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[[5,6],[7,8]]'}
                    },
                    doc: {
                        description: 'Performs matrix multiplication (A columns must equal B rows).',
                        returns: 'JSON 2D array',
                        example: 'matrix [[1,2],[3,4]] * [[5,6],[7,8]] => [[19,22],[43,50]]'
                    }
                },
                {
                    opcode: 'mathMatrixTranspose',
                    blockType: BlockType.REPORTER,
                    text: 'transpose of matrix [M]',
                    arguments: {
                        M: {type: ArgumentType.STRING, defaultValue: '[[1,2,3],[4,5,6]]'}
                    },
                    doc: {
                        description: 'Computes the transpose of a matrix (rows become columns).',
                        returns: 'JSON 2D array',
                        example: 'transpose of [[1,2,3],[4,5,6]] => [[1,4],[2,5],[3,6]]'
                    }
                },
                {
                    opcode: 'mathMatrixDeterminant',
                    blockType: BlockType.REPORTER,
                    text: 'determinant of matrix [M]',
                    arguments: {
                        M: {type: ArgumentType.STRING, defaultValue: '[[1,2],[3,4]]'}
                    },
                    doc: {
                        description: 'Computes the determinant of a 2x2 or 3x3 matrix.',
                        returns: 'number',
                        example: 'determinant of [[1,2],[3,4]] => -2 | [[1,2,3],[4,5,6],[7,8,10]] => -3'
                    }
                },
                {
                    opcode: 'mathMatrixInverse',
                    blockType: BlockType.REPORTER,
                    text: 'inverse of matrix [M]',
                    arguments: {
                        M: {type: ArgumentType.STRING, defaultValue: '[[1,2],[3,4]]'}
                    },
                    doc: {
                        description: 'Computes the inverse of a 2x2 or 3x3 matrix.',
                        returns: 'JSON 2D array or empty string if singular',
                        example: 'inverse of [[1,2],[3,4]] => [[-2,1],[1.5,-0.5]]'
                    }
                },
                {
                    opcode: 'mathMatrixScale',
                    blockType: BlockType.REPORTER,
                    text: 'scale matrix [M] by [SCALAR]',
                    arguments: {
                        M: {type: ArgumentType.STRING, defaultValue: '[[1,2],[3,4]]'},
                        SCALAR: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Multiplies every element of a matrix by a scalar value.',
                        returns: 'JSON 2D array',
                        example: 'scale matrix [[1,2],[3,4]] by 2 => [[2,4],[6,8]]'
                    }
                },
                '---',
                {
                    opcode: 'mathRandomNormal',
                    blockType: BlockType.REPORTER,
                    text: 'random normal mean [MEAN] std [STD]',
                    arguments: {
                        MEAN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        STD: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Generates a normally distributed random number using Box-Muller transform.',
                        returns: 'number',
                        example: 'random normal mean 0 std 1 => -0.234 (varies)'
                    }
                },
                {
                    opcode: 'mathRandomPoisson',
                    blockType: BlockType.REPORTER,
                    text: 'random poisson lambda [LAMBDA]',
                    arguments: {
                        LAMBDA: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Generates a Poisson-distributed random number using Knuth\'s algorithm.',
                        returns: 'number (integer)',
                        example: 'random poisson lambda 3 => 2 (varies)'
                    }
                },
                {
                    opcode: 'mathRandomExponential',
                    blockType: BlockType.REPORTER,
                    text: 'random exponential lambda [LAMBDA]',
                    arguments: {
                        LAMBDA: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Generates an exponentially distributed random number: -ln(U)/lambda.',
                        returns: 'number',
                        example: 'random exponential lambda 1 => 0.782 (varies)'
                    }
                },
                {
                    opcode: 'mathZScore',
                    blockType: BlockType.REPORTER,
                    text: 'z-score of [VALUE] with mean [MEAN] std [STD]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 10},
                        MEAN: {type: ArgumentType.NUMBER, defaultValue: 8},
                        STD: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Calculates the z-score: (value - mean) / std.',
                        returns: 'number',
                        example: 'z-score of 10 with mean 8 std 2 => 1'
                    }
                },
                {
                    opcode: 'mathCorrelation',
                    blockType: BlockType.REPORTER,
                    text: 'correlation of [LIST_A] and [LIST_B]',
                    arguments: {
                        LIST_A: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        LIST_B: {type: ArgumentType.STRING, defaultValue: '[2,4,6,8,10]'}
                    },
                    doc: {
                        description: 'Calculates the Pearson correlation coefficient between two lists.',
                        returns: 'number between -1 and 1',
                        example: 'correlation of [1,2,3,4,5] and [2,4,6,8,10] => 1'
                    }
                },
                {
                    opcode: 'mathCovariance',
                    blockType: BlockType.REPORTER,
                    text: 'covariance of [LIST_A] and [LIST_B]',
                    arguments: {
                        LIST_A: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        LIST_B: {type: ArgumentType.STRING, defaultValue: '[2,4,6,8,10]'}
                    },
                    doc: {
                        description: 'Calculates the covariance between two lists.',
                        returns: 'number',
                        example: 'covariance of [1,2,3,4,5] and [2,4,6,8,10] => 8'
                    }
                },
                {
                    opcode: 'mathLinearRegression',
                    blockType: BlockType.REPORTER,
                    text: 'linear regression x [X_LIST] y [Y_LIST]',
                    arguments: {
                        X_LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        Y_LIST: {type: ArgumentType.STRING, defaultValue: '[2,4,6,8,10]'}
                    },
                    doc: {
                        description: 'Calculates linear regression and returns {slope, intercept, rSquared}.',
                        returns: 'JSON object {slope, intercept, rSquared}',
                        example: 'linear regression x [1,2,3,4,5] y [2,4,6,8,10] => {"slope":2,"intercept":0,"rSquared":1}'
                    }
                },
                '---',
                {
                    opcode: 'mathIntegrate',
                    blockType: BlockType.REPORTER,
                    text: 'approximate integral from [FN_A] to [FN_B] with [STEPS] steps',
                    arguments: {
                        FN_A: {type: ArgumentType.NUMBER, defaultValue: 0},
                        FN_B: {type: ArgumentType.NUMBER, defaultValue: 10},
                        STEPS: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: {
                        description: 'Returns a placeholder approximation: (a+b)*steps/2. Real numerical integration placeholder.',
                        returns: 'number',
                        example: 'approximate integral from 0 to 10 with 100 steps => 500'
                    }
                },
                {
                    opcode: 'mathDerivative',
                    blockType: BlockType.REPORTER,
                    text: 'numerical derivative at [X] with step [H]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 2},
                        H: {type: ArgumentType.NUMBER, defaultValue: 0.001}
                    },
                    doc: {
                        description: 'Computes a simplified numerical derivative of f(x)=x²: (f(x+h)-f(x))/h.',
                        returns: 'number',
                        example: 'numerical derivative at 2 with step 0.001 => ~4'
                    }
                },
                {
                    opcode: 'mathNewtonRoot',
                    blockType: BlockType.REPORTER,
                    text: 'newton sqrt of [INITIAL] with [STEPS] steps',
                    arguments: {
                        INITIAL: {type: ArgumentType.NUMBER, defaultValue: 25},
                        STEPS: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Demonstrates Newton\'s method to compute sqrt(S): x_{n+1} = (x_n + S/x_n)/2.',
                        returns: 'number',
                        example: 'newton sqrt of 25 with 10 steps => 5'
                    }
                },
                {
                    opcode: 'mathSpline',
                    blockType: BlockType.REPORTER,
                    text: 'linear interpolate x [X_LIST] y [Y_LIST] at t [T]',
                    arguments: {
                        X_LIST: {type: ArgumentType.STRING, defaultValue: '[0,5,10]'},
                        Y_LIST: {type: ArgumentType.STRING, defaultValue: '[0,25,100]'},
                        T: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    },
                    doc: {
                        description: 'Linear interpolation between points. T is 0-1 representing position between first and last x.',
                        returns: 'number',
                        example: 'linear interpolate x [0,5,10] y [0,25,100] at t 0.5 => 25'
                    }
                },
                {
                    opcode: 'mathGamma',
                    blockType: BlockType.REPORTER,
                    text: 'log gamma of [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Computes the natural log of Gamma(z) using Stirling\'s approximation: ln(Γ(z)) ≈ (z-0.5)*ln(z) - z + 0.5*ln(2π).',
                        returns: 'number',
                        example: 'log gamma of 5 => ln(24) ≈ 3.178'
                    }
                },
                '---',
                {
                    opcode: 'mathVec3Create',
                    blockType: BlockType.REPORTER,
                    text: 'vec3 [X] [Y] [Z]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 1},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 2},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Creates a 3D vector as JSON object {x, y, z}.',
                        returns: 'JSON object {x, y, z}',
                        example: 'vec3 1 2 3 => {"x":1,"y":2,"z":3}'
                    }
                },
                {
                    opcode: 'mathVec3Add',
                    blockType: BlockType.REPORTER,
                    text: 'vec3 [A] + [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"x":1,"y":2,"z":3}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"x":4,"y":5,"z":6}'}
                    },
                    doc: {
                        description: 'Adds two 3D vectors component-wise.',
                        returns: 'JSON object {x, y, z}',
                        example: 'vec3 {"x":1,"y":2,"z":3} + {"x":4,"y":5,"z":6} => {"x":5,"y":7,"z":9}'
                    }
                },
                {
                    opcode: 'mathVec3Sub',
                    blockType: BlockType.REPORTER,
                    text: 'vec3 [A] - [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"x":4,"y":5,"z":6}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"x":1,"y":2,"z":3}'}
                    },
                    doc: {
                        description: 'Subtracts two 3D vectors component-wise.',
                        returns: 'JSON object {x, y, z}',
                        example: 'vec3 {"x":4,"y":5,"z":6} - {"x":1,"y":2,"z":3} => {"x":3,"y":3,"z":3}'
                    }
                },
                {
                    opcode: 'mathVec3Dot',
                    blockType: BlockType.REPORTER,
                    text: 'dot product of vec3 [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"x":1,"y":2,"z":3}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"x":4,"y":5,"z":6}'}
                    },
                    doc: {
                        description: 'Computes the dot product of two 3D vectors: x1*x2 + y1*y2 + z1*z2.',
                        returns: 'number',
                        example: 'dot product of vec3 {"x":1,"y":2,"z":3} and {"x":4,"y":5,"z":6} => 32'
                    }
                },
                {
                    opcode: 'mathVec3Cross',
                    blockType: BlockType.REPORTER,
                    text: 'cross product of vec3 [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"x":1,"y":2,"z":3}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"x":4,"y":5,"z":6}'}
                    },
                    doc: {
                        description: 'Computes the cross product of two 3D vectors.',
                        returns: 'JSON object {x, y, z}',
                        example: 'cross product of vec3 {"x":1,"y":2,"z":3} and {"x":4,"y":5,"z":6} => {"x":-3,"y":6,"z":-3}'
                    }
                },
                {
                    opcode: 'mathVec3Length',
                    blockType: BlockType.REPORTER,
                    text: 'length of vec3 [V]',
                    arguments: {
                        V: {type: ArgumentType.STRING, defaultValue: '{"x":3,"y":4,"z":12}'}
                    },
                    doc: {
                        description: 'Computes the Euclidean length (magnitude) of a 3D vector: sqrt(x²+y²+z²).',
                        returns: 'number',
                        example: 'length of vec3 {"x":3,"y":4,"z":12} => 13'
                    }
                },
                {
                    opcode: 'mathVec3Normalize',
                    blockType: BlockType.REPORTER,
                    text: 'normalize vec3 [V]',
                    arguments: {
                        V: {type: ArgumentType.STRING, defaultValue: '{"x":3,"y":4,"z":12}'}
                    },
                    doc: {
                        description: 'Normalizes a 3D vector to unit length by dividing each component by the length.',
                        returns: 'JSON object {x, y, z}',
                        example: 'normalize vec3 {"x":3,"y":4,"z":12} => {"x":0.231,"y":0.308,"z":0.923}'
                    }
                }
            ],
            menus: {
                mathConstantsMenu: {
                    acceptReporters: true,
                    items: ['PI', 'E', 'SQRT2', 'LN2', 'LN10', 'PHI']
                }
            }
        };
    }

    mathClamp (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const min = Cast.toNumber(args.MIN);
            const max = Cast.toNumber(args.MAX);
            return Math.min(max, Math.max(min, val));
        } catch (e) {
            return 0;
        }
    }

    mathMap (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const fMin = Cast.toNumber(args.FROM_MIN);
            const fMax = Cast.toNumber(args.FROM_MAX);
            const tMin = Cast.toNumber(args.TO_MIN);
            const tMax = Cast.toNumber(args.TO_MAX);
            const range = fMax - fMin;
            if (range === 0) return tMin;
            const ratio = Math.max(0, Math.min(1, (val - fMin) / range));
            return tMin + ratio * (tMax - tMin);
        } catch (e) {
            return 0;
        }
    }

    mathLerp (args) {
        if (!args) return 0;
        try {
            const a = Cast.toNumber(args.A);
            const b = Cast.toNumber(args.B);
            const t = Cast.toNumber(args.T);
            return a + (b - a) * t;
        } catch (e) {
            return 0;
        }
    }

    mathRoundTo (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const decimals = Cast.toNumber(args.DECIMALS);
            return Number(val.toFixed(decimals));
        } catch (e) {
            return 0;
        }
    }

    mathFloor (args) {
        if (!args) return 0;
        try {
            return Math.floor(Cast.toNumber(args.VALUE));
        } catch (e) {
            return 0;
        }
    }

    mathCeil (args) {
        if (!args) return 0;
        try {
            return Math.ceil(Cast.toNumber(args.VALUE));
        } catch (e) {
            return 0;
        }
    }

    mathSign (args) {
        if (!args) return 0;
        try {
            return Math.sign(Cast.toNumber(args.VALUE));
        } catch (e) {
            return 0;
        }
    }

    mathSum (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.A) + Cast.toNumber(args.B);
        } catch (e) {
            return 0;
        }
    }

    mathMin (args) {
        if (!args) return 0;
        try {
            return Math.min(Cast.toNumber(args.A), Cast.toNumber(args.B));
        } catch (e) {
            return 0;
        }
    }

    mathMax (args) {
        if (!args) return 0;
        try {
            return Math.max(Cast.toNumber(args.A), Cast.toNumber(args.B));
        } catch (e) {
            return 0;
        }
    }

    mathAverage (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const sum = list.reduce((acc, n) => acc + Cast.toNumber(n), 0);
            return sum / list.length;
        } catch (e) {
            return 0;
        }
    }

    mathMedian (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const sorted = list.map(n => Cast.toNumber(n)).sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            if (sorted.length % 2 === 1) return sorted[mid];
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } catch (e) {
            return 0;
        }
    }

    mathRandomInt (args) {
        if (!args) return 0;
        try {
            const min = Cast.toNumber(args.MIN);
            const max = Cast.toNumber(args.MAX);
            const lo = Math.ceil(Math.min(min, max));
            const hi = Math.floor(Math.max(min, max));
            return Math.floor(Math.random() * (hi - lo + 1)) + lo;
        } catch (e) {
            return 0;
        }
    }

    mathIsPrime (args) {
        if (!args) return false;
        try {
            const n = Cast.toNumber(args.VALUE);
            if (n < 2 || !Number.isInteger(n)) return false;
            if (n === 2) return true;
            if (n % 2 === 0) return false;
            const limit = Math.sqrt(n);
            for (let i = 3; i <= limit; i += 2) {
                if (n % i === 0) return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    mathFactorial (args) {
        if (!args) return 0;
        try {
            const n = Cast.toNumber(args.VALUE);
            if (n < 0 || !Number.isInteger(n)) return 0;
            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;
            return result;
        } catch (e) {
            return 0;
        }
    }

    mathGCD (args) {
        if (!args) return 0;
        try {
            let a = Math.abs(Cast.toNumber(args.A));
            let b = Math.abs(Cast.toNumber(args.B));
            while (b) {
                const t = b;
                b = a % b;
                a = t;
            }
            return a;
        } catch (e) {
            return 0;
        }
    }

    mathLCM (args) {
        if (!args) return 0;
        try {
            const a = Math.abs(Cast.toNumber(args.A));
            const b = Math.abs(Cast.toNumber(args.B));
            if (a === 0 || b === 0) return 0;
            return (a / this.mathGCD(args)) * b;
        } catch (e) {
            return 0;
        }
    }

    mathDegToRad (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.DEG) * Math.PI / 180;
        } catch (e) {
            return 0;
        }
    }

    mathRadToDeg (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.RAD) * 180 / Math.PI;
        } catch (e) {
            return 0;
        }
    }

    mathLog (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const base = Cast.toNumber(args.BASE);
            if (val <= 0 || base <= 0 || base === 1) return 0;
            return Math.log(val) / Math.log(base);
        } catch (e) {
            return 0;
        }
    }

    mathHypot (args) {
        if (!args) return 0;
        try {
            return Math.hypot(Cast.toNumber(args.A), Cast.toNumber(args.B));
        } catch (e) {
            return 0;
        }
    }

    mathIsEven (args) {
        if (!args) return false;
        try {
            return Cast.toNumber(args.VALUE) % 2 === 0;
        } catch (e) {
            return false;
        }
    }

    mathIsOdd (args) {
        if (!args) return false;
        try {
            return Cast.toNumber(args.VALUE) % 2 !== 0;
        } catch (e) {
            return false;
        }
    }

    mathIsInteger (args) {
        if (!args) return false;
        try {
            return Number.isInteger(Cast.toNumber(args.VALUE));
        } catch (e) {
            return false;
        }
    }

    mathToBinary (args) {
        if (!args) return '0';
        try {
            return Cast.toNumber(args.VALUE).toString(2);
        } catch (e) {
            return '0';
        }
    }

    mathToHex (args) {
        if (!args) return '0';
        try {
            return Cast.toNumber(args.VALUE).toString(16);
        } catch (e) {
            return '0';
        }
    }

    mathToOctal (args) {
        if (!args) return '0';
        try {
            return Cast.toNumber(args.VALUE).toString(8);
        } catch (e) {
            return '0';
        }
    }

    mathFromBinary (args) {
        if (!args) return 0;
        try {
            return parseInt(Cast.toString(args.STR), 2);
        } catch (e) {
            return 0;
        }
    }

    mathFromHex (args) {
        if (!args) return 0;
        try {
            return parseInt(Cast.toString(args.STR), 16);
        } catch (e) {
            return 0;
        }
    }

    mathBitwiseAND (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.A) & Cast.toNumber(args.B);
        } catch (e) {
            return 0;
        }
    }

    mathBitwiseOR (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.A) | Cast.toNumber(args.B);
        } catch (e) {
            return 0;
        }
    }

    mathBitwiseXOR (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.A) ^ Cast.toNumber(args.B);
        } catch (e) {
            return 0;
        }
    }

    mathBitwiseNOT (args) {
        if (!args) return 0;
        try {
            return ~Cast.toNumber(args.A);
        } catch (e) {
            return 0;
        }
    }

    mathBitwiseShift (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.A) << Cast.toNumber(args.B);
        } catch (e) {
            return 0;
        }
    }

    mathStandardDeviation (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const nums = list.map(n => Cast.toNumber(n));
            const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
            const variance = nums.reduce((s, n) => s + (n - mean) * (n - mean), 0) / nums.length;
            return Math.sqrt(variance);
        } catch (e) {
            return 0;
        }
    }

    mathMode (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const freq = {};
            let maxFreq = 0;
            let mode = list[0];
            for (const item of list) {
                const val = Cast.toString(item);
                freq[val] = (freq[val] || 0) + 1;
                if (freq[val] > maxFreq) {
                    maxFreq = freq[val];
                    mode = item;
                }
            }
            return mode;
        } catch (e) {
            return 0;
        }
    }

    mathRange (args) {
        if (!args) return 0;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return 0;
            const nums = list.map(n => Cast.toNumber(n));
            return Math.max(...nums) - Math.min(...nums);
        } catch (e) {
            return 0;
        }
    }

    mathVectorLength (args) {
        if (!args) return 0;
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            return Math.sqrt(x * x + y * y);
        } catch (e) {
            return 0;
        }
    }

    mathVectorAngle (args) {
        if (!args) return 0;
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            return Math.atan2(y, x) * 180 / Math.PI;
        } catch (e) {
            return 0;
        }
    }

    mathDotProduct (args) {
        if (!args) return 0;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            return x1 * x2 + y1 * y2;
        } catch (e) {
            return 0;
        }
    }

    mathConstants (args) {
        if (!args) return 0;
        try {
            const name = Cast.toString(args.CONST);
            return CONSTANTS[name] !== undefined ? CONSTANTS[name] : 0;
        } catch (e) {
            return 0;
        }
    }

    mathIsFinite (args) {
        if (!args) return false;
        try {
            const val = Cast.toNumber(args.VALUE);
            return isFinite(val);
        } catch (e) {
            return false;
        }
    }

    mathIsNaN (args) {
        if (!args) return false;
        try {
            const val = Cast.toNumber(args.VALUE);
            return isNaN(val);
        } catch (e) {
            return false;
        }
    }

    mathPercent (args) {
        if (!args) return 0;
        try {
            const part = Cast.toNumber(args.PART);
            const whole = Cast.toNumber(args.WHOLE);
            if (whole === 0) return 0;
            return (part / whole) * 100;
        } catch (e) {
            return 0;
        }
    }

    mathWeightedRandom (args) {
        if (!args) return 0;
        try {
            const weights = JSON.parse(Cast.toString(args.WEIGHTS));
            if (!Array.isArray(weights) || weights.length === 0) return 0;
            const total = weights.reduce((s, w) => s + Math.max(0, Cast.toNumber(w)), 0);
            if (total <= 0) return 0;
            let r = Math.random() * total;
            for (let i = 0; i < weights.length; i++) {
                r -= Math.max(0, Cast.toNumber(weights[i]));
                if (r <= 0) return i;
            }
            return weights.length - 1;
        } catch (e) {
            return 0;
        }
    }

    mathCbrt (args) {
        if (!args) return 0;
        try {
            return Math.cbrt(Cast.toNumber(args.VALUE));
        } catch (e) {
            return 0;
        }
    }

    mathHypot3 (args) {
        if (!args) return 0;
        try {
            return Math.hypot(
                Cast.toNumber(args.A),
                Cast.toNumber(args.B),
                Cast.toNumber(args.C)
            );
        } catch (e) {
            return 0;
        }
    }

    mathLog2 (args) {
        if (!args) return 0;
        try {
            return Math.log2(Cast.toNumber(args.VALUE));
        } catch (e) {
            return 0;
        }
    }

    mathLog10 (args) {
        if (!args) return 0;
        try {
            return Math.log10(Cast.toNumber(args.VALUE));
        } catch (e) {
            return 0;
        }
    }

    mathExp (args) {
        if (!args) return 0;
        try {
            return Math.exp(Cast.toNumber(args.VALUE));
        } catch (e) {
            return 0;
        }
    }

    mathSigmoid (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            return 1 / (1 + Math.exp(-val));
        } catch (e) {
            return 0;
        }
    }

    mathCombination (args) {
        if (!args) return 0;
        try {
            const n = Cast.toNumber(args.N);
            const k = Cast.toNumber(args.K);
            if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) return 0;
            if (k === 0 || k === n) return 1;
            if (k > n - k) return this.mathCombination({N: n, K: n - k});
            let result = 1;
            for (let i = 1; i <= k; i++) {
                result = result * (n - k + i) / i;
            }
            return result;
        } catch (e) {
            return 0;
        }
    }

    mathPermutation (args) {
        if (!args) return 0;
        try {
            const n = Cast.toNumber(args.N);
            const k = Cast.toNumber(args.K);
            if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) return 0;
            let result = 1;
            for (let i = n; i > n - k; i--) {
                result *= i;
            }
            return result;
        } catch (e) {
            return 0;
        }
    }

    mathDegToDMS (args) {
        if (!args) return '';
        try {
            let deg = Cast.toNumber(args.DEG);
            const sign = deg < 0 ? '-' : '';
            deg = Math.abs(deg);
            const d = Math.floor(deg);
            const min = Math.floor((deg - d) * 60);
            const sec = Math.round(((deg - d) * 60 - min) * 60);
            return `${sign}${d}°${min}'${sec}"`;
        } catch (e) {
            return '';
        }
    }

    mathRandomSeed (args) {
        if (!args) return;
        try {
            this._seed = Cast.toNumber(args.SEED);
            if (this._seed <= 0) this._seed = 1;
            if (this._seed >= 2147483647) this._seed = 2147483646;
        } catch (e) {
            log.warn('mathRandomSeed error:', e);
        }
    }

    mathRandomSeeded () {
        try {
            return this._seedRand();
        } catch (e) {
            return 0;
        }
    }

    mathCelsiusToFahrenheit (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.C) * 9 / 5 + 32;
        } catch (e) {
            return 0;
        }
    }

    mathFahrenheitToCelsius (args) {
        if (!args) return 0;
        try {
            return (Cast.toNumber(args.F) - 32) * 5 / 9;
        } catch (e) {
            return 0;
        }
    }

    mathKmToMiles (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.KM) * 0.621371;
        } catch (e) {
            return 0;
        }
    }

    mathMilesToKm (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.MILES) / 0.621371;
        } catch (e) {
            return 0;
        }
    }

    mathKgToLbs (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.KG) * 2.20462;
        } catch (e) {
            return 0;
        }
    }

    mathLbsToKg (args) {
        if (!args) return 0;
        try {
            return Cast.toNumber(args.LBS) / 2.20462;
        } catch (e) {
            return 0;
        }
    }

    mathAngleBetween (args) {
        if (!args) return 0;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        } catch (e) {
            return 0;
        }
    }

    mathDistance3D (args) {
        if (!args) return 0;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const z1 = Cast.toNumber(args.Z1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            const z2 = Cast.toNumber(args.Z2);
            return Math.sqrt(
                (x2 - x1) * (x2 - x1) +
                (y2 - y1) * (y2 - y1) +
                (z2 - z1) * (z2 - z1)
            );
        } catch (e) {
            return 0;
        }
    }

    mathMirror (args) {
        if (!args) return 0;
        try {
            const value = Cast.toNumber(args.VALUE);
            const center = Cast.toNumber(args.CENTER);
            return 2 * center - value;
        } catch (e) {
            return 0;
        }
    }

    mathScale (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const fMin = Cast.toNumber(args.FROM_MIN);
            const fMax = Cast.toNumber(args.FROM_MAX);
            const tMin = Cast.toNumber(args.TO_MIN);
            const tMax = Cast.toNumber(args.TO_MAX);
            const range = fMax - fMin;
            if (range === 0) return tMin;
            return tMin + ((val - fMin) / range) * (tMax - tMin);
        } catch (e) {
            return 0;
        }
    }

    mathIsPositive (args) {
        if (!args) return false;
        try {
            return Cast.toNumber(args.VALUE) > 0;
        } catch (e) {
            return false;
        }
    }

    mathIsNegative (args) {
        if (!args) return false;
        try {
            return Cast.toNumber(args.VALUE) < 0;
        } catch (e) {
            return false;
        }
    }

    mathIsZero (args) {
        if (!args) return false;
        try {
            return Cast.toNumber(args.VALUE) === 0;
        } catch (e) {
            return false;
        }
    }

    mathIsMultiple (args) {
        if (!args) return false;
        try {
            const val = Cast.toNumber(args.VALUE);
            const of = Cast.toNumber(args.OF);
            if (of === 0) return false;
            return val % of === 0;
        } catch (e) {
            return false;
        }
    }

    mathNearestMultiple (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const of = Cast.toNumber(args.OF);
            if (of === 0) return val;
            return Math.round(val / of) * of;
        } catch (e) {
            return 0;
        }
    }

    mathWrappingAdd (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const add = Cast.toNumber(args.ADD);
            const min = Cast.toNumber(args.MIN);
            const max = Cast.toNumber(args.MAX);
            const range = max - min;
            if (range === 0) return min;
            let result = val + add;
            while (result < min) result += range;
            while (result > max) result -= range;
            return result;
        } catch (e) {
            return 0;
        }
    }

    mathWrappingSub (args) {
        if (!args) return 0;
        try {
            const val = Cast.toNumber(args.VALUE);
            const sub = Cast.toNumber(args.SUB);
            const min = Cast.toNumber(args.MIN);
            const max = Cast.toNumber(args.MAX);
            const range = max - min;
            if (range === 0) return min;
            let result = val - sub;
            while (result < min) result += range;
            while (result > max) result -= range;
            return result;
        } catch (e) {
            return 0;
        }
    }

    mathTriangleArea (args) {
        if (!args) return 0;
        try {
            const base = Cast.toNumber(args.BASE);
            const height = Cast.toNumber(args.HEIGHT);
            return 0.5 * base * height;
        } catch (e) {
            return 0;
        }
    }

    mathCircleArea (args) {
        if (!args) return 0;
        try {
            const r = Cast.toNumber(args.RADIUS);
            return Math.PI * r * r;
        } catch (e) {
            return 0;
        }
    }

    mathCircleCircumference (args) {
        if (!args) return 0;
        try {
            const r = Cast.toNumber(args.RADIUS);
            return 2 * Math.PI * r;
        } catch (e) {
            return 0;
        }
    }

    mathRectangleArea (args) {
        if (!args) return 0;
        try {
            const w = Cast.toNumber(args.W);
            const h = Cast.toNumber(args.H);
            return w * h;
        } catch (e) {
            return 0;
        }
    }

    mathSphereVolume (args) {
        if (!args) return 0;
        try {
            const r = Cast.toNumber(args.RADIUS);
            return (4 / 3) * Math.PI * Math.pow(r, 3);
        } catch (e) {
            return 0;
        }
    }

    mathCylinderVolume (args) {
        if (!args) return 0;
        try {
            const r = Cast.toNumber(args.RADIUS);
            const h = Cast.toNumber(args.HEIGHT);
            return Math.PI * r * r * h;
        } catch (e) {
            return 0;
        }
    }

    mathPyramidVolume (args) {
        if (!args) return 0;
        try {
            const base = Cast.toNumber(args.BASE);
            const height = Cast.toNumber(args.HEIGHT);
            return (1 / 3) * base * height;
        } catch (e) {
            return 0;
        }
    }

    mathPythagorean (args) {
        if (!args) return 0;
        try {
            const a = Cast.toNumber(args.A);
            const b = Cast.toNumber(args.B);
            return Math.sqrt(a * a + b * b);
        } catch (e) {
            return 0;
        }
    }

    mathComplex (args) {
        if (!args) return '{"re":0,"im":0}';
        try {
            const re = Cast.toNumber(args.RE);
            const im = Cast.toNumber(args.IM);
            return JSON.stringify({re, im});
        } catch (e) {
            return '{"re":0,"im":0}';
        }
    }

    mathComplexAdd (args) {
        if (!args) return '{"re":0,"im":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            return JSON.stringify({re: a.re + b.re, im: a.im + b.im});
        } catch (e) {
            return '{"re":0,"im":0}';
        }
    }

    mathComplexSub (args) {
        if (!args) return '{"re":0,"im":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            return JSON.stringify({re: a.re - b.re, im: a.im - b.im});
        } catch (e) {
            return '{"re":0,"im":0}';
        }
    }

    mathComplexMul (args) {
        if (!args) return '{"re":0,"im":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            return JSON.stringify({re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re});
        } catch (e) {
            return '{"re":0,"im":0}';
        }
    }

    mathComplexDiv (args) {
        if (!args) return '{"re":0,"im":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            const denom = b.re * b.re + b.im * b.im;
            if (denom === 0) return '{"re":0,"im":0}';
            return JSON.stringify({
                re: (a.re * b.re + a.im * b.im) / denom,
                im: (a.im * b.re - a.re * b.im) / denom
            });
        } catch (e) {
            return '{"re":0,"im":0}';
        }
    }

    mathComplexAbs (args) {
        if (!args) return 0;
        try {
            const a = JSON.parse(Cast.toString(args.A));
            return Math.sqrt(a.re * a.re + a.im * a.im);
        } catch (e) {
            return 0;
        }
    }

    mathComplexArg (args) {
        if (!args) return 0;
        try {
            const a = JSON.parse(Cast.toString(args.A));
            return Math.atan2(a.im, a.re) * 180 / Math.PI;
        } catch (e) {
            return 0;
        }
    }

    mathComplexConj (args) {
        if (!args) return '{"re":0,"im":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            return JSON.stringify({re: a.re, im: -a.im});
        } catch (e) {
            return '{"re":0,"im":0}';
        }
    }

    mathMatrixCreate (args) {
        if (!args) return '[]';
        try {
            const rows = Cast.toNumber(args.ROWS);
            const cols = Cast.toNumber(args.COLS);
            const value = Cast.toNumber(args.VALUE);
            const m = [];
            for (let r = 0; r < rows; r++) {
                const row = [];
                for (let c = 0; c < cols; c++) {
                    row.push(value);
                }
                m.push(row);
            }
            return JSON.stringify(m);
        } catch (e) {
            return '[]';
        }
    }

    mathMatrixIdentity (args) {
        if (!args) return '[]';
        try {
            const size = Cast.toNumber(args.SIZE);
            const m = [];
            for (let r = 0; r < size; r++) {
                const row = [];
                for (let c = 0; c < size; c++) {
                    row.push(r === c ? 1 : 0);
                }
                m.push(row);
            }
            return JSON.stringify(m);
        } catch (e) {
            return '[]';
        }
    }

    mathMatrixAdd (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            const m = [];
            for (let r = 0; r < a.length; r++) {
                const row = [];
                for (let c = 0; c < a[r].length; c++) {
                    row.push(a[r][c] + b[r][c]);
                }
                m.push(row);
            }
            return JSON.stringify(m);
        } catch (e) {
            return '[]';
        }
    }

    mathMatrixMul (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            const rowsA = a.length, colsA = a[0].length, colsB = b[0].length;
            const m = [];
            for (let r = 0; r < rowsA; r++) {
                const row = [];
                for (let c = 0; c < colsB; c++) {
                    let sum = 0;
                    for (let k = 0; k < colsA; k++) {
                        sum += a[r][k] * b[k][c];
                    }
                    row.push(sum);
                }
                m.push(row);
            }
            return JSON.stringify(m);
        } catch (e) {
            return '[]';
        }
    }

    mathMatrixTranspose (args) {
        if (!args) return '[]';
        try {
            const m = JSON.parse(Cast.toString(args.M));
            const rows = m.length, cols = m[0].length;
            const result = [];
            for (let c = 0; c < cols; c++) {
                const row = [];
                for (let r = 0; r < rows; r++) {
                    row.push(m[r][c]);
                }
                result.push(row);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    mathMatrixDeterminant (args) {
        if (!args) return 0;
        try {
            const m = JSON.parse(Cast.toString(args.M));
            const n = m.length;
            if (n === 2) {
                return m[0][0] * m[1][1] - m[0][1] * m[1][0];
            }
            if (n === 3) {
                return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
                     - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                     + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    mathMatrixInverse (args) {
        if (!args) return '';
        try {
            const m = JSON.parse(Cast.toString(args.M));
            const n = m.length;
            if (n === 2) {
                const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
                if (det === 0) return '';
                return JSON.stringify([
                    [m[1][1] / det, -m[0][1] / det],
                    [-m[1][0] / det, m[0][0] / det]
                ]);
            }
            if (n === 3) {
                const a = m[0][0], b = m[0][1], c = m[0][2];
                const d = m[1][0], e = m[1][1], f = m[1][2];
                const g = m[2][0], h = m[2][1], i = m[2][2];
                const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
                if (det === 0) return '';
                return JSON.stringify([
                    [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det],
                    [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
                    [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det]
                ]);
            }
            return '';
        } catch (e) {
            return '';
        }
    }

    mathMatrixScale (args) {
        if (!args) return '[]';
        try {
            const m = JSON.parse(Cast.toString(args.M));
            const scalar = Cast.toNumber(args.SCALAR);
            const result = [];
            for (let r = 0; r < m.length; r++) {
                const row = [];
                for (let c = 0; c < m[r].length; c++) {
                    row.push(m[r][c] * scalar);
                }
                result.push(row);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    mathRandomNormal (args) {
        if (!args) return 0;
        try {
            const mean = Cast.toNumber(args.MEAN);
            const std = Cast.toNumber(args.STD);
            const u1 = Math.random();
            const u2 = Math.random();
            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * std + mean;
        } catch (e) {
            return 0;
        }
    }

    mathRandomPoisson (args) {
        if (!args) return 0;
        try {
            const lambda = Cast.toNumber(args.LAMBDA);
            const L = Math.exp(-lambda);
            let k = 0;
            let p = 1;
            do {
                k++;
                p *= Math.random();
            } while (p > L);
            return k - 1;
        } catch (e) {
            return 0;
        }
    }

    mathRandomExponential (args) {
        if (!args) return 0;
        try {
            const lambda = Cast.toNumber(args.LAMBDA);
            if (lambda <= 0) return 0;
            return -Math.log(Math.random()) / lambda;
        } catch (e) {
            return 0;
        }
    }

    mathZScore (args) {
        if (!args) return 0;
        try {
            const value = Cast.toNumber(args.VALUE);
            const mean = Cast.toNumber(args.MEAN);
            const std = Cast.toNumber(args.STD);
            if (std === 0) return 0;
            return (value - mean) / std;
        } catch (e) {
            return 0;
        }
    }

    mathCorrelation (args) {
        if (!args) return 0;
        try {
            const listA = JSON.parse(Cast.toString(args.LIST_A));
            const listB = JSON.parse(Cast.toString(args.LIST_B));
            if (!Array.isArray(listA) || !Array.isArray(listB) || listA.length !== listB.length || listA.length === 0) return 0;
            const n = listA.length;
            const a = listA.map(v => Cast.toNumber(v));
            const b = listB.map(v => Cast.toNumber(v));
            const meanA = a.reduce((s, v) => s + v, 0) / n;
            const meanB = b.reduce((s, v) => s + v, 0) / n;
            let num = 0, denA = 0, denB = 0;
            for (let i = 0; i < n; i++) {
                const da = a[i] - meanA;
                const db = b[i] - meanB;
                num += da * db;
                denA += da * da;
                denB += db * db;
            }
            const den = Math.sqrt(denA * denB);
            return den === 0 ? 0 : num / den;
        } catch (e) {
            return 0;
        }
    }

    mathCovariance (args) {
        if (!args) return 0;
        try {
            const listA = JSON.parse(Cast.toString(args.LIST_A));
            const listB = JSON.parse(Cast.toString(args.LIST_B));
            if (!Array.isArray(listA) || !Array.isArray(listB) || listA.length !== listB.length || listA.length === 0) return 0;
            const n = listA.length;
            const a = listA.map(v => Cast.toNumber(v));
            const b = listB.map(v => Cast.toNumber(v));
            const meanA = a.reduce((s, v) => s + v, 0) / n;
            const meanB = b.reduce((s, v) => s + v, 0) / n;
            let cov = 0;
            for (let i = 0; i < n; i++) {
                cov += (a[i] - meanA) * (b[i] - meanB);
            }
            return cov / n;
        } catch (e) {
            return 0;
        }
    }

    mathLinearRegression (args) {
        if (!args) return '{}';
        try {
            const xList = JSON.parse(Cast.toString(args.X_LIST));
            const yList = JSON.parse(Cast.toString(args.Y_LIST));
            if (!Array.isArray(xList) || !Array.isArray(yList) || xList.length !== yList.length || xList.length === 0) return '{}';
            const n = xList.length;
            const x = xList.map(v => Cast.toNumber(v));
            const y = yList.map(v => Cast.toNumber(v));
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
            for (let i = 0; i < n; i++) {
                sumX += x[i];
                sumY += y[i];
                sumXY += x[i] * y[i];
                sumX2 += x[i] * x[i];
                sumY2 += y[i] * y[i];
            }
            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            const num = n * sumXY - sumX * sumY;
            const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
            const rSquared = den === 0 ? 0 : (num / den) * (num / den);
            return JSON.stringify({slope, intercept, rSquared});
        } catch (e) {
            return '{}';
        }
    }

    mathIntegrate (args) {
        if (!args) return 0;
        try {
            const a = Cast.toNumber(args.FN_A);
            const b = Cast.toNumber(args.FN_B);
            const steps = Cast.toNumber(args.STEPS);
            if (steps <= 0) return 0;
            return (a + b) * steps / 2;
        } catch (e) {
            return 0;
        }
    }

    mathDerivative (args) {
        if (!args) return 0;
        try {
            const x = Cast.toNumber(args.X);
            const h = Cast.toNumber(args.H);
            if (h === 0) return 0;
            const f = v => v * v;
            return (f(x + h) - f(x)) / h;
        } catch (e) {
            return 0;
        }
    }

    mathNewtonRoot (args) {
        if (!args) return 0;
        try {
            const initial = Cast.toNumber(args.INITIAL);
            const steps = Cast.toNumber(args.STEPS);
            let x = initial;
            for (let i = 0; i < steps; i++) {
                x = (x + initial / x) / 2;
            }
            return x;
        } catch (e) {
            return 0;
        }
    }

    mathSpline (args) {
        if (!args) return 0;
        try {
            const xList = JSON.parse(Cast.toString(args.X_LIST));
            const yList = JSON.parse(Cast.toString(args.Y_LIST));
            const t = Cast.toNumber(args.T);
            if (!Array.isArray(xList) || !Array.isArray(yList) || xList.length !== yList.length || xList.length < 2) return 0;
            const x = xList.map(v => Cast.toNumber(v));
            const y = yList.map(v => Cast.toNumber(v));
            const target = x[0] + t * (x[x.length - 1] - x[0]);
            if (target <= x[0]) return y[0];
            if (target >= x[x.length - 1]) return y[y.length - 1];
            for (let i = 0; i < x.length - 1; i++) {
                if (target >= x[i] && target <= x[i + 1]) {
                    const frac = (target - x[i]) / (x[i + 1] - x[i]);
                    return y[i] + frac * (y[i + 1] - y[i]);
                }
            }
            return y[y.length - 1];
        } catch (e) {
            return 0;
        }
    }

    mathGamma (args) {
        if (!args) return 0;
        try {
            const z = Cast.toNumber(args.VALUE);
            if (z <= 0) return 0;
            return (z - 0.5) * Math.log(z) - z + 0.5 * Math.log(2 * Math.PI);
        } catch (e) {
            return 0;
        }
    }

    mathVec3Create (args) {
        if (!args) return '{"x":0,"y":0,"z":0}';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const z = Cast.toNumber(args.Z);
            return JSON.stringify({x, y, z});
        } catch (e) {
            return '{"x":0,"y":0,"z":0}';
        }
    }

    mathVec3Add (args) {
        if (!args) return '{"x":0,"y":0,"z":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            return JSON.stringify({x: a.x + b.x, y: a.y + b.y, z: a.z + b.z});
        } catch (e) {
            return '{"x":0,"y":0,"z":0}';
        }
    }

    mathVec3Sub (args) {
        if (!args) return '{"x":0,"y":0,"z":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            return JSON.stringify({x: a.x - b.x, y: a.y - b.y, z: a.z - b.z});
        } catch (e) {
            return '{"x":0,"y":0,"z":0}';
        }
    }

    mathVec3Dot (args) {
        if (!args) return 0;
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            return a.x * b.x + a.y * b.y + a.z * b.z;
        } catch (e) {
            return 0;
        }
    }

    mathVec3Cross (args) {
        if (!args) return '{"x":0,"y":0,"z":0}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            return JSON.stringify({
                x: a.y * b.z - a.z * b.y,
                y: a.z * b.x - a.x * b.z,
                z: a.x * b.y - a.y * b.x
            });
        } catch (e) {
            return '{"x":0,"y":0,"z":0}';
        }
    }

    mathVec3Length (args) {
        if (!args) return 0;
        try {
            const v = JSON.parse(Cast.toString(args.V));
            return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        } catch (e) {
            return 0;
        }
    }

    mathVec3Normalize (args) {
        if (!args) return '{"x":0,"y":0,"z":0}';
        try {
            const v = JSON.parse(Cast.toString(args.V));
            const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
            if (len === 0) return '{"x":0,"y":0,"z":0}';
            return JSON.stringify({x: v.x / len, y: v.y / len, z: v.z / len});
        } catch (e) {
            return '{"x":0,"y":0,"z":0}';
        }
    }
}

module.exports = ScratchProMathBlocks;
