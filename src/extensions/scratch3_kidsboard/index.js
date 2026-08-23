const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');

/**
 * KidsBoard (ESP32-C3) extension
 * ネコマ製作所 KidsBoard を Web Bluetooth (WebBLE) で直接操作する拡張機能。
 *
 * 対応ファームウェア: KBS1 = KidsBoardScratch.ino
 *    - コマンド: 4バイト固定レコード [opcode, pin, 値下位, 値上位] (uint16 LE)
 *    - 通知: [レコード数, (pin, 値下位, 値上位)...] デジタル0/1・アナログ0-4095
 */

// ---- KBS1: KidsBoardScratch.ino (独自ファームウェア) ----
const KBS_SERVICE_UUID = 'd05fa559-31fb-4bcd-b370-facc7397c77d';
const KBS_COMMAND_UUID = 'c62a8136-a171-4339-98cf-de0fa8b0fa2a';
const KBS_SENSOR_UUID = 'fe26df37-8695-4de8-b8c5-2642d717ec78';

const KBS_OP = {
    SET_MODE: 0x01,
    DIGITAL_WRITE: 0x02,
    PWM_WRITE: 0x03,
    TONE_PLAY: 0x04,
    TONE_STOP: 0x05,
    CLEAR_OUTPUTS: 0x06,
    RESET_ALL: 0x07,
    SERVO_WRITE: 0x08,
    SONAR_SET: 0x09,
    NEO_CONFIG: 0x0A,
    NEO_PIXEL: 0x0B, // 8バイトレコード [op, pin, index, R, G, B, 0, 0]
    NEO_FILL: 0x0C, // 8バイトレコード [op, pin, 0, R, G, B, 0, 0]
    NEO_BRIGHTNESS: 0x0D,
    NEO_CLEAR: 0x0E
};

const KBS_MODE = {
    DIGITAL_IN: 0,
    DIGITAL_IN_PULLUP: 1,
    DIGITAL_IN_PULLDOWN: 2,
    ANALOG_IN: 3,
    DIGITAL_OUT: 4,
    PWM_OUT: 5,
    TONE_OUT: 6,
    SERVO_OUT: 7
};

// ピンに割り当て済みのモード (自動 pinMode 用)
const PinModeType = {
    OUT: 'out',
    IN: 'in',
    IN_PULLUP: 'inPullup',
    IN_PULLDOWN: 'inPulldown',
    ANALOG_IN: 'analogIn',
    PWM: 'pwm',
    TONE: 'tone',
    SERVO: 'servo'
};

// カラーLEDのLED数上限 (ファームウェア側と合わせる)
const NEO_MAX_PIXELS = 256;
const NEO_DEFAULT_PIXELS = 16;

// モータードライバー・信号機モジュールの共通ピン (P0/P1/P3/P4のどのポートでもBはGPIO5)
const MODULE_COMMON_PIN = 5;

// MIDIノート番号 -> 周波数(Hz)
const midiToFrequency = midiNote => 440 * Math.pow(2, (midiNote - 69) / 12);

// HSL (H:0-360, S:0-100, L:0-100) -> [R, G, B] (0-255)
const hslToRgb = (h, s, l) => {
    h = ((h % 360) + 360) % 360 / 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    if (s === 0) {
        const v = Math.round(l * 255);
        return [v, v, v];
    }
    const q = (l < 0.5) ? (l * (1 + s)) : (l + s - (l * s));
    const p = (2 * l) - q;
    const hueToChannel = t => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + ((q - p) * 6 * t);
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + ((q - p) * ((2 / 3) - t) * 6);
        return p;
    };
    return [
        Math.round(hueToChannel(h + (1 / 3)) * 255),
        Math.round(hueToChannel(h) * 255),
        Math.round(hueToChannel(h - (1 / 3)) * 255)
    ];
};

// ブロックアイコン (ネコ耳つきの基板)
const blockIconURI = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">' +
    '<polygon points="7,13 9,4 16,10" fill="#FFFFFF"/>' +
    '<polygon points="33,13 31,4 24,10" fill="#FFFFFF"/>' +
    '<rect x="5" y="9" width="30" height="26" rx="6" fill="#FFFFFF"/>' +
    '<polygon points="9,12 10.5,6.5 15,10.5" fill="#FF8C1A"/>' +
    '<polygon points="31,12 29.5,6.5 25,10.5" fill="#FF8C1A"/>' +
    '<rect x="7" y="11" width="26" height="22" rx="4" fill="#FF8C1A"/>' +
    '<circle cx="15" cy="20" r="2.5" fill="#FFFFFF"/>' +
    '<circle cx="25" cy="20" r="2.5" fill="#FFFFFF"/>' +
    '<path d="M 16 26 Q 20 30 24 26" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '</svg>'
);

