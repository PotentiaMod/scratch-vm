const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const ZALGO_CHARS = [
    '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
    '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
    '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311',
    '\u0312', '\u0313', '\u0314', '\u0315', '\u0316', '\u0317',
    '\u0318', '\u0319', '\u031A', '\u031B', '\u031C', '\u031D',
    '\u031E', '\u031F', '\u0320', '\u0321', '\u0322', '\u0323',
    '\u0324', '\u0325', '\u0326', '\u0327', '\u0328', '\u0329',
    '\u032A', '\u032B', '\u032C', '\u032D', '\u032E', '\u032F',
    '\u0330', '\u0331', '\u0332', '\u0333', '\u0334', '\u0335',
    '\u0336', '\u0337', '\u0338', '\u0339', '\u033A', '\u033B',
    '\u033C', '\u033D', '\u033E', '\u033F'
];

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

class ScratchProTextBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'scratchproText',
            name: 'Text',
            color1: '#4C97FF',
            color2: '#3373CC',
            color3: '#1E5EB3',
            blocks: [
                {
                    opcode: 'textToUpper',
                    blockType: BlockType.REPORTER,
                    text: 'upper case [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Converts all characters in the text to uppercase.',
                        example: 'upper case "hello" returns "HELLO".',
                        returns: 'the text converted to uppercase'
                    }
                },
                {
                    opcode: 'textToLower',
                    blockType: BlockType.REPORTER,
                    text: 'lower case [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'HELLO'
                        }
                    },
                    doc: {
                        description: 'Converts all characters in the text to lowercase.',
                        example: 'lower case "HELLO" returns "hello".',
                        returns: 'the text converted to lowercase'
                    }
                },
                {
                    opcode: 'textTrim',
                    blockType: BlockType.REPORTER,
                    text: 'trim [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: '  hello  '
                        }
                    },
                    doc: {
                        description: 'Removes whitespace from both ends of the text.',
                        example: 'trim "  hello  " returns "hello".',
                        returns: 'the text with leading and trailing whitespace removed'
                    }
                },
                {
                    opcode: 'textReverse',
                    blockType: BlockType.REPORTER,
                    text: 'reverse [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Reverses the order of characters in the text.',
                        example: 'reverse "hello" returns "olleh".',
                        returns: 'the reversed text'
                    }
                },
                {
                    opcode: 'textPadStart',
                    blockType: BlockType.REPORTER,
                    text: 'pad [TEXT] start to length [LEN] with [CHAR]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        CHAR: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    },
                    doc: {
                        description: 'Pads the beginning of the text with a character until it reaches the specified length.',
                        example: 'pad "hello" start to length 10 with " " returns "     hello".',
                        returns: 'the padded text'
                    }
                },
                {
                    opcode: 'textPadEnd',
                    blockType: BlockType.REPORTER,
                    text: 'pad [TEXT] end to length [LEN] with [CHAR]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        CHAR: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    },
                    doc: {
                        description: 'Pads the end of the text with a character until it reaches the specified length.',
                        example: 'pad "hello" end to length 10 with " " returns "hello     ".',
                        returns: 'the padded text'
                    }
                },
                '---',
                {
                    opcode: 'textSplit',
                    blockType: BlockType.REPORTER,
                    text: 'split [TEXT] by [SEP]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a,b,c'
                        },
                        SEP: {
                            type: ArgumentType.STRING,
                            defaultValue: ','
                        }
                    },
                    doc: {
                        description: 'Splits the text into an array of substrings at each occurrence of the separator, returned as a JSON string.',
                        example: 'split "a,b,c" by "," returns \'["a","b","c"]\'.',
                        returns: 'a JSON string array of the split substrings'
                    }
                },
                {
                    opcode: 'textSlice',
                    blockType: BlockType.REPORTER,
                    text: 'slice [TEXT] from [START] to [END]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        START: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        END: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    },
                    doc: {
                        description: 'Extracts a section of the text from a start index to an end index (end is exclusive).',
                        example: 'slice "hello world" from 0 to 5 returns "hello".',
                        returns: 'the extracted substring'
                    }
                },
                {
                    opcode: 'textSubstring',
                    blockType: BlockType.REPORTER,
                    text: 'substring [TEXT] from [START] length [LEN]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        START: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    },
                    doc: {
                        description: 'Extracts a substring from the text starting at the given index with the specified length.',
                        example: 'substring "hello world" from 0 length 5 returns "hello".',
                        returns: 'the extracted substring'
                    }
                },
                {
                    opcode: 'textReplace',
                    blockType: BlockType.REPORTER,
                    text: 'replace [PATTERN] in [TEXT] with [REPLACEMENT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        PATTERN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'world'
                        },
                        REPLACEMENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'there'
                        }
                    },
                    doc: {
                        description: 'Replaces the first occurrence of a pattern in the text with a replacement string.',
                        example: 'replace "world" in "hello world" with "there" returns "hello there".',
                        returns: 'the text with the first occurrence replaced'
                    }
                },
                {
                    opcode: 'textReplaceAll',
                    blockType: BlockType.REPORTER,
                    text: 'replace all [PATTERN] in [TEXT] with [REPLACEMENT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello hello'
                        },
                        PATTERN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        REPLACEMENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hi'
                        }
                    },
                    doc: {
                        description: 'Replaces all occurrences of a pattern in the text with a replacement string.',
                        example: 'replace all "hello" in "hello hello" with "hi" returns "hi hi".',
                        returns: 'the text with all occurrences replaced'
                    }
                },
                {
                    opcode: 'textRepeat',
                    blockType: BlockType.REPORTER,
                    text: 'repeat [TEXT] [TIMES] times',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hi'
                        },
                        TIMES: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        }
                    },
                    doc: {
                        description: 'Repeats the text a specified number of times and returns the concatenated result.',
                        example: 'repeat "hi" 3 times returns "hihihi".',
                        returns: 'the repeated text'
                    }
                },
                '---',
                {
                    opcode: 'textIndexOf',
                    blockType: BlockType.REPORTER,
                    text: 'index of [SEARCH] in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        SEARCH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'world'
                        }
                    },
                    doc: {
                        description: 'Returns the index of the first occurrence of a search string in the text, or -1 if not found.',
                        example: 'index of "world" in "hello world" returns 6.',
                        returns: 'the index as a number, or -1 if not found'
                    }
                },
                {
                    opcode: 'textIncludes',
                    blockType: BlockType.BOOLEAN,
                    text: '[TEXT] includes [SEARCH]?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        SEARCH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'world'
                        }
                    },
                    doc: {
                        description: 'Checks whether the text contains the specified search string.',
                        example: '"hello world" includes "world"? returns true.',
                        returns: 'true if the search string is found, false otherwise'
                    }
                },
                {
                    opcode: 'textStartsWith',
                    blockType: BlockType.BOOLEAN,
                    text: '[TEXT] starts with [SEARCH]?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        SEARCH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Checks whether the text starts with the specified search string.',
                        example: '"hello world" starts with "hello"? returns true.',
                        returns: 'true if the text starts with the search string, false otherwise'
                    }
                },
                {
                    opcode: 'textEndsWith',
                    blockType: BlockType.BOOLEAN,
                    text: '[TEXT] ends with [SEARCH]?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        SEARCH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'world'
                        }
                    },
                    doc: {
                        description: 'Checks whether the text ends with the specified search string.',
                        example: '"hello world" ends with "world"? returns true.',
                        returns: 'true if the text ends with the search string, false otherwise'
                    }
                },
                {
                    opcode: 'textCharCodeAt',
                    blockType: BlockType.REPORTER,
                    text: 'char code at [INDEX] in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABC'
                        },
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    doc: {
                        description: 'Returns the Unicode value of the character at the specified index in the text.',
                        example: 'char code at 0 in "ABC" returns 65.',
                        returns: 'the Unicode character code as a number, or empty string if the index is out of range'
                    }
                },
                {
                    opcode: 'textFromCharCode',
                    blockType: BlockType.REPORTER,
                    text: 'letter with char code [CODE]',
                    arguments: {
                        CODE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 65
                        }
                    },
                    doc: {
                        description: 'Creates a string from the specified Unicode character code.',
                        example: 'letter with char code 65 returns "A".',
                        returns: 'the character corresponding to the Unicode code'
                    }
                },
                '---',
                {
                    opcode: 'textRegexTest',
                    blockType: BlockType.BOOLEAN,
                    text: '[TEXT] matches regex [REGEX]?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello 123'
                        },
                        REGEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '\\\\d+'
                        }
                    },
                    doc: {
                        description: 'Tests whether the text matches the specified regular expression pattern.',
                        example: '"hello 123" matches regex "\\\\d+"? returns true.',
                        returns: 'true if the text matches the regex, false otherwise'
                    }
                },
                {
                    opcode: 'textRegexMatch',
                    blockType: BlockType.REPORTER,
                    text: 'regex match [REGEX] in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello 123 world 456'
                        },
                        REGEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '\\\\d+'
                        }
                    },
                    doc: {
                        description: 'Finds all matches of a regular expression in the text and returns them as a JSON array.',
                        example: 'regex match "\\\\d+" in "hello 123 world 456" returns \'["123","456"]\'.',
                        returns: 'a JSON string array of all matches, or empty string if no matches'
                    }
                },
                {
                    opcode: 'textRegexReplace',
                    blockType: BlockType.REPORTER,
                    text: 'regex replace [REGEX] in [TEXT] with [REPLACEMENT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello 123'
                        },
                        REGEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '\\\\d+'
                        },
                        REPLACEMENT: {
                            type: ArgumentType.STRING,
                            defaultValue: '***'
                        }
                    },
                    doc: {
                        description: 'Replaces all matches of a regular expression in the text with a replacement string.',
                        example: 'regex replace "\\\\d+" in "hello 123" with "***" returns "hello ***".',
                        returns: 'the text with all regex matches replaced'
                    }
                },
                '---',
                {
                    opcode: 'textConcat',
                    blockType: BlockType.REPORTER,
                    text: 'join [A] and [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'world'
                        }
                    },
                    doc: {
                        description: 'Concatenates two strings together and returns the result.',
                        example: 'join "hello" and "world" returns "helloworld".',
                        returns: 'the concatenation of the two strings'
                    }
                },
                {
                    opcode: 'textInterpolate',
                    blockType: BlockType.REPORTER,
                    text: 'template [TEMPLATE] with {0} [A] {1} [B] {2} [C]',
                    arguments: {
                        TEMPLATE: {
                            type: ArgumentType.STRING,
                            defaultValue: '{0} says {1}'
                        },
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Alice'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        C: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    },
                    doc: {
                        description: 'Substitutes placeholders {0}, {1}, and {2} in a template string with the provided values.',
                        example: 'template "{0} says {1}" with "Alice" and "hello" returns "Alice says hello".',
                        returns: 'the template with placeholders replaced'
                    }
                },
                {
                    opcode: 'textEscapeHTML',
                    blockType: BlockType.REPORTER,
                    text: 'escape HTML [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: '<b>hello</b>'
                        }
                    },
                    doc: {
                        description: 'Escapes HTML special characters (&, <, >, \', ") into their HTML entity equivalents.',
                        example: 'escape HTML "<b>hello</b>" returns "&lt;b&gt;hello&lt;/b&gt;".',
                        returns: 'the text with HTML characters escaped'
                    }
                },
                {
                    opcode: 'textUnescapeHTML',
                    blockType: BlockType.REPORTER,
                    text: 'unescape HTML [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: '&lt;b&gt;hello&lt;/b&gt;'
                        }
                    },
                    doc: {
                        description: 'Converts HTML entities back to their original characters.',
                        example: 'unescape HTML "&lt;b&gt;hello&lt;/b&gt;" returns "<b>hello</b>".',
                        returns: 'the text with HTML entities unescaped'
                    }
                },
                '---',
                {
                    opcode: 'textLevenshtein',
                    blockType: BlockType.REPORTER,
                    text: 'levenshtein distance [A] [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'kitten'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'sitting'
                        }
                    },
                    doc: {
                        description: 'Calculates the Levenshtein edit distance between two strings. The minimum number of single-character edits needed to change one string into the other.',
                        example: 'levenshtein distance "kitten" "sitting" returns 3.',
                        returns: 'the edit distance as a number'
                    }
                },
                {
                    opcode: 'textSimilarity',
                    blockType: BlockType.REPORTER,
                    text: 'similarity ratio of [A] and [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'kitten'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'sitting'
                        }
                    },
                    doc: {
                        description: 'Calculates a similarity ratio between 0 and 1 for two strings based on Levenshtein distance.',
                        example: 'similarity ratio of "kitten" and "sitting" returns approximately 0.571.',
                        returns: 'the similarity ratio as a number between 0 and 1'
                    }
                },
                {
                    opcode: 'textCamelCase',
                    blockType: BlockType.REPORTER,
                    text: 'to camelCase [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Converts text to camelCase format, removing separators and capitalizing each word after the first.',
                        example: 'to camelCase "hello world" returns "helloWorld".',
                        returns: 'the text converted to camelCase'
                    }
                },
                {
                    opcode: 'textSnakeCase',
                    blockType: BlockType.REPORTER,
                    text: 'to snake_case [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Converts text to snake_case format, replacing separators with underscores and lowercasing.',
                        example: 'to snake_case "hello world" returns "hello_world".',
                        returns: 'the text converted to snake_case'
                    }
                },
                {
                    opcode: 'textKebabCase',
                    blockType: BlockType.REPORTER,
                    text: 'to kebab-case [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Converts text to kebab-case format, replacing separators with hyphens and lowercasing.',
                        example: 'to kebab-case "hello world" returns "hello-world".',
                        returns: 'the text converted to kebab-case'
                    }
                },
                {
                    opcode: 'textTruncate',
                    blockType: BlockType.REPORTER,
                    text: 'truncate [TEXT] to [LEN] chars with [ELLIPSIS]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'This is a long text'
                        },
                        LEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        ELLIPSIS: {
                            type: ArgumentType.STRING,
                            defaultValue: '...'
                        }
                    },
                    doc: {
                        description: 'Truncates the text to a specified length, appending an ellipsis (or custom suffix) if the text was shortened.',
                        example: 'truncate "This is a long text" to 10 chars with "..." returns "This is...".',
                        returns: 'the truncated text with ellipsis appended if shortened'
                    }
                },
                {
                    opcode: 'textCountOccurrences',
                    blockType: BlockType.REPORTER,
                    text: 'count [SEARCH] in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello hello world'
                        },
                        SEARCH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Counts how many times a search string appears in the text.',
                        example: 'count "hello" in "hello hello world" returns 2.',
                        returns: 'the number of occurrences as a number'
                    }
                },
                {
                    opcode: 'textRemoveTags',
                    blockType: BlockType.REPORTER,
                    text: 'remove HTML tags [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: '<b>hello</b> <i>world</i>'
                        }
                    },
                    doc: {
                        description: 'Removes all HTML tags from the text, returning only the plain text content.',
                        example: 'remove HTML tags "<b>hello</b> <i>world</i>" returns "hello world".',
                        returns: 'the text with HTML tags stripped'
                    }
                },
                '---',
                {
                    opcode: 'textIsEmpty',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [TEXT] empty?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    },
                    doc: {
                        description: 'Checks whether the text has a length of zero.',
                        example: 'is "" empty? returns true.',
                        returns: 'true if the text is empty, false otherwise'
                    }
                },
                {
                    opcode: 'textIsBlank',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [TEXT] blank?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: '   '
                        }
                    },
                    doc: {
                        description: 'Checks whether the text is empty or contains only whitespace characters.',
                        example: 'is "   " blank? returns true.',
                        returns: 'true if the text is blank (empty or whitespace only), false otherwise'
                    }
                },
                {
                    opcode: 'textIsNumeric',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [TEXT] numeric?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: '123'
                        }
                    },
                    doc: {
                        description: 'Checks whether the text represents a valid number.',
                        example: 'is "123" numeric? returns true.',
                        returns: 'true if the text is numeric, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'textFirstWord',
                    blockType: BlockType.REPORTER,
                    text: 'first word of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Returns the first word of the text, splitting on whitespace.',
                        example: 'first word of "hello world" returns "hello".',
                        returns: 'the first word, or empty string if there are no words'
                    }
                },
                {
                    opcode: 'textLastWord',
                    blockType: BlockType.REPORTER,
                    text: 'last word of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Returns the last word of the text, splitting on whitespace.',
                        example: 'last word of "hello world" returns "world".',
                        returns: 'the last word, or empty string if there are no words'
                    }
                },
                {
                    opcode: 'textWordCount',
                    blockType: BlockType.REPORTER,
                    text: 'word count of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Counts the number of words in the text, splitting on whitespace.',
                        example: 'word count of "hello world" returns 2.',
                        returns: 'the word count as a number'
                    }
                },
                {
                    opcode: 'textLongestWord',
                    blockType: BlockType.REPORTER,
                    text: 'longest word in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello beautiful world'
                        }
                    },
                    doc: {
                        description: 'Finds and returns the longest word in the text by character count.',
                        example: 'longest word in "hello beautiful world" returns "beautiful".',
                        returns: 'the longest word, or empty string if there are no words'
                    }
                },
                {
                    opcode: 'textShortestWord',
                    blockType: BlockType.REPORTER,
                    text: 'shortest word in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a beautiful world'
                        }
                    },
                    doc: {
                        description: 'Finds and returns the shortest word in the text by character count.',
                        example: 'shortest word in "a beautiful world" returns "a".',
                        returns: 'the shortest word, or empty string if there are no words'
                    }
                },
                '---',
                {
                    opcode: 'textSwapCase',
                    blockType: BlockType.REPORTER,
                    text: 'swap case of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello World'
                        }
                    },
                    doc: {
                        description: 'Swaps the case of each character in the text. Uppercase becomes lowercase and vice versa.',
                        example: 'swap case of "Hello World" returns "hELLO wORLD".',
                        returns: 'the text with each character\'s case swapped'
                    }
                },
                {
                    opcode: 'textToTitleCase',
                    blockType: BlockType.REPORTER,
                    text: 'title case [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Converts text to title case, capitalizing the first letter of each word.',
                        example: 'title case "hello world" returns "Hello World".',
                        returns: 'the text converted to title case'
                    }
                },
                {
                    opcode: 'textRandomString',
                    blockType: BlockType.REPORTER,
                    text: 'random string length [LENGTH]',
                    arguments: {
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        }
                    },
                    doc: {
                        description: 'Generates a random alphanumeric string of the specified length.',
                        example: 'random string length 8 returns something like "aB3xK9mZ".',
                        returns: 'a random alphanumeric string'
                    }
                },
                '---',
                {
                    opcode: 'textMaskEmail',
                    blockType: BlockType.REPORTER,
                    text: 'mask email [EMAIL]',
                    arguments: {
                        EMAIL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'john.doe@example.com'
                        }
                    },
                    doc: {
                        description: 'Masks an email address by replacing characters between the first letter and the @ symbol with asterisks.',
                        example: 'mask email "john.doe@example.com" returns "j***@example.com".',
                        returns: 'the masked email address'
                    }
                },
                {
                    opcode: 'textMaskPhone',
                    blockType: BlockType.REPORTER,
                    text: 'mask phone [PHONE]',
                    arguments: {
                        PHONE: {
                            type: ArgumentType.STRING,
                            defaultValue: '555-123-4567'
                        }
                    },
                    doc: {
                        description: 'Masks a phone number, showing only the last 4 digits.',
                        example: 'mask phone "555-123-4567" returns "***-***-4567".',
                        returns: 'the masked phone number'
                    }
                },
                {
                    opcode: 'textZalgo',
                    blockType: BlockType.REPORTER,
                    text: 'zalgo [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello'
                        }
                    },
                    doc: {
                        description: 'Adds zalgo (combining diacritical marks) to each character in the text for a glitchy, corrupted text effect.',
                        example: 'zalgo "Hello" returns "H̴e̷l̸l̶o̵".',
                        returns: 'the text with zalgo diacritical marks applied'
                    }
                },
                '---',
                {
                    opcode: 'textExtractEmails',
                    blockType: BlockType.REPORTER,
                    text: 'extract emails from [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Contact us at support@example.com or info@test.org'
                        }
                    },
                    doc: {
                        description: 'Extracts all email addresses from text using regex and returns them as a JSON array.',
                        example: 'extract emails from "hello@world.com foo@bar.com" returns \'["hello@world.com","foo@bar.com"]\'.',
                        returns: 'a JSON array of found email addresses, or empty array if none found'
                    }
                },
                {
                    opcode: 'textExtractUrls',
                    blockType: BlockType.REPORTER,
                    text: 'extract URLs from [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Visit https://example.com and http://test.org'
                        }
                    },
                    doc: {
                        description: 'Extracts all URLs from text using regex and returns them as a JSON array.',
                        example: 'extract URLs from "Visit https://example.com" returns \'["https://example.com"]\'.',
                        returns: 'a JSON array of found URLs, or empty array if none found'
                    }
                },
                {
                    opcode: 'textExtractNumbers',
                    blockType: BlockType.REPORTER,
                    text: 'extract numbers from [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'I have 42 apples and 7 oranges'
                        }
                    },
                    doc: {
                        description: 'Extracts all numbers from text using regex and returns them as a JSON array.',
                        example: 'extract numbers from "42 apples and 7 oranges" returns \'[42,7]\'.',
                        returns: 'a JSON array of extracted numbers, or empty array if none found'
                    }
                },
                {
                    opcode: 'textHashCode',
                    blockType: BlockType.REPORTER,
                    text: 'hash code of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Computes a numeric hash code for the text using the djb2 algorithm.',
                        example: 'hash code of "hello" returns 99162322 (varies by implementation).',
                        returns: 'a numeric hash code as an integer'
                    }
                },
                {
                    opcode: 'textSimilarChars',
                    blockType: BlockType.REPORTER,
                    text: 'similar chars [A] vs [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hollow'
                        }
                    },
                    doc: {
                        description: 'Calculates the percentage (0-100) of characters that are the same at the same positions in two strings.',
                        example: 'similar chars "hello" vs "hollow" returns 50 (h, l at index 0,2 match).',
                        returns: 'a percentage between 0 and 100'
                    }
                },
                {
                    opcode: 'textFillTemplate',
                    blockType: BlockType.REPORTER,
                    text: 'fill template [TEMPLATE] with [JSON_DATA]',
                    arguments: {
                        TEMPLATE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello {{name}}, you are {{age}} years old'
                        },
                        JSON_DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"name":"Alice","age":30}'
                        }
                    },
                    doc: {
                        description: 'Replaces {{key}} placeholders in the template with values from a JSON object.',
                        example: 'fill template "Hello {{name}}" with \'{"name":"Alice"}\' returns "Hello Alice".',
                        returns: 'the template with all {{key}} placeholders replaced'
                    }
                },
                '---',
                {
                    opcode: 'textIsPalindrome',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [TEXT] a palindrome?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'racecar'
                        }
                    },
                    doc: {
                        description: 'Checks if the text reads the same forwards and backwards.',
                        example: 'is "racecar" a palindrome? returns true.',
                        returns: 'true if the text is a palindrome, false otherwise'
                    }
                },
                {
                    opcode: 'textIsAnagram',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [A] an anagram of [B]?',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'listen'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'silent'
                        }
                    },
                    doc: {
                        description: 'Checks if two strings are anagrams (contain the same letters).',
                        example: 'is "listen" an anagram of "silent"? returns true.',
                        returns: 'true if the strings are anagrams, false otherwise'
                    }
                },
                {
                    opcode: 'textCountVowels',
                    blockType: BlockType.REPORTER,
                    text: 'count vowels in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Counts the number of vowels (a, e, i, o, u) in the text.',
                        example: 'count vowels in "hello world" returns 3.',
                        returns: 'the number of vowels as a number'
                    }
                },
                {
                    opcode: 'textCountConsonants',
                    blockType: BlockType.REPORTER,
                    text: 'count consonants in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Counts the number of consonant letters in the text.',
                        example: 'count consonants in "hello world" returns 7.',
                        returns: 'the number of consonants as a number'
                    }
                },
                {
                    opcode: 'textCountWords',
                    blockType: BlockType.REPORTER,
                    text: 'count words in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello beautiful world'
                        }
                    },
                    doc: {
                        description: 'Counts the number of words by splitting on whitespace.',
                        example: 'count words in "hello beautiful world" returns 3.',
                        returns: 'the word count as a number'
                    }
                },
                {
                    opcode: 'textMostCommonChar',
                    blockType: BlockType.REPORTER,
                    text: 'most common character in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Finds the most frequently occurring character in the text.',
                        example: 'most common character in "hello" returns "l".',
                        returns: 'the most common character, or empty string if the text is empty'
                    }
                },
                {
                    opcode: 'textRemoveDuplicateChars',
                    blockType: BlockType.REPORTER,
                    text: 'remove duplicate chars from [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Removes all duplicate characters, keeping only the first occurrence of each.',
                        example: 'remove duplicate chars from "hello" returns "helo".',
                        returns: 'the text with duplicate characters removed'
                    }
                },
                {
                    opcode: 'textShuffleChars',
                    blockType: BlockType.REPORTER,
                    text: 'shuffle chars of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Randomly shuffles the characters in the text.',
                        example: 'shuffle chars of "hello" returns something like "ehllo".',
                        returns: 'the shuffled text'
                    }
                },
                {
                    opcode: 'textWrapInTag',
                    blockType: BlockType.REPORTER,
                    text: 'wrap [TEXT] in <[TAG]>',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        TAG: {
                            type: ArgumentType.STRING,
                            defaultValue: 'b'
                        }
                    },
                    doc: {
                        description: 'Wraps the text in an HTML opening and closing tag.',
                        example: 'wrap "hello" in <b> returns "<b>hello</b>".',
                        returns: 'the text wrapped in the specified tag'
                    }
                },
                {
                    opcode: 'textStripPunctuation',
                    blockType: BlockType.REPORTER,
                    text: 'strip punctuation from [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello, world!'
                        }
                    },
                    doc: {
                        description: 'Removes punctuation characters like .,!?;:\'"- from the text.',
                        example: 'strip punctuation from "hello, world!" returns "hello world".',
                        returns: 'the text with punctuation removed'
                    }
                },
                {
                    opcode: 'textKeepLetters',
                    blockType: BlockType.REPORTER,
                    text: 'keep only letters in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello123'
                        }
                    },
                    doc: {
                        description: 'Keeps only alphabetic characters (a-z, A-Z) and removes all others.',
                        example: 'keep only letters in "hello123" returns "hello".',
                        returns: 'the text with only alphabetic characters'
                    }
                },
                {
                    opcode: 'textKeepDigits',
                    blockType: BlockType.REPORTER,
                    text: 'keep only digits in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'abc123def'
                        }
                    },
                    doc: {
                        description: 'Keeps only numeric digit characters (0-9) and removes all others.',
                        example: 'keep only digits in "abc123def" returns "123".',
                        returns: 'the text with only digit characters'
                    }
                },
                {
                    opcode: 'textToBinary',
                    blockType: BlockType.REPORTER,
                    text: 'text [TEXT] to binary',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Converts each character in the text to its 8-bit binary representation, separated by spaces.',
                        example: 'text "hello" to binary returns "01101000 01100101 01101100 01101100 01101111".',
                        returns: 'a space-separated binary string'
                    }
                },
                {
                    opcode: 'textFromBinary',
                    blockType: BlockType.REPORTER,
                    text: 'text from binary [BINARY]',
                    arguments: {
                        BINARY: {
                            type: ArgumentType.STRING,
                            defaultValue: '01101000 01100101 01101100 01101100 01101111'
                        }
                    },
                    doc: {
                        description: 'Converts a space-separated binary string back into text.',
                        example: 'text from binary "01101000 01100101 01101100 01101100 01101111" returns "hello".',
                        returns: 'the decoded text'
                    }
                },
                {
                    opcode: 'textToMorse',
                    blockType: BlockType.REPORTER,
                    text: '[TEXT] to morse code',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Converts text to Morse code using the standard ITU Morse code mapping.',
                        example: '"hello" to morse code returns ".... . .-.. .-.. ---".',
                        returns: 'the Morse code representation with spaces between characters'
                    }
                },
                '---',
                {
                    opcode: 'textSlugify',
                    blockType: BlockType.REPORTER,
                    text: 'slugify [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello World!'
                        }
                    },
                    doc: {
                        description: 'Converts text to a URL-friendly slug: lowercase, replace spaces with hyphens, remove non-alphanumeric characters.',
                        example: 'slugify "Hello World!" returns "hello-world".',
                        returns: 'the slugified text'
                    }
                },
                {
                    opcode: 'textTruncateWords',
                    blockType: BlockType.REPORTER,
                    text: 'truncate [TEXT] to [COUNT] words with [ELLIPSIS]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world foo bar'
                        },
                        COUNT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        },
                        ELLIPSIS: {
                            type: ArgumentType.STRING,
                            defaultValue: '...'
                        }
                    },
                    doc: {
                        description: 'Truncates text to a specified number of words, appending an ellipsis if truncated.',
                        example: 'truncate "hello world foo bar" to 2 words with "..." returns "hello world...".',
                        returns: 'the truncated text'
                    }
                },
                {
                    opcode: 'textWordWrap',
                    blockType: BlockType.REPORTER,
                    text: 'word wrap [TEXT] to width [WIDTH]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world foo bar'
                        },
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 7
                        }
                    },
                    doc: {
                        description: 'Inserts newlines at word boundaries to wrap text to a specified width.',
                        example: 'word wrap "hello world foo bar" to width 7 returns "hello\\nworld\\nfoo bar".',
                        returns: 'the wrapped text with newlines'
                    }
                },
                {
                    opcode: 'textJustify',
                    blockType: BlockType.REPORTER,
                    text: 'justify [TEXT] to width [WIDTH]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    doc: {
                        description: 'Pads spaces between words to justify text to a specified width.',
                        example: 'justify "hello world" to width 20 returns a justified string of length 20.',
                        returns: 'the justified text'
                    }
                },
                {
                    opcode: 'textCenter',
                    blockType: BlockType.REPORTER,
                    text: 'center [TEXT] in width [WIDTH]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    },
                    doc: {
                        description: 'Centers text within a specified width by padding with spaces on both sides.',
                        example: 'center "hello" in width 20 returns "       hello        ".',
                        returns: 'the centered text'
                    }
                },
                {
                    opcode: 'textReverseWords',
                    blockType: BlockType.REPORTER,
                    text: 'reverse words in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Reverses the order of words in the text.',
                        example: 'reverse words in "hello world" returns "world hello".',
                        returns: 'the text with words reversed'
                    }
                },
                {
                    opcode: 'textSortLines',
                    blockType: BlockType.REPORTER,
                    text: 'sort lines in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'banana\napple\ncherry'
                        }
                    },
                    doc: {
                        description: 'Sorts lines alphabetically and returns them joined with newlines.',
                        example: 'sort lines in "banana\\napple\\ncherry" returns "apple\\nbanana\\ncherry".',
                        returns: 'the sorted text with newlines'
                    }
                },
                {
                    opcode: 'textDeduplicateLines',
                    blockType: BlockType.REPORTER,
                    text: 'deduplicate lines in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a\nb\na'
                        }
                    },
                    doc: {
                        description: 'Removes duplicate lines from text, keeping only the first occurrence of each.',
                        example: 'deduplicate lines in "a\\nb\\na" returns "a\\nb".',
                        returns: 'the text with duplicate lines removed'
                    }
                },
                {
                    opcode: 'textColumnExtract',
                    blockType: BlockType.REPORTER,
                    text: 'extract column [COLUMN] from [TEXT] separated by [SEP]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a,b,c'
                        },
                        COLUMN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        SEP: {
                            type: ArgumentType.STRING,
                            defaultValue: ','
                        }
                    },
                    doc: {
                        description: 'Extracts the Nth column from delimited text (0-indexed).',
                        example: 'extract column 1 from "a,b,c" separated by "," returns "b".',
                        returns: 'the extracted column values joined with newlines, or empty string if out of range'
                    }
                },
                {
                    opcode: 'textTransliterate',
                    blockType: BlockType.REPORTER,
                    text: 'transliterate [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'café'
                        }
                    },
                    doc: {
                        description: 'Converts accented characters to their ASCII equivalents using a simple mapping (é→e, ñ→n, ü→u, etc.).',
                        example: 'transliterate "café" returns "cafe".',
                        returns: 'the transliterated text'
                    }
                },
                {
                    opcode: 'textStripAccents',
                    blockType: BlockType.REPORTER,
                    text: 'strip accents from [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'café'
                        }
                    },
                    doc: {
                        description: 'Removes diacritical marks (accents) from characters using Unicode normalization.',
                        example: 'strip accents from "café" returns "cafe".',
                        returns: 'the text with accents removed'
                    }
                },
                {
                    opcode: 'textToInitials',
                    blockType: BlockType.REPORTER,
                    text: 'initials of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'john doe'
                        }
                    },
                    doc: {
                        description: 'Extracts the first letter of each word and converts to uppercase.',
                        example: 'initials of "john doe" returns "JD".',
                        returns: 'the initials as an uppercase string'
                    }
                },
                '---',
                {
                    opcode: 'textRandomChar',
                    blockType: BlockType.REPORTER,
                    text: 'random letter a-z',
                    doc: {
                        description: 'Generates a random lowercase letter from a to z.',
                        example: 'random letter a-z returns "k" (varies).',
                        returns: 'a random lowercase letter'
                    }
                },
                {
                    opcode: 'textRandomDigit',
                    blockType: BlockType.REPORTER,
                    text: 'random digit 0-9',
                    doc: {
                        description: 'Generates a random digit character from 0 to 9.',
                        example: 'random digit 0-9 returns "7" (varies).',
                        returns: 'a random digit character'
                    }
                },
                {
                    opcode: 'textRandomHex',
                    blockType: BlockType.REPORTER,
                    text: 'random hex string length [LENGTH]',
                    arguments: {
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        }
                    },
                    doc: {
                        description: 'Generates a random hexadecimal string of the specified length.',
                        example: 'random hex string length 8 returns "a3f9c2b1".',
                        returns: 'a random hex string'
                    }
                },
                {
                    opcode: 'textRandomColorHex',
                    blockType: BlockType.REPORTER,
                    text: 'random hex color',
                    doc: {
                        description: 'Generates a random hex color code in #RRGGBB format.',
                        example: 'random hex color returns "#A3F9C2".',
                        returns: 'a random hex color string like "#RRGGBB"'
                    }
                },
                '---',
                {
                    opcode: 'textHammingDistance',
                    blockType: BlockType.REPORTER,
                    text: 'hamming distance [A] [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hollow'
                        }
                    },
                    doc: {
                        description: 'Counts the number of positions where characters differ between two strings of equal length.',
                        example: 'hamming distance "hello" "hollow" returns 2.',
                        returns: 'the Hamming distance as a number, or -1 if strings have different lengths'
                    }
                },
                {
                    opcode: 'textDiceCoefficient',
                    blockType: BlockType.REPORTER,
                    text: 'dice coefficient [A] [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hollow'
                        }
                    },
                    doc: {
                        description: 'Calculates the Sørensen–Dice coefficient between two strings based on bigram overlap.',
                        example: 'dice coefficient "hello" "hollow" returns a value between 0 and 1.',
                        returns: 'the Dice coefficient as a number between 0 and 1'
                    }
                },
                {
                    opcode: 'textJaroWinkler',
                    blockType: BlockType.REPORTER,
                    text: 'jaro-winkler similarity [A] [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hollow'
                        }
                    },
                    doc: {
                        description: 'Calculates the Jaro-Winkler similarity between two strings (0 to 1).',
                        example: 'jaro-winkler similarity "hello" "hollow" returns a value between 0 and 1.',
                        returns: 'the Jaro-Winkler similarity as a number between 0 and 1'
                    }
                },
                {
                    opcode: 'textNGrams',
                    blockType: BlockType.REPORTER,
                    text: 'n-grams of [TEXT] with n [N]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    doc: {
                        description: 'Generates n-grams from the text and returns them as a JSON array.',
                        example: 'n-grams of "hello" with n 2 returns \'["he","el","ll","lo"]\'.',
                        returns: 'a JSON array of n-grams'
                    }
                },
                {
                    opcode: 'textBagOfWords',
                    blockType: BlockType.REPORTER,
                    text: 'bag of words for [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world hello'
                        }
                    },
                    doc: {
                        description: 'Creates a word frequency map from the text, returned as a JSON object.',
                        example: 'bag of words for "hello world hello" returns \'{"hello":2,"world":1}\'.',
                        returns: 'a JSON object mapping words to their frequencies'
                    }
                },
                {
                    opcode: 'textUniqueWords',
                    blockType: BlockType.REPORTER,
                    text: 'unique words in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world hello'
                        }
                    },
                    doc: {
                        description: 'Extracts unique words from the text and returns them as a JSON array.',
                        example: 'unique words in "hello world hello" returns \'["hello","world"]\'.',
                        returns: 'a JSON array of unique words'
                    }
                },
                '---',
                {
                    opcode: 'textFleschScore',
                    blockType: BlockType.REPORTER,
                    text: 'flesch reading ease of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'The cat sat on the mat.'
                        }
                    },
                    doc: {
                        description: 'Calculates the Flesch Reading Ease score (0-100). Higher scores mean easier to read.',
                        example: 'flesch reading ease of "The cat sat on the mat." returns a score.',
                        returns: 'the Flesch Reading Ease score as a number'
                    }
                },
                {
                    opcode: 'textDaleChall',
                    blockType: BlockType.REPORTER,
                    text: 'dale-chall score of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'The cat sat on the mat.'
                        }
                    },
                    doc: {
                        description: 'Calculates a simplified Dale-Chall readability score based on sentence length and hard word percentage.',
                        example: 'dale-chall score of "The cat sat on the mat." returns a score.',
                        returns: 'the Dale-Chall readability score as a number'
                    }
                },
                {
                    opcode: 'textColemanLiau',
                    blockType: BlockType.REPORTER,
                    text: 'coleman-liau index of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'The cat sat on the mat.'
                        }
                    },
                    doc: {
                        description: 'Calculates the Coleman-Liau index: 0.0588*L - 0.296*S - 15.8 where L is avg letters per 100 words and S is avg sentences per 100 words.',
                        example: 'coleman-liau index of "The cat sat on the mat." returns a score.',
                        returns: 'the Coleman-Liau index as a number'
                    }
                }
            ]
        };
    }

    textToUpper (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.toUpperCase();
        } catch (e) {
            return '';
        }
    }

    textToLower (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.toLowerCase();
        } catch (e) {
            return '';
        }
    }

    textTrim (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.trim();
        } catch (e) {
            return '';
        }
    }

    textReverse (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.split('').reverse().join('');
        } catch (e) {
            return '';
        }
    }

    textPadStart (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const len = Cast.toNumber(args.LEN);
            const char = Cast.toString(args.CHAR);
            return text.padStart(len, char);
        } catch (e) {
            return '';
        }
    }

    textPadEnd (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const len = Cast.toNumber(args.LEN);
            const char = Cast.toString(args.CHAR);
            return text.padEnd(len, char);
        } catch (e) {
            return '';
        }
    }

    textSplit (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const sep = Cast.toString(args.SEP);
            return JSON.stringify(text.split(sep));
        } catch (e) {
            return '';
        }
    }

    textSlice (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const start = Cast.toNumber(args.START);
            const end = Cast.toNumber(args.END);
            return text.slice(start, end);
        } catch (e) {
            return '';
        }
    }

    textSubstring (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const start = Cast.toNumber(args.START);
            const len = Cast.toNumber(args.LEN);
            return text.substr(start, len);
        } catch (e) {
            return '';
        }
    }

    textReplace (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const pattern = Cast.toString(args.PATTERN);
            const replacement = Cast.toString(args.REPLACEMENT);
            return text.replace(pattern, replacement);
        } catch (e) {
            return '';
        }
    }

    textReplaceAll (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const pattern = Cast.toString(args.PATTERN);
            const replacement = Cast.toString(args.REPLACEMENT);
            return text.replaceAll(pattern, replacement);
        } catch (e) {
            return '';
        }
    }

    textRepeat (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const times = Cast.toNumber(args.TIMES);
            return text.repeat(times);
        } catch (e) {
            return '';
        }
    }

    textIndexOf (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const search = Cast.toString(args.SEARCH);
            return text.indexOf(search);
        } catch (e) {
            return '';
        }
    }

    textIncludes (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT);
            const search = Cast.toString(args.SEARCH);
            return text.includes(search);
        } catch (e) {
            return false;
        }
    }

    textStartsWith (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT);
            const search = Cast.toString(args.SEARCH);
            return text.startsWith(search);
        } catch (e) {
            return false;
        }
    }

    textEndsWith (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT);
            const search = Cast.toString(args.SEARCH);
            return text.endsWith(search);
        } catch (e) {
            return false;
        }
    }

    textCharCodeAt (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const index = Cast.toNumber(args.INDEX);
            const code = text.charCodeAt(index);
            return Number.isNaN(code) ? '' : code;
        } catch (e) {
            return '';
        }
    }

    textFromCharCode (args) {
        if (!args) return '';
        try {
            const code = Cast.toNumber(args.CODE);
            return String.fromCharCode(code);
        } catch (e) {
            return '';
        }
    }

    textRegexTest (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT);
            const regexStr = Cast.toString(args.REGEX);
            const regex = new RegExp(regexStr);
            return regex.test(text);
        } catch (e) {
            return false;
        }
    }

    textRegexMatch (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const regexStr = Cast.toString(args.REGEX);
            const regex = new RegExp(regexStr, 'g');
            const matches = text.match(regex);
            return matches ? JSON.stringify(matches) : '';
        } catch (e) {
            return '';
        }
    }

    textRegexReplace (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const regexStr = Cast.toString(args.REGEX);
            const replacement = Cast.toString(args.REPLACEMENT);
            const regex = new RegExp(regexStr, 'g');
            return text.replace(regex, replacement);
        } catch (e) {
            return '';
        }
    }

    textConcat (args) {
        if (!args) return '';
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            return a + b;
        } catch (e) {
            return '';
        }
    }

    textInterpolate (args) {
        if (!args) return '';
        try {
            let template = Cast.toString(args.TEMPLATE);
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const c = Cast.toString(args.C);
            template = template.replace(/\{0\}/g, a);
            template = template.replace(/\{1\}/g, b);
            template = template.replace(/\{2\}/g, c);
            return template;
        } catch (e) {
            return '';
        }
    }

    textEscapeHTML (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&#39;')
                .replace(/"/g, '&quot;');
        } catch (e) {
            return '';
        }
    }

    textUnescapeHTML (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&#39;/g, '\'')
                .replace(/&quot;/g, '"');
        } catch (e) {
            return '';
        }
    }

    textLevenshtein (args) {
        if (!args) return 0;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const m = a.length;
            const n = b.length;
            const dp = [];
            for (let i = 0; i <= m; i++) {
                dp[i] = [i];
            }
            for (let j = 0; j <= n; j++) {
                dp[0][j] = j;
            }
            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1] + cost
                    );
                }
            }
            return dp[m][n];
        } catch (e) {
            return 0;
        }
    }

    textSimilarity (args) {
        if (!args) return 0;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            if (a.length === 0 && b.length === 0) return 1;
            const dist = this.textLevenshtein(args);
            const maxLen = Math.max(a.length, b.length);
            if (maxLen === 0) return 1;
            return 1 - dist / maxLen;
        } catch (e) {
            return 0;
        }
    }

    textCamelCase (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 0);
            if (words.length === 0) return '';
            const first = words[0].toLowerCase();
            const rest = words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            return first + rest.join('');
        } catch (e) {
            return '';
        }
    }

    textSnakeCase (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 0).map(w => w.toLowerCase()).join('_');
        } catch (e) {
            return '';
        }
    }

    textKebabCase (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 0).map(w => w.toLowerCase()).join('-');
        } catch (e) {
            return '';
        }
    }

    textTruncate (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const len = Cast.toNumber(args.LEN);
            const ellipsis = Cast.toString(args.ELLIPSIS);
            if (text.length <= len) return text;
            return text.slice(0, Math.max(0, len - ellipsis.length)) + ellipsis;
        } catch (e) {
            return '';
        }
    }

    textCountOccurrences (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const search = Cast.toString(args.SEARCH);
            if (!search) return 0;
            let count = 0;
            let pos = 0;
            while ((pos = text.indexOf(search, pos)) !== -1) {
                count++;
                pos += search.length;
            }
            return count;
        } catch (e) {
            return 0;
        }
    }

    textRemoveTags (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.replace(/<[^>]*>/g, '');
        } catch (e) {
            return '';
        }
    }

    textIsEmpty (args) {
        if (!args) return true;
        try {
            return Cast.toString(args.TEXT).length === 0;
        } catch (e) {
            return true;
        }
    }

    textIsBlank (args) {
        if (!args) return true;
        try {
            return Cast.toString(args.TEXT).trim().length === 0;
        } catch (e) {
            return true;
        }
    }

    textIsNumeric (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT);
            if (text.length === 0) return false;
            return !isNaN(text);
        } catch (e) {
            return false;
        }
    }

    textFirstWord (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.trim().split(/\s+/);
            return words.length > 0 ? words[0] : '';
        } catch (e) {
            return '';
        }
    }

    textLastWord (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.trim().split(/\s+/);
            return words.length > 0 ? words[words.length - 1] : '';
        } catch (e) {
            return '';
        }
    }

    textWordCount (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT).trim();
            if (!text) return 0;
            return text.split(/\s+/).length;
        } catch (e) {
            return 0;
        }
    }

    textLongestWord (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).trim();
            if (!text) return '';
            const words = text.split(/\s+/);
            let longest = words[0];
            for (const w of words) {
                if (w.length > longest.length) longest = w;
            }
            return longest;
        } catch (e) {
            return '';
        }
    }

    textShortestWord (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).trim();
            if (!text) return '';
            const words = text.split(/\s+/);
            let shortest = words[0];
            for (const w of words) {
                if (w.length < shortest.length) shortest = w;
            }
            return shortest;
        } catch (e) {
            return '';
        }
    }

    textSwapCase (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            let result = '';
            for (const ch of text) {
                if (ch === ch.toUpperCase()) {
                    result += ch.toLowerCase();
                } else {
                    result += ch.toUpperCase();
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textToTitleCase (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.replace(/\b\w/g, ch => ch.toUpperCase());
        } catch (e) {
            return '';
        }
    }

    textRandomString (args) {
        if (!args) return '';
        try {
            const len = Math.max(0, Cast.toNumber(args.LENGTH));
            let result = '';
            for (let i = 0; i < len; i++) {
                result += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textMaskEmail (args) {
        if (!args) return '';
        try {
            const email = Cast.toString(args.EMAIL);
            const atIdx = email.indexOf('@');
            if (atIdx <= 0) return email;
            const name = email.slice(0, atIdx);
            const domain = email.slice(atIdx);
            if (name.length <= 1) return email;
            return name[0] + '***' + domain;
        } catch (e) {
            return '';
        }
    }

    textMaskPhone (args) {
        if (!args) return '';
        try {
            const phone = Cast.toString(args.PHONE);
            const digits = phone.replace(/\D/g, '');
            if (digits.length < 4) return phone;
            const last4 = digits.slice(-4);
            const masked = '***-***-' + last4;
            return masked;
        } catch (e) {
            return '';
        }
    }

    textZalgo (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            let result = '';
            for (const ch of text) {
                result += ch;
                const count = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < count; i++) {
                    result += ZALGO_CHARS[Math.floor(Math.random() * ZALGO_CHARS.length)];
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textExtractEmails (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT);
            const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const matches = text.match(regex);
            return JSON.stringify(matches || []);
        } catch (e) {
            return '[]';
        }
    }

    textExtractUrls (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT);
            const regex = /https?:\/\/[^\s"'<>]+/g;
            const matches = text.match(regex);
            return JSON.stringify(matches || []);
        } catch (e) {
            return '[]';
        }
    }

    textExtractNumbers (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT);
            const regex = /-?\d+(\.\d+)?/g;
            const matches = text.match(regex);
            if (!matches) return '[]';
            const numbers = matches.map(n => parseFloat(n));
            return JSON.stringify(numbers);
        } catch (e) {
            return '[]';
        }
    }

    textHashCode (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            let hash = 5381;
            for (let i = 0; i < text.length; i++) {
                hash = ((hash << 5) + hash) + text.charCodeAt(i);
                hash = hash & hash;
            }
            return hash;
        } catch (e) {
            return 0;
        }
    }

    textSimilarChars (args) {
        if (!args) return 0;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            if (a.length === 0 && b.length === 0) return 100;
            const maxLen = Math.max(a.length, b.length);
            let same = 0;
            for (let i = 0; i < Math.min(a.length, b.length); i++) {
                if (a[i] === b[i]) same++;
            }
            return (same / maxLen) * 100;
        } catch (e) {
            return 0;
        }
    }

    textFillTemplate (args) {
        if (!args) return '';
        try {
            let template = Cast.toString(args.TEMPLATE);
            const jsonData = Cast.toString(args.JSON_DATA);
            let data = {};
            try {
                data = JSON.parse(jsonData);
            } catch (e) {
                return template;
            }
            return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
                return data[key] !== undefined ? String(data[key]) : match;
            });
        } catch (e) {
            return '';
        }
    }

    textIsPalindrome (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT);
            const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return cleaned === cleaned.split('').reverse().join('');
        } catch (e) {
            return false;
        }
    }

    textIsAnagram (args) {
        if (!args) return false;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const sort = s => s.replace(/[^a-z0-9]/gi, '').toLowerCase().split('').sort().join('');
            return sort(a) === sort(b);
        } catch (e) {
            return false;
        }
    }

    textCountVowels (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const matches = text.match(/[aeiou]/gi);
            return matches ? matches.length : 0;
        } catch (e) {
            return 0;
        }
    }

    textCountConsonants (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const matches = text.match(/[bcdfghjklmnpqrstvwxyz]/gi);
            return matches ? matches.length : 0;
        } catch (e) {
            return 0;
        }
    }

    textCountWords (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT).trim();
            if (!text) return 0;
            return text.split(/\s+/).length;
        } catch (e) {
            return 0;
        }
    }

    textMostCommonChar (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            if (!text) return '';
            const freq = {};
            let maxCount = 0;
            let maxChar = '';
            for (const ch of text) {
                freq[ch] = (freq[ch] || 0) + 1;
                if (freq[ch] > maxCount) {
                    maxCount = freq[ch];
                    maxChar = ch;
                }
            }
            return maxChar;
        } catch (e) {
            return '';
        }
    }

    textRemoveDuplicateChars (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const seen = new Set();
            let result = '';
            for (const ch of text) {
                if (!seen.has(ch)) {
                    seen.add(ch);
                    result += ch;
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textShuffleChars (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const arr = text.split('');
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.join('');
        } catch (e) {
            return '';
        }
    }

    textWrapInTag (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const tag = Cast.toString(args.TAG);
            return `<${tag}>${text}</${tag}>`;
        } catch (e) {
            return '';
        }
    }

    textStripPunctuation (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.replace(/[.,!?;:'"\-]/g, '');
        } catch (e) {
            return '';
        }
    }

    textKeepLetters (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.replace(/[^a-zA-Z]/g, '');
        } catch (e) {
            return '';
        }
    }

    textKeepDigits (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.replace(/[^0-9]/g, '');
        } catch (e) {
            return '';
        }
    }

    textToBinary (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const result = [];
            for (let i = 0; i < text.length; i++) {
                result.push(text.charCodeAt(i).toString(2).padStart(8, '0'));
            }
            return result.join(' ');
        } catch (e) {
            return '';
        }
    }

    textFromBinary (args) {
        if (!args) return '';
        try {
            const binary = Cast.toString(args.BINARY).trim();
            const bytes = binary.split(/\s+/);
            let result = '';
            for (const byte of bytes) {
                if (byte) result += String.fromCharCode(parseInt(byte, 2));
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textToMorse (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const MORSE_MAP = {
                'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
                'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---',
                'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---',
                'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
                'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--',
                'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
                '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
                '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
                '!': '-.-.--', ':': '---...', ';': '-.-.-.', '-': '-....-',
                '/': '-..-.', '(': '-.--.', ')': '-.--.-', ' ': '/'
            };
            const result = [];
            for (const ch of text) {
                if (MORSE_MAP[ch]) result.push(MORSE_MAP[ch]);
            }
            return result.join(' ');
        } catch (e) {
            return '';
        }
    }

    textSlugify (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
        } catch (e) {
            return '';
        }
    }

    textTruncateWords (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const count = Cast.toNumber(args.COUNT);
            const ellipsis = Cast.toString(args.ELLIPSIS);
            const words = text.trim().split(/\s+/);
            if (words.length <= count) return text;
            return words.slice(0, count).join(' ') + ellipsis;
        } catch (e) {
            return '';
        }
    }

    textWordWrap (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const width = Cast.toNumber(args.WIDTH);
            const words = text.split(/\s+/);
            const lines = [];
            let current = '';
            for (const word of words) {
                if (current.length + word.length + (current ? 1 : 0) > width) {
                    if (current) lines.push(current);
                    current = word;
                } else {
                    current = current ? current + ' ' + word : word;
                }
            }
            if (current) lines.push(current);
            return lines.join('\n');
        } catch (e) {
            return '';
        }
    }

    textJustify (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const width = Cast.toNumber(args.WIDTH);
            const words = text.trim().split(/\s+/);
            if (words.length === 0) return '';
            if (words.length === 1) return words[0].padEnd(width, ' ');
            const totalChars = words.reduce((s, w) => s + w.length, 0);
            const spacesNeeded = width - totalChars;
            const gaps = words.length - 1;
            const perGap = Math.floor(spacesNeeded / gaps);
            const extra = spacesNeeded % gaps;
            let result = words[0];
            for (let i = 1; i < words.length; i++) {
                const spaces = perGap + (i <= extra ? 1 : 0);
                result += ' '.repeat(spaces) + words[i];
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textCenter (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const width = Cast.toNumber(args.WIDTH);
            if (text.length >= width) return text;
            const totalPad = width - text.length;
            const leftPad = Math.floor(totalPad / 2);
            const rightPad = totalPad - leftPad;
            return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
        } catch (e) {
            return '';
        }
    }

    textReverseWords (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.trim().split(/\s+/).reverse().join(' ');
        } catch (e) {
            return '';
        }
    }

    textSortLines (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const lines = text.split('\n');
            lines.sort();
            return lines.join('\n');
        } catch (e) {
            return '';
        }
    }

    textDeduplicateLines (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const lines = text.split('\n');
            const seen = new Set();
            const result = [];
            for (const line of lines) {
                if (!seen.has(line)) {
                    seen.add(line);
                    result.push(line);
                }
            }
            return result.join('\n');
        } catch (e) {
            return '';
        }
    }

    textColumnExtract (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const column = Cast.toNumber(args.COLUMN);
            const sep = Cast.toString(args.SEP);
            const lines = text.split('\n');
            const result = [];
            for (const line of lines) {
                const parts = line.split(sep);
                if (column >= 0 && column < parts.length) {
                    result.push(parts[column]);
                }
            }
            return result.join('\n');
        } catch (e) {
            return '';
        }
    }

    textTransliterate (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const map = {
                'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e', 'ē': 'e',
                'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'ā': 'a',
                'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i', 'ī': 'i',
                'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o', 'ō': 'o',
                'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u', 'ū': 'u',
                'ñ': 'n', 'ç': 'c', 'ł': 'l', 'š': 's', 'ž': 'z',
                'ý': 'y', 'ÿ': 'y',
                'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
                'Á': 'A', 'À': 'A', 'Â': 'A', 'Ä': 'A', 'Ã': 'A',
                'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
                'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Ö': 'O', 'Õ': 'O',
                'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
                'Ñ': 'N', 'Ç': 'C'
            };
            let result = '';
            for (const ch of text) {
                result += map[ch] || ch;
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textStripAccents (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        } catch (e) {
            return '';
        }
    }

    textToInitials (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.trim().split(/\s+/);
            let result = '';
            for (const word of words) {
                if (word.length > 0) result += word[0].toUpperCase();
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textRandomChar () {
        try {
            return String.fromCharCode(97 + Math.floor(Math.random() * 26));
        } catch (e) {
            return '';
        }
    }

    textRandomDigit () {
        try {
            return String.fromCharCode(48 + Math.floor(Math.random() * 10));
        } catch (e) {
            return '';
        }
    }

    textRandomHex (args) {
        if (!args) return '';
        try {
            const len = Cast.toNumber(args.LENGTH);
            const hexChars = '0123456789abcdef';
            let result = '';
            for (let i = 0; i < len; i++) {
                result += hexChars[Math.floor(Math.random() * 16)];
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    textRandomColorHex () {
        try {
            const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            return '#' + r + g + b;
        } catch (e) {
            return '';
        }
    }

    textHammingDistance (args) {
        if (!args) return -1;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            if (a.length !== b.length) return -1;
            let dist = 0;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) dist++;
            }
            return dist;
        } catch (e) {
            return -1;
        }
    }

    textDiceCoefficient (args) {
        if (!args) return 0;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            const bigrams = s => {
                const set = new Set();
                for (let i = 0; i < s.length - 1; i++) {
                    set.add(s.substring(i, i + 2));
                }
                return set;
            };
            const bgA = bigrams(a);
            const bgB = bigrams(b);
            if (bgA.size === 0 && bgB.size === 0) return 1;
            let intersection = 0;
            for (const bg of bgA) {
                if (bgB.has(bg)) intersection++;
            }
            return (2 * intersection) / (bgA.size + bgB.size);
        } catch (e) {
            return 0;
        }
    }

    textJaroWinkler (args) {
        if (!args) return 0;
        try {
            const a = Cast.toString(args.A);
            const b = Cast.toString(args.B);
            if (a === b) return 1;
            if (a.length === 0 || b.length === 0) return 0;
            const matchDist = Math.floor(Math.max(a.length, b.length) / 2) - 1;
            const matchesA = new Array(a.length).fill(false);
            const matchesB = new Array(b.length).fill(false);
            let matches = 0;
            let transpositions = 0;
            for (let i = 0; i < a.length; i++) {
                const start = Math.max(0, i - matchDist);
                const end = Math.min(b.length, i + matchDist + 1);
                for (let j = start; j < end; j++) {
                    if (matchesB[j]) continue;
                    if (a[i] !== b[j]) continue;
                    matchesA[i] = true;
                    matchesB[j] = true;
                    matches++;
                    break;
                }
            }
            if (matches === 0) return 0;
            let k = 0;
            for (let i = 0; i < a.length; i++) {
                if (!matchesA[i]) continue;
                while (!matchesB[k]) k++;
                if (a[i] !== b[k]) transpositions++;
                k++;
            }
            const jaro = (matches / a.length + matches / b.length + (matches - transpositions / 2) / matches) / 3;
            let prefix = 0;
            for (let i = 0; i < Math.min(4, a.length, b.length); i++) {
                if (a[i] === b[i]) prefix++;
                else break;
            }
            return jaro + prefix * 0.1 * (1 - jaro);
        } catch (e) {
            return 0;
        }
    }

    textNGrams (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT);
            const n = Cast.toNumber(args.N);
            if (n < 1 || n > text.length) return '[]';
            const ngrams = [];
            for (let i = 0; i <= text.length - n; i++) {
                ngrams.push(text.substring(i, i + n));
            }
            return JSON.stringify(ngrams);
        } catch (e) {
            return '[]';
        }
    }

    textBagOfWords (args) {
        if (!args) return '{}';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0);
            const freq = {};
            for (const word of words) {
                freq[word] = (freq[word] || 0) + 1;
            }
            return JSON.stringify(freq);
        } catch (e) {
            return '{}';
        }
    }

    textUniqueWords (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0);
            return JSON.stringify([...new Set(words)]);
        } catch (e) {
            return '[]';
        }
    }

    textFleschScore (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const totalSentences = sentences.length || 1;
            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            const totalWords = words.length || 1;
            const syllables = words.reduce((sum, w) => {
                const word = w.toLowerCase().replace(/[^a-z]/g, '');
                if (word.length === 0) return sum;
                let count = 0;
                let prevVowel = false;
                const vowels = 'aeiouy';
                for (const ch of word) {
                    const isVowel = vowels.includes(ch);
                    if (isVowel && !prevVowel) count++;
                    prevVowel = isVowel;
                }
                if (count === 0) count = 1;
                if (word.endsWith('e') && count > 1) count--;
                return sum + count;
            }, 0);
            return 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (syllables / totalWords);
        } catch (e) {
            return 0;
        }
    }

    textDaleChall (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const easyWords = new Set([
                'a', 'about', 'after', 'all', 'also', 'an', 'and', 'any', 'are', 'as', 'at', 'be',
                'because', 'been', 'before', 'big', 'but', 'by', 'can', 'come', 'could', 'day', 'do',
                'down', 'each', 'first', 'for', 'from', 'get', 'go', 'had', 'has', 'have', 'he', 'her',
                'here', 'him', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'like',
                'little', 'long', 'make', 'many', 'may', 'me', 'more', 'most', 'much', 'my', 'new',
                'no', 'not', 'now', 'of', 'old', 'on', 'one', 'only', 'or', 'other', 'out', 'over',
                'people', 'said', 'same', 'see', 'she', 'so', 'some', 'such', 'take', 'than', 'that',
                'the', 'their', 'them', 'then', 'there', 'these', 'they', 'thing', 'this', 'those',
                'time', 'to', 'two', 'up', 'use', 'very', 'was', 'water', 'way', 'we', 'were', 'what',
                'when', 'where', 'which', 'who', 'will', 'with', 'would', 'you', 'your', 'cat', 'dog',
                'sat', 'mat', 'on', 'the'
            ]);
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const totalSentences = sentences.length || 1;
            const words = text.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0);
            const totalWords = words.length || 1;
            let hardWords = 0;
            for (const word of words) {
                const clean = word.replace(/[^a-z]/g, '');
                if (clean.length > 0 && !easyWords.has(clean)) hardWords++;
            }
            const avgSentenceLen = totalWords / totalSentences;
            const hardWordPercent = (hardWords / totalWords) * 100;
            return 0.1579 * hardWordPercent + 0.0496 * avgSentenceLen;
        } catch (e) {
            return 0;
        }
    }

    textColemanLiau (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const totalSentences = sentences.length || 1;
            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            const totalWords = words.length || 1;
            const letters = text.replace(/[^a-zA-Z]/g, '').length;
            const L = (letters / totalWords) * 100;
            const S = (totalSentences / totalWords) * 100;
            return 0.0588 * L - 0.296 * S - 15.8;
        } catch (e) {
            return 0;
        }
    }
}

module.exports = ScratchProTextBlocks;
