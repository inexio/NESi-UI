import { Component, OnInit, Input } from "@angular/core";
import { Cpe } from "../../interfaces/cpe.interface";
import { RequestState } from "../../interfaces/request-state.type";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../services/api/api.service";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-cpe-visual",
    templateUrl: "./cpe-visual.component.html",
    styleUrls: ["./cpe-visual.component.css"],
})
export class CpeVisualComponent implements OnInit {
    /**
     * Id of the parent device used for routing and requesting Cpe data
     */
    public parentDeviceId: number;

    /**
     * Cpe  object, either given as input or retrieved through the API
     */
    @Input("cpe") public cpe?: Cpe;
    @Input("cpeId") public cpeId?: number;

    /**
     * Request state of the Ont if it has to be retrieved through the API
     */
    public cpeRequest: RequestState = "idle";

    /**
     * Array of parsed ports to display
     */
    public ports: any[] = [];

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit(): void {
        // Get id of parent device from route
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Cpe if none is given
            if (!this.cpe) {
                // Throw error if either parentDeviceId or cpeId are missing
                if (!this.parentDeviceId || !this.cpeId) {
                    throw new Error("Missing `parentDeviceId` or `cpeId` which are needed to request Cpe data");
                }

                // Get Ont data
                this.cpeRequest = "pending";
                this.api.getCpe(this.parentDeviceId, this.cpeId).subscribe({
                    next: (cpe) => {
                        this.cpe = cpe;
                        this.parsePorts();
                        this.cpeRequest = "success";
                    },
                    error: (error) => {
                        // @ts-ignore
                        achorn.error(error);
                        this.cpeRequest = "error";
                    },
                });
            } else {
                this.parsePorts();
            }
        });
    }

    /**
     * Parse card ports into array of port pairs to display them
     */
    public parsePorts(): void {
        for (let i = 0; i < Number(this.cpe.ppc || 4); i++) {
            this.ports.push(this.cpe.cpe_ports[i] ? this.cpe.cpe_ports[i] : { id: null, operational_state: null });
        }
    }
}
