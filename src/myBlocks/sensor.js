const BlockType = require("../extension-support/block-type")
const ArgumentType = require("../extension-support/argument-type")

const sensorBlocks = [
    {
        type: "custom_seperator",
        text: '★ 传感器',
    },
    {
        type: "custom_seperator",
        text: '★> NFC传感器',
    },
    // {
    //     opcode: 'initNFC',
    //     blockType: BlockType.COMMAND,
    //     text: '初始化NFC传感器',
    // },
    {
        opcode: 'startPolling',
        blockType: BlockType.COMMAND,
        text: '启动NFC传感器',
    },
    {
        opcode: 'stopPolling',
        blockType: BlockType.COMMAND,
        text: '停止NFC传感器',
    },
    {
        opcode: 'getUID',
        blockType: BlockType.REPORTER,
        text: 'NFC卡号',
    },
    {
        opcode: 'readText',
        blockType: BlockType.REPORTER,
        text: '读取NFC卡内容',
    },
    {
        opcode: 'writeText',
        blockType: BlockType.COMMAND,
        text: '写入NFC卡内容[TEXT]',
        arguments: {
            TEXT: {
                type: ArgumentType.STRING,
                defaultValue: "door"
            }
        }
    },
    {
        type: "custom_seperator",
        text: '★> 基础传感器',
    },
    {
        opcode: 'readRainDropSensor',
        blockType: BlockType.REPORTER,
        text: '雨滴传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJDigiMenu"
            }
        }
    },
    {
        opcode: 'readSoundSensor',
        blockType: BlockType.REPORTER,
        text: '声音传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'readSmartGrayscaleSensor',
        blockType: BlockType.REPORTER,
        text: '智能灰度传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'getColorSensor',
        blockType: BlockType.REPORTER,
        text: '获取颜色识别传感器数值[COLOR]',
        arguments: {
            COLOR: {
                type: ArgumentType.STRING,
                menu: "colorRGBMenu"
            }
        }
    },
    {
        opcode: 'detectColorSensorColor',
        blockType: BlockType.REPORTER,
        text: '颜色识别传感器[COLOR]',
        arguments: {
            COLOR: {
                type: ArgumentType.STRING,
                menu: "colorDetectResultMenu"
            }
        }
    },
    {
        opcode: 'readAmbientLightSensor',
        blockType: BlockType.REPORTER,
        text: '环境光传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'readSonicSensor',
        blockType: BlockType.REPORTER,
        text: '超声波传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJMenu"
            }
        }
    },
    {
        opcode: 'readRouteFindingSensor',
        blockType: BlockType.REPORTER,
        text: '巡线传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenuFull" // 修改
            }
        }
    },
    {
        opcode: 'readFlameSensor',
        blockType: BlockType.BOOLEAN,
        text: '火焰传感器数字[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJDigiMenu"
            }
        }
    },
    {
        opcode: 'readFlameSensoADC',
        blockType: BlockType.REPORTER,
        text: '火焰传感器模拟[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'readGrayScaleSensor',
        blockType: BlockType.REPORTER,
        text: '模拟灰度传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'readSmokeSensor',
        blockType: BlockType.REPORTER,
        text: '烟雾传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'readWindSensor',
        blockType: BlockType.REPORTER,
        text: '风速传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'readDirtHumiditySensor',
        blockType: BlockType.REPORTER,
        text: '土壤湿度传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJADCMenu"
            }
        }
    },
    {
        opcode: 'readDSTempSensor',
        blockType: BlockType.REPORTER,
        text: '防水温度传感器[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJMenu"
            }
        }
    },
    {
        opcode: 'readDHT11Temp',
        blockType: BlockType.REPORTER,
        text: '获取DHT11温度[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJMenu"
            }
        }
    },
    {
        opcode: 'readDHT11Humidity',
        blockType: BlockType.REPORTER,
        text: '获取DHT11湿度[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJMenu"
            }
        }
    },
    {
        opcode: 'readFourChannelInferredSensor',
        blockType: BlockType.BOOLEAN,
        text: '四路红外传感器检测到[STATUS]',
        arguments: {
            STATUS: {
                type: ArgumentType.STRING,
                menu: "FourInferredMap"
            }
        }
    },
    {
        opcode: 'readFourChannelInferredSensorOffset',
        blockType: BlockType.REPORTER,
        text: '获取四路红外传感器中心偏移量',
    },
    {
        opcode: 'readFourChannelInferredSensorDirectionRight',
        blockType: BlockType.BOOLEAN,
        text: '四路红外传感器检测黑线偏右',
    },
    {
        opcode: 'readFourChannelInferredSensorDirectionLeft',
        blockType: BlockType.BOOLEAN,
        text: '四路红外传感器检测黑线偏左',
    },
    {
        opcode: 'readKeyboardModuleValue',
        blockType: BlockType.REPORTER,
        text: '获取按键模块数值'
    }
]

module.exports = sensorBlocks;