const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const Legacy = require('./legacy');

const Icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="359.88837" height="359.88837" viewBox="0,0,359.88837,359.88837"><g transform="translate(-0.05581,-0.05581)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M0.05581,180c0,-99.38043 80.56376,-179.94419 179.94419,-179.94419c99.38043,0 179.94419,80.56376 179.94419,179.94419c0,99.38043 -80.56376,179.94419 -179.94419,179.94419c-99.38043,0 -179.94419,-80.56376 -179.94419,-179.94419z" fill="#ffa01c" stroke="none" stroke-width="0"></path><path d="M287.75178,193.90392c0,48.73913 -39.24132,88.25 -107.75,88.25c-68.00868,0 -107.75,-39.51087 -107.75,-88.25c0,-9.19084 -0.23122,-19.19576 3.03827,-27.75807c5.20764,-13.63799 8.91203,-74.60008 20.46178,-86.5079c8.86387,-9.13866 29.7914,30.63818 43.94977,25.57474c12.65755,-4.5267 25.44466,-4.55876 39.80017,-4.55876c13.08149,0 26.54603,2.10258 38.03272,5.90107c10.50379,3.47346 38.90237,-33.7215 44.28242,-28.13627c14.60715,15.16421 16.6406,69.41197 22.52539,88.78365c2.22744,7.33233 3.40947,18.95084 3.40947,26.70156z" fill="none" stroke="#ffffff" stroke-width="25"></path></g></g></svg><!--rotationCenter:179.94418604651162:179.94418604651162-->';

/**
 * Class for Scratch Authentication blocks
 * @constructor
 */
