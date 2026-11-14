const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const BLE = require("../../io/ble");
const Base64Util = require("../../util/base64-util");
const Cast = require("../../util/cast");
const color = require("../../util/color");
const RateLimiter = require("../../util/rateLimiter.js");
const BLEService = {
  DEVICE_SERVICE: "00001234-0000-1000-8000-00805f9b34fb",
  IO_SERVICE: "00005678-0000-1000-8000-00805f9b34fb",
};

const BLECharacteristic = {
  firmware: "00005678-0000-1000-8000-00805f9b34fb",
};

const BLESendInterval = 100;
const BLESendRateMax = 20;

class ESP32CAM {
  constructor(runtime, extensionId) {
    this._runtime = runtime;
    this._runtime.on("project_stop_all", this.stopAll.bind(this));
    this._extensionID = extensionId;

    this._ports = ["none", "none"];
    this.motors = [null, null];
    this._ble = null;
    this._runtime.registerPeripheralExtension(extensionId, this);
    this._rateLimitier = new RateLimiter(BLESendRateMax);
    // this._reset = this.reset.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._onMessage = this._onMessage.bind(this);
  }
  stopAll() {
    if (!this.isConnected()) return;
  }
  Scan() {
    if (this._ble) {
      this._ble.disconnect();
    }
    this._ble = new BLE(
      this._runtime,
      this._extensionID,
      {
        filters: [
          {
            services: [BLEService.DEVICE_SERVICE],
          },
        ],
        optionalServices: [BLEService.IO_SERVICE],
      },
      this._onConnect
      // this._reset
    );
  }

  connect(id) {
    if (this._ble) {
      this._ble.connectPeripheral(id);
    }
  }

  /**
   * Disconnects from the current BLE socket.
   */
  disconnect() {
    if (this._ble) {
      this._ble.disconnect();
    }

    this.reset();
  }

  isConnected() {
    let connected = false;
    if (this._ble) {
      connected = this._ble.isConnected();
    }
    return connected;
  }

  send(uuid, message, useLimiter = true) {
    if (!this.isConnected()) return Promise.resolve();

    if (useLimiter) {
      if (!this._rateLimiter.okayToSend()) return Promise.resolve();
    }

    return this._ble.write(
      BLEService.IO_SERVICE,
      uuid,
      Base64Util.uint8ArrayToBase64(message),
      "base64"
    );
  }

  generateOutputCommand(connectID, commandID, values = null) {
    let command = [connectID, commandID];
    if (values) {
      command = command.concat(values.length).concat(values);
    }
    return command;
  }

  generateInputCommand(
    connectID,
    type,
    mode,
    delta,
    units,
    enableNotifications
  ) {
    const command = [
      1, // Command ID = 1 = "Sensor Format"
      2, // Command Type = 2 = "Write"
      connectID,
      type,
      mode,
      delta,
      0, // Delta Interval Byte 2
      0, // Delta Interval Byte 3
      0, // Delta Interval Byte 4
      units,
      enableNotifications ? 1 : 0,
    ];

    return command;
  }

  _onConnect() {
    // this.setLEDMode();
    // this.setLED(0x0000ff);
    this._ble.startNotifications(
      BLEService.DEVICE_SERVICE,
      BLECharacteristic.firmware,
      this._onMessage
    );
  }

  _onMessage(base64) {
    const data = Base64Util.base64ToUint8Array(base64);
    // log.info(data);

    /**
     * If first byte of data is '1' or '2', then either clear the
     * sensor present in ports 1 or 2 or set their format.
     *
     * If first byte of data is anything else, read incoming sensor value.
     */
    switch (data[0]) {
      case 1:
      case 2: {
        const connectID = data[0];
        if (data[1] === 0) {
          // clear sensor or motor
          this._clearPort(connectID);
        } else {
          // register sensor or motor
          this._registerSensorOrMotor(connectID, data[3]);
        }
        break;
      }
      default: {
        // read incoming sensor value
        const connectID = data[1];
        const type = this._ports[connectID - 1];
        if (type === WeDo2Device.DISTANCE) {
          this._sensors.distance = data[2];
        }
        if (type === WeDo2Device.TILT) {
          this._sensors.tiltX = data[2];
          this._sensors.tiltY = data[3];
        }
        break;
      }
    }
  }
}

class Scratch3ESP32CAM {
  static get EXTENSION_ID() {
    return "hive";
  }
  constructor(runtime) {
    this.runtime = runtime;
    this._pheripheral = new ESP32CAM(
      this.runtime,
      Scratch3ESP32CAM.EXTENSION_ID
    );
  }

  getInfo() {
    return [
      {
        id: Scratch3ESP32CAM.EXTENSION_ID,
        name: "ESP32 CAM",
        blocks: [
          {
            opcode: "esp32send",
            text: "Send {COMMAND} to {PORT}",
            blockType: BlockType.COMMAND,
          },
          {
            opcode: "esp32scan",
            text: "get values from for ESP32 Cam devices",
            blockType: BlockType.COMMAND,
          },
        ],
      },
    ];
  }

  esp32send() {
    const send = [0x000000ff];
    const cmd = this.generateOutputCommand(send);
    this.send(BLECharacteristic.firmware, cmd);
  }
}
module.exports = Scratch3ESP32CAM;
