//This is only available on live testing and therefore not being used in real projects.

const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const BlockShape = require('../../extension-support/block-shape');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

const Swal = require('sweetalert2');

class POTOmega {
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
	
	randomBoolean() {
        return Math.round(Math.random()) === 1;
    }
	
 /// 
  
}
module.exports = POTOmega;

