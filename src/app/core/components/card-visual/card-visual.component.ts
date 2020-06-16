import { Component, OnInit, Input } from "@angular/core";
import { Card } from "../../interfaces/card.interface";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { Port } from "../../interfaces/port.interface";
import { zip } from "rxjs";

@Component({
    selector: "app-card-visual",
    templateUrl: "./card-visual.component.html",
    styleUrls: ["./card-visual.component.css"],
})
export class CardVisualComponent implements OnInit {
    @Input("parentDevice") public parentDevice: string;
    @Input("cardId") public cardId: string;

    @Input("card") public card: Card;
    public cardRequest: RequestState = "idle";

    @Input("ports") public ports: Port[];
    public portsRequest: RequestState = "idle";

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        if (!this.card && this.cardId) {
            this.cardRequest = "pending";
            this.api.getCard(this.parentDevice, this.cardId).subscribe({
                next: (card) => {
                    this.card = card;
                    this.card.maxPorts = 32; // TODO: Remove
                    this.cardRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.cardRequest = "error";
                },
            });
        }

        if (!this.ports && ((this.card && this.card.id) || this.cardId)) {
            this.portsRequest = "pending";
            this.api.getPorts(this.parentDevice, (this.card && this.card.id) || this.cardId).subscribe({
                next: (ports) => {
                    this.ports = ports;
                    this.portsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.portsRequest = error;
                },
            });
        }
    }
}
