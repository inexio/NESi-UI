import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";

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
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            /**
             * Get CPE Port data
             */
            this.cpePortRequest = "pending";
            this.api.getCpePort(params.id, params.ontPort).subscribe({
                next: (cpePort) => {
                    this.cpePort = cpePort;

                    /**
                     * Iterate over object and parse attributes into array
                     */
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
                    console.error(error);
                    this.cpePortRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "cpe", this.cpePort.cpe_id]);
    }
}
