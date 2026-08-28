const BlockType = require("../extension-support/block-type")
const ArgumentType = require("../extension-support/argument-type")

function actionBlocks(hasMotor=true,hasServo=true) {
    var motor = []
    var servo = []
    if (hasMotor){
        motor = [
            {
                type: "custom_seperator",
                text: '★ ▶ 电机',
            },
            {
                opcode: 'turnMotorClock',
                blockType: BlockType.COMMAND,
                text: '电机[PORT]正转速度[SPEED]%',
                arguments: {
                    PORT: {
                        type: ArgumentType.NUMBER,
                        menu: "motorMenu"
                    },
                    SPEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                }
            },
            {
                opcode: 'turnMotorAnticlock',
                blockType: BlockType.COMMAND,
                text: '电机[PORT]反转速度[SPEED]%',
                arguments: {
                    PORT: {
                        type: ArgumentType.NUMBER,
                        menu: "motorMenu"
                    },
                    SPEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                }
            },
            {
                opcode: 'closeMotor',
                blockType: BlockType.COMMAND,
                text: '电机[PORT]停止',
                arguments: {
                    PORT: {
                        type: ArgumentType.NUMBER,
                        menu: "motorMenu"
                    },
                }
            }
        ]
    }
    if (hasServo){
        servo = [
            {
                type: "custom_seperator",
                text: '★ ▶ 舵机',
            },
            {
                opcode: 'turnServoDegree',
                blockType: BlockType.COMMAND,
                text: '舵机[PORT]旋转[DEGREE]°',
                arguments: {
                    PORT: {
                        type: ArgumentType.NUMBER,
                        menu: "servoMenu"
                    },
                    DEGREE: {
                        type: ArgumentType.ANGLE,
                        defaultValue: 90
                    }
                }
            }
        ]
    }
    


    return [
        {
            type: "custom_seperator",
            text: '★ 执行器',
        },
        {
            type: "custom_seperator",
            text: '★ ▶ 电机模块',
        },
        {
            opcode: 'motorModuleMotorClock',
            blockType: BlockType.COMMAND,
            text: '设置电机模块[MOTOR]以[SPD]%速度正转',
            arguments: {
                MOTOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'motor_module_motor_menu'
                },
                SPD: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 50
                }
            }
        },
        {
            opcode: 'motorModuleMotorAntiClock',
            blockType: BlockType.COMMAND,
            text: '设置电机模块[MOTOR]以[SPD]%速度反转',
            arguments: {
                MOTOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'motor_module_motor_menu'
                },
                SPD: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 50
                }
            }
        },
        {
            opcode: 'motorModuleMotorStop',
            blockType: BlockType.COMMAND,
            text: '设置电机模块[MOTOR]停止',
            arguments: {
                MOTOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'motor_module_motor_menu'
                }
            }
        },
        {
            opcode: 'motorModuleServoTurn',
            blockType: BlockType.COMMAND,
            text: '设置电机模块[SERVO]转动到[ANGLE]°',
            arguments: {
                SERVO: {
                    type: ArgumentType.NUMBER,
                    menu: 'motor_module_servo_menu'
                },
                ANGLE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 90
                }
            }
        },
        {
            type: "custom_seperator",
            text: '★ ▶ 数码管',
        },
        {
            opcode: 'digitalDisplayShow',
            blockType: BlockType.COMMAND,
            text: '数码管显示数字[NUM]',
            arguments: {
                NUM: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 500
                }
            }
        },
        {
            opcode: 'digitalDisplayClear',
            blockType: BlockType.COMMAND,
            text: '数码管清屏'
        },
        {
            opcode: 'digitalDisplayOpen',
            blockType: BlockType.COMMAND,
            text: '数码管开启'
        },
        {
            opcode: 'digitalDisplayClose',
            blockType: BlockType.COMMAND,
            text: '数码管关闭'
        },
        {
            opcode: 'digitalDisplayIntensity',
            blockType: BlockType.COMMAND,
            text: '数码管设置亮度[VALUE]',
            arguments: {
                VALUE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 8,
                    menu: "digitalDisplayIntensityMenu"
                }
            }
        },

        {
            type: "custom_seperator",
            text: '★ ▶ RGB灯带',
        },
        {
            opcode: 'openRGBStrip',
            blockType: BlockType.COMMAND,
            text: '打开RGB灯条[PORT]灯珠数量[COUNT]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                COUNT: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 15
                }
            }
        },
        {
            opcode: 'setRGBStripLuminance',
            blockType: BlockType.COMMAND,
            text: '设置RGB灯条[PORT]亮度[NUM]%',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                NUM: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 20
                }
            }
        },
        {
            opcode: 'setRGBStripIndexColor',
            blockType: BlockType.COMMAND,
            text: '设置RGB灯条[PORT][INDEX]号灯颜色[COLOR]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                INDEX: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                },
                COLOR: {
                    type: ArgumentType.COLOR
                }
            }
        },
        {
            opcode: 'setRGBStripIndexOnlyColor',
            blockType: BlockType.COMMAND,
            text: '设置RGB灯条[PORT]只有[INDEX]号灯显示[COLOR]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                INDEX: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                },
                COLOR: {
                    type: ArgumentType.COLOR
                }
            }
        },
        {
            opcode: 'setRGBStripClear',
            blockType: BlockType.COMMAND,
            text: '设置RGB灯条[PORT]颜色[COLOR]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                COLOR: {
                    type: ArgumentType.COLOR
                }
            }
        },
        ...motor,
        ...servo,
        {
            type: "custom_seperator",
            text: '★ ▶ 步进电机',
        },
        {
            opcode: 'turnStepper',
            blockType: BlockType.COMMAND,
            text: '步进电机[PORT]设置[DIRECTION][PERIOD]秒转[ROUNDS]圈',
            arguments: {
                PORT: {
                    type: ArgumentType.NUMBER,
                    menu: "RJMenuDup"
                },
                DIRECTION: {
                    type: ArgumentType.STRING,
                    defaultValue: '0x01',
                    menu: "StepperDirectionMenu"
                },
                PERIOD: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                },
                ROUNDS: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                }
            }
        },
        {
            type: "custom_seperator",
            text: '★ ▶ 继电器',
        },
        {
            opcode: 'openReplay',
            blockType: BlockType.COMMAND,
            text: '打开继电器[PORT]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                }
            }
        },
        {
            opcode: 'closeReplay',
            blockType: BlockType.COMMAND,
            text: '关闭继电器[PORT]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                }
            }
        },
        {
            opcode: 'switchReplay',
            blockType: BlockType.COMMAND,
            text: '切换继电器[PORT]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                }
            }
        },
        {
            type: "custom_seperator",
            text: '★ ▶ 双路继电器',
        },
        {
            opcode: 'openReplayDblYellow',
            blockType: BlockType.COMMAND,
            text: '打开双路继电器[PORT]黄路',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "dblRelayPinYellow"
                }
            }
        },
        {
            opcode: 'openReplayDblBlue',
            blockType: BlockType.COMMAND,
            text: '打开双路继电器[PORT]蓝路',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "dblRelayPinBlue"
                }
            }
        },
        {
            opcode: 'closeReplayDblYellow',
            blockType: BlockType.COMMAND,
            text: '关闭双路继电器[PORT]黄路',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "dblRelayPinYellow"
                }
            }
        },
        {
            opcode: 'closeReplayDblBlue',
            blockType: BlockType.COMMAND,
            text: '关闭双路继电器[PORT]蓝路',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "dblRelayPinBlue"
                }
            }
        },
        {
            opcode: 'switchReplayDblYellow',
            blockType: BlockType.COMMAND,
            text: '切换双路继电器[PORT]黄路',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "dblRelayPinYellow"
                }
            }
        },
        {
            opcode: 'switchReplayDblBlue',
            blockType: BlockType.COMMAND,
            text: '切换双路继电器[PORT]蓝路',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "dblRelayPinBlue"
                }
            }
        },
        {
            type: "custom_seperator",
            text: '★ ▶ 双路继电器[旧版]',
        },
        {
            opcode: 'openReplayDbl',
            blockType: BlockType.COMMAND,
            text: '打开双路继电器[PORT]通道[CH]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                CH: {
                    type: ArgumentType.STRING,
                    menu: "channel",
                }
            }
        },
        {
            opcode: 'closeReplayDbl',
            blockType: BlockType.COMMAND,
            text: '关闭双路继电器[PORT]通道[CH]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                CH: {
                    type: ArgumentType.STRING,
                    menu: "channel",
                }
            }
        },
        {
            opcode: 'switchReplayDbl',
            blockType: BlockType.COMMAND,
            text: '切换双路继电器[PORT]通道[CH]',
            arguments: {
                PORT: {
                    type: ArgumentType.STRING,
                    menu: "RJMenu"
                },
                CH: {
                    type: ArgumentType.STRING,
                    menu: "channel",
                }
            }
        },
        {
            type: "custom_seperator",
            text: '★ ▶ 表情面板',
        },
        {
            opcode: 'setFacePanelCustomized',
            blockType: BlockType.COMMAND,
            text: '设置表情面板为自定义[FACE]颜色[COLOR]',
            arguments: {
                FACE: {
                    type: ArgumentType.MATRIXUD,
                    defaultValue: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
                },
                COLOR: {
                    type: ArgumentType.COLOR
                }
            }
        },
        {
            opcode: 'setFacePanelPreset',
            blockType: BlockType.COMMAND,
            text: '设置表情面板为预设[FACE]颜色[COLOR]',
            arguments: {
                FACE: {
                    type: ArgumentType.STRING,
                    menu: "faceMenu"
                },
                COLOR: {
                    type: ArgumentType.COLOR,
                    menu: "faceColorMenu"
                }
            }
        },
        {
            type: "custom_seperator",
            text: '★ ▶ OLED显示屏模组'
        },
        {
            opcode: 'displayClean',
            blockType: BlockType.COMMAND,
            text: '控制OLED显示屏擦除内容'
        },
        {
            opcode: 'displayWrite',
            blockType: BlockType.COMMAND,
            text: '将在OLED显示屏[LINE]行显示文本[TEXT]',
            arguments:{
                LINE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0, // * 16
                    menu: "displayLine"
                },
                TEXT: {
                    type: ArgumentType.STRING,
                    defaultValue: "UDBlock,Go!"
                }
            }
        },
        // {
        //     opcode: 'displayWriteShow',
        //     blockType: BlockType.COMMAND,
        //     text: '在OLED显示屏[LINE]行显示文本[TEXT]立即显示',
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
            text: 'OLED显示屏画标签 X:[X] Y:[Y] 内容: [STR]',
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
            text: 'OLED显示屏画点 X[X] Y[Y]',
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
            text: 'OLED显示屏画直线 起点 X[SX] Y[SY] | 终点 X[EX] Y[EY]',
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
            text: 'OLED显示屏画矩形 X[SX] Y[SY] 长[LENGTH] 宽[WIDTH]',
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
            text: 'OLED显示屏画实心矩形 X[SX] Y[SY] 长[LENGTH] 宽[WIDTH]',
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
            text: 'OLED显示屏画圆形 坐标 X:[SX] Y:[SY] 半径:[R]',
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
            text: 'OLED显示屏画实心圆形 X:[SX] Y:[SY] 半径[R]',
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
            text: 'OLED显示屏画三角形 坐标 X1:[X1] Y1:[Y1]\nX2:[X2] Y2:[Y2]\nX3:[X3] Y3:[Y3]',
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
            text: 'OLED显示屏画实心三角形 坐标 X1:[X1] Y1:[Y1]\nX2:[X2] Y2:[Y2]\nX3:[X3] Y3:[Y3]',
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
            text: 'OLED显示屏画圆形 坐标 X:[SX] Y:[SY] 半径:[R]',
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
            text: 'OLED显示屏内容向X:[X] Y:[Y]移动 ',
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
    ]
}

module.exports = actionBlocks;