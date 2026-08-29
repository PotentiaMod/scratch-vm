const dispatch = require('../dispatch/central-dispatch');
const log = require('../util/log');
const maybeFormatMessage = require('../util/maybe-format-message');

const BlockType = require('./block-type');
const SecurityManager = require('./tw-security-manager');
const urlParams = new URLSearchParams(location.search);

const enableCoreEx = urlParams.has('livetest');

// These extensions are currently built into the VM repository but should not be loaded at startup.
// TODO: move these out into a separate repository?
// TODO: change extension spec so that library info, including extension ID, can be collected through static methods

const defaultBuiltinExtensions = {
    // This is an example that isn't loaded with the other core blocks,
    // but serves as a reference for loading core blocks as extensions.
    coreExample: () => require('../blocks/scratch3_core_example'),
    // These are the non-core built-in extensions.
    pen: () => require('../extensions/scratch3_pen'),
    wedo2: () => require('../extensions/scratch3_wedo2'),
    music: () => require('../extensions/scratch3_music'),
    microbit: () => require('../extensions/scratch3_microbit'),
    text2speech: () => require('../extensions/scratch3_text2speech'),
    translate: () => require('../extensions/scratch3_translate'),
    videoSensing: () => require('../extensions/scratch3_video_sensing'),
    ev3: () => require('../extensions/scratch3_ev3'),
    makeymakey: () => require('../extensions/scratch3_makeymakey'),
    boost: () => require('../extensions/scratch3_boost'),
    gdxfor: () => require('../extensions/scratch3_gdx_for'),
    // tw: core extension
    tw: () => require('../extensions/tw'),
	
    omegaex: () => require('../extensions/potentia_omegaextension'),
	
    appmaker: () => require('../extensions/potentia_appmaker'),
    wonderblocks: () => require('../extensions/gaia_wonderblocks'),
	
    kidsboard: () => require('../extensions/scratch3_kidsboard'),
    eim: () => require('../extensions/scratch3_eim'),
	
    poseFace: () => require("../extensions/scratch3_pose_face"),
	poseBody: () => require('../extensions/scratch3_posebody'),
    poseHand: () => require('../extensions/scratch3_posehand'),
	
    arduino: () => require("../extensions/scratch3_arduino"),
    legoBLE: () => require("../extensions/scratch3_legoble"),
    legoMario: () => require("../extensions/scratch3_legomario"),
    legoLuigi: () => require("../extensions/scratch3_legoluigi"),
    legoPeach: () => require("../extensions/scratch3_legopeach"),
	
    objectDetection: () => require('../extensions/scratch3_objectdetection'),
    teachableMachine: () => require('../extensions/scratch3_teachablemachine'),
    qrcode: () => require('../extensions/scratch3_qrcode'),
	dataviewer: () => require('../extensions/scratch3_dataviewer'),

	
	// Cognimates
    typescratch: () => require('../extensions/typescratch'),
    cognimate: () => require('../extensions/scratch3_cognimate'),
    muse: () => require('../extensions/scratch3_muse'),
    cozmo: () => require('../extensions/scratch3_cozmo'),
    wemo: () => require('../extensions/scratch3_wemo'),
    alexa: () => require('../extensions/scratch3_alexa'),
    ergo: () => require('../extensions/scratch3_ergo'),
    twitter: () => require('../extensions/scratch3_twitter'),
    sentiment: () => require('../extensions/scratch3_sentiment'),
    textClass: () => require('../extensions/scratch3_textClassify'),
    vision: () => require('../extensions/scratch3_vision'),
    hue: () => require('../extensions/scratch3_hue'),
	
////////////////// -- penguinmod -- //////////////////
    pmMotionExpansion: () => require('../extensions/penguinmod/pmMotionExpansion'),
	pmSensingExpansion: () => require("../extensions/pm_sensingExpansion"),
	pmEventsExpansion: () => require("../extensions/pm_eventsExpansion"),
    jgStorage: () => require('../extensions/penguinmod/jgStorage'),
    jgTween: () => require('../extensions/penguinmod/jgTween'),
    jgRuntime: () => require('../extensions/penguinmod/jgRuntime'),
    jgPrism: () => require('../extensions/penguinmod/jgPrism'),
    jwUnite: () => require('../extensions/penguinmod/jwUnite'),
    jgJSON: () => require('../extensions/penguinmod/jgJSON'),
    jgScratchAuthenticate: () => require('../extensions/jg_scratchAuth'),
	lmsutilsblocks: () => require('../extensions/lmsutilsblocks'),
    lmsTempVars2: () => require('../extensions/lily_tempVars2'),
	jgFiles: () => require('../extensions/jg_files'),
	xeltallivclipblend: () => require('../extensions/xeltalliv_clippingblending'),
	DTcameracontrols: () => require('../extensions/dt_cameracontrols'),
    colors: () => require('../extensions/gsa_colorUtilBlocks'),
	jgBestExtension: () => require("../extensions/jg_bestextensioin"),
////////////////// -- penguinmod -- //////////////////
    		
	// champierres
    scratch2webserialapi: () => require("../extensions/scratch3_scratch2webserialapi"),
    chatgpt2scratch: () => require("../extensions/scratch3_chatgpt2scratch"),
    facemesh2scratch: () => require("../extensions/scratch3_facemesh2scratch"),
    handpose2scratch: () => require("../extensions/scratch3_handpose2scratch"),
    posenet2scratch: () => require("../extensions/scratch3_posenet2scratch"),
    helloscratch: () => require("../extensions/scratch3_hello"),
    nn2scratch: () => require("../extensions/scratch3_nn2scratch"),
    scratch2root: () => require("../extensions/scratch3_scratch2root"),
    ic2scratch: () => require("../extensions/scratch3_ic2scratch"),
    speech2scratch: () => require("../extensions/scratch3_speech2scratch"),
    tm2scratch: () => require("../extensions/scratch3_tm2scratch"),
    tmpose2scratch: () => require("../extensions/scratch3_tmpose2scratch"),
    ml2scratch: () => require("../extensions/scratch3_ml2scratch"),
	
	// GvbvdxxMod2
    beepboxsynth: () => require('../extensions/scratch3_beepbox_synth'),
    roku: () => require("../extensions/scratch3_roku"),
    nesemulator: () => require("../extensions/nes"),
    sndanalyser: () => require('../extensions/gm2_projectsound'),
	html5: () => require('../extensions/html5_elements'),
	websocket: () => require('../extensions/scratch3_websocket'),
	audioctx: () => require('../extensions/scratch3_audio_context'),
	extra: () => require('../extensions/scratch3_extra'),
	userdata: () => require('../extensions/scratch3_user_data'),
	dialogs: () => require('../extensions/scratch3_dialog'),
	speech4pc: () => require('../extensions/speech4pc'),
	projectsound: () => require('../extensions/gm2_projectsound'),
	websites: () => require('../extensions/scratch3_websites'),
	betteraudio: () => require('../extensions/scratch3_better_audio'),
	
	//underdog
	udblockUDPi: () => require('../extensions/udblock_udpi'),
    udblockUDPiPlus: () => require('../extensions/udblock_udpi_plus'),
    udblockUDPiV2: () => require('../extensions/udblock_udpi_v2'),
    udblockUDPiPlusV2: () => require('../extensions/udblock_udpi_plus_v2'),
    udblockEXTBMFV2: () => require("../extensions/udblock_extb_mf_v2"),
    udblockEXTBSMV2: () => require("../extensions/udblock_extb_sm_v2"),
    udblockEXTBIOV2: ()=> require("../extensions/udblock_extb_io_v2"),
    udblockMQTT: ()=> require("../extensions/udblock-mqtt"),
    udblockMicrobit: ()=> require("../extensions/udblock_microbit"),
    udblockUtils : ()=> require("../extensions/udblock-utils"),
	
	//other
    poweredUp: () => require('../extensions/scratch3_powered_up'),
    duploTrain: () => require('../extensions/scratch3_duplo_train'),
    marty: () => require('../extensions/scratch3_marty'),
	mbot: () => require('../extensions/scratch3_mbot'),
	mesh_motion_sensor: () =>require('../extensions/scratch3_motion_sensor'),
	newmicrobit: () => require('../extensions/scratch3_newmicrobit'),
    meshled: () => require('../extensions/scratch3_meshled'),
    meshbrightness: () =>require('../extensions/scratch3_meshbrightness'),
    meshgpio: () =>require('../extensions/scratch3_meshgpio'),
    ohbot: () => require('../extensions/scratch3_ohbot'),
    robodog: () => require('../extensions/scratch3_robodog'),
	jdcode: () => require('../extensions/scratch3_jdcode'),
	firmtech: () => require('../extensions/scratch3_firmtech'),
    aidrone: () => require('../extensions/scratch3_aidrone'),
    aicobot: () => require('../extensions/scratch3_aicobot'),
    jcboard: () => require('../extensions/scratch3_jcboard'),
    uglybot: () => require('../extensions/scratch3_uglybot'),
	akariblocks: () => require('../extensions/scratch3_akari_blocks'),
    akaricamera: () => require('../extensions/scratch3_akari_camera'),
    akariblockssimple: () => require('../extensions/scratch3_akari_blocks_simple'),
    akaricamerasimple: () => require('../extensions/scratch3_akari_camera_simple'),
    extraUtilz: () => require('../extensions/scratch3_extrautilz'),
	http: () => require('../extensions/scratch3_http'),
    cookies: () => require('../extensions/scratch3_cookies'),
    controller: () => require('../extensions/scratch3_controller'),
	debugger: () => require('../extensions/scratch3_debugger'),
	webmidi: () => require('../extensions/scratch3_webmidi'),
    Scratch3WirelessBlocks: () => require('../extensions/scratch3_wireless'),
    nmsderpMap: () => require('../extensions/nmsderp_maps'),
    pythonExtension: () => require("../extensions/nmsderp_python"),
    threeAxisAccelerometer: () => require("../extensions/scratch3_3axis"),
    scratch2maqueen: () => require("../extensions/scratch3_scratch2maqueen"),
    shareExt: () => require("../extensions/scratch3_share"),
    sweetalert2: () => require("../extensions/scratch3_sweetalert"),
    onegpioArduino: () => require('../extensions/scratch3_onegpioArduino'),
    onegpioRpi: () => require('../extensions/scratch3_onegpioRpi'),
    onegpioEsp: () => require('../extensions/scratch3_onegpioEsp'),
    onegpioPicoboard: () => require('../extensions/scratch3_onegpioPicoboard'),
    onegpioCpx: () => require('../extensions/scratch3_onegpioCpx'),
    onegpioRoboHAT: () => require('../extensions/scratch3_onegpioRoboHAT'),
    onegpioRpiPico: () => require('../extensions/scratch3_onegpioRpiPico'),
	cubroidDCMotor: () => require('../extensions/scratch3_cubroid_dc_motor'),
	cubroidProximity: () => require('../extensions/scratch3_cubroid_proximity'),
	echidna: () => require('../extensions/scratch3_echidna'),
	tello2: () => require('../extensions/scratch3_tello2'),
	cubroidDCMotor: () => require('../extensions/scratch3_cubroid_dc_motor'),
	cubroidProximity: () => require('../extensions/scratch3_cubroid_proximity'),
	reqRep: () => require('../extensions/scratch3_req_rep'),
	shredsdk: () => require('../extensions/shredsdk'),
	utils: () => require('../extensions/scratch3_utils'),
	
	// Mistium
	patching: () => require('../extensions/mistwarp_patching'),
	
	//Not mine. This goes to KyleKart.
	frog: () => require('../extensions/kylekart'),
	
	// Custom extentions
    edubot: () => require("../extensions/scratch3_edubot"),
    dinnye: () => require("../extensions/scratch3_dinnye"),
    sencu: () => require("../extensions/scratch3_sencu"),
    deepseek: () => require("../extensions/deepseek"),
	
	network: () => require('../extensions/scratchplusplus_network'),
    impulse: () => require('../extensions/scratchplusplus_impulse'),
    tempvars: () => require('../extensions/scratchplusplus_tempvars'),
	emo: () => require('../extensions/scratch_emo'),
	
	newblocks: () => require('../extensions/scratch3_newblocks'),
    chatgpt: () => require('../extensions/scratch3_chatgpt'),
    voicevox: () => require('../extensions/scratch3_voicevox'),
	line: () => require('../extensions/scratch3_line'),
	
	playgo: () => require('../extensions/scratch3_playgo'),
    playiot: () => require('../extensions/scratch3_playiot'),
	ellabsextension: () => require('../extensions/scratch3_ellabs'),
	nft: () => require('../extensions/scratch3_nft'),
	zumiAIS: () => require('../extensions/scratch3_esp32serial'),
    zumiAIB: () => require('../extensions/scratch3_esp32bluetooth'),
	
	webkit: () => require("../extensions/scratch3_webkit"),
	bodyblocks: () => require('../extensions/scratch3_bodyblocks'),
	 pictobloxmath: () => require('../extensions/scratch3_PictoBloxMath'),
    pictobloxstring: () => require('../extensions/scratch3_PictoBloxString'),
	
	
	//by yj
    lazyAudio: () => require('../extensions/scratch3_lazy_audio'),
    canvas: () => require('../extensions/scratch3_canvas'),
    battle: () => require('../extensions/scratch3_battle'),
    js: () => require('../extensions/scratch3_js'),
    stringExt: () => require('../extensions/scratch3_string_ext'),
    puzzle: () => require('../extensions/scratch3_puzzle'),
    community: () => require('../extensions/scratch3_community'),
    kinect: () => require('../extensions/scratch3_kinect'),
	
    gasoIFTTT: () => require('../extensions/scratch3_ifttt'),
    gasoLASS: () => require('../extensions/scratch3_lass'),
    gasoThingSpeak: () => require('../extensions/scratch3_thingspeak'),
	
    matatabot: () => require('../extensions/scratch3_matatabot'),
    midi: () => require('../extensions/scratch3_midi'),
    futureBoard: () => require('../extensions/scratch3_future_board'),
    minecraft: () => require('../extensions/scratch3_minecraft'),
    toolbox: () => require('../extensions/scratch3_toolbox'),
    magicBlueUU: () => require('../extensions/scratch3_magic_blue_uu'),
	spikePrime: () => require('../extensions/scratch3_spike_prime'),
	iCarPro: () => require('../extensions/scratch3_icar_pro'),
    snapCircuitsU33: () => require('../extensions/scratch3_snap_circuits_u33'),
	smartLumies: () => require('../extensions/scratch3_smart_lumies'),
	kori: () => require('../extensions/scratch3_kori'),
	
	ros: () => require('../extensions/scratch3_ros'),
    pr2Robot: () => require('../extensions/scratch3_pr2robot'),
    fetchRobot: () => require('../extensions/scratch3_fetchrobot'),
    spotRobot: () => require('../extensions/scratch3_spotrobot'),
    go1Robot: () => require('../extensions/scratch3_go1robot'),
	pepperRobot: () => require('../extensions/scratch3_pepperrobot'),
	
	
	scratchpro: () => require('../extensions/scratch3_scratchpro'),
    scratchpro_tool: () => require('../extensions/scratchpro_tool'),
    scratchpro_text: () => require('../extensions/scratchpro_text'),
    scratchpro_math: () => require('../extensions/scratchpro_math'),
    scratchpro_data: () => require('../extensions/scratchpro_data'),
    scratchpro_io: () => require('../extensions/scratchpro_io'),
    scratchpro_sense: () => require('../extensions/scratchpro_sense'),
    scratchpro_flow: () => require('../extensions/scratchpro_flow'),
    scratchpro_ai: () => require('../extensions/scratchpro_ai'),
    scratchpro_gfx: () => require('../extensions/scratchpro_gfx'),
    scratchpro_audio: () => require('../extensions/scratchpro_audio'),
    scratchpro_game: () => require('../extensions/scratchpro_game'),
    scratchpro_crypto: () => require('../extensions/scratchpro_crypto'),
	
	
	network: () => require('../extensions/scratchplusplus_network'),
    impulse: () => require('../extensions/scratchplusplus_impulse'),
    tempvars: () => require('../extensions/scratchplusplus_tempvars'),
	emo: () => require('../extensions/scratch_emo'),
	missmixalot: () => require('../extensions/scratch3_missmixalot'),
    
    cliphttpio: () => require('../extensions/clip_httpio'),
    clipccjson: () => require('../extensions/clipcc_json'),
    clipblocks: () => require('../extensions/clipblocks'),
    libra: () => require('../extensions/scp_libra'),
	
	    // adacraft
    adabrowser: () => require('../extensions/scratch3_adabrowser'),
    adacraftleaflet: ()=> require('../extensions/adacraft_leaflet'),
    croquet: () => require('../extensions/scratch3_croquet'),
    adahttp: () => require('../extensions/scratch3_adahttp'),
    chronometer: () => require('../extensions/adacraft_chronometer'),
    gif: () => require('../extensions/adacraft_gif'),
    adavision: () => require('../extensions/scratch3_adavision'),
    adasound: () => require('../extensions/scratch3_adasound'),
    adaruntime: () => require('../extensions/scratch3_adaruntime'),
    adap5: () => require('../extensions/scratch3_adap5'),
	
	fourLeggedBionicSpider: () => require('../extensions/scratch3_spider_robot'),
    carMotor: () => require('../extensions/scratch_car_motor'),
    carMotorV2: () => require('../extensions/scratch_car_motorV2'),
    LordBot: () => require('../extensions/scratch_LordBot'),
    mechanicalArm: () => require('../extensions/scratch_mechanical_arm'),
    bipedRobot: () => require('../extensions/scratch_biped_robot'),
    ASR: () => require('../extensions/scratch_ASR'),
    meteorologicalStation: () => require('../extensions/scratch_meteorologicalStation'),
    smartHome: () => require('../extensions/scratch_smart_home'),
    smartFarm: () => require('../extensions/scratch_smart_farm'),
    bluetoothController: () => require('../extensions/scratch_bluetooth_controller'),
    PAW: () => require('../extensions/scratch_PAW'),
    sharkbot: () => require('../extensions/scratch_sharkbot'),
    truckbott: () => require('../extensions/scratch_truckbott'),
    battleCar: () => require('../extensions/scratch_battle_car'),
    nineInOne: () => require('../extensions/scratch_nine_in_one'),
};

