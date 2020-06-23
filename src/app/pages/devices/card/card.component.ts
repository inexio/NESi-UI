import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Card } from "../../../core/interfaces/card.interface";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { CoreService } from "../../../core/services/core/core.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";
import { stringify } from "querystring";

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
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
    public parentDeviceId: string;

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
        this.api.getCard(this.parentDeviceId, this.cardId).subscribe({
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
                console.error(error);
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

    /**
     * Open a modal where a specific property can be edited
     * @param key Key of the property to edit
     * @param initialValue Current value of the property to edit
     */
    public editProperty(key: string, initialValue: any) {
        const modal = this.modal.create({
            nzTitle: "Edit Property",
            nzContent: EditPropertyComponent,
            nzComponentParams: {
                key,
                initialValue,
                objectType: "cards",
                deviceId: Number(this.parentDeviceId),
                objectId: this.card.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Card data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getCard();
        });
    }
}
