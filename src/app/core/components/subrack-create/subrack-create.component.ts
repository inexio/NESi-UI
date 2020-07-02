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
     * Array of Subrack batches to create
     */
    public batches: { name: string; description: string }[][] = [];

    /**
     * Number of how many Subracks in current batch
     */
    public createCount: number = 1;

    /**
     * Single Subrack form
     */
    public subrackForm: {
        name: string;
        description: string;
    } = {
        name: "",
        description: "",
    };

    /**
     * Subrack creation Request State
     */
    public createSubracksRequest: RequestState = "idle";

    constructor(private api: ApiService, private modal: NzModalRef) {}

    /**
     * Multiplies subrackForm by createCount and pushes it to Batches array
     */
    public addBatch(): void {
        // Add batch to batches array
        const batch = [];
        for (let i = 0; i < this.createCount; i++) {
            batch.push(this.subrackForm);
        }

        this.batches.push(batch);

        // Reset Form
        this.createCount = 1;
        this.subrackForm = {
            name: "",
            description: "",
        };
    }

    /**
     * Removes batch at given index
     * @param index Index to remove batch at
     */
    public removeBatch(index: number): void {
        this.batches.splice(index, 1);
    }

    /**
     * Http Request to create Subracks
     */
    public createSubracks(): void {
        let subracks = [];
        this.batches.map((batch) => {
            subracks = subracks.concat(batch);
        });

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

    /**
     * Close modal
     */
    public cancel(): void {
        this.modal.destroy();
    }
}