// Compute SHA hash of a string (taken from StackOverflow)
async function sha256 (source) {
    const sourceBytes = new TextEncoder().encode(source);
    const digest = await crypto.subtle.digest("SHA-256", sourceBytes);
    const resultBytes = [...new Uint8Array(digest)];
    return resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
}

/**
 * @typedef {object} ArgumentInfo - Information about an extension block argument
 * @property {ArgumentType} type - the type of value this argument can take
 * @property {*|undefined} default - the default value of this argument (default: blank)
 */

/**
 * @typedef {object} ConvertedBlockInfo - Raw extension block data paired with processed data ready for scratch-blocks
 * @property {ExtensionBlockMetadata} info - the raw block info
 * @property {object} json - the scratch-blocks JSON definition for this block
 * @property {string} xml - the scratch-blocks XML definition for this block
 */

/**
 * @typedef {object} CategoryInfo - Information about a block category
 * @property {string} id - the unique ID of this category
 * @property {string} name - the human-readable name of this category
 * @property {string|undefined} blockIconURI - optional URI for the block icon image
 * @property {string} color1 - the primary color for this category, in '#rrggbb' format
 * @property {string} color2 - the secondary color for this category, in '#rrggbb' format
 * @property {string} color3 - the tertiary color for this category, in '#rrggbb' format
 * @property {Array.<ConvertedBlockInfo>} blocks - the blocks, separators, etc. in this category
 * @property {Array.<object>} menus - the menus provided by this category
 */

