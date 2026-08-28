const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const formatMessage = require('format-message')

// 方块图标链接
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAADSZJREFUaEPtWXl0VOUV/73Zs0ySSQJJGkIISyGEEAkkIYqaAIqagrWlgloBl3/AWrS2QMCyExSXArYiSA6np8cN8WjFcyAERAlhEVkTgSQQtpnsK8lMZn+9972ZYYIJhMV6PIfvnI83ecv33d9dfvd+FwGiKOAXPIQ7AH5m692xwM9sANyxwB0L3KIGunUhERCampqCw8PDlbTHZUoW7lvc64Y+P1FSEjZoUFyI1YrWsLCw1u6SVScAao0mdcyYMc+VlZ3SZmRkZkZERMQJgqCqra09tX/v7qNmc5tLksKzmoJ+ElAVoJDwiVB4H+GuEaMU9Y1NgttlR3NjI6wWs6QBhQKsED95eBU33G5+BEGgfwYOHhaYOHTYvRqNVm+z2ToqKk4fm5iTU0dyGNet3zifcpfZq40rAAQB/fv3nzt9+vSVX3zxORoaGmlFXpyWdznR0lSHhH6xSB2ViWOHi6DRBtPvu7G/+GuIbicyMrPw/cFvoBY6UGlsx+ChqdDqAqTva0wX4OyoRWCgBskj7oPdYceOgh3Izs4CaReFBdsw+u77oNfr8dVXW+ESlQgJMfhgut0O/PnFl0AKbl++YslddbUtlV0BECZOnJj77LPPLs/Pz6eFvvKZXEM6VpPepj09GQuXvo1luc8hNDIeuQvfxJyXniGgdix7bQMWvPI0dBoBn287jD79hiAoSM80h0uXzqN/jBpRvcPx8tyVaL3chscfn4L8jeuQ0H8Qnpr6eyxf+TZi+8Rj8u8m4aKxTtpbo1HC5RLpqsPUJ55C377x5g0b16VWnjVWdAkgOTl5PplpWUBAgKQZN9m1tLQUwYEKOB0uDP51AlJGpOPM6SNwOAUMSUrF6R8OkwXsSEwejZMnvkNZ+Xk4adOUESORMGAQOiwWfHewGK3NjQgM0GDsuPGwWu3YW1yE0RlpCNaHoXjvHnK5VIToQ9HS2gpTVQ3Onz+H4OBgyad0Oh2ysrJRVWUyF+3eldpmFbsGQKjm01ymUqmQm5uL48ePS5YIDhDgIAA8lCoFXE43lErZ+0RRlH476R6PAX31qG1y4uGcyTCT8Gq1CiZjJUyVpVKUmGqtUsR4o4A8l9aQ56O/fQx9+vQBEQf2Fn2LIUOGIig4CL16RcFiaceWTzebTx4/mWoTuwewgJZeqlQqMW3aNDKdBvn5GxGoFSgOKESVckxw5CpIaAVJQkaSQChIErVGgcm/yUDBNz+QT2cjgjbmNYqLdiNUZ4FCpcG+Q+UU6vJaLLTL5YZA67icIrlTAtLS0slV+mLLls2S9VRqNTRqjfRedbXJ0t5iYQDlXboQ3ZQApKSkYOrUqSgpKcHevdsvh4bqVtsCRr5k08WEXPnQhwUiBbnDtE++wdolwfx5Rvrbb6iiR0GhCex80/cJgak7cCRC11BafrpmGseQlmLBanOyoizkrdcE8HdaZ3FWVhbS09OxZs0aMqe2ge49HRSX/YErKDacd82INkmbH6yJlQ3issFS+uGPBOruhm7wY1DqwqTHieENCNHYfGvxvfZz+7YZNNWFF8/Xvc0A2FIe5VjE6wBYSC8uysnJwZQpU7Bp0yYUFe1xUezVRiZOiEJIP+ZwCYBOLaCsPV5al2m28cz+HgMw9BsJlVa2QKyuBirR2hlARYHF0lhpJrfq5Y0Rz+IdxKgj7aJ42ruZfx5g40sArpZEH6RE5OAHgdAE36MYgwoDYrQ9Frq7Fy/W23Gx3tHpseVMAdrrK2UKVRNpSFFOinKLHZQXrwmAhV8YGBiI3r17o6OjA0SrCCEAEVcBCA9yo2/vWwdQ3WBHbVvnQqG9nAGclVzHawHO0ASig7hwlN0mnurOAhKA1NRUypLZKCwslAI5OECByCEPkAX6+zR12ViCpjPFUCkoy93kcLldCIkfAUNCeqcV2sq3SxZQEVMx+0gxIGO0EukxgJPdAVhCD16ljIzx48dj5cqVqKmpIRpVICppQicXYgC4eB5J+vtvUnz63FKClt7qrgHU+aoFef0eAGAjMYAFaWlpYBDFxcXYsWOHlAd6D+UY6GyBnwqA5EJ15EIktJeVPVRsdQtIIwv80JUFfACYhTiZ2O12iYk4E0cMZhca4OdCJ26jBTKuCuLtMDdUUnbnIJB83ztsHgClXQLQaBRL6f35w5KGUSa9B+XlZZTS90CrBgyDro6Bnw5AO8UAA+AM758DSTYbBTFboGsAwTosFSHMp7IaaRmZ0Gm1+Pij/8Bhd6JX4gSIfjT6U8aAmVyozcNCvowuG8PmEpBOACgAvaHh7cxR2adTYRnRVW5EZCRioqPRSAeR+rpauNwiooZSEBv8YuDS7QniVgriMGYhPya1Vhai2VQBFRWOxP3S9Dy3EQtdA4AGKwQRc0eOHIonnnoOWz7Ox8HvTxIXcxBPgOAXA63G2+NCDMCQ0DkG2iu243LtWUloLhLd5EpSASvARmFxfQAxv4rGgw89gp2F22E0VkkAopMeIgCUiTmz0GAArnPlSAgaedM0Wms7i44oPRnWDwAJyyxUZyIAVw2dGnaKgdEOu3isSxeimiePjDUnJjqGavFElFeUocpIhRvJHD2MAIQxC8m00FZ9Cs1ne17/dIcypE8Kwqg2ukL2IixndqDmou/M4vs0NFhjt9js3QPQqpBHCp7DGtdqNbARjYrkf6z0qGEToDQM8lAaEzQzhGyNK+7ryf3XsolfWpUTrFzneBXDqzIL1Rl/bIHrA9BgJQnzt6v3F2gbtoCCLUBonkk8Lu236WSKvDGB8YfRubKRV+t8JPD8RZnqmcRj0OtseOdouvwOu1DFNrTWXAEgea38icPpIBcSxaNduZCS+P41evkVHwDPPmyR2JQciCH9PAIDerUd7Q4q5jolGo9FJECdh1zTe6F1fh6stqHNrvGtZTlLNFpbIZ2tfV95Acgx0DWAAAJASpEAsAzSf334QHQWiEFR28WhC9Aut5hth4jsFtC790gG8bzqtQvVY8Qm8sGE77lcyKNT5PfUZplutzsmeUhGesbnZaZtHsFBQWg3yy0gz5p8Ms8kAEe6soCg02AeZ2I/UX3eIDGxCJ2fGvlM7IyMCv2ArmUNda1PuhzuRN6J3mU5fHbgczMPrlVeeHE2Fi9dbjcaL5juHj2qxmK2jqYmgnC64hz1jQLxwLj7XWnpGeKcObmq/gMGoKWlBSuWLXH9853V1AeBxeXAGDrQdFFOSzClqjuoKwB0L46CvIiuYV4t+2mU22o2tVo5y2p3URMGq+g9uavlMaL3WDg8ORlHj5+gLocDBmrdWOjgnpGRjv0HDsJkMlEVPG77iRMlY+gsYrlw4UJtUlJSIllatW7dupmzZs3aSstVSzWGZ/S8vS4IcdQhOUrqlc7FvIK3HSIlGYVgjuwVmlNT08IHhC0SUL8htVIkJQGVlecRHx+PCRMewK6dO/HKX+fg9ddfx3vvvYdZs2Z+Pn36jN0FBQX26urqsH379j2ZmZk5/MCBA5voyk2HetpY7vFIy/XwP/lemzcqTqdUHCXqDJeolVTucDop3XP3zEWHD5W5qc2dE6lXKNyC4jNK/wamRG698KGEDs7UWRBhrG3HpKnz8cij0/HfT9/F1s2r8cLc9RgxKht5r84QDx3c9dEXO42rSbZgmn2pN5U7fPjwwZ988sm71Cl5k+4ZSWbnDQP44K1xfVVKx1HSuoF7RErqNXK3jgFwB4+GubrBmjMoVqeyuhRbCEAYxyKfqqTn9NtOdYCJAARGpuLFeRupw3cY/1j6R7yZf4iAKvHqnzJFjcK1IW9DKZ/N9dRcm7hixYq3qMFrpy7J83Q6ZBdmF7o5AGqVUwLgdJDmqeHERRZHjZzsBHNVfcePAZCl3KJ8LOSapqHJikt1Dixds1daY3nuk1j8xhYc+a4QH7//F3eEQfvOvDcOL5o5c+bwVatWfUbtxV5r16799+zZszeR8HyUbKLFfK3+HrvQHyYOiAtUyy7ErUXuzHEsMZ3yUCoVl91uxUM6waGzC0pyITe1l+m+BMAbcyL1RV1obrNj3qL1yB6Xg91fb0P22IeRt+Rl/Gvd++5hA8PWDkx59MO8vLzNoaGh/bZu3bpn0qRJ+bQUZU+co9l+s0GsoJZpFsnCvnnFBUlG+oOLxssUEt/Sby11Ju+lK7OQFN9+73MOYCqOXbRo0cOLFy8ew89YEYmJiZvKaFAz4cyXX365mjTfh5QglpeXXzQYDKJWq22mK9X0aLkpF/IX4pZ+CwKlXMQRo4ylM/d6tuClS5eMdIR9njVMR9j7Z8yYseHqPYgoLJQvkul+FQGwXdFgD1noloT2/1jONUzFA2kOoRlKs4YmJ6dGmhE0ExkkTbaWnWYzzQs0z3gAWH0AMseOjd2/a1fVbRPwegvJMcMdMQbRyyNkG125B8uC6T33uZHMOYUDiDXeQrNeut4MC11Prht6Lkc+C0ftAqnC4MTE/UUWlmOK7/Nzb/ww6zB1sjW4Te3brscsdEMC/h9f/sUD+B/ositbU0UStwAAAABJRU5ErkJggg=='