/**
 * KidsBoard との BLE 通信を担当するクラス
 */
class KidsBoardPeripheral {
    constructor (runtime) {
        this._runtime = runtime;

        this._device = null;
        this._writeChr = null;
        this._notifyChr = null;

        // 通知で受け取った最新のピン値 {ピン番号: 値}
        this._pinValues = {};
        // 自動 pinMode 済みのモード {ピン番号: PinModeType}
        this._assignedPins = {};
        // 登録済み超音波センサ {Trigピン: Echoピン}
        this._sonarPins = {};
        // カラーLEDの構成 (1本のみ)
        this._neoPin = null;
        this._neoCount = 0;

        // モータードライバーの状態 {ポートピン: {direction, speed}}
        // 共通ピン(B)が全ポート共用のため、1ポートの操作が他ポートに影響する。
        // 全ポートの整合を取り直すために状態を持つ。
        this._motorStates = {};
        // 現在共通ピンに出しているモーター用PWM値
        this._motorCommonSpeed = 0;

        // 書き込みキュー (BLE書き込みは1つずつしか実行できないため直列化する)
        this._writeQueue = [];
        this._writeBusy = false;

        this._onNotify = this._onNotify.bind(this);
        this._onDisconnected = this._onDisconnected.bind(this);

        // 赤い停止ボタンで出力を全部止める
        if (this._runtime) {
            this._runtime.on('PROJECT_STOP_ALL', () => {
                if (!this.isConnected()) return;
                this._motorStates = {};
                this._motorCommonSpeed = 0;
                this._enqueue(null, [KBS_OP.CLEAR_OUTPUTS, 0, 0, 0]);
            });
        }
    }

    isConnected () {
        return !!(this._device && this._device.gatt && this._device.gatt.connected && this._writeChr);
    }

    /**
     * デバイス選択ダイアログを開いて接続する。
     * Web Bluetooth の仕様上、ユーザー操作 (ブロックのクリック等) から呼ぶ必要がある。
     */
    connect () {
        if (typeof navigator === 'undefined' || !navigator.bluetooth) {
            if (typeof window !== 'undefined') {
                window.alert('このブラウザはWeb Bluetoothに対応していません。Chromeを使ってください。');
            }
            return Promise.resolve();
        }
        if (this.isConnected()) {
            return Promise.resolve();
        }
        return navigator.bluetooth.requestDevice({
            filters: [
                {services: [KBS_SERVICE_UUID]}
            ]
        })
            .then(device => {
                this._device = device;
                device.addEventListener('gattserverdisconnected', this._onDisconnected);
                return device.gatt.connect();
            })
            .then(server =>
                // getPrimaryService単発より全列挙のほうが確実 (キャッシュ差異対策)
                server.getPrimaryServices()
                    .then(services => {
                        const uuids = services.map(s => s.uuid);
                        const kbsService = services.find(s => s.uuid === KBS_SERVICE_UUID);
                        if (kbsService) {
                            return Promise.all([
                                kbsService.getCharacteristic(KBS_COMMAND_UUID),
                                kbsService.getCharacteristic(KBS_SENSOR_UUID)
                            ]);
                        }
                        throw new Error(`KidsBoardのサービスが見つかりません (${uuids.join(', ')})`);
                    })
            )
            .then(([writeChr, notifyChr]) => {
                this._writeChr = writeChr;
                this._notifyChr = notifyChr;
                notifyChr.addEventListener('characteristicvaluechanged', this._onNotify);
                return notifyChr.startNotifications();
            })
            .then(() => {
                this._pinValues = {};
                this._assignedPins = {};
                this._sonarPins = {};
                this._neoPin = null;
                this._neoCount = 0;
                this._motorStates = {};
                this._motorCommonSpeed = 0;
                console.log('KidsBoard: connected');
            })
            .catch(e => {
                // _deviceがまだ無い = 選択ダイアログのキャンセルなので黙って終わる
                const wasCancelled = !this._device && e && e.name === 'NotFoundError';
                this.disconnect();
                if (!wasCancelled) {
                    console.error('KidsBoard connect error:', e);
                    if (typeof window !== 'undefined') {
                        window.alert(`KidsBoardに接続できませんでした:\n${e && e.message ? e.message : e}`);
                    }
                }
            });
    }

    disconnect () {
        if (this._device && this._device.gatt && this._device.gatt.connected) {
            this._device.gatt.disconnect();
        }
        this._cleanup();
    }