/**
 * @typedef {object} PendingExtensionWorker - Information about an extension worker still initializing
 * @property {string} extensionURL - the URL of the extension to be loaded by this worker
 * @property {Function} resolve - function to call on successful worker startup
 * @property {Function} reject - function to call on failed worker startup
 */

const createExtensionService = extensionManager => {
    const service = {};
    service.registerExtensionServiceSync = extensionManager.registerExtensionServiceSync.bind(extensionManager);
    service.allocateWorker = extensionManager.allocateWorker.bind(extensionManager);
    service.onWorkerInit = extensionManager.onWorkerInit.bind(extensionManager);
    service.registerExtensionService = extensionManager.registerExtensionService.bind(extensionManager);
    return service;
};

class ExtensionManager {
    constructor (vm) {
        /**
         * The ID number to provide to the next extension worker.
         * @type {int}
         */
        this.nextExtensionWorker = 0;

        /**
         * FIFO queue of extensions which have been requested but not yet loaded in a worker,
         * along with promise resolution functions to call once the worker is ready or failed.
         *
         * @type {Array.<PendingExtensionWorker>}
         */
        this.pendingExtensions = [];

        /**
         * Map of worker ID to workers which have been allocated but have not yet finished initialization.
         * @type {Array.<PendingExtensionWorker>}
         */
        this.pendingWorkers = [];

        /**
         * Map of worker ID to the URL where it was loaded from.
         * @type {Array<string>}
         */
        this.workerURLs = [];

        /**
         * Map of loaded extension URLs/IDs (equivalent for built-in extensions) to service name.
         * @type {Map.<string,string>}
         * @private
         */
        this._loadedExtensions = new Map();
		
		   /**
         * Extensions URL codes.
         * @type {Object.<string,string>}
         */
        this.extensionsURLCodes = {};

        /**
         * Map of all new SHAs so we know when a new code update has happened and so ask the user about it.
         * @type {Object.<string,string>}
         */
        this.extensionsHashes = {};

        /**
         * Responsible for determining security policies related to custom extensions.
         */
        this.securityManager = new SecurityManager();

        /**
         * @type {VirtualMachine}
         */
        this.vm = vm;

        /**
         * Keep a reference to the runtime so we can construct internal extension objects.
         * TODO: remove this in favor of extensions accessing the runtime as a service.
         * @type {Runtime}
         */
        this.runtime = vm.runtime;

        this.loadingAsyncExtensions = 0;
        this.asyncExtensionsLoadedCallbacks = [];

        this.builtinExtensions = Object.assign({}, defaultBuiltinExtensions);

        dispatch.setService('extensions', createExtensionService(this)).catch(e => {
            log.error(`ExtensionManager was unable to register extension service: ${JSON.stringify(e)}`);
        });
		
		if (enableCoreEx) {
            this.loadExtensionIdSync('coreExample');
            this.loadExtensionIdSync('omegaex');
        }
    }

