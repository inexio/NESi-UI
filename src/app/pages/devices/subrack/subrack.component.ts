import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { Subrack } from "../../../core/interfaces/subrack.interface";
import { CoreService } from "../../../core/services/core/core.service";

@Component({
    selector: "app-subrack",
    templateUrl: "./subrack.component.html",
    styleUrls: ["./subrack.component.css"],
})
export class SubrackComponent implements OnInit {
    constructor(
        public api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
    ) {}

    /**
     * Subrack data and Subrack data request status
     */
    public subrack: Subrack;
    public subrackRequest: RequestState = "idle";

    /**
     * Card Ids and Cards request status
     */
    public cards: { id: number }[] = [];
    public cardsRequest: RequestState = "idle";

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.parentDeviceId = params.id;

            /**
             * Get Subrack data
             */
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

            /**
             * Get Cards data
             */
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

    /**
     * Event handler called when affix state changes
     * @param value Boolean if affix is affixed
     */
    public affixEvent(value: boolean) {
        this.isAffixed = value;
        this.zone.run(() => {});
    }

    /**
     * Method used to navigate one layer up
     */
    public navigateUp(): void {
        this.router.navigate(["/devices", this.parentDeviceId]);
    }
}
