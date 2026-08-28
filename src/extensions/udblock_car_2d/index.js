const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions')


// 方块引用
const carBlocks = require('../../myBlocks/car')
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const { extb_car_2d } = require ('../../../src/util/extb-definitions');
// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockCar2D {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            cameraBlocks,
            sensorBlocks,
            actionBlocks(false,false)
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
        for (i in extb_car_2d.RJ11) {
            var yellowPin = extb_car_2d.RJ11[i].value[0];
            var bluePin = extb_car_2d.RJ11[i].value[1];
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
            id: "udblockEXTBCar2D",
            name: "双驱小车拓展板",
            blockIconURI: blockIconURI,
            blocks: [
                {
                    type: "custom_seperator",
                    text: '★ 控制',
                },
                {
                    opcode: 'moveForward',
                    blockType: BlockType.COMMAND,
                    text: '以[SPEED]%的速度前进',
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'moveBack',
                    blockType: BlockType.COMMAND,
                    text: '以[SPEED]%的速度后退',
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'turnLeft',
                    blockType: BlockType.COMMAND,
                    text: '以[SPEED]%的速度左转',
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'turnRight',
                    blockType: BlockType.COMMAND,
                    text: '以[SPEED]%的速度右转',
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'turnCustomize',
                    blockType: BlockType.COMMAND,
                    text: '左轮以[SPDL]%速度[MODEL]，右轮以[SPDR]%速度[MODER]',
                    arguments: {
                        SPDL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        },
                        SPDR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        },
                        MODEL: {
                            type: ArgumentType.STRING,
                            menu: "carServoMode"
                        },
                        MODER: {
                            type: ArgumentType.STRING,
                            menu: "carServoMode"
                        }
                    }
                },
                {
                    opcode: 'stopCar',
                    blockType: BlockType.COMMAND,
                    text: '停止小车'
                },
                {
                    opcode: 'startServer',
                    blockType: BlockType.COMMAND,
                    text: '开启遥控功能 热点名[SSID] 密码[PSK]',
                    arguments: {
                        SSID: {
                            type: ArgumentType.STRING,
                            defaultValue: "udpi-" + (parseInt(Math.random() * 10000000 + ''))
                        },
                        PSK: {
                            type: ArgumentType.STRING,
                            defaultValue: "test12345678"
                        }
            
                    }
                },
                {
                    opcode: 'stopServer',
                    blockType: BlockType.COMMAND,
                    text: '关闭遥控功能'
                },
                {
                    opcode: 'servoTurn',
                    blockType: BlockType.COMMAND,
                    text: '控制舵机[INDEX]转动[DEGREE]度',
                    arguments: {
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: "servoMenu",
                            defaultValue: "0x01"
            
                        },
                        DEGREE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ PS2遥控器',
                },
                {
                    opcode: 'ps2Init',
                    blockType: BlockType.COMMAND,
                    text: '初始化遥控器'
                },
                {
                    opcode: 'ps2ControlEnable',
                    blockType: BlockType.COMMAND,
                    text: '开启PS2遥控器遥控模式'
                },
                {
                    opcode: 'ps2ControlDisable',
                    blockType: BlockType.COMMAND,
                    text: '关闭PS2遥控器遥控模式'
                },
                {
                    opcode: 'ps2GetButtonStatus',
                    blockType: BlockType.BOOLEAN,
                    text: 'PS2按键[BTN]被按下',
                    arguments: {
                        BTN:{
                            type: ArgumentType.NUMBER,
                            menu: 'ps2BtnMenu',
                        }
                    }
                },
                {
                    opcode: 'ps2GetRemote',
                    blockType: BlockType.REPORTER,
                    text: 'PS2遥感[POS]',
                    arguments: {
                        POS:{
                            type: ArgumentType.NUMBER,
                            menu: 'ps2RemoteMenu',
                        }
                    }
                },
                {
                    opcode: 'ps2SetForwardSpd',
                    blockType: BlockType.COMMAND,
                    text: '设置遥控器前进速度为[SPD] %',
                    arguments: {
                        SPD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20,
                        }
                    }
                },
                {
                    opcode: 'ps2SetTurnSpd',
                    blockType: BlockType.COMMAND,
                    text: '设置遥控器转弯速度为[SPD] %',
                    arguments: {
                        SPD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 15,
                        }
                    }
                },
                {
                    opcode: 'ps2SetServoSpd',
                    blockType: BlockType.COMMAND,
                    text: '设置遥控器舵机速度为每次[SPD] 度',
                    arguments: {
                        SPD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5,
                        }
                    }
                },
                ...this.customBlocks
            ],
            menus: {
                ...GenerateRJMenuAll('extb_car_2d'),
                servoMenu: {
                    acceptReporters: true,
                    items: [{text: "一",value: "0x01"},{text: "二",value: "0x02"},{text: "三",value: "0x03"},{text: "四",value: "0x04"},]
                },
                carServoMode: {
                    acceptReporters: true,
                    items: [{text: "正转",value: "clock"},{text: "反转",value: "anticlock"}]
                },
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
                
            }
        }
    }
}

module.exports = UDblockCar2D;