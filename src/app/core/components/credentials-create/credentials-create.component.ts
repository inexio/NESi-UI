import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { NzModalRef } from "ng-zorro-antd/modal";

@Component({
    selector: "app-credentials-create",
    templateUrl: "./credentials-create.component.html",
    styleUrls: ["./credentials-create.component.css"],
})
export class CredentialsCreateComponent {
    /**
     * Id of the parent Device which will hold the User
     */
    public deviceId: number | string;

    /**
     * Name of the parent User which will hold the Credentials
     */
    public userName: string;

    /**
     * Id of the parent User which will hold the Credentials
     */
    public userId: number | string;

    /**
     * Single Credentials form
     */
    public credentialsForm: {
        username: string;
        password: string;
    } = {
        username: "",
        password: "",
    };

    /**
     * Credentials creation Request State
     */
    public createCredentialsRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create Subracks
     */
    public createCredentials(): void {
        this.createCredentialsRequest = "pending";
        this.api.createCredentials(this.deviceId, this.userId, this.credentialsForm).subscribe({
            next: () => {
                this.createCredentialsRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createCredentialsRequest = "pending";
            },
        });
    }
}
