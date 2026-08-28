const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_sm } = require ('../../../src/util/extb-definitions');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockEXTBSM {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
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
        for (i in extb_sm.RJ11) {
            var yellowPin = extb_sm.RJ11[i].value[0];
            var bluePin = extb_sm.RJ11[i].value[1];
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
            id: "udblockEXTBSM",
            name: "电机拓展板",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_sm'),
                motorMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_sm.motor[0].value.join(",")},
                        {text:"二", value:EXTB_LIST.extb_sm.motor[1].value.join(",")},
                        {text:"三", value:EXTB_LIST.extb_sm.motor[2].value.join(",")},
                        {text:"四", value:EXTB_LIST.extb_sm.motor[3].value.join(",")},
                    ]
                },
                servoMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_sm.servo[0].value.join(",")},
                        {text:"二", value:EXTB_LIST.extb_sm.servo[1].value.join(",")},
                        {text:"三", value:EXTB_LIST.extb_sm.servo[2].value.join(",")},
                        {text:"四", value:EXTB_LIST.extb_sm.servo[3].value.join(",")},
                    ]
                },
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
            }
        }
    }
}

module.exports = UDblockEXTBSM;