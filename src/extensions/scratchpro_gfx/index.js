const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class ScratchProGFXBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._canvas = null;
        this._ctx = null;
        this._opacity = 1;
        this._turtleX = 0;
        this._turtleY = 0;
        this._turtleHeading = -90;
        this._turtlePen = true;
        this._filters = {brightness: null, contrast: null, saturate: null, hueRotate: null, blur: null, invert: false, sepia: false};
    }

    _ensureCanvas () {
        if (this._canvas) return this._ctx;
        try {
            this._canvas = document.createElement('canvas');
            this._canvas.id = 'scratchpro-gfx-canvas';
            this._canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            const stage = document.querySelector('.stage_stage-wrapper_owner_');
            if (stage) {
                stage.style.position = 'relative';
                stage.appendChild(this._canvas);
                const rect = stage.getBoundingClientRect();
                this._canvas.width = rect.width;
                this._canvas.height = rect.height;
            } else {
                document.body.appendChild(this._canvas);
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
            this._ctx = this._canvas.getContext('2d');
            this._ctx.strokeStyle = '#000';
            this._ctx.lineWidth = 1;
            this._ctx.fillStyle = '#fff';
            this._ctx.font = '24px sans-serif';
            return this._ctx;
        } catch (e) {
            log.warn('gfx _ensureCanvas error:', e);
            return null;
        }
    }

    getInfo () {
        return {
            id: 'scratchprogfx',
            name: 'Graphics',
            color1: '#00BFA6',
            color2: '#009E88',
            color3: '#007A68',
            blocks: [
                {
                    opcode: 'gfxDrawRect',
                    blockType: BlockType.COMMAND,
                    text: 'draw rect x:[X] y:[Y] w:[W] h:[H] color:[COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        W: {type: ArgumentType.NUMBER, defaultValue: 50},
                        H: {type: ArgumentType.NUMBER, defaultValue: 50},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'red'}
                    },
                    doc: { description: 'Draw a filled rectangle on the overlay canvas at the given position with the specified color.' }
                },
                {
                    opcode: 'gfxDrawCircle',
                    blockType: BlockType.COMMAND,
                    text: 'draw circle x:[X] y:[Y] r:[R] color:[COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 200},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 200},
                        R: {type: ArgumentType.NUMBER, defaultValue: 50},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'blue'}
                    },
                    doc: { description: 'Draw a filled circle on the overlay canvas at the given center with the specified radius and color.' }
                },
                {
                    opcode: 'gfxDrawLine',
                    blockType: BlockType.COMMAND,
                    text: 'draw line x1:[X1] y1:[Y1] x2:[X2] y2:[Y2] color:[COLOR]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 200},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 200},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'green'}
                    },
                    doc: { description: 'Draw a straight line between two points on the overlay canvas with the specified color.' }
                },
                {
                    opcode: 'gfxDrawText',
                    blockType: BlockType.COMMAND,
                    text: 'draw text x:[X] y:[Y] text:[TEXT] color:[COLOR] size:[SIZE]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 50},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 50},
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'Hello'},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'white'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 24}
                    },
                    doc: { description: 'Render text on the overlay canvas at the given position with the specified color and font size.' }
                },
                {
                    opcode: 'gfxClear',
                    blockType: BlockType.COMMAND,
                    text: 'clear overlay',
                    doc: { description: 'Clear the overlay canvas, removing all drawn shapes and resetting transformations.' }
                },
                '---',
                {
                    opcode: 'gfxSetOpacity',
                    blockType: BlockType.COMMAND,
                    text: 'set overlay opacity [OPACITY]%',
                    arguments: {
                        OPACITY: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Set the opacity of the entire overlay canvas from 0 (invisible) to 100 (fully opaque).' }
                },
                {
                    opcode: 'gfxBackground',
                    blockType: BlockType.COMMAND,
                    text: 'set overlay background [COLOR]',
                    arguments: {
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'black'}
                    },
                    doc: { description: 'Set the background color of the overlay canvas.' }
                },
                {
                    opcode: 'gfxScreenToStage',
                    blockType: BlockType.REPORTER,
                    text: 'screen [X] [Y] to stage coords',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 400},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 300}
                    },
                    doc: { description: 'Convert screen coordinates to stage-relative coordinates.', returns: { type: 'string', description: 'A JSON array [x, y] of stage coordinates' } }
                },
                '---',
                {
                    opcode: 'gfxDrawPolygon',
                    blockType: BlockType.COMMAND,
                    text: 'draw polygon x:[X] y:[Y] sides:[SIDES] radius:[RADIUS] color:[COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 200},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 200},
                        SIDES: {type: ArgumentType.NUMBER, defaultValue: 6},
                        RADIUS: {type: ArgumentType.NUMBER, defaultValue: 50},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'orange'}
                    },
                    doc: { description: 'Draw a regular polygon with the specified number of sides on the overlay canvas.' }
                },
                {
                    opcode: 'gfxDrawStar',
                    blockType: BlockType.COMMAND,
                    text: 'draw star x:[X] y:[Y] points:[POINTS] r1:[R1] r2:[R2] color:[COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 200},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 200},
                        POINTS: {type: ArgumentType.NUMBER, defaultValue: 5},
                        R1: {type: ArgumentType.NUMBER, defaultValue: 50},
                        R2: {type: ArgumentType.NUMBER, defaultValue: 25},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'gold'}
                    },
                    doc: { description: 'Draw a star shape with the given number of points using two radii for inner and outer vertices.' }
                },
                {
                    opcode: 'gfxDrawArc',
                    blockType: BlockType.COMMAND,
                    text: 'draw arc x:[X] y:[Y] r:[R] start:[START] end:[END] color:[COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 200},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 200},
                        R: {type: ArgumentType.NUMBER, defaultValue: 50},
                        START: {type: ArgumentType.NUMBER, defaultValue: 0},
                        END: {type: ArgumentType.NUMBER, defaultValue: 180},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'cyan'}
                    },
                    doc: { description: 'Draw an arc (partial circle) between start and end angles in degrees.' }
                },
                {
                    opcode: 'gfxDrawEllipse',
                    blockType: BlockType.COMMAND,
                    text: 'draw ellipse x:[X] y:[Y] rx:[RX] ry:[RY] color:[COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 200},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 200},
                        RX: {type: ArgumentType.NUMBER, defaultValue: 80},
                        RY: {type: ArgumentType.NUMBER, defaultValue: 50},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'purple'}
                    },
                    doc: { description: 'Draw a filled ellipse with separate horizontal and vertical radii.' }
                },
                '---',
                {
                    opcode: 'gfxSetStroke',
                    blockType: BlockType.COMMAND,
                    text: 'set stroke color [COLOR] width [WIDTH]',
                    arguments: {
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'black'},
                        WIDTH: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    doc: { description: 'Set the stroke color and line width for subsequent shape outlines.' }
                },
                {
                    opcode: 'gfxSetFill',
                    blockType: BlockType.COMMAND,
                    text: 'set fill color [COLOR]',
                    arguments: {
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'white'}
                    },
                    doc: { description: 'Set the fill color for subsequent shapes.' }
                },
                {
                    opcode: 'gfxGradient',
                    blockType: BlockType.COMMAND,
                    text: 'set gradient x1:[X1] y1:[Y1] x2:[X2] y2:[Y2] c1:[C1] c2:[C2]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 400},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 400},
                        C1: {type: ArgumentType.STRING, defaultValue: 'red'},
                        C2: {type: ArgumentType.STRING, defaultValue: 'blue'}
                    },
                    doc: { description: 'Set a linear gradient fill transitioning from color1 at (x1,y1) to color2 at (x2,y2).' }
                },
                {
                    opcode: 'gfxSetShadow',
                    blockType: BlockType.COMMAND,
                    text: 'set shadow blur:[BLUR] x:[X] y:[Y] color:[COLOR]',
                    arguments: {
                        BLUR: {type: ArgumentType.NUMBER, defaultValue: 10},
                        X: {type: ArgumentType.NUMBER, defaultValue: 5},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 5},
                        COLOR: {type: ArgumentType.STRING, defaultValue: 'rgba(0,0,0,0.5)'}
                    },
                    doc: { description: 'Set shadow blur, offset, and color for subsequent drawings.' }
                },
                '---',
                {
                    opcode: 'gfxTranslate',
                    blockType: BlockType.COMMAND,
                    text: 'translate canvas by [X] [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Translate the canvas origin by the given x and y offset.' }
                },
                {
                    opcode: 'gfxRotate',
                    blockType: BlockType.COMMAND,
                    text: 'rotate canvas [ANGLE] degrees',
                    arguments: {
                        ANGLE: {type: ArgumentType.NUMBER, defaultValue: 45}
                    },
                    doc: { description: 'Rotate the canvas by the given angle in degrees around the current origin.' }
                },
                {
                    opcode: 'gfxScale',
                    blockType: BlockType.COMMAND,
                    text: 'scale canvas by [X] [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 1.5},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 1.5}
                    },
                    doc: { description: 'Scale the canvas by the given x and y factors.' }
                },
                {
                    opcode: 'gfxSave',
                    blockType: BlockType.COMMAND,
                    text: 'save canvas state',
                    doc: { description: 'Save the current canvas transformation and style state to the stack.' }
                },
                {
                    opcode: 'gfxRestore',
                    blockType: BlockType.COMMAND,
                    text: 'restore canvas state',
                    doc: { description: 'Restore the most recently saved canvas transformation and style state from the stack.' }
                },
                '---',
                {
                    opcode: 'gfxSnapshot',
                    blockType: BlockType.REPORTER,
                    text: 'canvas snapshot',
                    doc: { description: 'Take a snapshot of the overlay canvas and return it as a data URL.', returns: { type: 'string', description: 'A base64-encoded PNG data URL of the canvas' } }
                },
                {
                    opcode: 'gfxPixelGet',
                    blockType: BlockType.REPORTER,
                    text: 'get pixel color at [X] [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Get the color of a specific pixel on the overlay canvas as a hex string.', returns: { type: 'string', description: 'A hex color string (e.g. #ff0000)' } }
                },
                {
                    opcode: 'gfxPixelSet',
                    blockType: BlockType.COMMAND,
                    text: 'set pixel at [X] [Y] to [COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        COLOR: {type: ArgumentType.STRING, defaultValue: '#ff0000'}
                    },
                    doc: { description: 'Set the color of a single pixel on the overlay canvas.' }
                },
                '---',
                {
                    opcode: 'gfxSetFont',
                    blockType: BlockType.COMMAND,
                    text: 'set font [FONT] size [SIZE]',
                    arguments: {
                        FONT: {type: ArgumentType.STRING, defaultValue: 'Arial'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 24}
                    },
                    doc: { description: 'Set the font family and size for subsequent text drawing.' }
                },
                {
                    opcode: 'gfxSetTextAlign',
                    blockType: BlockType.COMMAND,
                    text: 'set text align [ALIGN]',
                    arguments: {
                        ALIGN: {type: ArgumentType.STRING, menu: 'textAlignMenu', defaultValue: 'left'}
                    },
                    doc: { description: 'Set the text alignment: left, center, or right.' }
                },
                {
                    opcode: 'gfxMeasureText',
                    blockType: BlockType.REPORTER,
                    text: 'measure width of [TEXT]',
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'Hello World'}
                    },
                    doc: { description: 'Measure the width of text in pixels using the current font settings.', returns: { type: 'number', description: 'The text width in pixels' } }
                },
                {
                    opcode: 'gfxDrawImage',
                    blockType: BlockType.COMMAND,
                    text: 'draw image [URL] at [X] [Y]',
                    arguments: {
                        URL: {type: ArgumentType.STRING, defaultValue: 'https://example.com/image.png'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: { description: 'Load and draw an image from a URL onto the overlay canvas at the given position.' }
                },
                {
                    opcode: 'gfxSetGlobalAlpha',
                    blockType: BlockType.COMMAND,
                    text: 'set global alpha [ALPHA]',
                    arguments: {
                        ALPHA: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: { description: 'Set the global alpha (transparency) value for subsequent drawing operations, from 0 (transparent) to 1 (opaque).' }
                },
                {
                    opcode: 'gfxSetLineDash',
                    blockType: BlockType.COMMAND,
                    text: 'set line dash [SEGMENTS]',
                    arguments: {
                        SEGMENTS: {type: ArgumentType.STRING, defaultValue: '[5,5]'}
                    },
                    doc: { description: 'Set the line dash pattern from a JSON array of segment lengths (e.g. [5,5] for dashed).' }
                },
                {
                    opcode: 'gfxRoundedRect',
                    blockType: BlockType.COMMAND,
                    text: 'draw rounded rect x:[X] y:[Y] w:[W] h:[H] r:[R]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        W: {type: ArgumentType.NUMBER, defaultValue: 100},
                        H: {type: ArgumentType.NUMBER, defaultValue: 50},
                        R: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: { description: 'Draw a filled rounded rectangle with the given corner radius.' }
                },
                {
                    opcode: 'gfxBezierCurve',
                    blockType: BlockType.COMMAND,
                    text: 'draw cubic bezier x1:[X1] y1:[Y1] cx1:[CX1] cy1:[CY1] cx2:[CX2] cy2:[CY2] x2:[X2] y2:[Y2]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 200},
                        CX1: {type: ArgumentType.NUMBER, defaultValue: 200},
                        CY1: {type: ArgumentType.NUMBER, defaultValue: 100},
                        CX2: {type: ArgumentType.NUMBER, defaultValue: 300},
                        CY2: {type: ArgumentType.NUMBER, defaultValue: 300},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 400},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 200}
                    },
                    doc: { description: 'Draw a cubic Bezier curve from (x1,y1) to (x2,y2) with two control points.' }
                },
                '---',
                {
                    opcode: 'gfxFilterBrightness',
                    blockType: BlockType.COMMAND,
                    text: 'canvas filter brightness [BRIGHTNESS]%',
                    arguments: {
                        BRIGHTNESS: {type: ArgumentType.NUMBER, defaultValue: 150}
                    },
                    doc: { description: 'Apply CSS brightness filter to the overlay canvas.' }
                },
                {
                    opcode: 'gfxFilterContrast',
                    blockType: BlockType.COMMAND,
                    text: 'canvas filter contrast [CONTRAST]%',
                    arguments: {
                        CONTRAST: {type: ArgumentType.NUMBER, defaultValue: 150}
                    },
                    doc: { description: 'Apply CSS contrast filter to the overlay canvas.' }
                },
                {
                    opcode: 'gfxFilterSaturate',
                    blockType: BlockType.COMMAND,
                    text: 'canvas filter saturate [SATURATION]%',
                    arguments: {
                        SATURATION: {type: ArgumentType.NUMBER, defaultValue: 150}
                    },
                    doc: { description: 'Apply CSS saturate filter to the overlay canvas.' }
                },
                {
                    opcode: 'gfxFilterHueRotate',
                    blockType: BlockType.COMMAND,
                    text: 'canvas filter hue-rotate [DEG] deg',
                    arguments: {
                        DEG: {type: ArgumentType.NUMBER, defaultValue: 90}
                    },
                    doc: { description: 'Apply CSS hue-rotate filter to the overlay canvas.' }
                },
                {
                    opcode: 'gfxFilterBlur',
                    blockType: BlockType.COMMAND,
                    text: 'canvas filter blur [PX] px',
                    arguments: {
                        PX: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: { description: 'Apply CSS blur filter to the overlay canvas.' }
                },
                {
                    opcode: 'gfxFilterInvert',
                    blockType: BlockType.COMMAND,
                    text: 'canvas filter invert',
                    doc: { description: 'Apply CSS invert(100%) filter to the overlay canvas.' }
                },
                {
                    opcode: 'gfxFilterSepia',
                    blockType: BlockType.COMMAND,
                    text: 'canvas filter sepia',
                    doc: { description: 'Apply CSS sepia(100%) filter to the overlay canvas.' }
                },
                {
                    opcode: 'gfxResetFilters',
                    blockType: BlockType.COMMAND,
                    text: 'reset canvas filters',
                    doc: { description: 'Remove all CSS filters from the overlay canvas.' }
                },
                '---',
                {
                    opcode: 'gfxMandelbrot',
                    blockType: BlockType.COMMAND,
                    text: 'render mandelbrot x:[X] y:[Y] zoom:[ZOOM] max iter:[MAX_ITER]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: -0.5},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        ZOOM: {type: ArgumentType.NUMBER, defaultValue: 200},
                        MAX_ITER: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Render the Mandelbrot set fractal on the overlay canvas.' }
                },
                {
                    opcode: 'gfxJulia',
                    blockType: BlockType.COMMAND,
                    text: 'render julia x:[X] y:[Y] cx:[CX] cy:[CY] max iter:[MAX_ITER]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        CX: {type: ArgumentType.NUMBER, defaultValue: -0.7},
                        CY: {type: ArgumentType.NUMBER, defaultValue: 0.27},
                        MAX_ITER: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Render the Julia set fractal on the overlay canvas.' }
                },
                {
                    opcode: 'gfxCellularAutomata',
                    blockType: BlockType.COMMAND,
                    text: 'render 1D cellular automata rule [RULES] generations [GENERATIONS]',
                    arguments: {
                        RULES: {type: ArgumentType.NUMBER, defaultValue: 30},
                        GENERATIONS: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Render 1D cellular automata (Wolfram Rule) starting from a single cell.' }
                },
                {
                    opcode: 'gxfGameOfLife',
                    blockType: BlockType.COMMAND,
                    text: 'render game of life seed [SEED] generations [GENERATIONS]',
                    arguments: {
                        SEED: {type: ArgumentType.STRING, defaultValue: '[[1,1],[2,2],[3,0],[3,1],[3,2]]'},
                        GENERATIONS: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: { description: 'Render Conway\'s Game of Life from a JSON seed grid for the given number of generations.' }
                },
                {
                    opcode: 'gfxPerlinNoise',
                    blockType: BlockType.COMMAND,
                    text: 'render perlin noise w:[WIDTH] h:[HEIGHT] scale:[SCALE]',
                    arguments: {
                        WIDTH: {type: ArgumentType.NUMBER, defaultValue: 256},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 256},
                        SCALE: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Render value noise with interpolation on the overlay canvas.' }
                },
                '---',
                {
                    opcode: 'gfxTurtleForward',
                    blockType: BlockType.COMMAND,
                    text: 'turtle forward [DISTANCE]',
                    arguments: {
                        DISTANCE: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Move the turtle forward by the given distance, drawing a line if pen is down.' }
                },
                {
                    opcode: 'gfxTurtleTurn',
                    blockType: BlockType.COMMAND,
                    text: 'turtle turn right [ANGLE] deg',
                    arguments: {
                        ANGLE: {type: ArgumentType.NUMBER, defaultValue: 90}
                    },
                    doc: { description: 'Turn the turtle right by the given angle in degrees.' }
                },
                {
                    opcode: 'gfxTurtlePenUp',
                    blockType: BlockType.COMMAND,
                    text: 'turtle pen up',
                    doc: { description: 'Lift the turtle pen so it stops drawing when moving.' }
                },
                {
                    opcode: 'gfxTurtlePenDown',
                    blockType: BlockType.COMMAND,
                    text: 'turtle pen down',
                    doc: { description: 'Lower the turtle pen so it draws when moving.' }
                },
                {
                    opcode: 'gfxTurtleReset',
                    blockType: BlockType.COMMAND,
                    text: 'turtle reset',
                    doc: { description: 'Reset the turtle to the center facing upward and clear drawings.' }
                },
                {
                    opcode: 'gfxTurtleSetPos',
                    blockType: BlockType.COMMAND,
                    text: 'turtle set position x:[X] y:[Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 200},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 200}
                    },
                    doc: { description: 'Teleport the turtle to the specified position without drawing.' }
                },
                {
                    opcode: 'gfxTurtleSetHeading',
                    blockType: BlockType.COMMAND,
                    text: 'turtle set heading [ANGLE] deg',
                    arguments: {
                        ANGLE: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: { description: 'Set the turtle heading to an absolute angle in degrees.' }
                },
                {
                    opcode: 'gfxLSystem',
                    blockType: BlockType.COMMAND,
                    text: 'render L-system axiom [AXIOM] rules [RULES] iterations [ITERATIONS] angle [ANGLE] dist [DISTANCE]',
                    arguments: {
                        AXIOM: {type: ArgumentType.STRING, defaultValue: 'F'},
                        RULES: {type: ArgumentType.STRING, defaultValue: '{"F":"FF+[+F-F-F]"}'},
                        ITERATIONS: {type: ArgumentType.NUMBER, defaultValue: 3},
                        ANGLE: {type: ArgumentType.NUMBER, defaultValue: 25},
                        DISTANCE: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    doc: { description: 'Render an L-System fractal using the given axiom, rules (JSON), iterations, angle, and step distance.' }
                }
            ],
            menus: {
                textAlignMenu: {
                    acceptReporters: true,
                    items: ['left', 'center', 'right']
                }
            }
        };
    }

    gfxDrawRect (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const w = Cast.toNumber(args.W);
            const h = Cast.toNumber(args.H);
            const color = Cast.toString(args.COLOR);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        } catch (e) {
            log.warn('gfxDrawRect error:', e);
        }
    }

    gfxDrawCircle (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const r = Cast.toNumber(args.R);
            const color = Cast.toString(args.COLOR);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        } catch (e) {
            log.warn('gfxDrawCircle error:', e);
        }
    }

    gfxDrawLine (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            const color = Cast.toString(args.COLOR);
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } catch (e) {
            log.warn('gfxDrawLine error:', e);
        }
    }

    gfxDrawText (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const text = Cast.toString(args.TEXT);
            const color = Cast.toString(args.COLOR);
            const size = Cast.toNumber(args.SIZE);
            ctx.fillStyle = color;
            ctx.font = `${size}px sans-serif`;
            ctx.fillText(text, x, y);
        } catch (e) {
            log.warn('gfxDrawText error:', e);
        }
    }

    gfxClear () {
        try {
            if (this._canvas && this._ctx) {
                this._ctx.setTransform(1, 0, 0, 1, 0, 0);
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            }
        } catch (e) {
            log.warn('gfxClear error:', e);
        }
    }

    gfxSetOpacity (args) {
        if (!args) return;
        try {
            let opacity = Cast.toNumber(args.OPACITY);
            opacity = Math.max(0, Math.min(100, opacity)) / 100;
            this._opacity = opacity;
            if (this._canvas) {
                this._canvas.style.opacity = opacity;
            }
        } catch (e) {
            log.warn('gfxSetOpacity error:', e);
        }
    }

    gfxBackground (args) {
        if (!args) return;
        try {
            const color = Cast.toString(args.COLOR);
            if (this._canvas) {
                this._canvas.style.background = color;
            }
        } catch (e) {
            log.warn('gfxBackground error:', e);
        }
    }

    gfxScreenToStage (args) {
        if (!args) return '[0,0]';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const stage = document.querySelector('.stage_stage-wrapper_owner_');
            if (stage) {
                const rect = stage.getBoundingClientRect();
                return JSON.stringify([x - rect.left, y - rect.top]);
            }
            return JSON.stringify([x, y]);
        } catch (e) {
            return '[0,0]';
        }
    }

    gfxDrawPolygon (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const sides = Math.max(3, Math.floor(Cast.toNumber(args.SIDES)));
            const radius = Cast.toNumber(args.RADIUS);
            const color = Cast.toString(args.COLOR);
            ctx.fillStyle = color;
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
                const px = x + radius * Math.cos(angle);
                const py = y + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        } catch (e) {
            log.warn('gfxDrawPolygon error:', e);
        }
    }

    gfxDrawStar (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const points = Math.max(3, Math.floor(Cast.toNumber(args.POINTS)));
            const r1 = Cast.toNumber(args.R1);
            const r2 = Cast.toNumber(args.R2);
            const color = Cast.toString(args.COLOR);
            ctx.fillStyle = color;
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? r1 : r2;
                const angle = (Math.PI * i) / points - Math.PI / 2;
                const px = x + radius * Math.cos(angle);
                const py = y + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        } catch (e) {
            log.warn('gfxDrawStar error:', e);
        }
    }

    gfxDrawArc (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const r = Cast.toNumber(args.R);
            const start = Cast.toNumber(args.START) * Math.PI / 180;
            const end = Cast.toNumber(args.END) * Math.PI / 180;
            const color = Cast.toString(args.COLOR);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, r, start, end);
            ctx.stroke();
        } catch (e) {
            log.warn('gfxDrawArc error:', e);
        }
    }

    gfxDrawEllipse (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const rx = Cast.toNumber(args.RX);
            const ry = Cast.toNumber(args.RY);
            const color = Cast.toString(args.COLOR);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        } catch (e) {
            log.warn('gfxDrawEllipse error:', e);
        }
    }

    gfxSetStroke (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const color = Cast.toString(args.COLOR);
            const width = Cast.toNumber(args.WIDTH);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
        } catch (e) {
            log.warn('gfxSetStroke error:', e);
        }
    }

    gfxSetFill (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const color = Cast.toString(args.COLOR);
            ctx.fillStyle = color;
        } catch (e) {
            log.warn('gfxSetFill error:', e);
        }
    }

    gfxGradient (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            const c1 = Cast.toString(args.C1);
            const c2 = Cast.toString(args.C2);
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, c1);
            gradient.addColorStop(1, c2);
            ctx.fillStyle = gradient;
        } catch (e) {
            log.warn('gfxGradient error:', e);
        }
    }

    gfxSetShadow (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const blur = Cast.toNumber(args.BLUR);
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const color = Cast.toString(args.COLOR);
            ctx.shadowBlur = blur;
            ctx.shadowOffsetX = x;
            ctx.shadowOffsetY = y;
            ctx.shadowColor = color;
        } catch (e) {
            log.warn('gfxSetShadow error:', e);
        }
    }

    gfxTranslate (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            ctx.translate(x, y);
        } catch (e) {
            log.warn('gfxTranslate error:', e);
        }
    }

    gfxRotate (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const angle = Cast.toNumber(args.ANGLE) * Math.PI / 180;
            ctx.rotate(angle);
        } catch (e) {
            log.warn('gfxRotate error:', e);
        }
    }

    gfxScale (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            ctx.scale(x, y);
        } catch (e) {
            log.warn('gfxScale error:', e);
        }
    }

    gfxSave () {
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            ctx.save();
        } catch (e) {
            log.warn('gfxSave error:', e);
        }
    }

    gfxRestore () {
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            ctx.restore();
        } catch (e) {
            log.warn('gfxRestore error:', e);
        }
    }

    gfxSnapshot () {
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return '';
            return this._canvas.toDataURL();
        } catch (e) {
            return '';
        }
    }

    gfxPixelGet (args) {
        if (!args) return '';
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return '';
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const data = ctx.getImageData(x, y, 1, 1).data;
            const r = data[0].toString(16).padStart(2, '0');
            const g = data[1].toString(16).padStart(2, '0');
            const b = data[2].toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        } catch (e) {
            return '';
        }
    }

    gfxPixelSet (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const color = Cast.toString(args.COLOR);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        } catch (e) {
            log.warn('gfxPixelSet error:', e);
        }
    }

    gfxSetFont (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const font = Cast.toString(args.FONT);
            const size = Cast.toNumber(args.SIZE);
            ctx.font = `${size}px ${font}`;
        } catch (e) {
            log.warn('gfxSetFont error:', e);
        }
    }

    gfxSetTextAlign (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const align = Cast.toString(args.ALIGN);
            ctx.textAlign = align;
        } catch (e) {
            log.warn('gfxSetTextAlign error:', e);
        }
    }

    gfxMeasureText (args) {
        if (!args) return 0;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return 0;
            const text = Cast.toString(args.TEXT);
            return ctx.measureText(text).width;
        } catch (e) {
            return 0;
        }
    }

    gfxDrawImage (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const url = Cast.toString(args.URL);
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            if (!url) return;
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, x, y);
            };
            img.onerror = () => {};
            img.src = url;
        } catch (e) {
            log.warn('gfxDrawImage error:', e);
        }
    }

    gfxSetGlobalAlpha (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const alpha = Cast.toNumber(args.ALPHA);
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        } catch (e) {
            log.warn('gfxSetGlobalAlpha error:', e);
        }
    }

    gfxSetLineDash (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const segmentsStr = Cast.toString(args.SEGMENTS);
            let segments = [];
            try {
                segments = JSON.parse(segmentsStr);
            } catch (e) {
                segments = [5, 5];
            }
            if (!Array.isArray(segments)) segments = [5, 5];
            ctx.setLineDash(segments);
        } catch (e) {
            log.warn('gfxSetLineDash error:', e);
        }
    }

    gfxRoundedRect (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const w = Cast.toNumber(args.W);
            const h = Cast.toNumber(args.H);
            const r = Math.min(Cast.toNumber(args.R), Math.min(w, h) / 2);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();
        } catch (e) {
            log.warn('gfxRoundedRect error:', e);
        }
    }

    gfxBezierCurve (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const cx1 = Cast.toNumber(args.CX1);
            const cy1 = Cast.toNumber(args.CY1);
            const cx2 = Cast.toNumber(args.CX2);
            const cy2 = Cast.toNumber(args.CY2);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
            ctx.stroke();
        } catch (e) {
            log.warn('gfxBezierCurve error:', e);
        }
    }

    _applyFilters () {
        if (!this._canvas) return;
        try {
            const parts = [];
            if (this._filters.brightness !== null) parts.push(`brightness(${this._filters.brightness}%)`);
            if (this._filters.contrast !== null) parts.push(`contrast(${this._filters.contrast}%)`);
            if (this._filters.saturate !== null) parts.push(`saturate(${this._filters.saturate}%)`);
            if (this._filters.hueRotate !== null) parts.push(`hue-rotate(${this._filters.hueRotate}deg)`);
            if (this._filters.blur !== null) parts.push(`blur(${this._filters.blur}px)`);
            if (this._filters.invert) parts.push('invert(100%)');
            if (this._filters.sepia) parts.push('sepia(100%)');
            this._canvas.style.filter = parts.join(' ');
        } catch (e) {
            log.warn('_applyFilters error:', e);
        }
    }

    gfxFilterBrightness (args) {
        if (!args) return;
        try {
            this._filters.brightness = Cast.toNumber(args.BRIGHTNESS);
            this._applyFilters();
        } catch (e) {
            log.warn('gfxFilterBrightness error:', e);
        }
    }

    gfxFilterContrast (args) {
        if (!args) return;
        try {
            this._filters.contrast = Cast.toNumber(args.CONTRAST);
            this._applyFilters();
        } catch (e) {
            log.warn('gfxFilterContrast error:', e);
        }
    }

    gfxFilterSaturate (args) {
        if (!args) return;
        try {
            this._filters.saturate = Cast.toNumber(args.SATURATION);
            this._applyFilters();
        } catch (e) {
            log.warn('gfxFilterSaturate error:', e);
        }
    }

    gfxFilterHueRotate (args) {
        if (!args) return;
        try {
            this._filters.hueRotate = Cast.toNumber(args.DEG);
            this._applyFilters();
        } catch (e) {
            log.warn('gfxFilterHueRotate error:', e);
        }
    }

    gfxFilterBlur (args) {
        if (!args) return;
        try {
            this._filters.blur = Cast.toNumber(args.PX);
            this._applyFilters();
        } catch (e) {
            log.warn('gfxFilterBlur error:', e);
        }
    }

    gfxFilterInvert () {
        try {
            this._filters.invert = true;
            this._applyFilters();
        } catch (e) {
            log.warn('gfxFilterInvert error:', e);
        }
    }

    gfxFilterSepia () {
        try {
            this._filters.sepia = true;
            this._applyFilters();
        } catch (e) {
            log.warn('gfxFilterSepia error:', e);
        }
    }

    gfxResetFilters () {
        try {
            this._filters = {brightness: null, contrast: null, saturate: null, hueRotate: null, blur: null, invert: false, sepia: false};
            if (this._canvas) this._canvas.style.filter = '';
        } catch (e) {
            log.warn('gfxResetFilters error:', e);
        }
    }

    gfxMandelbrot (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const centerX = Cast.toNumber(args.X);
            const centerY = Cast.toNumber(args.Y);
            const zoom = Math.max(1, Cast.toNumber(args.ZOOM));
            const maxIter = Math.max(1, Math.floor(Cast.toNumber(args.MAX_ITER)));
            const w = this._canvas.width;
            const h = this._canvas.height;
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;
            for (let px = 0; px < w; px++) {
                for (let py = 0; py < h; py++) {
                    const x0 = centerX + (px - w / 2) / zoom;
                    const y0 = centerY + (py - h / 2) / zoom;
                    let x = 0, y = 0;
                    let iter = 0;
                    while (x * x + y * y <= 4 && iter < maxIter) {
                        const xt = x * x - y * y + x0;
                        y = 2 * x * y + y0;
                        x = xt;
                        iter++;
                    }
                    const idx = (py * w + px) * 4;
                    if (iter === maxIter) {
                        data[idx] = 0; data[idx + 1] = 0; data[idx + 2] = 0; data[idx + 3] = 255;
                    } else {
                        const c = Math.floor(iter * 255 / maxIter);
                        data[idx] = c; data[idx + 1] = c; data[idx + 2] = c; data[idx + 3] = 255;
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
        } catch (e) {
            log.warn('gfxMandelbrot error:', e);
        }
    }

    gfxJulia (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const centerX = Cast.toNumber(args.X);
            const centerY = Cast.toNumber(args.Y);
            const cx = Cast.toNumber(args.CX);
            const cy = Cast.toNumber(args.CY);
            const maxIter = Math.max(1, Math.floor(Cast.toNumber(args.MAX_ITER)));
            const w = this._canvas.width;
            const h = this._canvas.height;
            const zoom = 200;
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;
            for (let px = 0; px < w; px++) {
                for (let py = 0; py < h; py++) {
                    let x = centerX + (px - w / 2) / zoom;
                    let y = centerY + (py - h / 2) / zoom;
                    let iter = 0;
                    while (x * x + y * y <= 4 && iter < maxIter) {
                        const xt = x * x - y * y + cx;
                        y = 2 * x * y + cy;
                        x = xt;
                        iter++;
                    }
                    const idx = (py * w + px) * 4;
                    if (iter === maxIter) {
                        data[idx] = 0; data[idx + 1] = 0; data[idx + 2] = 0; data[idx + 3] = 255;
                    } else {
                        const c = Math.floor(iter * 255 / maxIter);
                        data[idx] = c; data[idx + 1] = c; data[idx + 2] = c; data[idx + 3] = 255;
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
        } catch (e) {
            log.warn('gfxJulia error:', e);
        }
    }

    gfxCellularAutomata (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const rule = Math.floor(Cast.toNumber(args.RULES)) & 255;
            const generations = Math.max(1, Math.floor(Cast.toNumber(args.GENERATIONS)));
            const w = this._canvas.width;
            const cellW = Math.max(1, Math.floor(w / generations));
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, w, this._canvas.height);
            ctx.fillStyle = '#000';
            let cells = [];
            for (let i = 0; i < generations * 2 + 1; i++) cells.push(0);
            cells[generations] = 1;
            for (let gen = 0; gen < generations; gen++) {
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i]) {
                        ctx.fillRect(i * cellW, gen * cellW, cellW, cellW);
                    }
                }
                const next = [];
                for (let i = 0; i < cells.length; i++) {
                    const left = i > 0 ? cells[i - 1] : 0;
                    const center = cells[i];
                    const right = i < cells.length - 1 ? cells[i + 1] : 0;
                    const idx = (left << 2) | (center << 1) | right;
                    next[i] = (rule >> idx) & 1;
                }
                cells = next;
            }
        } catch (e) {
            log.warn('gfxCellularAutomata error:', e);
        }
    }

    gxfGameOfLife (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const seedStr = Cast.toString(args.SEED);
            const generations = Math.max(1, Math.floor(Cast.toNumber(args.GENERATIONS)));
            if (!seedStr) return;
            let seedCells;
            try {
                seedCells = JSON.parse(seedStr);
            } catch (e) {
                seedCells = [];
            }
            if (!Array.isArray(seedCells)) seedCells = [];
            const w = this._canvas.width;
            const cellSize = 4;
            const cols = Math.floor(w / cellSize);
            const rows = Math.floor(this._canvas.height / cellSize);
            let grid = [];
            for (let y = 0; y < rows; y++) {
                grid[y] = [];
                for (let x = 0; x < cols; x++) grid[y][x] = 0;
            }
            for (let i = 0; i < seedCells.length; i++) {
                const p = seedCells[i];
                if (Array.isArray(p) && p.length >= 2) {
                    const sx = Math.floor(Cast.toNumber(p[0]));
                    const sy = Math.floor(Cast.toNumber(p[1]));
                    if (sx >= 0 && sx < cols && sy >= 0 && sy < rows) grid[sy][sx] = 1;
                }
            }
            for (let gen = 0; gen < generations; gen++) {
                const next = [];
                for (let y = 0; y < rows; y++) {
                    next[y] = [];
                    for (let x = 0; x < cols; x++) {
                        let neighbors = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                if (dx === 0 && dy === 0) continue;
                                const ny = y + dy, nx = x + dx;
                                if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && grid[ny][nx]) neighbors++;
                            }
                        }
                        if (grid[y][x]) {
                            next[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                        } else {
                            next[y][x] = (neighbors === 3) ? 1 : 0;
                        }
                    }
                }
                grid = next;
            }
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, w, this._canvas.height);
            ctx.fillStyle = '#000';
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (grid[y][x]) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        } catch (e) {
            log.warn('gxfGameOfLife error:', e);
        }
    }

    gfxPerlinNoise (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const width = Math.max(1, Math.floor(Cast.toNumber(args.WIDTH)));
            const height = Math.max(1, Math.floor(Cast.toNumber(args.HEIGHT)));
            const scale = Math.max(1, Cast.toNumber(args.SCALE));
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;
            const hash = (x, y) => {
                const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
                return n - Math.floor(n);
            };
            const smoothNoise = (x, y) => {
                const ix = Math.floor(x), iy = Math.floor(y);
                const fx = x - ix, fy = y - iy;
                const sx = fx * fx * (3 - 2 * fx);
                const sy = fy * fy * (3 - 2 * fy);
                const v00 = hash(ix, iy);
                const v10 = hash(ix + 1, iy);
                const v01 = hash(ix, iy + 1);
                const v11 = hash(ix + 1, iy + 1);
                const top = v00 + (v10 - v00) * sx;
                const bot = v01 + (v11 - v01) * sx;
                return top + (bot - top) * sy;
            };
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const val = smoothNoise(x / scale, y / scale);
                    const c = Math.floor(val * 255);
                    const idx = (y * width + x) * 4;
                    data[idx] = c; data[idx + 1] = c; data[idx + 2] = c; data[idx + 3] = 255;
                }
            }
            ctx.putImageData(imageData, 0, 0);
        } catch (e) {
            log.warn('gfxPerlinNoise error:', e);
        }
    }

    gfxTurtleForward (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const dist = Cast.toNumber(args.DISTANCE);
            const rad = this._turtleHeading * Math.PI / 180;
            const nx = this._turtleX + dist * Math.cos(rad);
            const ny = this._turtleY + dist * Math.sin(rad);
            if (this._turtlePen) {
                ctx.beginPath();
                ctx.moveTo(this._turtleX, this._turtleY);
                ctx.lineTo(nx, ny);
                ctx.stroke();
            }
            this._turtleX = nx;
            this._turtleY = ny;
        } catch (e) {
            log.warn('gfxTurtleForward error:', e);
        }
    }

    gfxTurtleTurn (args) {
        if (!args) return;
        try {
            this._turtleHeading += Cast.toNumber(args.ANGLE);
        } catch (e) {
            log.warn('gfxTurtleTurn error:', e);
        }
    }

    gfxTurtlePenUp () {
        try {
            this._turtlePen = false;
        } catch (e) {
            log.warn('gfxTurtlePenUp error:', e);
        }
    }

    gfxTurtlePenDown () {
        try {
            this._turtlePen = true;
        } catch (e) {
            log.warn('gfxTurtlePenDown error:', e);
        }
    }

    gfxTurtleReset () {
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            this._turtleX = this._canvas.width / 2;
            this._turtleY = this._canvas.height / 2;
            this._turtleHeading = -90;
            this._turtlePen = true;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        } catch (e) {
            log.warn('gfxTurtleReset error:', e);
        }
    }

    gfxTurtleSetPos (args) {
        if (!args) return;
        try {
            this._turtleX = Cast.toNumber(args.X);
            this._turtleY = Cast.toNumber(args.Y);
        } catch (e) {
            log.warn('gfxTurtleSetPos error:', e);
        }
    }

    gfxTurtleSetHeading (args) {
        if (!args) return;
        try {
            this._turtleHeading = Cast.toNumber(args.ANGLE);
        } catch (e) {
            log.warn('gfxTurtleSetHeading error:', e);
        }
    }

    gfxLSystem (args) {
        if (!args) return;
        try {
            const ctx = this._ensureCanvas();
            if (!ctx) return;
            const axiom = Cast.toString(args.AXIOM);
            const rulesStr = Cast.toString(args.RULES);
            const iterations = Math.max(0, Math.floor(Cast.toNumber(args.ITERATIONS)));
            const angle = Cast.toNumber(args.ANGLE);
            const dist = Cast.toNumber(args.DISTANCE);
            if (!axiom || !rulesStr) return;
            let rules;
            try {
                rules = JSON.parse(rulesStr);
            } catch (e) {
                return;
            }
            if (typeof rules !== 'object') return;
            let current = axiom;
            for (let i = 0; i < iterations; i++) {
                let next = '';
                for (let j = 0; j < current.length; j++) {
                    const ch = current[j];
                    next += rules[ch] || ch;
                }
                current = next;
            }
            const w = this._canvas.width;
            const h = this._canvas.height;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            let x = w / 2, y = h;
            let heading = -90;
            const stack = [];
            for (let i = 0; i < current.length; i++) {
                const ch = current[i];
                if (ch === 'F' || ch === 'f') {
                    const rad = heading * Math.PI / 180;
                    const nx = x + dist * Math.cos(rad);
                    const ny = y + dist * Math.sin(rad);
                    if (ch === 'F') {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(nx, ny);
                        ctx.stroke();
                    }
                    x = nx;
                    y = ny;
                } else if (ch === '+') {
                    heading += angle;
                } else if (ch === '-') {
                    heading -= angle;
                } else if (ch === '[') {
                    stack.push({x, y, heading});
                } else if (ch === ']') {
                    const state = stack.pop();
                    if (state) {
                        x = state.x;
                        y = state.y;
                        heading = state.heading;
                    }
                }
            }
        } catch (e) {
            log.warn('gfxLSystem error:', e);
        }
    }
}

module.exports = ScratchProGFXBlocks;
