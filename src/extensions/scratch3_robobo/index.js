// scratch-vm/src/extensions/scratch3_[YOUR_EXTENSION_NAME_HERE]/index.js
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Remote = require('./remote-library/remotelib');
const Runtime = require('../../engine/runtime');

/** para prueba */
const MathUtil = require('../../util/math-util');

class Scratch3Robobo {
    constructor(runtime) {
        this.runtime = runtime;
        this.onClap = false;
        this.extensionId = 'robobo';  // The ID you specified in scratch-gui  
        this.runtime.on('ROBOBO_CONNECT_BUTTON_CLICK', this.connect.bind(this));
        this.runtime.on('ROBOBO_DISCONNECT_BUTTON_CLICK', this.disconnect.bind(this));
    }
    getInfo() {
        return {
            id: this.extensionId,
            name: 'Robobo',
            blocks: [
                {
                    opcode: 'baseActuationTitle',
                    text: 'BASE ACTUATION BLOCKS',
                    blockType: BlockType.HAT,
                    arguments: {
                    }
                },
                {
                    opcode: 'stopMotors',
                    text: 'Stop [MOTOR] motors',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MOTOR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'all',
                            menu: 'stopmotorsmenu',
                        },
                    }
                },
                {
                    opcode: 'moveWheels',
                    text: 'Move wheels with speed R:[SPEEDR] L:[SPEEDL]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEEDR: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        },
                        SPEEDL: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        }
                    }
                },
                {
                    opcode: 'moveWheelsByTime',
                    text: 'Move wheels with speed R:[SPEEDR] L:[SPEEDL] for [TIME] seconds and wait: [WAIT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEEDR: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        },
                        SPEEDL: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        },
                        TIME: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        },
                        WAIT: {
                            type: ArgumentType.STRING,
                            menu: 'booleanmenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'moveWheelsByDegrees',
                    text: 'Move wheels [WHEELS] with speed [SPEED] by [DEGREES] degrees',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        WHEELS: {
                            type: ArgumentType.STRING,
                            menu: 'wheeldegreesmenu',
                            defaultValue: 'both'
                        },
                        SPEED: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        },
                        DEGREES: {
                            type: ArgumentType.STRING,
                            defaultValue: '180'
                        }
                    }
                },
                {
                    opcode: 'movePanTo',
                    text: 'Move pan to position [POSITION] with speed [SPEED] and wait [WAIT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        },
                        SPEED: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        },
                        WAIT: {
                            type: ArgumentType.STRING,
                            menu: 'booleanmenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'moveTiltTo',
                    text: 'Move tilt to position [POSITION] with speed [SPEED] and wait [WAIT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        POSITION: {
                            type: ArgumentType.STRING,
                            defaultValue: '90'
                        },
                        SPEED: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        },
                        WAIT: {
                            type: ArgumentType.STRING,
                            menu: 'booleanmenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'setLedColorTo',
                    text: 'Set led [LED] to color [COLOR]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LED: {
                            type: ArgumentType.STRING,
                            defaultValue: 'all',
                            menu: 'ledsmenu',
                        },
                        COLOR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'blue',
                            menu: 'colormenu',
                        }
                    }
                },
                '---',
                {
                    opcode: 'baseSensingTitle',
                    text: 'BASE SENSING BLOCKS',
                    blockType: BlockType.HAT,
                    arguments: {
                    }
                },
                {
                    opcode: 'readWheelPosition',
                    text: 'Read [WHEEL] wheel position',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        WHEEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'right',
                            menu: 'wheelmenu',
                        },
                        TIME: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        },

                        WAIT: {
                            type: ArgumentType.STRING,
                            menu: 'booleanmenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'readWheelSpeed',
                    text: 'Read [WHEEL] wheel speed',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        WHEEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'right',
                            menu: 'wheelmenu',
                        },

                    }
                },
                {
                    opcode: 'resetWheelEncoders',
                    text: 'Reset wheel encoders',
                    blockType: BlockType.COMMAND,

                },
                {
                    opcode: 'readPanPosition',
                    text: 'Read pan position',
                    blockType: BlockType.REPORTER,

                },
                {
                    opcode: 'readTiltPosition',
                    text: 'Read tilt position',
                    blockType: BlockType.REPORTER,

                },
                {
                    opcode: 'readIRSensor',
                    text: 'Read ir [SENSOR] sensor value',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        SENSOR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Front-C',
                            menu: 'irmenu',
                        },
                    }
                },
                '---',
                {
                    opcode: 'smartphoneActuationTitle',
                    text: 'SMARTPHONE ACTUATION BLOCKS',
                    blockType: BlockType.HAT,
                    arguments: {
                    }
                },
                {
                    opcode: 'setEmotionTo',
                    text: 'Set Robobo emotion to [EMOTION]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        EMOTION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'normal',
                            menu: 'emotionsmenu',
                        },

                    }
                },
                {
                    opcode: 'sayText',
                    text: 'Say [TEXT] and wait [WAIT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hola mundo'
                        },

                        WAIT: {
                            type: ArgumentType.STRING,
                            menu: 'booleanmenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'playSound',
                    text: 'Play [SOUND] sound',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            defaultValue: 'purr',
                            menu: 'soundmenu',
                        },
                    }
                },
                {
                    opcode: 'playNote',
                    text: 'Play note [NOTE] for [TIME] seconds and wait [WAIT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: '40'
                        },
                        TIME: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        },

                        WAIT: {
                            type: ArgumentType.STRING,
                            menu: 'booleanmenu',
                            defaultValue: 'true'
                        }
                    }
                },
                '---',
                {
                    opcode: 'smartphoneSensingTitle',
                    text: 'SMARTPHONE SENSING BLOCKS',
                    blockType: BlockType.HAT,
                    arguments: {
                    }
                },
                {
                    opcode: 'readBatteryLevel',
                    text: 'Read  [BATTERY] battery level',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BATTERY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'base',
                            menu: 'batterymenu',
                        },

                    }
                },
                {
                    opcode: 'readFaceSensor',
                    text: 'Read  face sensor [TYPE]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x',
                            menu: 'facemenu',
                        },
                    }
                },
                {
                    opcode: 'resetFaceSensor',
                    text: 'Reset face sensor',
                    blockType: BlockType.COMMAND,

                },
                {
                    opcode: 'readClapCounter',
                    text: 'Read  clap counter',
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'resetClapCounter',
                    text: 'Reset clap counter',
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'readLastNote',
                    text: 'Read  last note [TYPE] ',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'note',
                            menu: 'notemenu',
                        },
                    }
                },
                {
                    opcode: 'resetLastNote',
                    text: 'Reset last note',
                    blockType: BlockType.COMMAND,

                },

                {
                    opcode: 'readColorBlob',
                    text: 'Read  [COLOR] blob [TYPE]',
                    blockType: BlockType.REPORTER,
                    arguments: {

                        COLOR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'green',
                            menu: 'blobcolormenu',
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x',
                            menu: 'blobmenu',
                        },

                    }
                },
                {
                    opcode: 'resetColorBlobs',
                    text: 'Reset color blobs',
                    blockType: BlockType.COMMAND,

                },
                {
                    opcode: 'setColorBlobDetectionActive',
                    text: 'Set active blobs R:[RED], G:[GREEN], B:[BLUE], C:[CUSTOM]',
                    blockType: BlockType.COMMAND,
                    arguments: {

                        RED: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false',
                            menu: 'booleanmenu',
                        },
                        GREEN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'true',
                            menu: 'booleanmenu',
                        },
                        BLUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false',
                            menu: 'booleanmenu',
                        },
                        CUSTOM: {
                            type: ArgumentType.STRING,
                            defaultValue: 'false',
                            menu: 'booleanmenu',
                        },
                    }
                },
                {
                    opcode: 'readFlingSensor',
                    text: 'Read fling sensor',
                    blockType: BlockType.REPORTER,

                },
                {
                    opcode: 'resetFlingSensor',
                    text: 'Reset fling sensor',
                    blockType: BlockType.COMMAND,

                },
                {
                    opcode: 'readTapSensor',
                    text: 'Read  tap on [TYPE]',
                    blockType: BlockType.REPORTER,
                    arguments: {


                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x',
                            menu: 'tapmenu',
                        },
                    }
                },
                {
                    opcode: 'resetTapSensor',
                    text: 'Reset tap sensor',
                    blockType: BlockType.COMMAND,

                },
                {
                    opcode: 'readAccelerationSensor',
                    text: 'Read  acceleration on [TYPE] axis',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x',
                            menu: 'accelerationmenu',
                        },
                    }
                },
                {
                    opcode: 'readOrientationSensor',
                    text: 'Read  orientation on [TYPE] axis',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'yaw',
                            menu: 'orientationmenu',
                        },

                    }
                },
                {
                    opcode: 'readBrightnessSensor',
                    text: 'Read brightness sensor',
                    blockType: BlockType.REPORTER,

                },
                {
                    opcode: 'readQR',
                    text: 'Read  QR [TYPE]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'id',
                            menu: 'qrmenu',
                        },

                    }
                },
                {
                    opcode: 'resetQR',
                    text: 'Reset QR',
                    blockType: BlockType.COMMAND,

                },
                {
                    opcode: 'onClapDetected',
                    text: 'When clap is detected',
                    blockType: BlockType.HAT,
                },
                /*                
                                {
                                    opcode: 'onTalkEnded',
                                    text: 'When speech ends',
                                    blockType: BlockType.HAT,                   
                                },
                */
                {
                    opcode: 'onBlobDetected',
                    text: 'When a color blob is detected',
                    blockType: BlockType.HAT,
                },
                /*                
                                {
                                    opcode: 'onLowBaseBattDetected',
                                    text: 'When low base battery leve is detected',
                                    blockType: BlockType.HAT,                   
                                },
                                {
                                    opcode: 'onLowPhoneBattDetected',
                                    text: 'When low phone battery leve is detected',
                                    blockType: BlockType.HAT,                   
                                },
                */
                {
                    opcode: 'onLostFaceDetected',
                    text: 'When a face is lost',
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'onNewFaceDetected',
                    text: 'When a face is detected',
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'onTapDetected',
                    text: 'When a tap is detected',
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'onFlingDetected',
                    text: 'When a fling is detected',
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'onNoteDetected',
                    text: 'When a note is detected',
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'onQrDetected',
                    text: 'When a QR code is detected',
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'onQrAppear',
                    text: 'When a QR code appears',
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'onQrDisappear',
                    text: 'When a QR code disappears',
                    blockType: BlockType.HAT,
                },
            ],
            menus: {
                // Required: an identifier for this menu, unique within this extension.
                booleanmenu: [
                    'true', 'false'
                ],
                ledsmenu: [
                    'Front-C', 'Front-L', 'Front-LL', 'Front-R', 'Front-RR', 'Back-L', 'Back-R', 'all'
                ],
                colormenu: [
                    'off', 'white', 'red', 'blue', 'cyan', 'magenta', 'yellow', 'green', 'orange'
                ],
                emotionsmenu: [
                    'happy', 'laughing', 'surprised', 'sad', 'angry', 'normal', 'sleeping', 'tired', 'afraid'
                ],
                soundmenu: [
                    'moan', 'purr', "angry", "approve", "disapprove", "discomfort", "doubtful", "laugh", "likes", "mumble", "ouch", "thinking"
                ],
                stopmotorsmenu: [
                    'all', 'wheels', 'pan', 'tilt'
                ],
                wheelmenu: [
                    'right', 'left'
                ],
                wheeldegreesmenu: [
                    'both', 'left', 'right'
                ],
                irmenu: [
                    'Front-C', 'Front-L', 'Front-LL', 'Front-R', 'Front-RR', 'Back-C', 'Back-L', 'Back-R'
                ],
                batterymenu: [
                    'base', 'phone'
                ],
                facemenu: [
                    'x', 'y', 'size', 'distance'
                ],
                blobmenu: [
                    'x', 'y', 'area'
                ],
                notemenu: [
                    'note', 'duration'
                ],
                blobcolormenu: [
                    'red', 'green', 'blue', 'custom'
                ],
                tapmenu: [
                    'x', 'y', 'zone'
                ],
                accelerationmenu: [
                    'x', 'y', 'z'
                ],
                orientationmenu: [
                    'yaw', 'pitch', 'roll'
                ],
                qrmenu: [
                    'id', 'x', 'y', 'size'
                ]
            },
        };
    }
    exponent(args, util) {
        const { BASE, POWER } = args;
        return Math.pow(BASE, POWER);
    }

    /**
     * This method is executed when a connection click event is trigger 
     */
    connect(args, util) {
        this.ip = this.runtime.roboboIP;
        this.remote = new Remote(this.ip, '');

        return new Promise(resolve => {
            this.remote.registerCallback('onConnectionChanges', arg => {
                this.connectionState = arg;
                console.log('conection changed: ');
                console.log(arg);
                if (arg == 2) {
                    this.runtime.roboboConnectionStablished();
                } else {
                    this.runtime.roboboDisconnectButtonClick();
                }
                resolve();
            })
            this.remote.registerCallback('talkCallback', () => { this.talkEnded = true; });
            this.remote.registerCallback('onNewClap', () => { this.clapDetected = true; });
            this.remote.registerCallback('onNewBlob', () => { this.blobDetected = true; });
            this.remote.registerCallback('onLowBatt', () => { this.lowBaseBattDetected = true; });
            this.remote.registerCallback('onLowOboBatt', () => { this.lowPhoneBattDetected = true; });
            this.remote.registerCallback('onLostFace', () => { this.lostFaceDetected = true; });
            this.remote.registerCallback('onNewFace', () => { this.newFaceDetected = true; });
            this.remote.registerCallback('onFall', () => { this.fallDetected = true; });
            this.remote.registerCallback('onGap', () => { this.gapDetected = true; });
            this.remote.registerCallback('onNewTap', () => { this.tapDetected = true; });
            this.remote.registerCallback('onNewFling', () => { this.flingDetected = true; });
            this.remote.registerCallback('onError', () => { });
            this.remote.registerCallback('onPhrase', () => { });
            this.remote.registerCallback('onNewNote', () => { this.noteDetected = true; });
            this.remote.registerCallback('onQR', () => { this.qrDetected = true; });
            this.remote.registerCallback('onQRAppear', () => { this.qrAppear = true; });
            this.remote.registerCallback('onQRDisappear', () => { this.qrDisappear = true; });
            this.remote.connect();

            //Subscribes to "PROJECT_STOP_ALL" event (stop button on gui)
            // When the stop button is pressed, the Robobo motors will be stopped      
            this.runtime.on('PROJECT_STOP_ALL', this.stopAllMotors.bind(this));
        });
    }

    disconnect(args, util) {
        return new Promise(resolve => {
            this.remote.registerCallback('onConnectionChanges', arg => {
                this.connectionState = arg;
                resolve();
            })
            this.remote.closeConnection();
        });
    }

    isConnected() {
        return this.remote.isConnected();
    }


    baseActuationTitle(args, util) {

    }

    baseSensingTitle(args, util) {

    }

    smartphoneActuationTitle(args, util) {

    }

    smartphoneSensingTitle(args, util) {

    }

    /**
     * This method is called when the 'PROJECT_STOP_ALL' event is triggered
     */
    stopAllMotors() {
        this.remote.stopWheels();
        this.remote.stopPan();
        this.remote.stopTilt();
    }

    /** Stops the movement of the motors
     */
    stopMotors(args, util) {
        const { MOTOR } = args;
        switch (MOTOR) {
            case 'wheels':
                this.remote.stopWheels();
                break;
            case 'pan':
                this.remote.stopPan();
                break;
            case 'tilt':
                this.remote.stopTilt();
                break;
            default:
                this.remote.stopWheels();
                this.remote.stopPan();
                this.remote.stopTilt();
                break;
        }
    }

    /** Starts moving the wheels of the robot at the specified speed.
     * 
     * @param {integer} speedR Speed factor for the right wheel [-100 - 100]
     * @param {integer} speedL Speed factor for the right wheel [-100 - 100]
    */
    moveWheels(args, util) {
        const { SPEEDR, SPEEDL } = args;

        this.remote.moveWheelsSeparated(SPEEDL, SPEEDR, 2147483647);
    }

    /** Moves the wheels of the robot at the specified speeds during the specified time.
     * This functions is blocking, it doesn't returns the control until the movement
     * is finished.
     * 
     * @param {integer} speedR Speed factor for the right wheel [-100..100]
     * @param {integer} speedL Speed factor for the right wheel [-100..100]
     * @param {integer} time Time duration of the movement in seconds
     */
    moveWheelsByTime(args, util) {
        const { SPEEDR, SPEEDL, TIME, WAIT } = args;

        /** prueba sobre target --> sprite seleccionado */
        const steps = 20;
        const radians = MathUtil.degToRad(90 - util.target.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        util.target.setXY(util.target.x + dx, util.target.y + dy);
        /** */

        if (WAIT == 'true') {
            return new Promise(resolve => {

                this.remote.moveWheelsSeparatedWait(SPEEDL, SPEEDR, TIME, resolve);

                unlock = false;
            })
        }
        else {
            this.remote.moveWheelsSeparated(SPEEDL, SPEEDR, TIME);
        }
    }

    /** Moves the wheels of the robot by some degress at the specified speed.
     * This functions is blocking, it doesn't returns the control until the movement
     * is finished.
     * 
     * @param {string} wheel - Wheels to move [left | right | both]
     * @param {string} speed  - Speed factor [-100..100]
     * @param {string} degrees - Degress to move the wheel
     * 
     */
    moveWheelsByDegrees(args, util) {
        const { WHEELS, SPEED, DEGREES } = args;
        return new Promise(resolve => {
            this.remote.moveWheelsByDegree(WHEELS, DEGREES, SPEED, resolve);
            unlock = false;
        })
    }

    /** Moves the PAN of the base to the specified position at the specified speed
     * 
     * @param {integer} position Position in degress of the PAN [-160..160]
     * @param {integer} speed  Speed factor [0..100]
     */
    movePanTo(args, util) {
        const { POSITION, SPEED, WAIT } = args;

        if (WAIT == 'true') {
            return new Promise(resolve => {
                this.remote.movePanWait(Number(POSITION), SPEED, resolve);
            });
        }
        else {
            this.remote.movePan(Number(POSITION), SPEED);
        }
    }

    /** Moves the TILT of the base to the specified position at the specified speed and
     * waits until the movement has finished.
     * 
     * @param {integer} position Position in degress of the TILT [5..105]
     * @param {integer} speed  Speed factor [0..100]
     */
    moveTiltTo(args, util) {
        const { POSITION, SPEED, WAIT } = args;

        if (WAIT == 'true') {
            return new Promise(resolve => {
                this.remote.moveTiltWait(POSITION, SPEED, resolve);
            });
        }
        else {
            this.remote.moveTilt(POSITION, SPEED);
        }
    }


    /** Changes the color of a LED of the base
     * 
     * @param {string} led The ID of the led ['Front-C','Front-L','Front-LL','Front-R','Front-RR','Back-L','Back-R','all']
     * @param {string} color The new color ['off','white','red','blue','cyan','magenta','yellow','green','orange']
     */
    setLedColorTo(args, util) {
        const { LED, COLOR } = args;

        this.remote.setLedColor(`${LED}`, COLOR);
    }

    /** Changes the emotion of showed by the face of Robobo
     *  
     * @param {string} emotion One of ['happy','laughing','surprised','sad','angry','normal','sleeping','tired','afraid']
     */
    setEmotionTo(args, util) {
        const { EMOTION } = args;

        this.remote.changeEmotion(EMOTION);
    }


    /** Commands the robot say the specified text 
     * 
     * @param {string} text The text to say
     */
    sayText(args, util) {
        const { TEXT, WAIT } = args;

        if (WAIT == 'true') {
            return new Promise(resolve => {
                this.remote.talk(TEXT, resolve);
            });
        } else {
            this.remote.talk(TEXT, () => (a = 1));

        }
    }

    /** Commands the robot to play the specified emotion sound
     * 
     * @param {string} sound One of ['moan','purr',"angry","approve","disapprove","discomfort","doubtful","laugh","likes","mumble","ouch","thinking","various"]
     */
    playSound(args, util) {
        const { SOUND } = args;

        this.remote.playEmotionSound(SOUND);
    }

    /** Commands the robot to play a musical note
     *  
     * @param {integer} note Musical note index [48..72]. Anglo-Saxon notation is used and there are 25 possible notes with the following basic correspondence. Any integer between 48 and 72.
     * @param {integer} time Duration of the note in seconds (decimals can be used to used, like 0.2 or 0.5) 
     */
    playNote(args, util) {
        const { NOTE, TIME, WAIT } = args;
        console.log(args);
        if (WAIT == 'true') {
            return new Promise(resolve => {
                this.remote.playNote(NOTE, TIME * 1000);
                setTimeout(resolve, TIME * 1000)
            })
        }
        else {
            this.remote.playNote(NOTE, TIME * 1000);
            //the Robobo remote expects millis        
        }
    }

    /** Returns the position of the wheel in degrees
 *  
 * @param {string} wheel - One of [left, right]
 * @returns the position of the wheel in degress
 */
    readWheelPosition(args, util) {
        const { WHEEL } = args;
        return this.remote.getWheel(WHEEL, 'position');
    }

    /** Returns the position of the wheel in degrees
 *  
 * @param {string} wheel - One of [left, right]
 * @returns the speed of the wheel 
 */
    readWheelSpeed(args, util) {
        const { WHEEL } = args;

        return this.remote.getWheel(WHEEL, 'speed');
    }


    /**
     * Resets the encoders of the wheels
     */
    resetWheelEncoders(args, util) {
        this.remote.resetEncoders();
    }


    /** Returns the current position of the PAN
     * 
     * @returns the current position of the pan
     */
    readPanPosition(args, util) {
        return this.remote.getPan();
    }

    /** Returns the current position of the TILT
     * 
     * @returns the current position of the tilt
     */
    readTiltPosition(args, util) {
        return this.remote.getTilt();
    }

    /** Returns the current value sensed by the specified IR
     *  
     * @param {string} sensor One of ['Front-C','Front-L','Front-LL','Front-R','Front-RR','Back-C','Back-L','Back-R'] 
     * @returns {integer} the current value of the IR
     */
    readIRSensor(args, util) {
        const { SENSOR } = args;
        return this.remote.getIRValue(SENSOR);
    }

    /** Returns the battery level of the base or the smartphone
     *  
     * @param {string} device One of 'base' or 'smartphone'
     * @returns {integer} the battery level of the base or the smartphone
     */
    readBatteryLevel(args, util) {
        const { BATTERY } = args;
        if (BATTERY == 'base') {
            return this.remote.checkBatt();
        } else {
            return this.remote.checkOboBatt();
        }
    }

    /** Returns the position and distance of the last face detected by the robot
     * 
     * Example of use:
     * let face = robobo.readFaceSensor();
     * console.log(face.distance); //the distance to the person
     * console.log(face.x); //the position of the face in X axis
     * console.log(fase.y); //the position of the face in Y axis
     * 
     * @returns the position and distance of the last face detected by the robot
     */
    readFaceSensor(args, util) {
        const { TYPE } = args;

        if (TYPE == 'distance') {
            return this.remote.getFaceDist();
        } else if (TYPE == 'size') {
            return this.remote.getFaceSize();
        } else if (TYPE == 'x') {
            return this.remote.getFaceCoord('x');
        } else {
            return this.remote.getFaceCoord('y');
        }

    }

    /** Resets the face sensor.
     * After this function, and until a new face is detected, the face sensor
     * will return 0 as values for distance, x and y position.
     */
    resetFaceSensor(args, util) {
        this.remote.resetFaceSensor();
    }

    /** Returns the number of claps registered since the last reset
     *
     *
     * @returns {Integer} Clap counter
     * @memberof Robobo
     */
    readClapCounter(args, util) {
        return this.remote.getClaps();
    }
    /** Resets the clap counter
     *
     *
     * @memberof Robobo
     */
    resetClapCounter(args, util) {
        this.remote.resetClapSensor();
    }

    /** Returns the last note detected by the note sensor
     *
     *
     * @returns Name (note) and duration (duration) of the last note
     * @memberof Robobo
     */
    readLastNote(args, util) {
        const { TYPE } = args;

        if (TYPE == 'note') {
            return this.remote.getLastNote()
        }
        else {
            return this.remote.getLastNoteDuration()
        }
    }

    /** Resets the last note registered by the note sensor
     *
     *
     * @memberof Robobo
     */
    resetLastNote() {
        this.remote.resetNoteSensor();
    }

    /** Reads the last detected blob of color of the indicated color
 *
 *
 * @param {*} color Color of the blob
 * @returns The position of the blob (x,y) and the area (area)
 * @memberof Robobo
 */
    readColorBlob(args, util) {
        const { COLOR, TYPE } = args;

        if (TYPE == 'x') {
            return this.remote.getBlobCoord(COLOR, 'x')
        } else if (TYPE == 'y') {
            return this.remote.getBlobCoord(COLOR, 'y')
        } else {
            return this.remote.getBlobSize(COLOR)
        }
    }
    /**
    * Resets the color blob detector
    *
    * @memberof Robobo
    */
    resetColorBlobs() {
        this.remote.resetBlobSensor();
    }
    /**
     * Activates the individual tracking of each color. 
     * Warning: Color tracking is a computionally intensive task,
     * activating all the colors may impact performance
     *
     * @param {Boolean} red Enables red blob tracking
     * @param {Boolean} green Enables green blob tracking
     * @param {Boolean} blue Enables blue blob tracking
     * @param {Boolean} custom Enables custom blob tracking
     * @memberof Robobo
     */
    setColorBlobDetectionActive(args, util) {
        const { RED, GREEN, BLUE, CUSTOM } = args;

        this.remote.configureBlobDetection(RED, GREEN, BLUE, CUSTOM);
    }

    /**
     * Reads the data of the fling sensor
     *
     * @returns Last angle detected on the sensor
     * @memberof Robobo
     */
    readFlingSensor(args, util) {
        return this.remote.checkFlingAngle();
    }

    /**
     * Resets the state of the Fling sensor
     *
     * @memberof Robobo
     */
    resetFlingSensor(args, util) {
        this.remote.resetFlingSensor();
    }

    /**
     * Reads the data on the tap sensor
     *
     * @returns Coordinates of the last registered tap (x, y) and the zone of the face
     * @memberof Robobo
     */
    readTapSensor(args, util) {
        const { TYPE } = args;

        if (TYPE == 'x') {
            return this.remote.getTapCoord('x')
        } else if (TYPE == 'y') {
            return this.remote.getTapCoord('y')

        } else {
            return this.remote.getTapZone()
        }
    }

    /**
     * Resets the tap sensor value
     *
     * @memberof Robobo
     */
    resetTapSensor() {
        this.remote.resetTapSensor();
    }

    /**
     * Reads the orientation sensor
     * Warning: This sensor may not be available on all the devices
     *
     * @returns The orientation of the smartphone (yaw, pitch and roll)
     * @memberof Robobo
     */
    readOrientationSensor(args, util) {
        const { TYPE } = args;

        return this.remote.getOrientation(TYPE)
    }
    /**
     * Reads the acceleration sensor
     *
     * @returns The current acceleration of the smartphone (x, y, z)
     * @memberof Robobo
     */
    readAccelerationSensor(args, util) {
        const { TYPE } = args;

        return this.remote.getAcceleration(TYPE)
    }

    /**
     * Reads the brightness detected by the smartphone light sensor
     *
     * @returns The current brightness value
     * @memberof Robobo
     */
    readBrightnessSensor() {
        return this.remote.getBrightness();
    }


    /** Reads the last detected qr
     *
     * @returns The QR id
     * @memberof Robobo
     */
    readQR(args, util) {
        const { TYPE } = args;
        switch (TYPE) {
            case "id":
                return this.remote.getQRId();
            case "x":
                return this.remote.getQRCoord('x');
            case "y":
                return this.remote.getQRCoord('y');
            case "size":
                return this.remote.getQRDist();
            default:
                return this.remote.getQRId();
        }
    }

    /**
    * Resets the color blob detector
    *
    * @memberof Robobo
    */
    resetQR() {
        this.remote.resetQRSensor();
    }

    onClapDetected() {
        if (this.clapDetected) {
            this.clapDetected = false;
            return true;
        } else {
            return false;
        }
    }

    onTalkEnded() {
        if (this.talkEnded) {
            this.talkEnded = false;
            return true;
        } else {
            return false;
        }
    }

    onBlobDetected() {
        if (this.blobDetected) {
            this.blobDetected = false;
            return true;
        } else {
            return false;
        }
    }

    onLowBaseBattDetected() {
        if (this.lowBaseBattDetected) {
            this.lowBaseBattDetected = false;
            return true;
        } else {
            return false;
        }
    }

    onLowPhoneBattDetected() {
        if (this.lowPhoneBattDetected) {
            this.lowPhoneBattDetected = false;
            return true;
        } else {
            return false;
        }
    }
    onLostFaceDetected() {
        if (this.lostFaceDetected) {
            this.lostFaceDetected = false;
            return true;
        } else {
            return false;
        }
    }
    onNewFaceDetected() {
        if (this.newFaceDetected) {
            this.newFaceDetected = false;
            return true;
        } else {
            return false;
        }
    }

    onTapDetected() {
        if (this.tapDetected) {
            this.tapDetected = false;
            return true;
        } else {
            return false;
        }
    }

    onFlingDetected() {
        if (this.flingDetected) {
            this.flingDetected = false;
            return true;
        } else {
            return false;
        }
    }

    onNoteDetected() {
        if (this.noteDetected) {
            this.noteDetected = false;
            return true;
        } else {
            return false;
        }
    }
    onQrDetected() {
        if (this.qrDetected) {
            this.qrDetected = false;
            return true;
        } else {
            return false;
        }
    }
    onQrAppear() {
        if (this.qrAppear) {
            this.qrAppear = false;
            return true;
        } else {
            return false;
        }
    }
    onQrDisappear() {
        if (this.qrDisappear) {
            this.qrDisappear = false;
            return true;
        } else {
            return false;
        }
    }


}
module.exports = Scratch3Robobo;