    /**
     * Check whether an extension is registered or is in the process of loading. This is intended to control loading or
     * adding extensions so it may return `true` before the extension is ready to be used. Use the promise returned by
     * `loadExtensionURL` if you need to wait until the extension is truly ready.
     * @param {string} extensionID - the ID of the extension.
     * @returns {boolean} - true if loaded, false otherwise.
     */
    isExtensionLoaded (extensionID) {
        return this._loadedExtensions.has(extensionID);
    }

    /**
     * Determine whether an extension with a given ID is built in to the VM, such as pen.
     * Note that "core extensions" like motion will return false here.
     * @param {string} extensionId
     * @returns {boolean}
     */
    isBuiltinExtension (extensionId) {
        return Object.prototype.hasOwnProperty.call(this.builtinExtensions, extensionId);
    }

    /**
     * Synchronously load an internal extension (core or non-core) by ID. This call will
     * fail if the provided id is not does not match an internal extension.
     * @param {string} extensionId - the ID of an internal extension
     */
    loadExtensionIdSync (extensionId) {
        if (!this.isBuiltinExtension(extensionId)) {
            log.warn(`Could not find extension ${extensionId} in the built in extensions.`);
            return;
        }

        /** @TODO dupe handling for non-builtin extensions. See commit 670e51d33580e8a2e852b3b038bb3afc282f81b9 */
        if (this.isExtensionLoaded(extensionId)) {
            const message = `Rejecting attempt to load a second extension with ID ${extensionId}`;
            log.warn(message);
            return;
        }

        const extension = this.builtinExtensions[extensionId]();
        const extensionInstance = new extension(this.runtime);
        const serviceName = this._registerInternalExtension(extensionInstance);
        this._loadedExtensions.set(extensionId, serviceName);
        this.runtime.compilerRegisterExtension(extensionId, extensionInstance);
    }

