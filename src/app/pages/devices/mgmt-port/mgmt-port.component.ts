import { Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";
import { OntCreateComponent } from "../../../core/components/ont-create/ont-create.component";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { ApiService } from "../../../core/services/api/api.service";
import { CoreService } from "../../../core/services/core/core.service";

@Component({
    selector: "app-mgmt-port",
    templateUrl: "./mgmt-port.component.html",
    styleUrls: ["./mgmt-port.component.css"],
})
export class MgmtPortComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private zone: NgZone,
        private router: Router,
        public core: CoreService,
        private modal: NzModalService,
    ) {}

    /**
     * Port data and Port data request
     */
    public port: Port;
    public portRequest: RequestState = "idle";

    /**
     * Array of Port attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: number;

    /**
     * Id of the Port
     */
    public portId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store Id of parent device and Port
            this.parentDeviceId = params.id;
            this.portId = params.port;

            // Get Port data
            this.getPort();
        });
    }

    /**
     * Get Port data from API
     */
    public getPort(): void {
        this.portRequest = "pending";
        this.api.getManagementPort(this.parentDeviceId, this.portId).subscribe({
            next: (port) => {
                this.port = port;

                this.attributes = [];
                Object.keys(port).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: port[key],
                    });
                });

                this.portRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.portRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "mgmt-card", this.port.mgmt_card_id]);
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
                objectType: "ports",
                deviceId: Number(this.parentDeviceId),
                objectId: this.port.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Port data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getPort();
        });
    }
}
