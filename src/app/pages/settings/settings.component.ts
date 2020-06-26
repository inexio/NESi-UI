import { Component, OnInit } from "@angular/core";
import { buildInfo } from "../../../build";
import { AuthService } from "../../core/services/auth/auth.service";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
    /**
     * Import buildInfo
     */
    public build: any = buildInfo;

    constructor(public auth: AuthService, private modal: NzModalService) {}

    /**
     * Opens a Modal confirming removal of Credentials from localStorage
     */
    public confirmCredentialsRemoval(): void {
        this.modal.confirm({
            nzTitle: "Are you sure?",
            nzContent: "You will have to enter your API information again.",
            nzOkText: "Yes",
            nzOkType: "danger",
            nzOnOk: () => this.auth.removeCredentials(),
            nzCancelText: "No",
            nzAutofocus: null,
        });
    }

    ngOnInit(): void {}
}
