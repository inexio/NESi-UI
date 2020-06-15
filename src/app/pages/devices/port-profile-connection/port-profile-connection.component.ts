import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";

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
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            /**
             * Get Port Profile Connection Connection data
             */
            this.portProfileConnectionRequest = "pending";
            this.api.getPortProfileConnection(params.id, params.portProfileConnection).subscribe({
                next: (portProfileConnection) => {
                    this.portProfileConnection = portProfileConnection;

                    /**
                     * Iterate over object and parse attributes into array
                     */
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
}
