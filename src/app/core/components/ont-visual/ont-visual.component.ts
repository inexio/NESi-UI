import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { Ont } from "../../interfaces/ont.interface";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-ont-visual",
    templateUrl: "./ont-visual.component.html",
    styleUrls: ["./ont-visual.component.css"],
})
export class OntVisualComponent implements OnInit {
    /**
     * Id of the parent device used for routing and requesting Ont data
     */
    public parentDeviceId: number | string;

    /**
     * Port object, either given as input or retrieved through the API
     */
    @Input("ont") public ont?: Ont;
    @Input("ontId") public ontId?: number | string;

    /**
     * Request state of the Ont if it has to be retrieved through the API
     */
    public ontRequest: RequestState = "idle";

    /**
     * Array of parsed ports to display
     */
    public ports: any[] = [];

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit(): void {
        // Get id of parent device from route
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Ont if none is given
            if (!this.ont) {
                // Throw error if either parentDeviceId or subrackId are missing
                if (!this.parentDeviceId || !this.ontId) {
                    throw new Error("Missing `parentDeviceId` or `ontId` which are needed to request Ont data");
                }

                // Get Ont data
                this.ontRequest = "pending";
                this.api.getOnt(this.parentDeviceId, this.ontId).subscribe({
                    next: (ont) => {
                        this.ont = ont;
                        this.parsePorts();
                        this.ontRequest = "success";
                    },
                    error: (error) => {
                        console.error(error);
                        this.ontRequest = "error";
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
        for (let i = 0; i < Number(this.ont.ppc || 8); i++) {
            this.ports.push(this.ont.ont_ports[i] ? this.ont.ont_ports[i] : { id: null, opr_state: null });
        }
    }
}
