import { Component, OnInit, TemplateRef } from "@angular/core";
import { Device } from "../../../core/interfaces/device.interface";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Profile } from "../../../core/interfaces/profile.interface";
import { Subrack } from "../../../core/interfaces/subrack.interface";
import { Vlan } from "../../../core/interfaces/Vlan.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzMessageService } from "ng-zorro-antd/message";

import Achorn from "achorn";
import { SubrackCreateComponent } from "../../../core/components/subrack-create/subrack-create.component";
const achorn = new Achorn();

@Component({
    selector: "app-device",
    templateUrl: "./device.component.html",
    styleUrls: ["./device.component.css"],
})
export class DeviceComponent implements OnInit {
    /**
     * Device data and Device data request
     */
    public device: Device;
    public deviceId: number;
    public deviceRequest: RequestState = "idle";

    /**
     * Array of Device Profiles and Profiles data request
     */
    public profiles: Profile[];
    public profilesRequest: RequestState = "idle";

    /**
     * Array of Device Subracks and Subrack data request
     */
    public subracks: Subrack[];
    public subracksRequest: RequestState = "idle";

    /**
     * Array of Device V-Lans and V-Lan data request
     */
    public vlans: Vlan[];
    public vlansRequest: RequestState = "idle";

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private modal: NzModalService,
        private message: NzMessageService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store Device id
            this.deviceId = params.id;

            this.getDevice();
            this.getSubracks();
            this.getProfiles();
            this.getVlans();
        });
    }

    /**
     * Get Device data
     */
    public getDevice(): void {
        this.deviceRequest = "pending";
        this.api.getDevice(this.deviceId).subscribe({
            next: (device) => {
                this.device = device;
                this.deviceRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.deviceRequest = "error";
            },
        });
    }

    /**
     * Get Device Profiles
     */
    public getProfiles(): void {
        this.profilesRequest = "pending";
        this.api.getProfiles(this.deviceId).subscribe({
            next: (profiles) => {
                this.profiles = profiles;
                this.profilesRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.profilesRequest = "error";
            },
        });
    }

    /**
     * Get Device Subracks
     */
    public getSubracks(): void {
        this.subracksRequest = "pending";
        this.api.getSubracks(this.deviceId).subscribe({
            next: (subracks) => {
                this.subracks = subracks;
                this.subracksRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.subracksRequest = "error";
            },
        });
    }

    /**
     * Get Device V-Lans
     */
    public getVlans(): void {
        this.vlansRequest = "pending";
        this.api.getVlans(this.deviceId).subscribe({
            next: (vlans) => {
                this.vlans = vlans;
                this.vlansRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.vlansRequest = "error";
            },
        });
    }

    /**
     * Opens a Modal showing the SSH Connection details
     * @param sshModalContent TemplateRef of the Modal contents
     */
    public openSshModal(sshModalContent: TemplateRef<any>): void {
        this.modal.create({
            nzTitle: "Connect via SSH",
            nzContent: sshModalContent,
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });
    }

    /**
     * Opens a MOdal showing the Device login Credentials
     * @param credentialsModalContent TemplateRef of the Modal contents
     */
    public openCredentialsModal(credentialsModalContent: TemplateRef<any>): void {
        this.modal.create({
            nzTitle: "Device Credentials",
            nzContent: credentialsModalContent,
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });
    }

    /**
     * Opens a Modal confirming that the Device will be cloned
     */
    public cloneDevice(): void {
        const message = this.message.loading("Cloning Device...").messageId;
        this.api.cloneDevice(this.device.id).subscribe({
            next: () => {
                this.message.remove(message);
                this.message.success("Device cloned!");

                // Refresh Device list
                this.api.getDevices().subscribe({
                    error: () => {
                        throw new Error("An Error occurred trying to request Devices");
                    },
                });
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.message.remove(message);
                this.message.error("Error cloning Device");
            },
        });
    }

    /**
     * Opens a Modal confirming that the Device will be delete
     */
    public deleteDevice(): void {
        this.modal.confirm({
            nzTitle: "Are you sure?",
            nzContent: "The Device and all of its children will be deleted.",
            nzOkText: "Yes",
            nzOkType: "danger",
            nzOnOk: () => {
                const message = this.message.loading("Deleting Device...").messageId;
                this.api.deleteDevice(this.device.id).subscribe({
                    next: () => {
                        this.message.remove(message);
                        this.message.success("Device deleted!");

                        // Refresh Device list
                        this.api.getDevices().subscribe({
                            error: () => {
                                throw new Error("An Error occurred trying to request Devices");
                            },
                        });

                        // Navigate to Home Page
                        this.router.navigate(["/"]);
                    },
                    error: (error) => {
                        // @ts-ignore
                        achorn.error(error);
                        this.message.remove(message);
                        this.message.error("Error deleting Device");
                    },
                });
            },
            nzCancelText: "No",
            nzAutofocus: null,
        });
    }

    /**
     * Opens a modal where the user can create more Subracks
     */
    public openCreateSubracksModal() {
        const modal = this.modal.create({
            nzTitle: "Create Subracks",
            nzContent: SubrackCreateComponent,
            nzComponentParams: {
                deviceId: this.deviceId,
                deviceName: this.device.hostname,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Subrack data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getSubracks();
        });
    }
}
