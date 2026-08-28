const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockUDPi {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "udblockUDPi",
            name: "UDPi 开发板",
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
                {
                    type: "custom_seperator",
                    text: '★ ▶ 蜂鸣器',
                },
                {
                    opcode: 'setBuzzerPlay',
                    blockType: BlockType.COMMAND,
                    text: '控制主板蜂鸣器播放[SOUND] 音调 [PITCH]',
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            defaultValue: "DO",
                            menu: "buzzerSounds"
                        },
                        PITCH: {
                            type: ArgumentType.STRING,
                            defaultValue: "LOW",
                            menu: "buzzerPitches"
                        }
                    }
                },
                {
                    opcode: 'setBuzzerPlayMidi',
                    blockType: BlockType.COMMAND,
                    text: '控制主板蜂鸣器播放MIDI [SOUND]',
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            defaultValue: "demo"
                        }
                    }
                },
                {
                    opcode: 'setBuzzerStop',
                    blockType: BlockType.COMMAND,
                    text: '控制主板蜂鸣器停止播放',
                },
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

module.exports = UDblockUDPi;