    addBuiltinExtension (extensionId, extensionClass) {
        this.builtinExtensions[extensionId] = () => extensionClass;
    }

    _isValidExtensionURL (extensionURL) {
        try {
            const parsedURL = new URL(extensionURL);
            return (
                parsedURL.protocol === 'https:' ||
                parsedURL.protocol === 'http:' ||
                parsedURL.protocol === 'data:' ||
                parsedURL.protocol === 'file:'
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * Load an extension by URL or internal extension ID
     * @param {string} extensionURL - the URL for the extension to load OR the ID of an internal extension
     * @returns {Promise} resolved once the extension is loaded and initialized or rejected on failure
     */
    
_isLocalExtensionURL (extensionURL) {
        try {
            const parsedURL = new URL(extensionURL);
            return parsedURL.protocol === 'data:' || parsedURL.protocol === 'file:';
        } catch (e) {
            return false;
        }
    }
    
        async loadExtensionURL (extensionURL, oldHash = '') {
        if (this.isBuiltinExtension(extensionURL)) {
            this.loadExtensionIdSync(extensionURL);
            return;
        }

        if (this.isExtensionURLLoaded(extensionURL)) {
            // Extension is already loaded.
            return;
        }

        if (!this._isValidExtensionURL(extensionURL)) {
            throw new Error(`Invalid extension URL: ${extensionURL}`);
        }

        this.runtime.setExternalCommunicationMethod('customExtensions', true);

        this.loadingAsyncExtensions++;

        // data: and file: URLs are local (inline text or local file) — no sandbox, no security checks
        const isLocal = this._isLocalExtensionURL(extensionURL);
        const sandboxMode = isLocal ? 'unsandboxed' : await this.securityManager.getSandboxMode(extensionURL);
        const rewritten = isLocal ? extensionURL : await this.securityManager.rewriteExtensionURL(extensionURL);
		
		const blob = (await fetch(rewritten).then(req => req.blob()))
        const blobURL = URL.createObjectURL(blob)
        const newHash = await new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = async ({ target: { result } }) => {
                console.log(result);
                this.extensionsURLCodes[extensionURL] = result;
                resolve(await sha256(result));
            }
            reader.onerror = error => {
                console.error('Couldn\'t read the contents of url', extensionURL, error);
            }
            reader.readAsText(blob);
        });
        this.extensionsHashes[extensionURL] = newHash;
        if (oldHash && oldHash !== newHash && this.securityManager.shouldUseLocal(extensionURL)) return Promise.reject('useLocal'); 

        if (sandboxMode === 'unsandboxed') {
            const {load} = require('./tw-unsandboxed-extension-runner');
            const extensionObjects = await load(blobURL, this.vm, {bypassSecurity: isLocal})
                .catch(error => this._failedLoadingExtensionScript(error));
            const fakeWorkerId = this.nextExtensionWorker++;
            this.workerURLs[fakeWorkerId] = extensionURL;

            for (const extensionObject of extensionObjects) {
                const extensionInfo = extensionObject.getInfo();
                const serviceName = `unsandboxed.${fakeWorkerId}.${extensionInfo.id}`;
                dispatch.setServiceSync(serviceName, extensionObject);
                dispatch.callSync('extensions', 'registerExtensionServiceSync', serviceName);
                this._loadedExtensions.set(extensionInfo.id, serviceName);
            }

            this._finishedLoadingExtensionScript();
            return;
        }

        /* eslint-disable max-len */
        let ExtensionWorker;
        if (sandboxMode === 'worker') {
            ExtensionWorker = require('worker-loader?name=js/extension-worker/extension-worker.[hash].js!./extension-worker');
        } else if (sandboxMode === 'iframe') {
            ExtensionWorker = (await import(/* webpackChunkName: "iframe-extension-worker" */ './tw-iframe-extension-worker')).default;
        } else {
            throw new Error(`Invalid sandbox mode: ${sandboxMode}`);
        }
        /* eslint-enable max-len */

        return new Promise((resolve, reject) => {
            this.pendingExtensions.push({extensionURL: rewritten, resolve, reject});
            dispatch.addWorker(new ExtensionWorker());
        }).catch(error => this._failedLoadingExtensionScript(error));
    }

    /**
     * Wait until all async extensions have loaded
     * @returns {Promise} resolved when all async extensions have loaded
     */
    allAsyncExtensionsLoaded () {
        if (this.loadingAsyncExtensions === 0) {
            return;
        }
        return new Promise((resolve, reject) => {
            this.asyncExtensionsLoadedCallbacks.push({
                resolve,
                reject
            });
        });
    }

    /**
     * Regenerate blockinfo for any loaded extensions
     * @param {string} [optExtensionId] Optional extension ID for refreshing
     * @returns {Promise} resolved once all the extensions have been reinitialized
     */
    refreshBlocks (optExtensionId) {
        const refresh = serviceName => dispatch.call(serviceName, 'getInfo')
            .then(info => {
                info = this._prepareExtensionInfo(serviceName, info);
                dispatch.call('runtime', '_refreshExtensionPrimitives', info);
            })
            .catch(e => {
                log.error('Failed to refresh built-in extension primitives', e);
            });
        if (optExtensionId) {
            if (!this._loadedExtensions.has(optExtensionId)) {
                return Promise.reject(new Error(`Unknown extension: ${optExtensionId}`));
            }
            return refresh(this._loadedExtensions.get(optExtensionId));
        }
        const allPromises = Array.from(this._loadedExtensions.values()).map(refresh);
        return Promise.all(allPromises);
    }

    allocateWorker () {
        const id = this.nextExtensionWorker++;
        const workerInfo = this.pendingExtensions.shift();
        this.pendingWorkers[id] = workerInfo;
        this.workerURLs[id] = workerInfo.extensionURL;
        return [id, workerInfo.extensionURL];
    }

    /**
     * Synchronously collect extension metadata from the specified service and begin the extension registration process.
     * @param {string} serviceName - the name of the service hosting the extension.
     */
    registerExtensionServiceSync (serviceName) {
        const info = dispatch.callSync(serviceName, 'getInfo');
        this._registerExtensionInfo(serviceName, info);
    }

    /**
     * Collect extension metadata from the specified service and begin the extension registration process.
     * @param {string} serviceName - the name of the service hosting the extension.
     */
    registerExtensionService (serviceName) {
        dispatch.call(serviceName, 'getInfo').then(info => {
            this._loadedExtensions.set(info.id, serviceName);
            this._registerExtensionInfo(serviceName, info);
            this._finishedLoadingExtensionScript();
        });
    }

    _finishedLoadingExtensionScript () {
        this.loadingAsyncExtensions--;
        if (this.loadingAsyncExtensions === 0) {
            this.asyncExtensionsLoadedCallbacks.forEach(i => i.resolve());
            this.asyncExtensionsLoadedCallbacks = [];
        }
    }

    _failedLoadingExtensionScript (error) {
        // Don't set the current extension counter to 0, otherwise it will go negative if another
        // extension finishes or fails to load.
        this.loadingAsyncExtensions--;
        this.asyncExtensionsLoadedCallbacks.forEach(i => i.reject(error));
        this.asyncExtensionsLoadedCallbacks = [];
        // Re-throw error so the promise still rejects.
        throw error;
    }

    /**
     * Called by an extension worker to indicate that the worker has finished initialization.
     * @param {int} id - the worker ID.
     * @param {*?} e - the error encountered during initialization, if any.
     */
    onWorkerInit (id, e) {
        const workerInfo = this.pendingWorkers[id];
        delete this.pendingWorkers[id];
        if (e) {
            workerInfo.reject(e);
        } else {
            workerInfo.resolve();
        }
    }

    /**
     * Register an internal (non-Worker) extension object
     * @param {object} extensionObject - the extension object to register
     * @returns {string} The name of the registered extension service
     */
    _registerInternalExtension (extensionObject) {
        const extensionInfo = extensionObject.getInfo();
        const fakeWorkerId = this.nextExtensionWorker++;
        const serviceName = `extension_${fakeWorkerId}_${extensionInfo.id}`;
        dispatch.setServiceSync(serviceName, extensionObject);
        dispatch.callSync('extensions', 'registerExtensionServiceSync', serviceName);
        return serviceName;
    }

    /**
     * Sanitize extension info then register its primitives with the VM.
     * @param {string} serviceName - the name of the service hosting the extension
     * @param {ExtensionInfo} extensionInfo - the extension's metadata
     * @private
     */
    _registerExtensionInfo (serviceName, extensionInfo) {
        extensionInfo = this._prepareExtensionInfo(serviceName, extensionInfo);
        dispatch.call('runtime', '_registerExtensionPrimitives', extensionInfo).catch(e => {
            log.error(`Failed to register primitives for extension on service ${serviceName}:`, e);
        });
    }

    /**
     * Apply minor cleanup and defaults for optional extension fields.
     * TODO: make the ID unique in cases where two copies of the same extension are loaded.
     * @param {string} serviceName - the name of the service hosting this extension block
     * @param {ExtensionInfo} extensionInfo - the extension info to be sanitized
     * @returns {ExtensionInfo} - a new extension info object with cleaned-up values
     * @private
     */
    _prepareExtensionInfo (serviceName, extensionInfo) {
        extensionInfo = Object.assign({}, extensionInfo);
        if (!/^[a-z0-9]+$/i.test(extensionInfo.id)) {
            throw new Error('Invalid extension id');
        }
        extensionInfo.name = extensionInfo.name || extensionInfo.id;
        extensionInfo.blocks = extensionInfo.blocks || [];
        extensionInfo.targetTypes = extensionInfo.targetTypes || [];
        extensionInfo.blocks = extensionInfo.blocks.reduce((results, blockInfo) => {
            try {
                let result;
                switch (blockInfo) {
                case '---': // separator
                    result = '---';
                    break;
                default: // an ExtensionBlockMetadata object
                    result = this._prepareBlockInfo(serviceName, blockInfo);
                    break;
                }
                results.push(result);
            } catch (e) {
                // TODO: more meaningful error reporting
                log.error(`Error processing block: ${e.message}, Block:\n${JSON.stringify(blockInfo)}`);
            }
            return results;
        }, []);
        extensionInfo.menus = extensionInfo.menus || {};
        extensionInfo.menus = this._prepareMenuInfo(serviceName, extensionInfo.menus);
        return extensionInfo;
    }

    /**
     * Prepare extension menus. e.g. setup binding for dynamic menu functions.
     * @param {string} serviceName - the name of the service hosting this extension block
     * @param {Array.<MenuInfo>} menus - the menu defined by the extension.
     * @returns {Array.<MenuInfo>} - a menuInfo object with all preprocessing done.
     * @private
     */
    _prepareMenuInfo (serviceName, menus) {
        const menuNames = Object.getOwnPropertyNames(menus);
        for (let i = 0; i < menuNames.length; i++) {
            const menuName = menuNames[i];
            let menuInfo = menus[menuName];

            // If the menu description is in short form (items only) then normalize it to general form: an object with
            // its items listed in an `items` property.
            if (!menuInfo.items) {
                menuInfo = {
                    items: menuInfo
                };
                menus[menuName] = menuInfo;
            }
            // If `items` is a string, it should be the name of a function in the extension object. Calling the
            // function should return an array of items to populate the menu when it is opened.
            if (typeof menuInfo.items === 'string') {
                const menuItemFunctionName = menuInfo.items;
                const serviceObject = dispatch.services[serviceName];
                // Bind the function here so we can pass a simple item generation function to Scratch Blocks later.
                menuInfo.items = this._getExtensionMenuItems.bind(this, serviceObject, menuItemFunctionName);
            }
        }
        return menus;
    }

    /**
     * Fetch the items for a particular extension menu, providing the target ID for context.
     * @param {object} extensionObject - the extension object providing the menu.
     * @param {string} menuItemFunctionName - the name of the menu function to call.
     * @returns {Array} menu items ready for scratch-blocks.
     * @private
     */
    _getExtensionMenuItems (extensionObject, menuItemFunctionName) {
        // Fetch the items appropriate for the target currently being edited. This assumes that menus only
        // collect items when opened by the user while editing a particular target.
        const editingTarget = this.runtime.getEditingTarget() || this.runtime.getTargetForStage();
        const editingTargetID = editingTarget ? editingTarget.id : null;
        const extensionMessageContext = this.runtime.makeMessageContextForTarget(editingTarget);

        // TODO: Fix this to use dispatch.call when extensions are running in workers.
        const menuFunc = extensionObject[menuItemFunctionName];
        const menuItems = menuFunc.call(extensionObject, editingTargetID).map(
            item => {
                item = maybeFormatMessage(item, extensionMessageContext);
                switch (typeof item) {
                case 'object':
                    return [
                        maybeFormatMessage(item.text, extensionMessageContext),
                        item.value
                    ];
                case 'string':
                    return [item, item];
                default:
                    return item;
                }
            });

        if (!menuItems || menuItems.length < 1) {
            throw new Error(`Extension menu returned no items: ${menuItemFunctionName}`);
        }
        return menuItems;
    }

    /**
     * Apply defaults for optional block fields.
     * @param {string} serviceName - the name of the service hosting this extension block
     * @param {ExtensionBlockMetadata} blockInfo - the block info from the extension
     * @returns {ExtensionBlockMetadata} - a new block info object which has values for all relevant optional fields.
     * @private
     */
    _prepareBlockInfo (serviceName, blockInfo) {
        if (blockInfo.blockType === BlockType.XML) {
            blockInfo = Object.assign({}, blockInfo);
            blockInfo.xml = String(blockInfo.xml) || '';
            return blockInfo;
        }

        blockInfo = Object.assign({}, {
            blockType: BlockType.COMMAND,
            terminal: false,
            blockAllThreads: false,
            arguments: {}
        }, blockInfo);
        blockInfo.text = blockInfo.text || blockInfo.opcode;

        switch (blockInfo.blockType) {
        case BlockType.EVENT:
            if (blockInfo.func) {
                log.warn(`Ignoring function "${blockInfo.func}" for event block ${blockInfo.opcode}`);
            }
            break;
        case BlockType.BUTTON:
            if (blockInfo.opcode) {
                log.warn(`Ignoring opcode "${blockInfo.opcode}" for button with text: ${blockInfo.text}`);
            }
            blockInfo.callFunc = () => {
                dispatch.call(serviceName, blockInfo.func);
            };
            break;
        case BlockType.LABEL:
            if (blockInfo.opcode) {
                log.warn(`Ignoring opcode "${blockInfo.opcode}" for label: ${blockInfo.text}`);
            }
            break;
        default: {
            if (!blockInfo.opcode) {
                throw new Error('Missing opcode for block');
            }

            const funcName = blockInfo.func || blockInfo.opcode;

            const getBlockInfo = blockInfo.isDynamic ?
                args => args && args.mutation && args.mutation.blockInfo :
                () => blockInfo;
            const callBlockFunc = (() => {
                if (dispatch._isRemoteService(serviceName)) {
                    return (args, util, realBlockInfo) =>
                        dispatch.call(serviceName, funcName, args, util, realBlockInfo)
                            .then(result => {
                                // Scratch is only designed to handle these types.
                                // If any other value comes in such as undefined, null, an object, etc.
                                // we'll convert it to a string to avoid undefined behavior.
                                if (
                                    typeof result === 'number' ||
                                    typeof result === 'string' ||
                                    typeof result === 'boolean'
                                ) {
                                    return result;
                                }
                                return `${result}`;
                            });
                }

                // avoid promise latency if we can call direct
                const serviceObject = dispatch.services[serviceName];
				if (!serviceObject) {
                    // Extension was likely removed
                    return () => {};
                }
                if (!serviceObject[funcName]) {
                    // The function might show up later as a dynamic property of the service object
                    log.warn(`Could not find extension block function called ${funcName}`);
                }
                return (args, util, realBlockInfo) =>
                    serviceObject[funcName](args, util, realBlockInfo);
            })();

            blockInfo.func = (args, util) => {
                const realBlockInfo = getBlockInfo(args);
                // TODO: filter args using the keys of realBlockInfo.arguments? maybe only if sandboxed?
                return callBlockFunc(args, util, realBlockInfo);
            };
            break;
        }
        }

        return blockInfo;
    }

    /**
     * Get all opcodes for a loaded extension.
     * @param {string} extensionId - the ID of the extension
     * @returns {Array<string>} - list of opcodes
     * @private
     */
    _getExtensionOpcodes (extensionId) {
        const categoryInfo = this.runtime._blockInfo.find(info => info.id === extensionId);
        if (!categoryInfo) return [];
        return categoryInfo.blocks.filter(block => block.json).map(block => block.json.type);
    }

     /**
     * Prepare to swap out an extension.
     * @param {string} id - the ID of the extension
     */
    prepareSwap (id) {
        const serviceName = this._loadedExtensions.get(id);
        const {provider, isRemote} = dispatch._getServiceProvider(serviceName);
        if (isRemote || typeof provider.dispose === 'function') 
            dispatch.call(serviceName, 'dispose');
        delete dispatch.services[serviceName];
        delete this.runtime[`ext_${id}`];

        this._loadedExtensions.delete(id);
        const workerId = +serviceName.split('.')[1];
        delete this.workerURLs[workerId];
    }

    /**
     * Remove an extension.
     * @param {string} extensionId - the ID of the extension
     */
    removeExtension (extensionId) {
        if (!this.isExtensionLoaded(extensionId)) return;
        const serviceName = this._loadedExtensions.get(extensionId);
        const serviceProvider = dispatch._getServiceProvider(serviceName);
        if (serviceProvider) {
            const {provider, isRemote} = serviceProvider;
            if (isRemote || typeof provider.dispose === 'function') 
                dispatch.call(serviceName, 'dispose');
        }
        delete dispatch.services[serviceName];
        delete this.runtime[`ext_${extensionId}`];

        this._loadedExtensions.delete(extensionId);
        const workerId = +serviceName.split('.')[1];
        delete this.workerURLs[workerId];
        dispatch.call('runtime', '_removeExtensionPrimitive', extensionId);
        this.refreshBlocks();
    }

    /**
     * Get the extension ID from an opcode.
     * @param {*} opcode - the opcode to examine
     * @returns {string} - the extension ID, or empty string if core extension or invalid opcode
     */
     extensionIdFromOpcode (opcode) {
        // Allowed ID characters are those matching the regular expression [\w-]: A-Z, a-z, 0-9, and hyphen ("-").
        if (!(typeof opcode === 'string')) {
            console.error('Invalid opcode', opcode);
            return '';
        }
        const index = opcode.indexOf('_');
        const forbiddenSymbols = /[^\w-]/g;
        const prefix = opcode.substring(0, index).replace(forbiddenSymbols, '-');
        if (CORE_EXTENSIONS.indexOf(prefix) === -1) {
            if (prefix !== '') return prefix;
        }
    }

    findUsedExtensions () {
        const results = [];
        for (const target of this.runtime.targets) {
            for (const blockId in target.blocks._blocks) {
                const block = target.blocks.getBlock(blockId);
                const ext = this.extensionIdFromOpcode(block.opcode);
                results.push(ext);
            }
        }
        return results;
    }

    removeUnusedExtensions () {
        const all = [...this._loadedExtensions.keys()];
        const used = this.findUsedExtensions();
        const unused = all.filter(ext => !used.includes(ext));
        for (const toRemove of unused)
            this.removeExtension(toRemove);
    }

    /**
     * Get the extension URL from its ID.
     * @param {string} extensionId - the ID of the extension
     * @returns {string|undefined} - the URL of the extension, or undefined if not found
     */
    extensionURLFromId (extensionId) {
        for (const [extensionId, serviceName] of this._loadedExtensions.entries()) {
            if (extensionId !== extensionId) continue;
            // Service names for extension workers are in the format "extension.WORKER_ID.EXTENSION_ID"
            const workerId = +serviceName.split('.')[1];
            return this.workerURLs[workerId];
        }
    }

    getExtensionURLs () {
        const extensionURLs = {};
        for (const [extensionId, serviceName] of this._loadedExtensions.entries()) {
            if (Object.prototype.hasOwnProperty.call(this.builtinExtensions, extensionId)) {
                continue;
            }

            // Service names for extension workers are in the format "extension.WORKER_ID.EXTENSION_ID"
            const workerId = +serviceName.split('.')[1];
            const extensionURL = this.workerURLs[workerId];
            if (typeof extensionURL === 'string') {
                extensionURLs[extensionId] = extensionURL;
            }
        }
        return extensionURLs;
    }

    isExtensionURLLoaded (url) {
        return Object.values(this.workerURLs).includes(url);
    }
}

module.exports = ExtensionManager;
