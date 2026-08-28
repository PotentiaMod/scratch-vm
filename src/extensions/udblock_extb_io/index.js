const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const carBlocks = require('../../myBlocks/car');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_io } = require ('../../../src/util/extb-definitions');
// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'
class UDblockEXTBIO {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            sensorBlocks,
            actionBlocks(false,false),
            cameraBlocks
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
        for (i in extb_io.RJ11) {
            var yellowPin = extb_io.RJ11[i].value[0];
            var bluePin = extb_io.RJ11[i].value[1];
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
            id: "udblockEXTBIO",
            name: "IO拓展板",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_io'),
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
            }
        }
    }
}

module.exports = UDblockEXTBIO;