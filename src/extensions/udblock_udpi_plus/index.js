const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const formatMessage = require('format-message')

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockUDPiPlus {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "udblockUDPiPlus",
            name: "UDPi+开发板",
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "espstart",
                    blockType: BlockType.HAT,
                    text: "UDPi+主板初始化完成"
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
                    text: '★ 传感器',
                },
                {
                    opcode: 'readAmbientLightSensor',
                    blockType: BlockType.REPORTER,
                    text: '读取环境光传感器'
                },
                {
                    opcode: 'readSoundSensor',
                    blockType: BlockType.REPORTER,
                    text: '读取声音传感器'
                },
                {
                    opcode: 'readGryoSensor',
                    blockType: BlockType.REPORTER,
                    text: '读取陀螺仪传感器'
                },
                {
                    opcode: 'readAccelSensor',
                    blockType: BlockType.REPORTER,
                    text: '读取加速度传感器'
                },
                {
                    opcode: 'readGestureSensor',
                    blockType: BlockType.BOOLEAN,
                    text: '读取手势传感器为[GESTURE]',
                    arguments: {
                        GESTURE:{
                            type: ArgumentType.STRING,
                            defaultValue: "up",
                            menu: "gesture_sensor"
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ 显示屏',
                },
                {
                    opcode: 'displayClean',
                    blockType: BlockType.COMMAND,
                    text: '控制显示屏擦除内容'
                },
                {
                    opcode: 'displayWrite',
                    blockType: BlockType.COMMAND,
                    text: '将在显示屏[LINE]行显示文本[TEXT]',
                    arguments:{
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0, // * 16
                            menu: "displayLine"
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "UDBlock, Go!"
                        }
                    }
                },
                // {
                //     opcode: 'displayWriteShow',
                //     blockType: BlockType.COMMAND,
                //     text: '在显示屏[LINE]行显示文本[TEXT]立即显示',
                //     arguments:{
                //         LINE: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0, // * 16
                //             menu: "displayLine"
                //         },
                //         TEXT: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "UDBlock, Go!"
                //         }
                //     }
                // },
                {
                    opcode: 'displayShow',
                    blockType: BlockType.COMMAND,
                    text: '控制显示器刷新内容'
                },
                {
                    opcode: 'displayDrawLabel',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画标签 X:[X] Y:[Y] 内容: [STR]',
                    arguments:{
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50, // * 16
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5, // * 16
                        },
                        STR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'UDPI', // * 16
                        },
                    }
                },
                {
                    opcode: 'displayDrawPoint',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画点 X[X] Y[Y]',
                    arguments:{
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0, // * 16
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0, // * 16
                        }
                    }
                },
                {
                    opcode: 'displayDrawLine',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画直线 起点 X[SX] Y[SY] | 终点 X[EX] Y[EY]',
                    arguments:{
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0, // * 16
                        },
                        EX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128, // * 16
                        },
                        EY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64, // * 16
                        },
                    }
                },
                {
                    opcode: 'displayDrawRect',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画矩形 X[SX] Y[SY] 长[LENGTH] 宽[WIDTH]',
                    arguments:{
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 - 20, // * 16
                        },
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40, // * 16
                        },
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40, // * 16
                        },
                    }
                },
                {
                    opcode: 'displayDrawRectFill',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画实心矩形 X[SX] Y[SY] 长[LENGTH] 宽[WIDTH]',
                    arguments:{
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 - 20, // * 16
                        },
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40, // * 16
                        },
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40, // * 16
                        },
                    }
                },
                {
                    opcode: 'displayDrawCircle',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画圆形 坐标 X:[SX] Y:[SY] 半径:[R]',
                    arguments:{
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 - 20, // * 16
                        },
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40, // * 16
                        },
                    }
                },
                {
                    opcode: 'displayDrawCircleFill',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画实心圆形 X:[SX] Y:[SY] 半径[R]',
                    arguments:{
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 - 20, // * 16
                        },
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40, // * 16
                        },
                    }
                },
                {
                    opcode: 'displayDrawTriangle',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画三角形 坐标 X1:[X1] Y1:[Y1]\nX2:[X2] Y2:[Y2]\nX3:[X3] Y3:[Y3]',
                    arguments:{
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2, // * 16
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 - 20, // * 16
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 + 20, // * 16
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 + 20, // * 16
                        },
                        X3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 - 20, // * 16
                        },
                        Y3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 + 20, // * 16
                        },

                    }
                },
                {
                    opcode: 'displayDrawTriangleFill',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画实心三角形 坐标 X1:[X1] Y1:[Y1]\nX2:[X2] Y2:[Y2]\nX3:[X3] Y3:[Y3]',
                    arguments:{
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2, // * 16
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 - 20, // * 16
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 + 20, // * 16
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 + 20, // * 16
                        },
                        X3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 - 20, // * 16
                        },
                        Y3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 + 20, // * 16
                        },

                    }
                },
                {
                    opcode: 'displayDrawCircle',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画圆形 坐标 X:[SX] Y:[SY] 半径:[R]',
                    arguments:{
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128/2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64/2 - 20, // * 16
                        },
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 40, // * 16
                        },
                    }
                },
                {
                    opcode: 'displayScroll',
                    blockType: BlockType.COMMAND,
                    text: '屏幕内容向X:[X] Y:[Y]移动 ',
                    arguments:{
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0, // * 16
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5, // * 16
                        },
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
                //             defaultValue: "50"
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
                    opcode: 'setRGBLineSingleDraw',
                    blockType: BlockType.COMMAND,
                    text: '控制主板RGB[INDEX]号灯珠显示颜色[COLOR]',
                    arguments: {
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
                    text: '控制主板RGB只有[INDEX]号灯珠显示颜色[COLOR]',
                    arguments: {
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
                            defaultValue: "改为你要连接的热点名",
                        },
                        PSK: {
                            type: ArgumentType.STRING,
                            defaultValue: "改为你要连接的热点密码",
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
                gesture_sensor: {
                    acceptReporters: true,
                    items:[{text: "上", value: "up"},{text: "下", value: "down"},{text: "左", value: "left"},{text: "右", value: "right"}]
                },
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
                },
                displayLine:{
                    acceptReporters: true,
                    items:[{ text: "一", value: "0" },{ text: "二", value: "1" },{ text: "三", value: "2" },{ text: "四", value: "3" }]
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
    readAmbientLightSensor(){}
    readSoundSensor(){}
    readGryoSensor(){}
    readAccelSensor(){}
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

module.exports = UDblockUDPiPlus;