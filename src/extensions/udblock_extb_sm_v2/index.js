const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_sm } = require('../../util/extb-definitions');


// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockEXTBSMV2 {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            sensorBlocks,
            actionBlocks(),
            cameraBlocks,
        )
    }

    getInfo() {
        return {
            id: "udblockEXTBSMV2",
            name: "电机拓展板V2",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_sm'),
                motorMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_sm.motor_v2[0].value.join(",")},
                        {text:"二", value:EXTB_LIST.extb_sm.motor_v2[1].value.join(",")},
                        {text:"三", value:EXTB_LIST.extb_sm.motor_v2[2].value.join(",")},
                        {text:"四", value:EXTB_LIST.extb_sm.motor_v2[3].value.join(",")},
                    ]
                },
                servoMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_sm.servo_v2[0].value},
                        {text:"二", value:EXTB_LIST.extb_sm.servo_v2[1].value},
                        {text:"三", value:EXTB_LIST.extb_sm.servo_v2[2].value},
                        {text:"四", value:EXTB_LIST.extb_sm.servo_v2[3].value},
                    ]
                },
                ...miscMenuBlocks
            }
        }
    }
}

module.exports = UDblockEXTBSMV2;