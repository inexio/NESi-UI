import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: "app-port",
    templateUrl: "./port.component.html",
    styleUrls: ["./port.component.css"],
})
export class PortComponent implements OnInit {
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
    public parentDeviceId: string;

    /**
     * Id of the Port
     */
    public portId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    /**
     * Admin and Operating state switch value bindings
     */
    public admState: boolean;
    public oprState: boolean;

    /**
     * Admin and Operating state switch request states
     */
    public admRequest: RequestState = "idle";
    public oprRequest: RequestState = "idle";

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
        this.api.getPort(this.parentDeviceId, this.portId).subscribe({
            next: (port) => {
                this.port = port;

                // Update switch values
                this.oprState = port.opr_state === "up";
                this.admState = port.adm_state === "up";

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
                console.error(error);
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
        this.router.navigate(["/devices", this.parentDeviceId, "card", this.port.card_id]);
    }

    /**
     * Toggle Admin state of Port
     */
    public toggleAdmState(): void {
        this.admRequest = "pending";
        this.api
            .updateObjectProperty(Number(this.parentDeviceId), "ports", this.port.id, {
                adm_state: this.admState ? "up" : "down",
            })
            .subscribe({
                next: () => {
                    this.admRequest = "success";
                    this.getPort();
                },
                error: () => {
                    this.admRequest = "error";
                },
            });
    }

    /**
     * Toggle Operating state of Port
     */
    public toggleOprState(): void {
        this.oprRequest = "pending";
        this.api
            .updateObjectProperty(Number(this.parentDeviceId), "ports", this.port.id, {
                opr_state: this.oprState ? "up" : "down",
            })
            .subscribe({
                next: () => {
                    this.oprRequest = "success";
                    this.getPort();
                },
                error: () => {
                    this.oprRequest = "error";
                },
            });
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
