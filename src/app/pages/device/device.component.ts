import { Component, OnInit } from "@angular/core";
import { Device } from "../../core/interfaces/device.interface";
import { ApiService } from "../../core/services/api/api.service";
import { ActivatedRoute } from "@angular/router";
import { Profile } from "../../core/interfaces/profile.interface";
import { Subrack } from "../../core/interfaces/subrack.interface";
import { RequestState } from "../../core/interfaces/request-state.type";

@Component({
    selector: "app-device",
    templateUrl: "./device.component.html",
    styleUrls: ["./device.component.css"],
})
export class DeviceComponent implements OnInit {
    public device: Device;
    public deviceRequest: RequestState = "idle";

    public profiles: Profile[];
    public profilesRequest: RequestState = "idle";

    public subracks: Subrack[];
    public subracksRequest: RequestState = "idle";

    constructor(private api: ApiService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Get Device
            this.deviceRequest = "pending";
            this.api.getDevice(params.id).subscribe({
                next: (device) => {
                    this.device = device;
                    this.deviceRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.deviceRequest = "error";
                },
            });

            // Get Profiles
            this.profilesRequest = "pending";
            this.api.getProfiles(params.id).subscribe({
                next: (profiles) => {
                    this.profiles = profiles;
                    this.profilesRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.profilesRequest = "error";
                },
            });

            // Get Subracks
            this.subracksRequest = "pending";
            this.api.getSubracks(params.id).subscribe({
                next: (subracks) => {
                    this.subracks = subracks;
                    this.subracksRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.subracksRequest = "error";
                },
            });
        });
    }
}