    _cleanup () {
        if (this._device) {
            this._device.removeEventListener('gattserverdisconnected', this._onDisconnected);
        }
        if (this._notifyChr) {
            this._notifyChr.removeEventListener('characteristicvaluechanged', this._onNotify);
        }
        this._device = null;
        this._writeChr = null;
        this._notifyChr = null;
        this._pinValues = {};
        this._assignedPins = {};
        this._sonarPins = {};
        this._neoPin = null;
        this._neoCount = 0;
        this._motorStates = {};
        this._motorCommonSpeed = 0;
        this._writeQueue = [];
        this._writeBusy = false;
    }

    _onDisconnected () {
        this._cleanup();
    }

    _onNotify (event) {
        const dv = event.target.value;
        // [レコード数, (pin, 値下位, 値上位)...]
        if (dv.byteLength < 1) return;
        const count = dv.getUint8(0);
        for (let i = 0; i < count; i++) {
            const offset = 1 + (i * 3);
            if (offset + 3 > dv.byteLength) break;
            const pin = dv.getUint8(offset);
            const value = dv.getUint16(offset + 1, true);
            this._pinValues[pin] = value;
        }
    }

    getPinValue (pin) {
        const v = this._pinValues[pin];
        return (typeof v === 'undefined') ? 0 : v;
    }

    /**
     * コマンドを書き込みキューへ。
     * key を指定すると、キュー内の同じ key のエントリをその場で上書きする
     * (ループでanalogWriteやservoWriteをし続けてもキューが溢れないように。
     *  複数ピンを交互に書く場合でもピンごとに最新1件に間引かれる)。
     * ただし key=null のエントリ (SET_MODE等の順序が重要なコマンド) より
     * 前には遡らない。同じピンのモード切替をまたいで上書きすると
     * 「書き込み→モード切替」の順序が壊れるため。
     */
    _enqueue (key, bytes) {
        if (!this.isConnected()) return;
        if (key !== null) {
            for (let i = this._writeQueue.length - 1; i >= 0; i--) {
                const entry = this._writeQueue[i];
                if (entry.key === null) break;
                if (entry.key === key) {
                    entry.bytes = bytes;
                    return;
                }
            }
        }
        this._writeQueue.push({key: key, bytes: bytes});
        this._pump();
    }

    _pump () {
        if (this._writeBusy) return;
        const entry = this._writeQueue.shift();
        if (!entry || !this._writeChr) return;
        this._writeBusy = true;
        const packet = new Uint8Array(entry.bytes);
        this._writeChr.writeValue(packet)
            .catch(e => {
                console.warn('KidsBoard write error:', e);
            })
            .then(() => {
                this._writeBusy = false;
                this._pump();
            });
    }

    /**
     * pinMode コマンドのバイト列を作る
     */
    _pinModeBytes (pin, modeType) {
        const mode = {
            [PinModeType.OUT]: KBS_MODE.DIGITAL_OUT,
            [PinModeType.IN]: KBS_MODE.DIGITAL_IN,
            [PinModeType.IN_PULLUP]: KBS_MODE.DIGITAL_IN_PULLUP,
            [PinModeType.IN_PULLDOWN]: KBS_MODE.DIGITAL_IN_PULLDOWN,
            [PinModeType.ANALOG_IN]: KBS_MODE.ANALOG_IN,
            [PinModeType.PWM]: KBS_MODE.PWM_OUT,
            [PinModeType.TONE]: KBS_MODE.TONE_OUT,
            [PinModeType.SERVO]: KBS_MODE.SERVO_OUT
        }[modeType];
        if (typeof mode === 'undefined') return null;
        return [KBS_OP.SET_MODE, pin, mode, 0];
    }

    /**
     * ピンが指定モードで未割り当てなら pinMode コマンドを送る
     */
    _assignIfNeeded (pin, modeType) {
        if (this._assignedPins[pin] === modeType) return;
        const bytes = this._pinModeBytes(pin, modeType);
        if (bytes) {
            this._enqueue(null, bytes);
            this._assignedPins[pin] = modeType;
        }
    }

    // ------ 操作 ------

    setPinMode (pin, mode) {
        const modeType = {
            OUTPUT: PinModeType.OUT,
            INPUT: PinModeType.IN,
            INPUT_PULLUP: PinModeType.IN_PULLUP,
            INPUT_PULLDOWN: PinModeType.IN_PULLDOWN,
            ANALOG: PinModeType.ANALOG_IN,
            PWM: PinModeType.PWM,
            TONE: PinModeType.TONE,
            SERVO: PinModeType.SERVO
        }[mode];
        if (!modeType) return;
        const bytes = this._pinModeBytes(pin, modeType);
        if (bytes) {
            this._enqueue(null, bytes);
            this._assignedPins[pin] = modeType;
        }
    }

