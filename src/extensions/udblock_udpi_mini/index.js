const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const formatMessage = require('format-message')
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const carBlocks = require('../../myBlocks/car');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_udpi_mini } = require ('../../../src/util/extb-definitions');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDBlockUDPiMiniV1 {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            sensorBlocks,
            actionBlocks(false,false),
            cameraBlocks,
        )
        this.dblRelayPinYellow = {
            acceptReporters: true,
            items: []
        };
        this.dblRelayPinBlue = {
            acceptReporters: true,
            items: []
        };
        // 双路继电器生成菜单
        for (i in extb_udpi_mini.RJ11) {
            var yellowPin = extb_udpi_mini.RJ11[i].value[0];
            var bluePin = extb_udpi_mini.RJ11[i].value[1];
            if (!(yellowPin >= 34 && yellowPin <= 39)){
                this.dblRelayPinYellow.items.push({text:"RJ"+String(Number(i)+1), value: String(yellowPin)});
            }
            if (!(bluePin >= 34 && bluePin <= 39)){
                this.dblRelayPinBlue.items.push({text:"RJ"+String(Number(i)+1), value: String(bluePin)});
            }
        }
    }

    getInfo() {
        return {
            id: "udblockUDPiMiniV1",
            name: "UDPi+最小系统板V1",
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "espstart",
                    blockType: BlockType.HAT,
                    text: "UDPi+最小系统板初始化完成"
                },
                {
                    opcode: "print",
                    blockType: BlockType.COMMAND,
                    text: "打印[TEXT]",
                    arguments: {
                        TEXT: {
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
                        BTN: {
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
                            defaultValue: "udpi-" + (parseInt(Math.random() * 10000000 + ''))
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
                },
                ...this.customBlocks
            ],
            menus: {
                gesture_sensor: {
                    acceptReporters: true,
                    items: [{ text: "上", value: "up" }, { text: "下", value: "down" }, { text: "左", value: "left" }, { text: "右", value: "right" }]
                },
                buzzerSounds: {
                    acceptReporters: true,
                    items: [{ text: "DO", value: "DO" }, { text: "RE", value: "RE" }, { text: "MI", value: "MI" }, { text: "FA", value: "FA" }, { text: "SO", value: "SO" }, { text: "LA", value: "LA" }, { text: "XI", value: "SI" }]
                },
                buzzerPitches: {
                    acceptReporters: true,
                    items: [{ text: "低", value: "LOW" }, { text: "中", value: "MID" }, { text: "高", value: "HIGH" }]
                },
                buttons: {
                    acceptReporters: true,
                    items: [{ text: "A", value: "0" }, { text: "B", value: "2" }]
                },
                displayLine: {
                    acceptReporters: true,
                    items: [{ text: "一", value: "0" }, { text: "二", value: "1" }, { text: "三", value: "2" }, { text: "四", value: "3" }]
                }, color: {
                    acceptReporters: true,
                    items: [{ text: "红色", value: "red" }, { text: "绿色", value: "green" }, { text: "蓝色", value: "blue" }, { text: "黄色", value: "yellow" }, { text: "天蓝色", value: "skyblue" }, { text: "紫色", value: "purple" }, { text: "白色", value: "white" }, { text: "黑色", value: "black" }]
                },
                imageMethods: {
                    acceptReporters: true,
                    items: [{ text: "边缘查找", value: "iess" }, { text: "锐化", value: "ishs" }, { text: "浮雕化", value: "issr" }]
                },
                ...GenerateRJMenuAll('extb_udpi_mini'),
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
            }
        }
    }

    espstart() { return false }
    whenButtonPressed() { }
    getStartTime() { }
    delay_ms() { }
    delay_us() { }
    delay_s() { }
    readAmbientLightSensor() { }
    readSoundSensor() { }
    readGryoSensor() { }
    readAccelSensor() { }
    openOnBoardRGB() { }
    closeOnBoardRGB() { }
    setLuminanceOnBoardRGB() { }
    setRGBDraw() { }
    setRGBLineDraw() { }
    setRGBLineSingleDraw() { }
    setRGBLineSingleOnlyDraw() { }
    setBuzzerPlay() { }
    setBuzzerStop() { }
    getWiFiStatus() { }
    setConnectToWiFi() { }
    closeConnectToWiFi() { }
    openWiFiAP() { }
    udpClientSent() { }
    udpClientReceiveEvent() { }
}

module.exports = UDBlockUDPiMiniV1;