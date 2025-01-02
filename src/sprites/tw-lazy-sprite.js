const Sprite = require('./sprite');

/**
 * @enum {'unloaded'|'loading'|'loaded'|'error'}
 */
const State = {
    UNLOADED: 'unloaded',
    LOADING: 'loading',
    LOADED: 'loaded',
    ERROR: 'error'
};

/**
 * Sprite with lazy-loading capabilities.
 */
class LazySprite extends Sprite {
    /**
     * @param {Runtime} runtime
     * @param {object} initialJSON
     * @param {JSZip|null} initialZip
     */
    constructor (runtime, initialJSON, initialZip) {
        // null blocks means Sprite will create it for us
        super(null, runtime);

        /**
         * @type {State}
         */
        this.state = State.UNLOADED;

        /**
         * sprite.json or project.json targets[x] entry for the sprite.
         * @type {object}
         */
        this.object = initialJSON;

        /**
         * @type {JSZip|null}
         */
        this.zip = initialZip;

        /**
         * Callback to cancel current load operation.
         * @type {() => void}
         */
        this._cancelLoadCallback = () => {};
    }

    /**
     * Creates an instance of this sprite.
     * State must be unloaded.
     * Renderer state is not updated. You must call updateAllDrawableProperties() yourself later.
     * @returns {Promise<RenderedTarget|null>} Loaded target, or null if cancelled by unload() call.
     */
    load () {
        if (this.state !== State.UNLOADED) {
            return Promise.reject(new Error(`Unknown state transition ${this.state} -> loading`));
        }

        let cancelled = false;

        const load = async () => {
            this.state = State.LOADING;

            const sb3 = require('../serialization/sb3');
            const {
                costumePromises,
                soundPromises,
                soundBank
            } = sb3.parseScratchAssets(this.object, this.runtime, this.zip);

            // Wait a bit to give storage a chance to start requests.
            await Promise.resolve();

            // Need to check for cancellation after each async operation.
            // At this point the promise is already finished, so our return value won't be seen anywhere.
            if (cancelled) {
                return null;
            }

            const target = this.createClone();
            sb3.parseTargetStateFromJSON(this.runtime, target, this.object);

            const costumes = await Promise.all(costumePromises);
            if (cancelled) {
                return null;
            }

            const sounds = await Promise.all(soundPromises);
            if (cancelled) {
                return null;
            }

            this.costumes = costumes;
            this.sounds = sounds;
            this.soundBank = soundBank || null;
            this.state = State.LOADED;
            return target;
        };

        return new Promise((resolve, reject) => {
            this._cancelLoadCallback = () => {
                cancelled = true;
                resolve(null);
            };

            load().then(resolve, reject);
        }).catch(err => {
            this.state = State.ERROR;
            throw err;
        });
    }

    /**
     * Updates this sprite's stored state based on its original clone. Existing targets are not removed.
     * State must be loaded.
     * @returns {void}
     */
    save () {
        if (this.state !== State.LOADED) {
            return Promise.reject(new Error(`Cannot save in state ${this.state}`));
        }

        // TODO(lazy)
        const sb3 = require('../serialization/sb3');
        const serialized = sb3.serialize();
    }

    /**
     * Updates this sprite's stored state based on its original clone, and removes existing targets.
     * State must be LOADED.
     * @returns {void}
     */
    unload () {
        if (this.state !== State.LOADED && this.state !== State.LOADING) {
            return Promise.reject(new Error(`Unknown state transition ${this.state} -> unloaded`));
        }

        // TODO(lazy)
        this.state = State.UNLOADED;
        this._cancelLoadCallback();
    }
}

// Export enums
LazySprite.State = State;

module.exports = LazySprite;
