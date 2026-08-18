const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzRDNzkwRiIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlA8L3RleHQ+PC9zdmc+';

const HTTP_TIMEOUT = 10000;

class Scratch3ScratchProBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._velocityIntervals = new Map();
        this._onStopAll = this._onStopAll.bind(this);
        if (runtime) {
            runtime.on('STOP_ALL', this._onStopAll);
            runtime.on('RUNTIME_DISPOSED', this._onStopAll);
        }
    }

    _onStopAll () {
        for (const intervalId of this._velocityIntervals.values()) {
            clearInterval(intervalId);
        }
        this._velocityIntervals.clear();
    }

    _getRuntime () {
        return this.runtime;
    }

    getInfo () {
        return {
            id: 'scratchpro',
            name: 'ScratchPro',
            blockIconURI: blockIconURI,
            color1: '#4C790F',
            color2: '#3E610C',
            color3: '#2E4909',
            blocks: [
                {
                    opcode: 'httpGet',
                    blockType: BlockType.REPORTER,
                    text: 'GET [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://api.example.com/data'
                        }
                    },
                    doc: {
                        description: 'Makes an HTTP GET request to the specified URL and returns the response body as text.',
                        example: 'GET "https://api.example.com/data" returns the page content.',
                        returns: 'the response body as a string, or empty string on failure'
                    }
                },
                {
                    opcode: 'consoleLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Logs a value to the browser\'s developer console. Useful for debugging Scratch projects.',
                        example: 'log "hello" prints hello in the console.'
                    }
                },
                '---',
                {
                    opcode: 'jsonParse',
                    blockType: BlockType.REPORTER,
                    text: 'parse JSON [JSON] get [KEY]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"key":"value"}'
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    },
                    doc: {
                        description: 'Parses a JSON string and extracts the value associated with the given key.',
                        example: 'parse JSON \'{"key":"value"}\' get "key" returns "value".',
                        returns: 'the value for the specified key as a string, or empty string if not found'
                    }
                },
                {
                    opcode: 'stringToUpper',
                    blockType: BlockType.REPORTER,
                    text: 'uppercase [STRING]',
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    },
                    doc: {
                        description: 'Converts all letters in a string to uppercase.',
                        example: 'uppercase "hello" returns "HELLO".',
                        returns: 'the string converted to uppercase'
                    }
                },
                '---',
                {
                    opcode: 'arrayPush',
                    blockType: BlockType.COMMAND,
                    text: 'add [VALUE] to list [LIST]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'item'
                        },
                        LIST: {
                            type: ArgumentType.STRING,
                            defaultValue: 'myList'
                        }
                    },
                    doc: {
                        description: 'Adds an item to the end of a Scratch list.',
                        example: 'add "item" to list "myList" appends "item" to the list.'
                    }
                },
                {
                    opcode: 'arrayPop',
                    blockType: BlockType.REPORTER,
                    text: 'remove last from list [LIST]',
                    arguments: {
                        LIST: {
                            type: ArgumentType.STRING,
                            defaultValue: 'myList'
                        }
                    },
                    doc: {
                        description: 'Removes and returns the last item from a Scratch list.',
                        example: 'remove last from list "myList" removes and returns the last element.',
                        returns: 'the last item from the list, or empty string if the list is empty'
                    }
                },
                '---',
                {
                    opcode: 'spriteGetProps',
                    blockType: BlockType.REPORTER,
                    text: 'get [PROP] of sprite [SPRITE]',
                    arguments: {
                        PROP: {
                            type: ArgumentType.STRING,
                            menu: 'spriteProps'
                        },
                        SPRITE: {
                            type: ArgumentType.STRING,
                            defaultValue: '_myself_'
                        }
                    },
                    doc: {
                        description: 'Gets a property of a sprite, such as its x, y, direction, size, volume, costume index, or visibility.',
                        returns: 'the value of the requested property, or 0 if the sprite is not found'
                    }
                },
                {
                    opcode: 'spriteSetVelocity',
                    blockType: BlockType.COMMAND,
                    text: 'set velocity x: [X] y: [Y]',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    filter: [TargetType.SPRITE],
                    doc: {
                        description: 'Sets a constant velocity on the current sprite, moving it continuously by the given x and y amounts each frame (approximately 30 times per second).',
                        example: 'set velocity x: 1 y: 0 makes the sprite move right continuously.'
                    }
                },
                '---',
                {
                    opcode: 'colorBlend',
                    blockType: BlockType.REPORTER,
                    text: 'blend [COLOR1] and [COLOR2] at [RATIO]%',
                    arguments: {
                        COLOR1: {
                            type: ArgumentType.COLOR
                        },
                        COLOR2: {
                            type: ArgumentType.COLOR
                        },
                        RATIO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    },
                    doc: {
                        description: 'Blends two RGB colors together at a given ratio. A ratio of 0 returns the first color; 100 returns the second.',
                        example: 'blend #FF0000 and #0000FF at 50% returns a purple color.',
                        returns: 'the blended color as a number'
                    }
                },
                {
                    opcode: 'waitFrames',
                    blockType: BlockType.COMMAND,
                    text: 'wait [FRAMES] frames',
                    arguments: {
                        FRAMES: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    isTerminal: false,
                    doc: {
                        description: 'Pauses the script for a specified number of frames (at 30 frames per second).',
                        example: 'wait 30 frames pauses for approximately 1 second.'
                    }
                },
                {
                    opcode: 'getFPS',
                    blockType: BlockType.REPORTER,
                    text: 'current FPS',
                    disableMonitor: false,
                    doc: {
                        description: 'Returns the current frames-per-second (FPS) of the project, indicating how smoothly it is running.',
                        returns: 'the current FPS as a number, or 0 if unavailable'
                    }
                },
                '---',
                {
                    opcode: 'cloneWithDelta',
                    blockType: BlockType.COMMAND,
                    text: 'clone sprite and move dx: [DX] dy: [DY]',
                    arguments: {
                        DX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        DY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    filter: [TargetType.SPRITE],
                    doc: {
                        description: 'Creates a clone of the current sprite and offsets its position by the given delta x and delta y values.',
                        example: 'clone sprite and move dx: 100 dy: 0 creates a clone 100 pixels to the right.'
                    }
                },
                {
                    opcode: 'distanceBetween',
                    blockType: BlockType.REPORTER,
                    text: 'distance between [SPRITE1] and [SPRITE2]',
                    arguments: {
                        SPRITE1: {
                            type: ArgumentType.STRING,
                            defaultValue: '_myself_'
                        },
                        SPRITE2: {
                            type: ArgumentType.STRING,
                            defaultValue: '_myself_'
                        }
                    },
                    doc: {
                        description: 'Calculates the Euclidean distance between two sprites.',
                        returns: 'the distance between the two sprites, or -1 if either sprite is not found'
                    }
                },
                {
                    opcode: 'projectMetadata',
                    blockType: BlockType.REPORTER,
                    text: 'project [FIELD]',
                    arguments: {
                        FIELD: {
                            type: ArgumentType.STRING,
                            menu: 'projectFields'
                        }
                    },
                    doc: {
                        description: 'Returns metadata about the project, such as its title, notes, or credits.',
                        returns: 'the value of the requested metadata field, or empty string if not available'
                    }
                }
            ],
            menus: {
                spriteProps: {
                    acceptReporters: true,
                    items: ['x', 'y', 'direction', 'size', 'volume', 'costume', 'visible']
                },
                projectFields: {
                    acceptReporters: true,
                    items: ['title', 'notes', 'credits']
                }
            }
        };
    }

    httpGet (args) {
        if (!args || !args.URL) return '';
        const url = Cast.toString(args.URL);
        if (!url) return '';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT);
        return fetch(url, {signal: controller.signal})
            .then(res => {
                clearTimeout(timeoutId);
                if (!res.ok) return '';
                return res.text();
            })
            .catch(() => {
                clearTimeout(timeoutId);
                return '';
            });
    }

    consoleLog (args) {
        if (!args) return;
        const value = args.VALUE !== undefined ? Cast.toString(args.VALUE) : '';
        log.info(`[ScratchPro] ${value}`);
    }

    jsonParse (args) {
        if (!args) return '';
        try {
            const json = Cast.toString(args.JSON);
            const key = Cast.toString(args.KEY);
            if (!json) return '';
            const parsed = JSON.parse(json);
            if (parsed === null || typeof parsed !== 'object') return '';
            const value = parsed[key];
            return value !== undefined && value !== null ? Cast.toString(value) : '';
        } catch (e) {
            return '';
        }
    }

    stringToUpper (args) {
        if (!args) return '';
        const str = Cast.toString(args.STRING);
        return str ? str.toUpperCase() : '';
    }

    arrayPush (args, util) {
        if (!args || !util || !util.target) return;
        const listName = Cast.toString(args.LIST);
        const value = Cast.toString(args.VALUE);
        if (!listName) return;
        try {
            const variable = util.target.lookupVariableByName(listName);
            if (variable && variable.type === 'list') {
                variable.value.push(value);
            }
        } catch (e) {
            log.error('arrayPush error:', e);
        }
    }

    arrayPop (args, util) {
        if (!args || !util || !util.target) return '';
        const listName = Cast.toString(args.LIST);
        if (!listName) return '';
        try {
            const variable = util.target.lookupVariableByName(listName);
            if (variable && variable.type === 'list' && variable.value.length > 0) {
                return variable.value.pop();
            }
        } catch (e) {
            log.error('arrayPop error:', e);
        }
        return '';
    }

    spriteGetProps (args) {
        if (!args) return 0;
        const prop = Cast.toString(args.PROP);
        const spriteName = Cast.toString(args.SPRITE);
        const target = this._findTarget(spriteName);
        if (!target) return 0;
        try {
            switch (prop) {
            case 'x': return target.x;
            case 'y': return target.y;
            case 'direction': return target.direction;
            case 'size': return target.size;
            case 'volume': return target.volume;
            case 'costume': return typeof target.getCostumeIndex === 'function' ? target.getCostumeIndex() : 0;
            case 'visible': return target.visible ? 1 : 0;
            default: return 0;
            }
        } catch (e) {
            return 0;
        }
    }

    spriteSetVelocity (args, util) {
        if (!args || !util || !util.target) return;
        const vx = isFinite(args.X) ? Cast.toNumber(args.X) : 0;
        const vy = isFinite(args.Y) ? Cast.toNumber(args.Y) : 0;
        const target = util.target;
        const targetId = target.id;
        const rt = target.runtime;

        if (!rt || rt.isDisposed) return;

        if (this._velocityIntervals.has(targetId)) {
            clearInterval(this._velocityIntervals.get(targetId));
        }

        if (vx === 0 && vy === 0) {
            this._velocityIntervals.delete(targetId);
            return;
        }

        const intervalId = setInterval(() => {
            try {
                if (rt.isDisposed || !target.runtime) {
                    clearInterval(intervalId);
                    this._velocityIntervals.delete(targetId);
                    return;
                }
                target.setXY(target.x + vx, target.y + vy);
                rt.requestRedraw();
            } catch (e) {
                clearInterval(intervalId);
                this._velocityIntervals.delete(targetId);
            }
        }, 33);

        this._velocityIntervals.set(targetId, intervalId);
    }

    colorBlend (args) {
        if (!args) return 0;
        try {
            const c1 = Cast.toRgbColorObject(args.COLOR1);
            const c2 = Cast.toRgbColorObject(args.COLOR2);
            if (!c1 || !c2) return 0;
            const ratio = Math.max(0, Math.min(1, Cast.toNumber(args.RATIO) / 100));
            if (isNaN(ratio)) return 0;
            const r = Math.round((c1.r || 0) * (1 - ratio) + (c2.r || 0) * ratio);
            const g = Math.round((c1.g || 0) * (1 - ratio) + (c2.g || 0) * ratio);
            const b = Math.round((c1.b || 0) * (1 - ratio) + (c2.b || 0) * ratio);
            return Math.max(0, Math.min(0xFFFFFF, (r << 16) | (g << 8) | b));
        } catch (e) {
            return 0;
        }
    }

    waitFrames (args, util) {
        if (!args || !util || !util.stackFrame) return;
        const frames = Math.max(0, Math.round(Cast.toNumber(args.FRAMES)));
        if (isNaN(frames) || frames <= 0) return;
        if (typeof util.stackFrame.waitFrame === 'undefined') {
            util.stackFrame.waitFrame = frames;
        }
        if (util.stackFrame.waitFrame > 0) {
            util.stackFrame.waitFrame--;
            util.yield();
        }
    }

    getFPS () {
        try {
            const rt = this._getRuntime();
            if (!rt) return 0;
            const timer = rt._stepTimer;
            if (!timer || typeof timer.timeElapsed !== 'function') return 0;
            const interval = timer.timeElapsed();
            return interval > 0 ? Math.round(1000 / interval) : 0;
        } catch (e) {
            return 0;
        }
    }

    cloneWithDelta (args, util) {
        if (!args || !util || !util.target) return;
        const target = util.target;
        const rt = target.runtime;
        if (!rt || rt.isDisposed) return;
        try {
            const dx = isFinite(args.DX) ? Cast.toNumber(args.DX) : 0;
            const dy = isFinite(args.DY) ? Cast.toNumber(args.DY) : 0;
            if (typeof rt.clone === 'function') {
                const clone = rt.clone(target);
                if (clone && typeof clone.setXY === 'function') {
                    clone.setXY(target.x + dx, target.y + dy);
                }
            }
        } catch (e) {
            log.error('cloneWithDelta error:', e);
        }
    }

    distanceBetween (args) {
        if (!args) return -1;
        const name1 = Cast.toString(args.SPRITE1);
        const name2 = Cast.toString(args.SPRITE2);
        try {
            const t1 = this._findTarget(name1);
            const t2 = this._findTarget(name2);
            if (!t1 || !t2) return -1;
            const dx = t1.x - t2.x;
            const dy = t1.y - t2.y;
            return Math.sqrt(dx * dx + dy * dy);
        } catch (e) {
            return -1;
        }
    }

    projectMetadata (args) {
        if (!args) return '';
        const field = Cast.toString(args.FIELD);
        try {
            const rt = this._getRuntime();
            if (!rt) return '';
            if (field === 'title') return rt.projectTitle || '';
            if (field === 'notes') return rt.projectNotes || '';
        } catch (e) {
            return '';
        }
        return '';
    }

    _findTarget (spriteName) {
        try {
            const rt = this._getRuntime();
            if (!rt) return null;
            if (spriteName === '_myself_') return rt.getEditingTarget();
            if (spriteName === '_stage_') return rt.getTargetForStage();
            if (typeof rt.getSpriteTargetByName === 'function') {
                return rt.getSpriteTargetByName(spriteName);
            }
            return null;
        } catch (e) {
            return null;
        }
    }
}

module.exports = Scratch3ScratchProBlocks;
