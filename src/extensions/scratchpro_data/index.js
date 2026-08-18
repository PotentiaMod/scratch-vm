const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iI0ZGOEMxQSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkQ8L3RleHQ+PC9zdmc+';

class ScratchProDataBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'scratchprodata',
            name: 'Data',
            blockIconURI: blockIconURI,
            color1: '#FF8C1A',
            color2: '#DB6E00',
            color3: '#B85C00',
            blocks: [
                {
                    opcode: 'arrayFromJSON',
                    blockType: BlockType.REPORTER,
                    text: 'array from JSON [JSON]',
                    arguments: {
                        JSON: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'}
                    },
                    doc: {
                        description: 'Parses a JSON string into an array.',
                        returns: 'string',
                        example: 'array from JSON "[1,2,3]" => "[1,2,3]"',
                        arguments: {
                            JSON: 'JSON string representing an array'
                        }
                    }
                },
                {
                    opcode: 'arrayFromRange',
                    blockType: BlockType.REPORTER,
                    text: 'array from [START] to [END]',
                    arguments: {
                        START: {type: ArgumentType.NUMBER, defaultValue: 1},
                        END: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Generates an inclusive array of numbers from START to END.',
                        returns: 'string',
                        example: 'array from 1 to 5 => "[1,2,3,4,5]" | array from 5 to 1 => "[5,4,3,2,1]"',
                        arguments: {
                            START: 'First number in the range',
                            END: 'Last number in the range'
                        }
                    }
                },
                {
                    opcode: 'arrayMap',
                    blockType: BlockType.REPORTER,
                    text: 'map [LIST] with [TRANSFORM]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'},
                        TRANSFORM: {type: ArgumentType.STRING, defaultValue: 'n=>n*2'}
                    },
                    doc: {
                        description: 'Applies a transform function to every element of an array.',
                        returns: 'string',
                        example: 'map [1,2,3] with "n=>n*2" => "[2,4,6]"',
                        arguments: {
                            LIST: 'JSON array to transform',
                            TRANSFORM: 'Arrow function expression (e.g., n=>n*2)'
                        }
                    }
                },
                {
                    opcode: 'arrayFilter',
                    blockType: BlockType.REPORTER,
                    text: 'filter [LIST] where [PREDICATE]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        PREDICATE: {type: ArgumentType.STRING, defaultValue: 'n=>n>2'}
                    },
                    doc: {
                        description: 'Filters array elements that satisfy a predicate function.',
                        returns: 'string',
                        example: 'filter [1,2,3,4,5] where "n=>n>2" => "[3,4,5]"',
                        arguments: {
                            LIST: 'JSON array to filter',
                            PREDICATE: 'Arrow function returning boolean (e.g., n=>n>2)'
                        }
                    }
                },
                {
                    opcode: 'arraySort',
                    blockType: BlockType.REPORTER,
                    text: 'sort [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[3,1,4,1,5]'}
                    },
                    doc: {
                        description: 'Sorts an array of numbers in ascending order.',
                        returns: 'string',
                        example: 'sort [3,1,4,1,5] => "[1,1,3,4,5]"',
                        arguments: {
                            LIST: 'JSON array of numbers to sort'
                        }
                    }
                },
                {
                    opcode: 'arrayReverse',
                    blockType: BlockType.REPORTER,
                    text: 'reverse [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4]'}
                    },
                    doc: {
                        description: 'Reverses the order of elements in an array.',
                        returns: 'string',
                        example: 'reverse [1,2,3,4] => "[4,3,2,1]"',
                        arguments: {
                            LIST: 'JSON array to reverse'
                        }
                    }
                },
                {
                    opcode: 'arrayFlatten',
                    blockType: BlockType.REPORTER,
                    text: 'flatten [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[[1,2],[3,[4]]]'}
                    },
                    doc: {
                        description: 'Flattens a nested array one level deep.',
                        returns: 'string',
                        example: 'flatten [[1,2],[3,[4]]] => "[1,2,3,[4]]"',
                        arguments: {
                            LIST: 'JSON array with nested arrays'
                        }
                    }
                },
                '---',
                {
                    opcode: 'dictCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create empty dict',
                    arguments: {},
                    doc: {
                        description: 'Creates a new empty dictionary (object).',
                        returns: 'string',
                        example: 'create empty dict => "{}"'
                    }
                },
                {
                    opcode: 'dictSet',
                    blockType: BlockType.REPORTER,
                    text: 'set [KEY] = [VALUE] in [DICT]',
                    arguments: {
                        DICT: {type: ArgumentType.STRING, defaultValue: '{}'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'},
                        VALUE: {type: ArgumentType.STRING, defaultValue: 'value'}
                    },
                    doc: {
                        description: 'Sets a key-value pair in a dictionary.',
                        returns: 'string',
                        example: 'set "name" = "Alice" in "{}" => "{\\"name\\":\\"Alice\\"}"',
                        arguments: {
                            DICT: 'JSON dictionary (object)',
                            KEY: 'The key to set',
                            VALUE: 'The value to assign'
                        }
                    }
                },
                {
                    opcode: 'dictGet',
                    blockType: BlockType.REPORTER,
                    text: 'get [KEY] from [DICT]',
                    arguments: {
                        DICT: {type: ArgumentType.STRING, defaultValue: '{}'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'}
                    },
                    doc: {
                        description: 'Gets the value of a key from a dictionary.',
                        returns: 'string',
                        example: 'get "a" from "{\\"a\\":1}" => "1"',
                        arguments: {
                            DICT: 'JSON dictionary (object)',
                            KEY: 'The key to retrieve'
                        }
                    }
                },
                {
                    opcode: 'dictHas',
                    blockType: BlockType.BOOLEAN,
                    text: 'does [DICT] have [KEY]?',
                    arguments: {
                        DICT: {type: ArgumentType.STRING, defaultValue: '{"key":"val"}'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'}
                    },
                    doc: {
                        description: 'Checks if a key exists in a dictionary.',
                        returns: 'boolean',
                        example: 'does {"key":"val"} have "key"? => true',
                        arguments: {
                            DICT: 'JSON dictionary (object)',
                            KEY: 'The key to check for'
                        }
                    }
                },
                {
                    opcode: 'dictDelete',
                    blockType: BlockType.REPORTER,
                    text: 'delete [KEY] from [DICT]',
                    arguments: {
                        DICT: {type: ArgumentType.STRING, defaultValue: '{"a":1,"b":2}'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'a'}
                    },
                    doc: {
                        description: 'Deletes a key from a dictionary and returns the result.',
                        returns: 'string',
                        example: 'delete "a" from "{\\"a\\":1,\\"b\\":2}" => "{\\"b\\":2}"',
                        arguments: {
                            DICT: 'JSON dictionary (object)',
                            KEY: 'The key to delete'
                        }
                    }
                },
                {
                    opcode: 'dictKeys',
                    blockType: BlockType.REPORTER,
                    text: 'keys of [DICT]',
                    arguments: {
                        DICT: {type: ArgumentType.STRING, defaultValue: '{"a":1,"b":2}'}
                    },
                    doc: {
                        description: 'Returns an array of keys from a dictionary.',
                        returns: 'string',
                        example: 'keys of {"a":1,"b":2} => "["a","b"]"',
                        arguments: {
                            DICT: 'JSON dictionary (object)'
                        }
                    }
                },
                {
                    opcode: 'dictMerge',
                    blockType: BlockType.REPORTER,
                    text: 'merge [A] with [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"a":1}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"b":2}'}
                    },
                    doc: {
                        description: 'Merges two dictionaries (B overwrites A on conflicts).',
                        returns: 'string',
                        example: 'merge {"a":1} with {"b":2} => "{\\"a\\":1,\\"b\\":2}"',
                        arguments: {
                            A: 'First dictionary (base)',
                            B: 'Second dictionary (overrides)'
                        }
                    }
                },
                '---',
                {
                    opcode: 'dataParseCSV',
                    blockType: BlockType.REPORTER,
                    text: 'parse CSV [CSV]',
                    arguments: {
                        CSV: {type: ArgumentType.STRING, defaultValue: 'a,b\\n1,2'}
                    },
                    doc: {
                        description: 'Parses a CSV string into an array of row objects.',
                        returns: 'string',
                        example: 'parse CSV "a,b\\n1,2" => "[{\\"a\\":\\"1\\",\\"b\\":\\"2\\"}]"',
                        arguments: {
                            CSV: 'Comma-separated values string'
                        }
                    }
                },
                {
                    opcode: 'dataParseJSON',
                    blockType: BlockType.REPORTER,
                    text: 'parse JSON [JSON]',
                    arguments: {
                        JSON: {type: ArgumentType.STRING, defaultValue: '{"key":"value"}'}
                    },
                    doc: {
                        description: 'Parses a JSON string into a value.',
                        returns: 'any',
                        example: 'parse JSON "{"key":"value"}" => {key: "value"} (as Scratch value)',
                        arguments: {
                            JSON: 'JSON string to parse'
                        }
                    }
                },
                {
                    opcode: 'dataStringify',
                    blockType: BlockType.REPORTER,
                    text: 'stringify [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.STRING, defaultValue: '{"key":"value"}'}
                    },
                    doc: {
                        description: 'Converts a value to its JSON string representation.',
                        returns: 'string',
                        example: 'stringify {"key":"value"} => "{\\"key\\":\\"value\\"}"',
                        arguments: {
                            VALUE: 'The value to stringify'
                        }
                    }
                },
                {
                    opcode: 'dataUUID',
                    blockType: BlockType.REPORTER,
                    text: 'generate UUID',
                    arguments: {},
                    doc: {
                        description: 'Generates a random UUID v4 string.',
                        returns: 'string',
                        example: 'generate UUID => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" (varies)'
                    }
                },
                '---',
                {
                    opcode: 'setCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create set from [ITEMS]',
                    arguments: {
                        ITEMS: {type: ArgumentType.STRING, defaultValue: '[1,2,3,2,1]'}
                    },
                    doc: {
                        description: 'Creates a set (unique array) from an array of items.',
                        returns: 'string',
                        example: 'create set from [1,2,3,2,1] => "[1,2,3]"',
                        arguments: {
                            ITEMS: 'JSON array of items'
                        }
                    }
                },
                {
                    opcode: 'setAdd',
                    blockType: BlockType.REPORTER,
                    text: 'add [ITEM] to set [SET]',
                    arguments: {
                        SET: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'},
                        ITEM: {type: ArgumentType.STRING, defaultValue: '4'}
                    },
                    doc: {
                        description: 'Adds an item to a set (if not already present).',
                        returns: 'string',
                        example: 'add 4 to set [1,2,3] => "[1,2,3,4]"',
                        arguments: {
                            SET: 'JSON array representing a set',
                            ITEM: 'Item to add'
                        }
                    }
                },
                {
                    opcode: 'setHas',
                    blockType: BlockType.BOOLEAN,
                    text: 'does set [SET] have [ITEM]?',
                    arguments: {
                        SET: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'},
                        ITEM: {type: ArgumentType.STRING, defaultValue: '2'}
                    },
                    doc: {
                        description: 'Checks if an item exists in a set.',
                        returns: 'boolean',
                        example: 'does set [1,2,3] have 2? => true',
                        arguments: {
                            SET: 'JSON array representing a set',
                            ITEM: 'Item to check'
                        }
                    }
                },
                {
                    opcode: 'setSize',
                    blockType: BlockType.REPORTER,
                    text: 'size of set [SET]',
                    arguments: {
                        SET: {type: ArgumentType.STRING, defaultValue: '[1,2,3,3]'}
                    },
                    doc: {
                        description: 'Returns the number of unique elements in a set.',
                        returns: 'number',
                        example: 'size of set [1,2,3,3] => 3',
                        arguments: {
                            SET: 'JSON array representing a set'
                        }
                    }
                },
                {
                    opcode: 'setUnion',
                    blockType: BlockType.REPORTER,
                    text: 'union of set [A] and set [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[3,4,5]'}
                    },
                    doc: {
                        description: 'Returns the union of two sets (all unique items from both).',
                        returns: 'string',
                        example: 'union of set [1,2,3] and set [3,4,5] => "[1,2,3,4,5]"',
                        arguments: {
                            A: 'First set as JSON array',
                            B: 'Second set as JSON array'
                        }
                    }
                },
                {
                    opcode: 'setIntersection',
                    blockType: BlockType.REPORTER,
                    text: 'intersection of set [A] and set [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[2,3,4]'}
                    },
                    doc: {
                        description: 'Returns the intersection of two sets (items in both).',
                        returns: 'string',
                        example: 'intersection of set [1,2,3] and set [2,3,4] => "[2,3]"',
                        arguments: {
                            A: 'First set as JSON array',
                            B: 'Second set as JSON array'
                        }
                    }
                },
                {
                    opcode: 'setDifference',
                    blockType: BlockType.REPORTER,
                    text: 'difference of set [A] and set [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[2,3]'}
                    },
                    doc: {
                        description: 'Returns the set difference A - B (items in A but not B).',
                        returns: 'string',
                        example: 'difference of set [1,2,3] and set [2,3] => "[1]"',
                        arguments: {
                            A: 'First set as JSON array',
                            B: 'Second set as JSON array'
                        }
                    }
                },
                '---',
                {
                    opcode: 'dataShuffle',
                    blockType: BlockType.REPORTER,
                    text: 'shuffle [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'}
                    },
                    doc: {
                        description: 'Randomly shuffles the elements of an array (Fisher-Yates).',
                        returns: 'string',
                        example: 'shuffle [1,2,3,4,5] => "[3,1,5,2,4]" (varies)',
                        arguments: {
                            LIST: 'JSON array to shuffle'
                        }
                    }
                },
                {
                    opcode: 'dataSample',
                    blockType: BlockType.REPORTER,
                    text: 'sample [N] items from [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[10,20,30,40,50]'},
                        N: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Samples N random items without replacement from an array.',
                        returns: 'string',
                        example: 'sample 2 items from [10,20,30,40,50] => "[30,10]" (varies)',
                        arguments: {
                            LIST: 'JSON array to sample from',
                            N: 'Number of items to sample'
                        }
                    }
                },
                {
                    opcode: 'dataSortBy',
                    blockType: BlockType.REPORTER,
                    text: 'sort [LIST] by key [KEY]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[{"name":"Bob"},{"name":"Alice"}]'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'name'}
                    },
                    doc: {
                        description: 'Sorts an array of objects by a specified key alphabetically.',
                        returns: 'string',
                        example: 'sort [{"name":"Bob"},{"name":"Alice"}] by "name" => "[{"name":"Alice"},{"name":"Bob"}]"',
                        arguments: {
                            LIST: 'JSON array of objects',
                            KEY: 'The object key to sort by'
                        }
                    }
                },
                '---',
                {
                    opcode: 'zipCreate',
                    blockType: BlockType.REPORTER,
                    text: 'zip [KEYS] and [VALUES] to object',
                    arguments: {
                        KEYS: {type: ArgumentType.STRING, defaultValue: '["a","b","c"]'},
                        VALUES: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'}
                    },
                    doc: {
                        description: 'Combines a keys array and a values array into an object.',
                        returns: 'string',
                        example: 'zip ["a","b","c"] and [1,2,3] to object => "{\\"a\\":1,\\"b\\":2,\\"c\\":3}"',
                        arguments: {
                            KEYS: 'JSON array of keys',
                            VALUES: 'JSON array of values'
                        }
                    }
                },
                {
                    opcode: 'zipUnzip',
                    blockType: BlockType.REPORTER,
                    text: 'unzip [ITEMS] by key [KEY]',
                    arguments: {
                        ITEMS: {type: ArgumentType.STRING, defaultValue: '[{"a":1},{"a":2}]'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'a'}
                    },
                    doc: {
                        description: 'Extracts a single key from an array of objects into an array.',
                        returns: 'string',
                        example: 'unzip [{"a":1},{"a":2}] by "a" => "[1,2]"',
                        arguments: {
                            ITEMS: 'JSON array of objects',
                            KEY: 'The key to extract'
                        }
                    }
                },
                {
                    opcode: 'dataGroupBy',
                    blockType: BlockType.REPORTER,
                    text: 'group [LIST] by key [KEY]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[{"type":"a"},{"type":"b"},{"type":"a"}]'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'type'}
                    },
                    doc: {
                        description: 'Groups array elements by the value of a specified key.',
                        returns: 'string',
                        example: 'group [{"type":"a"},{"type":"b"},{"type":"a"}] by "type" => "{\\"a\\":[{\\"type\\":\\"a\\"},{\\"type\\":\\"a\\"}],\\"b\\":[{\\"type\\":\\"b\\"}]}"',
                        arguments: {
                            LIST: 'JSON array of objects',
                            KEY: 'The key to group by'
                        }
                    }
                },
                {
                    opcode: 'dataCountBy',
                    blockType: BlockType.REPORTER,
                    text: 'count [LIST] by key [KEY]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[{"x":"a"},{"x":"b"},{"x":"a"}]'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'x'}
                    },
                    doc: {
                        description: 'Counts occurrences of each distinct key value in an object array.',
                        returns: 'string',
                        example: 'count [{"x":"a"},{"x":"b"},{"x":"a"}] by "x" => "{\\"a\\":2,\\"b\\":1}"',
                        arguments: {
                            LIST: 'JSON array of objects',
                            KEY: 'The key to count by'
                        }
                    }
                },
                {
                    opcode: 'dataSortNumbers',
                    blockType: BlockType.REPORTER,
                    text: 'sort numbers ascending [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[3,1,4,1,5]'}
                    },
                    doc: {
                        description: 'Sorts an array of numbers in ascending order.',
                        returns: 'string',
                        example: 'sort numbers ascending [3,1,4,1,5] => "[1,1,3,4,5]"',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                },
                {
                    opcode: 'dataSortDescending',
                    blockType: BlockType.REPORTER,
                    text: 'sort numbers descending [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[3,1,4,1,5]'}
                    },
                    doc: {
                        description: 'Sorts an array of numbers in descending order.',
                        returns: 'string',
                        example: 'sort numbers descending [3,1,4,1,5] => "[5,4,3,1,1]"',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                },
                '---',
                {
                    opcode: 'dataUnique',
                    blockType: BlockType.REPORTER,
                    text: 'unique items of [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,2,3,3,3]'}
                    },
                    doc: {
                        description: 'Returns only the unique items from an array.',
                        returns: 'string',
                        example: 'unique items of [1,2,2,3,3,3] => "[1,2,3]"',
                        arguments: {
                            LIST: 'JSON array of items'
                        }
                    }
                },
                {
                    opcode: 'dataIntersection',
                    blockType: BlockType.REPORTER,
                    text: 'intersection of [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[3,4,5,6]'}
                    },
                    doc: {
                        description: 'Finds elements common to both arrays.',
                        returns: 'string',
                        example: 'intersection of [1,2,3,4] and [3,4,5,6] => "[3,4]"',
                        arguments: {
                            A: 'First JSON array',
                            B: 'Second JSON array'
                        }
                    }
                },
                {
                    opcode: 'dataDifference',
                    blockType: BlockType.REPORTER,
                    text: 'difference of [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[3,4,5,6]'}
                    },
                    doc: {
                        description: 'Finds elements in A that are not in B.',
                        returns: 'string',
                        example: 'difference of [1,2,3,4] and [3,4,5,6] => "[1,2]"',
                        arguments: {
                            A: 'First JSON array',
                            B: 'Second JSON array'
                        }
                    }
                },
                '---',
                {
                    opcode: 'dataChunk',
                    blockType: BlockType.REPORTER,
                    text: 'chunk [LIST] into size [SIZE]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5,6]'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Splits an array into chunks of a given size.',
                        returns: 'string',
                        example: 'chunk [1,2,3,4,5,6] into size 2 => "[[1,2],[3,4],[5,6]]"',
                        arguments: {
                            LIST: 'JSON array to split',
                            SIZE: 'Size of each chunk'
                        }
                    }
                },
                {
                    opcode: 'dataRotate',
                    blockType: BlockType.REPORTER,
                    text: 'rotate [LIST] by [N]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        N: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Rotates array elements by N positions (positive = right).',
                        returns: 'string',
                        example: 'rotate [1,2,3,4,5] by 2 => "[3,4,5,1,2]"',
                        arguments: {
                            LIST: 'JSON array to rotate',
                            N: 'Number of positions to rotate'
                        }
                    }
                },
                {
                    opcode: 'dataFibonacci',
                    blockType: BlockType.REPORTER,
                    text: 'first [N] fibonacci numbers',
                    arguments: {
                        N: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: {
                        description: 'Generates the first N numbers in the Fibonacci sequence.',
                        returns: 'string',
                        example: 'first 10 fibonacci numbers => "[0,1,1,2,3,5,8,13,21,34]"',
                        arguments: {
                            N: 'How many Fibonacci numbers to generate'
                        }
                    }
                },
                '---',
                {
                    opcode: 'dataMergeObjects',
                    blockType: BlockType.REPORTER,
                    text: 'deep merge [A] with [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"a":1,"b":{"c":2}}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"b":{"d":3},"e":4}'}
                    },
                    doc: {
                        description: 'Deeply merges two objects (nested properties are merged).',
                        returns: 'string',
                        example: 'deep merge {"a":1,"b":{"c":2}} with {"b":{"d":3},"e":4} => "{\\"a\\":1,\\"b\\":{\\"c\\":2,\\"d\\":3},\\"e\\":4}"',
                        arguments: {
                            A: 'Base object (JSON string)',
                            B: 'Override object (JSON string)'
                        }
                    }
                },
                {
                    opcode: 'dataCloneDeep',
                    blockType: BlockType.REPORTER,
                    text: 'deep clone [VALUE]',
                    arguments: {
                        VALUE: {type: ArgumentType.STRING, defaultValue: '{"a":[1,2,3]}'}
                    },
                    doc: {
                        description: 'Creates a deep copy of a value via JSON serialization.',
                        returns: 'string',
                        example: 'deep clone {"a":[1,2,3]} => "{"a":[1,2,3]}" (independent copy)',
                        arguments: {
                            VALUE: 'The value to clone (JSON string)'
                        }
                    }
                },
                {
                    opcode: 'dataCompareDeep',
                    blockType: BlockType.BOOLEAN,
                    text: 'deep equal [A] == [B]?',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '{"a":1}'},
                        B: {type: ArgumentType.STRING, defaultValue: '{"a":1}'}
                    },
                    doc: {
                        description: 'Checks if two values are deeply equal (string comparison).',
                        returns: 'boolean',
                        example: 'deep equal {"a":1} == {"a":1}? => true',
                        arguments: {
                            A: 'First value (JSON string)',
                            B: 'Second value (JSON string)'
                        }
                    }
                },
                '---',
                {
                    opcode: 'arrayIsEmpty',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [LIST] empty?',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[]'}
                    },
                    doc: {
                        description: 'Checks if an array has length zero.',
                        returns: 'boolean',
                        example: 'is [] empty? => true | is [1] empty? => false',
                        arguments: {
                            LIST: 'JSON array to check'
                        }
                    }
                },
                {
                    opcode: 'arrayContains',
                    blockType: BlockType.BOOLEAN,
                    text: 'does [LIST] contain [ITEM]?',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'},
                        ITEM: {type: ArgumentType.STRING, defaultValue: '2'}
                    },
                    doc: {
                        description: 'Checks if an array contains a specific item.',
                        returns: 'boolean',
                        example: 'does [1,2,3] contain 2? => true',
                        arguments: {
                            LIST: 'JSON array to search',
                            ITEM: 'Item to look for'
                        }
                    }
                },
                {
                    opcode: 'arrayFirst',
                    blockType: BlockType.REPORTER,
                    text: 'first of [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'}
                    },
                    doc: {
                        description: 'Returns the first element of an array.',
                        returns: 'any',
                        example: 'first of [1,2,3] => 1',
                        arguments: {
                            LIST: 'JSON array'
                        }
                    }
                },
                {
                    opcode: 'arrayLast',
                    blockType: BlockType.REPORTER,
                    text: 'last of [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3]'}
                    },
                    doc: {
                        description: 'Returns the last element of an array.',
                        returns: 'any',
                        example: 'last of [1,2,3] => 3',
                        arguments: {
                            LIST: 'JSON array'
                        }
                    }
                },
                {
                    opcode: 'arrayRandom',
                    blockType: BlockType.REPORTER,
                    text: 'random of [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'}
                    },
                    doc: {
                        description: 'Returns a random element from an array.',
                        returns: 'any',
                        example: 'random of [1,2,3] => 2 (varies)',
                        arguments: {
                            LIST: 'JSON array'
                        }
                    }
                },
                {
                    opcode: 'arraySlice',
                    blockType: BlockType.REPORTER,
                    text: 'slice [LIST] from [START] to [END]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        START: {type: ArgumentType.NUMBER, defaultValue: 1},
                        END: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Returns a shallow copy of a portion of an array from start to end (end exclusive).',
                        returns: 'string',
                        example: 'slice [1,2,3,4,5] from 1 to 3 => "[2,3]"',
                        arguments: {
                            LIST: 'JSON array',
                            START: 'Start index',
                            END: 'End index (exclusive)'
                        }
                    }
                },
                {
                    opcode: 'arrayConcat',
                    blockType: BlockType.REPORTER,
                    text: 'concat [A] and [B]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[1,2]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[3,4]'}
                    },
                    doc: {
                        description: 'Concatenates two arrays into one.',
                        returns: 'string',
                        example: 'concat [1,2] and [3,4] => "[1,2,3,4]"',
                        arguments: {
                            A: 'First JSON array',
                            B: 'Second JSON array'
                        }
                    }
                },
                {
                    opcode: 'arrayFill',
                    blockType: BlockType.REPORTER,
                    text: 'fill [VALUE] repeated [LENGTH] times',
                    arguments: {
                        VALUE: {type: ArgumentType.STRING, defaultValue: '0'},
                        LENGTH: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Creates an array of the given length filled with the specified value.',
                        returns: 'string',
                        example: 'fill 0 repeated 5 times => "[0,0,0,0,0]"',
                        arguments: {
                            VALUE: 'Value to fill with',
                            LENGTH: 'Length of the array'
                        }
                    }
                },
                {
                    opcode: 'arrayIndexes',
                    blockType: BlockType.REPORTER,
                    text: 'indexes 0 to [LENGTH] - 1',
                    arguments: {
                        LENGTH: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Creates an array of indexes from 0 to length-1.',
                        returns: 'string',
                        example: 'indexes 0 to 5 - 1 => "[0,1,2,3,4]"',
                        arguments: {
                            LENGTH: 'Number of indexes to generate'
                        }
                    }
                },
                {
                    opcode: 'dictSize',
                    blockType: BlockType.REPORTER,
                    text: 'size of dict [DICT]',
                    arguments: {
                        DICT: {type: ArgumentType.STRING, defaultValue: '{"a":1,"b":2}'}
                    },
                    doc: {
                        description: 'Returns the number of keys in a dictionary.',
                        returns: 'number',
                        example: 'size of dict {"a":1,"b":2} => 2',
                        arguments: {
                            DICT: 'JSON dictionary (object)'
                        }
                    }
                },
                '---',
                {
                    opcode: 'heapCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create heap',
                    arguments: {},
                    doc: {
                        description: 'Creates a new min-heap as JSON {type:"min",data:[]}.',
                        returns: 'string',
                        example: 'create heap => "{"type":"min","data":[]}"'
                    }
                },
                {
                    opcode: 'heapPush',
                    blockType: BlockType.REPORTER,
                    text: 'push [VALUE] into heap [HEAP]',
                    arguments: {
                        HEAP: {type: ArgumentType.STRING, defaultValue: '{"type":"min","data":[]}'},
                        VALUE: {type: ArgumentType.STRING, defaultValue: '10'}
                    },
                    doc: {
                        description: 'Pushes a value into the heap and bubbles up to maintain heap property.',
                        returns: 'string',
                        example: 'push 10 into heap => heap with 10 inserted',
                        arguments: {
                            HEAP: 'JSON heap object',
                            VALUE: 'Value to insert'
                        }
                    }
                },
                {
                    opcode: 'heapPop',
                    blockType: BlockType.REPORTER,
                    text: 'pop from heap [HEAP]',
                    arguments: {
                        HEAP: {type: ArgumentType.STRING, defaultValue: '{"type":"min","data":[1,3,2]}'}
                    },
                    doc: {
                        description: 'Removes and returns the min/max element from the heap (sift down). Returns {value, heap}.',
                        returns: 'string',
                        example: 'pop from heap => "{"value":1,"heap":{...}}"',
                        arguments: {
                            HEAP: 'JSON heap object'
                        }
                    }
                },
                {
                    opcode: 'heapPeek',
                    blockType: BlockType.REPORTER,
                    text: 'peek at heap [HEAP]',
                    arguments: {
                        HEAP: {type: ArgumentType.STRING, defaultValue: '{"type":"min","data":[1,3,2]}'}
                    },
                    doc: {
                        description: 'Returns the minimum or maximum element without removing it.',
                        returns: 'string',
                        example: 'peek at heap => "1"',
                        arguments: {
                            HEAP: 'JSON heap object'
                        }
                    }
                },
                {
                    opcode: 'heapSize',
                    blockType: BlockType.REPORTER,
                    text: 'size of heap [HEAP]',
                    arguments: {
                        HEAP: {type: ArgumentType.STRING, defaultValue: '{"type":"min","data":[1,2,3]}'}
                    },
                    doc: {
                        description: 'Returns the number of elements in the heap.',
                        returns: 'number',
                        example: 'size of heap => 3',
                        arguments: {
                            HEAP: 'JSON heap object'
                        }
                    }
                },
                '---',
                {
                    opcode: 'graphCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create graph',
                    arguments: {},
                    doc: {
                        description: 'Creates a new empty graph as JSON {nodes:[], edges:[]}.',
                        returns: 'string',
                        example: 'create graph => "{"nodes":[],"edges":[]}"'
                    }
                },
                {
                    opcode: 'graphAddNode',
                    blockType: BlockType.REPORTER,
                    text: 'add node [ID] with data [DATA] to graph [GRAPH]',
                    arguments: {
                        GRAPH: {type: ArgumentType.STRING, defaultValue: '{"nodes":[],"edges":[]}'},
                        ID: {type: ArgumentType.STRING, defaultValue: 'A'},
                        DATA: {type: ArgumentType.STRING, defaultValue: '{}'}
                    },
                    doc: {
                        description: 'Adds a node with the given ID and data to the graph.',
                        returns: 'string',
                        example: 'add node "A" to graph => graph with node A',
                        arguments: {
                            GRAPH: 'JSON graph object',
                            ID: 'Node identifier',
                            DATA: 'JSON data for the node'
                        }
                    }
                },
                {
                    opcode: 'graphAddEdge',
                    blockType: BlockType.REPORTER,
                    text: 'add edge from [FROM] to [TO] weight [WEIGHT] in graph [GRAPH]',
                    arguments: {
                        GRAPH: {type: ArgumentType.STRING, defaultValue: '{"nodes":[{"id":"A"},{"id":"B"}],"edges":[]}'},
                        FROM: {type: ArgumentType.STRING, defaultValue: 'A'},
                        TO: {type: ArgumentType.STRING, defaultValue: 'B'},
                        WEIGHT: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Adds a weighted directed edge between two nodes in the graph.',
                        returns: 'string',
                        example: 'add edge A->B weight 1 => graph with edge',
                        arguments: {
                            GRAPH: 'JSON graph object',
                            FROM: 'Source node ID',
                            TO: 'Target node ID',
                            WEIGHT: 'Edge weight'
                        }
                    }
                },
                {
                    opcode: 'graphBFS',
                    blockType: BlockType.REPORTER,
                    text: 'BFS traverse graph [GRAPH] from [START]',
                    arguments: {
                        GRAPH: {type: ArgumentType.STRING, defaultValue: '{"nodes":[{"id":"A"},{"id":"B"}],"edges":[{"from":"A","to":"B","weight":1}]}'},
                        START: {type: ArgumentType.STRING, defaultValue: 'A'}
                    },
                    doc: {
                        description: 'Breadth-first traversal returning the order of visited nodes as a JSON array.',
                        returns: 'string',
                        example: 'BFS traverse from A => "["A","B"]"',
                        arguments: {
                            GRAPH: 'JSON graph object',
                            START: 'Starting node ID'
                        }
                    }
                },
                {
                    opcode: 'graphDFS',
                    blockType: BlockType.REPORTER,
                    text: 'DFS traverse graph [GRAPH] from [START]',
                    arguments: {
                        GRAPH: {type: ArgumentType.STRING, defaultValue: '{"nodes":[{"id":"A"},{"id":"B"}],"edges":[{"from":"A","to":"B","weight":1}]}'},
                        START: {type: ArgumentType.STRING, defaultValue: 'A'}
                    },
                    doc: {
                        description: 'Depth-first traversal returning the order of visited nodes as a JSON array.',
                        returns: 'string',
                        example: 'DFS traverse from A => "["A","B"]"',
                        arguments: {
                            GRAPH: 'JSON graph object',
                            START: 'Starting node ID'
                        }
                    }
                },
                {
                    opcode: 'graphDijkstra',
                    blockType: BlockType.REPORTER,
                    text: 'shortest path from [START] to [END] in graph [GRAPH]',
                    arguments: {
                        GRAPH: {type: ArgumentType.STRING, defaultValue: '{"nodes":[{"id":"A"},{"id":"B"}],"edges":[{"from":"A","to":"B","weight":1}]}'},
                        START: {type: ArgumentType.STRING, defaultValue: 'A'},
                        END: {type: ArgumentType.STRING, defaultValue: 'B'}
                    },
                    doc: {
                        description: 'Finds the shortest path using Dijkstra\'s algorithm. Returns {distance, path}.',
                        returns: 'string',
                        example: 'shortest path A->B => "{"distance":1,"path":["A","B"]}"',
                        arguments: {
                            GRAPH: 'JSON graph object',
                            START: 'Start node ID',
                            END: 'End node ID'
                        }
                    }
                },
                {
                    opcode: 'graphNeighbors',
                    blockType: BlockType.REPORTER,
                    text: 'neighbors of [NODE] in graph [GRAPH]',
                    arguments: {
                        GRAPH: {type: ArgumentType.STRING, defaultValue: '{"nodes":[{"id":"A"},{"id":"B"}],"edges":[{"from":"A","to":"B","weight":1}]}'},
                        NODE: {type: ArgumentType.STRING, defaultValue: 'A'}
                    },
                    doc: {
                        description: 'Returns the neighbor IDs of a node as a JSON array.',
                        returns: 'string',
                        example: 'neighbors of A in graph => "["B"]"',
                        arguments: {
                            GRAPH: 'JSON graph object',
                            NODE: 'Node ID'
                        }
                    }
                },
                '---',
                {
                    opcode: 'ufCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create union-find of size [N]',
                    arguments: {
                        N: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: {
                        description: 'Creates a disjoint set union (union-find) of size N. Returns JSON {parent:[...], rank:[...]}.',
                        returns: 'string',
                        example: 'create union-find of size 3 => "{"parent":[0,1,2],"rank":[0,0,0]}"',
                        arguments: {
                            N: 'Number of elements'
                        }
                    }
                },
                {
                    opcode: 'ufFind',
                    blockType: BlockType.REPORTER,
                    text: 'find root of [X] in union-find [UF]',
                    arguments: {
                        UF: {type: ArgumentType.STRING, defaultValue: '{"parent":[0,1,2],"rank":[0,0,0]}'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Finds the root of element X with path compression.',
                        returns: 'number',
                        example: 'find root of 1 in union-find => 1',
                        arguments: {
                            UF: 'JSON union-find object',
                            X: 'Element index'
                        }
                    }
                },
                {
                    opcode: 'ufUnion',
                    blockType: BlockType.REPORTER,
                    text: 'union [X] and [Y] in union-find [UF]',
                    arguments: {
                        UF: {type: ArgumentType.STRING, defaultValue: '{"parent":[0,1,2],"rank":[0,0,0]}'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: {
                        description: 'Unions two elements by rank. Returns the new union-find JSON.',
                        returns: 'string',
                        example: 'union 0 and 1 in union-find => updated UF',
                        arguments: {
                            UF: 'JSON union-find object',
                            X: 'First element index',
                            Y: 'Second element index'
                        }
                    }
                },
                {
                    opcode: 'ufConnected',
                    blockType: BlockType.BOOLEAN,
                    text: 'are [X] and [Y] connected in union-find [UF]?',
                    arguments: {
                        UF: {type: ArgumentType.STRING, defaultValue: '{"parent":[0,1,0],"rank":[0,0,1]}'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: {
                        description: 'Checks if two elements are in the same set (connected).',
                        returns: 'boolean',
                        example: 'are 0 and 2 connected? => true',
                        arguments: {
                            UF: 'JSON union-find object',
                            X: 'First element index',
                            Y: 'Second element index'
                        }
                    }
                },
                '---',
                {
                    opcode: 'trieCreate',
                    blockType: BlockType.REPORTER,
                    text: 'create trie',
                    arguments: {},
                    doc: {
                        description: 'Creates a new trie as JSON {children:{}, isEnd:false}.',
                        returns: 'string',
                        example: 'create trie => "{"children":{},"isEnd":false}"'
                    }
                },
                {
                    opcode: 'trieInsert',
                    blockType: BlockType.REPORTER,
                    text: 'insert [WORD] into trie [TRIE]',
                    arguments: {
                        TRIE: {type: ArgumentType.STRING, defaultValue: '{"children":{},"isEnd":false}'},
                        WORD: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: {
                        description: 'Inserts a word into the trie and returns the updated trie.',
                        returns: 'string',
                        example: 'insert "hello" into trie => updated trie',
                        arguments: {
                            TRIE: 'JSON trie object',
                            WORD: 'Word to insert'
                        }
                    }
                },
                {
                    opcode: 'trieSearch',
                    blockType: BlockType.BOOLEAN,
                    text: 'does trie [TRIE] contain [WORD]?',
                    arguments: {
                        TRIE: {type: ArgumentType.STRING, defaultValue: '{"children":{},"isEnd":false}'},
                        WORD: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: {
                        description: 'Searches for an exact word in the trie.',
                        returns: 'boolean',
                        example: 'does trie contain "hello"? => true',
                        arguments: {
                            TRIE: 'JSON trie object',
                            WORD: 'Word to search'
                        }
                    }
                },
                {
                    opcode: 'trieStartsWith',
                    blockType: BlockType.BOOLEAN,
                    text: 'does trie [TRIE] have prefix [PREFIX]?',
                    arguments: {
                        TRIE: {type: ArgumentType.STRING, defaultValue: '{"children":{"h":{"children":{"e":{"children":{"l":{"children":{"l":{"children":{"o":{"children":{},"isEnd":true}}}}}}}}}}},"isEnd":false}'},
                        PREFIX: {type: ArgumentType.STRING, defaultValue: 'he'}
                    },
                    doc: {
                        description: 'Checks if any word in the trie starts with the given prefix.',
                        returns: 'boolean',
                        example: 'does trie have prefix "he"? => true',
                        arguments: {
                            TRIE: 'JSON trie object',
                            PREFIX: 'Prefix to check'
                        }
                    }
                },
                {
                    opcode: 'trieSuggest',
                    blockType: BlockType.REPORTER,
                    text: 'suggest completions for [PREFIX] from trie [TRIE]',
                    arguments: {
                        TRIE: {type: ArgumentType.STRING, defaultValue: '{"children":{"h":{"children":{"e":{"children":{"l":{"children":{"l":{"children":{"o":{"children":{},"isEnd":true}}}}}}}}}}},"isEnd":false}'},
                        PREFIX: {type: ArgumentType.STRING, defaultValue: 'he'}
                    },
                    doc: {
                        description: 'Returns up to 5 auto-completion suggestions for a prefix as a JSON array.',
                        returns: 'string',
                        example: 'suggest for "he" from trie => "["hello"]"',
                        arguments: {
                            TRIE: 'JSON trie object',
                            PREFIX: 'Prefix to complete'
                        }
                    }
                },
                '---',
                {
                    opcode: 'dataWindow',
                    blockType: BlockType.REPORTER,
                    text: 'sliding windows of [LIST] size [SIZE]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Generates all sliding windows of a given size from an array.',
                        returns: 'string',
                        example: 'sliding windows of [1,2,3,4,5] size 3 => "[[1,2,3],[2,3,4],[3,4,5]]"',
                        arguments: {
                            LIST: 'JSON array',
                            SIZE: 'Window size'
                        }
                    }
                },
                {
                    opcode: 'dataMovingAverage',
                    blockType: BlockType.REPORTER,
                    text: 'moving average of [LIST] window [WINDOW]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'},
                        WINDOW: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: {
                        description: 'Computes the simple moving average over a sliding window.',
                        returns: 'string',
                        example: 'moving average of [1,2,3,4,5] window 3 => "[2,3,4]"',
                        arguments: {
                            LIST: 'JSON array of numbers',
                            WINDOW: 'Window size'
                        }
                    }
                },
                {
                    opcode: 'dataNormalize',
                    blockType: BlockType.REPORTER,
                    text: 'min-max normalize [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'}
                    },
                    doc: {
                        description: 'Normalizes an array of numbers to the 0-1 range using min-max normalization.',
                        returns: 'string',
                        example: 'min-max normalize [1,2,3,4,5] => "[0,0.25,0.5,0.75,1]"',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                },
                {
                    opcode: 'dataStandardize',
                    blockType: BlockType.REPORTER,
                    text: 'z-score standardize [LIST]',
                    arguments: {
                        LIST: {type: ArgumentType.STRING, defaultValue: '[1,2,3,4,5]'}
                    },
                    doc: {
                        description: 'Standardizes an array using z-score (mean=0, std=1).',
                        returns: 'string',
                        example: 'z-score standardize [1,2,3,4,5] => "[-1.41,-0.71,0,0.71,1.41]"',
                        arguments: {
                            LIST: 'JSON array of numbers'
                        }
                    }
                }
            ]
        };
    }

    arrayFromJSON (args) {
        if (!args) return '[]';
        try {
            const json = Cast.toString(args.JSON);
            if (!json) return '[]';
            const arr = JSON.parse(json);
            return Array.isArray(arr) ? JSON.stringify(arr) : '[]';
        } catch (e) {
            return '[]';
        }
    }

    arrayFromRange (args) {
        if (!args) return '[]';
        try {
            const start = Cast.toNumber(args.START);
            const end = Cast.toNumber(args.END);
            const result = [];
            const step = start <= end ? 1 : -1;
            for (let i = start; step === 1 ? i <= end : i >= end; i += step) {
                result.push(i);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    arrayMap (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            const transform = Cast.toString(args.TRANSFORM);
            const fn = new Function('n', 'i', `return ${transform}`);
            const result = list.map((item, idx) => fn(item, idx));
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    arrayFilter (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            const predicate = Cast.toString(args.PREDICATE);
            const fn = new Function('n', 'i', `return ${predicate}`);
            const result = list.filter((item, idx) => fn(item, idx));
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    arraySort (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            const sorted = [...list].sort((a, b) => Cast.toNumber(a) - Cast.toNumber(b));
            return JSON.stringify(sorted);
        } catch (e) {
            return '[]';
        }
    }

    arrayReverse (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            return JSON.stringify([...list].reverse());
        } catch (e) {
            return '[]';
        }
    }

    arrayFlatten (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            const result = [];
            for (const item of list) {
                if (Array.isArray(item)) {
                    result.push(...item);
                } else {
                    result.push(item);
                }
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dictCreate () {
        return '{}';
    }

    dictSet (args) {
        if (!args) return '{}';
        try {
            const dict = JSON.parse(Cast.toString(args.DICT));
            if (typeof dict !== 'object' || dict === null) return '{}';
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            dict[key] = value;
            return JSON.stringify(dict);
        } catch (e) {
            return '{}';
        }
    }

    dictGet (args) {
        if (!args) return '';
        try {
            const dict = JSON.parse(Cast.toString(args.DICT));
            if (typeof dict !== 'object' || dict === null) return '';
            const key = Cast.toString(args.KEY);
            const val = dict[key];
            return val !== undefined ? Cast.toString(val) : '';
        } catch (e) {
            return '';
        }
    }

    dictHas (args) {
        if (!args) return false;
        try {
            const dict = JSON.parse(Cast.toString(args.DICT));
            if (typeof dict !== 'object' || dict === null) return false;
            const key = Cast.toString(args.KEY);
            return key in dict;
        } catch (e) {
            return false;
        }
    }

    dictDelete (args) {
        if (!args) return '{}';
        try {
            const dict = JSON.parse(Cast.toString(args.DICT));
            if (typeof dict !== 'object' || dict === null) return '{}';
            const key = Cast.toString(args.KEY);
            delete dict[key];
            return JSON.stringify(dict);
        } catch (e) {
            return '{}';
        }
    }

    dictKeys (args) {
        if (!args) return '[]';
        try {
            const dict = JSON.parse(Cast.toString(args.DICT));
            if (typeof dict !== 'object' || dict === null) return '[]';
            return JSON.stringify(Object.keys(dict));
        } catch (e) {
            return '[]';
        }
    }

    dictMerge (args) {
        if (!args) return '{}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (typeof a !== 'object' || a === null) return '{}';
            if (typeof b !== 'object' || b === null) return '{}';
            return JSON.stringify(Object.assign({}, a, b));
        } catch (e) {
            return '{}';
        }
    }

    dataParseCSV (args) {
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

    dataParseJSON (args) {
        if (!args) return '';
        try {
            const json = Cast.toString(args.JSON);
            if (!json) return '';
            return JSON.parse(json);
        } catch (e) {
            return '';
        }
    }

    dataStringify (args) {
        if (!args) return '';
        try {
            const val = Cast.toString(args.VALUE);
            return JSON.stringify(val);
        } catch (e) {
            return '';
        }
    }

    dataUUID () {
        try {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        } catch (e) {
            return '';
        }
    }

    setCreate (args) {
        if (!args) return '[]';
        try {
            const items = JSON.parse(Cast.toString(args.ITEMS));
            if (!Array.isArray(items)) return '[]';
            return JSON.stringify([...new Set(items.map(i => Cast.toString(i)))]);
        } catch (e) {
            return '[]';
        }
    }

    setAdd (args) {
        if (!args) return '[]';
        try {
            const set = JSON.parse(Cast.toString(args.SET));
            if (!Array.isArray(set)) return '[]';
            const item = Cast.toString(args.ITEM);
            const result = [...new Set([...set.map(i => Cast.toString(i)), item])];
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    setHas (args) {
        if (!args) return false;
        try {
            const set = JSON.parse(Cast.toString(args.SET));
            if (!Array.isArray(set)) return false;
            const item = Cast.toString(args.ITEM);
            return set.some(i => Cast.toString(i) === item);
        } catch (e) {
            return false;
        }
    }

    setSize (args) {
        if (!args) return 0;
        try {
            const set = JSON.parse(Cast.toString(args.SET));
            if (!Array.isArray(set)) return 0;
            return new Set(set.map(i => Cast.toString(i))).size;
        } catch (e) {
            return 0;
        }
    }

    setUnion (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            const combined = [...(a || []), ...(b || [])];
            return JSON.stringify([...new Set(combined.map(i => Cast.toString(i)))]);
        } catch (e) {
            return '[]';
        }
    }

    setIntersection (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (!Array.isArray(a) || !Array.isArray(b)) return '[]';
            const setB = new Set(b.map(i => Cast.toString(i)));
            return JSON.stringify([...new Set(a.filter(i => setB.has(Cast.toString(i))))]);
        } catch (e) {
            return '[]';
        }
    }

    setDifference (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (!Array.isArray(a) || !Array.isArray(b)) return '[]';
            const setB = new Set(b.map(i => Cast.toString(i)));
            return JSON.stringify([...new Set(a.filter(i => !setB.has(Cast.toString(i))))]);
        } catch (e) {
            return '[]';
        }
    }

    dataShuffle (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            const result = [...list];
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dataSample (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const n = Math.min(Cast.toNumber(args.N), list.length);
            if (!Array.isArray(list) || n <= 0) return '[]';
            const shuffled = [...list];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return JSON.stringify(shuffled.slice(0, n));
        } catch (e) {
            return '[]';
        }
    }

    dataSortBy (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const key = Cast.toString(args.KEY);
            if (!Array.isArray(list)) return '[]';
            const sorted = [...list].sort((a, b) => {
                const va = a[key] !== undefined ? a[key] : '';
                const vb = b[key] !== undefined ? b[key] : '';
                return Cast.toString(va).localeCompare(Cast.toString(vb));
            });
            return JSON.stringify(sorted);
        } catch (e) {
            return '[]';
        }
    }

    zipCreate (args) {
        if (!args) return '{}';
        try {
            const keys = JSON.parse(Cast.toString(args.KEYS));
            const values = JSON.parse(Cast.toString(args.VALUES));
            if (!Array.isArray(keys) || !Array.isArray(values)) return '{}';
            const result = {};
            const len = Math.min(keys.length, values.length);
            for (let i = 0; i < len; i++) {
                result[Cast.toString(keys[i])] = values[i];
            }
            return JSON.stringify(result);
        } catch (e) {
            return '{}';
        }
    }

    zipUnzip (args) {
        if (!args) return '[]';
        try {
            const items = JSON.parse(Cast.toString(args.ITEMS));
            const key = Cast.toString(args.KEY);
            if (!Array.isArray(items)) return '[]';
            const result = items.map(item => item && item[key]);
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dataGroupBy (args) {
        if (!args) return '{}';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const key = Cast.toString(args.KEY);
            if (!Array.isArray(list)) return '{}';
            const result = {};
            for (const item of list) {
                if (item && item[key] !== undefined) {
                    const groupKey = Cast.toString(item[key]);
                    if (!result[groupKey]) result[groupKey] = [];
                    result[groupKey].push(item);
                }
            }
            return JSON.stringify(result);
        } catch (e) {
            return '{}';
        }
    }

    dataCountBy (args) {
        if (!args) return '{}';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const key = Cast.toString(args.KEY);
            if (!Array.isArray(list)) return '{}';
            const result = {};
            for (const item of list) {
                if (item && item[key] !== undefined) {
                    const groupKey = Cast.toString(item[key]);
                    result[groupKey] = (result[groupKey] || 0) + 1;
                }
            }
            return JSON.stringify(result);
        } catch (e) {
            return '{}';
        }
    }

    dataSortNumbers (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            const sorted = [...list].sort((a, b) => Cast.toNumber(a) - Cast.toNumber(b));
            return JSON.stringify(sorted);
        } catch (e) {
            return '[]';
        }
    }

    dataSortDescending (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            const sorted = [...list].sort((a, b) => Cast.toNumber(b) - Cast.toNumber(a));
            return JSON.stringify(sorted);
        } catch (e) {
            return '[]';
        }
    }

    dataUnique (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list)) return '[]';
            return JSON.stringify([...new Set(list.map(i => Cast.toString(i)))]);
        } catch (e) {
            return '[]';
        }
    }

    dataIntersection (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (!Array.isArray(a) || !Array.isArray(b)) return '[]';
            const setB = new Set(b.map(i => Cast.toString(i)));
            const result = a.filter(i => setB.has(Cast.toString(i)));
            return JSON.stringify([...new Set(result.map(i => Cast.toString(i)))]);
        } catch (e) {
            return '[]';
        }
    }

    dataDifference (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (!Array.isArray(a) || !Array.isArray(b)) return '[]';
            const setB = new Set(b.map(i => Cast.toString(i)));
            const result = a.filter(i => !setB.has(Cast.toString(i)));
            return JSON.stringify([...new Set(result.map(i => Cast.toString(i)))]);
        } catch (e) {
            return '[]';
        }
    }

    dataChunk (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const size = Math.max(1, Math.floor(Cast.toNumber(args.SIZE)));
            if (!Array.isArray(list) || size <= 0) return '[]';
            const result = [];
            for (let i = 0; i < list.length; i += size) {
                result.push(list.slice(i, i + size));
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dataRotate (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const n = Cast.toNumber(args.N);
            if (!Array.isArray(list) || list.length === 0) return '[]';
            const len = list.length;
            const rot = ((n % len) + len) % len;
            const result = [...list.slice(rot), ...list.slice(0, rot)];
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dataFibonacci (args) {
        if (!args) return '[]';
        try {
            const n = Math.max(0, Math.floor(Cast.toNumber(args.N)));
            if (n === 0) return '[]';
            const result = [0, 1];
            for (let i = 2; i < n; i++) {
                result.push(result[i - 1] + result[i - 2]);
            }
            return JSON.stringify(result.slice(0, n));
        } catch (e) {
            return '[]';
        }
    }

    dataMergeObjects (args) {
        if (!args) return '{}';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return '{}';
            const merge = (target, source) => {
                for (const key of Object.keys(source)) {
                    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
                        merge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
                return target;
            };
            return JSON.stringify(merge(JSON.parse(JSON.stringify(a)), b));
        } catch (e) {
            return '{}';
        }
    }

    dataCloneDeep (args) {
        if (!args) return '';
        try {
            const value = Cast.toString(args.VALUE);
            return JSON.stringify(JSON.parse(value));
        } catch (e) {
            return '';
        }
    }

    dataCompareDeep (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            return a === b;
        } catch (e) {
            return false;
        }
    }

    arrayIsEmpty (args) {
        if (!args) return true;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            return !Array.isArray(list) || list.length === 0;
        } catch (e) {
            return true;
        }
    }

    arrayContains (args) {
        if (!args) return false;
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const item = Cast.toString(args.ITEM);
            if (!Array.isArray(list)) return false;
            return list.some(i => Cast.toString(i) === item);
        } catch (e) {
            return false;
        }
    }

    arrayFirst (args) {
        if (!args) return '';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return '';
            return Cast.toString(list[0]);
        } catch (e) {
            return '';
        }
    }

    arrayLast (args) {
        if (!args) return '';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return '';
            return Cast.toString(list[list.length - 1]);
        } catch (e) {
            return '';
        }
    }

    arrayRandom (args) {
        if (!args) return '';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return '';
            return Cast.toString(list[Math.floor(Math.random() * list.length)]);
        } catch (e) {
            return '';
        }
    }

    arraySlice (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const start = Cast.toNumber(args.START);
            const end = Cast.toNumber(args.END);
            if (!Array.isArray(list)) return '[]';
            return JSON.stringify(list.slice(start, end));
        } catch (e) {
            return '[]';
        }
    }

    arrayConcat (args) {
        if (!args) return '[]';
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            const arrA = Array.isArray(a) ? a : [];
            const arrB = Array.isArray(b) ? b : [];
            return JSON.stringify([...arrA, ...arrB]);
        } catch (e) {
            return '[]';
        }
    }

    arrayFill (args) {
        if (!args) return '[]';
        try {
            const value = Cast.toString(args.VALUE);
            const length = Math.max(0, Math.floor(Cast.toNumber(args.LENGTH)));
            return JSON.stringify(new Array(length).fill(value));
        } catch (e) {
            return '[]';
        }
    }

    arrayIndexes (args) {
        if (!args) return '[]';
        try {
            const length = Math.max(0, Math.floor(Cast.toNumber(args.LENGTH)));
            const result = [];
            for (let i = 0; i < length; i++) result.push(i);
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dictSize (args) {
        if (!args) return 0;
        try {
            const dict = JSON.parse(Cast.toString(args.DICT));
            if (typeof dict !== 'object' || dict === null) return 0;
            return Object.keys(dict).length;
        } catch (e) {
            return 0;
        }
    }

    heapCreate () {
        try {
            return JSON.stringify({type: 'min', data: []});
        } catch (e) {
            return '{"type":"min","data":[]}';
        }
    }

    heapPush (args) {
        if (!args) return '{"type":"min","data":[]}';
        try {
            const heap = JSON.parse(Cast.toString(args.HEAP));
            const value = Cast.toNumber(args.VALUE);
            if (!heap || !heap.data || !Array.isArray(heap.data)) return '{"type":"min","data":[]}';
            const result = {type: heap.type || 'min', data: [...heap.data]};
            result.data.push(value);
            let i = result.data.length - 1;
            while (i > 0) {
                const p = Math.floor((i - 1) / 2);
                if (result.type === 'min' ? result.data[p] <= result.data[i] : result.data[p] >= result.data[i]) break;
                [result.data[p], result.data[i]] = [result.data[i], result.data[p]];
                i = p;
            }
            return JSON.stringify(result);
        } catch (e) {
            return '{"type":"min","data":[]}';
        }
    }

    heapPop (args) {
        if (!args) return '{"value":null,"heap":{"type":"min","data":[]}}';
        try {
            const heap = JSON.parse(Cast.toString(args.HEAP));
            if (!heap || !heap.data || !Array.isArray(heap.data) || heap.data.length === 0) {
                return '{"value":null,"heap":{"type":"min","data":[]}}';
            }
            const result = {type: heap.type || 'min', data: [...heap.data]};
            const value = result.data[0];
            const last = result.data.pop();
            if (result.data.length > 0) {
                result.data[0] = last;
                let i = 0;
                const n = result.data.length;
                while (true) {
                    let smallest = i;
                    const left = 2 * i + 1;
                    const right = 2 * i + 2;
                    if (result.type === 'min') {
                        if (left < n && result.data[left] < result.data[smallest]) smallest = left;
                        if (right < n && result.data[right] < result.data[smallest]) smallest = right;
                    } else {
                        if (left < n && result.data[left] > result.data[smallest]) smallest = left;
                        if (right < n && result.data[right] > result.data[smallest]) smallest = right;
                    }
                    if (smallest === i) break;
                    [result.data[i], result.data[smallest]] = [result.data[smallest], result.data[i]];
                    i = smallest;
                }
            }
            return JSON.stringify({value, heap: result});
        } catch (e) {
            return '{"value":null,"heap":{"type":"min","data":[]}}';
        }
    }

    heapPeek (args) {
        if (!args) return '';
        try {
            const heap = JSON.parse(Cast.toString(args.HEAP));
            if (!heap || !heap.data || !Array.isArray(heap.data) || heap.data.length === 0) return '';
            return Cast.toString(heap.data[0]);
        } catch (e) {
            return '';
        }
    }

    heapSize (args) {
        if (!args) return 0;
        try {
            const heap = JSON.parse(Cast.toString(args.HEAP));
            if (!heap || !heap.data || !Array.isArray(heap.data)) return 0;
            return heap.data.length;
        } catch (e) {
            return 0;
        }
    }

    graphCreate () {
        try {
            return JSON.stringify({nodes: [], edges: []});
        } catch (e) {
            return '{"nodes":[],"edges":[]}';
        }
    }

    graphAddNode (args) {
        if (!args) return '{"nodes":[],"edges":[]}';
        try {
            const graph = JSON.parse(Cast.toString(args.GRAPH));
            const id = Cast.toString(args.ID);
            const dataStr = Cast.toString(args.DATA);
            let data = {};
            try { data = JSON.parse(dataStr); } catch (ex) { data = {}; }
            if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return '{"nodes":[],"edges":[]}';
            const result = {nodes: [...graph.nodes], edges: [...graph.edges]};
            result.nodes.push({id, data});
            return JSON.stringify(result);
        } catch (e) {
            return '{"nodes":[],"edges":[]}';
        }
    }

    graphAddEdge (args) {
        if (!args) return '{"nodes":[],"edges":[]}';
        try {
            const graph = JSON.parse(Cast.toString(args.GRAPH));
            const from = Cast.toString(args.FROM);
            const to = Cast.toString(args.TO);
            const weight = Cast.toNumber(args.WEIGHT);
            if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return '{"nodes":[],"edges":[]}';
            const result = {nodes: [...graph.nodes], edges: [...graph.edges]};
            result.edges.push({from, to, weight});
            return JSON.stringify(result);
        } catch (e) {
            return '{"nodes":[],"edges":[]}';
        }
    }

    graphBFS (args) {
        if (!args) return '[]';
        try {
            const graph = JSON.parse(Cast.toString(args.GRAPH));
            const start = Cast.toString(args.START);
            if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return '[]';
            const adj = {};
            for (const edge of graph.edges) {
                if (!adj[edge.from]) adj[edge.from] = [];
                adj[edge.from].push(edge.to);
            }
            const visited = new Set();
            const order = [];
            const queue = [start];
            visited.add(start);
            while (queue.length > 0) {
                const node = queue.shift();
                order.push(node);
                for (const neighbor of (adj[node] || [])) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
            return JSON.stringify(order);
        } catch (e) {
            return '[]';
        }
    }

    graphDFS (args) {
        if (!args) return '[]';
        try {
            const graph = JSON.parse(Cast.toString(args.GRAPH));
            const start = Cast.toString(args.START);
            if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return '[]';
            const adj = {};
            for (const edge of graph.edges) {
                if (!adj[edge.from]) adj[edge.from] = [];
                adj[edge.from].push(edge.to);
            }
            const visited = new Set();
            const order = [];
            const stack = [start];
            while (stack.length > 0) {
                const node = stack.pop();
                if (visited.has(node)) continue;
                visited.add(node);
                order.push(node);
                for (const neighbor of (adj[node] || [])) {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
            return JSON.stringify(order);
        } catch (e) {
            return '[]';
        }
    }

    graphDijkstra (args) {
        if (!args) return '{}';
        try {
            const graph = JSON.parse(Cast.toString(args.GRAPH));
            const start = Cast.toString(args.START);
            const end = Cast.toString(args.END);
            if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return '{}';
            const adj = {};
            for (const edge of graph.edges) {
                if (!adj[edge.from]) adj[edge.from] = [];
                adj[edge.from].push({to: edge.to, weight: edge.weight});
            }
            const dist = {};
            const prev = {};
            const unvisited = new Set();
            for (const node of graph.nodes) {
                dist[node.id] = node.id === start ? 0 : Infinity;
                prev[node.id] = null;
                unvisited.add(node.id);
            }
            while (unvisited.size > 0) {
                let current = null;
                let minDist = Infinity;
                for (const id of unvisited) {
                    if (dist[id] < minDist) {
                        minDist = dist[id];
                        current = id;
                    }
                }
                if (current === null || current === end) break;
                unvisited.delete(current);
                for (const neighbor of (adj[current] || [])) {
                    const alt = dist[current] + neighbor.weight;
                    if (alt < dist[neighbor.to]) {
                        dist[neighbor.to] = alt;
                        prev[neighbor.to] = current;
                    }
                }
            }
            const path = [];
            let cur = end;
            while (cur !== null) {
                path.unshift(cur);
                cur = prev[cur];
            }
            if (dist[end] === Infinity || path.length < 1) return JSON.stringify({distance: Infinity, path: []});
            return JSON.stringify({distance: dist[end], path});
        } catch (e) {
            return '{}';
        }
    }

    graphNeighbors (args) {
        if (!args) return '[]';
        try {
            const graph = JSON.parse(Cast.toString(args.GRAPH));
            const node = Cast.toString(args.NODE);
            if (!graph || !Array.isArray(graph.edges)) return '[]';
            const neighbors = graph.edges.filter(e => e.from === node).map(e => e.to);
            return JSON.stringify(neighbors);
        } catch (e) {
            return '[]';
        }
    }

    ufCreate (args) {
        if (!args) return '{}';
        try {
            const n = Math.max(1, Math.floor(Cast.toNumber(args.N)));
            const parent = [];
            const rank = [];
            for (let i = 0; i < n; i++) { parent.push(i); rank.push(0); }
            return JSON.stringify({parent, rank});
        } catch (e) {
            return '{}';
        }
    }

    ufFind (args) {
        if (!args) return -1;
        try {
            const uf = JSON.parse(Cast.toString(args.UF));
            const x = Math.floor(Cast.toNumber(args.X));
            if (!uf || !Array.isArray(uf.parent) || !Array.isArray(uf.rank)) return -1;
            const parent = [...uf.parent];
            const find = (i) => {
                if (parent[i] !== i) parent[i] = find(parent[i]);
                return parent[i];
            };
            return find(x);
        } catch (e) {
            return -1;
        }
    }

    ufUnion (args) {
        if (!args) return '{}';
        try {
            const uf = JSON.parse(Cast.toString(args.UF));
            const x = Math.floor(Cast.toNumber(args.X));
            const y = Math.floor(Cast.toNumber(args.Y));
            if (!uf || !Array.isArray(uf.parent) || !Array.isArray(uf.rank)) return '{}';
            const parent = [...uf.parent];
            const rank = [...uf.rank];
            const find = (i) => {
                if (parent[i] !== i) parent[i] = find(parent[i]);
                return parent[i];
            };
            const rx = find(x);
            const ry = find(y);
            if (rx !== ry) {
                if (rank[rx] < rank[ry]) {
                    parent[rx] = ry;
                } else if (rank[rx] > rank[ry]) {
                    parent[ry] = rx;
                } else {
                    parent[ry] = rx;
                    rank[rx]++;
                }
            }
            return JSON.stringify({parent, rank});
        } catch (e) {
            return '{}';
        }
    }

    ufConnected (args) {
        if (!args) return false;
        try {
            const uf = JSON.parse(Cast.toString(args.UF));
            const x = Math.floor(Cast.toNumber(args.X));
            const y = Math.floor(Cast.toNumber(args.Y));
            if (!uf || !Array.isArray(uf.parent) || !Array.isArray(uf.rank)) return false;
            const parent = [...uf.parent];
            const find = (i) => {
                if (parent[i] !== i) parent[i] = find(parent[i]);
                return parent[i];
            };
            return find(x) === find(y);
        } catch (e) {
            return false;
        }
    }

    trieCreate () {
        try {
            return JSON.stringify({children: {}, isEnd: false});
        } catch (e) {
            return '{"children":{},"isEnd":false}';
        }
    }

    trieInsert (args) {
        if (!args) return '{"children":{},"isEnd":false}';
        try {
            const trie = JSON.parse(Cast.toString(args.TRIE));
            const word = Cast.toString(args.WORD);
            if (!trie) return '{"children":{},"isEnd":false}';
            const result = JSON.parse(JSON.stringify(trie));
            let node = result;
            for (const ch of word) {
                if (!node.children[ch]) node.children[ch] = {children: {}, isEnd: false};
                node = node.children[ch];
            }
            node.isEnd = true;
            return JSON.stringify(result);
        } catch (e) {
            return '{"children":{},"isEnd":false}';
        }
    }

    trieSearch (args) {
        if (!args) return false;
        try {
            const trie = JSON.parse(Cast.toString(args.TRIE));
            const word = Cast.toString(args.WORD);
            if (!trie) return false;
            let node = trie;
            for (const ch of word) {
                if (!node.children || !node.children[ch]) return false;
                node = node.children[ch];
            }
            return !!node.isEnd;
        } catch (e) {
            return false;
        }
    }

    trieStartsWith (args) {
        if (!args) return false;
        try {
            const trie = JSON.parse(Cast.toString(args.TRIE));
            const prefix = Cast.toString(args.PREFIX);
            if (!trie) return false;
            let node = trie;
            for (const ch of prefix) {
                if (!node.children || !node.children[ch]) return false;
                node = node.children[ch];
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    trieSuggest (args) {
        if (!args) return '[]';
        try {
            const trie = JSON.parse(Cast.toString(args.TRIE));
            const prefix = Cast.toString(args.PREFIX);
            if (!trie) return '[]';
            let node = trie;
            for (const ch of prefix) {
                if (!node.children || !node.children[ch]) return '[]';
                node = node.children[ch];
            }
            const results = [];
            const dfs = (n, str) => {
                if (results.length >= 5) return;
                if (n.isEnd) results.push(str);
                for (const ch of Object.keys(n.children || {})) {
                    if (results.length >= 5) return;
                    dfs(n.children[ch], str + ch);
                }
            };
            dfs(node, prefix);
            return JSON.stringify(results);
        } catch (e) {
            return '[]';
        }
    }

    dataWindow (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const size = Math.max(1, Math.floor(Cast.toNumber(args.SIZE)));
            if (!Array.isArray(list) || list.length === 0) return '[]';
            const result = [];
            for (let i = 0; i <= list.length - size; i++) {
                result.push(list.slice(i, i + size));
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dataMovingAverage (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            const window = Math.max(1, Math.floor(Cast.toNumber(args.WINDOW)));
            if (!Array.isArray(list) || list.length < window) return '[]';
            const result = [];
            for (let i = 0; i <= list.length - window; i++) {
                const slice = list.slice(i, i + window);
                const avg = slice.reduce((s, v) => s + Cast.toNumber(v), 0) / window;
                result.push(avg);
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dataNormalize (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return '[]';
            const nums = list.map(v => Cast.toNumber(v));
            const min = Math.min(...nums);
            const max = Math.max(...nums);
            if (max - min === 0) return JSON.stringify(nums.map(() => 0));
            const result = nums.map(v => (v - min) / (max - min));
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    dataStandardize (args) {
        if (!args) return '[]';
        try {
            const list = JSON.parse(Cast.toString(args.LIST));
            if (!Array.isArray(list) || list.length === 0) return '[]';
            const nums = list.map(v => Cast.toNumber(v));
            const mean = nums.reduce((s, v) => s + v, 0) / nums.length;
            const variance = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / nums.length;
            const std = Math.sqrt(variance);
            if (std === 0) return JSON.stringify(nums.map(() => 0));
            const result = nums.map(v => (v - mean) / std);
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }
}

module.exports = ScratchProDataBlocks;
