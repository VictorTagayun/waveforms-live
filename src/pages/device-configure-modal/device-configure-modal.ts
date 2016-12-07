import { NavParams, ViewController, Platform } from 'ionic-angular';
import { Component } from '@angular/core';

//Components
import { Tab1 } from '../device-manager-page/device-manager-tabs/device-manager-tab1/device-manager-tab1';

//Interfaces
import { DeviceCardInfo } from '../device-manager-page/device-manager-tabs/device-manager-tab1/device-manager-tab1.interface';

//Services
import { DeviceManagerService } from '../../services/device/device-manager.service';

@Component({
    templateUrl: "device-configure-modal.html"
})

export class DeviceConfigureModal {
    public platform: Platform;
    public deviceManagerService: DeviceManagerService;
    public viewCtrl: ViewController;
    public params: NavParams;

    public potentialDevices: string[];
    public deviceBridgeAddress: string;
    public tab1Ref: Tab1;
    public deviceObject: DeviceCardInfo;

    //Content controllers
    public bridgeConfigure: boolean = false;
    public deviceConfigure: boolean = false;
    public devicesEnumeration: boolean = false;

    //Leftovers from transfer. TODO wade through this
    public hostname: string = 'test';

    constructor(
        _platform: Platform,
        _viewCtrl: ViewController,
        _params: NavParams,
        _deviceManagerService: DeviceManagerService
    ) {
        this.platform = _platform;
        this.viewCtrl = _viewCtrl;
        this.params = _params;
        this.deviceManagerService = _deviceManagerService;
        this.potentialDevices = this.params.get('potentialDevices');
        this.deviceBridgeAddress = this.params.get('deviceBridgeAddress');
        this.tab1Ref = this.params.get('tab1Ref');
        this.deviceObject = this.params.get('deviceObject');
        if (this.params.get('bridge')) {
            this.bridgeConfigure = true;
        }
        if (this.potentialDevices == null || this.potentialDevices.length < 1) {
            this.devicesEnumeration = false;
        }
        else {
            this.devicesEnumeration = true;
            this.deviceConfigure = false;
        }
        if (this.deviceObject != null) {
            this.deviceConfigure = true;
            this.bridgeConfigure = this.deviceObject.bridge;
            this.deviceBridgeAddress = this.bridgeConfigure === true ? this.deviceObject.deviceBridgeAddress : this.deviceBridgeAddress;
        }
    }

    reEnumerateAgent() {
        this.deviceManagerService.connectBridge(this.deviceBridgeAddress).subscribe(
            (success) => {
                console.log(success);
                if (success.agent == undefined || success.agent[0].statusCode > 0) {
                    let message = 'Error Parsing Agent Response To Devices Enumeration';
                    console.log(message);
                    this.tab1Ref.createToast(message, true);
                    return;
                }
                if (success.agent[0].devices.length === 0) {
                    this.tab1Ref.createToast('No UART Devices Found', true);
                    return;
                }
                this.potentialDevices = success.agent[0].devices;
                this.devicesEnumeration = true;
            },
            (err) => {
                console.log(err);
                this.tab1Ref.createToast('Error: Invalid Response From Bridge', true);
            },
            () => {

            }
        );
    }

    selectDevice(selectedIndex: number) {
        let command = {
            "agent": [
                {
                    "command": "setActiveDevice",
                    "device": this.potentialDevices[selectedIndex]
                }
            ]
        };
        if (this.deviceObject != null && this.potentialDevices[selectedIndex] === this.deviceObject.connectedDeviceAddress) {
            this.tab1Ref.createToast('Device Added Already');
            return;
        }
        this.deviceManagerService.transport.writeRead('/config', JSON.stringify(command), 'json').subscribe(
            (arrayBuffer) => {
                console.log('response to set active device');
                console.log(this.deviceBridgeAddress);
                let data;
                try {
                    let duhString = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(0)));
                    console.log(duhString);
                    data = JSON.parse(duhString);
                }
                catch (e) {
                    console.log('Error Parsing Set Active Device Response');
                    console.log(e);
                }
                console.log(data);

                this.deviceManagerService.connect(this.deviceBridgeAddress).subscribe(
                    (data) => {
                        console.log('enumeration response');
                        console.log(data);
                        if (data.device[0].statusCode == undefined || data.device[0].statusCode > 0) {
                            this.tab1Ref.createToast('Error: Invalid Device Enumeration', true);
                            return;
                        }

                        if (this.deviceObject != undefined) {
                            console.log
                            this.deviceObject.connectedDeviceAddress = this.potentialDevices[selectedIndex];
                            this.deviceObject.ipAddress = this.deviceObject.deviceBridgeAddress + ' - ' + this.deviceObject.connectedDeviceAddress;
                            this.tab1Ref.storage.saveData('savedDevices', JSON.stringify(this.tab1Ref.devices));
                            this.devicesEnumeration = false;
                            this.deviceConfigure = true;
                            return;
                        }

                        let validDevice = this.tab1Ref.bridgeDeviceSelect({
                            selectedDevice: this.potentialDevices[selectedIndex],
                            deviceEnum: data
                        }, this.deviceBridgeAddress);
                        if (validDevice) {
                            this.devicesEnumeration = false;
                            this.deviceConfigure = true;
                            this.deviceObject = this.tab1Ref.devices[0];
                            this.deviceObject.connectedDeviceAddress = this.potentialDevices[selectedIndex]
                        }
                    },
                    (err) => {
                        console.log(err);
                        this.tab1Ref.createToast('No Response From Agent', true);
                    },
                    () => { }
                );
            },
            (err) => {
                console.log(err);
            },
            () => {
                console.log('complete');
            }
        );
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

}