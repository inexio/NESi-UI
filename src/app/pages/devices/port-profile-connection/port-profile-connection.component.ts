import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";

@Component({
    selector: "app-port-profile-connection",
    templateUrl: "./port-profile-connection.component.html",
    styleUrls: ["./port-profile-connection.component.css"],
})
export class PortProfileConnectionComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * Port Profile Connection data and request
     */
    public portProfileConnection: Port;
    public portProfileConnectionRequest: RequestState = "idle";

    /**
     * Array of Port Profile Connection attributes
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the Port Profile Connection
     */
    public portProfileConnectionId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and Port Profile Connection id
            this.parentDeviceId = params.id;
            this.portProfileConnectionId = params.portProfileConnection;

            // Get Port Profile Connection data
            this.getPortProfileConnection();
        });
    }

    /**
     * Get Port Profile Conncetion data
     */
    public getPortProfileConnection(): void {
        this.portProfileConnectionRequest = "pending";
        this.api.getPortProfileConnection(Number(this.parentDeviceId), Number(this.portProfileConnectionId)).subscribe({
            next: (portProfileConnection) => {
                this.portProfileConnection = portProfileConnection;

                this.attributes = [];
                Object.keys(portProfileConnection).map((key) => {
                    if (["_links", "box", "box_id", "id"].includes(key)) return;
                    this.attributes.push({
                        key,
                        value: portProfileConnection[key],
                    });
                });

                this.portProfileConnectionRequest = "success";
            },
            error: (error) => {
                console.error(error);
                this.portProfileConnectionRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "port-profile", this.portProfileConnection.port_profile_id]);
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
                objectType: "port_profile_connections",
                deviceId: Number(this.parentDeviceId),
                objectId: this.portProfileConnection.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Port Profile Connection data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getPortProfileConnection();
        });
    }
}