    digitalWrite (pin, on) {
        this._assignIfNeeded(pin, PinModeType.OUT);
        this._enqueue(`dw${pin}`, [KBS_OP.DIGITAL_WRITE, pin, on ? 1 : 0, 0]);
    }

    analogWrite (pin, value) {
        this._assignIfNeeded(pin, PinModeType.PWM);
        value = Math.max(0, Math.min(255, Math.round(value)));
        this._enqueue(`aw${pin}`, [KBS_OP.PWM_WRITE, pin, value, 0]);
    }

    digitalRead (pin) {
        // 入力系モード(プルアップ等)で割り当て済みならそのまま読む
        const assigned = this._assignedPins[pin];
        if (assigned !== PinModeType.IN &&
            assigned !== PinModeType.IN_PULLUP &&
            assigned !== PinModeType.IN_PULLDOWN) {
            this._assignIfNeeded(pin, PinModeType.IN);
        }
        return this.getPinValue(pin) > 0;
    }

    analogRead (pin) {
        this._assignIfNeeded(pin, PinModeType.ANALOG_IN);
        // ファームはアナログ0-4095で通知するので、ブロックの0-1023に合わせる
        return this.getPinValue(pin) >> 2;
    }

    playNote (pin, midiNote) {
        this._assignIfNeeded(pin, PinModeType.TONE);
        midiNote = Math.max(12, Math.min(119, Math.round(midiNote)));
        const freq = Math.round(midiToFrequency(midiNote));
        this._enqueue(`tone${pin}`, [KBS_OP.TONE_PLAY, pin, freq & 0xFF, (freq >> 8) & 0xFF]);
    }

    stopNote (pin) {
        this._assignIfNeeded(pin, PinModeType.TONE);
        this._enqueue(`tone${pin}`, [KBS_OP.TONE_STOP, pin, 0, 0]);
    }

    // ------ サーボ (SG-90) ------

    servoWrite (pin, angle) {
        this._assignIfNeeded(pin, PinModeType.SERVO);
        angle = Math.max(0, Math.min(180, Math.round(angle)));
        this._enqueue(`servo${pin}`, [KBS_OP.SERVO_WRITE, pin, angle, 0]);
    }

    // ------ モータードライバー (Hブリッジ) ------

    /**
     * A=ポートピン(0/1/3/4)・B=共通ピン(GPIO5) の2入力で回転を制御する。
     * High側にPWM値を入れると速度調整になるため、両ピンをPWM出力にして
     * 正転=A:速度 B:0 / 逆転=A:0 B:速度 を書き込む。
     *
     * Bは全ポート共通のため、あるポートを逆転(B=PWM)させると
     * 他ポートのモーターも A=0 のままでは逆転条件になってしまう。
     * そこで全ポートの状態を記録し、停止中のポートには A=B と同じ
     * デューティを出して電位差を打ち消す(ブレーキ相当)。
     * 同様に、停止時も他ポートが逆転中なら B は落とさない。
     * ※ハード上の制約: 逆転は全ポート共通速度になり、
     *   「一方が正転・他方が逆転」の同時動作は正しく制御できない。
     * @param {number} portPin - モジュールを接続したポートのピン番号
     * @param {string} direction - 'forward' | 'reverse' | 'stop'
     * @param {number} speed - 速度 0-255
     */
    motorRun (portPin, direction, speed) {
        speed = Math.max(0, Math.min(255, Math.round(speed)));
        if (direction === 'stop') speed = 0;
        this._motorStates[portPin] = {direction: direction, speed: speed};

        // 共通ピンBの値: 今回の指示が逆転ならその速度、
        // そうでなくても他ポートが逆転中ならその速度を維持する
        let b = 0;
        if (direction === 'reverse') {
            b = speed;
        } else {
            for (const pin of Object.keys(this._motorStates)) {
                const st = this._motorStates[pin];
                if (st.direction === 'reverse') {
                    b = st.speed;
                    break;
                }
            }
        }

        // 全ピン分のPWMレコードを1パケットにまとめて一度に書き込む。
        // ピンごとに別々のBLE書き込み(1件数十ms)にすると、Bが届くまでの間に
        // 「A=PWM/B=0」(正転)や「A=0/B=PWM」(逆転)の過渡状態が数十msでき、
        // 停止中のモーターが一瞬回ってしまう。ファームは1書き込み内の
        // レコード列を連続処理(マイクロ秒間隔)するため過渡が実質消える。
        const pins = Object.keys(this._motorStates).map(Number);
        for (const pin of pins) {
            this._assignIfNeeded(pin, PinModeType.PWM);
        }
        this._assignIfNeeded(MODULE_COMMON_PIN, PinModeType.PWM);

        const aRecords = [];
        for (const pin of pins) {
            const st = this._motorStates[pin];
            let a = 0;
            if (st.direction === 'forward') {
                a = st.speed;
            } else if (st.direction === 'stop') {
                a = b; // Bと同じデューティで打ち消して停止を保つ
            }
            aRecords.push([KBS_OP.PWM_WRITE, pin, a, 0]);
        }
        // パケット内でもBを上げるときはA側を先に、下げるときはBを先に処理させる
        const bRecord = [KBS_OP.PWM_WRITE, MODULE_COMMON_PIN, b, 0];
        const records = (b >= this._motorCommonSpeed) ?
            aRecords.concat([bRecord]) :
            [bRecord].concat(aRecords);
        this._enqueue('motor', [].concat(...records));
        this._motorCommonSpeed = b;
    }

