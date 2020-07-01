import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { Vlan } from "../../../core/interfaces/Vlan.interface";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-vlan",
    templateUrl: "./vlan.component.html",
    styleUrls: ["./vlan.component.css"],
})
export class VlanComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * Vlan data and Vlan data request
     */
    public vlan: Vlan;
    public vlanRequest: RequestState = "idle";

    /**
     * Array of Vlan attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the Vlan
     */
    public vlanId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and V-Lan id
            this.parentDeviceId = params.id;
            this.vlanId = params.vlan;

            // Get V-Lan data
            this.getVlan();
        });
    }

    /**
     * Get V-Lan data
     */
    public getVlan(): void {
        this.vlanRequest = "pending";
        this.api.getVlan(Number(this.parentDeviceId), Number(this.vlanId)).subscribe({
            next: (vlan) => {
                this.vlan = vlan;

                this.attributes = [];
                Object.keys(vlan).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: vlan[key],
                    });
                });

                this.vlanRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.vlanRequest = "error";
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
                objectType: "vlans",
                deviceId: Number(this.parentDeviceId),
                objectId: this.vlan.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh V-Lan data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getVlan();
        });
    }
}
