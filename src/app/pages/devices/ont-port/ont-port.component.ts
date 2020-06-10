import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";

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
    ) {}

    /**
     * ONT Port data and Ont Port data request
     */
    public ontPort: Port;
    public ontPortRequest: RequestState = "idle";

    /**
     * CPEs and CPEs Request
     */
    public cpes: { id: string }[];
    public cpesRequest: RequestState = "idle";

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
             * Get ONT Port data
             */
            this.ontPortRequest = "pending";
            this.api.getOntPort(params.id, params.ontPort).subscribe({
                next: (ontPort) => {
                    this.ontPort = ontPort;

                    /**
                     * Iterate over object and parse attributes into array
                     */
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
                    console.error(error);
                    this.ontPortRequest = "error";
                },
            });

            /**
             * Get Ids of CPEs
             */
            this.cpesRequest = "pending";
            this.api.getCpes(params.id, params.ontPort).subscribe({
                next: (cpes) => {
                    this.cpes = cpes;
                    this.cpesRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.cpesRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "ont", this.ontPort.ont_id]);
    }
}
