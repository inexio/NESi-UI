import { Component, OnInit } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { RequestState } from "../../interfaces/request-state.type";
import { ApiService } from "../../services/api/api.service";

@Component({
    selector: "app-user-create",
    templateUrl: "./user-create.component.html",
    styleUrls: ["./user-create.component.css"],
})
export class UserCreateComponent {
    /**
     * Id of the parent Device which will hold the User
     */
    public deviceId: number;

    /**
     * Name of the parent Device which will hold the User
     */
    public deviceName: string;

    /**
     * Single User form
     */
    public userForm: {
        name: string;
        profile: "root" | "admin" | "operator" | "commonuser";
        level: "Super" | "Admin" | "Operator" | "User";
    } = {
        name: "",
        profile: "commonuser",
        level: "User",
    };

    /**
     * User creation Request State
     */
    public createUserRequest: RequestState = "idle";

    constructor(private api: ApiService, public modal: NzModalRef) {}

    /**
     * Http Request to create Subracks
     */
    public createUser(): void {
        this.createUserRequest = "pending";
        this.api.createUser(this.deviceId, this.userForm).subscribe({
            next: () => {
                this.createUserRequest = "success";
                this.modal.close();
            },
            error: () => {
                this.createUserRequest = "pending";
            },
        });
    }
}
