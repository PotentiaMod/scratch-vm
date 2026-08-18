const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const COMMON_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their',
    'his', 'her', 'its', 'our', 'your', 'my', 'me', 'us', 'this', 'that',
    'these', 'those', 'and', 'or', 'but', 'if', 'because', 'so', 'than',
    'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
    'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
    'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now'
]);

const POSITIVE_WORDS = new Set([
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'beautiful', 'love', 'happy', 'joy', 'perfect', 'awesome', 'positive',
    'best', 'brilliant', 'superb', 'nice', 'glad', 'pleased', 'delight',
    'cheerful', 'optimistic', 'success', 'win', 'celebrate', 'fun',
    'enjoy', 'thank', 'thanks', 'grateful', 'kind', 'helpful', 'pretty'
]);

const NEGATIVE_WORDS = new Set([
    'bad', 'terrible', 'horrible', 'awful', 'ugly', 'hate', 'sad',
    'angry', 'mad', 'upset', 'worst', 'poor', 'negative', 'evil',
    'disaster', 'dreadful', 'nasty', 'cruel', 'horrific', 'tragic',
    'miserable', 'depressing', 'pain', 'hurt', 'suffer', 'fail',
    'failure', 'loss', 'lost', 'damage', 'destroy', 'ruin', 'ugly'
]);

const POSITIVE = 'positive';
const NEGATIVE = 'negative';
const NEUTRAL = 'neutral';

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

const MORSE_REVERSE = {};
for (const [k, v] of Object.entries(MORSE_MAP)) {
    MORSE_REVERSE[v] = k;
}

const LEET_MAP = {
    'a': '4', 'e': '3', 'g': '9', 'i': '1', 'o': '0',
    's': '5', 't': '7', 'z': '2'
};

const HAIKU_TEMPLATES = [
    '[TOPIC] in the breeze\nwhispers through the silent trees\n[TOPIC] brings us peace',
    'Gentle [TOPIC] falls\non the quiet morning ground\nnature softly calls',
    '[TOPIC] shining bright\nin the darkness of the night\nguiding us with light',
    'Waves of [TOPIC] flow\nover everything we know\nletting our minds grow',
    '[TOPIC] gently grows\nwith the wind and rain it knows\nnew life it bestows'
];

class ScratchProAIBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._llmEndpoint = 'https://api.openai.com/v1/chat/completions';
        this._llmApiKey = '';
        this._llmModel = 'gpt-3.5-turbo';
    }

    getInfo () {
        return {
            id: 'scratchproai',
            name: 'AI',
            color1: '#FF4D8C',
            color2: '#D92D6A',
            color3: '#B81A52',
            blocks: [
                {
                    opcode: 'aiGenerateText',
                    blockType: BlockType.REPORTER,
                    text: 'generate text [PROMPT]',
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Tell me a joke'
                        }
                    },
                    doc: {
                        description: 'Generate text from a PROMPT using an AI model',
                        returns: 'The generated text'
                    }
                },
                {
                    opcode: 'aiSentiment',
                    blockType: BlockType.REPORTER,
                    text: 'sentiment of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'This is great'
                        }
                    },
                    doc: {
                        description: 'Analyze the sentiment of TEXT as positive, negative, or neutral',
                        returns: '"positive", "negative", or "neutral"'
                    }
                },
                {
                    opcode: 'aiKeywords',
                    blockType: BlockType.REPORTER,
                    text: 'keywords of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'machine learning is amazing'
                        }
                    },
                    doc: {
                        description: 'Extract the most significant keywords from TEXT',
                        returns: 'A JSON array of keywords'
                    }
                },
                {
                    opcode: 'aiSummarize',
                    blockType: BlockType.REPORTER,
                    text: 'summarize [TEXT] max [MAXLEN] sentences',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Once upon a time there was a program. It ran beautifully. Everyone loved it.'
                        },
                        MAXLEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    doc: {
                        description: 'Summarize TEXT into at most MAXLEN sentences',
                        returns: 'The summarized text'
                    }
                },
                {
                    opcode: 'aiContainsKeyword',
                    blockType: BlockType.BOOLEAN,
                    text: '[TEXT] contains [KEYWORD]?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        KEYWORD: {
                            type: ArgumentType.STRING,
                            defaultValue: 'world'
                        }
                    },
                    doc: {
                        description: 'Check if TEXT contains KEYWORD',
                        returns: 'true if keyword is found, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'aiWordCount',
                    blockType: BlockType.REPORTER,
                    text: 'word count of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Count the number of words in TEXT',
                        returns: 'The word count'
                    }
                },
                {
                    opcode: 'aiCharacterCount',
                    blockType: BlockType.REPORTER,
                    text: 'character count of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Count the number of characters in TEXT',
                        returns: 'The character count'
                    }
                },
                {
                    opcode: 'aiSentenceCount',
                    blockType: BlockType.REPORTER,
                    text: 'sentence count of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello. World!'
                        }
                    },
                    doc: {
                        description: 'Count the number of sentences in TEXT',
                        returns: 'The sentence count'
                    }
                },
                {
                    opcode: 'aiReverseWords',
                    blockType: BlockType.REPORTER,
                    text: 'reverse words of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Reverse the order of words in TEXT',
                        returns: 'The text with words reversed'
                    }
                },
                {
                    opcode: 'aiShuffleWords',
                    blockType: BlockType.REPORTER,
                    text: 'shuffle words of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world foo bar'
                        }
                    },
                    doc: {
                        description: 'Randomly shuffle the words in TEXT',
                        returns: 'The text with words in random order'
                    }
                },
                '---',
                {
                    opcode: 'aiEncodeMorse',
                    blockType: BlockType.REPORTER,
                    text: 'encode [TEXT] to morse',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Encode TEXT into Morse code',
                        returns: 'The Morse code representation'
                    }
                },
                {
                    opcode: 'aiDecodeMorse',
                    blockType: BlockType.REPORTER,
                    text: 'decode morse [MORSE]',
                    arguments: {
                        MORSE: {
                            type: ArgumentType.STRING,
                            defaultValue: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'
                        }
                    },
                    doc: {
                        description: 'Decode Morse code back into text',
                        returns: 'The decoded text'
                    }
                },
                {
                    opcode: 'aiRot13',
                    blockType: BlockType.REPORTER,
                    text: 'ROT13 [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Apply the ROT13 cipher to TEXT',
                        returns: 'The ROT13 encoded text'
                    }
                },
                '---',
                {
                    opcode: 'aiBinaryEncode',
                    blockType: BlockType.REPORTER,
                    text: 'binary encode [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Encode TEXT into binary representation',
                        returns: 'Binary string with space-separated bytes'
                    }
                },
                {
                    opcode: 'aiBinaryDecode',
                    blockType: BlockType.REPORTER,
                    text: 'binary decode [BINARY]',
                    arguments: {
                        BINARY: {
                            type: ArgumentType.STRING,
                            defaultValue: '01101000 01100101 01101100 01101100 01101111'
                        }
                    },
                    doc: {
                        description: 'Decode BINARY string back into text',
                        returns: 'The decoded text'
                    }
                },
                {
                    opcode: 'aiLeetSpeak',
                    blockType: BlockType.REPORTER,
                    text: '1337 speak [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Convert TEXT to leet speak (1337)',
                        returns: 'The leet speak version'
                    }
                },
                {
                    opcode: 'aiPigLatin',
                    blockType: BlockType.REPORTER,
                    text: 'pig latin [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Convert TEXT to Pig Latin',
                        returns: 'The Pig Latin translation'
                    }
                },
                '---',
                {
                    opcode: 'aiSpellCheck',
                    blockType: BlockType.REPORTER,
                    text: 'spell check [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello werld'
                        }
                    },
                    doc: {
                        description: 'Find potentially misspelled words in TEXT',
                        returns: 'A JSON array of misspelled words'
                    }
                },
                {
                    opcode: 'aiSyllableCount',
                    blockType: BlockType.REPORTER,
                    text: 'syllable count of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Count the number of syllables in TEXT',
                        returns: 'The syllable count'
                    }
                },
                {
                    opcode: 'aiReadability',
                    blockType: BlockType.REPORTER,
                    text: 'readability score of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'The cat sat on the mat.'
                        }
                    },
                    doc: {
                        description: 'Calculate the Flesch reading ease score of TEXT',
                        returns: 'A readability score from 0 to 100'
                    }
                },
                {
                    opcode: 'aiHaikuGenerate',
                    blockType: BlockType.REPORTER,
                    text: 'haiku about [TOPIC]',
                    arguments: {
                        TOPIC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'nature'
                        }
                    },
                    doc: {
                        description: 'Generate a haiku poem about TOPIC',
                        returns: 'A haiku poem string'
                    }
                },
                '---',
                {
                    opcode: 'aiAcronym',
                    blockType: BlockType.REPORTER,
                    text: 'acronym of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'As Soon As Possible'
                        }
                    },
                    doc: {
                        description: 'Generate an acronym from the first letters of each word in TEXT',
                        returns: 'The acronym string'
                    }
                },
                {
                    opcode: 'aiAnagram',
                    blockType: BlockType.REPORTER,
                    text: 'anagram of [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'listen'
                        }
                    },
                    doc: {
                        description: 'Generate a random anagram of TEXT',
                        returns: 'The anagram string'
                    }
                },
                {
                    opcode: 'aiPalindromeCheck',
                    blockType: BlockType.BOOLEAN,
                    text: 'is [TEXT] a palindrome?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'racecar'
                        }
                    },
                    doc: {
                        description: 'Check if TEXT is a palindrome',
                        returns: 'true if palindrome, false otherwise'
                    }
                },
                '---',
                {
                    opcode: 'aiCountLetters',
                    blockType: BlockType.REPORTER,
                    text: 'count letters in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello 123'
                        }
                    },
                    doc: {
                        description: 'Count the number of letter characters (a-z, A-Z) in TEXT',
                        returns: 'The letter count'
                    }
                },
                {
                    opcode: 'aiCountDigits',
                    blockType: BlockType.REPORTER,
                    text: 'count digits in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello 123'
                        }
                    },
                    doc: {
                        description: 'Count the number of digit characters (0-9) in TEXT',
                        returns: 'The digit count'
                    }
                },
                {
                    opcode: 'aiCountSpaces',
                    blockType: BlockType.REPORTER,
                    text: 'count spaces in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Count the number of space characters in TEXT',
                        returns: 'The space count'
                    }
                },
                {
                    opcode: 'aiCountPunctuation',
                    blockType: BlockType.REPORTER,
                    text: 'count punctuation in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello, world!'
                        }
                    },
                    doc: {
                        description: 'Count the number of punctuation characters in TEXT',
                        returns: 'The punctuation count'
                    }
                },
                {
                    opcode: 'aiAverageWordLength',
                    blockType: BlockType.REPORTER,
                    text: 'average word length in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello beautiful world'
                        }
                    },
                    doc: {
                        description: 'Calculate the average number of characters per word in TEXT',
                        returns: 'The average word length as a number'
                    }
                },
                {
                    opcode: 'aiLongestWord',
                    blockType: BlockType.REPORTER,
                    text: 'longest word in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello beautiful world'
                        }
                    },
                    doc: {
                        description: 'Find the longest word in TEXT by character count',
                        returns: 'The longest word string'
                    }
                },
                {
                    opcode: 'aiShortestWord',
                    blockType: BlockType.REPORTER,
                    text: 'shortest word in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'a beautiful world'
                        }
                    },
                    doc: {
                        description: 'Find the shortest word in TEXT by character count',
                        returns: 'The shortest word string'
                    }
                },
                {
                    opcode: 'aiMostCommonWord',
                    blockType: BlockType.REPORTER,
                    text: 'most common word in [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'the cat and the dog'
                        }
                    },
                    doc: {
                        description: 'Find the most frequently occurring word in TEXT',
                        returns: 'The most common word string'
                    }
                },
                '---',
                {
                    opcode: 'aiKMeans',
                    blockType: BlockType.REPORTER,
                    text: 'k-means cluster [DATA] with k=[K]',
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: '[1,2,3,4,5,6,7,8,9,10]'
                        },
                        K: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    doc: {
                        description: 'Perform k-means clustering on a JSON array of numbers',
                        returns: 'JSON {clusters, centroids}'
                    }
                },
                {
                    opcode: 'aiKNN',
                    blockType: BlockType.REPORTER,
                    text: 'KNN classify [QUERY] from [DATA] labels [LABELS] k=[K]',
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: '[[1,2],[3,4],[5,6]]'
                        },
                        LABELS: {
                            type: ArgumentType.STRING,
                            defaultValue: '["a","a","b"]'
                        },
                        QUERY: {
                            type: ArgumentType.STRING,
                            defaultValue: '[3,3]'
                        },
                        K: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        }
                    },
                    doc: {
                        description: 'K-nearest neighbors classification',
                        returns: 'Predicted label string'
                    }
                },
                {
                    opcode: 'aiNaiveBayes',
                    blockType: BlockType.REPORTER,
                    text: 'naive bayes classify [QUERY] from [DATA] labels [LABELS]',
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: '[["sunny","hot"],["rainy","mild"],["overcast","hot"]]'
                        },
                        LABELS: {
                            type: ArgumentType.STRING,
                            defaultValue: '["no","yes","yes"]'
                        },
                        QUERY: {
                            type: ArgumentType.STRING,
                            defaultValue: '["sunny","mild"]'
                        }
                    },
                    doc: {
                        description: 'Naive Bayes classification for categorical data',
                        returns: 'Predicted label string'
                    }
                },
                {
                    opcode: 'aiEuclideanDistance',
                    blockType: BlockType.REPORTER,
                    text: 'euclidean distance [A] to [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: '[0,0]'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: '[3,4]'
                        }
                    },
                    doc: {
                        description: 'Calculate Euclidean distance between two points (JSON arrays)',
                        returns: 'The distance as a number'
                    }
                },
                {
                    opcode: 'aiManhattanDistance',
                    blockType: BlockType.REPORTER,
                    text: 'manhattan distance [A] to [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: '[0,0]'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: '[3,4]'
                        }
                    },
                    doc: {
                        description: 'Calculate Manhattan distance between two points (JSON arrays)',
                        returns: 'The distance as a number'
                    }
                },
                {
                    opcode: 'aiCosineSimilarity',
                    blockType: BlockType.REPORTER,
                    text: 'cosine similarity [A] to [B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: '[1,2,3]'
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: '[4,5,6]'
                        }
                    },
                    doc: {
                        description: 'Calculate cosine similarity between two vectors (JSON arrays)',
                        returns: 'The similarity as a number between -1 and 1'
                    }
                },
                '---',
                {
                    opcode: 'aiTFIDF',
                    blockType: BlockType.REPORTER,
                    text: 'TF-IDF of [DOCUMENTS]',
                    arguments: {
                        DOCUMENTS: {
                            type: ArgumentType.STRING,
                            defaultValue: '["the cat sat","the dog ran","the cat and dog"]'
                        }
                    },
                    doc: {
                        description: 'Compute TF-IDF scores for multiple documents',
                        returns: 'JSON array of term weights per document'
                    }
                },
                {
                    opcode: 'aiTokenize',
                    blockType: BlockType.REPORTER,
                    text: 'tokenize [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    },
                    doc: {
                        description: 'Tokenize text into an array of words',
                        returns: 'JSON array of tokens'
                    }
                },
                {
                    opcode: 'aiRemoveStopwords',
                    blockType: BlockType.REPORTER,
                    text: 'remove stopwords from [TOKENS]',
                    arguments: {
                        TOKENS: {
                            type: ArgumentType.STRING,
                            defaultValue: '["the","cat","sat"]'
                        }
                    },
                    doc: {
                        description: 'Filter common English stopwords from a token array',
                        returns: 'JSON array of tokens without stopwords'
                    }
                },
                {
                    opcode: 'aiStem',
                    blockType: BlockType.REPORTER,
                    text: 'stem [WORD]',
                    arguments: {
                        WORD: {
                            type: ArgumentType.STRING,
                            defaultValue: 'running'
                        }
                    },
                    doc: {
                        description: 'Apply simple Porter-style stemming to a word',
                        returns: 'The stemmed word'
                    }
                },
                {
                    opcode: 'aiNGramModel',
                    blockType: BlockType.REPORTER,
                    text: 'build n-gram model from [TEXT] n=[N]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'the cat sat the cat ran'
                        },
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    doc: {
                        description: 'Build an n-gram language model from text',
                        returns: 'JSON {ngrams, count}'
                    }
                },
                '---',
                {
                    opcode: 'aiMarkovChain',
                    blockType: BlockType.REPORTER,
                    text: 'build markov chain from [DATA]',
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'the cat sat the cat ran'
                        }
                    },
                    doc: {
                        description: 'Build a Markov chain from training text',
                        returns: 'JSON {chain:{}, order:1}'
                    }
                },
                {
                    opcode: 'aiMarkovGenerate',
                    blockType: BlockType.REPORTER,
                    text: 'generate from markov chain [CHAIN] length [LENGTH]',
                    arguments: {
                        CHAIN: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    },
                    doc: {
                        description: 'Generate text from a Markov chain',
                        returns: 'Generated text string'
                    }
                },
                {
                    opcode: 'aiMarkovAdd',
                    blockType: BlockType.REPORTER,
                    text: 'add [TEXT] to markov chain [CHAIN]',
                    arguments: {
                        CHAIN: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'new training data'
                        }
                    },
                    doc: {
                        description: 'Add training data to an existing Markov chain',
                        returns: 'Updated Markov chain JSON'
                    }
                },
                '---',
                {
                    opcode: 'aiPerceptron',
                    blockType: BlockType.REPORTER,
                    text: 'perceptron [INPUTS] weights [WEIGHTS]',
                    arguments: {
                        INPUTS: {
                            type: ArgumentType.STRING,
                            defaultValue: '[1,0,1]'
                        },
                        WEIGHTS: {
                            type: ArgumentType.STRING,
                            defaultValue: '[0.5,-0.2,0.3]'
                        }
                    },
                    doc: {
                        description: 'Simple perceptron: weighted sum + step activation',
                        returns: '1 if sum >= 0, 0 otherwise'
                    }
                }
            ]
        };
    }

    aiGenerateText (args) {
        if (!args) return '';
        try {
            const prompt = Cast.toString(args.PROMPT);
            if (!prompt) return '';
            return fetch(this._llmEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this._llmApiKey}`
                },
                body: JSON.stringify({
                    model: this._llmModel,
                    messages: [{role: 'user', content: prompt}],
                    max_tokens: 200
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data && data.choices && data.choices.length > 0) {
                        return data.choices[0].message.content || '';
                    }
                    return '';
                })
                .catch(() => '');
        } catch (e) {
            return '';
        }
    }

    aiSentiment (args) {
        if (!args) return NEUTRAL;
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 0);
            let positiveCount = 0;
            let negativeCount = 0;
            for (const word of words) {
                if (POSITIVE_WORDS.has(word)) positiveCount++;
                if (NEGATIVE_WORDS.has(word)) negativeCount++;
            }
            if (positiveCount > negativeCount) return POSITIVE;
            if (negativeCount > positiveCount) return NEGATIVE;
            return NEUTRAL;
        } catch (e) {
            return NEUTRAL;
        }
    }

    aiKeywords (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 0 && !COMMON_WORDS.has(w));
            const freq = {};
            for (const word of words) {
                freq[word] = (freq[word] || 0) + 1;
            }
            const sorted = Object.entries(freq)
                .sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);
            return JSON.stringify(sorted.slice(0, 10));
        } catch (e) {
            return '[]';
        }
    }

    aiSummarize (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const maxLen = Math.max(1, Cast.toNumber(args.MAXLEN));
            const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
            return sentences.slice(0, maxLen).join('. ') + '.';
        } catch (e) {
            return '';
        }
    }

    aiContainsKeyword (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const keyword = Cast.toString(args.KEYWORD).toLowerCase();
            if (!keyword) return false;
            return text.includes(keyword);
        } catch (e) {
            return false;
        }
    }

    aiWordCount (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            if (!text.trim()) return 0;
            return text.trim().split(/\s+/).length;
        } catch (e) {
            return 0;
        }
    }

    aiCharacterCount (args) {
        if (!args) return 0;
        try {
            return Cast.toString(args.TEXT).length;
        } catch (e) {
            return 0;
        }
    }

    aiSentenceCount (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            if (!text.trim()) return 0;
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            return sentences.length;
        } catch (e) {
            return 0;
        }
    }

    aiReverseWords (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.split(/\s+/).filter(w => w.length > 0);
            return words.reverse().join(' ');
        } catch (e) {
            return '';
        }
    }

    aiShuffleWords (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.split(/\s+/).filter(w => w.length > 0);
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]];
            }
            return words.join(' ');
        } catch (e) {
            return '';
        }
    }

    aiEncodeMorse (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const result = [];
            for (const ch of text) {
                if (MORSE_MAP[ch] !== undefined) {
                    result.push(MORSE_MAP[ch]);
                }
            }
            return result.join(' ');
        } catch (e) {
            return '';
        }
    }

    aiDecodeMorse (args) {
        if (!args) return '';
        try {
            const morse = Cast.toString(args.MORSE).trim();
            const symbols = morse.split(/\s+/);
            const result = [];
            for (const sym of symbols) {
                if (MORSE_REVERSE[sym] !== undefined) {
                    result.push(MORSE_REVERSE[sym]);
                }
            }
            return result.join('');
        } catch (e) {
            return '';
        }
    }

    aiRot13 (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            let result = '';
            for (const ch of text) {
                const code = ch.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                    result += String.fromCharCode(((code - 65 + 13) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                    result += String.fromCharCode(((code - 97 + 13) % 26) + 97);
                } else {
                    result += ch;
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    aiBinaryEncode (args) {
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

    aiBinaryDecode (args) {
        if (!args) return '';
        try {
            const binary = Cast.toString(args.BINARY).trim();
            const bytes = binary.split(/\s+/);
            let result = '';
            for (const byte of bytes) {
                result += String.fromCharCode(parseInt(byte, 2));
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    aiLeetSpeak (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            let result = '';
            for (const ch of text) {
                result += LEET_MAP[ch] || ch;
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    aiPigLatin (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.split(/\s+/).filter(w => w.length > 0);
            const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
            const result = words.map(word => {
                if (word.length === 0) return '';
                if (VOWELS.has(word[0].toLowerCase())) {
                    return word + 'way';
                }
                let cluster = '';
                let i = 0;
                while (i < word.length && !VOWELS.has(word[i].toLowerCase())) {
                    cluster += word[i];
                    i++;
                }
                return word.slice(i) + cluster + 'ay';
            });
            return result.join(' ');
        } catch (e) {
            return '';
        }
    }

    aiSpellCheck (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.toLowerCase().split(/[^a-z]+/).filter(w => w.length > 0);
            const misspelled = words.filter(w => !COMMON_WORDS.has(w));
            return JSON.stringify(misspelled);
        } catch (e) {
            return '[]';
        }
    }

    aiSyllableCount (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 0);
            let total = 0;
            for (const word of words) {
                let count = 0;
                let prevWasVowel = false;
                for (const ch of word) {
                    const isVowel = 'aeiou'.includes(ch);
                    if (isVowel && !prevWasVowel) count++;
                    prevWasVowel = isVowel;
                }
                if (word.endsWith('e')) count--;
                if (word.endsWith('le') && word.length > 2 && !'aeiou'.includes(word[word.length - 3])) count++;
                if (count === 0) count = 1;
                total += Math.max(1, count);
            }
            return total;
        } catch (e) {
            return 0;
        }
    }

    aiReadability (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            if (sentences.length === 0 || words.length === 0) return 0;
            const syllableCount = this.aiSyllableCount({TEXT: text});
            const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllableCount / words.length);
            return Math.max(0, Math.min(100, score));
        } catch (e) {
            return 0;
        }
    }

    aiHaikuGenerate (args) {
        if (!args) return '';
        try {
            const topic = Cast.toString(args.TOPIC) || 'nature';
            const template = HAIKU_TEMPLATES[Math.floor(Math.random() * HAIKU_TEMPLATES.length)];
            return template.replace(/\[TOPIC\]/g, topic.toLowerCase());
        } catch (e) {
            return '';
        }
    }

    aiAcronym (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const words = text.split(/\s+/).filter(w => w.length > 0);
            return words.map(w => w[0].toUpperCase()).join('');
        } catch (e) {
            return '';
        }
    }

    aiAnagram (args) {
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

    aiPalindromeCheck (args) {
        if (!args) return false;
        try {
            const text = Cast.toString(args.TEXT);
            const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return cleaned === cleaned.split('').reverse().join('');
        } catch (e) {
            return false;
        }
    }

    aiCountLetters (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const matches = text.match(/[a-zA-Z]/g);
            return matches ? matches.length : 0;
        } catch (e) {
            return 0;
        }
    }

    aiCountDigits (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const matches = text.match(/[0-9]/g);
            return matches ? matches.length : 0;
        } catch (e) {
            return 0;
        }
    }

    aiCountSpaces (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const matches = text.match(/ /g);
            return matches ? matches.length : 0;
        } catch (e) {
            return 0;
        }
    }

    aiCountPunctuation (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT);
            const matches = text.match(/[.,!?;:'"\-()]/g);
            return matches ? matches.length : 0;
        } catch (e) {
            return 0;
        }
    }

    aiAverageWordLength (args) {
        if (!args) return 0;
        try {
            const text = Cast.toString(args.TEXT).trim();
            if (!text) return 0;
            const words = text.split(/\s+/).filter(w => w.length > 0);
            if (words.length === 0) return 0;
            const totalChars = words.reduce((sum, w) => sum + w.length, 0);
            return totalChars / words.length;
        } catch (e) {
            return 0;
        }
    }

    aiLongestWord (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).trim();
            if (!text) return '';
            const words = text.split(/\s+/).filter(w => w.length > 0);
            if (words.length === 0) return '';
            let longest = words[0];
            for (const w of words) {
                if (w.length > longest.length) longest = w;
            }
            return longest;
        } catch (e) {
            return '';
        }
    }

    aiShortestWord (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).trim();
            if (!text) return '';
            const words = text.split(/\s+/).filter(w => w.length > 0);
            if (words.length === 0) return '';
            let shortest = words[0];
            for (const w of words) {
                if (w.length < shortest.length) shortest = w;
            }
            return shortest;
        } catch (e) {
            return '';
        }
    }

    aiMostCommonWord (args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 0);
            if (words.length === 0) return '';
            const freq = {};
            let maxCount = 0;
            let mostCommon = words[0];
            for (const w of words) {
                freq[w] = (freq[w] || 0) + 1;
                if (freq[w] > maxCount) {
                    maxCount = freq[w];
                    mostCommon = w;
                }
            }
            return mostCommon;
        } catch (e) {
            return '';
        }
    }

    aiKMeans (args) {
        if (!args) return '{"clusters":[],"centroids":[]}';
        try {
            const data = JSON.parse(Cast.toString(args.DATA));
            const k = Math.max(1, Math.floor(Cast.toNumber(args.K)));
            if (!Array.isArray(data) || data.length === 0) return '{"clusters":[],"centroids":[]}';
            const nums = data.map(n => Cast.toNumber(n));
            const min = Math.min(...nums);
            const max = Math.max(...nums);
            let centroids = [];
            for (let i = 0; i < k; i++) {
                centroids.push(min + (max - min) * (i + 0.5) / k);
            }
            const clusters = new Array(k);
            for (let iter = 0; iter < 10; iter++) {
                for (let i = 0; i < k; i++) clusters[i] = [];
                for (const val of nums) {
                    let minDist = Infinity, best = 0;
                    for (let j = 0; j < k; j++) {
                        const dist = Math.abs(val - centroids[j]);
                        if (dist < minDist) { minDist = dist; best = j; }
                    }
                    clusters[best].push(val);
                }
                for (let j = 0; j < k; j++) {
                    if (clusters[j].length > 0) {
                        centroids[j] = clusters[j].reduce((a, b) => a + b, 0) / clusters[j].length;
                    }
                }
            }
            return JSON.stringify({clusters, centroids});
        } catch (e) {
            return '{"clusters":[],"centroids":[]}';
        }
    }

    aiKNN (args) {
        if (!args) return '';
        try {
            const data = JSON.parse(Cast.toString(args.DATA));
            const labels = JSON.parse(Cast.toString(args.LABELS));
            const query = JSON.parse(Cast.toString(args.QUERY));
            const k = Math.max(1, Math.floor(Cast.toNumber(args.K)));
            if (!Array.isArray(data) || !Array.isArray(labels) || !Array.isArray(query)) return '';
            const distances = data.map((point, i) => {
                if (!Array.isArray(point)) return {dist: Infinity, label: String(labels[i])};
                let sum = 0;
                for (let j = 0; j < Math.min(point.length, query.length); j++) {
                    sum += (Cast.toNumber(point[j]) - Cast.toNumber(query[j])) ** 2;
                }
                return {dist: Math.sqrt(sum), label: String(labels[i])};
            });
            distances.sort((a, b) => a.dist - b.dist);
            const votes = {};
            for (let i = 0; i < Math.min(k, distances.length); i++) {
                votes[distances[i].label] = (votes[distances[i].label] || 0) + 1;
            }
            let maxVotes = 0, bestLabel = '';
            for (const [label, count] of Object.entries(votes)) {
                if (count > maxVotes) { maxVotes = count; bestLabel = label; }
            }
            return bestLabel;
        } catch (e) {
            return '';
        }
    }

    aiNaiveBayes (args) {
        if (!args) return '';
        try {
            const data = JSON.parse(Cast.toString(args.DATA));
            const labels = JSON.parse(Cast.toString(args.LABELS));
            const query = JSON.parse(Cast.toString(args.QUERY));
            if (!Array.isArray(data) || !Array.isArray(labels) || !Array.isArray(query)) return '';
            const labelCounts = {};
            const featureCounts = {};
            for (let i = 0; i < data.length; i++) {
                const label = String(labels[i]);
                labelCounts[label] = (labelCounts[label] || 0) + 1;
                if (!featureCounts[label]) featureCounts[label] = {};
                const features = data[i];
                if (Array.isArray(features)) {
                    for (let j = 0; j < features.length; j++) {
                        const fv = String(features[j]);
                        if (!featureCounts[label][j]) featureCounts[label][j] = {};
                        featureCounts[label][j][fv] = (featureCounts[label][j][fv] || 0) + 1;
                    }
                }
            }
            const total = data.length;
            let bestLabel = '', bestProb = -1;
            for (const [label, count] of Object.entries(labelCounts)) {
                let prob = count / total;
                for (let j = 0; j < query.length; j++) {
                    const qv = String(query[j]);
                    const fc = featureCounts[label] && featureCounts[label][j] || {};
                    const featureTotal = Object.values(fc).reduce((s, v) => s + v, 0);
                    const featureProb = ((fc[qv] || 0) + 1) / (featureTotal + Object.keys(fc).length);
                    prob *= featureProb;
                }
                if (prob > bestProb) { bestProb = prob; bestLabel = label; }
            }
            return bestLabel;
        } catch (e) {
            return '';
        }
    }

    aiEuclideanDistance (args) {
        if (!args) return 0;
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (!Array.isArray(a) || !Array.isArray(b)) return 0;
            let sum = 0;
            for (let i = 0; i < Math.min(a.length, b.length); i++) {
                sum += (Cast.toNumber(a[i]) - Cast.toNumber(b[i])) ** 2;
            }
            return Math.sqrt(sum);
        } catch (e) {
            return 0;
        }
    }

    aiManhattanDistance (args) {
        if (!args) return 0;
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (!Array.isArray(a) || !Array.isArray(b)) return 0;
            let sum = 0;
            for (let i = 0; i < Math.min(a.length, b.length); i++) {
                sum += Math.abs(Cast.toNumber(a[i]) - Cast.toNumber(b[i]));
            }
            return sum;
        } catch (e) {
            return 0;
        }
    }

    aiCosineSimilarity (args) {
        if (!args) return 0;
        try {
            const a = JSON.parse(Cast.toString(args.A));
            const b = JSON.parse(Cast.toString(args.B));
            if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0) return 0;
            let dot = 0, magA = 0, magB = 0;
            for (let i = 0; i < Math.min(a.length, b.length); i++) {
                const ai = Cast.toNumber(a[i]);
                const bi = Cast.toNumber(b[i]);
                dot += ai * bi;
                magA += ai * ai;
                magB += bi * bi;
            }
            magA = Math.sqrt(magA);
            magB = Math.sqrt(magB);
            if (magA === 0 || magB === 0) return 0;
            return dot / (magA * magB);
        } catch (e) {
            return 0;
        }
    }

    aiTFIDF (args) {
        if (!args) return '[]';
        try {
            const docs = JSON.parse(Cast.toString(args.DOCUMENTS));
            if (!Array.isArray(docs)) return '[]';
            const tokenized = docs.map(d => Cast.toString(d).toLowerCase().split(/\s+/).filter(w => w.length > 0));
            const totalDocs = tokenized.length;
            const df = {};
            for (const tokens of tokenized) {
                const seen = {};
                for (const token of tokens) seen[token] = true;
                for (const token of Object.keys(seen)) df[token] = (df[token] || 0) + 1;
            }
            const result = tokenized.map(tokens => {
                const tf = {};
                for (const token of tokens) tf[token] = (tf[token] || 0) + 1;
                const maxTf = Math.max(...Object.values(tf), 1);
                const weights = {};
                for (const token of tokens) {
                    const tfn = (tf[token] || 0) / maxTf;
                    const idf = Math.log((totalDocs + 1) / ((df[token] || 0) + 1)) + 1;
                    weights[token] = tfn * idf;
                }
                return weights;
            });
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    aiTokenize (args) {
        if (!args) return '[]';
        try {
            const text = Cast.toString(args.TEXT);
            const tokens = text.split(/\s+/).filter(w => w.length > 0);
            return JSON.stringify(tokens);
        } catch (e) {
            return '[]';
        }
    }

    aiRemoveStopwords (args) {
        if (!args) return '[]';
        try {
            const tokens = JSON.parse(Cast.toString(args.TOKENS));
            if (!Array.isArray(tokens)) return '[]';
            const filtered = tokens.filter(t => !COMMON_WORDS.has(String(t).toLowerCase()));
            return JSON.stringify(filtered);
        } catch (e) {
            return '[]';
        }
    }

    aiStem (args) {
        if (!args) return '';
        try {
            let word = Cast.toString(args.WORD).toLowerCase();
            if (word.length < 3) return word;
            if (word.endsWith('ness')) word = word.slice(0, -4);
            if (word.endsWith('ment')) word = word.slice(0, -4);
            if (word.endsWith('tion')) word = word.slice(0, -4);
            if (word.endsWith('ly')) word = word.slice(0, -2);
            if (word.endsWith('ing')) word = word.slice(0, -3);
            if (word.endsWith('ed')) word = word.slice(0, -2);
            if (word.endsWith('ied')) word = word.slice(0, -3) + 'y';
            if (word.endsWith('ies')) word = word.slice(0, -3) + 'y';
            if (word.endsWith('es')) word = word.slice(0, -2);
            if (word.endsWith('er')) word = word.slice(0, -2);
            if (word.endsWith('est')) word = word.slice(0, -3);
            return word;
        } catch (e) {
            return '';
        }
    }

    aiNGramModel (args) {
        if (!args) return '{"ngrams":{},"count":0}';
        try {
            const text = Cast.toString(args.TEXT).toLowerCase();
            const n = Math.max(1, Math.floor(Cast.toNumber(args.N)));
            const words = text.split(/\s+/).filter(w => w.length > 0);
            const ngrams = {};
            for (let i = 0; i <= words.length - n; i++) {
                const gram = words.slice(i, i + n).join(' ');
                ngrams[gram] = (ngrams[gram] || 0) + 1;
            }
            return JSON.stringify({ngrams, count: Object.keys(ngrams).length});
        } catch (e) {
            return '{"ngrams":{},"count":0}';
        }
    }

    aiMarkovChain (args) {
        if (!args) return '{"chain":{},"order":1}';
        try {
            const data = Cast.toString(args.DATA);
            const words = data.split(/\s+/).filter(w => w.length > 0);
            const chain = {};
            for (let i = 0; i < words.length - 1; i++) {
                const key = words[i];
                const next = words[i + 1];
                if (!chain[key]) chain[key] = [];
                chain[key].push(next);
            }
            return JSON.stringify({chain, order: 1});
        } catch (e) {
            return '{"chain":{},"order":1}';
        }
    }

    aiMarkovGenerate (args) {
        if (!args) return '';
        try {
            const chain = JSON.parse(Cast.toString(args.CHAIN));
            const length = Math.max(1, Math.floor(Cast.toNumber(args.LENGTH)));
            if (!chain || typeof chain !== 'object' || !chain.chain) return '';
            const keys = Object.keys(chain.chain);
            if (keys.length === 0) return '';
            let current = keys[Math.floor(Math.random() * keys.length)];
            const result = [current];
            for (let i = 1; i < length; i++) {
                const nextWords = chain.chain[current];
                if (!nextWords || nextWords.length === 0) break;
                const next = nextWords[Math.floor(Math.random() * nextWords.length)];
                result.push(next);
                current = next;
            }
            return result.join(' ');
        } catch (e) {
            return '';
        }
    }

    aiMarkovAdd (args) {
        if (!args) return '{"chain":{},"order":1}';
        try {
            const chain = JSON.parse(Cast.toString(args.CHAIN));
            const text = Cast.toString(args.TEXT);
            if (!chain || typeof chain !== 'object') return '{"chain":{},"order":1}';
            if (!chain.chain) chain.chain = {};
            chain.order = chain.order || 1;
            const words = text.split(/\s+/).filter(w => w.length > 0);
            for (let i = 0; i < words.length - 1; i++) {
                const key = words[i];
                const next = words[i + 1];
                if (!chain.chain[key]) chain.chain[key] = [];
                chain.chain[key].push(next);
            }
            return JSON.stringify(chain);
        } catch (e) {
            return '{"chain":{},"order":1}';
        }
    }

    aiPerceptron (args) {
        if (!args) return 0;
        try {
            const inputs = JSON.parse(Cast.toString(args.INPUTS));
            const weights = JSON.parse(Cast.toString(args.WEIGHTS));
            if (!Array.isArray(inputs) || !Array.isArray(weights)) return 0;
            let sum = 0;
            for (let i = 0; i < Math.min(inputs.length, weights.length); i++) {
                sum += Cast.toNumber(inputs[i]) * Cast.toNumber(weights[i]);
            }
            return sum >= 0 ? 1 : 0;
        } catch (e) {
            return 0;
        }
    }
}

module.exports = ScratchProAIBlocks;
