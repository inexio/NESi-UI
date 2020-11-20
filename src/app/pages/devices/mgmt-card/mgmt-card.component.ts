import { Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";
import { PortCreateComponent } from "../../../core/components/port-create/port-create.component";
import { Card } from "../../../core/interfaces/card.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { ApiService } from "../../../core/services/api/api.service";
import { CoreService } from "../../../core/services/core/core.service";

@Component({
    selector: "app-mgmt-card",
    templateUrl: "./mgmt-card.component.html",
    styleUrls: ["./mgmt-card.component.css"],
})
export class MgmtCardComponent implements OnInit {
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
     * Id of the parent device
     */
    public parentDeviceId: number;

    /**
     * Id of the Card
     */
    public cardId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    constructor(
        public api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store Id of parent device and Card
            this.parentDeviceId = params.id;
            this.cardId = params.card;

            // Get Card data
            this.getCard();
        });
    }

    /**
     * Get Card data
     */
    public getCard(): void {
        this.cardRequest = "pending";
        this.api.getManagementCard(this.parentDeviceId, this.card ? this.card.id : this.cardId).subscribe({
            next: (card) => {
                this.card = card;

                this.attributes = [];
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
                // @ts-ignore
                achorn.error(error);
                this.cardRequest = "error";
            },
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
