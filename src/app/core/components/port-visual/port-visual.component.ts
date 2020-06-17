import { Component, OnInit, Input } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { Subrack } from "../../interfaces/subrack.interface";
import { Port } from "../../interfaces/port.interface";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-port-visual",
    templateUrl: "./port-visual.component.html",
    styleUrls: ["./port-visual.component.css"],
})
export class PortVisualComponent implements OnInit {
    /**
     * Id of the parent device used for routing and requesting Port data
     */
    public parentDeviceId: number | string;

    /**
     * Port object, either given as input or retrieved through the API
     */
    @Input("port") public port?: Port;
    @Input("portId") public portId?: number | string;

    /**
     * Request state of the Subrack if it has to be retrieved through the API
     */
    public portRequest: RequestState = "idle";

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit(): void {
        // Get id of parent device from route
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Port if none is given
            if (!this.port) {
                // Throw error if either parentDeviceId or subrackId are missing
                if (!this.parentDeviceId || !this.portId) {
                    throw new Error("Missing `parentDeviceId` or `portId` which are needed to request Port data");
                }

                // Get Port data
                this.portRequest = "pending";
                this.api.getPort(this.parentDeviceId, this.portId).subscribe({
                    next: (port) => {
                        this.port = port;
                        this.portRequest = "success";
                    },
                    error: (error) => {
                        console.error(error);
                        this.portRequest = "error";
                    },
                });
            }
        });
    }
}
