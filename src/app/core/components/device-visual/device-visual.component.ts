import { Component, OnInit, Input } from "@angular/core";
import { Device } from "../../interfaces/device.interface";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";

@Component({
    selector: "app-device-visual",
    templateUrl: "./device-visual.component.html",
    styleUrls: ["./device-visual.component.css"],
})
export class DeviceVisualComponent implements OnInit {
    /**
     * Device object, either given as input or retrieved through the API
     */
    @Input("device") public device?: Device;
    @Input("deviceId") public deviceId?: number | string;

    public deviceRequest: RequestState = "idle";

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit(): void {
        if (!this.device) {
            // Throw error if either parentDeviceId or subrackId are missing
            if (!this.deviceId) {
                throw new Error("Missing `deviceId` which is needed to request Device data");
            }

            // Get Device data
            this.deviceRequest = "pending";
            this.api.getDevice(this.deviceId).subscribe({
                next: (subrack) => {
                    this.device = subrack;
                    this.deviceRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.deviceRequest = "error";
                },
            });
        }
    }
}
