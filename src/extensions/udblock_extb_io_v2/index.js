const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const carBlocks = require('../../myBlocks/car');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_io } = require('../../util/extb-definitions');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockEXTBIOV2 {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            sensorBlocks,
            actionBlocks(false,false),
            cameraBlocks
        )
    }

    getInfo() {
        return {
            id: "udblockEXTBIOV2",
            name: "IO拓展板V2",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_io'),
                ...miscMenuBlocks
            }
        }
    }
}

module.exports = UDblockEXTBIOV2;