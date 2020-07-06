import { Component, OnInit } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Card } from "../../interfaces/card.interface";

@Component({
    selector: "app-card-create",
    templateUrl: "./card-create.component.html",
    styleUrls: ["./card-create.component.css"],
})
export class CardCreateComponent {
    /**
     * Id of the parent Device which will hold the Cards
     */
    public parentDeviceId: number;

    /**
     * Id of the Subrack to add the Cards to
     */
    public subrackId: number;

    /**
     * Name of the Subrack to add the Cards to
     */
    public subrackName: string;

    /**
     * Number of Cards to add to current batch
     */
    public createCount: number = 1;

    /**
     * Single Card form
     */
    public cardForm: {
        description: string;
    } = {
        description: "",
    };

    /**
     * Cards creation Request State
     */
    public createCardsRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create Cards
     */
    public createCards(): void {
        let cards = [];
        for (let i = 0; i < this.createCount; i++) {
            cards.push({
                description: this.cardForm.description,
                subrack_id: this.subrackId,
            });
        }

        this.createCardsRequest = "pending";
        this.api.createCards(this.parentDeviceId, this.subrackId, cards).subscribe({
            next: () => {
                this.createCardsRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createCardsRequest = "pending";
            },
        });
    }
}
