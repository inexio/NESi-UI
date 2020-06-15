import { Component, OnInit, TemplateRef } from "@angular/core";
import { Device } from "../../../core/interfaces/device.interface";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute } from "@angular/router";
import { Profile } from "../../../core/interfaces/profile.interface";
import { Subrack } from "../../../core/interfaces/subrack.interface";
import { Vlan } from "../../../core/interfaces/Vlan.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { NzModalService } from "ng-zorro-antd/modal";

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

    public vlans: Vlan[];
    public vlansRequest: RequestState = "idle";

    constructor(private api: ApiService, private route: ActivatedRoute, private modal: NzModalService) {}

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

            // Get Vlans
            this.vlansRequest = "pending";
            this.api.getVlans(params.id).subscribe({
                next: (vlans) => {
                    this.vlans = vlans;
                    this.vlansRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.vlansRequest = "error";
                },
            });
        });
    }

    public openSshModal(sshModalContent: TemplateRef<any>): void {
        this.modal.create({
            nzTitle: "Connect via SSH",
            nzContent: sshModalContent,
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });
    }

    public openCredentialsModal(credentialsModalContent: TemplateRef<any>): void {
        this.modal.create({
            nzTitle: "Device Credentials",
            nzContent: credentialsModalContent,
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });
    }
}
