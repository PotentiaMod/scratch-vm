//This is only available on live testing and therefore not being used in real projects.

const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const BlockShape = require('../../extension-support/block-shape');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

const Swal = require('sweetalert2');
const axios = require('axios').default;

//Why ClipCC!?
const config = {
    baseURL: 'https://data.codingclip.com/',
    timeout: 10000
};

MW_API_URL = 'https://mwapi.mistium.com'
MW_PORT = 5627

class POTTest {
	constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }
	
	static get SAY_OR_THINK () {
            return 'SAY';
        }
  getInfo() {
    return {
      id: 'test', // change this if you make an actual extension!
      name: 'Test Extension',
      color1: '#784CD1',
      color2: '#5F34B5',
      color3: '#490FA6',
      blocks: [
	  ///
        {
          opcode: 'hello',
          blockType: BlockType.COMMAND,
          text: 'Hello, World!'
        },
		{
         opcode: 'logToConsole',
         blockType: BlockType.COMMAND,
         text: 'log to console'
        },
		{
          opcode: 'daysSincePokemonScarletViolet',
          blockType: BlockType.REPORTER,
          text: 'Days since Pokémon Scarlet and Violet',
		  disableMonitor: true //This also shows up in the PotentiaMod Stuff extension.
           },
		{
         opcode: 'testReporter',
         text: 'testing!',
         blockType: BlockType.REPORTER,
         blockShape: BlockShape.HEXAGONAL,
         disableMonitor: true,
         allowDropAnywhere: true
         },
	    {
         opcode: 'dave',
         blockType: BlockType.REPORTER,
         blockShape: BlockShape.SQUARE,
		 disableMonitor: true,
         text: 'Dave'
        },		 
	    {
         opcode: 'the',
         blockType: BlockType.REPORTER,
         blockShape: BlockShape.SQUARE,
		 disableMonitor: true,
         text: 'The'
        },		 
	    {
         opcode: 'magical',
         blockType: BlockType.REPORTER,
         blockShape: BlockShape.SQUARE,
		 disableMonitor: true,
         text: 'Magical'
        },		 
	    {
         opcode: 'cheese',
         blockType: BlockType.REPORTER,
         blockShape: BlockShape.SQUARE,
		 disableMonitor: true,
         text: 'Cheese'
        },		 
	    {
         opcode: 'wizard',
         blockType: BlockType.REPORTER,
         blockShape: BlockShape.SQUARE,
		 disableMonitor: true,
         text: 'Wizard'
        },
		{
         opcode: 'labeltest',
         blockType: BlockType.REPORTER,
		 disableMonitor: false,
         text: 'Look! A label!'
        },
		{
         opcode: 'labeltest2',
         blockType: BlockType.REPORTER,
		 disableMonitor: false,
         text: 'There\'s a label for [TYPE]!',
		 labelFn: "labeltestLabel",
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'labeltestMenu',
                        }
                    }
        },
       {
          opcode: 'strictlyEquals',
          blockType: BlockType.BOOLEAN,
          text: '[ONE] strictly equals [TWO]',
          arguments: {
            ONE: {
              type: ArgumentType.STRING
            },
            TWO: {
              type: ArgumentType.STRING,
              defaultValue: 'Second value'
            }
          }
        },		
	    {
         opcode: 'removeExt',
         blockType: BlockType.COMMAND,
         text: 'Remove this extension'
        },
		///
      ],
	  ///menus
	  menus: {
                labeltestMenu: {
                    items: [
                        { text: "this block", value: "block" },
                        { text: "function", value: "function" },
                    ]
                }
            }
    };
  }
  
 /// 
  hello(args, util) {
    Swal.fire({
            titleText: 'It works!',
            text: 'Yippeee!',
            icon: 'success'
        });
  }
  
   removeExt(args) {
            try {
                vm.extensionManager.removeExtension('omegaex');
            } catch (e) {
                console.warn('Failed to remove:', e);
            }
        }
		
		logToConsole() {
      console.log('Hello world!');
    }
	
	testReporter() {
        return "Hello world!";
    }
	
	dave() {
    }
	the() {
    }
	magical() {
    }
	cheese() {
    }
	wizard() {
    }
	
	strictlyEquals(args) {
    return args.ONE === args.TWO;
  }
	
	randomBoolean() {
        return Math.round(Math.random()) === 1;
    }
	
	getPrimitives () {
        return {
            looks_setVertTransform: this.setVerticalTransform,
            looks_setHorizTransform: this.setHorizontalTransform
        };
    }
	
	setVerticalTransform (args, {target}) {
        const percent = Cast.toNumber(args.PERCENT);
        target.setTransform([percent, target.transform[1]]);
    }
	
	daysSincePokemonScarletViolet (args, util){
const msPerDay = 24 * 60 * 60 * 1000;
        const start = new Date(2022, 10, 18); // Months are 0-indexed.
        const today = new Date();
        const dstAdjust = today.getTimezoneOffset() - start.getTimezoneOffset();
        let mSecsSinceStart = today.valueOf() - start.valueOf();
        mSecsSinceStart += ((today.getTimezoneOffset() - dstAdjust) * 60 * 1000);
        return mSecsSinceStart / msPerDay;
      }

    setHorizontalTransform (args, {target}) {
        const percent = Cast.toNumber(args.PERCENT);
        target.setTransform([target.transform[0], percent]);
    }
	
labeltest() {
        return "(Insert test here)";
    }
labeltest2() {
        return "Take That, PenguinMod!";
    }
    labeltestLabel(params) {
        return params.TYPE === "block" ?
            "I took this block from PenguinMod!"
            : "You gotta activate functions, kid, not slap your keyboard like your blind uncle— what?";
    }
	
 /// 
  
}
module.exports = POTTest;

