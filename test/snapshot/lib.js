const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const VM = require('../../src/virtual-machine');
const JSGenerator = require('../../src/compiler/jsgen');

/**
 * @param {string} directoryPath Path to the directory
 * @returns {string[]} Absolute paths for all files in the directory
 */
const recursiveReadDirectory = directoryPath => {
    const result = [];
    const children = fs.readdirSync(directoryPath).sort();
    for (const childName of children) {
        const childPath = path.join(directoryPath, childName);
        const stat = fs.statSync(childPath);
        if (stat.isDirectory()) {
            for (const file of recursiveReadDirectory(childPath)) {
                result.push(file);
            }
        } else {
            result.push(childPath);
        }
    }
    return result;
};

const fixtureDir = path.resolve(__dirname, '../fixtures');

// sb2 project loading results in random IDs each time, so for now we only snapshot sb3 files
const testFiles = recursiveReadDirectory(fixtureDir).filter(uri => uri.endsWith('.sb3'));

/**
 * @typedef {string} Snapshot Represents either a generated or parsed test case snapshot.
 */

/**
 * @typedef TestCase
 * @property {string} id
 * @property {string} file
 * @property {object} compilerOptions
 */

/** @type {TestCase[]} */
const testCases = testFiles.map(file => ([
    {
        id: path.relative(fixtureDir, file),
        file: file,
        compilerOptions: {
            warpTimer: false
        }
    },
    {
        id: `warp-timer/${path.relative(fixtureDir, file)}`,
        file: file,
        compilerOptions: {
            warpTimer: true
        }
    }
])).flat();

const snapshotDir = path.resolve(__dirname, '__snapshots__');

/**
 * @param {TestCase} testCase From testCases.
 * @returns {Buffer} Compressed project file from disk.
 */
const getProjectData = testCase => fs.readFileSync(testCase.file);

/**
 * @param {TestCase} testCase From testCases.
 * @returns {string} The path on disk where this test's snapshot should be saved.
 */
const getSnapshotPath = testCase => path.join(snapshotDir, `${testCase.id}.tw-snapshot`);

const computeSHA256 = buffer => crypto
    .createHash('SHA256')
    .update(buffer)
    .digest('hex');

/**
 * @param {string} snapshot a snapshot
 * @returns {string} SHA-256
 */
const parseSnapshotSHA256 = snapshot => snapshot.match(/^\/\/ Input SHA-256: ([0-9a-f]{64})$/m)[1];

/**
 * @param {TestCase} testCase Test to run from testCases
 * @returns {Promise<Snapshot|null>} Actual snapshot
 */
const generateActualSnapshot = async testCase => {
    const vm = new VM();
    vm.setCompilerOptions(testCase.compilerOptions);
    const projectData = getProjectData(testCase);
    const inputSHA256 = computeSHA256(projectData);

    let triedToLoadExtension = false;
    vm.securityManager.canLoadExtensionFromProject = () => {
        triedToLoadExtension = true;
        return false;
    };

    try {
        await vm.loadProject(projectData);
    } catch (e) {
        if (triedToLoadExtension) {
            return '// Snapshot unavailable as fixture contains custom extension\n';
        }
    }

    /*
        Example source (manually formatted):
        (function factory32(thread) {
            const target = thread.target;
            const runtime = target.runtime;
            const stage = runtime.getTargetForStage();
            return function* gen30_whatever () {
                // ...
            };
        }; })
        The numbers in the function names are non-deterministic, so we replace them with generic versions here.
    */
    const normalizeJS = source => source
        .replace(/^\(function factory\d+/, '(function factoryXYZ')
        .replace(/return function\* gen\d+/, 'return function* genXYZ')
        .replace(/return function fun\d+/, 'return function funXYZ');

    const generatedJS = [];
    JSGenerator.testingApparatus = {
        report: (jsgen, factorySource) => {
            const targetName = jsgen.target.getName();
            const scriptName = jsgen.script.procedureVariant || 'script';
            const js = normalizeJS(factorySource);
            generatedJS.push(`// ${targetName} ${scriptName}\n${js}`);
        }
    };

    const errors = [];
    vm.on('COMPILE_ERROR', (target, error) => {
        errors.push({target, error});
    });

    vm.runtime.precompile();

    let result = '// TW Snapshot\n';
    result += `// Input SHA-256: ${inputSHA256}\n`;
    result += '\n';
    if (errors.length) {
        result += '// Errors:\n';
        result += errors.map(i => `// ${i.target.getName()}: ${i.error}\n`);
        result += '\n';
    }
    result += generatedJS.join('\n\n');
    result += '\n';
    return result;
};

/**
 * @param {TestCase} testCase Test case from testCases
 * @returns {Snapshot|null} Snapshot stored on disk if it exists, otherwise null.
 */
const getExpectedSnapshot = testCase => {
    try {
        return fs.readFileSync(getSnapshotPath(testCase), 'utf-8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            return null;
        }
        throw e;
    }
};

/**
 * @param {Snapshot} expected from getExpectedSnapshot
 * @param {Snapshot} actual from getActualSnapshot
 * @returns {'VALID'|'MISSING_SNAPSHOT'|'INPUT_MODIFIED'|'INVALID'} result of comparison
 */
const compareSnapshots = (expected, actual) => {
    if (expected === actual) {
        return 'VALID';
    }

    if (expected === null) {
        return 'MISSING_SNAPSHOT';
    }

    const expectedSHA256 = parseSnapshotSHA256(expected);
    const actualSHA256 = parseSnapshotSHA256(actual);
    if (expectedSHA256 !== actualSHA256) {
        return 'INPUT_MODIFIED';
    }

    return 'INVALID';
};

/**
 * Write a snapshot result to disk.
 * @param {TestCase} testCase From testCases.
 * @param {Snapshot} snapshot From generateActualSnapshot
 */
const saveSnapshot = (testCase, snapshot) => {
    const snapshotPath = getSnapshotPath(testCase);
    fs.mkdirSync(path.dirname(snapshotPath), {
        recursive: true
    });
    fs.writeFileSync(snapshotPath, snapshot);
};

module.exports = {
    tests: testCases,
    generateActualSnapshot,
    getExpectedSnapshot,
    compareSnapshots,
    saveSnapshot
};
