const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

function md5(input) {
    const s = Cast.toString(input);
    function rotateLeft(x, n) {
        return (x << n) | (x >>> (32 - n));
    }
    function toHex(arr) {
        let hex = '';
        for (let i = 0; i < arr.length; i++) {
            const b = arr[i];
            hex += ((b >>> 4) & 0xf).toString(16) + (b & 0xf).toString(16);
        }
        return hex;
    }
    const padding = [128];
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
        bytes.push(s.charCodeAt(i) & 0xff);
    }
    const bitLen = s.length * 8;
    const padded = bytes.concat(padding);
    while ((padded.length + 8) % 64 !== 0) padded.push(0);
    for (let i = 0; i < 8; i++) padded.push((bitLen >>> (i * 8)) & 0xff);

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    const K = [0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391];

    const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

    for (let chunkStart = 0; chunkStart < padded.length; chunkStart += 64) {
        const M = [];
        for (let i = 0; i < 16; i++) {
            const off = chunkStart + i * 4;
            M[i] = padded[off] | (padded[off + 1] << 8) | (padded[off + 2] << 16) | (padded[off + 3] << 24);
        }
        let A = a0, B = b0, C = c0, D = d0;
        for (let i = 0; i < 64; i++) {
            let F, g;
            if (i < 16) {
                F = (B & C) | (~B & D);
                g = i;
            } else if (i < 32) {
                F = (D & B) | (~D & C);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                F = B ^ C ^ D;
                g = (3 * i + 5) % 16;
            } else {
                F = C ^ (B | ~D);
                g = (7 * i) % 16;
            }
            const temp = D;
            D = C;
            C = B;
            B = B + rotateLeft((A + F + K[i] + M[g]), S[i]);
            A = temp;
        }
        a0 = (a0 + A) >>> 0;
        b0 = (b0 + B) >>> 0;
        c0 = (c0 + C) >>> 0;
        d0 = (d0 + D) >>> 0;
    }
    return toHex([a0, b0, c0, d0].map(n => [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]).flat());
}

function sha1(input) {
    const s = Cast.toString(input);
    function rotateLeft(n, bits) {
        return (n << bits) | (n >>> (32 - bits));
    }
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
        bytes.push(s.charCodeAt(i) & 0xff);
    }
    const bitLen = s.length * 8;
    bytes.push(0x80);
    while ((bytes.length + 8) % 64 !== 0) bytes.push(0);
    for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (56 - i * 8)) & 0xff);

    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;
    let h4 = 0xc3d2e1f0;

    for (let chunkStart = 0; chunkStart < bytes.length; chunkStart += 64) {
        const w = [];
        for (let i = 0; i < 16; i++) {
            const off = chunkStart + i * 4;
            w[i] = (bytes[off] << 24) | (bytes[off + 1] << 16) | (bytes[off + 2] << 8) | bytes[off + 3];
        }
        for (let i = 16; i < 80; i++) {
            w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
        }
        let a = h0, b = h1, c = h2, d = h3, e = h4;
        for (let i = 0; i < 80; i++) {
            let f, k;
            if (i < 20) {
                f = (b & c) | (~b & d);
                k = 0x5a827999;
            } else if (i < 40) {
                f = b ^ c ^ d;
                k = 0x6ed9eba1;
            } else if (i < 60) {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8f1bbcdc;
            } else {
                f = b ^ c ^ d;
                k = 0xca62c1d6;
            }
            const temp = (rotateLeft(a, 5) + f + e + k + w[i]) >>> 0;
            e = d;
            d = c;
            c = rotateLeft(b, 30);
            b = a;
            a = temp;
        }
        h0 = (h0 + a) >>> 0;
        h1 = (h1 + b) >>> 0;
        h2 = (h2 + c) >>> 0;
        h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0;
    }
    const toHex = (n) => {
        const hex = n.toString(16);
        return '00000000'.substr(hex.length) + hex;
    };
    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4);
}

