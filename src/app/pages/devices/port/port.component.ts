import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";

@Component({
    selector: "app-port",
    templateUrl: "./port.component.html",
    styleUrls: ["./port.component.css"],
})
export class PortComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
    ) {}

    /**
     * Port data and Port data request
     */
    public port: Port;
    public portRequest: RequestState = "idle";

    /**
     * Port data and Port data request
     */
    public onts: { id: string }[];
    public ontsRequest: RequestState = "idle";

    /**
     * Array of Port attributes to display
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
             * Get Port data
             */
            this.portRequest = "pending";
            this.api.getPort(params.id, params.port).subscribe({
                next: (port) => {
                    this.port = port;

                    /**
                     * Iterate over Port arguments and parse them into array
                     */
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

            this.ontsRequest = "pending";
            this.api.getOnts(params.id, params.port).subscribe({
                next: (onts) => {
                    this.onts = onts;
                    this.ontsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.ontsRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "card", this.port.card_id]);
    }
}
