import { Component, OnInit } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Card } from "../../interfaces/card.interface";

@Component({
    selector: "app-port-create",
    templateUrl: "./port-create.component.html",
    styleUrls: ["./port-create.component.css"],
})
export class PortCreateComponent {
    /**
     * Id of the parent Device which will hold the Ports
     */
    public parentDeviceId: number;

    /**
     * Number of Ports to add to current batch
     */
    public createCount: number = 1;

    /**
     * Card object containing max number of Ports and how many Ports already exist
     */
    public card: Card;

    /**
     * Single Port form
     */
    public portForm: {
        description: string;
    } = {
        description: "",
    };

    /**
     * Returns the number of how many ports are available to create
     */
    public get availablePorts(): number {
        return this.card.ppc - this.card.ports.length;
    }

    /**
     * Port creation Request State
     */
    public createPortsRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create Ports
     */
    public createPorts(): void {
        let ports = [];
        for (let i = 0; i < this.createCount; i++) {
            ports.push({
                description: this.portForm.description,
                card_id: this.card.id,
            });
        }

        this.createPortsRequest = "pending";
        this.api.createPorts(this.parentDeviceId, this.card.id, ports).subscribe({
            next: () => {
                this.createPortsRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createPortsRequest = "pending";
            },
        });
    }
}
