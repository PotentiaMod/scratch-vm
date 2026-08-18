const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class ScratchProGameBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.particleContainer = null;
        this.particleElements = [];
        this.particleAnimFrame = null;
        this.timers = {};
    }

    getInfo() {
        return {
            id: 'scratchproGame',
            name: 'Game',
            color1: '#A663FF',
            color2: '#8847E6',
            color3: '#6B2ECC',
            blocks: [
                {
                    opcode: 'gameAStar',
                    blockType: BlockType.REPORTER,
                    text: 'A* pathfind on [MAP] from [START] to [END]',
                    arguments: {
                        MAP: {type: ArgumentType.STRING, defaultValue: '[[0,0,0],[0,1,0],[0,0,0]]'},
                        START: {type: ArgumentType.STRING, defaultValue: '[0,0]'},
                        END: {type: ArgumentType.STRING, defaultValue: '[2,2]'}
                    },
                    doc: { description: 'Find the shortest path using the A* algorithm on a 2D grid where 0 is passable and 1 is a wall.', returns: { type: 'string', description: 'A JSON array of [x,y] coordinate pairs representing the path' } }
                },
                {
                    opcode: 'gameCreateTilemap',
                    blockType: BlockType.REPORTER,
                    text: 'create tilemap [W] x [H]',
                    arguments: {
                        W: {type: ArgumentType.NUMBER, defaultValue: 5},
                        H: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: { description: 'Create a new 2D tilemap grid filled with zeros of the given width and height.', returns: { type: 'string', description: 'A JSON array of arrays representing the tilemap' } }
                },
                {
                    opcode: 'gameTilemapGet',
                    blockType: BlockType.REPORTER,
                    text: 'tile at [X] [Y] in [MAP]',
                    arguments: {
                        MAP: {type: ArgumentType.STRING, defaultValue: '[[0,0],[0,0]]'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: { description: 'Get the tile value at the specified position in a tilemap grid.', returns: { type: 'number', description: 'The tile value at (x, y)' } }
                },
                {
                    opcode: 'gameTilemapSet',
                    blockType: BlockType.REPORTER,
                    text: 'set tile [X] [Y] to [VALUE] in [MAP]',
                    arguments: {
                        MAP: {type: ArgumentType.STRING, defaultValue: '[[0,0],[0,0]]'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: { description: 'Set a tile at the specified position in a tilemap to a new value.', returns: { type: 'string', description: 'The updated tilemap as a JSON array' } }
                },
                '---',
                {
                    opcode: 'gameDistance',
                    blockType: BlockType.REPORTER,
                    text: 'manhattan distance [X1],[Y1] to [X2],[Y2]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 3},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: { description: 'Calculate the Manhattan distance between two 2D points.', returns: { type: 'number', description: 'The Manhattan distance' } }
                },
                {
                    opcode: 'gameEuclidean',
                    blockType: BlockType.REPORTER,
                    text: 'euclidean distance [X1],[Y1] to [X2],[Y2]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 3},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: { description: 'Calculate the straight-line Euclidean distance between two 2D points.', returns: { type: 'number', description: 'The Euclidean distance' } }
                },
                {
                    opcode: 'gameChebyshev',
                    blockType: BlockType.REPORTER,
                    text: 'chebyshev distance [X1],[Y1] to [X2],[Y2]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 3},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: { description: 'Calculate the Chebyshev (chessboard) distance between two 2D points.', returns: { type: 'number', description: 'The Chebyshev distance' } }
                },
                '---',
                {
                    opcode: 'gameLerp3',
                    blockType: BlockType.REPORTER,
                    text: 'lerp [A] to [B] by [T]',
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: '[0,0,0]'},
                        B: {type: ArgumentType.STRING, defaultValue: '[100,200,50]'},
                        T: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    },
                    doc: { description: 'Linearly interpolate between two 3D vectors [x,y,z] by factor t (0-1).', returns: { type: 'string', description: 'A JSON array [x,y,z] of the interpolated vector' } }
                },
                {
                    opcode: 'gameSmoothstep',
                    blockType: BlockType.REPORTER,
                    text: 'smoothstep [T]',
                    arguments: {
                        T: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    },
                    doc: { description: 'Apply the smoothstep easing function (3t^2 - 2t^3) to a value t (0-1).', returns: { type: 'number', description: 'The smoothed value between 0 and 1' } }
                },
                {
                    opcode: 'gameEaseInOut',
                    blockType: BlockType.REPORTER,
                    text: 'ease in-out [T]',
                    arguments: {
                        T: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    },
                    doc: { description: 'Apply the cubic ease-in-out function to a value t (0-1) for smooth acceleration and deceleration.', returns: { type: 'number', description: 'The eased value between 0 and 1' } }
                },
                {
                    opcode: 'gameClampVector',
                    blockType: BlockType.REPORTER,
                    text: 'clamp vector [X],[Y] to max [MAX]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 5},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 10},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 8}
                    },
                    doc: { description: 'Clamp a 2D vector magnitude to a maximum value while preserving direction.', returns: { type: 'string', description: 'A JSON array [x,y] of the clamped vector' } }
                },
                '---',
                {
                    opcode: 'gameParticleEmit',
                    blockType: BlockType.COMMAND,
                    text: 'emit [COUNT] particles at [X],[Y] speed [SPEED] color [COLOR]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        COUNT: {type: ArgumentType.NUMBER, defaultValue: 10},
                        SPEED: {type: ArgumentType.NUMBER, defaultValue: 50},
                        COLOR: {type: ArgumentType.STRING, defaultValue: '#ff6600'}
                    },
                    doc: { description: 'Emit a burst of particles from the given position with the specified speed and color.' }
                },
                {
                    opcode: 'gameParticleClear',
                    blockType: BlockType.COMMAND,
                    text: 'clear particles',
                    doc: { description: 'Remove all active particle effects from the screen.' }
                },
                '---',
                {
                    opcode: 'gameTimerStart',
                    blockType: BlockType.COMMAND,
                    text: 'start timer [ID]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, defaultValue: 'timer1'}
                    },
                    doc: { description: 'Start a named timer that begins counting elapsed milliseconds.' }
                },
                {
                    opcode: 'gameTimerElapsed',
                    blockType: BlockType.REPORTER,
                    text: 'timer [ID] elapsed',
                    arguments: {
                        ID: {type: ArgumentType.STRING, defaultValue: 'timer1'}
                    },
                    doc: { description: 'Get the elapsed time in milliseconds since the named timer was started.', returns: { type: 'number', description: 'Elapsed time in milliseconds' } }
                },
                {
                    opcode: 'gameTimerStop',
                    blockType: BlockType.REPORTER,
                    text: 'stop timer [ID]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, defaultValue: 'timer1'}
                    },
                    doc: { description: 'Stop and delete the named timer, returning the final elapsed time in milliseconds.', returns: { type: 'number', description: 'Final elapsed time in milliseconds' } }
                },
                '---',
                {
                    opcode: 'gameNoise2D',
                    blockType: BlockType.REPORTER,
                    text: '2D noise at [X] [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 1.5},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 3.7}
                    },
                    doc: { description: 'Generate a simple 2D value noise value between 0 and 1 using a hash-based noise function.', returns: { type: 'number', description: 'A noise value between 0 and 1' } }
                },
                {
                    opcode: 'gameSeededRandom',
                    blockType: BlockType.REPORTER,
                    text: 'seeded random [SEED]',
                    arguments: {
                        SEED: {type: ArgumentType.NUMBER, defaultValue: 42}
                    },
                    doc: { description: 'Generate a deterministic pseudo-random number between 0 and 1 using mulberry32 algorithm.', returns: { type: 'number', description: 'A pseudo-random number between 0 and 1' } }
                },
                {
                    opcode: 'gameMapToScreen',
                    blockType: BlockType.REPORTER,
                    text: 'world [X] [Y] to screen cam [CAM_X] [CAM_Y] zoom [ZOOM]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        CAM_X: {type: ArgumentType.NUMBER, defaultValue: 50},
                        CAM_Y: {type: ArgumentType.NUMBER, defaultValue: 50},
                        ZOOM: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: { description: 'Convert world coordinates to screen coordinates given camera position and zoom factor.', returns: { type: 'string', description: 'A JSON array [screenX, screenY]' } }
                },
                {
                    opcode: 'gameScreenToWorld',
                    blockType: BlockType.REPORTER,
                    text: 'screen [X] [Y] to world cam [CAM_X] [CAM_Y] zoom [ZOOM]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        CAM_X: {type: ArgumentType.NUMBER, defaultValue: 50},
                        CAM_Y: {type: ArgumentType.NUMBER, defaultValue: 50},
                        ZOOM: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: { description: 'Convert screen coordinates to world coordinates given camera position and zoom factor.', returns: { type: 'string', description: 'A JSON array [worldX, worldY]' } }
                },
                {
                    opcode: 'gameRectCollision',
                    blockType: BlockType.BOOLEAN,
                    text: 'rect ([X1],[Y1],[W1],[H1]) hits ([X2],[Y2],[W2],[H2])?',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        W1: {type: ArgumentType.NUMBER, defaultValue: 50},
                        H1: {type: ArgumentType.NUMBER, defaultValue: 50},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 25},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 25},
                        W2: {type: ArgumentType.NUMBER, defaultValue: 50},
                        H2: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Check if two axis-aligned rectangles overlap (AABB collision).', returns: { type: 'boolean', description: 'true if colliding, false otherwise' } }
                },
                {
                    opcode: 'gameCircleCollision',
                    blockType: BlockType.BOOLEAN,
                    text: 'circle ([X1],[Y1],r[R1]) hits ([X2],[Y2],r[R2])?',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        R1: {type: ArgumentType.NUMBER, defaultValue: 30},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 50},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 0},
                        R2: {type: ArgumentType.NUMBER, defaultValue: 30}
                    },
                    doc: { description: 'Check if two circles overlap by comparing the distance between centers to the sum of radii.', returns: { type: 'boolean', description: 'true if colliding, false otherwise' } }
                },
                {
                    opcode: 'gamePointInRect',
                    blockType: BlockType.BOOLEAN,
                    text: 'point ([PX],[PY]) in rect ([RX],[RY],[RW],[RH])?',
                    arguments: {
                        PX: {type: ArgumentType.NUMBER, defaultValue: 25},
                        PY: {type: ArgumentType.NUMBER, defaultValue: 25},
                        RX: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RY: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RW: {type: ArgumentType.NUMBER, defaultValue: 100},
                        RH: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Check if a point is inside an axis-aligned rectangle.', returns: { type: 'boolean', description: 'true if the point is inside, false otherwise' } }
                },
                '---',
                {
                    opcode: 'gameSeek',
                    blockType: BlockType.REPORTER,
                    text: 'seek [X],[Y] towards [TARGET_X],[TARGET_Y] speed [SPEED]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        TARGET_X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        TARGET_Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        SPEED: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: { description: 'Steering force towards a target position.', returns: { type: 'string', description: 'JSON object {dx, dy}' } }
                },
                {
                    opcode: 'gameFlee',
                    blockType: BlockType.REPORTER,
                    text: 'flee [X],[Y] from [TARGET_X],[TARGET_Y] speed [SPEED]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        TARGET_X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        TARGET_Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        SPEED: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: { description: 'Steering force away from a target position (opposite of seek).', returns: { type: 'string', description: 'JSON object {dx, dy}' } }
                },
                {
                    opcode: 'gameArrive',
                    blockType: BlockType.REPORTER,
                    text: 'arrive [X],[Y] at [TARGET_X],[TARGET_Y] speed [SPEED] slow radius [SLOW_RADIUS]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        TARGET_X: {type: ArgumentType.NUMBER, defaultValue: 100},
                        TARGET_Y: {type: ArgumentType.NUMBER, defaultValue: 100},
                        SPEED: {type: ArgumentType.NUMBER, defaultValue: 5},
                        SLOW_RADIUS: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Seek behavior that slows down as it approaches the target within the slow radius.', returns: { type: 'string', description: 'JSON object {dx, dy}' } }
                },
                {
                    opcode: 'gameWander',
                    blockType: BlockType.REPORTER,
                    text: 'wander from [X],[Y] angle [ANGLE] radius [RADIUS]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        ANGLE: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RADIUS: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Produce a wandering steering force that moves randomly.', returns: { type: 'string', description: 'JSON object {x, y, angle}' } }
                },
                {
                    opcode: 'gameFlocking',
                    blockType: BlockType.REPORTER,
                    text: 'flocking at [X],[Y] neighbors [NEIGHBORS] separation [SEPARATION] alignment [ALIGNMENT] cohesion [COHESION]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        NEIGHBORS: {type: ArgumentType.STRING, defaultValue: '[{"x":10,"y":0},{"x":0,"y":10},{"x":-10,"y":0}]'},
                        SEPARATION: {type: ArgumentType.NUMBER, defaultValue: 1},
                        ALIGNMENT: {type: ArgumentType.NUMBER, defaultValue: 1},
                        COHESION: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: { description: 'Compute boids flocking forces (separation, alignment, cohesion) as JSON {dx, dy}.', returns: { type: 'string', description: 'JSON object {dx, dy}' } }
                },
                '---',
                {
                    opcode: 'gameQuadTree',
                    blockType: BlockType.REPORTER,
                    text: 'build quadtree from [POINTS]',
                    arguments: {
                        POINTS: {type: ArgumentType.STRING, defaultValue: '[{"x":10,"y":20},{"x":30,"y":40}]'}
                    },
                    doc: { description: 'Build a quadtree from a JSON array of {x,y} points and return the tree structure.', returns: { type: 'string', description: 'JSON quadtree structure' } }
                },
                {
                    opcode: 'gameSpatialHash',
                    blockType: BlockType.REPORTER,
                    text: 'spatial hash grid w:[WIDTH] h:[HEIGHT] cell size:[CELL_SIZE]',
                    arguments: {
                        WIDTH: {type: ArgumentType.NUMBER, defaultValue: 800},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 600},
                        CELL_SIZE: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Create a spatial hash grid data structure with the given dimensions.', returns: { type: 'string', description: 'JSON representation of the spatial hash' } }
                },
                {
                    opcode: 'gameRaycast',
                    blockType: BlockType.REPORTER,
                    text: 'raycast from [ORIGIN_X],[ORIGIN_Y] dir [DIR_X],[DIR_Y] walls [WALLS]',
                    arguments: {
                        ORIGIN_X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        ORIGIN_Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        DIR_X: {type: ArgumentType.NUMBER, defaultValue: 1},
                        DIR_Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        WALLS: {type: ArgumentType.STRING, defaultValue: '[{"x1":100,"y1":0,"x2":100,"y2":200}]'}
                    },
                    doc: { description: 'Cast a ray against wall segments and return the closest hit point.', returns: { type: 'string', description: 'JSON object {x, y, dist} of the closest hit' } }
                },
                {
                    opcode: 'gameSATCollision',
                    blockType: BlockType.BOOLEAN,
                    text: 'SAT collision [VERTS_A] vs [VERTS_B]',
                    arguments: {
                        VERTS_A: {type: ArgumentType.STRING, defaultValue: '[{"x":0,"y":0},{"x":50,"y":0},{"x":25,"y":50}]'},
                        VERTS_B: {type: ArgumentType.STRING, defaultValue: '[{"x":25,"y":0},{"x":75,"y":0},{"x":50,"y":50}]'}
                    },
                    doc: { description: 'Check collision between two convex polygons using the Separating Axis Theorem.', returns: { type: 'boolean', description: 'true if colliding, false otherwise' } }
                },
                '---',
                {
                    opcode: 'gameDungeonGenerate',
                    blockType: BlockType.REPORTER,
                    text: 'generate dungeon [WIDTH]x[HEIGHT] rooms [ROOMS] min size [MIN_SIZE] max size [MAX_SIZE]',
                    arguments: {
                        WIDTH: {type: ArgumentType.NUMBER, defaultValue: 50},
                        HEIGHT: {type: ArgumentType.NUMBER, defaultValue: 50},
                        ROOMS: {type: ArgumentType.NUMBER, defaultValue: 10},
                        MIN_SIZE: {type: ArgumentType.NUMBER, defaultValue: 3},
                        MAX_SIZE: {type: ArgumentType.NUMBER, defaultValue: 8}
                    },
                    doc: { description: 'Generate a dungeon layout using BSP with the given room parameters.', returns: { type: 'string', description: 'JSON array of rooms {x, y, w, h, connected}' } }
                },
                {
                    opcode: 'gameTerrainHeight',
                    blockType: BlockType.REPORTER,
                    text: 'terrain height at [X],[Z] seed [SEED]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 0},
                        SEED: {type: ArgumentType.NUMBER, defaultValue: 42}
                    },
                    doc: { description: 'Generate a height value at (x, z) using seeded noise for terrain generation.', returns: { type: 'number', description: 'Height value between 0 and 1' } }
                },
                {
                    opcode: 'gameBreadthFirst',
                    blockType: BlockType.REPORTER,
                    text: 'BFS pathfind on [MAP] from [START] to [END]',
                    arguments: {
                        MAP: {type: ArgumentType.STRING, defaultValue: '[[0,0,0],[0,1,0],[0,0,0]]'},
                        START: {type: ArgumentType.STRING, defaultValue: '[0,0]'},
                        END: {type: ArgumentType.STRING, defaultValue: '[2,2]'}
                    },
                    doc: { description: 'Find the shortest path using breadth-first search on a 2D grid.', returns: { type: 'string', description: 'JSON array of [x,y] path coordinates' } }
                },
                {
                    opcode: 'gameBestFirst',
                    blockType: BlockType.REPORTER,
                    text: 'best-first pathfind on [MAP] from [START] to [END]',
                    arguments: {
                        MAP: {type: ArgumentType.STRING, defaultValue: '[[0,0,0],[0,1,0],[0,0,0]]'},
                        START: {type: ArgumentType.STRING, defaultValue: '[0,0]'},
                        END: {type: ArgumentType.STRING, defaultValue: '[2,2]'}
                    },
                    doc: { description: 'Find a path using greedy best-first search on a 2D grid.', returns: { type: 'string', description: 'JSON array of [x,y] path coordinates' } }
                },
                '---',
                {
                    opcode: 'gamePhysicsStep',
                    blockType: BlockType.REPORTER,
                    text: 'physics step objects [OBJECTS] gravity [GRAVITY] dt [DT]',
                    arguments: {
                        OBJECTS: {type: ArgumentType.STRING, defaultValue: '[{"x":0,"y":0,"vx":0,"vy":0}]'},
                        GRAVITY: {type: ArgumentType.NUMBER, defaultValue: 9.81},
                        DT: {type: ArgumentType.NUMBER, defaultValue: 0.016}
                    },
                    doc: { description: 'Apply a simple physics step with gravity to a JSON array of objects.', returns: { type: 'string', description: 'Updated JSON array of objects with new positions' } }
                },
                {
                    opcode: 'gameAABBQuery',
                    blockType: BlockType.REPORTER,
                    text: 'AABB query [X],[Y],[W],[H] in [OBJECTS]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        W: {type: ArgumentType.NUMBER, defaultValue: 100},
                        H: {type: ArgumentType.NUMBER, defaultValue: 100},
                        OBJECTS: {type: ArgumentType.STRING, defaultValue: '[{"x":50,"y":50,"w":20,"h":20,"id":"a"}]'}
                    },
                    doc: { description: 'Find all objects intersecting an axis-aligned bounding box.', returns: { type: 'string', description: 'JSON array of matching object IDs' } }
                },
                {
                    opcode: 'gameCircleQuery',
                    blockType: BlockType.REPORTER,
                    text: 'circle query [X],[Y] radius [R] in [OBJECTS]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        R: {type: ArgumentType.NUMBER, defaultValue: 100},
                        OBJECTS: {type: ArgumentType.STRING, defaultValue: '[{"x":50,"y":50,"w":20,"h":20,"id":"a"}]'}
                    },
                    doc: { description: 'Find all objects within a circular radius.', returns: { type: 'string', description: 'JSON array of matching object IDs' } }
                }
            ]
        };
    }

    gameAStar(args) {
        if (!args) return '[]';
        try {
            const mapJson = Cast.toString(args.MAP);
            const startJson = Cast.toString(args.START);
            const endJson = Cast.toString(args.END);
            if (!mapJson || !startJson || !endJson) return '[]';
            const grid = JSON.parse(mapJson);
            const start = JSON.parse(startJson);
            const end = JSON.parse(endJson);
            if (!Array.isArray(grid) || grid.length === 0 || grid[0].length === 0) return '[]';
            if (!Array.isArray(start) || start.length < 2 || !Array.isArray(end) || end.length < 2) return '[]';
            const rows = grid.length;
            const cols = grid[0].length;
            const sx = Math.floor(Cast.toNumber(start[0]));
            const sy = Math.floor(Cast.toNumber(start[1]));
            const ex = Math.floor(Cast.toNumber(end[0]));
            const ey = Math.floor(Cast.toNumber(end[1]));
            if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) return '[]';
            if (ex < 0 || ex >= cols || ey < 0 || ey >= rows) return '[]';
            if (grid[sy][sx] === 1 || grid[ey][ex] === 1) return '[]';

            const open = [];
            const closed = new Set();
            const gScore = {};
            const fScore = {};
            const cameFrom = {};

            const key = (x, y) => `${x},${y}`;
            const h = (x, y) => Math.abs(x - ex) + Math.abs(y - ey);

            gScore[key(sx, sy)] = 0;
            fScore[key(sx, sy)] = h(sx, sy);
            open.push({x: sx, y: sy, f: fScore[key(sx, sy)]});

            while (open.length > 0) {
                open.sort((a, b) => a.f - b.f);
                const current = open.shift();
                const cx = current.x;
                const cy = current.y;
                const ck = key(cx, cy);

                if (cx === ex && cy === ey) {
                    const path = [];
                    let px = cx;
                    let py = cy;
                    while (px !== sx || py !== sy) {
                        path.unshift([px, py]);
                        const pk = key(px, py);
                        const prev = cameFrom[pk];
                        if (!prev) break;
                        px = prev.x;
                        py = prev.y;
                    }
                    path.unshift([sx, sy]);
                    return JSON.stringify(path);
                }

                closed.add(ck);
                const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
                for (let i = 0; i < dirs.length; i++) {
                    const nx = cx + dirs[i][0];
                    const ny = cy + dirs[i][1];
                    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                    if (grid[ny][nx] === 1) continue;
                    const nk = key(nx, ny);
                    if (closed.has(nk)) continue;
                    const tentativeG = gScore[ck] + 1;
                    if (tentativeG < (gScore[nk] === undefined ? Infinity : gScore[nk])) {
                        cameFrom[nk] = {x: cx, y: cy};
                        gScore[nk] = tentativeG;
                        fScore[nk] = tentativeG + h(nx, ny);
                        const existing = open.find(p => p.x === nx && p.y === ny);
                        if (!existing) {
                            open.push({x: nx, y: ny, f: fScore[nk]});
                        }
                    }
                }
            }
            return '[]';
        } catch (e) {
            return '[]';
        }
    }

    gameCreateTilemap(args) {
        if (!args) return '[]';
        try {
            const w = Math.max(1, Math.floor(Cast.toNumber(args.W)));
            const h = Math.max(1, Math.floor(Cast.toNumber(args.H)));
            const grid = [];
            for (let y = 0; y < h; y++) {
                const row = [];
                for (let x = 0; x < w; x++) {
                    row.push(0);
                }
                grid.push(row);
            }
            return JSON.stringify(grid);
        } catch (e) {
            return '[]';
        }
    }

    gameTilemapGet(args) {
        if (!args) return 0;
        try {
            const mapJson = Cast.toString(args.MAP);
            const x = Math.floor(Cast.toNumber(args.X));
            const y = Math.floor(Cast.toNumber(args.Y));
            if (!mapJson) return 0;
            const grid = JSON.parse(mapJson);
            if (!Array.isArray(grid) || !Array.isArray(grid[0])) return 0;
            if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return 0;
            return Cast.toNumber(grid[y][x]);
        } catch (e) {
            return 0;
        }
    }

    gameTilemapSet(args) {
        if (!args) return '[]';
        try {
            const mapJson = Cast.toString(args.MAP);
            const x = Math.floor(Cast.toNumber(args.X));
            const y = Math.floor(Cast.toNumber(args.Y));
            const value = Cast.toNumber(args.VALUE);
            if (!mapJson) return '[]';
            const grid = JSON.parse(mapJson);
            if (!Array.isArray(grid) || !Array.isArray(grid[0])) return '[]';
            if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return '[]';
            grid[y][x] = value;
            return JSON.stringify(grid);
        } catch (e) {
            return '[]';
        }
    }

    gameDistance(args) {
        if (!args) return 0;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        } catch (e) {
            return 0;
        }
    }

    gameEuclidean(args) {
        if (!args) return 0;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        } catch (e) {
            return 0;
        }
    }

    gameChebyshev(args) {
        if (!args) return 0;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        } catch (e) {
            return 0;
        }
    }

    gameLerp3(args) {
        if (!args) return '[0,0,0]';
        try {
            const aJson = Cast.toString(args.A);
            const bJson = Cast.toString(args.B);
            const t = Cast.toNumber(args.T);
            if (!aJson || !bJson) return '[0,0,0]';
            const a = JSON.parse(aJson);
            const b = JSON.parse(bJson);
            if (!Array.isArray(a) || !Array.isArray(b) || a.length < 3 || b.length < 3) return '[0,0,0]';
            return JSON.stringify([
                Cast.toNumber(a[0]) + (Cast.toNumber(b[0]) - Cast.toNumber(a[0])) * t,
                Cast.toNumber(a[1]) + (Cast.toNumber(b[1]) - Cast.toNumber(a[1])) * t,
                Cast.toNumber(a[2]) + (Cast.toNumber(b[2]) - Cast.toNumber(a[2])) * t
            ]);
        } catch (e) {
            return '[0,0,0]';
        }
    }

    gameSmoothstep(args) {
        if (!args) return 0;
        try {
            const t = Math.max(0, Math.min(1, Cast.toNumber(args.T)));
            return t * t * (3 - 2 * t);
        } catch (e) {
            return 0;
        }
    }

    gameEaseInOut(args) {
        if (!args) return 0;
        try {
            const t = Math.max(0, Math.min(1, Cast.toNumber(args.T)));
            if (t < 0.5) {
                return 4 * t * t * t;
            }
            return 1 - Math.pow(-2 * t + 2, 3) / 2;
        } catch (e) {
            return 0;
        }
    }

    gameClampVector(args) {
        if (!args) return '[0,0]';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const max = Math.max(0, Cast.toNumber(args.MAX));
            const len = Math.sqrt(x * x + y * y);
            if (len <= max || max === 0) {
                return JSON.stringify([x, y]);
            }
            const scale = max / len;
            return JSON.stringify([x * scale, y * scale]);
        } catch (e) {
            return '[0,0]';
        }
    }

    _ensureParticleContainer() {
        if (!this.particleContainer) {
            try {
                this.particleContainer = document.createElement('div');
                this.particleContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden;';
                document.body.appendChild(this.particleContainer);
            } catch (e) {
                log.warn('[Game] Could not create particle container');
            }
        }
        return this.particleContainer;
    }

    _animateParticles() {
        if (this.particleAnimFrame) {
            cancelAnimationFrame(this.particleAnimFrame);
            this.particleAnimFrame = null;
        }
        const particles = this.particleElements;
        if (particles.length === 0) return;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            let allDone = true;
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                const age = Date.now() - p.birth;
                if (age >= 1000) {
                    if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
                    particles.splice(i, 1);
                    continue;
                }
                allDone = false;
                const progress = age / 1000;
                const angle = p.angle;
                const speed = p.speed;
                const dist = speed * progress;
                p.el.style.left = (p.ox + Math.cos(angle) * dist) + 'px';
                p.el.style.top = (p.oy + Math.sin(angle) * dist) + 'px';
                p.el.style.opacity = 1 - progress;
            }
            if (!allDone) {
                this.particleAnimFrame = requestAnimationFrame(animate);
            }
        };
        this.particleAnimFrame = requestAnimationFrame(animate);
    }

    gameParticleEmit(args) {
        if (!args) return;
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const count = Math.max(1, Math.min(100, Math.floor(Cast.toNumber(args.COUNT))));
            const speed = Cast.toNumber(args.SPEED);
            const color = Cast.toString(args.COLOR);
            const container = this._ensureParticleContainer();
            if (!container) return;
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                const size = 3 + Math.random() * 5;
                el.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${color};left:${x}px;top:${y}px;pointer-events:none;`;
                container.appendChild(el);
                this.particleElements.push({
                    el: el,
                    birth: Date.now(),
                    ox: x,
                    oy: y,
                    angle: Math.random() * Math.PI * 2,
                    speed: speed * (0.5 + Math.random())
                });
            }
            this._animateParticles();
        } catch (e) {
            log.warn('[Game] particleEmit error: ' + e.message);
        }
    }

    gameParticleClear() {
        try {
            if (this.particleAnimFrame) {
                cancelAnimationFrame(this.particleAnimFrame);
                this.particleAnimFrame = null;
            }
            for (let i = this.particleElements.length - 1; i >= 0; i--) {
                const p = this.particleElements[i];
                if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
            }
            this.particleElements = [];
            if (this.particleContainer && this.particleContainer.parentNode) {
                this.particleContainer.parentNode.removeChild(this.particleContainer);
                this.particleContainer = null;
            }
        } catch (e) {
            log.warn('[Game] particleClear error: ' + e.message);
        }
    }

    gameTimerStart(args) {
        if (!args) return;
        try {
            const id = Cast.toString(args.ID);
            this.timers[id] = Date.now();
        } catch (e) {
            log.warn('[Game] timerStart error: ' + e.message);
        }
    }

    gameTimerElapsed(args) {
        if (!args) return 0;
        try {
            const id = Cast.toString(args.ID);
            if (this.timers[id] === undefined) return 0;
            return Date.now() - this.timers[id];
        } catch (e) {
            return 0;
        }
    }

    gameTimerStop(args) {
        if (!args) return 0;
        try {
            const id = Cast.toString(args.ID);
            if (this.timers[id] === undefined) return 0;
            const elapsed = Date.now() - this.timers[id];
            delete this.timers[id];
            return elapsed;
        } catch (e) {
            return 0;
        }
    }

    gameNoise2D(args) {
        if (!args) return 0;
        try {
            let x = Cast.toNumber(args.X);
            let y = Cast.toNumber(args.Y);
            const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
            return n - Math.floor(n);
        } catch (e) {
            return 0;
        }
    }

    gameSeededRandom(args) {
        if (!args) return 0;
        try {
            let s = Math.abs(Cast.toNumber(args.SEED)) || 0;
            if (s === 0) s = 42;
            let t = s += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        } catch (e) {
            return 0;
        }
    }

    gameMapToScreen(args) {
        if (!args) return '[0,0]';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const camX = Cast.toNumber(args.CAM_X);
            const camY = Cast.toNumber(args.CAM_Y);
            const zoom = Math.max(0.01, Cast.toNumber(args.ZOOM));
            const sx = (x - camX) * zoom;
            const sy = (y - camY) * zoom;
            return JSON.stringify([sx, sy]);
        } catch (e) {
            return '[0,0]';
        }
    }

    gameScreenToWorld(args) {
        if (!args) return '[0,0]';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const camX = Cast.toNumber(args.CAM_X);
            const camY = Cast.toNumber(args.CAM_Y);
            const zoom = Math.max(0.01, Cast.toNumber(args.ZOOM));
            const wx = x / zoom + camX;
            const wy = y / zoom + camY;
            return JSON.stringify([wx, wy]);
        } catch (e) {
            return '[0,0]';
        }
    }

    gameRectCollision(args) {
        if (!args) return false;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const w1 = Cast.toNumber(args.W1);
            const h1 = Cast.toNumber(args.H1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            const w2 = Cast.toNumber(args.W2);
            const h2 = Cast.toNumber(args.H2);
            return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
        } catch (e) {
            return false;
        }
    }

    gameCircleCollision(args) {
        if (!args) return false;
        try {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const r1 = Cast.toNumber(args.R1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            const r2 = Cast.toNumber(args.R2);
            const dx = x1 - x2;
            const dy = y1 - y2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist < r1 + r2;
        } catch (e) {
            return false;
        }
    }

    gamePointInRect(args) {
        if (!args) return false;
        try {
            const px = Cast.toNumber(args.PX);
            const py = Cast.toNumber(args.PY);
            const rx = Cast.toNumber(args.RX);
            const ry = Cast.toNumber(args.RY);
            const rw = Cast.toNumber(args.RW);
            const rh = Cast.toNumber(args.RH);
            return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
        } catch (e) {
            return false;
        }
    }

    gameSeek (args) {
        if (!args) return '{"dx":0,"dy":0}';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const tx = Cast.toNumber(args.TARGET_X);
            const ty = Cast.toNumber(args.TARGET_Y);
            const speed = Cast.toNumber(args.SPEED);
            const dx = tx - x;
            const dy = ty - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return JSON.stringify({dx: 0, dy: 0});
            return JSON.stringify({dx: (dx / dist) * speed, dy: (dy / dist) * speed});
        } catch (e) {
            return '{"dx":0,"dy":0}';
        }
    }

    gameFlee (args) {
        if (!args) return '{"dx":0,"dy":0}';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const tx = Cast.toNumber(args.TARGET_X);
            const ty = Cast.toNumber(args.TARGET_Y);
            const speed = Cast.toNumber(args.SPEED);
            const dx = x - tx;
            const dy = y - ty;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return JSON.stringify({dx: 0, dy: 0});
            return JSON.stringify({dx: (dx / dist) * speed, dy: (dy / dist) * speed});
        } catch (e) {
            return '{"dx":0,"dy":0}';
        }
    }

    gameArrive (args) {
        if (!args) return '{"dx":0,"dy":0}';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const tx = Cast.toNumber(args.TARGET_X);
            const ty = Cast.toNumber(args.TARGET_Y);
            const speed = Cast.toNumber(args.SPEED);
            const slowRadius = Math.max(0.001, Cast.toNumber(args.SLOW_RADIUS));
            const dx = tx - x;
            const dy = ty - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return JSON.stringify({dx: 0, dy: 0});
            const rampedSpeed = speed * Math.min(1, dist / slowRadius);
            return JSON.stringify({dx: (dx / dist) * rampedSpeed, dy: (dy / dist) * rampedSpeed});
        } catch (e) {
            return '{"dx":0,"dy":0}';
        }
    }

    gameWander (args) {
        if (!args) return '{"x":0,"y":0,"angle":0}';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            let angle = Cast.toNumber(args.ANGLE);
            const radius = Cast.toNumber(args.RADIUS);
            angle += (Math.random() - 0.5) * Math.PI * 0.5;
            const nx = x + radius * Math.cos(angle);
            const ny = y + radius * Math.sin(angle);
            return JSON.stringify({x: nx, y: ny, angle: angle * 180 / Math.PI});
        } catch (e) {
            return '{"x":0,"y":0,"angle":0}';
        }
    }

    gameFlocking (args) {
        if (!args) return '{"dx":0,"dy":0}';
        try {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const neighborsStr = Cast.toString(args.NEIGHBORS);
            const sepWeight = Cast.toNumber(args.SEPARATION);
            const aliWeight = Cast.toNumber(args.ALIGNMENT);
            const cohWeight = Cast.toNumber(args.COHESION);
            let neighbors;
            try { neighbors = JSON.parse(neighborsStr); } catch (e) { neighbors = []; }
            if (!Array.isArray(neighbors) || neighbors.length === 0) return '{"dx":0,"dy":0}';
            let separation = {x: 0, y: 0};
            let alignment = {x: 0, y: 0};
            let cohesion = {x: 0, y: 0};
            let count = 0;
            for (let i = 0; i < neighbors.length; i++) {
                const n = neighbors[i];
                const nx = Cast.toNumber(n.x);
                const ny = Cast.toNumber(n.y);
                const dx = x - nx;
                const dy = y - ny;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.001) continue;
                separation.x += dx / dist;
                separation.y += dy / dist;
                alignment.x += Cast.toNumber(n.vx || 0);
                alignment.y += Cast.toNumber(n.vy || 0);
                cohesion.x += nx;
                cohesion.y += ny;
                count++;
            }
            if (count === 0) return '{"dx":0,"dy":0}';
            separation.x /= count;
            separation.y /= count;
            alignment.x = alignment.x / count - 0;
            alignment.y = alignment.y / count - 0;
            cohesion.x = cohesion.x / count - x;
            cohesion.y = cohesion.y / count - y;
            const dx = separation.x * sepWeight + alignment.x * aliWeight + cohesion.x * cohWeight;
            const dy = separation.y * sepWeight + alignment.y * aliWeight + cohesion.y * cohWeight;
            return JSON.stringify({dx, dy});
        } catch (e) {
            return '{"dx":0,"dy":0}';
        }
    }

    gameQuadTree (args) {
        if (!args) return '{}';
        try {
            const pointsStr = Cast.toString(args.POINTS);
            let points;
            try { points = JSON.parse(pointsStr); } catch (e) { points = []; }
            if (!Array.isArray(points)) points = [];
            function buildTree(pts, depth) {
                if (pts.length <= 1 || depth > 8) {
                    return {points: pts, leaf: true};
                }
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                for (let i = 0; i < pts.length; i++) {
                    const px = Cast.toNumber(pts[i].x);
                    const py = Cast.toNumber(pts[i].y);
                    if (px < minX) minX = px;
                    if (py < minY) minY = py;
                    if (px > maxX) maxX = px;
                    if (py > maxY) maxY = py;
                }
                const cx = (minX + maxX) / 2;
                const cy = (minY + maxY) / 2;
                const nw = [], ne = [], sw = [], se = [];
                for (let i = 0; i < pts.length; i++) {
                    const px = Cast.toNumber(pts[i].x);
                    const py = Cast.toNumber(pts[i].y);
                    if (py <= cy) {
                        if (px <= cx) nw.push(pts[i]);
                        else ne.push(pts[i]);
                    } else {
                        if (px <= cx) sw.push(pts[i]);
                        else se.push(pts[i]);
                    }
                }
                return {
                    x: cx, y: cy,
                    nw: buildTree(nw, depth + 1),
                    ne: buildTree(ne, depth + 1),
                    sw: buildTree(sw, depth + 1),
                    se: buildTree(se, depth + 1)
                };
            }
            return JSON.stringify(buildTree(points, 0));
        } catch (e) {
            return '{}';
        }
    }

    gameSpatialHash (args) {
        if (!args) return '{}';
        try {
            const width = Math.max(1, Cast.toNumber(args.WIDTH));
            const height = Math.max(1, Cast.toNumber(args.HEIGHT));
            const cellSize = Math.max(1, Cast.toNumber(args.CELL_SIZE));
            const cols = Math.ceil(width / cellSize);
            const rows = Math.ceil(height / cellSize);
            const grid = {cols, rows, cellSize, width, height, cells: {}};
            return JSON.stringify(grid);
        } catch (e) {
            return '{}';
        }
    }

    gameRaycast (args) {
        if (!args) return '{}';
        try {
            const ox = Cast.toNumber(args.ORIGIN_X);
            const oy = Cast.toNumber(args.ORIGIN_Y);
            let dx = Cast.toNumber(args.DIR_X);
            let dy = Cast.toNumber(args.DIR_Y);
            const wallsStr = Cast.toString(args.WALLS);
            let walls;
            try { walls = JSON.parse(wallsStr); } catch (e) { walls = []; }
            if (!Array.isArray(walls)) walls = [];
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 0.0001) return '{}';
            dx /= len;
            dy /= len;
            let closestDist = Infinity;
            let hitX = ox, hitY = oy;
            for (let i = 0; i < walls.length; i++) {
                const w = walls[i];
                const x1 = Cast.toNumber(w.x1), y1 = Cast.toNumber(w.y1);
                const x2 = Cast.toNumber(w.x2), y2 = Cast.toNumber(w.y2);
                const denom = dx * (y1 - y2) - dy * (x1 - x2);
                if (Math.abs(denom) < 0.0001) continue;
                const t = ((x1 - ox) * (y1 - y2) - (y1 - oy) * (x1 - x2)) / denom;
                const u = -((x1 - ox) * dy - (y1 - oy) * dx) / denom;
                if (t > 0 && u >= 0 && u <= 1) {
                    const px = ox + t * dx;
                    const py = oy + t * dy;
                    const dist = Math.sqrt((px - ox) * (px - ox) + (py - oy) * (py - oy));
                    if (dist < closestDist) {
                        closestDist = dist;
                        hitX = px;
                        hitY = py;
                    }
                }
            }
            if (closestDist === Infinity) return '{}';
            return JSON.stringify({x: hitX, y: hitY, dist: closestDist});
        } catch (e) {
            return '{}';
        }
    }

    gameSATCollision (args) {
        if (!args) return false;
        try {
            const vertsAStr = Cast.toString(args.VERTS_A);
            const vertsBStr = Cast.toString(args.VERTS_B);
            let vertsA, vertsB;
            try { vertsA = JSON.parse(vertsAStr); } catch (e) { vertsA = []; }
            try { vertsB = JSON.parse(vertsBStr); } catch (e) { vertsB = []; }
            if (!Array.isArray(vertsA) || !Array.isArray(vertsB) || vertsA.length < 3 || vertsB.length < 3) return false;
            const toVec = (v) => ({x: Cast.toNumber(v.x), y: Cast.toNumber(v.y)});
            const polyA = vertsA.map(toVec);
            const polyB = vertsB.map(toVec);
            const getAxes = (poly) => {
                const axes = [];
                for (let i = 0; i < poly.length; i++) {
                    const j = (i + 1) % poly.length;
                    const ex = poly[j].x - poly[i].x;
                    const ey = poly[j].y - poly[i].y;
                    const len = Math.sqrt(ex * ex + ey * ey);
                    if (len < 0.0001) continue;
                    axes.push({x: -ey / len, y: ex / len});
                }
                return axes;
            };
            const project = (poly, axis) => {
                let min = Infinity, max = -Infinity;
                for (let i = 0; i < poly.length; i++) {
                    const dot = poly[i].x * axis.x + poly[i].y * axis.y;
                    if (dot < min) min = dot;
                    if (dot > max) max = dot;
                }
                return {min, max};
            };
            const axes = [...getAxes(polyA), ...getAxes(polyB)];
            for (let i = 0; i < axes.length; i++) {
                const projA = project(polyA, axes[i]);
                const projB = project(polyB, axes[i]);
                if (projA.max < projB.min || projB.max < projA.min) return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    gameDungeonGenerate (args) {
        if (!args) return '[]';
        try {
            const width = Math.max(10, Math.floor(Cast.toNumber(args.WIDTH)));
            const height = Math.max(10, Math.floor(Cast.toNumber(args.HEIGHT)));
            const roomCount = Math.max(1, Math.floor(Cast.toNumber(args.ROOMS)));
            const minSize = Math.max(2, Math.floor(Cast.toNumber(args.MIN_SIZE)));
            const maxSize = Math.max(minSize, Math.floor(Cast.toNumber(args.MAX_SIZE)));
            const rooms = [];
            for (let i = 0; i < roomCount; i++) {
                const rw = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
                const rh = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
                const rx = Math.floor(Math.random() * (width - rw));
                const ry = Math.floor(Math.random() * (height - rh));
                let overlap = false;
                for (let j = 0; j < rooms.length; j++) {
                    const r = rooms[j];
                    if (rx < r.x + r.w + 1 && rx + rw + 1 > r.x && ry < r.y + r.h + 1 && ry + rh + 1 > r.y) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    rooms.push({x: rx, y: ry, w: rw, h: rh, connected: i < roomCount - 1});
                }
            }
            return JSON.stringify(rooms);
        } catch (e) {
            return '[]';
        }
    }

    gameTerrainHeight (args) {
        if (!args) return 0;
        try {
            const x = Cast.toNumber(args.X);
            const z = Cast.toNumber(args.Z);
            const seed = Cast.toNumber(args.SEED);
            const n = Math.sin(x * 12.9898 + z * 78.233 + seed * 45.164) * 43758.5453;
            return (n - Math.floor(n));
        } catch (e) {
            return 0;
        }
    }

    gameBreadthFirst (args) {
        if (!args) return '[]';
        try {
            const mapStr = Cast.toString(args.MAP);
            const startStr = Cast.toString(args.START);
            const endStr = Cast.toString(args.END);
            if (!mapStr || !startStr || !endStr) return '[]';
            const grid = JSON.parse(mapStr);
            const start = JSON.parse(startStr);
            const end = JSON.parse(endStr);
            if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) return '[]';
            const rows = grid.length;
            const cols = grid[0].length;
            const sx = Math.floor(Cast.toNumber(start[0]));
            const sy = Math.floor(Cast.toNumber(start[1]));
            const ex = Math.floor(Cast.toNumber(end[0]));
            const ey = Math.floor(Cast.toNumber(end[1]));
            if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) return '[]';
            if (ex < 0 || ex >= cols || ey < 0 || ey >= rows) return '[]';
            if (grid[sy][sx] === 1 || grid[ey][ex] === 1) return '[]';
            const queue = [[sx, sy]];
            const visited = new Set();
            const parent = {};
            const key = (x, y) => `${x},${y}`;
            visited.add(key(sx, sy));
            parent[key(sx, sy)] = null;
            const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
            let found = false;
            while (queue.length > 0) {
                const [cx, cy] = queue.shift();
                if (cx === ex && cy === ey) { found = true; break; }
                for (let i = 0; i < dirs.length; i++) {
                    const nx = cx + dirs[i][0];
                    const ny = cy + dirs[i][1];
                    const nk = key(nx, ny);
                    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                    if (grid[ny][nx] === 1 || visited.has(nk)) continue;
                    visited.add(nk);
                    parent[nk] = [cx, cy];
                    queue.push([nx, ny]);
                }
            }
            if (!found) return '[]';
            const path = [];
            let cur = [ex, ey];
            while (cur) {
                path.unshift(cur);
                const pk = key(cur[0], cur[1]);
                cur = parent[pk];
            }
            return JSON.stringify(path);
        } catch (e) {
            return '[]';
        }
    }

    gameBestFirst (args) {
        if (!args) return '[]';
        try {
            const mapStr = Cast.toString(args.MAP);
            const startStr = Cast.toString(args.START);
            const endStr = Cast.toString(args.END);
            if (!mapStr || !startStr || !endStr) return '[]';
            const grid = JSON.parse(mapStr);
            const start = JSON.parse(startStr);
            const end = JSON.parse(endStr);
            if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) return '[]';
            const rows = grid.length;
            const cols = grid[0].length;
            const sx = Math.floor(Cast.toNumber(start[0]));
            const sy = Math.floor(Cast.toNumber(start[1]));
            const ex = Math.floor(Cast.toNumber(end[0]));
            const ey = Math.floor(Cast.toNumber(end[1]));
            if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) return '[]';
            if (ex < 0 || ex >= cols || ey < 0 || ey >= rows) return '[]';
            if (grid[sy][sx] === 1 || grid[ey][ex] === 1) return '[]';
            const h = (x, y) => Math.abs(x - ex) + Math.abs(y - ey);
            const open = [[sx, sy]];
            const closed = new Set();
            const parent = {};
            const key = (x, y) => `${x},${y}`;
            parent[key(sx, sy)] = null;
            const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
            let found = false;
            while (open.length > 0) {
                open.sort((a, b) => h(a[0], a[1]) - h(b[0], b[1]));
                const [cx, cy] = open.shift();
                const ck = key(cx, cy);
                if (closed.has(ck)) continue;
                closed.add(ck);
                if (cx === ex && cy === ey) { found = true; break; }
                for (let i = 0; i < dirs.length; i++) {
                    const nx = cx + dirs[i][0];
                    const ny = cy + dirs[i][1];
                    const nk = key(nx, ny);
                    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                    if (grid[ny][nx] === 1 || closed.has(nk)) continue;
                    if (!open.some(p => p[0] === nx && p[1] === ny)) {
                        parent[nk] = [cx, cy];
                        open.push([nx, ny]);
                    }
                }
            }
            if (!found) return '[]';
            const path = [];
            let cur = [ex, ey];
            while (cur) {
                path.unshift(cur);
                const pk = key(cur[0], cur[1]);
                cur = parent[pk];
            }
            return JSON.stringify(path);
        } catch (e) {
            return '[]';
        }
    }

    gamePhysicsStep (args) {
        if (!args) return '[]';
        try {
            const objectsStr = Cast.toString(args.OBJECTS);
            const gravity = Cast.toNumber(args.GRAVITY);
            const dt = Math.max(0.001, Cast.toNumber(args.DT));
            let objects;
            try { objects = JSON.parse(objectsStr); } catch (e) { objects = []; }
            if (!Array.isArray(objects)) return '[]';
            const result = [];
            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i];
                let x = Cast.toNumber(obj.x);
                let y = Cast.toNumber(obj.y);
                let vx = Cast.toNumber(obj.vx || 0);
                let vy = Cast.toNumber(obj.vy || 0);
                vy += gravity * dt;
                x += vx * dt;
                y += vy * dt;
                result.push({x, y, vx, vy});
            }
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    gameAABBQuery (args) {
        if (!args) return '[]';
        try {
            const qx = Cast.toNumber(args.X);
            const qy = Cast.toNumber(args.Y);
            const qw = Cast.toNumber(args.W);
            const qh = Cast.toNumber(args.H);
            const objectsStr = Cast.toString(args.OBJECTS);
            let objects;
            try { objects = JSON.parse(objectsStr); } catch (e) { objects = []; }
            if (!Array.isArray(objects)) return '[]';
            const ids = [];
            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i];
                const ox = Cast.toNumber(obj.x);
                const oy = Cast.toNumber(obj.y);
                const ow = Cast.toNumber(obj.w);
                const oh = Cast.toNumber(obj.h);
                if (qx < ox + ow && qx + qw > ox && qy < oy + oh && qy + qh > oy) {
                    if (obj.id !== undefined) ids.push(obj.id);
                }
            }
            return JSON.stringify(ids);
        } catch (e) {
            return '[]';
        }
    }

    gameCircleQuery (args) {
        if (!args) return '[]';
        try {
            const cx = Cast.toNumber(args.X);
            const cy = Cast.toNumber(args.Y);
            const r = Cast.toNumber(args.R);
            const objectsStr = Cast.toString(args.OBJECTS);
            let objects;
            try { objects = JSON.parse(objectsStr); } catch (e) { objects = []; }
            if (!Array.isArray(objects)) return '[]';
            const ids = [];
            for (let i = 0; i < objects.length; i++) {
                const obj = objects[i];
                const ox = Cast.toNumber(obj.x);
                const oy = Cast.toNumber(obj.y);
                const ow = Cast.toNumber(obj.w) || 0;
                const oh = Cast.toNumber(obj.h) || 0;
                const closestX = Math.max(ox, Math.min(cx, ox + ow));
                const closestY = Math.max(oy, Math.min(cy, oy + oh));
                const dx = cx - closestX;
                const dy = cy - closestY;
                if (dx * dx + dy * dy <= r * r) {
                    if (obj.id !== undefined) ids.push(obj.id);
                }
            }
            return JSON.stringify(ids);
        } catch (e) {
            return '[]';
        }
    }
}

module.exports = ScratchProGameBlocks;
