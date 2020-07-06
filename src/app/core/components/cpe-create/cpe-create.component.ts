import { Component } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { NzModalRef } from "ng-zorro-antd/modal";

@Component({
    selector: "app-cpe-create",
    templateUrl: "./cpe-create.component.html",
    styleUrls: ["./cpe-create.component.css"],
})
export class CpeCreateComponent {
    /**
     * Id of the parent Device holding the CPEs
     */
    public parentDeviceId: number;

    /**
     * Id of the ONT Port to add the CPEs to
     */
    public ontPortId: number;

    /**
     * Name of the ONT Port to add the CPEs to
     */
    public ontPortName: string;

    /**
     * Number of CPEs to add to current batch
     */
    public createCount: number = 1;

    /**
     * Single CPE form
     */
    public cpeForm: {
        description: string;
    } = {
        description: "",
    };

    /**
     * CPE creation Request State
     */
    public createCpesReqeust: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create CPEs
     */
    public createCpes(): void {
        let cpes = [];
        for (let i = 0; i < this.createCount; i++) {
            cpes.push({
                description: this.cpeForm.description,
                ont_port_id: this.ontPortId,
            });
        }

        this.createCpesReqeust = "pending";
        this.api.createCpes(this.parentDeviceId, this.ontPortId, cpes).subscribe({
            next: () => {
                this.createCpesReqeust = "success";
                this.modal.close();
            },
            error: () => {
                this.createCpesReqeust = "pending";
            },
        });
    }
}
