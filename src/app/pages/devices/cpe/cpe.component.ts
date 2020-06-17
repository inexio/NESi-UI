import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";

@Component({
    selector: "app-cpe",
    templateUrl: "./cpe.component.html",
    styleUrls: ["./cpe.component.css"],
})
export class CpeComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
    ) {}

    /**
     * CPE data and CPE data Request status
     */
    public cpe: Port;
    public cpeRequest: RequestState = "idle";

    /**
     * CPE Ports and CPE Ports request
     */
    public cpePorts: { id: string }[];
    public cpePortsRequest: RequestState = "idle";

    /**
     * Array of CPE attributes to display
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
             * Get CPE data
             */
            this.cpeRequest = "pending";
            this.api.getCpe(params.id, params.cpe).subscribe({
                next: (cpe) => {
                    this.cpe = cpe;

                    /**
                     * Iterate over object and parse attributes into array
                     */
                    Object.keys(cpe).map((key) => {
                        if (["_links", "box", "box_id", "id"].includes(key)) return;
                        this.attributes.push({
                            key,
                            value: cpe[key],
                        });
                    });

                    this.cpeRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.cpeRequest = "error";
                },
            });

            /**
             * Get CPE Ports
             */
            this.cpePortsRequest = "pending";
            this.api.getCpePorts(params.id, params.cpe).subscribe({
                next: (cpePorts) => {
                    this.cpePorts = cpePorts;
                    this.cpePortsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.cpePortsRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "ont-port", this.cpe.ont_port_id]);
    }
}
