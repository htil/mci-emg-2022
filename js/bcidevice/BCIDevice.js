"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.BCIDevice = exports.ScalpElectrodes = exports.DeviceState = exports.DeviceType = void 0;
var muse_js_1 = require("muse-js");
var ganglion_ble_1 = require("ganglion-ble");
var GANGLION_SERVICE = 0xfe84;
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["NONE"] = 0] = "NONE";
    DeviceType[DeviceType["MUSE"] = 1] = "MUSE";
    DeviceType[DeviceType["GANGLION"] = 2] = "GANGLION";
})(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
;
var DeviceState;
(function (DeviceState) {
    DeviceState[DeviceState["CONNECTED"] = 0] = "CONNECTED";
    DeviceState[DeviceState["DISCONNECTED"] = 1] = "DISCONNECTED";
})(DeviceState = exports.DeviceState || (exports.DeviceState = {}));
var ScalpElectrodes;
(function (ScalpElectrodes) {
    ScalpElectrodes[ScalpElectrodes["FP1"] = 0] = "FP1";
    ScalpElectrodes[ScalpElectrodes["FP2"] = 1] = "FP2";
    ScalpElectrodes[ScalpElectrodes["AF7"] = 2] = "AF7";
    ScalpElectrodes[ScalpElectrodes["AF8"] = 3] = "AF8";
    ScalpElectrodes[ScalpElectrodes["F7"] = 4] = "F7";
    ScalpElectrodes[ScalpElectrodes["F3"] = 5] = "F3";
    ScalpElectrodes[ScalpElectrodes["FZ"] = 6] = "FZ";
    ScalpElectrodes[ScalpElectrodes["F4"] = 7] = "F4";
    ScalpElectrodes[ScalpElectrodes["F8"] = 8] = "F8";
    ScalpElectrodes[ScalpElectrodes["A1"] = 9] = "A1";
    ScalpElectrodes[ScalpElectrodes["T3"] = 10] = "T3";
    ScalpElectrodes[ScalpElectrodes["C3"] = 11] = "C3";
    ScalpElectrodes[ScalpElectrodes["CZ"] = 12] = "CZ";
    ScalpElectrodes[ScalpElectrodes["C4"] = 13] = "C4";
    ScalpElectrodes[ScalpElectrodes["T4"] = 14] = "T4";
    ScalpElectrodes[ScalpElectrodes["A2"] = 15] = "A2";
    ScalpElectrodes[ScalpElectrodes["TP9"] = 16] = "TP9";
    ScalpElectrodes[ScalpElectrodes["TP10"] = 17] = "TP10";
    ScalpElectrodes[ScalpElectrodes["T5"] = 18] = "T5";
    ScalpElectrodes[ScalpElectrodes["P3"] = 19] = "P3";
    ScalpElectrodes[ScalpElectrodes["PZ"] = 20] = "PZ";
    ScalpElectrodes[ScalpElectrodes["P4"] = 21] = "P4";
    ScalpElectrodes[ScalpElectrodes["T6"] = 22] = "T6";
    ScalpElectrodes[ScalpElectrodes["O1"] = 23] = "O1";
    ScalpElectrodes[ScalpElectrodes["O2"] = 24] = "O2";
})(ScalpElectrodes = exports.ScalpElectrodes || (exports.ScalpElectrodes = {}));
;
var BCIDevice = (function () {
    function BCIDevice(callbacks) {
        this.device = null;
        this.type = DeviceType.NONE;
        this.state = DeviceState.DISCONNECTED;
        this.callbacks = callbacks;
    }
    BCIDevice.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dev, gatt, getType, sensors, self;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.device !== null && this.state === DeviceState.CONNECTED)
                            this.disconnect();
                        return [4, navigator.bluetooth.requestDevice({
                                filters: [
                                    {
                                        namePrefix: "Ganglion-"
                                    },
                                    {
                                        namePrefix: "Muse-"
                                    }
                                ],
                                optionalServices: [muse_js_1.MUSE_SERVICE, GANGLION_SERVICE]
                            })];
                    case 1:
                        dev = _a.sent();
                        if (!dev || !dev.gatt || !dev.name)
                            throw new Error("Required fields are empty!");
                        return [4, dev.gatt.connect()];
                    case 2:
                        gatt = _a.sent();
                        this.state = DeviceState.CONNECTED;
                        getType = function (x) {
                            if (x.name.match(/^Muse-/))
                                return DeviceType.MUSE;
                            if (x.name.match(/^Ganglion-/))
                                return DeviceType.GANGLION;
                            throw new Error("Unknown device type with name: " + x.name);
                        };
                        sensors = [];
                        self = this;
                        switch (getType(dev)) {
                            case DeviceType.MUSE:
                                this.type = DeviceType.MUSE;
                                this.device = new muse_js_1.MuseClient();
                                sensors[muse_js_1.channelNames.indexOf("TP9")] = ScalpElectrodes.TP9;
                                sensors[muse_js_1.channelNames.indexOf("TP10")] = ScalpElectrodes.TP10;
                                sensors[muse_js_1.channelNames.indexOf("AF7")] = ScalpElectrodes.AF7;
                                sensors[muse_js_1.channelNames.indexOf("AF8")] = ScalpElectrodes.AF8;
                                this.sync = new Array(4).fill(0);
                                this.subscription = function () {
                                    var d = self.device;
                                    d.eegReadings.subscribe(function (sample) {
                                        var electrode = sensors[sample.electrode];
                                        var delta = sample.timestamp - self.sync[electrode];
                                        if (self.callbacks.dataHandler) {
                                            self.callbacks.dataHandler({
                                                data: sample.samples,
                                                electrode: electrode,
                                                sampleRate: 1000 / delta * sample.samples.length
                                            });
                                        }
                                        self.sync[electrode] = sample.timestamp;
                                    });
                                    d.telemetryData.subscribe(function (status) {
                                        if (self.callbacks.statusHandler)
                                            self.callbacks.statusHandler(status);
                                    });
                                    d.connectionStatus.subscribe(function (status) {
                                        if (self.callbacks.connectionHandler)
                                            self.callbacks.connectionHandler(status);
                                    });
                                };
                                break;
                            case DeviceType.GANGLION:
                                this.type = DeviceType.GANGLION;
                                this.device = new ganglion_ble_1.Ganglion();
                                sensors[0] = ScalpElectrodes.FP1;
                                sensors[1] = ScalpElectrodes.FP2;
                                sensors[2] = ScalpElectrodes.O1;
                                this.sync = new Array(4).fill(0);
                                this.subscription = function () {
                                    var d = self.device;
                                    d.stream.subscribe(function (sample) {
                                        console.log("Sample ", sample);
                                        sample.data.forEach(function (val, ind) {
                                            console.log("VAL ", val);
                                            var electrode = sensors[ind];
                                            var delta = sample.timestamp.getUTCMilliseconds() - self.sync[electrode];
                                            if (self.callbacks.dataHandler) {
                                                self.callbacks.dataHandler({
                                                    data: [val],
                                                    electrode: electrode,
                                                    sampleRate: 1000 / delta
                                                });
                                            }
                                            self.sync[electrode] = sample.timestamp.getUTCMilliseconds();
                                        });
                                    });
                                    console.warn("BCIDevice: Ganglion does not offer status information.");
                                    console.warn("BCIDevice: Ganglion does not offer connection information.");
                                    if (self.callbacks.connectionHandler)
                                        self.callbacks.connectionHandler(true);
                                };
                                break;
                        }
                        return [4, this.device.connect(gatt)];
                    case 3:
                        _a.sent();
                        return [4, this.device.start()];
                    case 4:
                        _a.sent();
                        this.subscription();
                        return [2];
                }
            });
        });
    };
    BCIDevice.prototype.disconnect = function () {
        if (this.state === DeviceState.DISCONNECTED)
            return;
        this.device.disconnect();
        this.state = DeviceState.DISCONNECTED;
    };
    BCIDevice.prototype.subscribe = function (callback) {
        this.callbacks.dataHandler = callback;
    };
    BCIDevice.electrodeIndex = function (electrode) {
        return ScalpElectrodes[electrode];
    };
    return BCIDevice;
}());
exports.BCIDevice = BCIDevice;
//# sourceMappingURL=BCIDevice.js.map