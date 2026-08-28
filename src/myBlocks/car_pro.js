const BlockType = require("../extension-support/block-type")
const ArgumentType = require("../extension-support/argument-type");

const carProBlocks = [
    {
        type: "custom_seperator",
        text: '★ 控制',
    },
    // {
    //     opcode: 'readWindSensor',
    //     blockType: BlockType.REPORTER,
    //     text: '读取风速传感器于[PORT]',
    //     arguments: {
    //         PORT: {
    //             type: ArgumentType.STRING,
    //             menu: "RJADCMenu"
    //         }
    //     }
    // },

    // SPD ONLY
    {
        opcode: 'moveFrontSpd',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向前移动',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            }
        }
    },
    {
        opcode: 'moveBackSpd',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向后移动',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            }
        }
    },
    {
        opcode: 'moveLeftSpd',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向左移动',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            }
        }
    },
    {
        opcode: 'moveRightSpd',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向右移动',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            }
        }
    },
    {
        opcode: 'rotateSpd',
        blockType: BlockType.COMMAND,
        text: '车辆旋转[DIS]°',
        arguments: {
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 90
            }
        }
    },
    {
        opcode: 'moveFrontSpdDis',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向前移动[DIS]cm',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            }
        }
    },
    {
        opcode: 'moveBackSpdDis',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向后移动[DIS]cm',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            }
        }
    },
    {
        opcode: 'moveLeftSpdDis',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向左移动[DIS]cm',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            },
        }
    },
    {
        opcode: 'moveRightSpdDis',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向右移动[DIS]cm',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            },
        }
    },
    // CUSTOMIZE
    {
        opcode: 'moveFront',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向前移动[DIS]cm 加速度[ACCEL]cm/s2',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            },
            ACCEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            }
        }
    },
    {
        opcode: 'moveBack',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向后移动[DIS]cm 加速度[ACCEL]cm/s2',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            },
            ACCEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            }
        }
    },
    {
        opcode: 'moveLeft',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向左移动[DIS]cm 加速度[ACCEL]cm/s2',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            },
            ACCEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            }
        }
    },
    {
        opcode: 'moveRight',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]cm/s的速度向右移动[DIS]cm 加速度[ACCEL]cm/s2',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 10
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            },
            ACCEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
            }
        }
    },
    {
        opcode: 'rotate',
        blockType: BlockType.COMMAND,
        text: '车辆以[SPEED]°/s的速度旋转[DIS]° 角加速度[ACCEL]°/s2',
        arguments: {
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            },
            DIS: {
                type: ArgumentType.NUMBER,
                defaultValue: 90
            },
            ACCEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 5
            }
        }
    },
    {
        opcode: 'stopCar',
        blockType: BlockType.COMMAND,
        text: '停止车辆'
    },
    {
        opcode: 'servoTurn',
        blockType: BlockType.COMMAND,
        text: '车辆控制舵机[INDEX]以角速度[SPEED]转动[DEGREE]度 加速度[ACCEL]',
        arguments: {
            INDEX: {
                type: ArgumentType.STRING,
                menu: "servoMenu",
                defaultValue: "0x01"
            },
            SPEED: {
                type: ArgumentType.NUMBER,
                defaultValue: 20
            },
            DEGREE: {
                type: ArgumentType.NUMBER,
                defaultValue: 90
            },
            ACCEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 5
            }
        }
    },
    {
        type: "custom_seperator",
        text: '★ APP遥控'
    },
    // #  0:三角 1:圆形 2:叉 3:正方形 4:上 5:右 6:下 7:左 8:L1 9:L2 10:R1 11:R2

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
        opcode: 'appGetButtonStatus',
        blockType: BlockType.BOOLEAN,
        text: 'APP按键[BTN]被按下',
        arguments: {
            BTN:{
                type: ArgumentType.NUMBER,
                menu: 'appBtnMenu'
            }
        }
    },
    {
        opcode: 'appGetButtonUP',
        blockType: BlockType.BOOLEAN,
        text: 'APP按键[BTN]被松开',
        arguments: {
            BTN:{
                type: ArgumentType.NUMBER,
                menu: 'appBtnMenu'
            }
        }
    },
    {
        opcode: 'appGetRemote',
        blockType: BlockType.REPORTER,
        text: 'APP遥感[POS]',
        arguments: {
            POS:{
                type: ArgumentType.NUMBER,
                menu: 'ps2RemoteMenu'
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
                menu: 'ps2BtnMenu'
            }
        }
    },
    {
        opcode: 'ps2GetButtonUP',
        blockType: BlockType.BOOLEAN,
        text: 'PS2按键[BTN]被松开',
        arguments: {
            BTN:{
                type: ArgumentType.NUMBER,
                menu: 'ps2BtnMenu'
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
                menu: 'ps2RemoteMenu'
            }
        }
    },
    {
        opcode: 'ps2SetForwardSpd',
        blockType: BlockType.COMMAND,
        text: '设置遥控器前进速度为[SPD] cm/s',
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
        text: '设置遥控器转弯速度为[SPD] cm/s',
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
    {
        type: "custom_seperator",
        text: '★ 信息获取',
    },
    {
        opcode: 'getMovementData',
        blockType: BlockType.REPORTER,
        text: '获取车辆[AXIS]的[DTYPE]',
        arguments: {
            AXIS: {
                type: ArgumentType.NUMBER,
                defaultValue: "x",
                menu: "axisMenu"
            },
            DTYPE: {
                type: ArgumentType.STRING,
                defaultValue: '0',
                menu: "dataTypeMenu"
            },
        }
    },
    {
        opcode: 'getServoData',
        blockType: BlockType.REPORTER,
        text: '获取车辆[INDEX]舵机的角度',
        arguments: {
            INDEX: {
                type: ArgumentType.NUMBER,
                defaultValue: "0x01",
                menu: "servoMenu"
            },
        }
    },
    {
        opcode: 'getBootVersion',
        blockType: BlockType.REPORTER,
        text: '获取车辆BOOT版本',
    },
    {
        opcode: 'getVersion',
        blockType: BlockType.REPORTER,
        text: '获取车辆固件版本',
    },
]

module.exports = carProBlocks;