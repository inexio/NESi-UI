import { Component, OnInit, Input } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";

@Component({
    selector: "app-port-visual",
    templateUrl: "./port-visual.component.html",
    styleUrls: ["./port-visual.component.css"],
})
export class PortVisualComponent implements OnInit {
    @Input("parentDevice") public parentDevice: string;
    @Input("portId") public portId: string;

    @Input("onts") public onts: { [key: string]: any }[] = [];
    public ontsRequest: RequestState = "idle";

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        this.ontsRequest = "pending";
        this.api.getOnts(this.parentDevice, this.portId).subscribe({
            next: (onts) => {
                this.onts = [onts[0], onts[0]];
                this.ontsRequest = "success";
            },
            error: (error) => {
                console.error(error);
                this.ontsRequest = "error";
            },
        });
    }
}