async function sha256(input) {
    const s = Cast.toString(input);
    try {
        if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
            const enc = new TextEncoder();
            const data = enc.encode(s);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (e) {
        log.warn('[Crypto] SubtleCrypto failed, using fallback');
    }
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
        bytes.push(s.charCodeAt(i) & 0xff);
    }
    const bitLen = s.length * 8;
    bytes.push(0x80);
    while ((bytes.length + 8) % 64 !== 0) bytes.push(0);
    for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (56 - i * 8)) & 0xff);
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const H = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    function rr(n, bits) { return (n >>> bits) | (n << (32 - bits)); }
    for (let chunkStart = 0; chunkStart < bytes.length; chunkStart += 64) {
        const w = [];
        for (let i = 0; i < 16; i++) {
            const off = chunkStart + i * 4;
            w[i] = (bytes[off] << 24) | (bytes[off + 1] << 16) | (bytes[off + 2] << 8) | bytes[off + 3];
        }
        for (let i = 16; i < 64; i++) {
            const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
            const s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3];
        let e = H[4], f = H[5], g = H[6], h = H[7];
        for (let i = 0; i < 64; i++) {
            const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
            const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) >>> 0;
            h = g; g = f; f = e; e = (d + temp1) >>> 0;
            d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0;
        H[1] = (H[1] + b) >>> 0;
        H[2] = (H[2] + c) >>> 0;
        H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0;
        H[5] = (H[5] + f) >>> 0;
        H[6] = (H[6] + g) >>> 0;
        H[7] = (H[7] + h) >>> 0;
    }
    return H.map(n => ('00000000' + (n >>> 0).toString(16)).slice(-8)).join('');
}

