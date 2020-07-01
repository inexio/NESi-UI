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
    selector: "app-cpe",
    templateUrl: "./cpe.component.html",
    styleUrls: ["./cpe.component.css"],
})
export class CpeComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * CPE data and CPE data Request status
     */
    public cpe: Port;
    public cpeRequest: RequestState = "idle";

    /**
     * Array of CPE attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the CPE
     */
    public cpeId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device Id
            this.parentDeviceId = params.id;
            this.cpeId = params.cpe;

            // Get CPE data
            this.getCpe();
        });
    }

    /**
     * Get CPE data
     */
    public getCpe(): void {
        this.cpeRequest = "pending";
        this.api.getCpe(Number(this.parentDeviceId), Number(this.cpeId)).subscribe({
            next: (cpe) => {
                this.cpe = cpe;

                this.attributes = [];
                Object.keys(cpe).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: cpe[key],
                    });
                });

                this.cpeRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.cpeRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "ont-port", this.cpe.ont_port_id]);
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
                objectType: "cpes",
                deviceId: Number(this.parentDeviceId),
                objectId: this.cpe.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh CPE data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getCpe();
        });
    }
}
