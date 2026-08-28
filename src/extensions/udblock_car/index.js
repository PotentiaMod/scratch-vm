const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions')
const { extb_car } = require ('../../../src/util/extb-definitions');

// 方块引用
const carBlocks = require('../../myBlocks/car')
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockCar {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            carBlocks,
            cameraBlocks,
            sensorBlocks,
            actionBlocks(false,false)
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
        for (i in extb_car.RJ11) {
            var yellowPin = extb_car.RJ11[i].value[0];
            var bluePin = extb_car.RJ11[i].value[1];
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
            id: "udblockEXTBCar",
            name: "小车拓展板",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_car'),
                servoMenu: {
                    acceptReporters: true,
                    items: [{text: "一",value: "0x01"},{text: "二",value: "0x02"},{text: "三",value: "0x03"},{text: "四",value: "0x04"},]
                },
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
                
            }
        }
    }
}

module.exports = UDblockCar;