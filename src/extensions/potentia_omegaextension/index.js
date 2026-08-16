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

class POTOmega {
	static get SAY_OR_THINK () {
            return 'SAY';
        }
  getInfo() {
    return {
      id: 'omegaex', // change this if you make an actual extension!
      name: 'Omega Extension',
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
          opcode: 'wait',
          text: 'wait [TIME] seconds',
          blockType: BlockType.COMMAND,
          arguments: {
            TIME: {
              type: ArgumentType.NUMBER,
              defaultValue: 1
            }
          }
        },
		{
          opcode: 'waitmin',
          text: 'wait [TIME] minutes',
          blockType: BlockType.COMMAND,
          arguments: {
            TIME: {
              type: ArgumentType.NUMBER,
              defaultValue: 1
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
      ]
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
        return "Dave";
    }
	the() {
        return "the";
    }
	magical() {
        return "Magical";
    }
	cheese() {
        return "Cheese";
    }
	wizard() {
        return "Wizard";
    }
	
	strictlyEquals(args) {
    return args.ONE === args.TWO;
  }
	
	randomBoolean() {
        return Math.round(Math.random()) === 1;
    }
	
	  wait (args) {
    return new Promise((resolve, reject) => {
      const timeInMilliseconds = args.TIME * 1000;
      setTimeout(() => {
        resolve();
      }, timeInMilliseconds);
    });
  }
  
  waitmin (args) {
    return new Promise((resolve, reject) => {
      const timeInMilliseconds = args.TIME * 60000;
      setTimeout(() => {
        resolve();
      }, timeInMilliseconds);
    });
  }
	
 /// 
  
}
module.exports = POTOmega;

