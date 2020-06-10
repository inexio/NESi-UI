import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Card } from "../../../core/interfaces/card.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { CoreService } from "../../../core/services/core/core.service";

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
    constructor(
        public api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
    ) {}

    /**
     * Card data and Card data request status
     */
    public card: Card;
    public cardRequest: RequestState = "idle";

    /**
     * Array of Card attributes to display
     */
    public attributes: { key: string; value: string }[] = [];

    /**
     * Array of Ports and Ports request status
     */
    public ports: { id: string }[] = [];
    public portsRequest: RequestState = "idle";

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
             * Get Card data
             */
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

            /**
             * Get Ports
             */
            this.portsRequest = "pending";
            this.api.getPorts(params.id, params.card).subscribe({
                next: (ports) => {
                    this.ports = ports;
                    this.portsRequest = "success";
                },
                error: (error) => {
                    console.error(error);
                    this.portsRequest = "error";
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
        this.router.navigate(["/devices", this.parentDeviceId, "subrack", this.card.subrack_id]);
    }
}
