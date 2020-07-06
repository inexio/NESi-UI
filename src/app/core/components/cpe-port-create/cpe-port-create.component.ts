import { Component, OnInit } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Cpe } from "../../interfaces/cpe.interface";

@Component({
    selector: "app-cpe-port-create",
    templateUrl: "./cpe-port-create.component.html",
    styleUrls: ["./cpe-port-create.component.css"],
})
export class CpePortCreateComponent {
    /**
     * Id of the parent Device holding the ONT Ports
     */
    public parentDeviceId: number;

    /**
     * Number of CPE Ports to add to current batch
     */
    public createCount: number = 1;

    /**
     * CPE object containing number of maximum CPE Ports to create
     */
    public cpe: Cpe;

    /**
     * Single CPE Port form
     */
    public cpePortForm: {
        description: string;
    } = {
        description: "",
    };

    public get availablePorts(): number {
        return (this.cpe.ppc || 4) - this.cpe.cpe_ports.length;
    }

    /**
     * CPE Port creation Request State
     */
    public createOntPortsRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create CPE Ports
     */
    public createCpePorts(): void {
        let cpePorts = [];
        for (let i = 0; i < this.createCount; i++) {
            cpePorts.push({
                description: this.cpePortForm.description,
                cpe_id: this.cpe.id,
            });
        }

        this.createOntPortsRequest = "pending";
        this.api.createCpePorts(this.parentDeviceId, this.cpe.id, cpePorts).subscribe({
            next: () => {
                this.createOntPortsRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createOntPortsRequest = "pending";
            },
        });
    }
}
