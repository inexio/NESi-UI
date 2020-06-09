import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../core/services/api/api.service";
import { ActivatedRoute } from "@angular/router";
import { RequestState } from "../../core/interfaces/request-state.type";
import { Subrack } from "../../core/interfaces/subrack.interface";

@Component({
    selector: "app-subrack",
    templateUrl: "./subrack.component.html",
    styleUrls: ["./subrack.component.css"],
})
export class SubrackComponent implements OnInit {
    constructor(public api: ApiService, private route: ActivatedRoute) {}

    public subrack: Subrack;
    public subrackRequest: RequestState = "idle";

    public cards: { id: string }[] = [];
    public cardsRequest: RequestState = "idle";

    public parentDeviceId: string;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            // Get Subrack
            this.subrackRequest = "pending";
            this.api.getSubrack(params.id, params.subrack).subscribe({
                next: (subrack) => {
                    this.subrack = subrack;
                    this.subrackRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.subrackRequest = "error";
                },
            });

            // Get Cards
            this.cardsRequest = "pending";
            this.api.getCards(params.id, params.subrack).subscribe({
                next: (cards) => {
                    this.cards = cards;
                    this.cardsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.cardsRequest = "error";
                },
            });
        });
    }
}
