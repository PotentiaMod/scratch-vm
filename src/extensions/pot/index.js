const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

// PotentiaMod icon
const iconURI = "https://potentiamod.github.io/images/512.png";

/**
 * Class for TurboWarp blocks
 * @constructor
 */
class PotetentiaModExtraBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'potentia',
            name: 'PotentiaMod Extra',
            color1: '#4800cc',
            color2: '#37009d',
            color3: '#5600f5',
            docsURI: 'https://potentiamod.github.io/docs/blocks',
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
				{
                    opcode: 'getAllKeysPressed',
                    text: 'get all keys pressed',
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {}
        };
    }
	
	getAllKeysPressed (args, util) {
        return util.ioQuery('keyboard', 'getAllKeysPressed');
    }
}

module.exports = PotetentiaModExtraBlocks;