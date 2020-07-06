import { Component, OnInit, Input } from "@angular/core";
import { Card } from "../../interfaces/card.interface";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { ActivatedRoute } from "@angular/router";
import { Port } from "../../interfaces/port.interface";

import Achorn from "achorn";
import { NzModalService } from "ng-zorro-antd/modal";
import { PortCreateComponent } from "../port-create/port-create.component";
const achorn = new Achorn();

@Component({
    selector: "app-card-visual",
    templateUrl: "./card-visual.component.html",
    styleUrls: ["./card-visual.component.css"],
})
export class CardVisualComponent implements OnInit {
    /**
     * Id of the parent device used to
     */
    public parentDeviceId: number;

    /**
     * Card object, either given as input or retrieved through the API
     */
    @Input("card") public card?: Card;
    @Input("cardId") public cardId?: number;

    /**
     * Request state of the Subrack if it has to be retrieved through the API
     */
    public cardRequest: RequestState = "idle";

    public portPairs: [Port, Port][] = [];

    constructor(private route: ActivatedRoute, private api: ApiService, private modal: NzModalService) {}

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

                this.getCard();
            } else {
                this.parsePorts();
            }
        });
    }

    /**
     * Get Card data
     */
    public getCard(): void {
        // Get Card data
        this.cardRequest = "pending";

        this.api.getCard(this.parentDeviceId, this.cardId || this.card.id).subscribe({
            next: (card) => {
                this.card = card;
                this.parsePorts();
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
     * Parse card ports into array of port pairs to display them
     */
    public parsePorts(): void {
        this.portPairs = [];
        for (let i = 0; i < Number(this.card.ppc); i++) {
            if (!(i % 2)) {
                this.portPairs.push([
                    this.card.ports[i] ? this.card.ports[i] : { id: null, operational_state: null },
                    this.card.ports[i + 1] ? this.card.ports[i + 1] : { id: null, operational_state: null },
                ]);
            }
        }
    }

    /**
     * Open a Modal where the User can create new Ports
     */
    public openCreatePortsModal() {
        const modal = this.modal.create({
            nzTitle: "Create Ports",
            nzContent: PortCreateComponent,
            nzComponentParams: {
                parentDeviceId: this.parentDeviceId,
                card: this.card,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Subrack data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getCard();
        });
    }
}
