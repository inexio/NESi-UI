import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Port } from "../../interfaces/port.interface";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";

@Component({
    selector: "app-mgmt-port-visual",
    templateUrl: "./mgmt-port-visual.component.html",
    styleUrls: ["./mgmt-port-visual.component.css"],
})
export class MgmtPortVisualComponent implements OnInit {
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
                this.api.getManagementPort(this.parentDeviceId, this.portId).subscribe({
                    next: (port) => {
                        this.port = port;
                        this.portRequest = "success";
                    },
                    error: (error) => {
                        // @ts-ignore
                        achorn.error(error);
                        this.portRequest = "error";
                    },
                });
            }
        });
    }
}
