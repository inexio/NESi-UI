import { Component, OnInit } from "@angular/core";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";
import { NzModalRef } from "ng-zorro-antd/modal";

@Component({
    selector: "app-ont-create",
    templateUrl: "./ont-create.component.html",
    styleUrls: ["./ont-create.component.css"],
})
export class OntCreateComponent {
    /**
     * Id of the parent Device holding the ONTs
     */
    public parentDeviceId: number;

    /**
     * Id of the Port to add the ONTs to
     */
    public portId: number;

    /**
     * Name of the Port to add the ONTs to
     */
    public portName: string;

    /**
     * Number of ONTs to add to current batch
     */
    public createCount: number = 1;

    /**
     * Single ONT form
     */
    public ontForm: {
        description: string;
    } = {
        description: "",
    };

    /**
     * ONT creation Request State
     */
    public createOntsRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create ONTs
     */
    public createOnts(): void {
        let onts = [];
        for (let i = 0; i < this.createCount; i++) {
            onts.push({
                description: this.ontForm.description,
                port_id: this.portId,
            });
        }

        this.createOntsRequest = "pending";
        this.api.createOnts(this.parentDeviceId, this.portId, onts).subscribe({
            next: () => {
                this.createOntsRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createOntsRequest = "pending";
            },
        });
    }
}
