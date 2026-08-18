const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const Legacy = require('./legacy');

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
            blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNTkuODg4MzciIGhlaWdodD0iMzU5Ljg4ODM3IiB2aWV3Qm94PSIwLDAsMzU5Ljg4ODM3LDM1OS44ODgzNyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDU1ODEsLTAuMDU1ODEpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLjA1NTgxLDE4MGMwLC05OS4zODA0MyA4MC41NjM3NiwtMTc5Ljk0NDE5IDE3OS45NDQxOSwtMTc5Ljk0NDE5Yzk5LjM4MDQzLDAgMTc5Ljk0NDE5LDgwLjU2Mzc2IDE3OS45NDQxOSwxNzkuOTQ0MTljMCw5OS4zODA0MyAtODAuNTYzNzYsMTc5Ljk0NDE5IC0xNzkuOTQ0MTksMTc5Ljk0NDE5Yy05OS4zODA0MywwIC0xNzkuOTQ0MTksLTgwLjU2Mzc2IC0xNzkuOTQ0MTksLTE3OS45NDQxOXoiIGZpbGw9IiNmZmEwMWMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIj48L3BhdGg+PHBhdGggZD0iTTI4Ny43NTE3OCwxOTMuOTAzOTJjMCw0OC43MzkxMyAtMzkuMjQxMzIsODguMjUgLTEwNy43NSw4OC4yNWMtNjguMDA4NjgsMCAtMTA3Ljc1LC0zOS41MTA4NyAtMTA3Ljc1LC04OC4yNWMwLC05LjE5MDg0IC0wLjIzMTIyLC0xOS4xOTU3NiAzLjAzODI3LC0yNy43NTgwN2M1LjIwNzY0LC0xMy42Mzc5OSA4LjkxMjAzLC03NC42MDAwOCAyMC40NjE3OCwtODYuNTA3OWM4Ljg2Mzg3LC05LjEzODY2IDI5Ljc5MTQsMzAuNjM4MTggNDMuOTQ5NzcsMjUuNTc0NzRjMTIuNjU3NTUsLTQuNTI2NyAyNS40NDQ2NiwtNC41NTg3NiAzOS44MDAxNywtNC41NTg3NmMxMy4wODE0OSwwIDI2LjU0NjAzLDIuMTAyNTggMzguMDMyNzIsNS45MDEwN2MxMC41MDM3OSwzLjQ3MzQ2IDM4LjkwMjM3LC0zMy43MjE1IDQ0LjI4MjQyLC0yOC4xMzYyN2MxNC42MDcxNSwxNS4xNjQyMSAxNi42NDA2LDY5LjQxMTk3IDIyLjUyNTM5LDg4Ljc4MzY1YzIuMjI3NDQsNy4zMzIzMyAzLjQwOTQ3LDE4Ljk1MDg0IDMuNDA5NDcsMjYuNzAxNTZ6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMjUiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoxNzkuOTQ0MTg2MDQ2NTExNjI6MTc5Ljk0NDE4NjA0NjUxMTYyLS0+',
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
