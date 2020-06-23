import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";

@Component({
    selector: "app-ont",
    templateUrl: "./ont.component.html",
    styleUrls: ["./ont.component.css"],
})
export class OntComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * ONT data and Port data request
     */
    public ont: Port;
    public ontRequest: RequestState = "idle";

    /**
     * Array of ONT attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the ONT
     */
    public ontId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and ONT id
            this.parentDeviceId = params.id;
            this.ontId = params.ont;

            // Get ONT data
            this.getOnt();
        });
    }

    /**
     * Get ONT data
     */
    public getOnt(): void {
        this.ontRequest = "pending";
        this.api.getOnt(Number(this.parentDeviceId), Number(this.ontId)).subscribe({
            next: (ont) => {
                this.ont = ont;

                this.attributes = [];
                Object.keys(ont).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: ont[key],
                    });
                });

                this.ontRequest = "success";
            },
            error: (error) => {
                console.error(error);
                this.ontRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "port", this.ont.port_id]);
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
                objectType: "onts",
                deviceId: Number(this.parentDeviceId),
                objectId: this.ont.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh ONT data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getOnt();
        });
    }
}
