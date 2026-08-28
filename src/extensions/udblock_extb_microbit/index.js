const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';


/**
 * Scratch 3.0 blocks to interact with a MicroBit peripheral.
 */
class UDBlockMicroBit {
    constructor(runtime) {
        this.runtime = runtime;
    }
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: "udblockEXTBMicrobit",
            name: "Microbit拓展板",
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'pinWriteDigital',
                    text: "[PIN]写入电平[LEVEL]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN:{
                            type: ArgumentType.NUMBER,
                            menu: 'adc_pins'
                        },
                        LEVEL:{
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                buttons:{
                    acceptReporters: true,
                    items: [{ text: "A", value: "button_a" }, { text: "B", value: "button_b" }]
                },
                pins:{
                    acceptReporters: true,
                    items: [
                        { text: "1", value: "1" },   // Pad 1
                        { text: "2", value: "2" },   // Pad 2
                        { text: "3", value: "3" },  
                        { text: "4", value: "4" },
                        { text: "5", value: "5" },   // Button A
                        { text: "6", value: "6" },
                        { text: "7", value: "7" },
                        { text: "8", value: "8" },
                        { text: "9", value: "9" },
                        { text: "10", value: "10" },
                        { text: "11", value: "11" }, // Button B
                        { text: "12", value: "12" },
                        { text: "13", value: "13" }, // SPI MOSI
                        { text: "14", value: "14" }, // SPI MISO
                        { text: "15", value: "15" }, // SPI SCK
                        { text: "16", value: "16" },

                    ]
                },
                adc_pins:{
                    acceptReporters: true,
                    items: [
                        { text: "0", value: "pin0" },   // Pad 0
                        { text: "1", value: "pin1" },   // Pad 1
                        { text: "2", value: "pin2" },   // Pad 2
                        { text: "3", value: "pin3" },  
                        { text: "4", value: "pin4" },
                        { text: "10", value: "pin10" },

                    ]
                },
                music_preset:{
                    acceptReporters: true,
                    items: [
                        { text: "DADADADUM", value: "DADADADUM" },
                        { text: "ENTERTAINER", value: "ENTERTAINER" },
                        { text: "PRELUDE", value: "PRELUDE" },
                        { text: "ODE", value: "ODE" },
                        { text: "NYAN", value: "NYAN" },
                        { text: "RINGTONE", value: "RINGTONE" },
                        { text: "FUNK", value: "FUNK" },
                        { text: "BLUES", value: "BLUES" },
                        { text: "BIRTHDAY", value: "BIRTHDAY" },
                        { text: "WEDDING", value: "WEDDING" },
                        { text: "FUNERAL", value: "FUNERAL" },
                        { text: "PUNCHLINE", value: "PUNCHLINE" },
                        { text: "PYTHON", value: "PYTHON" },
                        { text: "BADDY", value: "BADDY" },
                        { text: "CHASE", value: "CHASE" },
                        { text: "BA_DING", value: "BA_DING" },
                        { text: "WAWAWAWAA", value: "WAWAWAWAA" },
                        { text: "JUMP_UP", value: "JUMP_UP" },
                        { text: "JUMP_DOWN", value: "JUMP_DOWN" },
                        { text: "POWER_UP", value: "POWER_UP" },
                        { text: "POWER_DOWN", value: "POWER_DOWN" }
                    ]
                },
                builtin_images:{
                    acceptReporters: true,
                    items: [                   //09090:99999:99999:09990:00900
                        { text: "红心",  value: "0101010101100010101000100" },
                        { text: "小红心", value: "0000001010011100010000000"},
                        { text: "开心", value: "0000001010000001000101110"},
                        { text: "笑脸", value: "0000000000000001000101110"},
                        { text: "伤心", value: "0000001010000000111010001"},
                        { text: "疑惑", value: "0000001010000000101010101"},
                        { text: "生气", value: "1000101010000001111110101"},
                        { text: "睡着", value: "0000011011000000111000000"},
                        { text: "惊讶", value: "0101000000001000101000100"},
                        { text: "笨笨", value: "1000100000111110010100111"},
                        { text: "极好", value: "1111111011000000101001110"},
                        { text: "嗯", value: "0101000000000100010001000"},
                        { text: "是的", value: "0000000001000101010001000"},
                        { text: "不是", value: "1000101010001000101010001"},
                        { text: "时钟12", value: "0010000100001000000000000"},
                        { text: "时钟11", value: "0100001000001000000000000"},
                        { text: "时钟10", value: "0000011000001000000000000"},
                        { text: "时钟9", value: "0000000000111000000000000"},
                        { text: "时钟8", value: "0000000000001001100000000"},
                        { text: "时钟7", value: "0000000000001000100001000"},
                        { text: "时钟6", value: "0000000000001000010000100"},
                        { text: "时钟5", value: "0000000000001000001000010"},
                        { text: "时钟4", value: "0000000000001000001100000"},
                        { text: "时钟3", value: "0000000000001110000000000"},
                        { text: "时钟2", value: "0000000011001000000000000"},
                        { text: "时钟1", value: "0001000010001000000000000"},
                        { text: "三角形", value: "0000000100010101111100000"},
                        { text: "三角形—左", value: "1000011000101001001011111"},
                        { text: "象棋桌", value: "0101010101010101010101010"},
                        { text: "钻石", value: "0010001010100010101000100"},
                        { text: "小钻石", value: "0000000100010100010000000"},
                        { text: "正方形", value: "1111110001100011000111111"},
                        { text: "小正方形", value: "0000001110010100111000000"},
                        { text: "兔子", value: "1010010100111101101011110"},
                        { text: "奶牛", value: "1000110001111110111000100"},
                    ]
                },
                display_brightness:{
                    acceptReporters: true,
                    items: [
                        { text: "0", value: "0"},
                        { text: "1", value: "1"},
                        { text: "2", value: "2"},
                        { text: "3", value: "3"},
                        { text: "4", value: "4"},
                        { text: "5", value: "5"},
                        { text: "6", value: "6"},
                        { text: "7", value: "7"},
                        { text: "8", value: "8"},
                        { text: "9", value: "9"},
                    ]

                },
                gesture:{
                    acceptReporters: true,
                    items: [
                        { text: "向上", value: "up"},
                        { text: "向下", value: "down"},
                        { text: "向左", value: "left"},
                        { text: "向右", value: "right"},
                        { text: "面朝上", value: "face up"},
                        { text: "面朝下", value: "face down"},
                        { text: "自由落体", value: "freefall"},
                        { text: "3G加速度", value: "3g"},
                        { text: "6G加速度", value: "6g"},
                        { text: "8G加速度", value: "8g"},
                        { text: "甩动", value: "shake"},
                    ]
                }
            }
        };
    }

    microbitStart(){return false}
}

module.exports = UDBlockMicroBit;
