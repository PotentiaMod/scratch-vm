const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions')
const { extb_car_pro } = require ('../../util/extb-definitions');

// 方块引用
const carProBlocks = require('../../myBlocks/car_pro')
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,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';

class UDblockCarPro {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            carProBlocks,
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
        for (i in extb_car_pro.RJ11) {
            var yellowPin = extb_car_pro.RJ11[i].value[0];
            var bluePin = extb_car_pro.RJ11[i].value[1];
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
            id: "udblockEXTBCarPro",
            name: "小车拓展板Pro",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_car_pro'),
                servoMenu: {
                    acceptReporters: true,
                    items: [{text: "一",value: "0x01"},{text: "二",value: "0x02"},{text: "三",value: "0x03"},{text: "四",value: "0x04"}]
                },
                axisMenu: {
                    acceptReporters: true,
                    items: [{text: "前后",value: "x"},{text: "左右",value: "y"}]
                },
                dataTypeMenu: {
                    acceptReporters: true,
                    items: [{text: "距离", value: "0"},{text: "速度", value: "1"},{text: "加速度", value: "2"}]
                },
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
                
            }
        }
    }
}

module.exports = UDblockCarPro;