import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../core/services/api/api.service";
import { RequestState } from "../../core/interfaces/request-state.type";
import { Device } from "../../core/interfaces/device.interface";

@Component({
    selector: "app-devices",
    templateUrl: "./devices.component.html",
    styleUrls: ["./devices.component.css"],
})
export class DevicesComponent implements OnInit {
    constructor(private api: ApiService) {
        console.log(this);
    }

    public devices: Device[] = [];
    public vendorNames: string[] = [];
    public vendors: { [key: string]: { devices: Device[] } } = {};

    public devicesRequest: RequestState = "idle";

    ngOnInit(): void {
        this.devicesRequest = "pending";
        this.api.getDevices().subscribe({
            next: (devices) => {
                this.devices = devices;
                devices.map((device) => {
                    if (!this.vendorNames.includes(device.vendor)) {
                        this.vendorNames.push(device.vendor);
                        this.vendors[device.vendor] = { devices: [] };
                        this.vendors[device.vendor].devices = [device];
                    } else {
                        this.vendors[device.vendor].devices.push(device);
                    }
                });
                this.devicesRequest = "success";
            },
            error: (error) => {
                console.error(error);
                this.devicesRequest = "error";
            },
        });
    }
}
