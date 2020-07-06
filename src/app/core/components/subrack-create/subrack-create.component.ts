import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { NzModalRef } from "ng-zorro-antd/modal";

@Component({
    selector: "app-subrack-create",
    templateUrl: "./subrack-create.component.html",
    styleUrls: ["./subrack-create.component.css"],
})
export class SubrackCreateComponent {
    /**
     * Id of the parent Device which will hold the Subracks
     */
    public deviceId: number;

    /**
     * Name of the parent Device which will hold the Subracks
     */
    public deviceName: string;

    /**
     * Number of how many Subracks in current batch
     */
    public createCount: number = 1;

    /**
     * Single Subrack form
     */
    public subrackForm: {
        description: string;
    } = {
        description: "",
    };

    /**
     * Subrack creation Request State
     */
    public createSubracksRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create Subracks
     */
    public createSubracks(): void {
        let subracks = [];
        for (let i = 0; i < this.createCount; i++) {
            subracks.push(this.subrackForm);
        }

        this.createSubracksRequest = "pending";
        this.api.createSubracks(this.deviceId, subracks).subscribe({
            next: () => {
                this.createSubracksRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createSubracksRequest = "pending";
            },
        });
    }
}
