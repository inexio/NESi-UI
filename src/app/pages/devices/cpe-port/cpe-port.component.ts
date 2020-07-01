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
    selector: "app-cpe-port",
    templateUrl: "./cpe-port.component.html",
    styleUrls: ["./cpe-port.component.css"],
})
export class CpePortComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * CPE Port data and CPE Port data request
     */
    public cpePort: Port;
    public cpePortRequest: RequestState = "idle";

    /**
     * Array of ONT Port attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * CPE Port Id
     */
    public cpePortId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and CPE Port id
            this.parentDeviceId = params.id;
            this.cpePortId = params.cpePort;

            // Get CPE Port Data
            this.getCpePort();
        });
    }

    /**
     * Get CPE Port data
     */
    public getCpePort(): void {
        this.cpePortRequest = "pending";
        this.api.getCpePort(Number(this.parentDeviceId), Number(this.cpePortId)).subscribe({
            next: (cpePort) => {
                this.cpePort = cpePort;

                this.attributes = [];
                Object.keys(cpePort).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: cpePort[key],
                    });
                });

                this.cpePortRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.cpePortRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "cpe", this.cpePort.cpe_id]);
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
                objectType: "cpe_ports",
                deviceId: Number(this.parentDeviceId),
                objectId: this.cpePort.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh CPE Port data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getCpePort();
        });
    }
}