    // ------ 信号機モジュール ------

    /**
     * A=ポートピン(0/1/3/4)・B=共通ピン(GPIO5) の2入力でLEDを選ぶ。
     * A=High B=Low → 黄 / A=Low B=High → 緑 / A=Low B=Low → 赤
     * @param {number} portPin - モジュールを接続したポートのピン番号
     * @param {string} color - 'red' | 'yellow' | 'green'
     */
    signalSet (portPin, color) {
        const combo = {
            yellow: [true, false],
            green: [false, true],
            red: [false, false]
        }[color];
        if (!combo) return;
        this.digitalWrite(portPin, combo[0]);
        this.digitalWrite(MODULE_COMMON_PIN, combo[1]);
    }

    // ------ 超音波測距センサ ------

    /**
     * 距離をcmで返す (未測定・エコー無しは0)。
     * 初回はセンサ登録コマンドを送り、以降はファームウェアが
     * 定期測定してTrigピンのレコードとして距離mmを通知してくる。
     * @param {number} trigPin - Trigピン番号
     * @param {number} echoPin - Echoピン番号
     * @returns {number} 距離cm (小数1桁)
     */
    sonarDistanceCm (trigPin, echoPin) {
        if (this._sonarPins[trigPin] !== echoPin) {
            this._enqueue(null, [KBS_OP.SONAR_SET, trigPin, echoPin, 0]);
            this._sonarPins[trigPin] = echoPin;
            this._pinValues[trigPin] = 0;
        }
        return Math.round(this.getPinValue(trigPin) / 10 * 10) / 10;
    }

    // ------ カラーLED ------

    neoConfig (pin, count) {
        count = Math.max(1, Math.min(NEO_MAX_PIXELS, Math.round(count)));
        this._enqueue(null, [KBS_OP.NEO_CONFIG, pin, count & 0xFF, (count >> 8) & 0xFF]);
        this._neoPin = pin;
        this._neoCount = count;
    }

    // 構成ブロックを使っていなければ既定のLED数で自動構成する
    _ensureNeo () {
        if (this._neoPin === null) {
            // 未構成ならピンメニュー先頭のP0で仮構成 (本来は構成ブロックを使う)
            this.neoConfig(0, NEO_DEFAULT_PIXELS);
        }
        return this._neoPin;
    }

    neoSetPixel (index, r, g, b) {
        const pin = this._ensureNeo();
        index = Math.round(index);
        if (index < 0 || index >= this._neoCount) return;
        this._enqueue(`neo${index}`, [KBS_OP.NEO_PIXEL, pin, index, r & 0xFF, g & 0xFF, b & 0xFF, 0, 0]);
    }

    neoFill (r, g, b) {
        const pin = this._ensureNeo();
        this._enqueue('neofill', [KBS_OP.NEO_FILL, pin, 0, r & 0xFF, g & 0xFF, b & 0xFF, 0, 0]);
    }

    neoBrightness (brightness255) {
        const pin = this._ensureNeo();
        brightness255 = Math.max(0, Math.min(255, Math.round(brightness255)));
        this._enqueue('neobr', [KBS_OP.NEO_BRIGHTNESS, pin, brightness255, 0]);
    }

    neoClear () {
        if (this._neoPin === null) return;
        this._enqueue('neoclear', [KBS_OP.NEO_CLEAR, this._neoPin, 0, 0]);
    }
}

/**
 * Scratch 3.0 blocks for KidsBoard
 */
class Scratch3KidsBoardBlocks {
    static get EXTENSION_ID () {
        return 'kidsboard';
    }

    constructor (runtime) {
        this.runtime = runtime;
        this._peripheral = new KidsBoardPeripheral(runtime);
    }

