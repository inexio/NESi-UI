import { Component, OnInit, NgZone } from "@angular/core";
import { ApiService } from "../../../core/services/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestState } from "../../../core/interfaces/request-state.type";
import { Subrack } from "../../../core/interfaces/subrack.interface";
import { CoreService } from "../../../core/services/core/core.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { EditPropertyComponent } from "../../../core/components/edit-property/edit-property.component";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-subrack",
    templateUrl: "./subrack.component.html",
    styleUrls: ["./subrack.component.css"],
})
export class SubrackComponent implements OnInit {
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
    public subrack: Subrack;
    public subrackRequest: RequestState = "idle";

    /**
     * Id of the parent device
     */
    public parentDeviceId: string;

    /**
     * Id of the Subrack
     */
    public subrackId: string;

    /**
     * Boolean if header is "affixed"
     */
    public isAffixed: boolean = false;

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // Store parent device id and Subrack id
            this.parentDeviceId = params.id;
            this.subrackId = params.subrack;

            // Get Subrack data
            this.getSubrack();
        });
    }

    /**
     * Get Subrack data
     */
    public getSubrack(): void {
        this.subrackRequest = "pending";
        this.api.getSubrack(Number(this.parentDeviceId), Number(this.subrackId)).subscribe({
            next: (subrack) => {
                this.subrack = subrack;
                this.subrackRequest = "success";
            },
            error: (error) => {
                // @ts-ignore
                achorn.error(error);
                this.subrackRequest = "error";
            },
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
     * Open a modal where a specific property can be edited
     * @param key Key of the property to edit
     * @param initialValue Current value of the property to edit
     */
    public editProperty(key: string, initialValue: any) {
        const modal = this.modal.create({
            nzTitle: "Edit Property",
            nzContent: EditPropertyComponent,
            nzComponentParams: {
                key,
                initialValue,
                objectType: "subracks",
                deviceId: Number(this.parentDeviceId),
                objectId: this.subrack.id,
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzCancelDisabled: true,
        });

        // Refresh Subrack data after Property was edited
        modal.afterClose.subscribe(() => {
            this.getSubrack();
        });
    }
}
