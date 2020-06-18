import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";

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
    ) {}

    /**
     * ONT data and Port data request
     */
    public ont: Port;
    public ontRequest: RequestState = "idle";

    /**
     * ONT Ports and ONT Ports request
     */
    public ontPorts: { id: number }[];
    public ontPortsRequest: RequestState = "idle";

    /**
     * Array of ONT attributes to display
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
             * Get ONT data
             */
            this.ontRequest = "pending";
            this.api.getOnt(params.id, params.ont).subscribe({
                next: (ont) => {
                    this.ont = ont;

                    /**
                     * Iterate over Port arguments and parse them into array
                     */
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

            /**
             * Get ONT Port Ids
             */
            this.ontPortsRequest = "pending";
            this.api.getOntPorts(params.id, params.ont).subscribe({
                next: (ports) => {
                    this.ontPorts = ports;
                    this.ontPortsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.ontPortsRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "port", this.ont.port_id]);
    }
}