let currentPrivateCode = '';
class JgScratchAuthenticateBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.promptStatus = {
            inProgress: false,
            blocked: false,
            completed: false,
            userClosed: false,
        };
        this.loginInfo = {};

        // legacy
        this.keepAllowingAuthBlock = true;
        this.disableConfirmationShown = false;
    }


    /**
     * dummy function for reseting user provided permisions when a save is loaded
     */
    deserialize() {
        this.disableConfirmationShown = false;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgScratchAuthenticate',
            name: 'Scratch Auth',
            color1: '#FFA01C',
            color2: '#ff8C00',
            blockIconURI: Icon,
            // TODO: docs doesnt exist, make some docs
            // docsURI: 'https://docs.penguinmod.com/extensions/scratch-auth',
            blocks: [
                // LEGACY BLOCK
                {
                    opcode: 'authenticate',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.authenticate',
                        default: 'get scratch username and set sign in location name to [NAME]',
                        description: "Block that returns the user's name on Scratch."
                    }),
                    disableMonitor: true,
                    hideFromPalette: true,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "PenguinMod" }
                    },
                    blockType: BlockType.REPORTER
                },
                // NEW BLOCKS
                {
                    opcode: 'showPrompt',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.showPrompt',
                        default: 'show login message as [NAME]',
                        description: "Block that shows the Log in menu from Scratch Authentication."
                    }),
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'loginLocation'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'getPromptStatus',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.promptStatus',
                        default: 'login prompt [STATUS]?',
                        description: "The status of the login prompt for Scratch Authentication."
                    }),
                    arguments: {
                        STATUS: {
                            type: ArgumentType.STRING,
                            menu: "promptStatus"
                        }
                    },
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'privateCode',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.privateCode',
                        default: 'authentication code',
                        description: "The login code when Scratch Authentication closes the login prompt."
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'serverRedirectLocation',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.serverRedirectLocation',
                        default: 'redirect location',
                        description: "The redirect location when Scratch Authentication closes the login prompt."
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.labels.loginInfo1',
                        default: 'The blocks below invalidate',
                        description: "Label to denote that blocks invalidate the Scratch Auth private code below this label"
                    }),
                    blockType: BlockType.LABEL
                },
                {
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.labels.loginInfo2',
                        default: 'the authentication code from above.',
                        description: "Label to denote that blocks invalidate the Scratch Auth private code below this label"
                    }),
                    blockType: BlockType.LABEL
                },
                {
                    opcode: 'validLogin',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.validLogin',
                        default: 'login is valid?',
                        description: "Whether or not the authentication was valid."
                    }),
                    disableMonitor: true,
                    // this doesnt seem to be important,
                    // login should always be valid when checking on client-side
                    hideFromPalette: true,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'scratchUsername',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.scratchUsername',
                        default: 'scratch username',
                        description: "The username that was logged in."
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {
                loginLocation: {
                    items: '_getLoginLocations',
                    isTypeable: true,
                },
                promptStatus: [
                    { text: 'in progress', value: 'inProgress' },
                    { text: 'blocked', value: 'blocked' },
                    { text: 'complete', value: 'completed' },
                    { text: 'closed by the user', value: 'userClosed' },
                ]
            }
        };
    }

    // menus
    _getLoginLocations() {
        const nameSplit = document.title.split(" - ");
        nameSplit.pop();
        const projectName = Cast.toString(nameSplit.join(" - "));
        return [
            projectName === 'PenguinMod' ? 'Project' : projectName,
            'PenguinMod',
            'Game',
        ];
    }

    // util
    async parseLoginCode_() {
        if (!currentPrivateCode) throw new Error('Private code not present');
        const req = await fetch(`https://pm-bapi.vercel.app/api/verifyToken?privateCode=${currentPrivateCode}`);
        const json = await req.json();
        this.loginInfo = {
            valid: json.valid,
            username: json.username
        };
        return this.loginInfo;
    }

    // blocks
    showPrompt(args) {
        // reset
        this.promptStatus = {
            inProgress: true,
            blocked: false,
            completed: false,
            userClosed: false,
        };
        this.loginInfo = {};

        const loginLocation = Cast.toString(args.NAME);
        const sanitizedName = encodeURIComponent(loginLocation.substring(0, 256).replace(/[^a-zA-Z0-9 _\-\.\[\]\(\)]+/gmi, ""));
        const waitingLink = `https://studio.penguinmod.com/scratchAuthExt.html?openLocation=${encodeURIComponent(window.origin)}`;

        // listen for events before opening
        let login;
        let finished = false;
        const listener = (event) => {
            if (event.origin !== (new URL(waitingLink)).origin) {
                return;
            }
            if (!(event.data && event.data.scratchauthd1)) {
                return;
            }

            const data = event.data.scratchauthd1;

            const privateCode = data.pv;
            currentPrivateCode = privateCode;

            // update status
            this.promptStatus.inProgress = false;
            this.promptStatus.completed = true;

            finished = true;
            window.removeEventListener("message", listener);
            login.close();
        };
        window.addEventListener("message", listener);

        // open prompt
        login = window.open(
            `https://auth.itinerary.eu.org/auth/?redirect=${btoa(waitingLink)}${sanitizedName.length > 0 ? `&name=${sanitizedName}` : ""}`,
            "Scratch Authentication",
            `scrollbars=yes,resizable=yes,status=no,location=yes,toolbar=no,menubar=no,width=768,height=512,left=200,top=200`
        );
        if (!login) {
            // popup was blocked most likely
            this.promptStatus.inProgress = false;
            this.promptStatus.blocked = true;
            return;
        }

        // .onclose doesnt work on most platforms it seems
        // so just set interval
        const closedInterval = setInterval(() => {
            if (!login.closed) return;

            this.promptStatus.inProgress = false;
            if (!finished) {
                this.promptStatus.userClosed = true;
            }
            window.removeEventListener("message", listener);
            clearInterval(closedInterval);
        }, 500);
    }
    privateCode() {
        const code = currentPrivateCode;
        currentPrivateCode = '';
        return code;
    }
    serverRedirectLocation() {
        const waitingLink = `https://studio.penguinmod.com/scratchAuthExt.html?openLocation=${window.origin}`;
        return waitingLink;
    }
    getPromptStatus(args) {
        const option = Cast.toString(args.STATUS);
        if (!(option in this.promptStatus)) return false;
        return this.promptStatus[option];
    }

    // parsing privat4e code blocks
    async validLogin() {
        if (Object.keys(this.loginInfo).length <= 0) {
            try {
                await this.parseLoginCode_();
            } catch {
                // just say invalid if we cant parse
                return false;
            }
        }
        return !!this.loginInfo.valid;
    }
    async scratchUsername() {
        if (Object.keys(this.loginInfo).length <= 0) {
            try {
                await this.parseLoginCode_();
            } catch {
                // just say no username if we cant parse
                return '';
            }
        }
        return Cast.toString(this.loginInfo.username);
    }

    // legacy block
    authenticate(...args) {
        return Legacy.authenticate(this, ...args);
    }
}

module.exports = JgScratchAuthenticateBlocks;
