import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { RequestState } from "../../interfaces/request-state.type";
import { NzModalRef } from "ng-zorro-antd/modal";
import { delay } from "rxjs/operators";

import Achorn from "achorn";
const achorn = new Achorn();

@Component({
    selector: "app-edit-property",
    templateUrl: "./edit-property.component.html",
    styleUrls: ["./edit-property.component.css"],
})
export class EditPropertyComponent implements OnInit {
    /**
     * Key of the property to edit
     */
    public key: string;

    /**
     * Property value before changes
     */
    public initialValue: any;

    /**
     * New value binding
     */
    public value: any;

    /**
     * Id of the Device containing the object being edited
     */
    public deviceId: number;

    /**
     * Id of the object being edited
     */
    public objectId: number;

    /**
     * Type of the object being edited
     */
    public objectType:
        | "subracks"
        | "cards"
        | "ports"
        | "onts"
        | "ont_ports"
        | "cpes"
        | "cpe_ports"
        | "vlans"
        | "vlan_connections"
        | "port_profiles"
        | "port_profile_connections";

    public editRequest: RequestState = "idle";

    constructor(private api: ApiService, private modal: NzModalRef) {}

    ngOnInit(): void {
        // @ts-ignore
        achorn.info(this);
        this.value = this.initialValue;
    }

    /**
     * Submit edit, destroy modal on success
     */
    public editProperty(): void {
        this.editRequest = "pending";
        this.api
            .updateObjectProperty(this.deviceId, this.objectType, this.objectId, {
                [this.key]: this.value,
            })
            .pipe(delay(1000))
            .subscribe({
                next: () => {
                    this.editRequest = "success";
                    this.modal.close();
                },
                error: (error) => {
                    // @ts-ignore
                    achorn.error(error);
                    this.editRequest = "error";
                },
            });
    }

    /**
     * Cancel editing process, destroy modal
     */
    public cancel(): void {
        this.modal.destroy();
    }
}
