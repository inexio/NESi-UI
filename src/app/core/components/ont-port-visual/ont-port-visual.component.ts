import { Component, OnInit, Input } from "@angular/core";
import { Port } from "../../interfaces/port.interface";
import { RequestState } from "../../interfaces/request-state.type";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../services/api/api.service";

@Component({
    selector: "app-ont-port-visual",
    templateUrl: "./ont-port-visual.component.html",
    styleUrls: ["./ont-port-visual.component.css"],
})
export class OntPortVisualComponent implements OnInit {
    /**
     * Id of the parent device used for routing and requesting Ont Port data
     */
    public parentDeviceId: number | string;

    /**
     * Ont Port object, either given as input or retrieved through the API
     */
    @Input("ontPort") public ontPort?: Port;
    @Input("ontPortId") public ontPortId?: number | string;

    /**
     * Request state of the Subrack if it has to be retrieved through the API
     */
    public ontPortRequest: RequestState = "idle";

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit(): void {
        // Get id of parent device from route
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Ont Port if none is given
            if (!this.ontPort) {
                // Throw error if either parentDeviceId or subrackId are missing
                if (!this.parentDeviceId || !this.ontPortId) {
                    throw new Error("Missing `parentDeviceId` or `ontPortId` which are needed to request Port data");
                }

                // Get Ont Port data
                this.ontPortRequest = "pending";
                this.api.getOntPort(this.parentDeviceId, this.ontPortId).subscribe({
                    next: (ontPort) => {
                        this.ontPort = ontPort;
                        this.ontPortRequest = "success";
                    },
                    error: (error) => {
                        console.error(error);
                        this.ontPortRequest = "error";
                    },
                });
            }
        });
    }
}