class UDblockUDPiPlusV2 {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "udblockUDPiPlusV2",
            name: "UDPi+开发板 V2",
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
                        GESTURE: {
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
                    arguments: {
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
                    arguments: {
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
                    arguments: {
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
                    arguments: {
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
                    arguments: {
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 - 20, // * 16
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
                    arguments: {
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 - 20, // * 16
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
                    arguments: {
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 - 20, // * 16
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
                    arguments: {
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 - 20, // * 16
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
                    arguments: {
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2, // * 16
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 - 20, // * 16
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 + 20, // * 16
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 + 20, // * 16
                        },
                        X3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 - 20, // * 16
                        },
                        Y3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 + 20, // * 16
                        },

                    }
                },
                {
                    opcode: 'displayDrawTriangleFill',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画实心三角形 坐标 X1:[X1] Y1:[Y1]\nX2:[X2] Y2:[Y2]\nX3:[X3] Y3:[Y3]',
                    arguments: {
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2, // * 16
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 - 20, // * 16
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 + 20, // * 16
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 + 20, // * 16
                        },
                        X3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 - 20, // * 16
                        },
                        Y3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 + 20, // * 16
                        },

                    }
                },
                {
                    opcode: 'displayDrawCircle',
                    blockType: BlockType.COMMAND,
                    text: '屏幕画圆形 坐标 X:[SX] Y:[SY] 半径:[R]',
                    arguments: {
                        SX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 128 / 2 - 20, // * 16
                        },
                        SY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 64 / 2 - 20, // * 16
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
                    arguments: {
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
                }
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
                }
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

module.exports = UDblockUDPiPlusV2;