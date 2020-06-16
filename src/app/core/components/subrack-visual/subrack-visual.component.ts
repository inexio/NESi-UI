import { Component, OnInit, Input } from "@angular/core";
import { Subrack } from "../../interfaces/subrack.interface";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { Card } from "../../interfaces/card.interface";

@Component({
    selector: "app-subrack-visual",
    templateUrl: "./subrack-visual.component.html",
    styleUrls: ["./subrack-visual.component.css"],
})
export class SubrackVisualComponent implements OnInit {
    @Input("parentDevice") public parentDevice: string;
    @Input("subrackId") public subrackId: string;

    @Input("cards") public cards: Card[];
    public cardsRequest: RequestState = "idle";

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        if (!this.cards && this.subrackId) {
            this.cardsRequest = "pending";
            this.api.getCards(this.parentDevice, this.subrackId).subscribe({
                next: (cards) => {
                    this.cards = cards;
                    this.cardsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.cardsRequest = "error";
                },
            });
        }
    }
}
