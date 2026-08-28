const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockUDPiV2 {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "udblockUDPiV2",
            name: "UDPi 开发板 V2",
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "espstart",
                    blockType: BlockType.HAT,
                    text: "UDPi主板初始化完成"
                },
                {
                    opcode: "print",
                    blockType: BlockType.COMMAND,
                    text: "打印[TEXT]",
                    arguments: {
                        TEXT:{
                            type: ArgumentType.STRING,
                            defaultValue: "欢迎"
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ 事件',
                },
                {
                    opcode: 'whenButtonPressed',
                    blockType: BlockType.EVHAT,
                    text: '当主板按钮[BTN]按下',
                    arguments: {
                        BTN:{
                            type: ArgumentType.STRING,
                            defaultValue: "0",
                            menu: 'buttons'
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ 系统资源',
                },
                {
                    opcode: 'getStartTime',
                    blockType: BlockType.REPORTER,
                    text: '获取主板启动时间(毫秒)'
                },
                {
                    opcode: 'delay_ms',
                    blockType: BlockType.COMMAND,
                    text: '延迟[TIME]毫秒',
                    arguments: {
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
                        }
                    }
                },
                {
                    opcode: 'delay_us',
                    blockType: BlockType.COMMAND,
                    text: '延迟[TIME]微秒',
                    arguments: {
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    }
                },
                {
                    opcode: 'delay_s',
                    blockType: BlockType.COMMAND,
                    text: '延迟[TIME]秒',
                    arguments: {
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ 执行器',
                },
                {
                    opcode: 'openOnBoardRGB',
                    blockType: BlockType.COMMAND,
                    text: '控制启用主板RGB'
                },
                {
                    opcode: 'closeOnBoardRGB',
                    blockType: BlockType.COMMAND,
                    text: '控制禁用主板RGB'
                },
                // {
                //     opcode: 'setLuminanceOnBoardRGB',
                //     blockType: BlockType.COMMAND,
                //     text: '控制主板RGB设置亮度为 [NUMBER] %',
                //     arguments: {
                //         NUMBER: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: "50",
                //         }
                //     }
                // },
                {
                    opcode: 'setRGBDraw',
                    blockType: BlockType.COMMAND,
                    text: '控制主板RGB显示颜色[COLOR]',
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR,
                        }
                    }
                },
                {
                    opcode: 'setRGBLineDraw',
                    blockType: BlockType.COMMAND,
                    text: '控制主板RGB[LINE]行显示颜色[COLOR]',
                    arguments: {
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                        }
                    }
                },
                {
                    opcode: 'setRGBLineSingleDraw',
                    blockType: BlockType.COMMAND,
                    text: '控制主板RGB[LINE]行[INDEX]号灯珠显示颜色[COLOR]',
                    arguments: {
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                        }
                    }
                },
                {
                    opcode: 'setRGBLineSingleOnlyDraw',
                    blockType: BlockType.COMMAND,
                    text: '控制主板RGB[LINE]行只有[INDEX]号灯珠显示颜色[COLOR]',
                    arguments: {
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                        }
                    }
                },
                // {
                //     type: "custom_seperator",
                //     text: '★ ▶ 蜂鸣器',
                // },
                // {
                //     opcode: 'setBuzzerPlay',
                //     blockType: BlockType.COMMAND,
                //     text: '控制主板蜂鸣器播放[SOUND] 音调 [PITCH]',
                //     arguments: {
                //         SOUND: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "DO",
                //             menu: "buzzerSounds"
                //         },
                //         PITCH: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "LOW",
                //             menu: "buzzerPitches"
                //         }
                //     }
                // },
                // {
                //     opcode: 'setBuzzerPlayMidi',
                //     blockType: BlockType.COMMAND,
                //     text: '控制主板蜂鸣器播放MIDI [SOUND]',
                //     arguments: {
                //         SOUND: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "demo"
                //         }
                //     }
                // },
                // {
                //     opcode: 'setBuzzerStop',
                //     blockType: BlockType.COMMAND,
                //     text: '控制主板蜂鸣器停止播放',
                // },
                {
                    type: "custom_seperator",
                    text: '★ ▶ 网络',
                },
                {
                    opcode: 'getWiFiStatus',
                    blockType: BlockType.BOOLEAN,
                    text: 'Wi-Fi连接成功？',
                },
                {
                    opcode: 'setConnectToWiFi',
                    blockType: BlockType.COMMAND,
                    text: '控制主板连接到Wi-Fi [SSID] [PSK]',
                    arguments: {
                        SSID: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                        PSK: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        }
                    }
                },
                {
                    opcode: 'closeConnectToWiFi',
                    blockType: BlockType.COMMAND,
                    text: '控制主板断开Wi-Fi',
                },
                {
                    opcode: 'openWiFiAP',
                    blockType: BlockType.COMMAND,
                    text: '控制主板打开热点[SSID] [PSK]',
                    arguments: {
                        SSID: {
                            type: ArgumentType.STRING,
                            defaultValue: "udpi-" + (parseInt(Math.random()*10000000+ '')) 
                        },
                        PSK: {
                            type: ArgumentType.STRING,
                            defaultValue: "udpi12345678"
                        }
                    }
                },
                {
                    opcode: 'udpClientSent',
                    blockType: BlockType.COMMAND,
                    text: '控制UDP客户端发送消息[MSG]',
                    arguments: {
                        MSG: {
                            type: ArgumentType.STRING,
                            defaultValue: "ping"
                        },
                    }
                },
                {
                    opcode: 'udpClientReceiveEvent',
                    blockType: BlockType.EVHAT,
                    text: '当UDP服务器接收到消息',
                },
                {
                    opcode: 'udpClientReceivedText',
                    blockType: BlockType.REPORTER,
                    text: 'UDP消息',
                }
            ],
            menus: {
                buzzerSounds: {
                    acceptReporters: true,
                    items: [{ text: "DO", value: "DO" }, { text: "RE", value: "RE" }, { text: "MI", value: "MI" }, { text: "FA", value: "FA" }, { text: "SO", value: "SO" }, { text: "LA", value: "LA" }, { text: "XI", value: "SI" }]
                },
                buzzerPitches: {
                    acceptReporters: true,
                    items: [{ text: "低", value: "LOW" }, { text: "中", value: "MID" }, { text: "高", value: "HIGH" }]
                },
                buttons:{
                    acceptReporters: true,
                    items:[{ text: "A", value: "0" },{ text: "B", value: "2" }]
                },color: {
                    acceptReporters: true,
                    items: [{ text: "红色", value: "red" },{ text: "绿色", value: "green" },{ text: "蓝色", value: "blue" },{ text: "黄色", value: "yellow" },{ text: "天蓝色", value: "skyblue" },{ text: "紫色", value: "purple" },{ text: "白色", value: "white" },{ text: "黑色", value: "black" }]
                },
                imageMethods : {
                    acceptReporters: true,
                    items: [{ text: "边缘查找", value: "iess" },{ text: "锐化", value: "ishs" },{ text: "浮雕化", value: "issr" }]
                }
            }
        }
    }
    espstart(){return false}
    whenButtonPressed(){}
    getStartTime(){}
    delay_ms(){}
    delay_us(){}
    delay_s(){}
    openOnBoardRGB(){}
    closeOnBoardRGB(){}
    setLuminanceOnBoardRGB(){}
    setRGBDraw(){}
    setRGBLineDraw(){}
    setRGBLineSingleDraw(){}
    setRGBLineSingleOnlyDraw(){}
    setBuzzerPlay(){}
    setBuzzerStop(){}
    getWiFiStatus(){}
    setConnectToWiFi(){}
    closeConnectToWiFi(){}
    openWiFiAP(){}
    udpClientSent(){}
    udpClientReceiveEvent(){}
}

module.exports = UDblockUDPiV2;