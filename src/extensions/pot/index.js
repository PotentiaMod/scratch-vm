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
				//stolen from CattyMod
               {
                    opcode: 'getColorTheme',
                    text: formatMessage({
                        id: 'tw.blocks.getColorTheme',
                        default: 'Get Accent Theme',
                        description: 'Block that returns the current color theme'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getGUITheme',
                    text: formatMessage({
                        id: 'tw.blocks.getGUITheme',
                        default: 'Get GUI Theme',
                        description: 'Block that returns the current GUI theme'
                    }),
                    blockType: BlockType.REPORTER
                },
				{
                    opcode: 'getBlockTheme',
                    text: formatMessage({
                        id: 'tw.blocks.getBlockTheme',
                        default: 'Get Block Theme',
                        description: 'Block that returns the current Block theme'
                    }),
                    blockType: BlockType.REPORTER
                }
            ],

            menus: {}
        };
    }
	
	getAllKeysPressed (args, util) {
        return util.ioQuery('keyboard', 'getAllKeysPressed');
    }
	
	getColorTheme () {
        const storedTheme = localStorage.getItem('tw:theme');

        // If tw:theme does not exist, default to Indigo.
        if (storedTheme === null) {
            return 'Indigo';
        }
		
        const theme = storedTheme.toLowerCase();

        if (theme.includes('indigo')) return 'Indigo';
        if (theme.includes('magenta')) return 'Magenta';
        if (theme.includes('pink')) return 'Pink';
        if (theme.includes('orange')) return 'Orange';
        if (theme.includes('yellow')) return 'Yellow';
        if (theme.includes('green')) return 'Green';
        if (theme.includes('dark-green')) return 'Dark Green';
        if (theme.includes('red')) return 'Red';
        if (theme.includes('purple')) return 'Purple';
        if (theme.includes('blue')) return 'Blue';
        if (theme.includes('cyan')) return 'Cyan';
        if (theme.includes('lime')) return 'Lime';
        if (theme.includes('magenta-purple')) return 'Fuchsia';
        if (theme.includes('indigo-blue')) return 'Serene Blue';
        if (theme.includes('corrupted-blue')) return 'Corrupted Blue';
        if (theme.includes('gaia-blue')) return 'Gaia Blue';
        if (theme.includes('cottoncandy')) return 'Cotton Candy';
        if (theme.includes('omnimax-blue')) return 'OmniMax Blue';
        if (theme.includes('hotfuse')) return 'Hot Fuse';
        if (theme.includes('nitrofire')) return 'Nitro Fire';
        if (theme.includes('nebula')) return 'Nebula';
        if (theme.includes('cosmic')) return 'Cosmic';
        if (theme.includes('aurora')) return 'Aurora';
        if (theme.includes('mint')) return 'Mint';
        if (theme.includes('rainbow')) return 'Rainbow';
        if (theme.includes('custom')) return 'Custom';

        // Unknown or missing color = Indigo.
        return 'Indigo';
    }

    getGUITheme () {
        const storedTheme = localStorage.getItem('tw:theme');

        // If tw:theme does not exist, use the system theme.
        if (storedTheme === null) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ?
                'Dark' :
                'Light';
        }

        const theme = storedTheme.toLowerCase();
		
        if (theme.includes('high-contrast')) return 'High Contrast';
        if (theme.includes('amp-amoled')) return 'AmpMod Amoled';
        if (theme.includes('amoled')) return 'Amoled';
        if (theme.includes('catty-midnight')) return 'Catty Midnight';
        if (theme.includes('midnight')) return 'Midnight';
        if (theme.includes('deep-dark')) return 'AstraEditor Dark';
        if (theme.includes('genesisdark')) return 'Genesis Dark';
        if (theme.includes('modern-dark')) return 'PotentiaMod Dark';
        if (theme.includes('amp-dark')) return 'AmpMod Dark';
        if (theme.includes('dark')) return 'Dark';
        if (theme.includes('modern-white')) return 'AstraEditor Light';
        if (theme.includes('genesislight')) return 'Genesis Light';
        if (theme.includes('amp-light')) return 'AmpMod Light';
        if (theme.includes('modern-light')) return 'PotentiaMod Light';
        if (theme.includes('light')) return 'Light';

        // If no GUI theme is specified, default to Light.
        return 'Light';
    }
	
	getBlockTheme () {
        const storedTheme = localStorage.getItem('tw:theme');

      // If tw:theme does not exist, default to Original.
        if (storedTheme === null) {
            return 'Original';
        }

        const theme = storedTheme.toLowerCase();
		
        if (theme.includes('colorful')) return 'Colorful';
        if (theme.includes('high-contrast')) return 'High Contrast';
        if (theme.includes('dark')) return 'Dark (Beta)';
        if (theme.includes('three')) return 'Original';

        // If no Block theme is specified, default to Original.
        return 'Original';
    }
}

module.exports = PotetentiaModExtraBlocks;