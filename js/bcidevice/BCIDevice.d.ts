import { MuseClient } from 'muse-js';
import { Ganglion } from "ganglion-ble";
export declare enum DeviceType {
    NONE = 0,
    MUSE = 1,
    GANGLION = 2
}
export declare enum DeviceState {
    CONNECTED = 0,
    DISCONNECTED = 1
}
export declare enum ScalpElectrodes {
    FP1 = 0,
    FP2 = 1,
    AF7 = 2,
    AF8 = 3,
    F7 = 4,
    F3 = 5,
    FZ = 6,
    F4 = 7,
    F8 = 8,
    A1 = 9,
    T3 = 10,
    C3 = 11,
    CZ = 12,
    C4 = 13,
    T4 = 14,
    A2 = 15,
    TP9 = 16,
    TP10 = 17,
    T5 = 18,
    P3 = 19,
    PZ = 20,
    P4 = 21,
    T6 = 22,
    O1 = 23,
    O2 = 24
}
export interface BCIDeviceSample {
    data: number[];
    electrode: number;
    sampleRate: number;
}
export interface BCIDeviceStatus {
}
export interface BCIDeviceCalbacks {
    dataHandler?: (sample: BCIDeviceSample) => void;
    statusHandler?: (status: BCIDeviceStatus) => void;
    connectionHandler?: (connected: boolean) => void;
}
export declare class BCIDevice {
    device: MuseClient | Ganglion;
    type: DeviceType;
    state: DeviceState;
    subscription: () => void;
    callbacks: BCIDeviceCalbacks;
    sync: number[];
    constructor(callbacks: BCIDeviceCalbacks);
    connect(): Promise<void>;
    disconnect(): void;
    subscribe(callback: (sample: BCIDeviceSample) => void): void;
    static electrodeIndex(electrode: number): string;
}
