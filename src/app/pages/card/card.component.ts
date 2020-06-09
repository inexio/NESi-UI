import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../core/services/api/api.service";
import { ActivatedRoute } from "@angular/router";
import { Card } from "../../core/interfaces/card.interface";
import { RequestState } from "../../core/interfaces/request-state.type";

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
    constructor(public api: ApiService, private route: ActivatedRoute) {}

    public card: Card;
    public cardRequest: RequestState = "idle";

    public attributes: { key: string; value: string }[] = [];

    public cards: { id: string }[] = [];
    public cardsRequest: RequestState = "idle";

    public parentDeviceId: string;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Subrack
            this.cardRequest = "pending";
            this.api.getCard(params.id, params.card).subscribe({
                next: (card) => {
                    this.card = card;

                    Object.keys(card).map((key) => {
                        if (["_links", "box", "box_id", "id"].includes(key)) return;
                        this.attributes.push({
                            key,
                            value: card[key],
                        });
                    });

                    this.cardRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.cardRequest = "error";
                },
            });

            // // Get Cards
            // this.cardsRequest = "pending";
            // this.api.getCards(params.id, params.subrack).subscribe({
            //     next: (cards) => {
            //         this.cards = cards;
            //         this.cardsRequest = "success";
            //     },
            //     error: (error) => {
            //         console.error(error);
            //         this.cardsRequest = "error";
            //     },
            // });
        });
    }
}
