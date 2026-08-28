const BlockType = require("../extension-support/block-type")
const ArgumentType = require("../extension-support/argument-type")

const cameraBlocks = [
    {
        type: "custom_seperator",
        text: '★ 摄像头',
    },
    {
        opcode: 'initCamera',
        blockType: BlockType.COMMAND,
        text: '摄像头打开端口[PORT]',
        arguments: {
            PORT: {
                type: ArgumentType.STRING,
                menu: "RJMenu"
            },
        }
    },
    {
        opcode: 'resetCamera',
        blockType: BlockType.COMMAND,
        text: '重启摄像头'
    },
    {
        type: "custom_seperator",
        text: '★> 人脸识别',
    },
    {
        opcode: 'doFaceDectection',
        blockType: BlockType.COMMAND,
        text: '摄像头[ACTION]人脸识别',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
        }
    },
    {
        opcode: 'addFace',
        blockType: BlockType.COMMAND,
        text: '摄像头添加人脸[NAME]',
        arguments: {
            NAME: {
                type: ArgumentType.STRING,
                defaultValue: "steve"
            }
        }
    },
    {
        opcode: 'delFace',
        blockType: BlockType.COMMAND,
        text: '摄像头删除人脸[NAME]',
        arguments: {
            NAME: {
                type: ArgumentType.STRING,
                defaultValue: "steve"
            }
        }
    },
    {
        opcode: 'delAllFace',
        blockType: BlockType.COMMAND,
        text: '摄像头删除全部人脸',
        arguments: {
            NAME: {
                type: ArgumentType.STRING,
            }
        }
    },
    {
        opcode: 'getFaceDectectionResult',
        blockType: BlockType.REPORTER,
        text: '摄像头人脸识别结果',
    },
    {
        type: "custom_seperator",
        text: '★> 物体识别',
    },
    {
        opcode: 'doObjectDectection',
        blockType: BlockType.COMMAND,
        text: '摄像头[ACTION]物体识别',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
        }
    },
    {
        opcode: 'getObjectDectectionResult',
        blockType: BlockType.REPORTER,
        text: '摄像头物体识别结果',
    },
    // {
    //     opcode: 'doModeObjectDectection',
    //     blockType: BlockType.COMMAND,
    //     text: '摄像头[ACTION]自学习',
    //     arguments: {
    //         ACTION: {
    //             type: ArgumentType.STRING,
    //             menu: "actions"
    //         },
    //     }
    // },
    {
        type: "custom_seperator",
        text: '★> 颜色识别',
    },
    {
        opcode: 'doColorDectection',
        blockType: BlockType.COMMAND,
        text: '[ACTION]颜色识别到[COLOR]',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
            COLOR: {
                type: ArgumentType.STRING,
                menu: "color"
            }
        }
    },
    {
        opcode: 'doColorDectectionMannual',
        blockType: BlockType.COMMAND,
        text: '[ACTION]颜色识别阈值[COLOR]',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
            COLOR: {
                type: ArgumentType.STRING,
                defaultValue: "(0,80,-70,-10,-0,30)"
            }
        }
    },
    {
        opcode: 'getColorDectectionResult',
        blockType: BlockType.REPORTER,
        text: '摄像头颜色识别结果[RESULT]',
        arguments: {
            RESULT: {
                type: ArgumentType.STRING,
                menu: "colorResult"
            }
        }
    },
    
    // {
    //     type: "custom_seperator",
    //     text: '★> AI颜色识别',
    // },
    // {
    //     opcode: 'doAIColorDectection',
    //     blockType: BlockType.COMMAND,
    //     text: '[ACTION]AI颜色识别',
    //     arguments: {
    //         ACTION: {
    //             type: ArgumentType.STRING,
    //             menu: "actions"
    //         }
    //     }
    // },
    
    // {
    //     opcode: 'getAIColorDectectionResultShape',
    //     blockType: BlockType.REPORTER,
    //     text: 'AI颜色识别结果形状',
    // },

    {
        type: "custom_seperator",
        text: '★> AI自学习物体识别',
    },
    {
        opcode: 'doAIModeDectection',
        blockType: BlockType.COMMAND,
        text: '[ACTION]自学习物体识别',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            }
        }
    },
    {
        opcode: 'getAIColorDectectionResultColor',
        blockType: BlockType.REPORTER,
        text: 'AI颜色识别结果颜色',
    },
    {
        opcode: 'doAILoadModeDectection',
        blockType: BlockType.COMMAND,
        text: '[ACTION]加载已学习物体识别[NAME]',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
            NAME: {
                type: ArgumentType.STRING,
                defaultValue: "餐具"
            }
        }
    },
    {
        opcode: 'doAISaveModeDectection',
        blockType: BlockType.COMMAND,
        text: '保存自学习物体识别到名称[NAME]',
        arguments: {
            NAME: {
                type: ArgumentType.STRING,
                defaultValue: "餐具"
            }
        }
    },
    {
        opcode: 'getAIModeDetectionResult',
        blockType: BlockType.REPORTER,
        text: '摄像头获取自学习物体识别结果',
    },
    {
        opcode: 'doImageDectection',
        blockType: BlockType.COMMAND,
        text: '摄像头[ACTION][IMGMETHOD]',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
            IMGMETHOD: {
                type: ArgumentType.STRING,
                menu: "imageMethods"
            }
        }
    },
    {
        type: "custom_seperator",
        text: '★> 二维码识别',
    },
    {
        opcode: 'doQrcodeDectection',
        blockType: BlockType.COMMAND,
        text: '摄像头[ACTION]二维码识别',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
        }
    },
    {
        opcode: 'getQrcodeString',
        blockType: BlockType.REPORTER,
        text: '摄像头二维码识别结果',
    },
    {
        type: "custom_seperator",
        text: '★> 口罩识别',
    },
    {
        opcode: 'doMaskDectection',
        blockType: BlockType.COMMAND,
        text: '摄像头[ACTION]口罩识别',
        arguments: {
            ACTION: {
                type: ArgumentType.STRING,
                menu: "actions"
            },
        }
    },
    {
        opcode: 'getMaskResult',
        blockType: BlockType.BOOLEAN,
        text: '识别到口罩',
    },
    {
        opcode: 'switchMode',
        blockType: BlockType.COMMAND,
        text: '摄像头切换模式[MODE]',
        arguments: {
            MODE: {
                type: ArgumentType.STRING,
                defaultValue: "01",
                menu: "faceModes"
            }
        }
    },
]

module.exports = cameraBlocks;