    getInfo () {
        return {
            id: Scratch3KidsBoardBlocks.EXTENSION_ID,
            name: 'KidsBoard',
            blockIconURI: blockIconURI,
            menuIconURI: blockIconURI,
            color1: '#FF8C1A',
            color2: '#DB6E00',
            blocks: [
                {
                    opcode: 'connect',
                    text: formatMessage({
                        id: 'kidsboard.connect',
                        default: 'KidsBoardにつなぐ',
                        description: 'connect to KidsBoard'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'disconnect',
                    text: formatMessage({
                        id: 'kidsboard.disconnect',
                        default: 'KidsBoardから切断する',
                        description: 'disconnect from KidsBoard'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'isConnected',
                    text: formatMessage({
                        id: 'kidsboard.isConnected',
                        default: 'つながっている?',
                        description: 'is KidsBoard connected'
                    }),
                    blockType: BlockType.BOOLEAN
                },
                '---',
                {
                    opcode: 'setPinMode',
                    text: formatMessage({
                        id: 'kidsboard.setPinMode',
                        default: 'ピン[PIN]を[MODE]にする',
                        description: 'set pin mode'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '7'
                        },
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'pinModes',
                            defaultValue: 'OUTPUT'
                        }
                    }
                },
                {
                    opcode: 'digitalWrite',
                    text: formatMessage({
                        id: 'kidsboard.digitalWrite',
                        default: 'ピン[PIN]を[STATE]にする',
                        description: 'digital write'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '7'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'onOff',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'analogWrite',
                    text: formatMessage({
                        id: 'kidsboard.analogWrite',
                        default: 'ピン[PIN]にアナログ値[VALUE]を出力する',
                        description: 'analog (PWM) write'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '7'
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                '---',
                {
                    opcode: 'digitalRead',
                    text: formatMessage({
                        id: 'kidsboard.digitalRead',
                        default: 'ピン[PIN]がオン',
                        description: 'digital read'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '6'
                        }
                    }
                },
                {
                    opcode: 'analogRead',
                    text: formatMessage({
                        id: 'kidsboard.analogRead',
                        default: 'ピン[PIN]のアナログ値',
                        description: 'analog read (0-1023)'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'whenDigitalState',
                    text: formatMessage({
                        id: 'kidsboard.whenDigitalState',
                        default: 'ピン[PIN]が[STATE]になったとき',
                        description: 'when digital pin state changed'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '6'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'onOff',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'whenAnalogValue',
                    text: formatMessage({
                        id: 'kidsboard.whenAnalogValue',
                        default: 'ピン[PIN]のアナログ値が[VALUE]より[COMP]なったとき',
                        description: 'when analog value crosses threshold'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '0'
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 512
                        },
                        COMP: {
                            type: ArgumentType.STRING,
                            menu: 'compare',
                            defaultValue: '>'
                        }
                    }
                },
                '---',
                {
                    opcode: 'playNoteFor',
                    text: formatMessage({
                        id: 'kidsboard.playNoteFor',
                        default: 'ピン[PIN]から[NOTE]の音を[SECS]秒鳴らす',
                        description: 'play note for seconds'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '10'
                        },
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: 60
                        },
                        SECS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5
                        }
                    }
                },
                {
                    opcode: 'playNote',
                    text: formatMessage({
                        id: 'kidsboard.playNote',
                        default: 'ピン[PIN]から[NOTE]の音を鳴らす',
                        description: 'play note'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '10'
                        },
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: 60
                        }
                    }
                },
                {
                    opcode: 'stopNote',
                    text: formatMessage({
                        id: 'kidsboard.stopNote',
                        default: 'ピン[PIN]の音を止める',
                        description: 'stop note'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '10'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setServoAngle',
                    text: formatMessage({
                        id: 'kidsboard.setServoAngle',
                        default: 'サーボ(ピン[PIN])を[ANGLE]度にする',
                        description: 'set servo angle (SG-90)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '0'
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'getDistance',
                    text: formatMessage({
                        id: 'kidsboard.getDistance',
                        default: '超音波センサー(トリガー[TRIG] エコー[ECHO])の距離(cm)',
                        description: 'ultrasonic sensor distance in cm'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TRIG: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '0'
                        },
                        ECHO: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '1'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setMotor',
                    text: formatMessage({
                        id: 'kidsboard.setMotor',
                        default: 'モーター(ポート[PORT])を速さ[SPEED]で[DIR]',
                        description: 'run H-bridge motor driver'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'modulePorts',
                            defaultValue: '0'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'motorDirs',
                            defaultValue: 'forward'
                        }
                    }
                },
                {
                    opcode: 'stopMotor',
                    text: formatMessage({
                        id: 'kidsboard.stopMotor',
                        default: 'モーター(ポート[PORT])を止める',
                        description: 'stop H-bridge motor driver'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'modulePorts',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'setSignal',
                    text: formatMessage({
                        id: 'kidsboard.setSignal',
                        default: '信号機(ポート[PORT])を[COLOR]にする',
                        description: 'set traffic light module color'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'modulePorts',
                            defaultValue: '0'
                        },
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'signalColors',
                            defaultValue: 'red'
                        }
                    }
                },
                '---',
                {
                    opcode: 'neoSetup',
                    text: formatMessage({
                        id: 'kidsboard.neoSetup',
                        default: 'カラーLED(ピン[PIN])を[NUM]個つなぐ',
                        description: 'setup NeoPixel strip'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'pins',
                            defaultValue: '0'
                        },
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 16
                        }
                    }
                },
                {
                    opcode: 'neoSetPixelColor',
                    text: formatMessage({
                        id: 'kidsboard.neoSetPixelColor',
                        default: 'カラーLEDの[INDEX]番目を[COLOR]にする',
                        description: 'set NeoPixel color with color picker'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        COLOR: {
                            type: ArgumentType.COLOR
                        }
                    }
                },
                {
                    opcode: 'neoFillColor',
                    text: formatMessage({
                        id: 'kidsboard.neoFillColor',
                        default: 'カラーLEDの全部を[COLOR]にする',
                        description: 'fill all NeoPixels with color picker'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR
                        }
                    }
                },
                {
                    opcode: 'neoSetPixelRGB',
                    text: formatMessage({
                        id: 'kidsboard.neoSetPixelRGB',
                        default: 'カラーLEDの[INDEX]番目を赤[R]緑[G]青[B]にする',
                        description: 'set NeoPixel color with RGB (0-255)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        G: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'neoSetPixelHSL',
                    text: formatMessage({
                        id: 'kidsboard.neoSetPixelHSL',
                        default: 'カラーLEDの[INDEX]番目を色相[H]彩度[S]明るさ[L]にする',
                        description: 'set NeoPixel color with HSL (H:0-360, S/L:0-100)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        H: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        S: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        L: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'neoSetBrightness',
                    text: formatMessage({
                        id: 'kidsboard.neoSetBrightness',
                        default: 'カラーLEDの明るさを[BRIGHTNESS]%にする',
                        description: 'set NeoPixel brightness (0-100%)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BRIGHTNESS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 25
                        }
                    }
                },
                {
                    opcode: 'neoClear',
                    text: formatMessage({
                        id: 'kidsboard.neoClear',
                        default: 'カラーLEDを全部消す',
                        description: 'clear all NeoPixels'
                    }),
                    blockType: BlockType.COMMAND
                }
            ],
            menus: {
                pins: {
                    acceptReporters: true,
                    items: [
                        {text: '0', value: '0'},
                        {text: '1', value: '1'},
                        {text: '3', value: '3'},
                        {text: '4', value: '4'},
                        {text: '5', value: '5'},
                        {text: '6 (ボタン)', value: '6'},
                        {text: '7 (LED)', value: '7'},
                        {text: '10 (スピーカー)', value: '10'}
                    ]
                },
                pinModes: {
                    acceptReporters: false,
                    items: [
                        {text: '出力', value: 'OUTPUT'},
                        {text: '入力', value: 'INPUT'},
                        {text: 'プルアップ入力', value: 'INPUT_PULLUP'},
                        {text: 'プルダウン入力', value: 'INPUT_PULLDOWN'},
                        {text: 'アナログ入力', value: 'ANALOG'},
                        {text: 'アナログ出力(PWM)', value: 'PWM'},
                        {text: '音出力', value: 'TONE'},
                        {text: 'サーボ出力', value: 'SERVO'}
                    ]
                },
                onOff: {
                    acceptReporters: true,
                    items: [
                        {text: 'オン', value: '1'},
                        {text: 'オフ', value: '0'}
                    ]
                },
                modulePorts: {
                    acceptReporters: true,
                    items: [
                        {text: '0', value: '0'},
                        {text: '1', value: '1'},
                        {text: '3', value: '3'},
                        {text: '4', value: '4'}
                    ]
                },
                motorDirs: {
                    acceptReporters: false,
                    items: [
                        {text: '正転', value: 'forward'},
                        {text: '逆転', value: 'reverse'},
                        {text: '停止', value: 'stop'}
                    ]
                },
                signalColors: {
                    acceptReporters: false,
                    items: [
                        {text: '赤', value: 'red'},
                        {text: '黄', value: 'yellow'},
                        {text: '緑', value: 'green'}
                    ]
                },
                compare: {
                    acceptReporters: false,
                    items: [
                        {text: '大きく', value: '>'},
                        {text: '小さく', value: '<'}
                    ]
                }
            }
        };
    }

    _pin (args) {
        const pin = Math.round(Cast.toNumber(args.PIN));
        if (pin < 0 || pin > 21) return null; // ESP32-C3の範囲外は無視
        return pin;
    }

    connect () {
        return this._peripheral.connect();
    }

    disconnect () {
        this._peripheral.disconnect();
    }

    isConnected () {
        return this._peripheral.isConnected();
    }

    setPinMode (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.setPinMode(pin, args.MODE);
    }

    digitalWrite (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.digitalWrite(pin, Cast.toNumber(args.STATE) > 0);
    }

    analogWrite (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.analogWrite(pin, Cast.toNumber(args.VALUE));
    }

    digitalRead (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return false;
        return this._peripheral.digitalRead(pin);
    }

    analogRead (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return 0;
        return this._peripheral.analogRead(pin);
    }

    whenDigitalState (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return false;
        const want = Cast.toNumber(args.STATE) > 0;
        return this._peripheral.digitalRead(pin) === want;
    }

    whenAnalogValue (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return false;
        const value = this._peripheral.analogRead(pin);
        const threshold = Cast.toNumber(args.VALUE);
        return (args.COMP === '<') ? (value < threshold) : (value > threshold);
    }

    playNoteFor (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        const secs = Math.max(0, Math.min(30, Cast.toNumber(args.SECS)));
        this._peripheral.playNote(pin, Cast.toNumber(args.NOTE));
        return new Promise(resolve => {
            setTimeout(() => {
                this._peripheral.stopNote(pin);
                resolve();
            }, secs * 1000);
        });
    }

    playNote (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.playNote(pin, Cast.toNumber(args.NOTE));
    }

    stopNote (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.stopNote(pin);
    }

    setServoAngle (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.servoWrite(pin, Cast.toNumber(args.ANGLE));
    }

    getDistance (args) {
        const trig = Math.round(Cast.toNumber(args.TRIG));
        const echo = Math.round(Cast.toNumber(args.ECHO));
        if (trig < 0 || trig > 21 || echo < 0 || echo > 21 || trig === echo) return 0;
        if (!this._peripheral.isConnected()) return 0;
        return this._peripheral.sonarDistanceCm(trig, echo);
    }

    // モジュール(モーター/信号機)を接続できるポートは 0/1/3/4 のみ
    _modulePort (args) {
        const pin = Math.round(Cast.toNumber(args.PORT));
        if (pin !== 0 && pin !== 1 && pin !== 3 && pin !== 4) return null;
        return pin;
    }

    setMotor (args) {
        const pin = this._modulePort(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.motorRun(pin, args.DIR, Cast.toNumber(args.SPEED));
    }

    stopMotor (args) {
        const pin = this._modulePort(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.motorRun(pin, 'stop', 0);
    }

    setSignal (args) {
        const pin = this._modulePort(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.signalSet(pin, args.COLOR);
    }

    neoSetup (args) {
        const pin = this._pin(args);
        if (pin === null || !this._peripheral.isConnected()) return;
        this._peripheral.neoConfig(pin, Cast.toNumber(args.NUM));
    }

    neoSetPixelColor (args) {
        if (!this._peripheral.isConnected()) return;
        const rgb = Cast.toRgbColorList(args.COLOR);
        this._peripheral.neoSetPixel(Cast.toNumber(args.INDEX) - 1, rgb[0], rgb[1], rgb[2]);
    }

    neoFillColor (args) {
        if (!this._peripheral.isConnected()) return;
        const rgb = Cast.toRgbColorList(args.COLOR);
        this._peripheral.neoFill(rgb[0], rgb[1], rgb[2]);
    }

    neoSetPixelRGB (args) {
        if (!this._peripheral.isConnected()) return;
        const clamp255 = v => Math.max(0, Math.min(255, Math.round(Cast.toNumber(v))));
        this._peripheral.neoSetPixel(
            Cast.toNumber(args.INDEX) - 1,
            clamp255(args.R), clamp255(args.G), clamp255(args.B));
    }

    neoSetPixelHSL (args) {
        if (!this._peripheral.isConnected()) return;
        const rgb = hslToRgb(
            Cast.toNumber(args.H),
            Cast.toNumber(args.S),
            Cast.toNumber(args.L));
        this._peripheral.neoSetPixel(Cast.toNumber(args.INDEX) - 1, rgb[0], rgb[1], rgb[2]);
    }

    neoSetBrightness (args) {
        if (!this._peripheral.isConnected()) return;
        const percent = Math.max(0, Math.min(100, Cast.toNumber(args.BRIGHTNESS)));
        this._peripheral.neoBrightness(percent * 255 / 100);
    }

    neoClear () {
        if (!this._peripheral.isConnected()) return;
        this._peripheral.neoClear();
    }
}

module.exports = Scratch3KidsBoardBlocks;
