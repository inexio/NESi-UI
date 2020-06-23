import { Component, OnInit, Input } from "@angular/core";
import { Card } from "../../interfaces/card.interface";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { ActivatedRoute } from "@angular/router";
import { Port } from "../../interfaces/port.interface";

@Component({
    selector: "app-card-visual",
    templateUrl: "./card-visual.component.html",
    styleUrls: ["./card-visual.component.css"],
})
export class CardVisualComponent implements OnInit {
    /**
     * Id of the parent device used to
     */
    public parentDeviceId: number | string;

    /**
     * Card object, either given as input or retrieved through the API
     */
    @Input("card") public card?: Card;
    @Input("cardId") public cardId?: number | string;

    /**
     * Request state of the Subrack if it has to be retrieved through the API
     */
    public cardRequest: RequestState = "idle";

    public portPairs: [Port, Port][] = [];

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit(): void {
        // Get id of parent device from route
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Subrack if none is given
            if (!this.card) {
                // Throw error if either parentDeviceId or subrackId are missing
                if (!this.parentDeviceId || !this.cardId) {
                    throw new Error("Missing `parentDeviceId` or `cardId` which are needed to request Card data");
                }

                // Get Subrack data
                this.cardRequest = "pending";
                this.api.getCard(this.parentDeviceId, this.cardId).subscribe({
                    next: (card) => {
                        this.card = card;
                        this.parsePorts();
                        this.cardRequest = "success";
                    },
                    error: (error) => {
                        console.error(error);
                        this.cardRequest = "error";
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
        for (let i = 0; i < Number(this.card.ppc); i++) {
            if (!(i % 2)) {
                this.portPairs.push([
                    this.card.ports[i] ? this.card.ports[i] : { id: null, opr_state: null },
                    this.card.ports[i + 1] ? this.card.ports[i + 1] : { id: null, opr_state: null },
                ]);
            }
        }
    }
}