class ScratchProCryptoBlocks {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        const CIPHER_MENU = {
            acceptReporters: true,
            items: [
                {text: 'encrypt', value: 'encrypt'},
                {text: 'decrypt', value: 'decrypt'}
            ]
        };
        const HASH_MENU = {
            acceptReporters: true,
            items: [
                {text: 'MD5', value: 'MD5'},
                {text: 'SHA1', value: 'SHA1'},
                {text: 'SHA256', value: 'SHA256'}
            ]
        };
        return {
            id: 'scratchproCrypto',
            name: 'Crypto',
            color1: '#00CC99',
            color2: '#00AA80',
            color3: '#008866',
            blocks: [
                {
                    opcode: 'cryptoHash',
                    blockType: BlockType.REPORTER,
                    text: '[ALGORITHM] hash of [DATA]',
                    arguments: {
                        ALGORITHM: {type: ArgumentType.STRING, menu: 'HASH', defaultValue: 'MD5'},
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Compute a cryptographic hash (MD5, SHA1, or SHA256) of the input data.', returns: { type: 'string', description: 'The hex-encoded hash string' } }
                },
                {
                    opcode: 'cryptoRandomBytes',
                    blockType: BlockType.REPORTER,
                    text: 'random [LENGTH] bytes',
                    arguments: {
                        LENGTH: {type: ArgumentType.NUMBER, defaultValue: 8}
                    },
                    doc: { description: 'Generate cryptographically secure random bytes and return them as a hex string.', returns: { type: 'string', description: 'A hex string of random bytes' } }
                },
                {
                    opcode: 'cryptoEncryptAES',
                    blockType: BlockType.REPORTER,
                    text: 'xor encrypt [DATA] with key [KEY]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'}
                    },
                    doc: { description: 'Encrypt data using XOR cipher with the given key, returning base64-encoded output.', returns: { type: 'string', description: 'Base64-encoded encrypted data' } }
                },
                {
                    opcode: 'cryptoDecryptAES',
                    blockType: BlockType.REPORTER,
                    text: 'xor decrypt [DATA] with key [KEY]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hidden'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'}
                    },
                    doc: { description: 'Decrypt data that was XOR-encrypted with the given key from base64-encoded input.', returns: { type: 'string', description: 'The decrypted plaintext' } }
                },
                '---',
                {
                    opcode: 'cryptoBase64Encode',
                    blockType: BlockType.REPORTER,
                    text: 'base64 encode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Encode a string to base64 format.', returns: { type: 'string', description: 'The base64-encoded string' } }
                },
                {
                    opcode: 'cryptoBase64Decode',
                    blockType: BlockType.REPORTER,
                    text: 'base64 decode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'aGVsbG8='}
                    },
                    doc: { description: 'Decode a base64-encoded string back to plaintext.', returns: { type: 'string', description: 'The decoded plaintext' } }
                },
                {
                    opcode: 'cryptoHexEncode',
                    blockType: BlockType.REPORTER,
                    text: 'hex encode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Convert a string to its hexadecimal representation.', returns: { type: 'string', description: 'The hex-encoded string' } }
                },
                {
                    opcode: 'cryptoHexDecode',
                    blockType: BlockType.REPORTER,
                    text: 'hex decode [HEX]',
                    arguments: {
                        HEX: {type: ArgumentType.STRING, defaultValue: '68656c6c6f'}
                    },
                    doc: { description: 'Convert a hexadecimal string back to plaintext.', returns: { type: 'string', description: 'The decoded plaintext' } }
                },
                '---',
                {
                    opcode: 'cryptoROT13',
                    blockType: BlockType.REPORTER,
                    text: 'rot13 [TEXT]',
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Apply the ROT13 substitution cipher to the input text, shifting each letter by 13 positions.', returns: { type: 'string', description: 'The ROT13-transformed text' } }
                },
                {
                    opcode: 'cryptoCaesar',
                    blockType: BlockType.REPORTER,
                    text: 'caesar cipher [TEXT] shift [SHIFT]',
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'hello'},
                        SHIFT: {type: ArgumentType.NUMBER, defaultValue: 3}
                    },
                    doc: { description: 'Apply a Caesar cipher shift to the input text, rotating letters by the given number of positions.', returns: { type: 'string', description: 'The shifted ciphertext' } }
                },
                {
                    opcode: 'cryptoVigenere',
                    blockType: BlockType.REPORTER,
                    text: '[MODE] vigenere [TEXT] with key [KEY]',
                    arguments: {
                        MODE: {type: ArgumentType.STRING, menu: 'CIPHER', defaultValue: 'encrypt'},
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'hello'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'}
                    },
                    doc: { description: 'Encrypt or decrypt text using the Vigenere cipher with the given keyword.', returns: { type: 'string', description: 'The resulting ciphertext or plaintext' } }
                },
                '---',
                {
                    opcode: 'cryptoCompress',
                    blockType: BlockType.REPORTER,
                    text: 'compress [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'aaabbc'}
                    },
                    doc: { description: 'Compress a string using run-length encoding (e.g. "aaabbc" becomes "a3b2c1").', returns: { type: 'string', description: 'The run-length encoded string' } }
                },
                {
                    opcode: 'cryptoDecompress',
                    blockType: BlockType.REPORTER,
                    text: 'decompress [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'a3b2c1'}
                    },
                    doc: { description: 'Decompress a run-length encoded string back to its original form.', returns: { type: 'string', description: 'The decompressed string' } }
                },
                {
                    opcode: 'cryptoChecksum',
                    blockType: BlockType.REPORTER,
                    text: 'checksum of [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Compute a simple XOR-based checksum of the input data, returned as a 2-character hex string.', returns: { type: 'string', description: 'The 2-character hex checksum' } }
                },
                '---',
                {
                    opcode: 'cryptoSteganize',
                    blockType: BlockType.REPORTER,
                    text: 'hide [TEXT] in [COVER]',
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'secret'},
                        COVER: {type: ArgumentType.STRING, defaultValue: 'normal text'}
                    },
                    doc: { description: 'Hide a secret text message inside a cover text using zero-width characters (steganography).', returns: { type: 'string', description: 'The cover text with the hidden message embedded' } }
                },
                {
                    opcode: 'cryptoUnsteganize',
                    blockType: BlockType.REPORTER,
                    text: 'reveal hidden text in [TEXT]',
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'n\u200bor\u200dm\u200bal\u200bt\u200bext'}
                    },
                    doc: { description: 'Extract hidden text from a cover text that was concealed using zero-width character steganography.', returns: { type: 'string', description: 'The revealed hidden message' } }
                },
                '---',
                {
                    opcode: 'cryptoAESEncrypt',
                    blockType: BlockType.REPORTER,
                    text: 'AES encrypt [DATA] with key [KEY]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'secret'}
                    },
                    doc: { description: 'Encrypt data using AES-CBC via Web Crypto API. The key is derived from the passphrase using SHA-256.', returns: { type: 'string', description: 'Base64-encoded ciphertext' } }
                },
                {
                    opcode: 'cryptoAESDecrypt',
                    blockType: BlockType.REPORTER,
                    text: 'AES decrypt [DATA] with key [KEY]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: ''},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'secret'}
                    },
                    doc: { description: 'Decrypt AES-CBC encrypted data using Web Crypto API.', returns: { type: 'string', description: 'Decrypted plaintext' } }
                },
                {
                    opcode: 'cryptoHMAC',
                    blockType: BlockType.REPORTER,
                    text: 'HMAC-SHA256 key [KEY] data [DATA]',
                    arguments: {
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'},
                        DATA: {type: ArgumentType.STRING, defaultValue: 'message'}
                    },
                    doc: { description: 'Compute an HMAC-SHA256 signature using the Web Crypto API.', returns: { type: 'string', description: 'Hex-encoded HMAC signature' } }
                },
                {
                    opcode: 'cryptoDigest',
                    blockType: BlockType.REPORTER,
                    text: '[ALGO] hash of [DATA]',
                    arguments: {
                        ALGO: {type: ArgumentType.STRING, menu: 'DIGEST', defaultValue: 'SHA-256'},
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Compute a cryptographic digest using the Web Crypto API (SHA-1, SHA-256, SHA-384, SHA-512).', returns: { type: 'string', description: 'Hex-encoded digest' } }
                },
                '---',
                {
                    opcode: 'cryptoBase32Encode',
                    blockType: BlockType.REPORTER,
                    text: 'base32 encode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Encode a string to RFC 4648 base32 without padding.', returns: { type: 'string', description: 'Base32 encoded string' } }
                },
                {
                    opcode: 'cryptoBase32Decode',
                    blockType: BlockType.REPORTER,
                    text: 'base32 decode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'NBSWY3DP'}
                    },
                    doc: { description: 'Decode an RFC 4648 base32 string back to plaintext.', returns: { type: 'string', description: 'Decoded plaintext' } }
                },
                {
                    opcode: 'cryptoBase58Encode',
                    blockType: BlockType.REPORTER,
                    text: 'base58 encode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Encode a string to Bitcoin-style base58 encoding.', returns: { type: 'string', description: 'Base58 encoded string' } }
                },
                {
                    opcode: 'cryptoBase58Decode',
                    blockType: BlockType.REPORTER,
                    text: 'base58 decode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'AxBX8'}
                    },
                    doc: { description: 'Decode a Bitcoin-style base58 string back to plaintext.', returns: { type: 'string', description: 'Decoded plaintext' } }
                },
                {
                    opcode: 'cryptoPercentEncode',
                    blockType: BlockType.REPORTER,
                    text: 'percent encode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello world'}
                    },
                    doc: { description: 'Encode a string using encodeURIComponent (URL percent encoding).', returns: { type: 'string', description: 'Percent-encoded string' } }
                },
                {
                    opcode: 'cryptoPercentDecode',
                    blockType: BlockType.REPORTER,
                    text: 'percent decode [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello%20world'}
                    },
                    doc: { description: 'Decode a percent-encoded string using decodeURIComponent.', returns: { type: 'string', description: 'Decoded string' } }
                },
                {
                    opcode: 'cryptoJWTEncode',
                    blockType: BlockType.REPORTER,
                    text: 'create JWT header [HEADER] payload [PAYLOAD] secret [SECRET]',
                    arguments: {
                        HEADER: {type: ArgumentType.STRING, defaultValue: '{"alg":"HS256","typ":"JWT"}'},
                        PAYLOAD: {type: ArgumentType.STRING, defaultValue: '{"sub":"123","name":"John"}'},
                        SECRET: {type: ArgumentType.STRING, defaultValue: 'secret'}
                    },
                    doc: { description: 'Create a simplified JWT with base64url-encoded header and payload signed with HMAC-SHA256.', returns: { type: 'string', description: 'The JWT token string' } }
                },
                {
                    opcode: 'cryptoJWTDecode',
                    blockType: BlockType.REPORTER,
                    text: 'decode JWT [TOKEN]',
                    arguments: {
                        TOKEN: {type: ArgumentType.STRING, defaultValue: ''}
                    },
                    doc: { description: 'Decode a JWT token without verification and return the header and payload as JSON.', returns: { type: 'string', description: 'JSON object {header, payload}' } }
                },
                '---',
                {
                    opcode: 'cryptoCRC32',
                    blockType: BlockType.REPORTER,
                    text: 'crc32 of [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Compute a CRC32 checksum using the standard lookup table algorithm.', returns: { type: 'string', description: 'Hex-encoded CRC32 value' } }
                },
                {
                    opcode: 'cryptoAdler32',
                    blockType: BlockType.REPORTER,
                    text: 'adler32 of [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'}
                    },
                    doc: { description: 'Compute an Adler-32 checksum.', returns: { type: 'string', description: 'Hex-encoded Adler-32 value' } }
                },
                {
                    opcode: 'cryptoXORCipher',
                    blockType: BlockType.REPORTER,
                    text: 'xor cipher [DATA] with key [KEY]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: 'hello'},
                        KEY: {type: ArgumentType.STRING, defaultValue: 'key'}
                    },
                    doc: { description: 'XOR each byte of data with the key byte at modulo position, returning hex result.', returns: { type: 'string', description: 'Hex-encoded XOR result' } }
                },
                {
                    opcode: 'cryptoShamirSplit',
                    blockType: BlockType.REPORTER,
                    text: 'shamir split secret [SECRET] into [SHARES] shares threshold [THRESHOLD]',
                    arguments: {
                        SECRET: {type: ArgumentType.STRING, defaultValue: 'secret'},
                        SHARES: {type: ArgumentType.NUMBER, defaultValue: 3},
                        THRESHOLD: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: { description: 'Split a secret into shares using simplified XOR-based secret sharing.', returns: { type: 'string', description: 'JSON array of shares' } }
                }
            ],
            menus: {
                HASH: {
                    acceptReporters: true,
                    items: [
                        {text: 'MD5', value: 'MD5'},
                        {text: 'SHA1', value: 'SHA1'},
                        {text: 'SHA256', value: 'SHA256'}
                    ]
                },
                CIPHER: {
                    acceptReporters: true,
                    items: [
                        {text: 'encrypt', value: 'encrypt'},
                        {text: 'decrypt', value: 'decrypt'}
                    ]
                },
                DIGEST: {
                    acceptReporters: true,
                    items: [
                        {text: 'SHA-1', value: 'SHA-1'},
                        {text: 'SHA-256', value: 'SHA-256'},
                        {text: 'SHA-384', value: 'SHA-384'},
                        {text: 'SHA-512', value: 'SHA-512'}
                    ]
                }
            }
        };
    }

    async cryptoHash(args) {
        if (!args) return '';
        try {
            const algorithm = Cast.toString(args.ALGORITHM);
            const data = Cast.toString(args.DATA);
            if (algorithm === 'MD5') return md5(data);
            if (algorithm === 'SHA1') return sha1(data);
            if (algorithm === 'SHA256') return await sha256(data);
            return '';
        } catch (e) {
            return '';
        }
    }

    cryptoRandomBytes(args) {
        if (!args) return '';
        try {
            const length = Math.max(1, Math.floor(Cast.toNumber(args.LENGTH)));
            const bytes = new Uint8Array(length);
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                crypto.getRandomValues(bytes);
            } else {
                for (let i = 0; i < length; i++) {
                    bytes[i] = Math.floor(Math.random() * 256);
                }
            }
            return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return '';
        }
    }

    cryptoEncryptAES(args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            const key = Cast.toString(args.KEY);
            if (!key) return data;
            let result = '';
            for (let i = 0; i < data.length; i++) {
                result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return btoa(result);
        } catch (e) {
            return '';
        }
    }

    cryptoDecryptAES(args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            const key = Cast.toString(args.KEY);
            if (!key) return data;
            const decoded = atob(data);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoBase64Encode(args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            return btoa(data);
        } catch (e) {
            return '';
        }
    }

    cryptoBase64Decode(args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            return atob(data);
        } catch (e) {
            return '';
        }
    }

    cryptoHexEncode(args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            let hex = '';
            for (let i = 0; i < data.length; i++) {
                hex += data.charCodeAt(i).toString(16).padStart(2, '0');
            }
            return hex;
        } catch (e) {
            return '';
        }
    }

    cryptoHexDecode(args) {
        if (!args) return '';
        try {
            const hex = Cast.toString(args.HEX).replace(/\s/g, '');
            let result = '';
            for (let i = 0; i < hex.length; i += 2) {
                result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoROT13(args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const c = text.charCodeAt(i);
                if (c >= 65 && c <= 90) {
                    result += String.fromCharCode(((c - 65 + 13) % 26) + 65);
                } else if (c >= 97 && c <= 122) {
                    result += String.fromCharCode(((c - 97 + 13) % 26) + 97);
                } else {
                    result += text[i];
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoCaesar(args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const shift = Cast.toNumber(args.SHIFT) % 26;
            if (shift === 0) return text;
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const c = text.charCodeAt(i);
                if (c >= 65 && c <= 90) {
                    result += String.fromCharCode(((c - 65 + shift + 26) % 26) + 65);
                } else if (c >= 97 && c <= 122) {
                    result += String.fromCharCode(((c - 97 + shift + 26) % 26) + 97);
                } else {
                    result += text[i];
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoVigenere(args) {
        if (!args) return '';
        try {
            const mode = Cast.toString(args.MODE);
            const text = Cast.toString(args.TEXT);
            const key = Cast.toString(args.KEY);
            if (!key) return text;
            let result = '';
            let keyIndex = 0;
            for (let i = 0; i < text.length; i++) {
                const c = text.charCodeAt(i);
                const shiftBase = key.toLowerCase().charCodeAt(keyIndex % key.length) - 97;
                const effectiveShift = mode === 'decrypt' ? -shiftBase : shiftBase;
                if (c >= 65 && c <= 90) {
                    result += String.fromCharCode(((c - 65 + effectiveShift + 26 * 26) % 26) + 65);
                    keyIndex++;
                } else if (c >= 97 && c <= 122) {
                    result += String.fromCharCode(((c - 97 + effectiveShift + 26 * 26) % 26) + 97);
                    keyIndex++;
                } else {
                    result += text[i];
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoCompress(args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            if (!data) return '';
            let result = '';
            let count = 1;
            for (let i = 1; i <= data.length; i++) {
                if (i < data.length && data[i] === data[i - 1]) {
                    count++;
                } else {
                    result += data[i - 1] + count;
                    count = 1;
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoDecompress(args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            if (!data) return '';
            let result = '';
            for (let i = 0; i < data.length; i += 2) {
                const ch = data[i];
                const count = parseInt(data[i + 1], 10);
                if (isNaN(count)) {
                    result += ch;
                } else {
                    result += ch.repeat(count);
                }
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoChecksum(args) {
        if (!args) return '00';
        try {
            const data = Cast.toString(args.DATA);
            let xor = 0;
            for (let i = 0; i < data.length; i++) {
                xor ^= data.charCodeAt(i);
            }
            return xor.toString(16).padStart(2, '0');
        } catch (e) {
            return '00';
        }
    }

    cryptoSteganize(args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const cover = Cast.toString(args.COVER);
            const ZWJ = '\u200d';
            const ZWNJ = '\u200c';
            const ZWSP = '\u200b';
            const encoded = [];
            for (let i = 0; i < text.length; i++) {
                const code = text.charCodeAt(i);
                for (let b = 0; b < 16; b++) {
                    encoded.push((code >> b) & 1 ? ZWJ : ZWNJ);
                }
            }
            const hidden = encoded.join('');
            const pos = Math.min(ZWSP + hidden + ZWSP, Math.floor(cover.length / 2));
            return cover.slice(0, pos) + ZWSP + hidden + ZWSP + cover.slice(pos);
        } catch (e) {
            return '';
        }
    }

    cryptoUnsteganize(args) {
        if (!args) return '';
        try {
            const text = Cast.toString(args.TEXT);
            const ZWJ = '\u200d';
            const ZWNJ = '\u200c';
            const ZWSP = '\u200b';
            const parts = text.split(ZWSP);
            let hiddenBits = '';
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].includes(ZWJ) || parts[i].includes(ZWNJ)) {
                    hiddenBits = parts[i];
                    break;
                }
            }
            if (!hiddenBits) return '';
            const bits = [];
            let charCode = 0;
            for (let i = 0; i < hiddenBits.length; i++) {
                if (hiddenBits[i] === ZWJ) {
                    charCode |= (1 << (i % 16));
                }
                if ((i + 1) % 16 === 0) {
                    bits.push(charCode);
                    charCode = 0;
                }
            }
            if (hiddenBits.length % 16 !== 0) {
                bits.push(charCode);
            }
            return String.fromCharCode(...bits);
        } catch (e) {
            return '';
        }
    }

    async _importKey (passphrase) {
        const enc = new TextEncoder();
        const keyData = await crypto.subtle.digest('SHA-256', enc.encode(passphrase));
        return await crypto.subtle.importKey('raw', keyData, {name: 'AES-CBC'}, false, ['encrypt', 'decrypt']);
    }

    async _hmacKey (keyStr) {
        const enc = new TextEncoder();
        return await crypto.subtle.importKey('raw', enc.encode(keyStr), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign', 'verify']);
    }

    async _arrayBufferToHex (buf) {
        const arr = Array.from(new Uint8Array(buf));
        return arr.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    _hexToBytes (hex) {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i, 2), 16));
        return new Uint8Array(bytes);
    }

    async cryptoAESEncrypt (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            const keyStr = Cast.toString(args.KEY);
            if (!data || !keyStr) return '';
            if (typeof crypto === 'undefined' || !crypto.subtle) return '';
            const key = await this._importKey(keyStr);
            const enc = new TextEncoder();
            const iv = crypto.getRandomValues(new Uint8Array(16));
            const encrypted = await crypto.subtle.encrypt({name: 'AES-CBC', iv}, key, enc.encode(data));
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encrypted), iv.length);
            return btoa(String.fromCharCode(...combined));
        } catch (e) {
            log.warn('[Crypto] AESEncrypt error: ' + e.message);
            return '';
        }
    }

    async cryptoAESDecrypt (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            const keyStr = Cast.toString(args.KEY);
            if (!data || !keyStr) return '';
            if (typeof crypto === 'undefined' || !crypto.subtle) return '';
            const key = await this._importKey(keyStr);
            const raw = Uint8Array.from(atob(data), c => c.charCodeAt(0));
            const iv = raw.slice(0, 16);
            const ciphertext = raw.slice(16);
            const decrypted = await crypto.subtle.decrypt({name: 'AES-CBC', iv}, key, ciphertext);
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            log.warn('[Crypto] AESDecrypt error: ' + e.message);
            return '';
        }
    }

    async cryptoHMAC (args) {
        if (!args) return '';
        try {
            const keyStr = Cast.toString(args.KEY);
            const data = Cast.toString(args.DATA);
            if (!keyStr || !data) return '';
            if (typeof crypto === 'undefined' || !crypto.subtle) return '';
            const key = await this._hmacKey(keyStr);
            const enc = new TextEncoder();
            const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
            return await this._arrayBufferToHex(sig);
        } catch (e) {
            log.warn('[Crypto] HMAC error: ' + e.message);
            return '';
        }
    }

    async cryptoDigest (args) {
        if (!args) return '';
        try {
            const algo = Cast.toString(args.ALGO);
            const data = Cast.toString(args.DATA);
            if (!algo || !data) return '';
            if (typeof crypto === 'undefined' || !crypto.subtle) return '';
            const enc = new TextEncoder();
            const hash = await crypto.subtle.digest(algo, enc.encode(data));
            return await this._arrayBufferToHex(hash);
        } catch (e) {
            log.warn('[Crypto] digest error: ' + e.message);
            return '';
        }
    }

    cryptoBase32Encode (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            if (!data) return '';
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            const bytes = [];
            for (let i = 0; i < data.length; i++) bytes.push(data.charCodeAt(i));
            let result = '';
            for (let i = 0; i < bytes.length; i += 5) {
                const b = [
                    bytes[i] || 0,
                    bytes[i + 1] || 0,
                    bytes[i + 2] || 0,
                    bytes[i + 3] || 0,
                    bytes[i + 4] || 0
                ];
                const remaining = Math.min(5, bytes.length - i);
                result += alphabet[b[0] >> 3];
                result += alphabet[((b[0] & 7) << 2) | (b[1] >> 6)];
                result += remaining >= 2 ? alphabet[((b[1] & 63) >> 1)] : '';
                result += remaining >= 2 ? alphabet[((b[1] & 1) << 4) | (b[2] >> 4)] : '';
                result += remaining >= 3 ? alphabet[((b[2] & 15) << 1) | (b[3] >> 7)] : '';
                result += remaining >= 4 ? alphabet[((b[3] & 127) >> 2)] : '';
                result += remaining >= 4 ? alphabet[((b[3] & 3) << 3) | (b[4] >> 5)] : '';
                result += remaining >= 5 ? alphabet[b[4] & 31] : '';
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoBase32Decode (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA).toUpperCase().replace(/=+$/, '');
            if (!data) return '';
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            const lookup = {};
            for (let i = 0; i < alphabet.length; i++) lookup[alphabet[i]] = i;
            const codes = [];
            for (let i = 0; i < data.length; i++) {
                const c = lookup[data[i]];
                if (c === undefined) continue;
                codes.push(c);
            }
            const bytes = [];
            for (let i = 0; i < codes.length; i += 8) {
                if (i + 8 > codes.length) break;
                const b = codes.slice(i, i + 8);
                bytes.push((b[0] << 3) | (b[1] >> 2));
                bytes.push(((b[1] & 3) << 6) | (b[2] << 1) | (b[3] >> 4));
                bytes.push(((b[3] & 15) << 4) | (b[4] >> 1));
                bytes.push(((b[4] & 1) << 7) | (b[5] << 2) | (b[6] >> 3));
                bytes.push(((b[6] & 7) << 5) | b[7]);
            }
            return String.fromCharCode(...bytes);
        } catch (e) {
            return '';
        }
    }

    cryptoBase58Encode (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            if (!data) return '';
            const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            const bytes = [];
            for (let i = 0; i < data.length; i++) bytes.push(data.charCodeAt(i));
            let num = BigInt(0);
            for (let i = 0; i < bytes.length; i++) num = (num << 8n) | BigInt(bytes[i]);
            if (num === 0n) return '';
            let result = '';
            while (num > 0n) {
                const rem = Number(num % 58n);
                result = alphabet[rem] + result;
                num = num / 58n;
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    cryptoBase58Decode (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA).trim();
            if (!data) return '';
            const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            const lookup = {};
            for (let i = 0; i < alphabet.length; i++) lookup[alphabet[i]] = BigInt(i);
            let num = BigInt(0);
            for (let i = 0; i < data.length; i++) {
                const c = lookup[data[i]];
                if (c === undefined) continue;
                num = num * 58n + c;
            }
            if (num === 0n) return '';
            const bytes = [];
            while (num > 0n) {
                bytes.unshift(Number(num & 0xFFn));
                num = num >> 8n;
            }
            return String.fromCharCode(...bytes);
        } catch (e) {
            return '';
        }
    }

    cryptoPercentEncode (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            if (typeof encodeURIComponent === 'undefined') return data;
            return encodeURIComponent(data);
        } catch (e) {
            return '';
        }
    }

    cryptoPercentDecode (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            if (typeof decodeURIComponent === 'undefined') return data;
            return decodeURIComponent(data);
        } catch (e) {
            return '';
        }
    }

    async cryptoJWTEncode (args) {
        if (!args) return '';
        try {
            const headerStr = Cast.toString(args.HEADER);
            const payloadStr = Cast.toString(args.PAYLOAD);
            const secret = Cast.toString(args.SECRET);
            if (!headerStr || !payloadStr || !secret) return '';
            const b64url = (s) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            const header = b64url(headerStr);
            const payload = b64url(payloadStr);
            const signingInput = header + '.' + payload;
            let signature = '';
            if (typeof crypto !== 'undefined' && crypto.subtle) {
                const enc = new TextEncoder();
                const key = await crypto.subtle.importKey('raw', enc.encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
                const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput));
                signature = b64url(String.fromCharCode(...new Uint8Array(sig)));
            }
            return signingInput + '.' + signature;
        } catch (e) {
            log.warn('[Crypto] JWTEncode error: ' + e.message);
            return '';
        }
    }

    cryptoJWTDecode (args) {
        if (!args) return '{}';
        try {
            const token = Cast.toString(args.TOKEN);
            if (!token) return '{}';
            const parts = token.split('.');
            if (parts.length < 2) return '{}';
            const decodeB64url = (s) => {
                s = s.replace(/-/g, '+').replace(/_/g, '/');
                while (s.length % 4) s += '=';
                return atob(s);
            };
            const header = JSON.parse(decodeB64url(parts[0]));
            const payload = JSON.parse(decodeB64url(parts[1]));
            return JSON.stringify({header, payload});
        } catch (e) {
            return '{}';
        }
    }

    cryptoCRC32 (args) {
        if (!args) return '00000000';
        try {
            const data = Cast.toString(args.DATA);
            if (!data) return '00000000';
            if (!this._crc32Table) {
                this._crc32Table = new Uint32Array(256);
                for (let i = 0; i < 256; i++) {
                    let c = i;
                    for (let j = 0; j < 8; j++) {
                        if (c & 1) c = 0xEDB88320 ^ (c >>> 1);
                        else c = c >>> 1;
                    }
                    this._crc32Table[i] = c;
                }
            }
            let crc = 0xFFFFFFFF;
            for (let i = 0; i < data.length; i++) {
                const byte = data.charCodeAt(i) & 0xFF;
                crc = this._crc32Table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
            }
            crc = (crc ^ 0xFFFFFFFF) >>> 0;
            return crc.toString(16).padStart(8, '0');
        } catch (e) {
            return '00000000';
        }
    }

    cryptoAdler32 (args) {
        if (!args) return '00000000';
        try {
            const data = Cast.toString(args.DATA);
            if (!data) return '00000000';
            let a = 1, b = 0;
            const MOD = 65521;
            for (let i = 0; i < data.length; i++) {
                const byte = data.charCodeAt(i) & 0xFF;
                a = (a + byte) % MOD;
                b = (b + a) % MOD;
            }
            return ((b << 16) | a).toString(16).padStart(8, '0');
        } catch (e) {
            return '00000000';
        }
    }

    cryptoXORCipher (args) {
        if (!args) return '';
        try {
            const data = Cast.toString(args.DATA);
            const key = Cast.toString(args.KEY);
            if (!data || !key) return '';
            const bytes = [];
            for (let i = 0; i < data.length; i++) {
                bytes.push(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return '';
        }
    }

    cryptoShamirSplit (args) {
        if (!args) return '[]';
        try {
            const secret = Cast.toString(args.SECRET);
            const shares = Math.max(2, Math.floor(Cast.toNumber(args.SHARES)));
            const threshold = Math.max(2, Math.min(shares, Math.floor(Cast.toNumber(args.THRESHOLD))));
            if (!secret) return '[]';
            const result = [];
            for (let i = 0; i < shares; i++) {
                let share = '';
                for (let j = 0; j < secret.length; j++) {
                    const randomByte = Math.floor(Math.random() * 256);
                    share += String.fromCharCode(secret.charCodeAt(j) ^ randomByte);
                }
                result.push({index: i, data: btoa(share)});
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }
}

module.exports = ScratchProCryptoBlocks;
