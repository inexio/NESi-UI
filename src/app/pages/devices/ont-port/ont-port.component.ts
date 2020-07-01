import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";
import { NzModalService } from "ng-zorro-antd/modal";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-ont-port",
    templateUrl: "./ont-port.component.html",
    styleUrls: ["./ont-port.component.css"],
})
export class OntPortComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * ONT Port data and Ont Port data request
     */
    public ontPort: Port;
    public ontPortRequest: RequestState = "idle";

    /**
     * Array of ONT Port attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the ONT Port
     */
    public ontPortId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and ONT Port id
            this.parentDeviceId = params.id;
            this.ontPortId = params.ontPort;

            // Get ONT Port
            this.getOntPort();
        });
    }

    /**
     * Get ONT Port data
     */
    public getOntPort(): void {
        this.ontPortRequest = "pending";
        this.api.getOntPort(Number(this.parentDeviceId), Number(this.ontPortId)).subscribe({
            next: (ontPort) => {
                this.ontPort = ontPort;

                this.attributes = [];
                Object.keys(ontPort).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: ontPort[key],
                    });
                });

                this.ontPortRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.ontPortRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "ont", this.ontPort.ont_id]);
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
                objectType: "ont_ports",
                deviceId: Number(this.parentDeviceId),
                objectId: this.ontPort.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh ONT Port data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getOntPort();
        });
    }
}
