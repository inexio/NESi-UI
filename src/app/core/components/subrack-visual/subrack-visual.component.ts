import { Component, OnInit, Input } from "@angular/core";
import { Subrack } from "../../interfaces/subrack.interface";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-subrack-visual",
    templateUrl: "./subrack-visual.component.html",
    styleUrls: ["./subrack-visual.component.css"],
})
export class SubrackVisualComponent implements OnInit {
    /**
     * Id of the parent device used for routing and requesting Subrack data
     */
    private parentDeviceId: string;

    /**
     * Subrack object, either given as input or retrieved through the API
     */
    @Input("subrack") public subrack?: Subrack;
    @Input("subrackId") public subrackId?: string;

    /**
     * Request state of the Subrack if it has to be retrieved through the API
     */
    public subrackRequest: RequestState = "idle";

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit(): void {
        // Get id of parent device from route
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Subrack if none is given
            if (!this.subrack) {
                // Throw error if either parentDeviceId or subrackId are missing
                if (!this.parentDeviceId || !this.subrackId) {
                    throw new Error("Missing `parentDeviceId` or `subrackId` which are needed to request Subrack data");
                }

                // Get Subrack data
                this.subrackRequest = "pending";
                this.api.getSubrack(this.parentDeviceId, this.subrackId).subscribe({
                    next: (subrack) => {
                        this.subrack = subrack;
                        this.subrackRequest = "success";
                    },
                    error: (error) => {
                        console.error(error);
                        this.subrackRequest = "error";
                    },
                });
            }
        });
    }
}
