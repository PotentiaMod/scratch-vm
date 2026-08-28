const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

// 方块图标链接
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';


class UDblockMQTT {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "udblockUtils",
            name: "UDBlock工具类",
            blockIconURI: blockIconURI,
            blocks: [
                {
                    type: "custom_seperator",
                    text: '★ I2C控制器',
                },
                {
                    opcode: 'getI2CFromMem',
                    blockType: BlockType.REPORTER,
                    text: '从[PERI]的[ADDR]地址获取[NUM]个字节',
                    arguments: {
                        PERI:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "42"
                        },
                        ADDR:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "8"
                        },
                        NUM:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "1"
                        },
                        
                    }
                },
                {
                    opcode: 'getI2CFromAddr',
                    blockType: BlockType.REPORTER,
                    text: '从[ADDR]地址获取[NUM]个字节',
                    arguments: {
                        ADDR:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "8"
                        },
                        NUM:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "1"
                        },
                        
                    }
                },
                {
                    opcode: 'writeI2CAddr',
                    blockType: BlockType.REPORTER,
                    text: '向[ADDR]地址写入[CONTENT]',
                    arguments: {
                        ADDR:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "8"
                        },
                        CONTENT:{
                            type: ArgumentType.STRING,
                            defaultValue: "0x01"
                        },
                        
                    }
                },
                {
                    opcode: 'writeI2CToMem',
                    blockType: BlockType.COMMAND,
                    text: '向[ADDR]地址写入[NUM]个字节内容[CONTENT]',
                    arguments: {
                        ADDR:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "8"
                        },
                        NUM:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "1"
                        },
                        CONTENT:{
                            type: ArgumentType.STRING,
                            defaultValue: "0x01"
                        },
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ MQTT',
                },
                {
                    opcode: 'initMQTT',
                    blockType: BlockType.COMMAND,
                    text: '初始化MQTT客户端 ID:[ID] 地址:[SERVER]:[PORT] 用户名[USER] 密码[PASSWD]',
                    arguments: {
                        ID:{
                            type: ArgumentType.STRING,
                            defaultValue: "udblockclient-"+String(new Date().getTime())
                        },
                        SERVER:{
                            type: ArgumentType.STRING,
                            defaultValue: "127.0.0.1"
                        },
                        PORT:{
                            type: ArgumentType.STRING,
                            defaultValue: "1883"
                        },
                        USER:{
                            type: ArgumentType.STRING,
                            defaultValue: "testuser"
                        },
                        PASSWD:{
                            type: ArgumentType.STRING,
                            defaultValue: "testuser123"
                        },
                    }
                },
                {
                    opcode: 'connectMQTT',
                    blockType: BlockType.COMMAND,
                    text: '连接到MQTT服务器',
                },
                {
                    opcode: 'disconnectMQTT',
                    blockType: BlockType.COMMAND,
                    text: '取消连接到MQTT服务器',
                },
                {
                    opcode: 'publishMQTT',
                    blockType: BlockType.COMMAND,
                    text: 'MQTT发布话题[TOPIC]内容[MSG]QOS[QOS]',
                    arguments: {
                        TOPIC:{
                            type: ArgumentType.STRING,
                            defaultValue: "ping"
                        },
                        MSG:{
                            type: ArgumentType.STRING,
                            defaultValue: "pong"
                        },
                        QOS:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },
                {
                    opcode: 'subscribeMQTT',
                    blockType: BlockType.COMMAND,
                    text: 'MQTT订阅话题[TOPIC]QOS:[QOS]',
                    arguments: {
                        TOPIC:{
                            type: ArgumentType.STRING,
                            defaultValue: "ping"
                        },
                        QOS:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "0"
                        }
                    }
                },
                {
                    opcode: 'checkMQTT',
                    blockType: BlockType.COMMAND,
                    text: '检查MQTT消息',
                },
                {
                    opcode: 'waitMQTT',
                    blockType: BlockType.COMMAND,
                    text: '等待接收MQTT消息',
                },
                {
                    opcode: 'setcallbackMQTT',
                    blockType: BlockType.LOOP,
                    text: '当MQTT接收到消息',
                },
                {
                    opcode: 'mqttValueTopic',
                    blockType: BlockType.REPORTER,
                    text: '当前MQTT话题',
                },
                {
                    opcode: 'mqttValueMsg',
                    blockType: BlockType.REPORTER,
                    text: '当前MQTT消息',
                },
                {
                    type: "custom_seperator",
                    text: '★ JSON',
                },
                {
                    opcode: 'jsonInitObj',
                    blockType: BlockType.COMMAND,
                    text: 'JSON初始化对象[NAME]',
                    arguments: {
                        NAME:{
                            type: ArgumentType.STRING,
                            defaultValue: "data"
                        }
                    }
                },
                {
                    opcode: 'jsonSetItem',
                    blockType: BlockType.COMMAND,
                    text: 'JSON设置对象[NAME]的第[INDEX]项为[VALUE]',
                    arguments: {
                        NAME:{
                            type: ArgumentType.STRING,
                            defaultValue: "data"
                        },
                        INDEX:{
                            type: ArgumentType.STRING,
                            defaultValue: "'temperature'"
                        },
                        VALUE:{
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'jsonLoads',
                    blockType: BlockType.REPORTER,
                    text: 'JSON解析字符串[STR]为对象',
                    arguments: {
                        STR:{
                            type: ArgumentType.STRING,
                            defaultValue: '{"x": 1, "y": 2}'
                        }
                    }
                },
                {
                    opcode: 'jsonDumps',
                    blockType: BlockType.REPORTER,
                    text: 'JSON文本化对象[OBJ]',
                    arguments: {
                        OBJ:{
                            type: ArgumentType.STRING,
                            defaultValue: "data"
                        }
                    }
                },
                {
                    opcode: 'jsonGetIndex',
                    blockType: BlockType.REPORTER,
                    text: 'JSON对象[NAME]的第[INDEX]项',
                    arguments: {
                        NAME:{
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        },
                        INDEX:{
                            type: ArgumentType.STRING,
                            defaultValue: '\'tempureture\''
                        }
                    }
                },
                {
                    opcode: 'jsonDecodeUTF8',
                    blockType: BlockType.REPORTER,
                    text: 'JSON对象[NAME]解码为通用文本格式',
                    arguments: {
                        NAME:{
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        }
                    }
                },
                {
                    opcode: 'jsonEncodeUTF8',
                    blockType: BlockType.REPORTER,
                    text: 'JSON对象[NAME]编码为通用文本格式',
                    arguments: {
                        NAME:{
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        }
                    }
                },
                {
                    opcode: 'diyLine',
                    blockType: BlockType.REPORTER,
                    text: '自定义字段[TEXT]',
                    arguments: {
                        TEXT:{
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ 线程',
                },
                {
                    opcode: 'create_thread',
                    blockType: BlockType.LOOP,
                    text: '启动线程 名称[NAME]',
                    arguments: {
                        NAME:{
                            type: ArgumentType.STRING,
                            defaultValue: 'thread_1'
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ ▶ HTTP请求',
                },
                {
                    opcode: 'urequestsAddItemMap',
                    blockType: BlockType.COMMAND,
                    text: '创建数据对象[NAME]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        }
                    }
                },
                {
                    opcode: 'urequestsSetItem',
                    blockType: BlockType.COMMAND,
                    text: '设置数据对象[NAME]的[KEY]为[VALUE]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'number'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '6'
                        }
                    }
                },
                {
                    opcode: 'urequestsDelItem',
                    blockType: BlockType.COMMAND,
                    text: '删除数据对象[NAME]的[KEY]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'number'
                        }
                    }
                },
                {
                    opcode: 'urequestsPostItem',
                    blockType: BlockType.COMMAND,
                    text: 'POST数据对象[NAME]到地址[ADDR]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        },
                        ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'urequestsGetItem',
                    blockType: BlockType.COMMAND,
                    text: 'GET地址[ADDR]',
                    arguments: {
                        ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'urequestsGetItemText',
                    blockType: BlockType.REPORTER,
                    text: 'GET地址[ADDR]获取结果文本',
                    arguments: {
                        ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'urequestsGetItemJSON',
                    blockType: BlockType.REPORTER,
                    text: 'GET地址[ADDR]获取结果JSON对象',
                    arguments: {
                        ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                }
            ],
            menus: {

            }
        }
    }
}

module.exports = UDblockMQTT;