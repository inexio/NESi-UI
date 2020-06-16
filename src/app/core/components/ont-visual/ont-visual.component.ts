import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";

@Component({
    selector: "app-ont-visual",
    templateUrl: "./ont-visual.component.html",
    styleUrls: ["./ont-visual.component.css"],
})
export class OntVisualComponent implements OnInit {
    @Input("parentDevice") public parentDevice: string;
    @Input("ontId") public ontId: string;

    @Input("ontPorts") public ontPorts: { [key: string]: any }[] = [];
    public ontPortsRequest: RequestState = "idle";

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        this.ontPortsRequest = "pending";
        this.api.getOntPorts(this.parentDevice, this.ontId).subscribe({
            next: (ontPorts) => {
                this.ontPorts = ontPorts;
                this.ontPortsRequest = "success";
            },
            error: (error) => {
                console.error(error);
                this.ontPortsRequest = "error";
            },
        });
    }
}
