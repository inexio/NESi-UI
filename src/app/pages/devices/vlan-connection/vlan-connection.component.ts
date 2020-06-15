import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "../../../core/services/core/core.service";
import { Port } from "../../../core/interfaces/port.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";

@Component({
    selector: "app-vlan-connection",
    templateUrl: "./vlan-connection.component.html",
    styleUrls: ["./vlan-connection.component.css"],
})
export class VlanConnectionComponent implements OnInit {
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
    ) {}

    /**
     * Vlan Connection data and request
     */
    public vlanConnection: Port;
    public vlanConnectionRequest: RequestState = "idle";

    /**
     * Array of Vlan Connection attributes
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
             * Get Vlan Connection data
             */
            this.vlanConnectionRequest = "pending";
            this.api.getVlanConnection(params.id, params.vlanConnection).subscribe({
                next: (vlanConnection) => {
                    this.vlanConnection = vlanConnection;

                    /**
                     * Iterate over object and parse attributes into array
                     */
                    Object.keys(vlanConnection).map((key) => {
                        if (["_links", "box", "box_id", "id"].includes(key)) return;
                        this.attributes.push({
                            key,
                            value: vlanConnection[key],
                        });
                    });

                    this.vlanConnectionRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.vlanConnectionRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "vlan", this.vlanConnectionRequest.vlan_id]);
    }
}
