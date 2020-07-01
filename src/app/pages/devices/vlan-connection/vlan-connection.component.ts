import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-vlan-connection",
    templateUrl: "./vlan-connection.component.html",
    styleUrls: ["./vlan-connection.component.css"],
})
export class VlanConnectionComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * Vlan Connection data and request
     */
    public vlanConnection: Port;
    public vlanConnectionRequest: RequestState = "idle";

    /**
     * Array of Vlan Connection attributes
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the V-Lan Connection
     */
    public vlanConnectionId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and V-Lan Connection id
            this.parentDeviceId = params.id;
            this.vlanConnectionId = params.vlanConnection;

            // Get V-Lan Connection data
            this.getVlanConnection();
        });
    }

    /**
     * Get V-Lan Connection data
     */
    public getVlanConnection(): void {
        this.vlanConnectionRequest = "pending";
        this.api.getVlanConnection(Number(this.parentDeviceId), Number(this.vlanConnectionId)).subscribe({
            next: (vlanConnection) => {
                this.vlanConnection = vlanConnection;

                this.attributes = [];
                Object.keys(vlanConnection).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: vlanConnection[key],
                    });
                });

                this.vlanConnectionRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.vlanConnectionRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "vlan", this.vlanConnection.vlan_id]);
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
                objectType: "vlan_connections",
                deviceId: Number(this.parentDeviceId),
                objectId: this.vlanConnection.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh V-Lan Connection data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getVlanConnection();
        });
    }
}
