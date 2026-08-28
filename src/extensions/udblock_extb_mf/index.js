const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const carBlocks = require('../../myBlocks/car');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_mf } = require ('../../../src/util/extb-definitions');
// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockEXTBMF {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [
            {
                type: "custom_seperator",
                text: '★ 触摸按键',
            },
            {
                opcode: 'readTouchValue',
                blockType: BlockType.REPORTER,
                text: '读取触摸按键[BTN]数值',
                arguments: {
                    BTN: {
                        type: ArgumentType.STRING,
                        menu: "touchMenu"
                    }
                }
            },
            {
                opcode: 'readTouchPressed',
                blockType: BlockType.BOOLEAN,
                text: '检测触摸按键[BTN]按下',
                arguments: {
                    BTN: {
                        type: ArgumentType.STRING,
                        menu: "touchMenu"
                    }
                }
            },
        ].concat(
            sensorBlocks,
            actionBlocks(),
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
        for (i in extb_mf.RJ11) {
            var yellowPin = extb_mf.RJ11[i].value[0];
            var bluePin = extb_mf.RJ11[i].value[1];
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
            id: "udblockEXTBMF",
            name: "多功能拓展板",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_mf'),
                touchMenu: {
                    acceptReporters: true,
                    items: EXTB_LIST.extb_mf.touch
                },
                servoMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_mf.servo[0].value.join(",")},
                        {text:"二", value:EXTB_LIST.extb_mf.servo[1].value.join(",")},
                        {text:"三", value:EXTB_LIST.extb_mf.servo[2].value.join(",")},
                        {text:"四", value:EXTB_LIST.extb_mf.servo[3].value.join(",")},
                    ]
                },
                motorMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_mf.motor[0].value.join(",")},
                        {text:"二", value:EXTB_LIST.extb_mf.motor[1].value.join(",")},
                    ]
                },
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
            }
        }
    }

    readTouchValue(){

    }
}

module.exports = UDblockEXTBMF;