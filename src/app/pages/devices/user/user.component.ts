import { Component, NgZone, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { ApiService } from "../../../core/services/api/api.service";
import { CoreService } from "../../../core/services/core/core.service";

import Achorn from "achorn";
import { CredentialsCreateComponent } from "../../../core/components/credentials-create/credentials-create.component";
const achorn = new Achorn();

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
    constructor(
        public api: ApiService,
        private route: ActivatedRoute,
        public core: CoreService,
        private zone: NgZone,
        private router: Router,
        private modal: NzModalService,
    ) {}

    /**
     * Subrack data and Subrack data request status
     */
    public user: any;
    public userRequest: RequestState = "idle";

    /**
     * Id of the parent device
     */
    public parentDeviceId: number;

    /**
     * Id of the Subrack
     */
    public userId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    public updateUserLockStatusRequest: RequestState = "idle";

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and Subrack id
            this.parentDeviceId = params.id;
            this.userId = params.user;

            // Get Subrack data
            this.getUser();
        });
    }

    /**
     * Get User data
     */
    public getUser(): void {
        this.userRequest = "pending";
        this.api.getUser(Number(this.parentDeviceId), Number(this.userId)).subscribe({
            next: (user) => {
                this.user = user;
                this.userRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.userRequest = "error";
            },
        });
    }

    /**
     * Opens a Modal showing the Device login Credentials
     * @param credentialsModalContent TemplateRef of the Modal contents
     */
    public openCredentialsModal(credentialsModalContent: TemplateRef<any>): void {
        this.modal.create({
            nzTitle: "Device Credentials",
            nzContent: credentialsModalContent,
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });
    }

    /**
     * Event handler called when affix state changes
     * @param value Boolean if affix is affixed
     */
    public affixEvent(value: boolean) {
        this.isAffixed = value;
        this.zone.run(() => {});
    }

    /**
     * Method used to navigate one layer up
     */
    public navigateUp(): void {
        this.router.navigate(["/devices", this.parentDeviceId]);
    }

    /**
     * Update User locked status
     * @param lockStatus New locked status
     */
    public updateUserLockStatus(lockStatus: "locked" | "unlocked"): void {
        this.updateUserLockStatusRequest = "pending";

        this.api.updateUserLockStatus(this.parentDeviceId, this.userId, lockStatus).subscribe({
            next: () => {
                this.updateUserLockStatusRequest = "success";
                this.getUser();
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.updateUserLockStatusRequest = "error";
            },
        });
    }

    /**
     * Opens a modal where the user can create new Credentials
     */
    public openCreateCredentialsModal() {
        const modal = this.modal.create({
            nzTitle: "Create Credentials",
            nzContent: CredentialsCreateComponent,
            nzComponentParams: {
                deviceId: this.parentDeviceId,
                userName: this.user.name,
                userId: this.userId,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Subrack data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getUser();
        });
    }
}
