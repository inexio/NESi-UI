import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Vlan } from "../../../core/interfaces/Vlan.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { Profile } from "../../../core/interfaces/profile.interface";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-port-profile",
    templateUrl: "./port-profile.component.html",
    styleUrls: ["./port-profile.component.css"],
})
export class PortProfileComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * Port Profile data and Port Profile data request
     */
    public profile: { [key: string]: any };
    public profileRequest: RequestState = "idle";

    /**
     * Array of Port Profiles attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the Port Profile
     */
    public portProfileId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and Port Profile id
            this.parentDeviceId = params.id;
            this.portProfileId = params.portProfile;

            // Get Port Profile data
            this.getPortProfile();
        });
    }

    /**
     * Get Port Profile data
     */
    public getPortProfile(): void {
        /**
         * Get Port Profile data
         */
        this.profileRequest = "pending";
        this.api.getPortProfile(Number(this.parentDeviceId), Number(this.portProfileId)).subscribe({
            next: (profile) => {
                this.profile = profile;

                this.attributes = [];
                Object.keys(profile).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: profile[key],
                    });
                });

                this.profileRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.profileRequest = "error";
            },
        });
    }

    /**
     * Event handler called when affix state changes
     * @param value Boolean if affix is affixed
     */
    public affixEvent(value: boolean) {
        this.isAffixed = value;
        this.zone.run(() => {});
    }

    /**
     * Method used to navigate one layer up
     */
    public navigateUp(): void {
        this.router.navigate(["/devices", this.parentDeviceId]);
    }

    /**
     * Open a modal where a specific property can be edited
     * @param key Key of the property to edit
     * @param initialValue Current value of the property to edit
     */
    public editProperty(key: string, initialValue: any) {
        const modal = this.modal.create({
            nzTitle: "Edit Property",
            nzContent: EditPropertyComponent,
            nzComponentParams: {
                key,
                initialValue,
                objectType: "port_profiles",
                deviceId: Number(this.parentDeviceId),
                objectId: this.profile.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Port Profile data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getPortProfile();
        });
    }
}
