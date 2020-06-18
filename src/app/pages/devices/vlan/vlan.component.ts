import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { Vlan } from "../../../core/interfaces/Vlan.interface";

@Component({
    selector: "app-vlan",
    templateUrl: "./vlan.component.html",
    styleUrls: ["./vlan.component.css"],
})
export class VlanComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
    ) {}

    /**
     * Vlan data and Vlan data request
     */
    public vlan: Vlan;
    public vlanRequest: RequestState = "idle";

    /**
     * Vlans connections data and Vlan connections data request
     */
    public vlanConnections: { id: number }[];
    public vlanConnectionsRequest: RequestState = "idle";

    /**
     * Array of Vlan attributes to display
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
             * Get Vlan data
             */
            this.vlanRequest = "pending";
            this.api.getVlan(params.id, params.vlan).subscribe({
                next: (vlan) => {
                    this.vlan = vlan;

                    /**
                     * Iterate over Vlan Connection arguments and parse them into array
                     */
                    Object.keys(vlan).map((key) => {
                        if (["_links", "box", "box_id", "id"].includes(key)) return;
                        this.attributes.push({
                            key,
                            value: vlan[key],
                        });
                    });

                    this.vlanRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.vlanRequest = "error";
                },
            });

            this.vlanConnectionsRequest = "pending";
            this.api.getVlanConnections(params.id, params.port).subscribe({
                next: (vlanConnections) => {
                    this.vlanConnections = vlanConnections;
                    this.vlanConnectionsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.vlanConnectionsRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId]);
    }
}
